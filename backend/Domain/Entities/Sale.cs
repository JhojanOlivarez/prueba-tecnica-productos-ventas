using System;
using System.Collections.Generic;

namespace Domain.Entities
{
    public class Sale
    {
        public int Id { get; set; }

        public DateTime Date { get; set; }

        public string? CustomerName { get; set; }

        public decimal Total { get; set; }

        public ICollection<SaleItem> Items { get; set; } = new List<SaleItem>();
    }
}
