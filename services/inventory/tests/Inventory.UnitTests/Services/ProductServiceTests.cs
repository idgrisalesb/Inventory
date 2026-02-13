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
        Assert.Equal(0, firstItem.TotalQuantity);

        var secondItem = result.Items.Skip(1).First();
        Assert.Equal("Product 1", secondItem.Name);
        Assert.Equal(ProductStockStatus.LowStock, secondItem.StockStatus);
        Assert.Equal(5, secondItem.TotalQuantity);

        var thirdItem = result.Items.Skip(2).First();
        Assert.Equal(ProductStockStatus.InStock, thirdItem.StockStatus);
        Assert.Equal(10, thirdItem.TotalQuantity);
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

    [Fact]
    public async Task GetProductsAsync_ShouldFilterByCategory()
    {
        // Arrange
        var products = new List<Product>
        {
            new Product { Id = Guid.NewGuid(), Name = "Apple iPhone", Category = "Electronics" },
            new Product { Id = Guid.NewGuid(), Name = "Samsung Galaxy", Category = "Electronics" },
            new Product { Id = Guid.NewGuid(), Name = "Book", Category = "Books" }
        };

        foreach (var p in products) p.StockLevels = new List<StockLevel> { new StockLevel { Product = p, Quantity = 10 } };

        var productMock = products.BuildMockDbSet();
        _mockContext.Setup(c => c.Products).Returns(productMock.Object);

        // Act
        var result = await _service.GetProductsAsync(1, 10, category: "Electronics");

        // Assert
        Assert.Equal(2, result.Items.Count());
        Assert.All(result.Items, p => Assert.Equal("Electronics", p.Category));
    }

    [Fact]
    public async Task GetProductsAsync_ShouldFilterByStatus()
    {
        // Arrange
        var products = new List<Product>();

        // OutOfStock
        var p1 = new Product { Id = Guid.NewGuid(), Name = "P1", ReorderPoint = 5 };
        p1.StockLevels = new List<StockLevel> { new StockLevel { Product = p1, Quantity = 0 } };
        products.Add(p1);

        // LowStock
        var p2 = new Product { Id = Guid.NewGuid(), Name = "P2", ReorderPoint = 5 };
        p2.StockLevels = new List<StockLevel> { new StockLevel { Product = p2, Quantity = 5 } };
        products.Add(p2);

        // InStock
        var p3 = new Product { Id = Guid.NewGuid(), Name = "P3", ReorderPoint = 5 };
        p3.StockLevels = new List<StockLevel> { new StockLevel { Product = p3, Quantity = 10 } };
        products.Add(p3);

        var productMock = products.BuildMockDbSet();
        _mockContext.Setup(c => c.Products).Returns(productMock.Object);

        // Act & Assert - OutOfStock
        var resOut = await _service.GetProductsAsync(1, 10, status: ProductStockStatus.OutOfStock);
        Assert.Single(resOut.Items);
        Assert.Equal("P1", resOut.Items.First().Name);

        // Act & Assert - LowStock
        var resLow = await _service.GetProductsAsync(1, 10, status: ProductStockStatus.LowStock);
        Assert.Single(resLow.Items);
        Assert.Equal("P2", resLow.Items.First().Name);

        // Act & Assert - InStock
        var resIn = await _service.GetProductsAsync(1, 10, status: ProductStockStatus.InStock);
        Assert.Single(resIn.Items);
        Assert.Equal("P3", resIn.Items.First().Name);
    }

    [Fact]
    public async Task GetCategoriesAsync_ShouldReturnDistinctCategories()
    {
        // Arrange
        var products = new List<Product>
        {
            new Product { Id = Guid.NewGuid(), Name = "P1", Category = "A" },
            new Product { Id = Guid.NewGuid(), Name = "P2", Category = "B" },
            new Product { Id = Guid.NewGuid(), Name = "P3", Category = "A" }
        };
        var productMock = products.BuildMockDbSet();
        _mockContext.Setup(c => c.Products).Returns(productMock.Object);

        // Act
        var result = await _service.GetCategoriesAsync();

        // Assert
        Assert.Equal(2, result.Count());
        Assert.Contains("A", result);
        Assert.Contains("B", result);
    }

    [Fact]
    public async Task GetProductsAsync_ShouldSortByNameDescending()
    {
        // Arrange
        var products = new List<Product>
        {
            new Product { Id = Guid.NewGuid(), Name = "Apple", Sku = "A1" },
            new Product { Id = Guid.NewGuid(), Name = "Banana", Sku = "B1" },
            new Product { Id = Guid.NewGuid(), Name = "Cherry", Sku = "C1" }
        };
        foreach (var p in products) p.StockLevels = new List<StockLevel> { new StockLevel { Product = p, Quantity = 10 } };

        var productMock = products.BuildMockDbSet();
        _mockContext.Setup(c => c.Products).Returns(productMock.Object);

        // Act
        var result = await _service.GetProductsAsync(1, 10, sortBy: "name", sortDescending: true);

        // Assert
        Assert.Equal("Cherry", result.Items.First().Name);
        Assert.Equal("Banana", result.Items.Skip(1).First().Name);
        Assert.Equal("Apple", result.Items.Last().Name);
    }

    [Fact]
    public async Task GetProductsAsync_ShouldSortByPriceAscending()
    {
         // Arrange
        var products = new List<Product>
        {
            new Product { Id = Guid.NewGuid(), Name = "Cheap", UnitPrice = 10 },
            new Product { Id = Guid.NewGuid(), Name = "Expensive", UnitPrice = 100 },
            new Product { Id = Guid.NewGuid(), Name = "Medium", UnitPrice = 50 }
        };
        foreach (var p in products) p.StockLevels = new List<StockLevel> { new StockLevel { Product = p, Quantity = 10 } };

        var productMock = products.BuildMockDbSet();
        _mockContext.Setup(c => c.Products).Returns(productMock.Object);

        // Act
        var result = await _service.GetProductsAsync(1, 10, sortBy: "price", sortDescending: false);

         // Assert
        Assert.Equal("Cheap", result.Items.First().Name);
        Assert.Equal("Medium", result.Items.Skip(1).First().Name);
        Assert.Equal("Expensive", result.Items.Last().Name);
    }

    [Fact]
    public async Task GetProductsAsync_ShouldSortByQuantityDescending()
    {
         // Arrange
        var products = new List<Product>
        {
            new Product { Id = Guid.NewGuid(), Name = "Low", ReorderPoint = 0 }, // Qty 5
            new Product { Id = Guid.NewGuid(), Name = "High", ReorderPoint = 0 }, // Qty 20
            new Product { Id = Guid.NewGuid(), Name = "Mid", ReorderPoint = 0 }   // Qty 10
        };

        // Manual setup of stock levels
        products[0].StockLevels = new List<StockLevel> { new StockLevel { Product = products[0], Quantity = 5 } };
        products[1].StockLevels = new List<StockLevel> { new StockLevel { Product = products[1], Quantity = 20 } };
        products[2].StockLevels = new List<StockLevel> { new StockLevel { Product = products[2], Quantity = 10 } };

        var productMock = products.BuildMockDbSet();
        _mockContext.Setup(c => c.Products).Returns(productMock.Object);

        // Act
        var result = await _service.GetProductsAsync(1, 10, sortBy: "quantity", sortDescending: true);

         // Assert
        Assert.Equal("High", result.Items.First().Name);
        Assert.Equal("Mid", result.Items.Skip(1).First().Name);
        Assert.Equal("Low", result.Items.Last().Name);
    }
}
