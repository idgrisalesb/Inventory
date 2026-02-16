using Microsoft.AspNetCore.Mvc;
using Inventory.Application.Contracts;
using Inventory.Application.DTOs;
using Inventory.Application.Common.Models;
using Microsoft.AspNetCore.Authorization;

namespace Inventory.API.Controllers;

// [Authorize]
[ApiController]
[Route("api/v1/products")]
public class ProductsController : ControllerBase
{
    private readonly IProductService _service;

    public ProductsController(IProductService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<ActionResult<PaginatedResult<ProductDto>>> Get([FromQuery] int page = 1, [FromQuery] int pageSize = 10, [FromQuery] string? search = null, [FromQuery] string? category = null, [FromQuery] ProductStockStatus? status = null, [FromQuery] string? sortBy = null, [FromQuery] bool? sortDescending = null, CancellationToken cancellationToken = default)
    {
        if (page < 1) return BadRequest(new ProblemDetails { Title = "Invalid page", Detail = "Page number must be greater than 0." });
        if (pageSize < 1) return BadRequest(new ProblemDetails { Title = "Invalid pageSize", Detail = "Page size must be greater than 0." });

        var result = await _service.GetProductsAsync(page, pageSize, search, category, status, sortBy, sortDescending, cancellationToken);
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ProductDetailDto>> GetById(Guid id, CancellationToken cancellationToken = default)
    {
        var result = await _service.GetProductByIdAsync(id, cancellationToken);
        if (result == null) return NotFound();
        return Ok(result);
    }

    [HttpGet("categories")]
    public async Task<ActionResult<IEnumerable<string>>> GetCategories(CancellationToken cancellationToken = default)
    {
        var result = await _service.GetCategoriesAsync(cancellationToken);
        return Ok(result);
    }
}
