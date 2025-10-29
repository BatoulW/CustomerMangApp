using CustomerMangApp.API.Data;
using CustomerMangApp.API.Hubs;
using CustomerMangApp.API.Models;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace CustomerMangApp.API.Services
{
    public class OrderBackgroundJob : IHostedService, IDisposable
    {
        private readonly IServiceScopeFactory _scopeFactory;
        private readonly Dictionary<int, CancellationTokenSource> _customerJobs = new();
        private bool _disposed;

        public OrderBackgroundJob(IServiceScopeFactory scopeFactory)
        {
            _scopeFactory = scopeFactory;
        }

        public Task StartAsync(CancellationToken cancellationToken)
        {
            Console.WriteLine("Job initialized.");
            return Task.CompletedTask;
        }

        public Task StopAsync(CancellationToken cancellationToken)
        {
            foreach (var cts in _customerJobs.Values)
                cts.Cancel();

            _customerJobs.Clear();
            Console.WriteLine("All jobs stopped.");
            return Task.CompletedTask;
        }

        public void StartCustomerJob(int customerId)
        {
            if (_customerJobs.ContainsKey(customerId))
                return;

            var cts = new CancellationTokenSource();
            _customerJobs[customerId] = cts;

            Task.Run(() => GenerateOrdersLoop(customerId, cts.Token));
            Console.WriteLine($"Started order job for customer {customerId}");
        }

        public void StopCustomerJob(int customerId)
        {
            if (_customerJobs.TryGetValue(customerId, out var cts))
            {
                cts.Cancel();
                _customerJobs.Remove(customerId);
                Console.WriteLine($"Stopped order job for customer {customerId}");
            }
        }

        private async Task GenerateOrdersLoop(int customerId, CancellationToken token)
        {
            var random = new Random();

            while (!token.IsCancellationRequested)
            {
                using var scope = _scopeFactory.CreateScope();
                var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

                // Check if the customer still exists
                var exists = await db.Customers.AnyAsync(c => c.CustomerId == customerId, token);
                if (!exists)
                {
                    StopCustomerJob(customerId);
                    break;
                }

                var order = new Orders
                {
                    CustomerId = customerId,
                    OrderDesc = $"Auto Order {Guid.NewGuid().ToString()[..8]}",
                    Amount = random.Next(10, 1000),
                    CreatedAt = DateTime.UtcNow
                };

                db.Orders.Add(order);
                await db.SaveChangesAsync(token);
                var hub = scope.ServiceProvider.GetService<IHubContext<OrdersHub>>();
                if (hub != null)
                {
                    await hub.Clients.Group(customerId.ToString())
                        .SendAsync("OrderCreated", new
                        {
                            order.OrderId,
                            order.OrderDesc,
                            order.Amount,
                            order.CreatedAt,
                            order.CustomerId
                        });
                    Console.WriteLine($"SignalR: New order broadcasted for {order.CustomerId}");
                }
                await Task.Delay(TimeSpan.FromMinutes(1), token);
            }
        }

        public void Dispose()
        {
            if (_disposed) return;
            foreach (var cts in _customerJobs.Values)
                cts.Cancel();
            _disposed = true;
        }
    }
}
