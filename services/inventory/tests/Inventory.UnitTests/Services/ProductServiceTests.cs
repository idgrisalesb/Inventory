using Inventory.Application.Contracts;
using Inventory.Application.Services;
using Inventory.Domain.Entities;
using Inventory.Application.DTOs;
using MockQueryable;
using MockQueryable.Moq;
using Moq;
using Xunit;

namespace Inventory.UnitTests.Services;

public class ProductServiceTests
{
    private readonly Mock<IInventoryDbContext> _mockContext;
    private readonly ProductService _service;

    public ProductServiceTests()
    {
        _mockContext = new Mock<IInventoryDbContext>();
        _service = new ProductService(_mockContext.Object);
    }

    [Fact]
    public async Task GetProductsAsync_ShouldReturnPaginatedResult()
    {
        // Arrange
        var products = new List<Product>();
        for (int i = 0; i < 20; i++)
        {
            var p = new Product
            {
                Id = Guid.NewGuid(),
                Name = $"Product {i}",
                Category = "Test",
                ReorderPoint = 5
            };

            // Add stock levels based on index
            // i=0: Qty=0 (Out of Stock)
            // i=1: Qty=5 (Low Stock)
            // i=2+: Qty=10 (In Stock)
            var qty = i == 0 ? 0 : (i == 1 ? 5 : 10);

            p.StockLevels = new List<StockLevel>
            {
                new StockLevel { Product = p, Quantity = qty }
            };

            products.Add(p);
        }

        var productMock = products.BuildMockDbSet();
        _mockContext.Setup(c => c.Products).Returns(productMock.Object);

        int pageNumber = 1;
        int pageSize = 5;

        // Act
        var result = await _service.GetProductsAsync(pageNumber, pageSize);

        // Assert
        Assert.Equal(20, result.TotalCount);
        Assert.Equal(4, result.TotalPages); // 20 / 5 = 4
        Assert.Equal(5, result.Items.Count());
        Assert.Equal(pageNumber, result.PageNumber);
        Assert.True(result.HasNextPage);

        // Verify Content
        var firstItem = result.Items.First();
        Assert.Equal("Product 0", firstItem.Name);
        Assert.Equal(ProductStockStatus.OutOfStock, firstItem.StockStatus);

        var secondItem = result.Items.Skip(1).First();
        Assert.Equal("Product 1", secondItem.Name);
        Assert.Equal(ProductStockStatus.LowStock, secondItem.StockStatus);

        var thirdItem = result.Items.Skip(2).First();
        Assert.Equal(ProductStockStatus.InStock, thirdItem.StockStatus);
    }

    [Fact]
    public async Task GetProductsAsync_ShouldHandleEmptyDatabase()
    {
        // Arrange
        var products = new List<Product>();
        var productMock = products.BuildMockDbSet();
        _mockContext.Setup(c => c.Products).Returns(productMock.Object);

        // Act
        var result = await _service.GetProductsAsync(1, 10);

        // Assert
        Assert.Equal(0, result.TotalCount);
        Assert.Empty(result.Items);
    }

    [Fact]
    public async Task GetProductsAsync_ShouldThrowArgumentOutOfRangeException_WhenPageNumberIsInvalid()
    {
        await Assert.ThrowsAsync<ArgumentOutOfRangeException>(() => _service.GetProductsAsync(0, 10));
    }

    [Fact]
    public async Task GetProductsAsync_ShouldThrowArgumentOutOfRangeException_WhenPageSizeIsInvalid()
    {
        await Assert.ThrowsAsync<ArgumentOutOfRangeException>(() => _service.GetProductsAsync(1, 0));
    }

    [Fact]
    public async Task GetProductsAsync_ShouldFilterBySearchTerm()
    {
        // Arrange
        var products = new List<Product>
        {
            new Product { Id = Guid.NewGuid(), Name = "Apple iPhone", Sku = "SKU-001", Category = "Elec" },
            new Product { Id = Guid.NewGuid(), Name = "Samsung Galaxy", Sku = "SKU-002", Category = "Elec" },
            new Product { Id = Guid.NewGuid(), Name = "Google Pixel", Sku = "SKU-003", Category = "Elec" },
            new Product { Id = Guid.NewGuid(), Name = "Other Gadget", Sku = "SKU-004", Category = "Notes" }
        };

        foreach (var p in products)
        {
            p.StockLevels = new List<StockLevel> { new StockLevel { Product = p, Quantity = 10 } };
        }

        var productMock = products.BuildMockDbSet();
        _mockContext.Setup(c => c.Products).Returns(productMock.Object);

        // Act - Search by Name
        var resultName = await _service.GetProductsAsync(1, 10, "Samsung");

        // Assert
        Assert.Single(resultName.Items);
        Assert.Equal("Samsung Galaxy", resultName.Items.First().Name);

        // Act - Search by SKU
        var resultSku = await _service.GetProductsAsync(1, 10, "SKU-003");

        // Assert
        Assert.Single(resultSku.Items);
        Assert.Equal("Google Pixel", resultSku.Items.First().Name);
    }
}
