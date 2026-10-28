import { useEffect, useState } from 'react';

const today = () => new Date().toISOString().slice(0, 10);

const initialForm = {
  projectName: '',
  activityType: 'Desarrollo',
  status: 'Pendiente',
  summary: '',
  description: '',
  priority: 'Media',
  reporter: '',
  assignee: '',
  precondition: '',
  creationDate: today(),
  closingDate: '',
  sprint: ''
};

function TaskForm({ editingTask, onSave, onCancel, saving }) {
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    if (editingTask) {
      setForm({
        ...editingTask,
        creationDate: editingTask.creationDate?.slice(0, 10) || today(),
        closingDate: editingTask.closingDate?.slice(0, 10) || ''
      });
    } else {
      setForm({ ...initialForm, creationDate: today() });
    }
  }, [editingTask]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSave(form);
  };

  return (
    <section className="panel form-panel">
      <div className="section-heading">
        <div>
          <span className="eyebrow">GESTIÓN</span>
          <h2>{editingTask ? 'Editar tarea' : 'Nueva tarea'}</h2>
        </div>
        {editingTask && <span className="edit-badge">Editando #{editingTask.id}</span>}
      </div>

      <form onSubmit={handleSubmit} className="task-form">
        <div className="form-grid">
          <label className="field field-wide">
            <span>Nombre del Proyecto</span>
            <input
              name="projectName"
              value={form.projectName}
              onChange={handleChange}
              placeholder="Ej: Sistema de Mesa de Ayuda"
              required
            />
          </label>

          <label className="field">
            <span>Tipo de Actividad</span>
            <select name="activityType" value={form.activityType} onChange={handleChange} required>
              <option>Desarrollo</option>
              <option>Análisis</option>
              <option>Diseño</option>
              <option>Testing</option>
              <option>Documentación</option>
              <option>Mantenimiento</option>
            </select>
          </label>

          <label className="field">
            <span>Estado</span>
            <select name="status" value={form.status} onChange={handleChange} required>
              <option>Pendiente</option>
              <option>En progreso</option>
              <option>Bloqueada</option>
              <option>Finalizada</option>
            </select>
          </label>

          <label className="field field-wide">
            <span>Resumen</span>
            <input
              name="summary"
              value={form.summary}
              onChange={handleChange}
              placeholder="Resumen breve de la tarea"
              maxLength="200"
              required
            />
          </label>

          <label className="field field-wide">
            <span>Descripción</span>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Detalle de la tarea a realizar"
              rows="4"
              required
            />
          </label>

          <label className="field">
            <span>Prioridad</span>
            <select name="priority" value={form.priority} onChange={handleChange} required>
              <option>Baja</option>
              <option>Media</option>
              <option>Alta</option>
              <option>Crítica</option>
            </select>
          </label>

          <label className="field">
            <span>Informador</span>
            <input
              name="reporter"
              value={form.reporter}
              onChange={handleChange}
              placeholder="Nombre del informador"
              required
            />
          </label>

          <label className="field">
            <span>Persona asignada</span>
            <input
              name="assignee"
              value={form.assignee}
              onChange={handleChange}
              placeholder="Responsable de la tarea"
              required
            />
          </label>

          <label className="field">
            <span>Sprint</span>
            <input
              name="sprint"
              value={form.sprint}
              onChange={handleChange}
              placeholder="Ej: Sprint 3"
              required
            />
          </label>

          <label className="field field-wide">
            <span>Precondición</span>
            <textarea
              name="precondition"
              value={form.precondition}
              onChange={handleChange}
              placeholder="Condiciones necesarias antes de comenzar"
              rows="3"
            />
          </label>

          <label className="field">
            <span>Fecha de Creación</span>
            <input
              type="date"
              name="creationDate"
              value={form.creationDate}
              onChange={handleChange}
              required
            />
          </label>

          <label className="field">
            <span>Fecha de Cierre</span>
            <input
              type="date"
              name="closingDate"
              value={form.closingDate || ''}
              onChange={handleChange}
              min={form.creationDate || undefined}
            />
          </label>
        </div>

        <div className="form-actions">
          {editingTask && (
            <button type="button" className="button button-secondary" onClick={onCancel}>
              Cancelar
            </button>
          )}
          <button type="submit" className="button button-primary" disabled={saving}>
            {saving ? 'Guardando...' : editingTask ? 'Guardar cambios' : 'Crear tarea'}
          </button>
        </div>
      </form>
    </section>
  );
}

export default TaskForm;
