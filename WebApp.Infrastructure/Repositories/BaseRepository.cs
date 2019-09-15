namespace WebApp.Infrastructure.Repositories
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;

    using Microsoft.EntityFrameworkCore.ChangeTracking;

    using WebApp.Infrastructure.Data;

    public class BaseRepository<T>
            where T : class, new()
    {
        private readonly ApplicationDbContext context;

        public BaseRepository(ApplicationDbContext context)
        {
            this.context = context;
        }

        public virtual async Task<EntityEntry<T>> AddAsync(T entity)
        {
            this.context.Entry(entity);
            return await this.context.Set<T>().AddAsync(entity);
        }

        public async Task<int> SaveAsync()
        {
            return await this.context.SaveChangesAsync();
        }

        public virtual IQueryable<T> GetQuery()
        {
            return this.context.Set<T>();
        }

        public virtual void TryUpdateManyToMany<TKey>(
            IEnumerable<T> currentItems,
            IEnumerable<T> newItems,
            Func<T, TKey> getKey)
        {
            this.context.AddRemoveCollectionItems(currentItems, newItems, getKey);
        }
    }
}
