using Inventory.Application.DTOs;

namespace Inventory.Application.Contracts;

public interface IWarehouseService
{
    Task<IEnumerable<WarehouseDto>> GetWarehousesAsync();
}
