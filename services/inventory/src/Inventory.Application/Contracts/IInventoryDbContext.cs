using Inventory.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Inventory.Application.Contracts;

public interface IInventoryDbContext
{
    DbSet<Product> Products { get; }
    DbSet<StockLevel> StockLevels { get; }
    DbSet<Warehouse> Warehouses { get; }
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
