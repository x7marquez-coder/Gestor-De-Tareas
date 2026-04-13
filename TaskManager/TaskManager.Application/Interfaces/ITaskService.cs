using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TaskManager.Domain.Enums;
using TaskManager.Application.DTOs;
using TaskManager.Application.Interfaces;
using TaskManager.Domain.Entities;

namespace TaskManager.Application.Interfaces;

public interface ITaskService
{
    Task<List<TaskItem>> GetAllAsync();
    Task CreateAsync(CreateTaskDto dto);
    Task UpdateAsync(Guid id, UpdateTaskDto dto);
    Task DeleteAsync(Guid id);
    Task ToggleAsync(Guid id);
}