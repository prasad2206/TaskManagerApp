using TaskManagerApp.Models;

namespace TaskManagerApp.Services.Interfaces
{
    public interface IAuthService
    {
        string GenerateToken(User user);
        bool ValidateToken(string token);
        int? GetUserIdFromToken(string token);
    }
}
