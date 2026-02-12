using Inventory.Domain.Entities;
using Xunit;

namespace Inventory.UnitTests;

public class DomainTests
{
    [Fact]
    public void Product_Should_Initialize_With_Empty_StockLevels()
    {
        // Arrange
        var product = new Product
        {
            Id = Guid.NewGuid(),
            Name = "Test Product",
            Sku = "TEST-001"
        };

        // Assert
        Assert.NotNull(product.StockLevels);
        Assert.Empty(product.StockLevels);
        Assert.Equal("Test Product", product.Name);
    }

    [Fact]
    public void Warehouse_Should_Initialize_With_Empty_StockLevels()
    {
        // Arrange
        var warehouse = new Warehouse
        {
            Id = Guid.NewGuid(),
            Name = "Test Warehouse",
            Location = "Test Location"
        };

        // Assert
        Assert.NotNull(warehouse.StockLevels);
        Assert.Empty(warehouse.StockLevels);
        Assert.Equal("Test Warehouse", warehouse.Name);
    }

    [Fact]
    public void StockLevel_Linking_Should_Maintain_Ids()
    {
        // Arrange
        var productId = Guid.NewGuid();
        var warehouseId = Guid.NewGuid();

        var stockLevel = new StockLevel
        {
            ProductId = productId,
            WarehouseId = warehouseId,
            Quantity = 100
        };

        // Assert
        Assert.Equal(productId, stockLevel.ProductId);
        Assert.Equal(warehouseId, stockLevel.WarehouseId);
        Assert.Equal(100, stockLevel.Quantity);
    }
}
