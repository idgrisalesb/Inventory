using Inventory.Application.Contracts;
using Inventory.Domain.Entities;
using Inventory.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Inventory.Infrastructure.Repositories;

public class WarehouseRepository : IWarehouseRepository
{
    private readonly InventoryDbContext _context;

    public WarehouseRepository(InventoryDbContext context)
    {
        _context = context;
    }

    public IQueryable<Warehouse> GetQuery()
    {
        return _context.Warehouses
            .Include(w => w.StockLevels)
            .ThenInclude(sl => sl.Product);
    }
}
