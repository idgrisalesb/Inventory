using Inventory.API.Controllers;
using Microsoft.AspNetCore.Mvc;
using Xunit;

namespace Inventory.UnitTests.Controllers
{
    public class WarehouseControllerTests
    {
        [Fact]
        public void WarehouseController_ShouldBeApiController()
        {
            var type = typeof(WarehouseController);
            Assert.True(type.IsSubclassOf(typeof(ControllerBase)));
            Assert.Contains(type.GetCustomAttributes(typeof(ApiControllerAttribute), true), a => true);
            Assert.Contains(type.GetCustomAttributes(typeof(RouteAttribute), true), a => ((RouteAttribute)a).Template == "api/v1/warehouses");
        }
        [Fact]
        public void Get_ShouldHaveHttpGetAttribute()
        {
            var method = typeof(WarehouseController).GetMethod("Get");
            Assert.NotNull(method);
            Assert.Contains(method.GetCustomAttributes(typeof(HttpGetAttribute), true), a => true);
        }
    }
}
