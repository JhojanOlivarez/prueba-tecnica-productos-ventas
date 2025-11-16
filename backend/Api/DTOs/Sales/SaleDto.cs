using System;
using System.Collections.Generic;

namespace Api.DTOs.Sales
{
    public class SaleDto
    {
        public int Id { get; set; }

        public DateTime Date { get; set; }

        public string? CustomerName { get; set; }

        public decimal Total { get; set; }

        public List<SaleItemDto> Items { get; set; } = new();
    }
}
