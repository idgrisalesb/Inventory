using Inventory.Domain.Entities;

namespace Inventory.Application.Contracts;

public interface IWarehouseRepository
{
    IQueryable<Warehouse> GetQuery();
}
