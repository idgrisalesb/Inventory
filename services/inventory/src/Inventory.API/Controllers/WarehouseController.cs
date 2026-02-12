using Microsoft.AspNetCore.Mvc;
using Inventory.Application.DTOs;
using Inventory.Application.Contracts;
using Microsoft.AspNetCore.Authorization;

namespace Inventory.API.Controllers;

[Authorize]
[ApiController]
[Route("api/v1/warehouses")]
public class WarehouseController : ControllerBase
{
    private readonly IWarehouseService _service;

    public WarehouseController(IWarehouseService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<WarehouseDto>>> Get()
    {
        var result = await _service.GetWarehousesAsync();
        return Ok(result);
    }
}
