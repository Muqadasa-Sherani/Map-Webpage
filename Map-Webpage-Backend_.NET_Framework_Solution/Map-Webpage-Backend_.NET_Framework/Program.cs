using Microsoft.EntityFrameworkCore;
using postgresConnectinContext.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();

builder.Services.AddDbContext<TestContext>(options =>
options.UseNpgsql(builder.Configuration.GetConnectionString("TestDBContext")));

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

//Cors is added because without cors there will be a security breach when api is being fetched from javascript to http attributes here.
builder.Services.AddCors(x => x.AddPolicy("my-policy", options => options.AllowAnyHeader().AllowAnyOrigin().AllowAnyMethod()));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("my-policy"); //Cors is added because of the api fetch from frontend to backend.
app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
