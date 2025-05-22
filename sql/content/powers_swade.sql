INSERT INTO powers (name, power_points, range, duration, effect, source_id, source_page, language)
VALUES 
    ('Bolt', 1, '12/24/48', 'Instant', '2d6 damage', 'SWADE', 163, 'en'),
    ('Healing', 3, 'Touch', 'Instant', 'Heal one wound', 'SWADE', 166, 'en'),
    ('Barrier', 2, '8', '3 (1/round)', 'Creates a wall of energy', 'SWADE', 163, 'en'),
    ('Стрела', 1, '12/24/48', 'Мгновенно', '2d6 урона', 'SWADE', 163, 'ru'),
    ('Лечение', 3, 'Касание', 'Мгновенно', 'Лечит одну рану', 'SWADE', 166, 'ru'),
    ('Барьер', 2, '8', '3 (1/раунд)', 'Создает стену энергии', 'SWADE', 163, 'ru')
ON CONFLICT (name, language, source_id) DO UPDATE SET
    power_points = EXCLUDED.power_points,
    range = EXCLUDED.range,
    duration = EXCLUDED.duration,
    effect = EXCLUDED.effect,
    source_id = EXCLUDED.source_id,
    source_page = EXCLUDED.source_page;