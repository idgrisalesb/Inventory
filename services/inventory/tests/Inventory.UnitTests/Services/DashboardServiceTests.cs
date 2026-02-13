using Inventory.Application.Contracts;
using Inventory.Application.Services;
using Inventory.Domain.Entities;
using MockQueryable;
using MockQueryable.Moq;
using Moq;
using Xunit;

namespace Inventory.UnitTests.Services;

public class DashboardServiceTests
{
    private readonly Mock<IInventoryDbContext> _mockContext;
    private readonly DashboardService _service;

    public DashboardServiceTests()
    {
        _mockContext = new Mock<IInventoryDbContext>();
        _service = new DashboardService(_mockContext.Object);
    }

    [Fact]
    public async Task GetKpisAsync_ShouldReturnCorrectCalculations()
    {
        // Arrange
        var products = new List<Product>
        {
            new Product { Id = Guid.NewGuid(), UnitPrice = 10, ReorderPoint = 5 }, // P1: Stock 10 (Good)
            new Product { Id = Guid.NewGuid(), UnitPrice = 20, ReorderPoint = 5 }, // P2: Stock 4 (Low)
            new Product { Id = Guid.NewGuid(), UnitPrice = 30, ReorderPoint = 5 }, // P3: Stock 0 (Out)
            new Product { Id = Guid.NewGuid(), UnitPrice = 40, ReorderPoint = 5 }  // P4: Stock 5 (Low) - assuming <= ReorderPoint
        };

        var stockLevels = new List<StockLevel>
        {
            // P1 Stock: 10
            new StockLevel { ProductId = products[0].Id, Product = products[0], Quantity = 10 },

            // P2 Stock: 4
            new StockLevel { ProductId = products[1].Id, Product = products[1], Quantity = 4 },

            // P3 Stock: 0
            new StockLevel { ProductId = products[2].Id, Product = products[2], Quantity = 0 },

             // P4 Stock: 5
            new StockLevel { ProductId = products[3].Id, Product = products[3], Quantity = 5 }
        };

        // Bi-directional link
        products[0].StockLevels.Add(stockLevels[0]);
        products[1].StockLevels.Add(stockLevels[1]);
        products[2].StockLevels.Add(stockLevels[2]);
        products[3].StockLevels.Add(stockLevels[3]);

        // Mock DbSets
        var productMock = products.BuildMockDbSet();
        var stockLevelMock = stockLevels.BuildMockDbSet();

        _mockContext.Setup(c => c.Products).Returns(productMock.Object);
        _mockContext.Setup(c => c.StockLevels).Returns(stockLevelMock.Object);

        // Act
        var result = await _service.GetKpisAsync();

        // Assert
        Assert.Equal(4, result.TotalSkus); // 4 products

        // Total Value: (10*10) + (4*20) + (0*30) + (5*40) = 100 + 80 + 0 + 200 = 380
        Assert.Equal(380, result.TotalStockValue);

        // Low Stock (Qty <= ReorderPoint (5)): P2(4), P3(0), P4(5). Total 3.
        Assert.Equal(3, result.LowStockCount);

        // Out of Stock (Qty == 0): P3(0). Total 1.
        Assert.Equal(1, result.OutOfStockCount);
    }

    [Fact]
    public async Task GetStockValueByCategoryAsync_ShouldReturnCorrectGrouping()
    {
        // Arrange
        var products = new List<Product>
        {
            new Product { Id = Guid.NewGuid(), Name = "P1", Category = "Elec", UnitPrice = 100 },
            new Product { Id = Guid.NewGuid(), Name = "P2", Category = "Elec", UnitPrice = 50 },
            new Product { Id = Guid.NewGuid(), Name = "P3", Category = "Book", UnitPrice = 20 }
        };

        var stockLevels = new List<StockLevel>
        {
            new StockLevel { ProductId = products[0].Id, Product = products[0], Quantity = 2 }, // 200
            new StockLevel { ProductId = products[1].Id, Product = products[1], Quantity = 4 }, // 200
            new StockLevel { ProductId = products[2].Id, Product = products[2], Quantity = 10 } // 200
        };
        // Total Value Elec = 400. Book = 200. Total = 600.

        products[0].StockLevels.Add(stockLevels[0]);
        products[1].StockLevels.Add(stockLevels[1]);
        products[2].StockLevels.Add(stockLevels[2]);

        var productMock = products.BuildMockDbSet();
        _mockContext.Setup(c => c.Products).Returns(productMock.Object);

        // Act
        var result = await _service.GetStockValueByCategoryAsync();

        // Assert
        Assert.Equal(2, result.Count);
        var elec = result.First(x => x.CategoryName == "Elec");
        Assert.Equal(400, elec.TotalValue);
        // Check approximate percentage (400/600 = 66.666...)
        Assert.True(elec.Percentage > 66 && elec.Percentage < 67);
    }

    [Fact]
    public async Task GetLowStockAlertsAsync_ShouldReturnCriticalItems()
    {
        // Arrange
        var products = new List<Product>();
        var stockLevels = new List<StockLevel>();

        // Create 6 items with 0 quantity (Critical)
        for (int i = 0; i < 6; i++)
        {
            var p = new Product { Id = Guid.NewGuid(), Name = $"P{i}", ReorderPoint = 5 };
            products.Add(p);
            var sl = new StockLevel { ProductId = p.Id, Product = p, Quantity = 0 };
            stockLevels.Add(sl);
            p.StockLevels.Add(sl);
        }

        // Add 1 item with quantity 10 (OK)
        var pOk = new Product { Id = Guid.NewGuid(), Name = "POK", ReorderPoint = 5 };
        products.Add(pOk);
        var slOk = new StockLevel { ProductId = pOk.Id, Product = pOk, Quantity = 10 };
        stockLevels.Add(slOk);
        pOk.StockLevels.Add(slOk);

        var productMock = products.BuildMockDbSet();
        _mockContext.Setup(c => c.Products).Returns(productMock.Object);

        // Act
        var result = await _service.GetLowStockAlertsAsync();

        // Assert
        Assert.Equal(5, result.Count); // Should only take top 5
        Assert.All(result, item => Assert.Equal(0, item.TotalQuantity)); // All should be critical
    }
}
