var builder = DistributedApplication.CreateBuilder(args);

// Add the API project
var api = builder.AddProject<Projects.FestivalPlanner_Api>("api");

// Add the Web frontend project with a reference to the API
builder.AddProject<Projects.FestivalPlanner_Web>("webfrontend")
    .WithExternalHttpEndpoints()
    .WithReference(api);

builder.Build().Run();
