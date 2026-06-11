CREATE TABLE IF NOT EXISTS problems (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    difficulty TEXT NOT NULL,
    description TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS test_cases (
    id SERIAL PRIMARY KEY,
    problem_id INTEGER NOT NULL REFERENCES problems(id),
    input TEXT NOT NULL,
    expected_output TEXT NOT NULL,
    is_sample INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS submissions(
    local_id TEXT NOT NULL UNIQUE,
    id SERIAL PRIMARY KEY,
    problem_id INTEGER NOT NULL REFERENCES problems(id),
    code TEXT NOT NULL,
    verdict TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    synced_at TIMESTAMP,
    sync_attempts INTEGER DEFAULT 0
        
);

