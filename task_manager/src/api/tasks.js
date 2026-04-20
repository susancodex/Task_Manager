import api from './axiosInstance';

export const getTasks = async (params = {}) => {
  const { data } = await api.get('/', { params });
  return data;
};

export const createTask = async (taskData) => {
  const { data } = await api.post('/', taskData);
  return data;
};

export const updateTask = async (id, taskData) => {
  const { data } = await api.put(`/${id}/`, taskData);
  return data;
};

export const deleteTask = async (id) => {
  await api.delete(`/${id}/`);
};
