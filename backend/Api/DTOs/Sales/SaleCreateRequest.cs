using System.Collections.Generic;

namespace Api.DTOs.Sales
{
    public class SaleCreateRequest
    {
        public string? CustomerName { get; set; }

        // Lista de productos a vender
        public List<SaleItemCreateDto> Items { get; set; } = new();
    }
}
