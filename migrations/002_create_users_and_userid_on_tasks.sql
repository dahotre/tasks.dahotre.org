-- 1. Create the users table
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- 2. Add user_id to tasks and set up foreign key
ALTER TABLE tasks ADD COLUMN user_id INTEGER REFERENCES users(id); 