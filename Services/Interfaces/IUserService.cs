using TaskManagerApp.DTOs;
using TaskManagerApp.Models;

namespace TaskManagerApp.Services.Interfaces
{
    public interface IUserService
    {
        Task<User> RegisterUserAsync(UserRegisterDto request);
        Task<User?> GetUserByEmailAsync(string email);
    }
}
