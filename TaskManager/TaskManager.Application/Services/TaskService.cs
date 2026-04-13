using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using TaskManager.Application.DTOs;
using TaskManager.Application.Interfaces;
using TaskManager.Domain.Entities;
using TaskManager.Domain.Enums;

namespace TaskManager.Application.Services;

public class TaskService : ITaskService
{
    private readonly ITaskRepository _repository;

    public TaskService(ITaskRepository repository)
    {
        _repository = repository;
    }

    public async Task<List<TaskItem>> GetAllAsync()
    {
        return await _repository.GetAllAsync();
    }

    public async Task CreateAsync(CreateTaskDto dto)
    {
        var task = new TaskItem(
            dto.Title,
            dto.Description,
            dto.DueDate,
            (TaskPriority)dto.Priority
        );

        await _repository.AddAsync(task);
        await _repository.SaveChangesAsync();
    }

    public async Task UpdateAsync(Guid id, UpdateTaskDto dto)
    {
        var task = await _repository.GetByIdAsync(id);

        if (task == null) return;

        task.Update(dto.Title, dto.Description, dto.DueDate, dto.Priority);

        await _repository.SaveChangesAsync(); 
    }

    public async Task DeleteAsync(Guid id)
    {
        var task = await _repository.GetByIdAsync(id);

        if (task == null) return;

        task.Delete();

        await _repository.SaveChangesAsync();
    }

    public async Task ToggleAsync(Guid id)
    {
        var task = await _repository.GetByIdAsync(id);

        if (task == null) return;

        task.Toggle();

        await _repository.SaveChangesAsync();
    }
}