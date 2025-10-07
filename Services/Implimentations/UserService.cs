using BCrypt.Net;
using Microsoft.EntityFrameworkCore;
using TaskManagerApp.Data;
using TaskManagerApp.DTOs;
using TaskManagerApp.Helpers;
using TaskManagerApp.Models;
using TaskManagerApp.Services.Interfaces;

namespace TaskManagerApp.Services.Implementations
{
    public class UserService : IUserService
    {
        private readonly AppDbContext _context;

        private readonly JwtService _jwtService;
        public UserService(AppDbContext context, JwtService jwtService)
        {
            _context = context;
            _jwtService = jwtService;
        }

        public async Task<User?> GetUserByEmailAsync(string email)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
        }

        public async Task<User> RegisterUserAsync(UserRegisterDto request)
        {
            // Check if user already exists
            var existingUser = await GetUserByEmailAsync(request.Email);
            if (existingUser != null)
            {
                throw new Exception("User already exists with this email.");
            }

            // Hash password using BCrypt
            string passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);

            var newUser = new User
            {
                Name = request.Name,
                Email = request.Email,
                PasswordHash = passwordHash,
                Role = request.Role
            };

            _context.Users.Add(newUser);
            await _context.SaveChangesAsync();

            return newUser;
        }

        public async Task<string> LoginUserAsync(UserLoginDto request)
        {
            var user = await GetUserByEmailAsync(request.Email);
            if (user == null)
                throw new Exception("User not found.");

            // Verify password
            bool isPasswordValid = BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash);
            if (!isPasswordValid)
                throw new Exception("Invalid credentials.");

            // Generate JWT token
            string token = _jwtService.GenerateToken(user);

            return token;
        }
    }
}
