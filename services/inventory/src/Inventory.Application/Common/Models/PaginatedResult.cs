namespace Inventory.Application.Common.Models;

public class PaginatedResult<T>
{
    public IEnumerable<T> Items { get; }
    public int PageNumber { get; }
    public int PageSize { get; }
    public int TotalCount { get; }
    public int TotalPages { get; }
    public bool HasNextPage { get; }

    public PaginatedResult(IEnumerable<T> items, int count, int pageNumber, int pageSize)
    {
        if (pageSize <= 0) throw new ArgumentOutOfRangeException(nameof(pageSize), "PageSize must be greater than zero.");

        Items = items;
        TotalCount = count;
        PageNumber = pageNumber;
        PageSize = pageSize;
        TotalPages = (int)Math.Ceiling(count / (double)pageSize);
        HasNextPage = PageNumber < TotalPages;
    }
}
