var builder = WebApplication.CreateBuilder(args);

// Add service defaults & Aspire components.
builder.AddServiceDefaults();

// Add services to the container.
builder.Services.AddHttpClient("ApiClient", client =>
{
    client.BaseAddress = new Uri("http://api");
});

var app = builder.Build();

// Configure the HTTP request pipeline.
app.MapDefaultEndpoints();

app.UseDefaultFiles();
app.UseStaticFiles();

// Fallback to index.html for SPA routing
app.MapFallbackToFile("index.html");

app.Run();
