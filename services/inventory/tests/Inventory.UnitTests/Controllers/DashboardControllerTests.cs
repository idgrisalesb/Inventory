using Inventory.API.Controllers;
using Inventory.Application.Contracts;
using Inventory.Application.DTOs;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;
using Microsoft.AspNetCore.Authorization;

namespace Inventory.UnitTests.Controllers;

public class DashboardControllerTests
{
    [Fact]
    public void DashboardController_ShouldHaveAttributes()
    {
        var type = typeof(DashboardController);
        Assert.True(type.IsSubclassOf(typeof(ControllerBase)));
        Assert.Contains(type.GetCustomAttributes(typeof(ApiControllerAttribute), true), a => true);
        var routeAttr = (RouteAttribute)type.GetCustomAttributes(typeof(RouteAttribute), true).First();
        Assert.Equal("api/v1/dashboard", routeAttr.Template);

        var authAttr = (AuthorizeAttribute)type.GetCustomAttributes(typeof(AuthorizeAttribute), true).First();
        Assert.Equal("InventoryManager", authAttr.Policy);
    }

    [Fact]
    public void GetKpis_ShouldHaveHttpGetAttribute()
    {
        var method = typeof(DashboardController).GetMethod("GetKpis");
        Assert.NotNull(method);
        var httpGet = (HttpGetAttribute)method.GetCustomAttributes(typeof(HttpGetAttribute), true).First();
        Assert.Equal("kpis", httpGet.Template);
    }

    [Fact]
    public async Task GetKpis_ShouldReturnOkResult_WithDto()
    {
        // Arrange
        var mockService = new Mock<IDashboardService>();
        var expectedDto = new DashboardKpiDto { TotalSkus = 10 };
        mockService.Setup(s => s.GetKpisAsync()).ReturnsAsync(expectedDto);

        var controller = new DashboardController(mockService.Object);

        // Act
        var result = await controller.GetKpis();

        // Assert
        var actionResult = Assert.IsType<ActionResult<DashboardKpiDto>>(result);
        var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
        var returnValue = Assert.IsType<DashboardKpiDto>(okResult.Value);
        Assert.Equal(10, returnValue.TotalSkus);
    }

    [Fact]
    public async Task GetCharts_ShouldReturnOkResult_WithListDto()
    {
        // Arrange
        var mockService = new Mock<IDashboardService>();
        var expectedList = new List<DashboardChartDto>
        {
            new DashboardChartDto { CategoryName = "Cat1", TotalValue = 100, Percentage = 10 }
        };
        mockService.Setup(s => s.GetStockValueByCategoryAsync()).ReturnsAsync(expectedList);

        var controller = new DashboardController(mockService.Object);

        // Act
        var result = await controller.GetStockValueChart();

        // Assert
        var actionResult = Assert.IsType<ActionResult<List<DashboardChartDto>>>(result);
        var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
        var returnValue = Assert.IsType<List<DashboardChartDto>>(okResult.Value);
        Assert.Single(returnValue);
    }

    [Fact]
    public async Task GetAlerts_ShouldReturnOkResult_WithListDto()
    {
        // Arrange
        var mockService = new Mock<IDashboardService>();
        var expectedList = new List<DashboardAlertDto>
        {
            new DashboardAlertDto { ProductId = Guid.NewGuid(), ProductName = "P1", TotalQuantity = 1, ReorderPoint = 5 }
        };
        mockService.Setup(s => s.GetLowStockAlertsAsync()).ReturnsAsync(expectedList);

        var controller = new DashboardController(mockService.Object);

        // Act
        var result = await controller.GetLowStockAlerts();

        // Assert
        var actionResult = Assert.IsType<ActionResult<List<DashboardAlertDto>>>(result);
        var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
        var returnValue = Assert.IsType<List<DashboardAlertDto>>(okResult.Value);
        Assert.Single(returnValue);
    }
}
