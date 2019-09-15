// --------------------------------------------------------------------------------------------------------------------
// <copyright file="EntityBaseRepository.cs" company="">
//
// </copyright>
// <summary>
//   Defines the EntityBaseRepository type.
// </summary>
// --------------------------------------------------------------------------------------------------------------------

namespace WebApp.Infrastructure.Repositories
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel;
    using System.Linq;
    using System.Linq.Expressions;
    using System.Threading.Tasks;

    using Microsoft.EntityFrameworkCore;
    using Microsoft.EntityFrameworkCore.ChangeTracking;

    using WebApp.Core.Entities;
    using WebApp.Infrastructure.Data;

    /// <summary>
  /// The entity base repository.
  /// </summary>
  /// <typeparam name="T">
  /// </typeparam>
  public class EntityBaseRepository<T> : IEntityBaseRepository<T>
    where T : class, IEntityBase, new()
  {
    /// <summary>
    /// The _context.
    /// </summary>
    private readonly ApplicationDbContext context;

    /// <summary>
    /// Initializes a new instance of the <see cref="EntityBaseRepository{T}"/> class.
    /// </summary>
    /// <param name="context">
    /// The context.
    /// </param>
    public EntityBaseRepository(ApplicationDbContext context)
    {
      this.context = context;
    }

    /// <summary>
    /// The add.
    /// </summary>
    /// <param name="entity">
    /// The entity.
    /// </param>
    public virtual void Add(T entity)
    {
      this.context.Entry(entity);
      this.context.Set<T>().Add(entity);
    }

    /// <summary>
    /// The add async.
    /// </summary>
    /// <param name="entity">
    /// The entity.
    /// </param>
    public virtual async Task<EntityEntry<T>> AddAsync(T entity)
    {
      this.context.Entry(entity);
      return await this.context.Set<T>().AddAsync(entity);
    }

    /// <summary>
    /// The all including.
    /// </summary>
    /// <param name="includeProperties">
    /// The include properties.
    /// </param>
    /// <returns>
    /// The <see cref="IEnumerable"/>.
    /// </returns>
    public virtual IEnumerable<T> AllIncluding(params Expression<Func<T, object>>[] includeProperties)
    {
      IQueryable<T> query = this.context.Set<T>();
      foreach (var includeProperty in includeProperties)
      {
        query = query.Include(includeProperty);
      }

      return query.AsEnumerable();
    }

    /// <summary>
    /// The all including async.
    /// </summary>
    /// <param name="includeProperties">
    /// The include properties.
    /// </param>
    /// <returns>
    /// The <see cref="Task"/>.
    /// </returns>
    public virtual async Task<IEnumerable<T>> AllIncludingAsync(params Expression<Func<T, object>>[] includeProperties)
    {
      IQueryable<T> query = this.context.Set<T>();
      foreach (var includeProperty in includeProperties)
      {
        query = query.Include(includeProperty);
      }

      return await query.ToListAsync();
    }

    /// <summary>
    /// The commit.
    /// </summary>
    public virtual void Commit()
    {
      this.context.SaveChangesAsync();
    }

    /// <summary>
    /// The count async.
    /// </summary>
    /// <param name="predicate">
    /// The predicate.
    /// </param>
    /// <returns>
    /// The <see cref="Task"/>.
    /// </returns>
    public virtual async Task<int> CountAsync(Expression<Func<T, bool>> filter)
    {
      return await this.context.Set<T>().CountAsync(filter);
    }

    /// <summary>
    /// The delete.
    /// </summary>
    /// <param name="entity">
    /// The entity.
    /// </param>
    public virtual void Delete(T entity)
    {
      EntityEntry entityEntry = this.context.Entry(entity);
      entityEntry.State = EntityState.Deleted;
    }

    /// <summary>
    /// The edit.
    /// </summary>
    /// <param name="entity">
    /// The entity.
    /// </param>
    public virtual void Edit(T entity)
    {
      EntityEntry entityEntry = this.context.Entry(entity);
      entityEntry.State = EntityState.Modified;
    }

    /// <summary>
    /// The exists.
    /// </summary>
    /// <param name="entity">
    /// The entity.
    /// </param>
    /// <returns>
    /// The <see cref="bool"/>.
    /// </returns>
    public virtual bool Exists(T entity)
    {
      return this.context.Set<T>().Any(x => x.Id == entity.Id);
    }

      public virtual void Detach(T entity)
      {
          EntityEntry entityEntry = this.context.Entry(entity);
          entityEntry.State = EntityState.Detached;
      }

        /// <summary>
        /// The find by.
        /// </summary>
        /// <param name="predicate">
        /// The predicate.
        /// </param>
        /// <returns>
        /// The <see cref="IEnumerable"/>.
        /// </returns>
        public virtual IEnumerable<T> FindBy(Expression<Func<T, bool>> predicate)
    {
      return this.context.Set<T>().Where(predicate);
    }

    /// <summary>
    /// The find by async.
    /// </summary>
    /// <param name="predicate">
    /// The predicate.
    /// </param>
    /// <returns>
    /// The <see cref="Task"/>.
    /// </returns>
    public virtual async Task<IEnumerable<T>> FindByAsync(Expression<Func<T, bool>> predicate)
    {
      return await this.context.Set<T>().Where(predicate).ToListAsync();
    }

    /// <summary>
    /// The find by async.
    /// </summary>
    /// <param name="predicate">
    /// The predicate.
    /// </param>
    /// <param name="include">
    /// The include.
    /// </param>
    /// <returns>
    /// The <see cref="Task"/>.
    /// </returns>
    public virtual async Task<IEnumerable<T>> FindByAsync(
      Expression<Func<T, bool>> predicate,
      Expression<Func<T, object>> include)
    {
      return await this.context.Set<T>().Where(predicate).Include(include).ToListAsync();
    }

    /// <summary>
    /// The get all.
    /// </summary>
    /// <returns>
    /// The <see cref="IEnumerable"/>.
    /// </returns>
    public virtual IEnumerable<T> GetAll()
    {
      return this.context.Set<T>().AsEnumerable();
    }

    /// <summary>
    /// The get all async.
    /// </summary>
    /// <returns>
    /// The <see cref="Task"/>.
    /// </returns>
    public virtual async Task<IEnumerable<T>> GetAllAsync()
    {
      return await this.context.Set<T>().ToListAsync();
    }

    public virtual async Task<IEnumerable<T>> GetAllAsync(Expression<Func<T, object>>[] includePaths, params SortExpression<T>[] sortExpressions)
    {
      return await this.GetAsync(null, includePaths, null, null, sortExpressions);
    }

    public virtual async Task<IEnumerable<T>> GetAllAsync(params SortExpression<T>[] sortExpressions)
    {
      return await this.GetAsync(null, null, null, null, sortExpressions);
    }

    /// <summary>
    /// The get async.
    /// </summary>
    /// <param name="filter">
    /// The filter.
    /// </param>
    /// <param name="page">
    /// The page.
    /// </param>
    /// <param name="pageSize">
    /// The page size.
    /// </param>
    /// <param name="sortExpressions">
    /// The sort expressions.
    /// </param>
    /// <typeparam name="T">
    /// </typeparam>
    /// <returns>
    /// The <see cref="Task"/>.
    /// </returns>
    public virtual async Task<IEnumerable<T>> GetAsync(
      Expression<Func<T, bool>> filter,
      int page,
      int pageSize,
      params SortExpression<T>[] sortExpressions)
    {
      return await this.GetAsync(filter, null, page, pageSize, sortExpressions);
    }

    /// <summary>
    /// The get async.
    /// </summary>
    /// <param name="filter">
    /// The filter.
    /// </param>
    /// <param name="page">
    /// The page.
    /// </param>
    /// <param name="pageSize">
    /// The page size.
    /// </param>
    /// <typeparam name="T">
    /// </typeparam>
    /// <returns>
    /// The <see cref="Task"/>.
    /// </returns>
    public virtual async Task<IEnumerable<T>> GetAsync(Expression<Func<T, bool>> filter, int page, int pageSize)
    {
      return await this.GetAsync(filter, null, page, pageSize, null);
    }

    /// <summary>
    /// The get async.
    /// </summary>
    /// <param name="page">
    /// The page.
    /// </param>
    /// <param name="pageSize">
    /// The page size.
    /// </param>
    /// <returns>
    /// The <see cref="Task"/>.
    /// </returns>
    public virtual async Task<IEnumerable<T>> GetAsync(int page, int pageSize)
    {
      return await this.GetAsync(null, null, page, pageSize, null);
    }

    /// <summary>
    /// The get async.
    /// </summary>
    /// <param name="filter">
    /// The filter.
    /// </param>
    /// <param name="includePaths">
    /// The include paths.
    /// </param>
    /// <param name="sortExpressions">
    /// The sort expressions.
    /// </param>
    /// <typeparam name="T">
    /// </typeparam>
    /// <returns>
    /// The <see cref="Task"/>.
    /// </returns>
    public virtual async Task<IEnumerable<T>> GetAsync(
      Expression<Func<T, bool>> filter = null,
      Expression<Func<T, object>>[] includePaths = null,
      params SortExpression<T>[] sortExpressions)
    {
      return await this.GetAsync(filter, includePaths, null, null, sortExpressions);
    }

    /// <summary>
    /// The get async.
    /// </summary>
    /// <param name="filter">
    /// The filter.
    /// </param>
    /// <param name="includePaths">
    /// The include paths.
    /// </param>
    /// <param name="page">
    /// The page.
    /// </param>
    /// <param name="pageSize">
    /// The page size.
    /// </param>
    /// <param name="sortExpressions">
    /// The sort expressions.
    /// </param>
    /// <returns>
    /// The <see cref="Task"/>.
    /// </returns>
    public virtual async Task<IEnumerable<T>> GetAsync(
      Expression<Func<T, bool>> filter = null,
      Expression<Func<T, object>>[] includePaths = null,
      int? page = null,
      int? pageSize = null,
      params SortExpression<T>[] sortExpressions)
    {
      return await this.GetQuery(filter, includePaths, page, pageSize, sortExpressions).ToListAsync();
    }

    /// <summary>
    /// The get query.
    /// </summary>
    /// <param name="filter">
    /// The filter.
    /// </param>
    /// <param name="includePaths">
    /// The include paths.
    /// </param>
    /// <param name="page">
    /// The page.
    /// </param>
    /// <param name="pageSize">
    /// The page size.
    /// </param>
    /// <param name="sortExpressions">
    /// The sort expressions.
    /// </param>
    /// <returns>
    /// The <see cref="IQueryable"/>.
    /// </returns>
    public virtual IQueryable<T> GetQuery(
      Expression<Func<T, bool>> filter = null,
      Expression<Func<T, object>>[] includePaths = null,
      int? page = null,
      int? pageSize = null,
      params SortExpression<T>[] sortExpressions)
    {
      IQueryable<T> query = this.context.Set<T>();

      if (filter != null)
      {
        query = query.Where(filter);
      }

      if (includePaths != null)
      {
        foreach (var includePath in includePaths)
        {
          query = query.Include(includePath);
        }
      }

      if (sortExpressions != null && sortExpressions.Length > 0)
      {
        IOrderedQueryable<T> orderedQuery = null;
        foreach (var sortExpression in sortExpressions)
        {
          if (orderedQuery == null)
          {
            if (sortExpression.SortDirection == ListSortDirection.Ascending)
            {
              orderedQuery = query.OrderBy(sortExpression.SortBy);
            }
            else
            {
              orderedQuery = query.OrderByDescending(sortExpression.SortBy);
            }
          }
          else
          {
            if (sortExpression.SortDirection == ListSortDirection.Ascending)
            {
              orderedQuery = orderedQuery.ThenBy(sortExpression.SortBy);
            }
            else
            {
              orderedQuery = orderedQuery.ThenByDescending(sortExpression.SortBy);
            }
          }
        }

        query = page.HasValue ? orderedQuery.Skip(((int)page - 1) * pageSize.Value) : orderedQuery;
      }

      if (pageSize != null)
      {
        query = query.Take((int)pageSize);
      }

      return query;
    }

    /// <summary>
    /// The get single.
    /// </summary>
    /// <param name="id">
    /// The id.
    /// </param>
    /// <returns>
    /// The <see cref="T"/>.
    /// </returns>
    public T GetSingle(int id)
    {
      return this.context.Set<T>().FirstOrDefault(x => x.Id == id);
    }

    /// <summary>
    /// The get single.
    /// </summary>
    /// <param name="predicate">
    /// The predicate.
    /// </param>
    /// <returns>
    /// The <see cref="T"/>.
    /// </returns>
    public T GetSingle(Expression<Func<T, bool>> predicate)
    {
      return this.context.Set<T>().FirstOrDefault(predicate);
    }

    /// <summary>
    /// The get single.
    /// </summary>
    /// <param name="predicate">
    /// The predicate.
    /// </param>
    /// <param name="includeProperties">
    /// The include properties.
    /// </param>
    /// <returns>
    /// The <see cref="T"/>.
    /// </returns>
    public T GetSingle(Expression<Func<T, bool>> predicate, params Expression<Func<T, object>>[] includeProperties)
    {
      IQueryable<T> query = this.context.Set<T>();
      foreach (var includeProperty in includeProperties)
      {
        query = query.Include(includeProperty);
      }

      return query.Where(predicate).FirstOrDefault();
    }

    /// <summary>
    /// The get single async.
    /// </summary>
    /// <param name="id">
    /// The id.
    /// </param>
    /// <param name="includeProperties">
    /// The include properties.
    /// </param>
    /// <returns>
    /// The <see cref="Task"/>.
    /// </returns>
    public async Task<T> GetSingleAsync(int id, params Expression<Func<T, object>>[] includeProperties)
    {
      IQueryable<T> query = this.context.Set<T>();
      foreach (var includeProperty in includeProperties)
      {
        query = query.Include(includeProperty);
      }

      return await query.FirstOrDefaultAsync(e => e.Id == id);
    }

    /// <summary>
    /// The get single async.
    /// </summary>
    /// <param name="id">
    /// The id.
    /// </param>
    /// <returns>
    /// The <see cref="Task"/>.
    /// </returns>
    public async Task<T> GetSingleAsync(int id)
    {
      return await this.context.Set<T>().FirstOrDefaultAsync(e => e.Id == id);
    }

    /// <summary>
    /// The get single async.
    /// </summary>
    /// <param name="predicate">
    /// The predicate.
    /// </param>
    /// <returns>
    /// The <see cref="Task"/>.
    /// </returns>
    public Task<T> GetSingleAsync(Expression<Func<T, bool>> predicate)
    {
      return this.context.Set<T>().FirstOrDefaultAsync(predicate);
    }

    /// <summary>
    /// The get single async.
    /// </summary>
    /// <param name="predicate">
    /// The predicate.
    /// </param>
    /// <param name="includeProperties">
    /// The include properties.
    /// </param>
    /// <returns>
    /// The <see cref="Task"/>.
    /// </returns>
    public Task<T> GetSingleAsync(
      Expression<Func<T, bool>> predicate,
      params Expression<Func<T, object>>[] includeProperties)
    {
      IQueryable<T> query = this.context.Set<T>();
      foreach (var includeProperty in includeProperties)
      {
        query = query.Include(includeProperty);
      }

      return query.Where(predicate).FirstOrDefaultAsync();
    }

    /// <summary>
    /// The try update many to many.
    /// </summary>
    /// <param name="currentItems">
    /// The current items.
    /// </param>
    /// <param name="newItems">
    /// The new items.
    /// </param>
    /// <param name="getKey">
    /// The get key.
    /// </param>
    /// <typeparam name="TColl">
    /// </typeparam>
    /// <typeparam name="TKey">
    /// </typeparam>
    public virtual void AddRemoveCollectionItems<TColl, TKey>(
      IEnumerable<TColl> currentItems,
      IEnumerable<TColl> newItems,
      Func<TColl, TKey> getKey)
      where TColl : class
    {
      this.context.AddRemoveCollectionItems(currentItems, newItems, getKey);
    }

    /// <summary>
    /// The add remove update collection items.
    /// </summary>
    /// <param name="currentItems">
    /// The current items.
    /// </param>
    /// <param name="newItems">
    /// The new items.
    /// </param>
    /// <param name="getKey">
    /// The get key.
    /// </param>
    /// <param name="doh">
    /// The doh.
    /// </param>
    /// <typeparam name="TColl">
    /// </typeparam>
    /// <typeparam name="TKey">
    /// </typeparam>
    public virtual void AddRemoveUpdateCollectionItems<TColl, TKey>(
      IEnumerable<TColl> currentItems,
      IEnumerable<TColl> newItems,
      Func<TColl, TKey> getKey)
      where TColl : class, IEntityBaseEquatable<TColl>
    {
      this.context.AddRemoveUpdateCollectionItems(currentItems, newItems, getKey);
    }
  }

  /// <summary>
  /// The sort expression.
  /// </summary>
  /// <typeparam name="TEntity">
  /// </typeparam>
  public class SortExpression<TEntity>
    where TEntity : class
  {
    /// <summary>
    /// Initializes a new instance of the <see cref="SortExpression{TEntity}"/> class.
    /// </summary>
    /// <param name="sortBy">
    /// The sort by.
    /// </param>
    /// <param name="sortDirection">
    /// The sort direction.
    /// </param>
    public SortExpression(Expression<Func<TEntity, object>> sortBy, ListSortDirection sortDirection)
    {
      this.SortBy = sortBy;

      this.SortDirection = sortDirection;
    }

    public Expression<Func<TEntity, object>> SortBy { get; set; }

    public ListSortDirection SortDirection { get; set; }
  }
}
