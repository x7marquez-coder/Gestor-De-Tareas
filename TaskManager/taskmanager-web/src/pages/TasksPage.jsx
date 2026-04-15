// HOOKS DE REACT PARA MANEJAR ESTADO Y EFECTOS
import { useEffect, useState } from 'react';

// SERVICIOS (API / lógica externa para tareas)
import {
  getTasks,     // obtener tareas
  createTask,   // crear tarea
  deleteTask,   // eliminar tarea
  updateTask,   // actualizar tarea
  toggleTask    // marcar/desmarcar tarea
} from '../services/taskService';

// LIBRERÍA DE SWEET ALERT PARA ALERTAS MÁS VISUALES
import Swal from 'sweetalert2';

// IMAGEN LOCAL USADA COMO FONDO

import fondo from '../assets/background.jpg';

// COMPONENTE PRINCIPAL
function TasksPage() {

  // LISTA DE TAREAS OBTENIDAS DESDE LA API
  const [tasks, setTasks] = useState([]);

  // DATOS DEL FORMULARIO
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState(1);

  // CONTROL DE EDICIÓN DE TAREA
  const [editingId, setEditingId] = useState(null);

  // FILTRO DE TAREAS (TODAS, PENDIENTES, COMPLETADAS)
  const [filter, setFilter] = useState('all');

  // MODO OSCURO / CLARO
  const [darkMode, setDarkMode] = useState(false);

  // CARGA DE DATOS

  // FUNCIÓN PARA OBTENER LAS TAREAS DESDE EL BACKEND
  const loadTasks = async () => {
    const data = await getTasks();
    setTasks(data);
  };

  // SE EJECUTA UNA SOLA VEZ AL MONTAR EL COMPONENTE

  useEffect(() => {
    loadTasks();
  }, []);

  // CREAR / ACTUALIZAR TAREA

  const handleSubmit = async (e) => {
    e.preventDefault();

    // SI HAY ID, SE ESTÁ EDITANDO UNA TAREA
    if (editingId) {

      await updateTask(editingId, { title, description, dueDate, priority });

      // MENSAJE DE ÉXITO CON SWEET ALERT
      Swal.fire({
        icon: 'success',
        title: 'Actualizado',
        text: 'Tarea actualizada correctamente',
        confirmButtonColor: '#e99221'
      });

      setEditingId(null);

    } else {
      // SI NO HAY ID, SE CREA UNA NUEVA TAREA
      await createTask({
        title,
        description,
        dueDate: dueDate ? new Date(dueDate).toISOString() : null,
        priority
      });

      // ALERTA DE ÉXITO CON SWEET ALERT
      Swal.fire({
        icon: 'success',
        title: 'Creado',
        text: 'Tarea creada correctamente',
        confirmButtonColor: '#e99221'
      });
    }

    // LIMPIAR FORMULARIO DESPUÉS DE GUARDAR
    setTitle('');
    setDescription('');
    setDueDate('');
    setPriority(1);

    // RECARGAR LISTA DE TAREAS
    loadTasks();
  };

  // FILTRO DE TAREAS

  const filteredTasks = tasks.filter(t => {
    if (filter === 'completed') return t.status === 2;
    if (filter === 'pending') return t.status === 1;
    return true; // all
  });


  // RENDERIZADO
  return (

    // FONDO CON IMAGEN LOCAL
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${fondo})` }}
    >

      {/* OVERLAY PARA MEJORAR LEGIBILIDAD */}

      
      <div className={`min-h-screen p-6 ${darkMode ? 'bg-black/70 text-white' : 'bg-white/70'}`}>
                {/* BOTÓN MODO OSCURO */}
          <div className="text-right mb-1">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="px-2 py-0.5 bg-black text-white rounded-xl font-bold"
            >
              {darkMode ? '🌙 ON' : '🌙 OFF'}
            </button>
          </div>
        <div className="max-w-2xl mx-auto">


          {/* TÍTULO PRINCIPAL */}
          
          <h1 className="text-6xl md:text-4xl font-black mb-8 tracking-tighter text-left">
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-yellow-400">
              
              GESTOR 
            </span>
            <span className="{`${darkMode ? 'bg-gray-800' : 'bg-white'}"> DE TAREAS</span>
          </h1>


          {/* FORMULARIO */}
          <form
            onSubmit={handleSubmit}
            className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-4 rounded-xl shadow mb-6 backdrop-blur-md`}
          >

            {/* TÍTULO */}
            <input
              className="w-full p-2 border 
              rounded mb-2 text-black 
              font-bold
              hover:scale-105"
              placeholder="Título"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            {/* DESCRIPCIÓN */}
            <textarea
              className="w-full p-2 border 
              rounded mb-2 text-black font-bold
              hover:scale-105"
              placeholder="Descripción"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />

            {/* INPUT: FECHA */}
            <input
              type="date"
              className="w-full p-2 border rounded mb-2 text-black font-bold hover:scale-105"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
            />

            {/* SELECT: PRIORIDAD */}
            <select
              className="w-full p-2 border rounded mb-2 text-black font-bold hover:scale-105"
              value={priority}
              onChange={(e) => setPriority(Number(e.target.value))}
              required
            >
              <option value={1}>Baja</option>
              <option value={2}>Media</option>
              <option value={3}>Alta</option>
            </select>

            {/* BOTÓN SUBMIT */}
            <button className="w-full px-8 py-1 bg-gray-400 text-black duration-500 transition-shadow shadow-md shadow-gray-600 
            rounded-xl hover:shadow-xl hover:shadow-red-400 hover:scale-105
            font-bold">
                    
              {editingId ? 'Actualizar' : 'Crear'}
            </button>
          </form>


          {/* FILTROS */}
          <div className="flex justify-center gap-2 mb-4">

            <button
              onClick={() => setFilter('all')}
              className="px-3 py-1 bg-red-200 text-black duration-500 transition-shadow shadow-md shadow-red-400 
              hover:shadow-xl hover:shadow-yellow-400 rounded-xl hover:scale-105
              font-bold"
            >
              TODAS
            </button>

            <button
              onClick={() => setFilter('pending')}
              className="px-8 py-1 bg-gray-400 text-black duration-500 transition-shadow shadow-md shadow-gray-600 
              hover:shadow-xl hover:shadow-yellow-400 rounded-xl hover:scale-105
              font-bold"
            >
              PENDIENTES
            </button>

            <button
              onClick={() => setFilter('completed')}
              className="px-3 py-1 bg-orange-300 text-black duration-500 transition-shadow shadow-md shadow-orange-400 
              hover:shadow-xl hover:shadow-yellow-400 rounded-xl hover:scale-105
              font-bold"
            >
              COMPLETADAS
            </button>

          </div>


          {/* LISTA DE TAREAS */}
          {filteredTasks.map((t) => {

            // VERIFICA SI LA TAREA ESTÁ VENCIDA
            const isExpired = t.dueDate && new Date(t.dueDate) < new Date();

            return (
              <div
                key={t.id}
                className={`${darkMode ? 'bg-gray-800' : 'bg-white'} 
                p-4 rounded-xl shadow mb-4 flex justify-between items-center 
                transition transform hover:scale-105 
                hover:shadow-xl hover:shadow-red-400
                ${isExpired ? 'border-l-4 border-red-700' : ''}`}
              >

                {/* INFORMACIÓN DE LA TAREA */}
                <div>

                  {/* TÍTULO */}
                  <h3 className={`font-bold ${t.status === 2 ? 'line-through text-gray-400' : ''}`}>
                    {t.title}
                  </h3>

                  {/* DESCRIPCIÓN  */}
                  <p className="text-sm text-gray-500">
                    {t.description}
                  </p>

                  {/* FECHA */}
                  <p className="text-xs text-gray-400 mt-1">
                    📅 {t.dueDate
                      ? new Date(t.dueDate).toLocaleDateString()
                      : 'Sin fecha'}
                  </p>

                  {/* PRIORIDAD */}
                  <span
                    className={`text-xs font-bold mt-1 block ${
                      t.priority === 3
                        ? 'text-red-500'
                        : t.priority === 2
                        ? 'text-yellow-500'
                        : 'text-green-500'
                    }`}
                  >
                    {t.priority === 3
                      ? 'Alta 🔴'
                      : t.priority === 2
                      ? 'Media 🟡'
                      : 'Baja 🟢'}
                  </span>

                </div>

                {/* ACCIONES */}
                <div className="flex gap-2">

                  {/* MARCAR COMPLETADA */}
                  <button
                    onClick={() => toggleTask(t.id).then(loadTasks)}
                    className="bg-white text-black px-2 py-1 rounded 
                    hover:bg-green-400 transition
                    hover:scale-105 
                    hover:shadow-md hover:shadow-green-400"
                  >
                    ✔
                  </button>

                  {/* EDITAR TAREA */}
                  <button
                    onClick={() => {
                      setTitle(t.title);
                      setDescription(t.description);
                      setDueDate(t.dueDate ? t.dueDate.split('T')[0] : '');
                      setPriority(t.priority);
                      setEditingId(t.id);
                    }}
                    className="bg-white text-black px-2 py-1 rounded hover:bg-yellow-400 
                    transition hover:scale-105 
                    hover:shadow-md hover:shadow-yellow-400"
                  >
                    ✏
                  </button>

                  {/* ELIMINAR TAREA */}
                  <button
                    onClick={() => {
                      Swal.fire({
                        title: '¿Eliminar tarea?',
                        text: 'No podrás recuperarla',
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonText: 'Sí, eliminar',
                        confirmButtonColor: '#d63030'
                      }).then(async (result) => {
                        if (result.isConfirmed) {
                          await deleteTask(t.id);
                          loadTasks();
                          Swal.fire({
                            icon: 'success',
                            title: 'Eliminado', 
                            text: 'La tarea fue eliminada',
                            confirmButtonColor: '#e99221'
                          });
                        }
                      });
                    }}
                    className="bg-white text-black px-2 py-1 rounded hover:bg-red-500 
                    transition
                    hover:scale-105 
                    hover:shadow-md hover:shadow-red-500"
                  >
                    🗑
                  </button>

                </div>

              </div>
            );
          })}

        </div>
      </div>
    </div>
  );
}

//EXPORTACIÓN PARA REUTILIZR EN OTROS ARCHIVOS
export default TasksPage;