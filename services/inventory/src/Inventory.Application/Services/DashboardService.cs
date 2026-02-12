using Inventory.Application.Contracts;
using Inventory.Application.DTOs;
using Microsoft.EntityFrameworkCore;

namespace Inventory.Application.Services;

public class DashboardService : IDashboardService
{
    private readonly IInventoryDbContext _context;

    public DashboardService(IInventoryDbContext context)
    {
        _context = context;
    }

    public async Task<DashboardKpiDto> GetKpisAsync()
    {
        // Execute queries sequentially as DbContext is not thread-safe.
        // Parallel execution with Task.WhenAll on a single DbContext instance is not supported in EF Core.

        var totalSkus = await _context.Products.AsNoTracking().CountAsync();

        var totalStockValue = await _context.StockLevels.AsNoTracking()
            .SumAsync(sl => sl.Quantity * sl.Product.UnitPrice);

        var lowStockCount = await _context.Products.AsNoTracking()
            .Where(p => p.StockLevels.Sum(sl => sl.Quantity) <= p.ReorderPoint)
            .CountAsync();

        var outOfStockCount = await _context.Products.AsNoTracking()
            .Where(p => p.StockLevels.Sum(sl => sl.Quantity) == 0)
            .CountAsync();

        return new DashboardKpiDto
        {
            TotalSkus = totalSkus,
            TotalStockValue = totalStockValue,
            LowStockCount = lowStockCount,
            OutOfStockCount = outOfStockCount
        };
    }

    public async Task<List<DashboardChartDto>> GetStockValueByCategoryAsync()
    {
        var categoryData = await _context.Products
            .AsNoTracking()
            .Select(p => new
            {
                p.Category,
                Value = p.StockLevels.Sum(sl => sl.Quantity) * p.UnitPrice
            })
            .GroupBy(x => x.Category)
            .Select(g => new
            {
                CategoryName = g.Key,
                TotalValue = g.Sum(x => x.Value)
            })
            .OrderByDescending(x => x.TotalValue)
            .ToListAsync();

        var grandTotal = categoryData.Sum(x => x.TotalValue);

        return categoryData.Select(x => new DashboardChartDto
        {
            CategoryName = x.CategoryName,
            TotalValue = x.TotalValue,
            Percentage = grandTotal > 0 ? (x.TotalValue / grandTotal) * 100 : 0
        }).ToList();
    }

    public async Task<List<DashboardAlertDto>> GetLowStockAlertsAsync()
    {
        return await _context.Products
            .AsNoTracking()
            .Where(p => p.StockLevels.Sum(sl => sl.Quantity) <= p.ReorderPoint)
            .Select(p => new DashboardAlertDto
            {
                ProductId = p.Id,
                ProductName = p.Name,
                Sku = p.Sku,
                TotalQuantity = p.StockLevels.Sum(sl => sl.Quantity),
                ReorderPoint = p.ReorderPoint
            })
            .OrderBy(a => a.TotalQuantity) // Most critical first
            .Take(5)
            .ToListAsync();
    }
}
