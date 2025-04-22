// src/pages/PlanTemplate.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from 'react-router-dom';

import Navbar from "../../components/common/navbar";
import TaskModal from '../../components/TaskModal';

const PlanTemplate = () => {
  
  const { id } = useParams(); // planId for edit mode
  const navigate = useNavigate();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    skill: '',
    tags: '',
    learningPeriodInDays: '',
    isPublic: false,
    tasks: []
  });

  const [showTaskModal, setShowTaskModal] = useState(false);
  const [taskBeingEditedIndex, setTaskBeingEditedIndex] = useState(null);
  const [error, setError] = useState('');

  // Fetch existing plan if editing
  useEffect(() => {
    if (isEdit) {
      const fetchPlan = async () => {
        const token = localStorage.getItem('token');
        const res = await fetch(`http://localhost:8080/api/learning-plans/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (res.ok) {
          const data = await res.json();
          setFormData({
            ...data,
            tags: data.tags.join(', '),
            learningPeriodInDays: data.learningPeriodInDays.toString()
          });
        } else {
          console.error('Failed to load plan');
        }
      };
      fetchPlan();
    }
  }, [id]);

  useEffect(() => {
    if (!id) {
      setFormData({
        title: '',
        description: '',
        skill: '',
        tags: '',
        learningPeriodInDays: '',
        isPublic: false,
        tasks: []
      });
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const openAddTaskModal = () => {
    setTaskBeingEditedIndex(null);
    setShowTaskModal(true);
  };

  const openEditTaskModal = (index) => {
    setTaskBeingEditedIndex(index);
    setShowTaskModal(true);
  };

  const handleSaveTask = (taskData) => {
    const updatedTasks = [...formData.tasks];
    if (taskBeingEditedIndex !== null) {
      updatedTasks[taskBeingEditedIndex] = taskData;
    } else {
      updatedTasks.push(taskData);
    }
    setFormData({ ...formData, tasks: updatedTasks });
  };

  const removeTask = (index) => {
    const updatedTasks = formData.tasks.filter((_, i) => i !== index);
    setFormData({ ...formData, tasks: updatedTasks });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const totalDuration = formData.tasks.reduce(
      (sum, task) => sum + parseInt(task.durationInDays || 0),
      0
    );

    if (totalDuration !== parseInt(formData.learningPeriodInDays)) {
      setError('Total task durations must equal the learning period.');
      return;
    }

    const payload = {
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()),
      learningPeriodInDays: parseInt(formData.learningPeriodInDays),
      tasks: formData.tasks.map(task => ({
        ...task,
        durationInDays: parseInt(task.durationInDays)
      }))
    };

    try {
      const token = localStorage.getItem('token');
      const url = isEdit
        ? `http://localhost:8080/api/learning-plans/${id}`
        : `http://localhost:8080/api/learning-plans`;

      const res = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        navigate('/plans');
      } else {
        const msg = await res.text();
        setError(msg);
      }
    } catch (err) {
      console.error(err);
      setError('Something went wrong.');
    }
  };


  return (
    <>
      <Navbar />
      <div className="container mt-5">
      <h2>{isEdit ? 'Edit' : 'Create'} Learning Plan</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input name="title" className="form-control" value={formData.title} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Description</label>
          <input name="description" className="form-control" value={formData.description} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label className="form-label">Skill</label>
          <input name="skill" className="form-control" value={formData.skill} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label className="form-label">Tags (comma-separated)</label>
          <input name="tags" className="form-control" value={formData.tags} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label className="form-label">Learning Period (days)</label>
          <input name="learningPeriodInDays" type="number" className="form-control" value={formData.learningPeriodInDays} onChange={handleChange} required />
        </div>
        <div className="form-check mb-4">
          <input type="checkbox" className="form-check-input" id="isPublic" name="isPublic" checked={formData.isPublic} onChange={handleChange} />
          <label className="form-check-label" htmlFor="isPublic">Make Plan Public</label>
        </div>

        <h4>Tasks</h4>
        {formData.tasks.length === 0 && <p>No tasks added yet.</p>}
        {formData.tasks.map((task, index) => (
          <div key={index} className="border rounded p-3 mb-3 bg-light d-flex justify-content-between align-items-start">
            <div>
              <strong>{task.title}</strong> – {task.durationInDays} day(s)
              <br />
              <small>Due: {task.dueDate}</small>
            </div>
            <div>
              <button type="button" className="btn btn-sm btn-outline-primary me-2" onClick={() => openEditTaskModal(index)}>Edit</button>
              <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => removeTask(index)}>Delete</button>
            </div>
          </div>
        ))}

        <button type="button" className="btn btn-outline-secondary mb-3" onClick={openAddTaskModal}>+ Add Task</button>
        <button type="submit" className="btn btn-primary w-100">{isEdit ? 'Update Plan' : 'Create Plan'}</button>
      </form>

      <TaskModal
        show={showTaskModal}
        onClose={() => setShowTaskModal(false)}
        onSave={handleSaveTask}
        initialTask={taskBeingEditedIndex !== null ? formData.tasks[taskBeingEditedIndex] : null}
        mode={taskBeingEditedIndex !== null ? 'edit' : 'add'}
      />
    </div>
      </>
    );
  };


export default PlanTemplate;
