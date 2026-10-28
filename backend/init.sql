CREATE TABLE IF NOT EXISTS tasks (
  id SERIAL PRIMARY KEY,
  project_name VARCHAR(150) NOT NULL,
  activity_type VARCHAR(100) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'Pendiente',
  summary VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  priority VARCHAR(30) NOT NULL,
  reporter VARCHAR(120) NOT NULL,
  assignee VARCHAR(120) NOT NULL,
  precondition TEXT,
  creation_date DATE NOT NULL,
  closing_date DATE,
  sprint VARCHAR(80) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
