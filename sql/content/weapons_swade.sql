INSERT INTO weapons (name, damage, range, ap, weight, notes, source_id, source_page, language)
VALUES 
    ('Dagger', 'Str+d4', '3/6/12', 0, 1, 'Can be thrown', 'SWADE', 93, 'en'),
    ('Longsword', 'Str+d8', '-', 0, 3, 'Parry +1', 'SWADE', 93, 'en'),
    ('Battle Axe', 'Str+d8', '-', 0, 2, '', 'SWADE', 93, 'en'),
    ('Pistol', '2d6', '12/24/48', 1, 2, 'Semi-Auto', 'SWADE', 94, 'en'),
    ('Rifle', '2d8', '24/48/96', 2, 8, 'Semi-Auto', 'SWADE', 94, 'en'),
    ('Кинжал', 'Сил+d4', '3/6/12', 0, 1, 'Можно метать', 'SWADE', 93, 'ru'),
    ('Длинный меч', 'Сил+d8', '-', 0, 3, 'Защита +1', 'SWADE', 93, 'ru'),
    ('Боевой топор', 'Сил+d8', '-', 0, 2, '', 'SWADE', 93, 'ru'),
    ('Пистолет', '2d6', '12/24/48', 1, 2, 'Полуавтомат', 'SWADE', 94, 'ru'),
    ('Винтовка', '2d8', '24/48/96', 2, 8, 'Полуавтомат', 'SWADE', 94, 'ru')
ON CONFLICT (name, language, source_id) DO UPDATE SET
    damage = EXCLUDED.damage,
    range = EXCLUDED.range,
    ap = EXCLUDED.ap,
    weight = EXCLUDED.weight,
    notes = EXCLUDED.notes,
    source_id = EXCLUDED.source_id,
    source_page = EXCLUDED.source_page;