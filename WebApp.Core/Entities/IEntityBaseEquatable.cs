namespace WebApp.Core.Entities
{
    using System;

    using WebApp.Core.Context;

    public interface IEntityBaseEquatable<T> : IEntityBase, IEquatable<T> where T : IEntityBase
    {
        void Update(T other, IModelContext modelContext);
    }
}
