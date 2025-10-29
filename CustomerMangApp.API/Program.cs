using CustomerMangApp.API.Data;
using CustomerMangApp.API.Hubs;
using CustomerMangApp.API.Models;
using CustomerMangApp.API.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("CS")));

builder.Services.AddSignalR();

builder.Services.AddSingleton<OrderBackgroundJob>();
builder.Services.AddHostedService(provider => provider.GetRequiredService<OrderBackgroundJob>());

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular", policy =>
        policy.WithOrigins("http://localhost:4200")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials());
});
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseHttpsRedirection();
app.UseCors("AllowAngular");

app.MapHub<OrdersHub>("/hubs/ordersHub");


// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// List all customers
app.MapGet("/customers", async (AppDbContext db) =>
{
    var customers = await db.Customers
        .Include(c => c.Orders)
        .ToListAsync();
    return Results.Ok(customers);
});

// Get a specific customer
app.MapGet("/customers/{id:int}", async (int id, AppDbContext db) =>
{
    var customer = await db.Customers
        .Include(c => c.Orders)
        .FirstOrDefaultAsync(c => c.CustomerId == id);

    return customer is null ? Results.NotFound() : Results.Ok(customer);
});

// Create new customer (starts background job)
app.MapPost("/customers", async (Customer customer, AppDbContext db, OrderBackgroundJob job) =>
{
    db.Customers.Add(customer);
    await db.SaveChangesAsync();

    job.StartCustomerJob(customer.CustomerId);

    return Results.Created($"/customers/{customer.CustomerId}", customer);
});

// Update existing customer
app.MapPut("/customers/{id:int}", async (int id, Customer updated, AppDbContext db) =>
{
    var customer = await db.Customers.FindAsync(id);
    if (customer is null) return Results.NotFound();

    customer.CustomerName = updated.CustomerName;
    customer.Email = updated.Email;
    customer.IsActive = updated.IsActive;

    await db.SaveChangesAsync();
    return Results.Ok(customer);
});

// Delete customer (stops background job)
app.MapDelete("/customers/{id:int}", async (int id, AppDbContext db, OrderBackgroundJob job) =>
{
    var customer = await db.Customers.FindAsync(id);
    if (customer is null) return Results.NotFound();

    db.Customers.Remove(customer);
    await db.SaveChangesAsync();

    job.StopCustomerJob(id);
    return Results.NoContent();
});

// Get customer orders
app.MapGet("/orders/{id:int}", async (int id, AppDbContext db) =>
{
    var orders = await db.Orders
        .Where(o => o.CustomerId == id)
        .ToListAsync();

    return orders is null ? Results.NotFound() : Results.Ok(orders);
});

// Get customers orders
app.MapGet("/orders", async (AppDbContext db) =>
{
    var orders = await db.Orders
        .ToListAsync();

    return orders is null ? Results.NotFound() : Results.Ok(orders);
});
app.UseHttpsRedirection();

app.Run();


