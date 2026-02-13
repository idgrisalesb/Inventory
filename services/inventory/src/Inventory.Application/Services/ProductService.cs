using Microsoft.EntityFrameworkCore;
using Inventory.Application.Contracts;
using Inventory.Application.DTOs;
using Inventory.Application.Common.Models;

namespace Inventory.Application.Services;

public class ProductService : IProductService
{
    private readonly IInventoryDbContext _context;

    public ProductService(IInventoryDbContext context)
    {
        _context = context;
    }

    public async Task<PaginatedResult<ProductDto>> GetProductsAsync(int pageNumber, int pageSize, string? search = null, CancellationToken cancellationToken = default)
    {
        if (pageNumber < 1) throw new ArgumentOutOfRangeException(nameof(pageNumber), "PageNumber must be greater than zero.");
        if (pageSize < 1) throw new ArgumentOutOfRangeException(nameof(pageSize), "PageSize must be greater than zero.");

        var query = _context.Products.AsNoTracking();

        if (!string.IsNullOrWhiteSpace(search))
        {
            // Case-insensitive search on Name or SKU
            var lowerSearch = search.Trim().ToLower();
            query = query.Where(p => p.Name.ToLower().Contains(lowerSearch) || p.Sku.ToLower().Contains(lowerSearch));
        }

        int totalCount = await query.CountAsync(cancellationToken);

        var items = await query
            .OrderBy(p => p.Name)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .Select(p => new ProductDto
            {
                Id = p.Id,
                Sku = p.Sku,
                Name = p.Name,
                Category = p.Category,
                StockStatus = p.StockLevels.Sum(sl => sl.Quantity) == 0 ? ProductStockStatus.OutOfStock :
                              p.StockLevels.Sum(sl => sl.Quantity) <= p.ReorderPoint ? ProductStockStatus.LowStock : ProductStockStatus.InStock
            })
            .ToListAsync(cancellationToken);

        return new PaginatedResult<ProductDto>(items, totalCount, pageNumber, pageSize);
    }
}
