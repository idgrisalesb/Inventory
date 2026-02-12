using Inventory.Application.Contracts;
using Inventory.Application.DTOs;
using Microsoft.EntityFrameworkCore;

namespace Inventory.Application.Services;

public class WarehouseService : IWarehouseService
{
    private readonly IWarehouseRepository _repository;

    public WarehouseService(IWarehouseRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<WarehouseDto>> GetWarehousesAsync()
    {
        return await _repository.GetQuery()
            .Select(w => new WarehouseDto
            {
                Id = w.Id,
                Name = w.Name,
                Location = w.Location,
                TotalItems = w.StockLevels.Sum(sl => sl.Quantity),
                TotalValue = w.StockLevels.Sum(sl => sl.Quantity * sl.Product.UnitPrice)
            })
            .ToListAsync();
    }
}
