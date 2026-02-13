using Inventory.API.Controllers;
using Inventory.Application.Contracts;
using Inventory.Application.Common.Models;
using Inventory.Application.DTOs;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace Inventory.UnitTests.Controllers;

public class ProductsControllerTests
{
    private readonly Mock<IProductService> _mockService;
    private readonly ProductsController _controller;

    public ProductsControllerTests()
    {
        _mockService = new Mock<IProductService>();
        _controller = new ProductsController(_mockService.Object);
    }

    [Fact]
    public async Task Get_ShouldReturnOk_WithPaginatedResult()
    {
        // Arrange
        int page = 1;
        int pageSize = 10;
        var items = new List<ProductDto> { new ProductDto { Id = Guid.NewGuid(), Name = "P1" } };
        var paginatedResult = new PaginatedResult<ProductDto>(items, 1, page, pageSize);

        _mockService.Setup(s => s.GetProductsAsync(page, pageSize, null, It.IsAny<CancellationToken>()))
            .ReturnsAsync(paginatedResult);

        // Act
        var result = await _controller.Get(page, pageSize);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var returnVal = Assert.IsType<PaginatedResult<ProductDto>>(okResult.Value);
        Assert.Single(returnVal.Items);
        Assert.Equal("P1", returnVal.Items.First().Name);
    }

    [Fact]
    public async Task Get_ShouldReturnBadRequest_WhenPageIsInvalid()
    {
        // Act
        var result = await _controller.Get(0, 10);

        // Assert
        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result.Result);
        var problemDetails = Assert.IsType<ProblemDetails>(badRequestResult.Value);
        Assert.Equal("Invalid page", problemDetails.Title);
    }

    [Fact]
    public async Task Get_ShouldReturnBadRequest_WhenPageSizeIsInvalid()
    {
        // Act
        var result = await _controller.Get(1, 0);

        // Assert
        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result.Result);
        var problemDetails = Assert.IsType<ProblemDetails>(badRequestResult.Value);
        Assert.Equal("Invalid pageSize", problemDetails.Title);
    }
}
