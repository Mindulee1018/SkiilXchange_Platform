// components/TaskModal.jsx
import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const TaskModal = ({ show, onClose, onSave, initialTask, mode }) => {
  const [task, setTask] = useState({
    title: '',
    description: '',
    dueDate: '',
    durationInDays: ''
  });

  useEffect(() => {
    if (initialTask) {
      setTask(initialTask);
    } else {
      setTask({ title: '', description: '', dueDate: '', durationInDays: '' });
    }
  }, [initialTask]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onSave(task);
    onClose();
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{mode === 'edit' ? 'Edit Task' : 'Add Task'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control name="title" value={task.title} onChange={handleChange} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control name="description" value={task.description} onChange={handleChange} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Due Date</Form.Label>
            <Form.Control type="date" name="dueDate" value={task.dueDate} onChange={handleChange} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Duration (in days)</Form.Label>
            <Form.Control type="number" name="durationInDays" value={task.durationInDays} onChange={handleChange} required />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button variant="primary" onClick={handleSubmit}>Save Task</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default TaskModal;