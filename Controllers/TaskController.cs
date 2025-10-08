using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TaskManagerApp.DTOs;
using TaskManagerApp.Services.Interfaces;
using TaskManagerApp.Helpers;

namespace TaskManagerApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize] // Secure all endpoints
    public class TaskController : ControllerBase
    {
        private readonly ITaskService _taskService;
        private readonly IAuthService _authService;

        public TaskController(ITaskService taskService, IAuthService authService)
        {
            _taskService = taskService;
            _authService = authService;
        }
        

        // Create Task
        [HttpPost("create")]
        public async Task<IActionResult> CreateTask([FromBody] TaskCreateDto dto)
        {
            var userId = UserHelper.GetUserIdFromClaims(User);
            var task = await _taskService.CreateTaskAsync(userId, dto);

            return Ok(new
            {
                message = "Task created successfully",
                task
            });
        }

        // Get User-Specific Tasks
        [HttpGet]
        public async Task<IActionResult> GetTasks()
        {
            var userId = UserHelper.GetUserIdFromClaims(User);
            var tasks = await _taskService.GetTasksByUserAsync(userId);
            return Ok(tasks);
        }

        // Update Task
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTask(int id, [FromBody] TaskUpdateDto dto)
        {
            var userId = UserHelper.GetUserIdFromClaims(User);
            var updated = await _taskService.UpdateTaskAsync(id, userId, dto);

            if (updated == null)
                return NotFound(new { message = "Task not found or unauthorized" });

            return Ok(new { message = "Task updated successfully", updated });
        }

        // Delete Task
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTask(int id)
        {
            var userId = UserHelper.GetUserIdFromClaims(User);
            var deleted = await _taskService.DeleteTaskAsync(id, userId);

            if (!deleted)
                return NotFound(new { message = "Task not found or unauthorized" });

            return Ok(new { message = "Task deleted successfully" });
        }

        // ✅ Admin Only - Get All Tasks
        [HttpGet("all")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllTasks()
        {
            var tasks = await _taskService.GetAllTasksAsync();
            return Ok(tasks.Select(t => new
            {
                t.Id,
                t.Title,
                t.Status,
                t.DueDate,
                User = new
                {
                    t.User?.Id,
                    t.User?.Name,
                    t.User?.Email
                }

            }));
        }
    }
}
