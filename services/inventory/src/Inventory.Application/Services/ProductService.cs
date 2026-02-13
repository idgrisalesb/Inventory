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

    public async Task<PaginatedResult<ProductDto>> GetProductsAsync(int pageNumber, int pageSize, string? search = null, string? category = null, ProductStockStatus? status = null, string? sortBy = null, bool? sortDescending = null, CancellationToken cancellationToken = default)
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

        if (!string.IsNullOrWhiteSpace(category))
        {
            query = query.Where(p => p.Category == category);
        }

        if (status.HasValue)
        {
            query = status.Value switch
            {
                ProductStockStatus.OutOfStock => query.Where(p => p.StockLevels.Sum(sl => sl.Quantity) == 0),
                ProductStockStatus.LowStock => query.Where(p => p.StockLevels.Sum(sl => sl.Quantity) > 0 && p.StockLevels.Sum(sl => sl.Quantity) <= p.ReorderPoint),
                ProductStockStatus.InStock => query.Where(p => p.StockLevels.Sum(sl => sl.Quantity) > p.ReorderPoint),
                _ => query
            };
        }

        int totalCount = await query.CountAsync(cancellationToken);

        query = (sortBy?.ToLower()) switch
        {
            "name" => sortDescending == true ? query.OrderByDescending(p => p.Name) : query.OrderBy(p => p.Name),
            "sku" => sortDescending == true ? query.OrderByDescending(p => p.Sku) : query.OrderBy(p => p.Sku),
            "price" => sortDescending == true ? query.OrderByDescending(p => p.UnitPrice) : query.OrderBy(p => p.UnitPrice),
            "quantity" => sortDescending == true
                ? query.OrderByDescending(p => p.StockLevels.Sum(sl => sl.Quantity))
                : query.OrderBy(p => p.StockLevels.Sum(sl => sl.Quantity)),
            _ => query.OrderBy(p => p.Name)
        };

        var items = await query
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .Select(p => new ProductDto
            {
                Id = p.Id,
                Sku = p.Sku,
                Name = p.Name,
                Category = p.Category,
                TotalQuantity = p.StockLevels.Sum(sl => sl.Quantity),
                UnitPrice = p.UnitPrice,
                StockStatus = p.StockLevels.Sum(sl => sl.Quantity) == 0 ? ProductStockStatus.OutOfStock :
                              p.StockLevels.Sum(sl => sl.Quantity) <= p.ReorderPoint ? ProductStockStatus.LowStock : ProductStockStatus.InStock
            })
            .ToListAsync(cancellationToken);

        return new PaginatedResult<ProductDto>(items, totalCount, pageNumber, pageSize);
    }

    public async Task<IEnumerable<string>> GetCategoriesAsync(CancellationToken cancellationToken = default)
    {
        return await _context.Products
            .AsNoTracking()
            .Select(p => p.Category)
            .Distinct()
            .OrderBy(c => c)
            .ToListAsync(cancellationToken);
    }
}
