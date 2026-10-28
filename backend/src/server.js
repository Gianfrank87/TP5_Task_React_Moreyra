import express from 'express';
import cors from 'cors';
import { pool } from './db.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const taskFields = `
  id,
  project_name AS "projectName",
  activity_type AS "activityType",
  status,
  summary,
  description,
  priority,
  reporter,
  assignee,
  precondition,
  creation_date AS "creationDate",
  closing_date AS "closingDate",
  sprint,
  created_at AS "createdAt",
  updated_at AS "updatedAt"
`;

const normalizeTask = (body) => ({
  projectName: body.projectName?.trim(),
  activityType: body.activityType?.trim(),
  status: body.status?.trim() || 'Pendiente',
  summary: body.summary?.trim(),
  description: body.description?.trim(),
  priority: body.priority?.trim(),
  reporter: body.reporter?.trim(),
  assignee: body.assignee?.trim(),
  precondition: body.precondition?.trim() || '',
  creationDate: body.creationDate,
  closingDate: body.closingDate || null,
  sprint: body.sprint?.trim()
});

const validateTask = (task) => {
  const required = [
    'projectName',
    'activityType',
    'status',
    'summary',
    'description',
    'priority',
    'reporter',
    'assignee',
    'creationDate',
    'sprint'
  ];

  return required.filter((field) => !task[field]);
};

app.get('/api/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok' });
  } catch {
    res.status(500).json({ status: 'error' });
  }
});

app.get('/api/tasks', async (_req, res) => {
  try {
    const result = await pool.query(`SELECT ${taskFields} FROM tasks ORDER BY id DESC`);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'No se pudieron obtener las tareas.' });
  }
});

app.get('/api/tasks/:id', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT ${taskFields} FROM tasks WHERE id = $1`,
      [req.params.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Tarea no encontrada.' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'No se pudo obtener la tarea.' });
  }
});

app.post('/api/tasks', async (req, res) => {
  const task = normalizeTask(req.body);
  const missingFields = validateTask(task);

  if (missingFields.length > 0) {
    return res.status(400).json({
      message: 'Hay campos obligatorios incompletos.',
      fields: missingFields
    });
  }

  try {
    const result = await pool.query(
      `INSERT INTO tasks (
        project_name, activity_type, status, summary, description,
        priority, reporter, assignee, precondition, creation_date,
        closing_date, sprint
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING ${taskFields}`,
      [
        task.projectName,
        task.activityType,
        task.status,
        task.summary,
        task.description,
        task.priority,
        task.reporter,
        task.assignee,
        task.precondition,
        task.creationDate,
        task.closingDate,
        task.sprint
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'No se pudo crear la tarea.' });
  }
});

app.put('/api/tasks/:id', async (req, res) => {
  const task = normalizeTask(req.body);
  const missingFields = validateTask(task);

  if (missingFields.length > 0) {
    return res.status(400).json({
      message: 'Hay campos obligatorios incompletos.',
      fields: missingFields
    });
  }

  try {
    const result = await pool.query(
      `UPDATE tasks SET
        project_name = $1,
        activity_type = $2,
        status = $3,
        summary = $4,
        description = $5,
        priority = $6,
        reporter = $7,
        assignee = $8,
        precondition = $9,
        creation_date = $10,
        closing_date = $11,
        sprint = $12,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $13
      RETURNING ${taskFields}`,
      [
        task.projectName,
        task.activityType,
        task.status,
        task.summary,
        task.description,
        task.priority,
        task.reporter,
        task.assignee,
        task.precondition,
        task.creationDate,
        task.closingDate,
        task.sprint,
        req.params.id
      ]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Tarea no encontrada.' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'No se pudo actualizar la tarea.' });
  }
});

app.patch('/api/tasks/:id/finish', async (req, res) => {
  try {
    const result = await pool.query(
      `UPDATE tasks SET
        status = 'Finalizada',
        closing_date = CURRENT_DATE,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING ${taskFields}`,
      [req.params.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Tarea no encontrada.' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'No se pudo finalizar la tarea.' });
  }
});

app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM tasks WHERE id = $1 RETURNING id', [req.params.id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Tarea no encontrada.' });
    }

    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'No se pudo eliminar la tarea.' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor iniciado en el puerto ${PORT}`);
});
