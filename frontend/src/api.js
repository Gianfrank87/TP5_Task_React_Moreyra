const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const request = async (url, options = {}) => {
  const response = await fetch(`${API_URL}${url}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Ocurrió un error inesperado.' }));
    throw new Error(error.message || 'Ocurrió un error inesperado.');
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
};

export const getTasks = () => request('/tasks');

export const createTask = (task) =>
  request('/tasks', {
    method: 'POST',
    body: JSON.stringify(task)
  });

export const updateTask = (id, task) =>
  request(`/tasks/${id}`, {
    method: 'PUT',
    body: JSON.stringify(task)
  });

export const finishTask = (id) =>
  request(`/tasks/${id}/finish`, {
    method: 'PATCH'
  });

export const deleteTask = (id) =>
  request(`/tasks/${id}`, {
    method: 'DELETE'
  });
