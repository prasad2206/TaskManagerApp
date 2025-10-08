using TaskManagerApp.DTOs;
using TaskManagerApp.Models;

namespace TaskManagerApp.Services.Interfaces
{
    public interface ITaskService
    {
        Task<TaskItem> CreateTaskAsync(int userId, TaskCreateDto dto);
        Task<List<TaskItem>> GetTasksByUserAsync(int userId);
        Task<TaskItem?> UpdateTaskAsync(int id, int userId, TaskUpdateDto dto);
        Task<bool> DeleteTaskAsync(int id, int userId);
    }
}
