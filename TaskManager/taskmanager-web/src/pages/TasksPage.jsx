// Importar hooks de React para manejar estado y efectos
import { useEffect, useState } from 'react';

// Importar servicios (CRUD de tareas desde backend o API)
import {
  getTasks,
  createTask,
  deleteTask,
  updateTask,
  toggleTask
} from '../services/taskService';

// Librería para alertas con mejor visualización
import Swal from 'sweetalert2';

function TasksPage() {

  // ESTADOS PRINCIPALES

  const [tasks, setTasks] = useState([]); // Lista de tareas

  // Campos del formulario
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState(1);

  // Control de edición
  const [editingId, setEditingId] = useState(null);

  // Filtro de tareas (todas, completa, pendiente)
  const [filter, setFilter] = useState('all');

  // Modo oscuro
  const [darkMode, setDarkMode] = useState(false);

 
  // CARGA DE TAREAS


  const loadTasks = async () => {
    const data = await getTasks(); // llama al backend
    setTasks(data); // guardar tareas en estado
  };

  // Se ejecuta la carga de tareas al montar el componente
  useEffect(() => {
    loadTasks();
  }, []);

  // CREAR / ACTUALIZAR TAREA

  const handleSubmit = async (e) => {
    e.preventDefault(); // evitar recarga de página

    // Si se está editando una tarea existente
    if (editingId) {
      await updateTask(editingId, {
        title,
        description,
        dueDate,
        priority
      });

      Swal.fire({
        icon: 'success',
        title: 'Actualizado',
        text: 'Tarea actualizada correctamente'
      });

      setEditingId(null); // salir del modo edición

    } else {
      // Crear nueva tarea
      await createTask({
        title,
        description,
        dueDate: dueDate ? new Date(dueDate).toISOString() : null,
        priority
      });

      Swal.fire({
        icon: 'success',
        title: 'Creado',
        text: 'Tarea creada correctamente'
      });
    }

    // Limpiar formulario después de guardar

    setTitle('');
    setDescription('');
    setDueDate('');
    setPriority(1);

    // Recargar lista

    loadTasks();
  };

  //  FILTRO DE TAREAS

  const filteredTasks = tasks.filter(t => {
    if (filter === 'completed') return t.status === 2;
    if (filter === 'pending') return t.status === 1;
    return true; // all
  });

  // RENDER UI

  return (
    <div className={darkMode ? "min-h-screen bg-gray-900 text-white p-6" : "min-h-screen bg-gray-100 p-6"}>

      <div className="max-w-2xl mx-auto">


        {/* BOTÓN MODO OSCURO */}

        <div className="text-right mb-4">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="px-3 py-1 bg-black text-white rounded"
          >
            {darkMode ? '🌙 ON' : '🌙 OFF'}
          </button>
        </div>

        {/* TÍTULO */}

        <h1 className="text-3xl font-bold mb-6 text-center">
          Gestión de Tareas
        </h1>


        {/* FORMULARIO */}

        <form
          onSubmit={handleSubmit}
          className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-4 rounded-xl shadow mb-6`}
        >

          {/* Título */}
          <input
            className="w-full p-2 border rounded mb-2 text-black"
            placeholder="Título"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          {/* Descripción */}
          <textarea
            className="w-full p-2 border rounded mb-2 text-black"
            placeholder="Descripción"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          {/* Fecha */}
          <input
            type="date"
            className="w-full p-2 border rounded mb-2 text-black"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
          />

          {/* Prioridad */}
          <select
            className="w-full p-2 border rounded mb-2 text-black"
            value={priority}
            onChange={(e) => setPriority(Number(e.target.value))}
          >
            <option value={1}>Baja</option>
            <option value={2}>Media</option>
            <option value={3}>Alta</option>
          </select>

          {/* Botón submit para crear o actualizar*/}
          <button className="w-full bg-blue-500 text-black p-2 rounded">
            {editingId ? 'Actualizar' : 'Crear'}
          </button>
        </form>


        {/* FILTROS */}

        <div className="flex justify-center gap-2 mb-4">

          <button onClick={() => setFilter('all')}>
            Todas
          </button>

          <button onClick={() => setFilter('pending')}>
            Pendientes
          </button>

          <button onClick={() => setFilter('completed')}>
            Completadas
          </button>

        </div>

        {/* LISTA DE TAREAS */}

        {filteredTasks.map((t) => {

          // Detecta si la tarea está vencida
          const isExpired = t.dueDate && new Date(t.dueDate) < new Date();

          return (
            <div key={t.id} className="p-4 bg-white rounded-xl shadow mb-4 flex justify-between">

              <div>

                {/* Título */}
                <h3 className={t.status === 2 ? 'line-through text-gray-400' : ''}>
                  {t.title}
                </h3>

                {/* Descripción */}
                <p>{t.description}</p>

                {/* Fecha */}
                <p>
                  📅 {t.dueDate
                    ? new Date(t.dueDate).toLocaleDateString()
                    : 'Sin fecha'}
                </p>

                {/* Prioridad */}
                <span>
                  {t.priority === 3
                    ? 'Alta 🔴'
                    : t.priority === 2
                    ? 'Media 🟡'
                    : 'Baja 🟢'}
                </span>

              </div>
              
              {/* ACCIONES */}

              <div className="flex gap-2">

                {/* Marcar como completada */}
                <button onClick={() => toggleTask(t.id).then(loadTasks)}>
                  ✔
                </button>

                {/* Editar tarea */}
                <button
                  onClick={() => {
                    setTitle(t.title);
                    setDescription(t.description);
                    setDueDate(t.dueDate ? t.dueDate.split('T')[0] : '');
                    setPriority(t.priority);
                    setEditingId(t.id);
                  }}
                >
                  ✏
                </button>

                {/* Eliminar tarea */}
                <button
                  onClick={() => {
                    Swal.fire({
                      title: '¿Eliminar tarea?',
                      icon: 'warning',
                      showCancelButton: true,
                    }).then(async (result) => {
                      if (result.isConfirmed) {
                        await deleteTask(t.id);
                        loadTasks();

                        Swal.fire('Eliminado', 'Tarea eliminada', 'success');
                      }
                    });
                  }}
                >
                  🗑
                </button>

              </div>
            </div>
          );
        })}

      </div>
    </div>
  );
}

export default TasksPage;