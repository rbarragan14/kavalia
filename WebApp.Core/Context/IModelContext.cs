namespace WebApp.Core.Context
{
    using System;
    using System.Collections.Generic;
    using System.Text;

    using WebApp.Core.Entities;
    using WebApp.Core.Entities.Compensation;

    public interface IModelContext
    {
        void SetModified(object entry);

        void AddRemoveCollectionItems<T, TKey>(IEnumerable<T> currentItems, IEnumerable<T> newItems, Func<T, TKey> getKey) where T : class;

        void AddRemoveUpdateCollectionItems<T, TKey>(IEnumerable<T> currentItems, IEnumerable<T> newItems, Func<T, TKey> getKey) where T : class, IEntityBaseEquatable<T>;
    }
}
