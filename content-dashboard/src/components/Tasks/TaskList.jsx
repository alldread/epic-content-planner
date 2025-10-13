import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { formatDate } from '../../utils/dateHelpers';
import { TASK_TAGS, TASK_STATUS } from '../../utils/constants';
import TaskItem from './TaskItem';
import './TaskList.css';

const TaskList = ({ date = null }) => {
  const { getTasks, addTask } = useData();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    tag: '',
    status: TASK_STATUS.PENDING,
    date: date ? formatDate(date) : ''
  });

  const tasks = getTasks(date);

  const handleAddTask = () => {
    if (newTask.title) {
      addTask(newTask);
      setNewTask({
        title: '',
        description: '',
        tag: '',
        status: TASK_STATUS.PENDING,
        date: date ? formatDate(date) : ''
      });
      setShowAddForm(false);
    }
  };

  return (
    <div className="task-list">
      <div className="task-list-header">
        <h3>Tasks {date && `for ${formatDate(date)}`}</h3>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="add-task-btn primary"
        >
          + Add Task
        </button>
      </div>

      {showAddForm && (
        <div className="add-task-form card shadow-m">
          <h4>New Task</h4>
          <div className="form-grid">
            <input
              type="text"
              placeholder="Task title..."
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              autoFocus
            />
            <textarea
              placeholder="Description (optional)..."
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              rows="2"
            />
            <select
              value={newTask.tag}
              onChange={(e) => setNewTask({ ...newTask, tag: e.target.value })}
            >
              <option value="">Select tag...</option>
              {TASK_TAGS.map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
            {!date && (
              <input
                type="date"
                value={newTask.date}
                onChange={(e) => setNewTask({ ...newTask, date: e.target.value })}
              />
            )}
            <div className="form-actions">
              <button onClick={handleAddTask} className="primary">
                Add Task
              </button>
              <button onClick={() => setShowAddForm(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="tasks-container">
        {tasks.length > 0 ? (
          tasks.map(task => (
            <TaskItem key={task.id} task={task} />
          ))
        ) : (
          <p className="no-tasks text-muted">No tasks scheduled</p>
        )}
      </div>
    </div>
  );
};

export default TaskList;