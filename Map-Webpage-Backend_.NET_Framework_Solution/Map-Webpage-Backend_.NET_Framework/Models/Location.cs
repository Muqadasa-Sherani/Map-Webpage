using System;
using System.Collections.Generic;

namespace postgresConnectinContext.Models
{
    public partial class Location
    {
        public int Id { get; set; }
        public double? X { get; set; }
        public double? Y { get; set; }
        public string? Name { get; set; }
    }
}
