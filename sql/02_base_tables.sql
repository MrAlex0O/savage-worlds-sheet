-- Create enum types for common values
CREATE TYPE language_type AS ENUM ('en', 'ru');
CREATE TYPE die_type AS ENUM ('d4', 'd6', 'd8', 'd10', 'd12');
CREATE TYPE attribute_type AS ENUM ('Agility', 'Smarts', 'Spirit', 'Strength', 'Vigor');
CREATE TYPE rank_type AS ENUM ('Novice', 'Seasoned', 'Veteran', 'Heroic', 'Legendary');
CREATE TYPE hindrance_type AS ENUM ('Major', 'Minor');
CREATE TYPE source_type AS ENUM (
    'SWADE', -- Savage Worlds Adventure Edition
    'SWADE_COMPANION', -- SWADE Companion
    'FANTASY_COMPANION',
    'HORROR_COMPANION',
    'SCI_FI_COMPANION',
    'SUPER_POWERS_COMPANION',
    'CUSTOM', -- For house rules or custom content
    'HOMEBREW' -- For community content
);

-- Create powers table
CREATE TABLE powers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    power_points INTEGER DEFAULT 0,
    range VARCHAR(50),
    duration VARCHAR(50),
    effect TEXT,
    source_id source_type NOT NULL DEFAULT 'SWADE',
    source_page INTEGER,
    language language_type
);

-- Create weapons table
CREATE TABLE weapons (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    damage VARCHAR(20),
    range VARCHAR(50),
    ap INTEGER DEFAULT 0,
    weight DECIMAL(5,2),
    notes TEXT,
    source_id source_type NOT NULL DEFAULT 'SWADE',
    source_page INTEGER,
    language language_type
);

-- Create edges table
CREATE TABLE edges (
    id SERIAL PRIMARY KEY, 
    name VARCHAR(100) NOT NULL,
    description TEXT,
    source_id source_type NOT NULL DEFAULT 'SWADE',
    source_page INTEGER,
    language language_type
);

-- Create hindrances table
CREATE TABLE hindrances (
    id SERIAL PRIMARY KEY, 
    name VARCHAR(100) NOT NULL,
    hindrance_type hindrance_type NOT NULL,
    description TEXT,
    source_id source_type NOT NULL DEFAULT 'SWADE',
    source_page INTEGER,
    language language_type
);

ALTER TABLE powers ADD CONSTRAINT unique_power_name_lang_source UNIQUE (name, language, source_id);
ALTER TABLE weapons ADD CONSTRAINT unique_weapon_name_lang_source UNIQUE (name, language, source_id);
ALTER TABLE edges ADD CONSTRAINT unique_edge_name_lang_source UNIQUE (name, language, source_id);
ALTER TABLE hindrances ADD CONSTRAINT unique_hindrance_name_lang_source UNIQUE (name, language, source_id);
NOTIFY pgrst;