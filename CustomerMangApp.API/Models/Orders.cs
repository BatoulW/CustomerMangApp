using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace CustomerMangApp.API.Models
{
    [Table("Orders")]
    public class Orders
    {
        [Key]
        public int OrderId { get; set; }
        [ForeignKey(nameof(Customer))]
        public int CustomerId { get; set; }
        public string OrderDesc { get; set; } = default!;
        public int Amount { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        [JsonIgnore]   // <-- Prevent cycles
        public Customer? Customer { get; set; }
    }
}
