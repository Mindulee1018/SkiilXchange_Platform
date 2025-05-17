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
      <Modal.Header
        closeButton
        style={{ backgroundColor: '#2563EB', color: 'white' }}
      >
        <Modal.Title>{mode === 'edit' ? 'Edit Task' : 'Add Task'}</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ backgroundColor: '#EFF6FF' }}>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label style={{ color: '#2563EB', fontWeight: '600' }}>Title *</Form.Label>
            <Form.Control
              name="title"
              value={task.title}
              onChange={handleChange}
              style={{ backgroundColor: '#DBEAFE' }}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label style={{ color: '#2563EB', fontWeight: '600' }}>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={task.description}
              onChange={handleChange}
              style={{ backgroundColor: '#DBEAFE' }}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label style={{ color: '#2563EB', fontWeight: '600' }}>Due Date *</Form.Label>
            <Form.Control
              type="date"
              name="dueDate"
              value={task.dueDate}
              onChange={handleChange}
              style={{ backgroundColor: '#DBEAFE' }}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label style={{ color: '#2563EB', fontWeight: '600' }}>Duration (in days) *</Form.Label>
            <Form.Control
              type="number"
              name="durationInDays"
              value={task.durationInDays}
              onChange={handleChange}
              style={{ backgroundColor: '#DBEAFE' }}
              required
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer style={{ backgroundColor: '#EFF6FF' }}>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleSubmit}
          style={{ backgroundColor: '#2563EB', borderColor: '#2563EB' }}
        >
          Save Task
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default TaskModal;