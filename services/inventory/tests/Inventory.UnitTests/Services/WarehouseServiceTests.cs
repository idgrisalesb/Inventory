using Inventory.Application.Contracts;
using Inventory.Application.Services;
using Inventory.Domain.Entities;
using Moq;
using Inventory.UnitTests.Helpers;
using Xunit;
using System.Linq;
using System.Collections.Generic;

namespace Inventory.UnitTests.Services
{
    public class WarehouseServiceTests
    {
        private readonly Mock<IWarehouseRepository> _mockRepo;

        public WarehouseServiceTests()
        {
            _mockRepo = new Mock<IWarehouseRepository>();
        }

        [Fact]
        public async Task GetWarehousesAsync_ShouldReturnSummaries()
        {
            // Arrange
            var warehouses = new List<Warehouse>
            {
                new Warehouse
                {
                    Id = Guid.NewGuid(),
                    Name = "W1",
                    Location = "L1",
                    StockLevels = new List<StockLevel>
                    {
                        new StockLevel
                        {
                            Quantity = 10,
                            Product = new Product { UnitPrice = 100 }
                        },
                         new StockLevel
                        {
                            Quantity = 5,
                            Product = new Product { UnitPrice = 50 }
                        }
                    }
                }
            };

            // Manual Mock of IQueryable
            var mockApi = new TestAsyncEnumerable<Warehouse>(warehouses);
            _mockRepo.Setup(r => r.GetQuery()).Returns(mockApi);

            // Create service
            var service = new WarehouseService(_mockRepo.Object);

            // Act
            var result = await service.GetWarehousesAsync();

            // Assert
            var dto = result.FirstOrDefault();
            Assert.NotNull(dto);
            Assert.Equal("W1", dto.Name);
            Assert.Equal(15, dto.TotalItems); // 10 + 5
            Assert.Equal(1250, dto.TotalValue); // 10*100 + 5*50 = 1000 + 250 = 1250
        }
    }
}
