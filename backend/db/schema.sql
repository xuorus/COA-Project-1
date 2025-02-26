START TRANSACTION;
SET TIME ZONE 'UTC';

-- Encoding is usually set at the database level, but we can enforce UTF-8 if needed
SET client_encoding = 'UTF8';

DROP TRIGGER IF EXISTS update_person_updated_at ON person;
DROP FUNCTION IF EXISTS update_updated_at_column();

-- Create person table with proper references
CREATE TABLE IF NOT EXISTS "person" (
  "PID" SERIAL PRIMARY KEY,
  "fName" VARCHAR(255),
  "mName" VARCHAR(255),
  "lName" VARCHAR(255),
  "bloodType" VARCHAR(5),
  "profession" VARCHAR(255),
  "hobbies" TEXT,
  "pdsID" INTEGER REFERENCES pds("pdsID") ON DELETE SET NULL,
  "salnID" INTEGER REFERENCES saln("salnID") ON DELETE SET NULL
);

-- Create pds table
CREATE TABLE IF NOT EXISTS "pds" (
  "pdsID" INTEGER NOT NULL,
  "PDSfile" BYTEA NOT NULL
);

-- Create saln table
CREATE TABLE IF NOT EXISTS "saln" (
  "salnID" INTEGER NOT NULL,
  "SALNfile" BYTEA NOT NULL
);

-- Create logs table
CREATE TABLE IF NOT EXISTS "logs" (
  "PID" INTEGER DEFAULT NULL,
  "status" VARCHAR(50) NOT NULL,
  "timestamp" TIMESTAMP DEFAULT current_timestamp
);

-- -- Add foreign key constraints if not already added
-- ALTER TABLE "logs"
--   ADD CONSTRAINT fk_logs_person
--   FOREIGN KEY ("PID") 
--   REFERENCES "person"("PID")
--   ON DELETE SET NULL;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_person_name ON person("lName", "fName", "mName");
CREATE INDEX IF NOT EXISTS idx_person_blood_type ON person("bloodType");
CREATE INDEX IF NOT EXISTS idx_logs_pid ON logs("PID");
CREATE INDEX IF NOT EXISTS idx_logs_timestamp ON logs("timestamp" DESC);

COMMIT;