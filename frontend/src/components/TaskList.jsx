const formatDate = (date) => {
  if (!date) return '—';
  return new Date(`${date.slice(0, 10)}T12:00:00`).toLocaleDateString('es-AR');
};

function TaskList({ tasks, loading, onEdit, onDelete, onFinish }) {
  if (loading) {
    return (
      <section className="panel list-panel">
        <div className="empty-state">Cargando tareas...</div>
      </section>
    );
  }

  return (
    <section className="panel list-panel">
      <div className="section-heading list-heading">
        <div>
          <span className="eyebrow">PROYECTOS</span>
          <h2>Listado de Tareas</h2>
        </div>
        <span className="counter">{tasks.length} {tasks.length === 1 ? 'tarea' : 'tareas'}</span>
      </div>

      {tasks.length === 0 ? (
        <div className="empty-state">
          <strong>No hay tareas cargadas.</strong>
          <span>Completá el formulario para registrar la primera.</span>
        </div>
      ) : (
        <div className="task-list">
          {tasks.map((task) => (
            <article className="task-card" key={task.id}>
              <div className="task-card-top">
                <div>
                  <div className="task-meta-line">
                    <span className={`priority priority-${task.priority.toLowerCase().replace('í', 'i')}`}>
                      {task.priority}
                    </span>
                    <span className="sprint">{task.sprint}</span>
                  </div>
                  <h3>{task.summary}</h3>
                  <p className="project-name">{task.projectName}</p>
                </div>
                <span className={`status status-${task.status.toLowerCase().replaceAll(' ', '-')}`}>
                  {task.status}
                </span>
              </div>

              <p className="task-description">{task.description}</p>

              <div className="task-details">
                <div><span>Actividad</span><strong>{task.activityType}</strong></div>
                <div><span>Asignada a</span><strong>{task.assignee}</strong></div>
                <div><span>Informador</span><strong>{task.reporter}</strong></div>
                <div><span>Creación</span><strong>{formatDate(task.creationDate)}</strong></div>
                <div><span>Cierre</span><strong>{formatDate(task.closingDate)}</strong></div>
                <div><span>Precondición</span><strong>{task.precondition || 'Sin precondición'}</strong></div>
              </div>

              <div className="card-actions">
                <button className="button button-secondary" onClick={() => onEdit(task)}>
                  Editar
                </button>
                {task.status !== 'Finalizada' && (
                  <button className="button button-success" onClick={() => onFinish(task.id)}>
                    Finalizar
                  </button>
                )}
                <button className="button button-danger" onClick={() => onDelete(task.id)}>
                  Eliminar
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default TaskList;
