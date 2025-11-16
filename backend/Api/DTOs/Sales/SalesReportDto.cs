using System;
using System.Collections.Generic;

namespace Api.DTOs.Sales
{
    public class SalesReportDto
    {
        public DateTime From { get; set; }
        public DateTime To { get; set; }

        public int TotalSales { get; set; }

        public decimal TotalAmount { get; set; }

        public List<SaleDto> Sales { get; set; } = new();
    }
}
