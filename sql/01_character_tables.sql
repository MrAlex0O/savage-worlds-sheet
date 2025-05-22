

-- Create characters table (main table)
CREATE TABLE characters (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    race VARCHAR(100),
    rank rank_type DEFAULT 'Novice',
    experience INTEGER DEFAULT 0,
    pace INTEGER DEFAULT 6,
    parry INTEGER DEFAULT 2,
    toughness INTEGER DEFAULT 4,
    charisma INTEGER DEFAULT 0,
    wounds INTEGER DEFAULT 0,
    fatigue INTEGER DEFAULT 0,
    bennies INTEGER DEFAULT 3,
    power_points INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create attributes table
CREATE TABLE character_attributes (
    id SERIAL PRIMARY KEY,
    character_id INTEGER REFERENCES characters(id) ON DELETE CASCADE,
    attribute attribute_type NOT NULL,
    die die_type NOT NULL DEFAULT 'd4',
    modifier INTEGER DEFAULT 0,
    UNIQUE(character_id, attribute)
);

-- Create skills table
CREATE TABLE character_skills (
    id SERIAL PRIMARY KEY,
    character_id INTEGER REFERENCES characters(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    die die_type NOT NULL DEFAULT 'd4',
    modifier INTEGER DEFAULT 0,
    linked_attribute attribute_type NOT NULL,
    language language_type NOT NULL DEFAULT 'en',
    UNIQUE(character_id, name)
);

-- Create edges table
CREATE TABLE character_edges (
    id SERIAL PRIMARY KEY,
    character_id INTEGER REFERENCES characters(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    source_id source_type NOT NULL DEFAULT 'SWADE',
    source_page INTEGER,
    language language_type NOT NULL DEFAULT 'en',
    UNIQUE(character_id, name)
);

-- Create hindrances table
CREATE TABLE character_hindrances (
    id SERIAL PRIMARY KEY,
    character_id INTEGER REFERENCES characters(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    hindrance_type hindrance_type NOT NULL,
    description TEXT,
    source_id source_type NOT NULL DEFAULT 'SWADE',
    source_page INTEGER,
    language language_type NOT NULL DEFAULT 'en',
    UNIQUE(character_id, name)
);

-- Create gear table
CREATE TABLE character_gear (
    id SERIAL PRIMARY KEY,
    character_id INTEGER REFERENCES characters(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    weight DECIMAL(5,2),
    notes TEXT,
    source_id source_type NOT NULL DEFAULT 'SWADE',
    source_page INTEGER
);

-- Create weapons table
CREATE TABLE character_weapons (
    id SERIAL PRIMARY KEY,
    character_id INTEGER REFERENCES characters(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    damage VARCHAR(20),
    range VARCHAR(50),
    ap INTEGER DEFAULT 0,
    weight DECIMAL(5,2),
    notes TEXT,
    source_id source_type NOT NULL DEFAULT 'SWADE',
    source_page INTEGER,
    language language_type NOT NULL DEFAULT 'en'
);

-- Create powers table
CREATE TABLE character_powers (
    id SERIAL PRIMARY KEY,
    character_id INTEGER REFERENCES characters(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    power_points INTEGER DEFAULT 0,
    range VARCHAR(50),
    duration VARCHAR(50),
    effect TEXT,
    source_id source_type NOT NULL DEFAULT 'SWADE',
    source_page INTEGER,
    language language_type NOT NULL DEFAULT 'en'
);

NOTIFY pgrst;