// src/pages/PlanTemplate.jsx
import { useState } from 'react';
import Navbar from '../../components/navbar';

const PlanTemplate = () => {
  const [learningPeriod, setLearningPeriod] = useState('1');
  const [customRange, setCustomRange] = useState(false);
  const [maxWeeks, setMaxWeeks] = useState(1);
  const [tasks, setTasks] = useState([]);

  const handleLearningPeriodChange = (e) => {
    const value = e.target.value;
    setLearningPeriod(value);
    setCustomRange(value === 'Custom');
    setMaxWeeks(value !== 'Custom' ? parseInt(value) : 0);
    setTasks([]); // reset when duration changes
  };

  const handleAddTask = () => {
    if (maxWeeks && tasks.length >= maxWeeks) {
      alert('You can only add tasks up to the selected learning period!');
      return;
    }

    setTasks([...tasks, { id: tasks.length + 1, taskTitle: '', instructions: '', file: null }]);
  };

  const handleRemoveTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const handleTaskChange = (id, field, value) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, [field]: value } : task)));
  };

  return (
    <>
      <Navbar />

      <div className="container py-5">
        <h2 className="text-center mb-4">Create Your Skill Learning Plan</h2>

        {/* Learning Period Selection */}
        <div className="mb-4">
          <label className="form-label">Select Learning Duration (in Weeks):</label>
          <select className="form-select" value={learningPeriod} onChange={handleLearningPeriodChange}>
            <option value="1">1 Week</option>
            <option value="2">2 Weeks</option>
            <option value="4">4 Weeks</option>
            <option value="Custom">Custom</option>
          </select>
          {customRange && (
            <input
              type="number"
              className="form-control mt-2"
              placeholder="Enter number of weeks"
              min="1"
              value={maxWeeks}
              onChange={(e) => setMaxWeeks(parseInt(e.target.value))}
            />
          )}
        </div>

        {/* Task Creation Section */}
        <div className="mb-4">
          <h4>Tasks for Learning Plan</h4>
          {tasks.map((task, index) => (
            <div key={task.id} className="card mb-3 p-3">
              <div className="mb-2">
                <label>Task Title</label>
                <input
                  className="form-control"
                  placeholder="Task Title"
                  value={task.taskTitle}
                  onChange={(e) => handleTaskChange(task.id, 'taskTitle', e.target.value)}
                />
              </div>
              <div className="mb-2">
                <label>Instructions</label>
                <textarea
                  className="form-control"
                  placeholder="Instructions"
                  value={task.instructions}
                  onChange={(e) => handleTaskChange(task.id, 'instructions', e.target.value)}
                />
              </div>
              <div className="mb-2">
                <label>Upload Resource (optional)</label>
                <input
                  type="file"
                  className="form-control"
                  onChange={(e) => handleTaskChange(task.id, 'file', e.target.files[0])}
                />
              </div>
              <button className="btn btn-danger" onClick={() => handleRemoveTask(task.id)}>
                Remove Task
              </button>
            </div>
          ))}

          <button className="btn btn-secondary mt-2" onClick={handleAddTask}>
            Add Task
          </button>
        </div>

        {/* Submit Button (optional) */}
        <button className="btn btn-primary">Save Plan</button>

      </div>
      
    </>
    
  );
};

export default PlanTemplate;
