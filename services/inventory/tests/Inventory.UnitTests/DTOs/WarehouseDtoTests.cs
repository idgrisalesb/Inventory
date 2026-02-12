using Inventory.Application.DTOs;
using Xunit;

namespace Inventory.UnitTests.DTOs
{
    public class WarehouseDtoTests
    {
        [Fact]
        public void WarehouseDto_ShouldHaveCorrectProperties()
        {
            // Arrange
            var id = Guid.NewGuid();
            var dto = new WarehouseDto
            {
                Id = id,
                Name = "Test Warehouse",
                Location = "Test Location",
                TotalItems = 100,
                TotalValue = 5000.50m
            };

            // Assert
            Assert.Equal(id, dto.Id);
            Assert.Equal("Test Warehouse", dto.Name);
            Assert.Equal("Test Location", dto.Location);
            Assert.Equal(100, dto.TotalItems);
            Assert.Equal(5000.50m, dto.TotalValue);
        }
    }
}
