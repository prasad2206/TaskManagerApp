using Microsoft.AspNetCore.Mvc;
using TaskManagerApp.DTOs;
using TaskManagerApp.Services.Interfaces;

namespace TaskManagerApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IUserService _userService;

        public AuthController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] UserRegisterDto request)
        {
            try
            {
                var user = await _userService.RegisterUserAsync(request);
                return Ok(new
                {
                    message = "User registered successfully!",
                    user = new
                    {
                        user.Id,
                        user.Name,
                        user.Email,
                        user.Role
                    }
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
