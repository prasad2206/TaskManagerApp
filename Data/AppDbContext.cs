using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using TaskManagerApp.Models;

namespace TaskManagerApp.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        // DbSets represent tables in the database
        public DbSet<User> Users { get; set; }
        public DbSet<TaskItem> Tasks { get; set; }

    }
}
