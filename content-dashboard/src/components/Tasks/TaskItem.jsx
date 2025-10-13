import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { TASK_STATUS } from '../../utils/constants';
import './TaskItem.css';

const TaskItem = ({ task }) => {
  const { updateTask, deleteTask } = useData();
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState(task);

  const handleSave = () => {
    updateTask(task.id, editedTask);
    setIsEditing(false);
  };

  const handleStatusChange = (status) => {
    updateTask(task.id, { status });
  };

  const getStatusClass = (status) => {
    switch (status) {
      case TASK_STATUS.COMPLETED:
        return 'completed';
      case TASK_STATUS.IN_PROGRESS:
        return 'in-progress';
      case TASK_STATUS.BLOCKED:
        return 'blocked';
      default:
        return 'pending';
    }
  };

  if (isEditing) {
    return (
      <div className="task-item editing card shadow-m">
        <input
          type="text"
          value={editedTask.title}
          onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
        />
        <textarea
          value={editedTask.description}
          onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
          rows="2"
        />
        <div className="task-actions">
          <button onClick={handleSave} className="success">Save</button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </div>
      </div>
    );
  }

  return (
    <div className="task-item card shadow-s">
      <div className="task-content">
        <div className="task-header">
          <span className={`status-dot ${getStatusClass(task.status)}`}></span>
          <h4 className={task.status === TASK_STATUS.COMPLETED ? 'completed' : ''}>
            {task.title}
          </h4>
          {task.tag && (
            <span className="task-tag">{task.tag}</span>
          )}
        </div>
        {task.description && (
          <p className="task-description text-muted small">{task.description}</p>
        )}
      </div>

      <div className="task-footer">
        <div className="status-selector">
          <select
            value={task.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="status-select"
          >
            <option value={TASK_STATUS.PENDING}>Pending</option>
            <option value={TASK_STATUS.IN_PROGRESS}>In Progress</option>
            <option value={TASK_STATUS.COMPLETED}>Completed</option>
            <option value={TASK_STATUS.BLOCKED}>Blocked</option>
          </select>
        </div>

        <div className="task-actions">
          <button
            onClick={() => setIsEditing(true)}
            className="edit-btn"
            title="Edit task"
          >
            ✏️
          </button>
          <button
            onClick={() => deleteTask(task.id)}
            className="delete-btn danger"
            title="Delete task"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;