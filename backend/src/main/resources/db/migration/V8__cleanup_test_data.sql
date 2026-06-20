-- Flyway Migration V8: Testdaten entfernen
-- Löscht manuell im Admin-UI angelegte Test-Ausgaben und Test-Jobs.

-- Testausgaben: story_topics + stories zuerst (FK), dann editions
DELETE FROM story_topics WHERE story_id IN (
    SELECT id FROM stories WHERE edition_id IN (
        'e5060b65-dad9-42e8-b546-0cf8d5b197a8',
        '82c258f0-1bdb-4aba-8d29-c81b2049946b',
        '0ecf3035-d8e4-4ff1-8d55-977d2954b4d9',
        'ede83aee-1f01-45af-8c74-b157b76a5daf'
    )
);

DELETE FROM stories WHERE edition_id IN (
    'e5060b65-dad9-42e8-b546-0cf8d5b197a8',
    '82c258f0-1bdb-4aba-8d29-c81b2049946b',
    '0ecf3035-d8e4-4ff1-8d55-977d2954b4d9',
    'ede83aee-1f01-45af-8c74-b157b76a5daf'
);

DELETE FROM editions WHERE id IN (
    'e5060b65-dad9-42e8-b546-0cf8d5b197a8',
    '82c258f0-1bdb-4aba-8d29-c81b2049946b',
    '0ecf3035-d8e4-4ff1-8d55-977d2954b4d9',
    'ede83aee-1f01-45af-8c74-b157b76a5daf'
);

-- Test-Job
DELETE FROM ai_jobs WHERE id = '8f919bdf-c3f3-4bc1-9fa3-1a93b0bb48be';
