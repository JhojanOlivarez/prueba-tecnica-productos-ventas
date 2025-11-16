using Api.DTOs.Sales;
using Domain.Entities;
using Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Api.Controllers
{
    [ApiController]
    [Route("api/sales")]
    [Authorize] // Todas las acciones requieren usuario autenticado
    public class SalesController : ControllerBase
    {
        private readonly AppDbContext _db;

        public SalesController(AppDbContext db)
        {
            _db = db;
        }

        // POST: api/sales
        [HttpPost]
        public async Task<ActionResult<SaleDto>> Create(SaleCreateRequest request)
        {
            if (request.Items == null || !request.Items.Any())
            {
                return BadRequest("Sale must contain at least one item.");
            }

            // Cargar productos
            var productIds = request.Items.Select(i => i.ProductId).Distinct().ToList();
            var products = await _db.Products
                .Where(p => productIds.Contains(p.Id))
                .ToListAsync();

            if (products.Count != productIds.Count)
                return BadRequest("One or more products do not exist.");

            var sale = new Sale
            {
                Date = DateTime.UtcNow,
                CustomerName = request.CustomerName
            };

            decimal total = 0m;

            foreach (var item in request.Items)
            {
                var product = products.First(p => p.Id == item.ProductId);

                if (item.Quantity <= 0)
                    return BadRequest("Quantity must be greater than zero.");

                if (product.Stock < item.Quantity)
                    return BadRequest($"Not enough stock for product {product.Name}.");

                var unitPrice = product.Price;
                var subtotal = unitPrice * item.Quantity;

                // Actualizar stock
                product.Stock -= item.Quantity;

                var saleItem = new SaleItem
                {
                    ProductId = product.Id,
                    Quantity = item.Quantity,
                    UnitPrice = unitPrice,
                    Subtotal = subtotal
                };

                total += subtotal;
                sale.Items.Add(saleItem);
            }

            sale.Total = total;

            _db.Sales.Add(sale);
            await _db.SaveChangesAsync();

            // Construir DTO de respuesta
            var result = new SaleDto
            {
                Id = sale.Id,
                Date = sale.Date,
                CustomerName = sale.CustomerName,
                Total = sale.Total,
                Items = sale.Items.Select(i => new SaleItemDto
                {
                    ProductId = i.ProductId,
                    ProductName = products.First(p => p.Id == i.ProductId).Name,
                    Quantity = i.Quantity,
                    UnitPrice = i.UnitPrice,
                    Subtotal = i.Subtotal
                }).ToList()
            };

            return CreatedAtAction(nameof(GetById), new { id = sale.Id }, result);
        }

        // GET: api/sales
        [HttpGet]
        public async Task<ActionResult<IEnumerable<SaleDto>>> GetAll()
        {
            var sales = await _db.Sales
                .Include(s => s.Items)
                .ThenInclude(i => i.Product)
                .OrderByDescending(s => s.Date)
                .ToListAsync();

            var result = sales.Select(s => new SaleDto
            {
                Id = s.Id,
                Date = s.Date,
                CustomerName = s.CustomerName,
                Total = s.Total,
                Items = s.Items.Select(i => new SaleItemDto
                {
                    ProductId = i.ProductId,
                    ProductName = i.Product.Name,
                    Quantity = i.Quantity,
                    UnitPrice = i.UnitPrice,
                    Subtotal = i.Subtotal
                }).ToList()
            }).ToList();

            return Ok(result);
        }

        // GET: api/sales/5
        [HttpGet("{id:int}")]
        public async Task<ActionResult<SaleDto>> GetById(int id)
        {
            var s = await _db.Sales
                .Include(x => x.Items)
                .ThenInclude(i => i.Product)
                .FirstOrDefaultAsync(x => x.Id == id);

            if (s == null) return NotFound();

            var dto = new SaleDto
            {
                Id = s.Id,
                Date = s.Date,
                CustomerName = s.CustomerName,
                Total = s.Total,
                Items = s.Items.Select(i => new SaleItemDto
                {
                    ProductId = i.ProductId,
                    ProductName = i.Product.Name,
                    Quantity = i.Quantity,
                    UnitPrice = i.UnitPrice,
                    Subtotal = i.Subtotal
                }).ToList()
            };

            return Ok(dto);
        }

        // GET: api/sales/report?from=2025-11-01&to=2025-11-30
        [HttpGet("report")]
        public async Task<ActionResult<SalesReportDto>> GetReport(
            [FromQuery] DateTime from,
            [FromQuery] DateTime to)
        {
            if (to < from)
                return BadRequest("'to' must be greater than or equal to 'from'.");

            var sales = await _db.Sales
                .Include(s => s.Items)
                .ThenInclude(i => i.Product)
                .Where(s => s.Date.Date >= from.Date && s.Date.Date <= to.Date)
                .OrderByDescending(s => s.Date)
                .ToListAsync();

            var salesDtos = sales.Select(s => new SaleDto
            {
                Id = s.Id,
                Date = s.Date,
                CustomerName = s.CustomerName,
                Total = s.Total,
                Items = s.Items.Select(i => new SaleItemDto
                {
                    ProductId = i.ProductId,
                    ProductName = i.Product.Name,
                    Quantity = i.Quantity,
                    UnitPrice = i.UnitPrice,
                    Subtotal = i.Subtotal
                }).ToList()
            }).ToList();

            var report = new SalesReportDto
            {
                From = from,
                To = to,
                TotalSales = salesDtos.Count,
                TotalAmount = salesDtos.Sum(s => s.Total),
                Sales = salesDtos
            };

            return Ok(report);
        }
    }
}
