-- MERGE для hindrances
INSERT INTO hindrances (name, hindrance_type, description, source_id, source_page, language)
VALUES
    ('Loyal', 'Minor', 'Always protects friends.', 'SWADE', 54, 'en'),
    ('Преданность', 'Minor', 'Всегда защищает друзей.', 'SWADE', 54, 'ru'),
    ('One Arm', 'Major', 'Missing an arm, cannot use two-handed items.', 'SWADE', 55, 'en'),
    ('Одна рука', 'Major', 'Отсутствует одна рука, нельзя использовать двуручное.', 'SWADE', 55, 'ru')
ON CONFLICT (name, language, source_id) DO UPDATE SET
    hindrance_type = EXCLUDED.hindrance_type,
    description = EXCLUDED.description,
    source_page = EXCLUDED.source_page;