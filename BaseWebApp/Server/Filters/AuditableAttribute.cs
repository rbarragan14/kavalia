// --------------------------------------------------------------------------------------------------------------------
// <copyright file="AuditableAttribute.cs" company="">
//   
// </copyright>
// <summary>
//   Defines the AuditableAttribute type.
// </summary>
// --------------------------------------------------------------------------------------------------------------------

namespace BaseWebApp.Server.Filters
{
    using System;
    using System.Collections;
    using System.Collections.Generic;
    using System.ComponentModel;
    using System.ComponentModel.DataAnnotations;
    using System.Linq;
    using System.Text;
    using System.Text.RegularExpressions;
    using System.Threading;
    using System.Xml;

    using BaseWebApp.Server.Helpers;
    using BaseWebApp.Server.RestApi;

    using Microsoft.AspNetCore.Mvc;
    using Microsoft.AspNetCore.Mvc.Controllers;
    using Microsoft.AspNetCore.Mvc.Filters;

    using WebApp.Core.Entities.Security;
    using WebApp.Infrastructure.Repositories;

  /// <summary>
    /// The auditable attribute.
    /// </summary>
    public class AuditableAttribute : TypeFilterAttribute
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="AuditableAttribute"/> class.
        /// </summary>
        public AuditableAttribute()
            : base(typeof(AuditableAttributeImpl))
        {
//            this.Arguments = new object[] { ActionType.Select };
        }

        /// <summary>
        /// Initializes a new instance of the <see cref="AuditableAttribute"/> class.
        /// </summary>
        /// <param name="actionType">
        /// The action type.
        /// </param>
        //public AuditableAttribute(ActionType actionType)
        //    : base(typeof(AuditableAttributeImpl))
        //{
        //    this.Arguments = new object[] { actionType };
        //}

        /// <summary>
        /// The auditable attribute.
        /// </summary>
        private class AuditableAttributeImpl : IActionFilter
        {
            /// <summary>
            /// The unit of work.
            /// </summary>
            private readonly UnitOfWork unitOfWork;

            /// <summary>
            /// The action type.
            /// </summary>
            private readonly ActionType actionType;

            /// <summary>
            ///   The resource name.
            /// </summary>
            private string resourceName = string.Empty;

            /// <summary>
            /// Initializes a new instance of the <see cref="AuditableAttribute"/> class.
            /// </summary>
            public AuditableAttributeImpl(UnitOfWork unitOfWork)
            {
                this.unitOfWork = unitOfWork;
                this.actionType = ActionType.Select;
            }

            /// <summary>
            /// Initializes a new instance of the <see cref="AuditableAttribute"/> class.
            /// </summary>
            /// <param name="actionType">
            /// The action Type.
            /// </param>
            //public AuditableAttributeImpl(UnitOfWork unitOfWork, ActionType actionType)
            //{
            //    this.unitOfWork = unitOfWork;
            //    this.actionType = actionType;
            //}

            /// <summary>
            /// The on action executed.
            /// </summary>
            /// <param name="filterContext">
            /// The filter context.
            /// </param>
            public void OnActionExecuted(ActionExecutedContext filterContext)
            {
                if (!(filterContext.ActionDescriptor is ControllerActionDescriptor controllerActionDescriptor))
                {
                    return;
                }

                var attribute = (AuditIgnoreAttribute)controllerActionDescriptor.MethodInfo
                    .GetCustomAttributes(typeof(AuditIgnoreAttribute), false).FirstOrDefault();

                if (attribute != null)
                {
                    return;
                }

                if (this.actionType == ActionType.Select || this.actionType == ActionType.List
                                                         || this.actionType == ActionType.Approve
                                                         || this.actionType == ActionType.Reject)
                {
                    var controller = filterContext.Controller as ApiController;
                    object model = null;

                    if (filterContext.Result is ViewResult viewResult)
                    {
                        model = viewResult.Model;
                    }
                    else if (filterContext.Result is ObjectResult objectResult)
                    {
                        model = objectResult.Value;
                    }

                    /*
                    if (controller?.AuditModel != null)
                    {
                        model = controller.AuditModel;
                    }
                    else
                    */

                    this.RecordAudit(
                        controller,
                        controllerActionDescriptor,
                        filterContext.HttpContext.Connection.RemoteIpAddress.ToString(),
                        filterContext.HttpContext.User.Identity.Name,
                        model);
                }
            }

            /// <summary>
            /// The on action executing.
            /// </summary>
            /// <param name="filterContext">
            /// </param>
            public void OnActionExecuting(ActionExecutingContext filterContext)
            {
                if (!(filterContext.ActionDescriptor is ControllerActionDescriptor controllerActionDescriptor))
                {
                    return;
                }

                var attribute = (AuditIgnoreAttribute)controllerActionDescriptor.MethodInfo
                    .GetCustomAttributes(typeof(AuditIgnoreAttribute), false).FirstOrDefault();

                if (attribute != null)
                {
                    return;
                }

                if (this.actionType == ActionType.Create || this.actionType == ActionType.Delete
                                                         || this.actionType == ActionType.Update
                                                         || this.actionType == ActionType.Inquiry
                                                         || this.actionType == ActionType.ExecuteTask)
                {
                    var controller = filterContext.Controller as ApiController;
                    this.RecordAudit(
                        controller,
                        controllerActionDescriptor,
                        filterContext.HttpContext.Connection.RemoteIpAddress.ToString(),
                        filterContext.HttpContext.User.Identity.Name,
                        filterContext.ActionArguments);
                }
            }

            /// <summary>
            /// The get display name.
            /// </summary>
            /// <returns>
            /// The get display name.
            /// </returns>
            private string GetDisplayName(ControllerActionDescriptor actionDescriptor)
            {
                var description = actionDescriptor.ActionName;
                var attribute = (ActionDescriptionAttribute)actionDescriptor.MethodInfo
                    .GetCustomAttributes(typeof(ActionDescriptionAttribute), false).FirstOrDefault();

                if (attribute != null)
                {
                    description = attribute.ActionDescription;
                }

                return description;
            }

            /// <summary>
            /// The record audit.
            /// </summary>
            /// <param name="controller">
            /// The controller.
            /// </param>
            /// <param name="actionDescriptor">
            /// The action descriptor.
            /// </param>
            /// <param name="sourceAddress">
            /// The source address.
            /// </param>
            /// <param name="userId">
            /// The user id.
            /// </param>
            /// <param name="model">
            /// The model.
            /// </param>
            private void RecordAudit(ApiController controller, ControllerActionDescriptor controllerActionDescriptor, string sourceAddress, string userId, object model)
            {
                if (controller != null)
                {
                    if (string.IsNullOrEmpty(this.resourceName))
                    {
                        this.resourceName = string.Format(
                            "{0}_{1}",
                            controllerActionDescriptor.ControllerName,
                            controllerActionDescriptor.ActionName);
                    }

                    var actionDescription = this.GetDisplayName(controllerActionDescriptor);
                    var objectAsXml = string.Empty;

                    if (model != null)
                    {
                        objectAsXml = AuditSerializer.SerializeToXml(model);
                    }

                    var auditEntry = new AuditLog
                                         {
                                             ActionName = controllerActionDescriptor.ActionName,
                                             Controller = controllerActionDescriptor.ControllerName,
                                             Date = DateTime.Now,
                                             SourceAddress = sourceAddress,
                                             UserId = userId,
                                             ActionDescription = actionDescription,
                                             RelatedInformation = objectAsXml
                                         };

                    this.unitOfWork.AuditLogRepository.Add(auditEntry);
                    this.unitOfWork.Save();
                }
            }
        }
    }

    public class AuditSerializer
    {
        /// <summary>
        /// The max stack depth.
        /// </summary>
        private const int MaxStackDepth = 5;

        /// <summary>
        /// The serialize to xml.
        /// </summary>
        /// <param name="objectToSerialize">
        /// The object to serialize.
        /// </param>
        /// <typeparam name="T">
        /// </typeparam>
        /// <returns>
        /// The serialize to xml.
        /// </returns>
        public static string SerializeToXml<T>(T objectToSerialize)
        {
            var writerSettings = new XmlWriterSettings();
            writerSettings.Indent = false;

            try
            {
                var sb = new StringBuilder();
                var xw = XmlWriter.Create(sb, writerSettings);
                xw.WriteStartDocument();
                xw.WriteStartElement("AuditEntry");

                serializeInternal(xw, objectToSerialize, 0);

                xw.WriteEndElement();
                xw.WriteEndDocument();
                xw.Flush();

                return sb.ToString();
            }
            catch (Exception)
            {
                return string.Empty;
            }
        }

        /// <summary>
        /// The serialize internal.
        /// </summary>
        /// <param name="writer">
        /// The writer.
        /// </param>
        /// <param name="objectToSerialize">
        /// The object to serialize.
        /// </param>
        /// <param name="stackDepth">
        /// The stack depth.
        /// </param>
        /// <typeparam name="T">
        /// </typeparam>
        private static void serializeInternal<T>(XmlWriter writer, T objectToSerialize, int stackDepth)
        {
            var type = objectToSerialize.GetType();
            if (type.IsPrimitive || type == typeof(decimal) || type == typeof(string)
                || type == typeof(object) /* || type.BaseType == typeof(HttpPostedFileBase) */)
            {
                var auditableValue = AuditableValue(type, objectToSerialize, null);
                writer.WriteString(auditableValue);
            }
            else if (type.GetInterface(typeof(IEnumerable).FullName) != null)
            {
                foreach (var listValue in (IEnumerable)objectToSerialize)
                {
                    if (listValue == null)
                    {
                        continue;
                    }

                    object objectValue;
                    var listValueType = listValue.GetType();
                    string elementName;

                    if (listValueType.IsGenericType
                        && listValueType.GetGenericTypeDefinition() == typeof(KeyValuePair<,>))
                    {
                        dynamic keyValue = listValue;
                        if (keyValue.Value != null)
                        {
                            var keyValueType = keyValue.Value.GetType();
                            var displayNameAttribute = (DisplayNameAttribute)Attribute.GetCustomAttribute(
                                keyValueType,
                                typeof(DisplayNameAttribute));
                            elementName = displayNameAttribute?.DisplayName ?? keyValue.Key.ToString();
                            objectValue = keyValue.Value;
                        }
                        else
                        {
                            elementName = keyValue.Key.ToString();
                            objectValue = string.Empty;
                        }
                    }
                    else
                    {
                        var displayNameAttribute = (DisplayNameAttribute)Attribute.GetCustomAttribute(
                            listValueType,
                            typeof(DisplayNameAttribute));
                        elementName = displayNameAttribute?.DisplayName ?? listValue.GetType().Name;
                        elementName = FormatElementName(elementName);
                        objectValue = listValue;
                    }

                    writer.WriteStartElement(FormatElementName(elementName));
                    serializeInternal(writer, objectValue, stackDepth + 1);
                    writer.WriteEndElement();
                }
            }
            else
            {
                var properties = type.GetAllProperties();
                foreach (var propertyInfo in properties)
                {
                    var auditIgnoreAttribute = (AuditIgnoreAttribute)Attribute.GetCustomAttribute(
                        propertyInfo,
                        typeof(AuditIgnoreAttribute));

                    if (auditIgnoreAttribute == null && stackDepth < MaxStackDepth)
                    {
                        var value = propertyInfo.GetValue(objectToSerialize, null);
                        if (value != null)
                        {
                            Type valueType = value.GetType();

                            var displayNameAttribute = (DisplayNameAttribute)Attribute.GetCustomAttribute(
                                propertyInfo,
                                typeof(DisplayNameAttribute));

                            string elementName =
                                displayNameAttribute != null && displayNameAttribute.DisplayName != null
                                    ? displayNameAttribute.DisplayName
                                    : propertyInfo.Name;
                            elementName = FormatElementName(elementName);

                            writer.WriteStartElement(elementName);
                            if (propertyInfo.PropertyType.IsValueType || propertyInfo.PropertyType == typeof(string)
                                                                      || valueType == typeof(string)
                                                                      || propertyInfo.PropertyType == typeof(Type))
                            {
                                var dataTypeAttribute = (DataTypeAttribute)Attribute.GetCustomAttribute(
                                    propertyInfo,
                                    typeof(DataTypeAttribute));
                                var auditableValue = AuditableValue(
                                    propertyInfo.PropertyType,
                                    value,
                                    dataTypeAttribute);

                                writer.WriteString(auditableValue);
                            }
                            else
                            {
                                serializeInternal(writer, value, stackDepth + 1);
                            }

                            writer.WriteEndElement();
                        }
                    }
                }
            }
        }

        private static string AuditableValue(Type propertyType, object value, DataTypeAttribute dataTypeAttribute)
        {
            string auditableValue;
            if (propertyType == typeof(bool))
            {
                auditableValue = ((bool)value).ToString();
            }
            else if (propertyType.IsEnum)
            {
                auditableValue = value.ToString();
            }
            else if (propertyType == typeof(DateTime))
            {
                if (dataTypeAttribute != null && dataTypeAttribute.DataType == DataType.Date)
                {
                    auditableValue = ((DateTime)value).ToLongDateString();
                }
                else
                {
                    auditableValue = Convert.ToString(value, Thread.CurrentThread.CurrentUICulture);
                }
            }
            else if (propertyType == typeof(object))
            {
                auditableValue = Convert.ToString(value, Thread.CurrentThread.CurrentUICulture);
            }
            /*
            else if (propertyType.BaseType == typeof(HttpPostedFileBase))
            {
                auditableValue = ((HttpPostedFileBase)value).FileName;
            }
            */
            else
            {
                auditableValue = Convert.ToString(value, Thread.CurrentThread.CurrentUICulture);
            }

            return auditableValue;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="element"></param>
        /// <returns></returns>
        private static string FormatElementName(string element)
        {
            var rgx = new Regex("[^a-zA-Z0-9áéíóúñÁÉÍÓÚÑ -]");
            var replaced = rgx.Replace(element, string.Empty);
            rgx = new Regex("[ ]");

            return rgx.Replace(replaced, "_");
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="account"></param>
        /// <returns></returns>
        private static string MaskText(string account)
        {
            return account;
        }
    }

    [AttributeUsage(AttributeTargets.Property | AttributeTargets.Method)]
    public class AuditIgnoreAttribute : Attribute
    {
    }


    /// <summary>
    /// The action type.
    /// </summary>
    public enum ActionType : byte
    {
        /// <summary>
        /// The create.
        /// </summary>
        Create,

        /// <summary>
        /// The delete.
        /// </summary>
        Delete,

        /// <summary>
        /// The update.
        /// </summary>
        Update,

        /// <summary>
        /// The select.
        /// </summary>
        Select,

        /// <summary>
        /// The list.
        /// </summary>
        List,

        /// <summary>
        /// The approve.
        /// </summary>
        Approve,

        /// <summary>
        /// The reject.
        /// </summary>
        Reject,

        /// <summary>
        /// 
        /// </summary>
        Inquiry,

        /// <summary>
        /// Execute Task
        /// </summary>
        ExecuteTask
    }
}

