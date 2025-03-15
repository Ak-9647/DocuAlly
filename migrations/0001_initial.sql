-- Migration number: 0001 	 2025-03-15
-- Not-DocuSign MVP Database Schema

-- Drop existing tables if they exist
DROP TABLE IF EXISTS counters;
DROP TABLE IF EXISTS access_logs;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS documents;
DROP TABLE IF EXISTS signatures;
DROP TABLE IF EXISTS document_shares;

-- Users table to store user information
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name TEXT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Documents table to store uploaded documents
CREATE TABLE IF NOT EXISTS documents (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  owner_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  file_path TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft', -- draft, sent, completed, voided
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Signatures table to store signature information
CREATE TABLE IF NOT EXISTS signatures (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  document_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  signature_image TEXT,
  position_x INTEGER,
  position_y INTEGER,
  page_number INTEGER,
  signed_at DATETIME,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Document shares table to track document sharing
CREATE TABLE IF NOT EXISTS document_shares (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  document_id INTEGER NOT NULL,
  shared_with_email TEXT NOT NULL,
  shared_with_id INTEGER,
  access_token TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, viewed, signed
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE,
  FOREIGN KEY (shared_with_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Access logs table for tracking system access
CREATE TABLE IF NOT EXISTS access_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  ip TEXT,
  path TEXT,
  accessed_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Create indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_documents_owner_id ON documents(owner_id);
CREATE INDEX idx_documents_status ON documents(status);
CREATE INDEX idx_signatures_document_id ON signatures(document_id);
CREATE INDEX idx_signatures_user_id ON signatures(user_id);
CREATE INDEX idx_document_shares_document_id ON document_shares(document_id);
CREATE INDEX idx_document_shares_shared_with_email ON document_shares(shared_with_email);
CREATE INDEX idx_document_shares_access_token ON document_shares(access_token);
CREATE INDEX idx_access_logs_user_id ON access_logs(user_id);
CREATE INDEX idx_access_logs_accessed_at ON access_logs(accessed_at);
