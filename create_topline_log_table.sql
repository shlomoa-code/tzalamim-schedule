-- טבלה חדשה: יומן טופליין - רשומה קבועה לכל יום שבו הופעל טופליין
CREATE TABLE IF NOT EXISTS topline_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  log_date date NOT NULL UNIQUE,
  day_label text,
  description text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE topline_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "allow read topline_log" ON topline_log
  FOR SELECT USING (true);

CREATE POLICY "allow write topline_log" ON topline_log
  FOR ALL USING (true) WITH CHECK (true);
