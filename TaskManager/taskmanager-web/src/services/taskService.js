// Importación de axios, librería para hacer peticiones HTTP
import axios from 'axios';

// URL base de la API donde se encuentran las tareas (backend)
const API = 'http://localhost:5281/api/tasks';

/* Obtener todas las tareas

   - Hace una petición GET a la API
   - Devuelve únicamente los datos (r.data)
   - Se usa para listar todas las tareas en la UI */

export const getTasks = () =>
  axios.get(API).then(r => r.data);


/*   Crear una nueva tarea

   - Hace una petición POST a la API
   - Envía un objeto "task" en el body
   - Se usa para guardar nuevas tareas en el backend */

export const createTask = (task) =>
  axios.post(API, task);


/*  Actualizar una tarea completa

   - Hace una petición PUT
   - Recibe el ID de la tarea y los nuevos datos
   - Reemplaza completamente la tarea en el backend */

export const updateTask = (id, task) =>
  axios.put(`${API}/${id}`, task);


/* Eliminar una tarea

   - Hace una petición DELETE
   - Recibe el ID de la tarea a eliminar
   - Borra la tarea del backend */

export const deleteTask = (id) =>
  axios.delete(`${API}/${id}`);


/* Cambiar estado (Toggles)

   - Hace una petición PATCH
   - Cambia el estado de la tarea (por ejemplo:
     pendiente <-> completada)
   - No envía body, solo usa el ID */
   
export const toggleTask = (id) =>
  axios.patch(`${API}/${id}/toggle`);