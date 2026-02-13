using Inventory.Application.Common.Models;
using Inventory.Application.DTOs;

namespace Inventory.Application.Contracts;

public interface IProductService
{
    Task<PaginatedResult<ProductDto>> GetProductsAsync(int pageNumber, int pageSize, string? search = null, string? category = null, ProductStockStatus? status = null, string? sortBy = null, bool? sortDescending = null, CancellationToken cancellationToken = default);
    Task<IEnumerable<string>> GetCategoriesAsync(CancellationToken cancellationToken = default);
    Task<ProductDetailDto?> GetProductByIdAsync(Guid id, CancellationToken cancellationToken = default);
}
