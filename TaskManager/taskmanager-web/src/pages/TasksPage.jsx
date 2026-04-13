import { useEffect, useState } from 'react';
import {
  getTasks,
  createTask,
  deleteTask,
  updateTask,
  toggleTask
} from '../services/taskService';

function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState(1);
  const [editingId, setEditingId] = useState(null);
  const [filter, setFilter] = useState('all');
  const [darkMode, setDarkMode] = useState(false);

  const loadTasks = async () => {
    const data = await getTasks();
    setTasks(data);
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingId) {
      await updateTask(editingId, {
        title,
        description,
        dueDate: dueDate ? new Date(dueDate).toISOString() : null,
        priority
      });
      setEditingId(null);
    } else {
      await createTask({
        title,
        description,
        dueDate: dueDate ? new Date(dueDate).toISOString() : null,
        priority
      });
    }

    // 🔥 limpiar formulario SIEMPRE
    setTitle('');
    setDescription('');
    setDueDate('');
    setPriority(1);

    loadTasks();
  };

  const filteredTasks = tasks.filter(t => {
    if (filter === 'completed') return t.status === 2;
    if (filter === 'pending') return t.status === 1;
    return true;
  });

  return (
    <div className={darkMode ? "min-h-screen bg-gray-900 text-white p-6" : "min-h-screen bg-gray-100 p-6"}>
      
      <div className="max-w-2xl mx-auto">

        {/* 🌙 MODO OSCURO */}
        <div className="text-right mb-4">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="px-3 py-1 bg-black text-white rounded"
          >
            {darkMode ? '☀️ LUZ' : '🌙 OSCURO'}
          </button>
        </div>

        <h1 className="text-3xl font-bold mb-6 text-center">
          📝 Gestión de Tareas
        </h1>

        {/* 🧾 FORMULARIO */}
        <form
          onSubmit={handleSubmit}
          className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-4 rounded-xl shadow mb-6`}
        >
          <input
            className="w-full p-2 border rounded mb-2 text-black"
            placeholder="Título"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            className="w-full p-2 border rounded mb-2 text-black"
            placeholder="Descripción"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <input
            type="date"
            className="w-full p-2 border rounded mb-2 text-black"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />

          <select
            className="w-full p-2 border rounded mb-2 text-black"
            value={priority}
            onChange={(e) => setPriority(Number(e.target.value))}
          >
            <option value={1}>Baja</option>
            <option value={2}>Media</option>
            <option value={3}>Alta</option>
          </select>

          <button className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition">
            {editingId ? 'Actualizar' : 'Crear'}
          </button>
        </form>

        {/* 🎛️ FILTROS */}
        <div className="flex justify-center gap-2 mb-4">
          <button
            onClick={() => setFilter('all')}
            className="px-3 py-1 bg-gray-300 rounded hover:scale-105 transition"
          >
            Todas
          </button>

          <button
            onClick={() => setFilter('pending')}
            className="px-3 py-1 bg-yellow-400 rounded hover:scale-105 transition"
          >
            Pendientes
          </button>

          <button
            onClick={() => setFilter('completed')}
            className="px-3 py-1 bg-green-500 text-white rounded hover:scale-105 transition"
          >
            Completadas
          </button>
        </div>

        {/* 📋 LISTA */}
        {filteredTasks.map((t) => {
          const isExpired = t.dueDate && new Date(t.dueDate) < new Date();

          return (
            <div
              key={t.id}
              className={`${darkMode ? 'bg-gray-800' : 'bg-white'} 
              p-4 rounded-xl shadow mb-4 flex justify-between items-center 
              transition transform hover:scale-105 
              ${isExpired ? 'border-l-4 border-red-500' : ''}`}
            >
              <div>
                <h3 className={`font-bold ${t.status === 2 ? 'line-through text-gray-400' : ''}`}>
                  {t.title}
                </h3>

                <p className="text-sm text-gray-500">
                  {t.description}
                </p>

                {/* 📅 FECHA */}
                <p className="text-xs text-gray-400 mt-1">
                  📅 {t.dueDate
                    ? new Date(t.dueDate).toLocaleDateString()
                    : 'Sin fecha'}
                </p>

                {/* 🎯 PRIORIDAD */}
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

              {/* 🔘 ACCIONES */}
              <div className="flex gap-2">
                <button
                  onClick={() => toggleTask(t.id).then(loadTasks)}
                  className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 transition"
                >
                  ✔
                </button>

                <button
                  onClick={() => {
                    setTitle(t.title);
                    setDescription(t.description);
                    setDueDate(t.dueDate ? t.dueDate.split('T')[0] : '');
                    setPriority(t.priority);
                    setEditingId(t.id);
                  }}
                  className="bg-yellow-400 text-white px-2 py-1 rounded hover:bg-yellow-500 transition"
                >
                  ✏
                </button>

                <button
                  onClick={() => deleteTask(t.id).then(loadTasks)}
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition"
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