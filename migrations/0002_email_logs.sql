-- Email logs table to track email events
CREATE TABLE IF NOT EXISTS email_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email_type VARCHAR(20) NOT NULL, -- 'invite', 'reminder', 'signed', 'completed'
  recipient_email VARCHAR(255) NOT NULL,
  document_id INTEGER NOT NULL,
  user_id VARCHAR(255), -- The user who triggered the email
  subject VARCHAR(255) NOT NULL,
  status VARCHAR(20) NOT NULL, -- 'sent', 'delivered', 'opened', 'clicked', 'failed'
  error_message TEXT,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  metadata TEXT, -- JSON string for additional data
  
  FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE
);

-- Indexes for email logs
CREATE INDEX idx_email_logs_document_id ON email_logs(document_id);
CREATE INDEX idx_email_logs_recipient_email ON email_logs(recipient_email);
CREATE INDEX idx_email_logs_email_type ON email_logs(email_type);
CREATE INDEX idx_email_logs_status ON email_logs(status);
CREATE INDEX idx_email_logs_timestamp ON email_logs(timestamp);

-- Sample data for testing
INSERT INTO email_logs (email_type, recipient_email, document_id, user_id, subject, status, timestamp)
VALUES 
  ('invite', 'john@example.com', 1, 'user_123', 'Please sign this document', 'sent', datetime('now', '-2 days')),
  ('invite', 'jane@example.com', 1, 'user_123', 'Please sign this document', 'sent', datetime('now', '-2 days')),
  ('delivered', 'john@example.com', 1, NULL, 'Please sign this document', 'delivered', datetime('now', '-2 days', '+5 minutes')),
  ('opened', 'john@example.com', 1, NULL, 'Please sign this document', 'opened', datetime('now', '-2 days', '+30 minutes')),
  ('signed', 'john@example.com', 1, 'user_456', 'John Doe has signed the document', 'sent', datetime('now', '-1 day')),
  ('reminder', 'jane@example.com', 1, 'user_123', 'Reminder: Please sign this document', 'sent', datetime('now', '-1 day')),
  ('opened', 'jane@example.com', 1, NULL, 'Reminder: Please sign this document', 'opened', datetime('now', '-1 day', '+15 minutes')),
  ('signed', 'jane@example.com', 1, 'user_789', 'Jane Smith has signed the document', 'sent', datetime('now', '-12 hours')),
  ('completed', 'john@example.com', 1, 'system', 'Document fully signed', 'sent', datetime('now', '-12 hours')),
  ('completed', 'jane@example.com', 1, 'system', 'Document fully signed', 'sent', datetime('now', '-12 hours')); 