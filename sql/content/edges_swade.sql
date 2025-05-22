-- MERGE для edges
INSERT INTO edges (name, description, source_id, source_page, language)
VALUES 
    ('Alertness', 'You get +2 to Notice rolls.', 'SWADE', 40, 'en'),
    ('Бдительность', 'Вы получаете +2 к проверкам Замечания.', 'SWADE', 40, 'ru'),
    ('Ambidextrous', 'No off-hand penalty.', 'SWADE', 40, 'en'),
    ('Амбидекстр', 'Нет штрафа за неосновную руку.', 'SWADE', 40, 'ru')
ON CONFLICT (name, language, source_id) DO UPDATE SET
    description = EXCLUDED.description,
    source_page = EXCLUDED.source_page;