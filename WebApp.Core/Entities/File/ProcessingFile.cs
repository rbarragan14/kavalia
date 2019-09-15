// --------------------------------------------------------------------------------------------------------------------
// <copyright file="ProcessingFile.cs" company="">
//
// </copyright>
// <summary>
//   Defines the ProcessingFile type.
// </summary>
// --------------------------------------------------------------------------------------------------------------------

using System.ComponentModel.DataAnnotations;

namespace WebApp.Core.Entities.File
{
    public class ProcessingFile : IEntityBase
    {
        [Key]
        public int Id { get; set; }

        public string Name { get; set; }

        public string Path { get; set; }

        public ProcessingFileFormat Format { get; set; }

        public ProcessingFileType Type { get; set; }
    }
}
