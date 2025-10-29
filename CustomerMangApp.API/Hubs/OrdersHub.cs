using Microsoft.AspNetCore.SignalR;
using System.Text.RegularExpressions;

namespace CustomerMangApp.API.Hubs
{
    public class OrdersHub: Hub
    {
        public Task SubscribeCustomer(string customerId) =>
             Groups.AddToGroupAsync(Context.ConnectionId, customerId);

        public Task UnsubscribeCustomer(string customerId) =>
            Groups.RemoveFromGroupAsync(Context.ConnectionId, customerId);
    }
}
