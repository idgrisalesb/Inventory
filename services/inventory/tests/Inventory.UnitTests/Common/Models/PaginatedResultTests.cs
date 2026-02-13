using Inventory.Application.Common.Models;
using Xunit;

namespace Inventory.UnitTests.Common.Models;

public class PaginatedResultTests
{
    [Fact]
    public void Constructor_CalculatesTotalPagesCorrectly()
    {
        // Arrange
        var items = new List<string> { "A", "B" };
        var count = 10;
        var pageNumber = 1;
        var pageSize = 2;

        // Act
        var result = new PaginatedResult<string>(items, count, pageNumber, pageSize);

        // Assert
        Assert.Equal(5, result.TotalPages);
    }

    [Fact]
    public void Constructor_CalculatesHasNextPageCorrectly()
    {
        // Arrange
        var items = new List<string> { "A", "B" };
        var count = 10;
        var pageNumber = 1;
        var pageSize = 2;

        // Act
        var result = new PaginatedResult<string>(items, count, pageNumber, pageSize);

        // Assert
        Assert.True(result.HasNextPage);
    }

    [Fact]
    public void Constructor_CalculatesHasNextPageCorrectly_WhenOnLastPage()
    {
        // Arrange
        var items = new List<string> { "Y", "Z" };
        var count = 10;
        var pageNumber = 5;
        var pageSize = 2;

        // Act
        var result = new PaginatedResult<string>(items, count, pageNumber, pageSize);

        // Assert
        Assert.False(result.HasNextPage);
    }
}
