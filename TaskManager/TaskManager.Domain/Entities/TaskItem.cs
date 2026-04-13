using System;
using System.Collections.Generic;
using System.Text;

using TaskManager.Domain.Enums;

namespace TaskManager.Domain.Entities;

public class TaskItem
{
    public Guid Id { get; private set; }
    public string Title { get; private set; } = string.Empty;
    public string? Description { get; private set; }

    public DateTime? DueDate { get; private set; } // ✅ FECHA

    public TaskPriority Priority { get; private set; } // ✅ PRIORIDAD
    public TaskState Status { get; private set; }

    public bool IsDeleted { get; private set; }
    public DateTime CreatedAt { get; private set; }

    public TaskItem(string title, string? description, DateTime? dueDate, TaskPriority priority)
    {
        if (string.IsNullOrWhiteSpace(title))
            throw new ArgumentException("El título es obligatorio");

        if (title.Length > 50)
            throw new ArgumentException("Máximo 50 caracteres");

        Id = Guid.NewGuid();
        Title = title;
        Description = description;
        DueDate = dueDate;
        Priority = priority;
        Status = TaskState.Pending;
        CreatedAt = DateTime.UtcNow;
        IsDeleted = false;
    }

    public void Update(string title, string? description, DateTime? dueDate, int priority)
    {
        Title = title;
        Description = description;
        DueDate = dueDate;
        Priority = (TaskPriority)priority;
    }

    public void Toggle()
    {
        Status = Status == TaskState.Completed
            ? TaskState.Pending
            : TaskState.Completed;
    }

    public void Delete()
    {
        IsDeleted = true;
    }
}