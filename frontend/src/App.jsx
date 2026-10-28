import { useEffect, useMemo, useState } from 'react';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import { createTask, deleteTask, finishTask, getTasks, updateTask } from './api';

function App() {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  const stats = useMemo(() => ({
    total: tasks.length,
    pending: tasks.filter((task) => task.status !== 'Finalizada').length,
    finished: tasks.filter((task) => task.status === 'Finalizada').length,
    critical: tasks.filter((task) => task.priority === 'Crítica' && task.status !== 'Finalizada').length
  }), [tasks]);

  const loadTasks = async () => {
    setLoading(true);
    try {
      setTasks(await getTasks());
    } catch (error) {
      showMessage(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const showMessage = (text, type = 'success') => {
    setMessage({ text, type });
    window.setTimeout(() => setMessage(null), 3200);
  };

  const handleSave = async (task) => {
    setSaving(true);
    try {
      if (editingTask) {
        await updateTask(editingTask.id, task);
        showMessage('Tarea actualizada correctamente.');
      } else {
        await createTask(task);
        showMessage('Tarea creada correctamente.');
      }
      setEditingTask(null);
      await loadTasks();
    } catch (error) {
      showMessage(error.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Seguro que querés eliminar esta tarea?')) return;

    try {
      await deleteTask(id);
      if (editingTask?.id === id) setEditingTask(null);
      showMessage('Tarea eliminada correctamente.');
      await loadTasks();
    } catch (error) {
      showMessage(error.message, 'error');
    }
  };

  const handleFinish = async (id) => {
    try {
      await finishTask(id);
      if (editingTask?.id === id) setEditingTask(null);
      showMessage('Tarea finalizada correctamente.');
      await loadTasks();
    } catch (error) {
      showMessage(error.message, 'error');
    }
  };

  return (
    <div className="app-shell">
      <header className="hero">
        <div>
          <span className="hero-kicker">PROGRAMACIÓN AVANZADA · 2026</span>
          <h1>Task React</h1>
          <p>Gestor de tareas para proyectos de software</p>
        </div>
        <div className="hero-mark">TR</div>
      </header>

      <main className="content">
        <section className="stats-grid">
          <div className="stat-card"><span>Total</span><strong>{stats.total}</strong></div>
          <div className="stat-card"><span>Pendientes</span><strong>{stats.pending}</strong></div>
          <div className="stat-card"><span>Finalizadas</span><strong>{stats.finished}</strong></div>
          <div className="stat-card"><span>Críticas activas</span><strong>{stats.critical}</strong></div>
        </section>

        {message && <div className={`message message-${message.type}`}>{message.text}</div>}

        <TaskForm
          editingTask={editingTask}
          onSave={handleSave}
          onCancel={() => setEditingTask(null)}
          saving={saving}
        />

        <TaskList
          tasks={tasks}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onFinish={handleFinish}
        />
      </main>

      <footer>
        Licenciatura en Sistemas de Información · Programación Avanzada
      </footer>
    </div>
  );
}

export default App;
