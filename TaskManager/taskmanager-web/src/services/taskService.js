import axios from 'axios';

const API = 'http://localhost:5281/api/tasks';

export const getTasks = () => axios.get(API).then(r => r.data);

export const createTask = (task) => axios.post(API, task);

export const updateTask = (id, task) => axios.put(`${API}/${id}`, task);

export const deleteTask = (id) => axios.delete(`${API}/${id}`);

export const toggleTask = (id) => axios.patch(`${API}/${id}/toggle`);