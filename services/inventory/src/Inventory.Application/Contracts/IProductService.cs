using Inventory.Application.Common.Models;
using Inventory.Application.DTOs;

namespace Inventory.Application.Contracts;

public interface IProductService
{
    Task<PaginatedResult<ProductDto>> GetProductsAsync(int pageNumber, int pageSize, string? search = null, CancellationToken cancellationToken = default);
}
