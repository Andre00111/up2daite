-- Flyway Migration V1: Initiales Datenbankschema
-- Alle Tabellen werden hier angelegt. Hibernate validiert nur dagegen (ddl-auto: validate).

CREATE TABLE topics (
    id    VARCHAR(50)  PRIMARY KEY,
    label VARCHAR(100) NOT NULL
);

CREATE TABLE editions (
    id          VARCHAR(100) PRIMARY KEY,
    slug        VARCHAR(200) UNIQUE NOT NULL,
    number      INTEGER      NOT NULL,
    title       VARCHAR(500) NOT NULL,
    published_at DATE,
    status      VARCHAR(20)  NOT NULL DEFAULT 'draft',
    editor_note TEXT
);

CREATE TABLE stories (
    id                   VARCHAR(100) PRIMARY KEY,
    title                VARCHAR(500) NOT NULL,
    editorial_comment    TEXT,
    source_name          VARCHAR(200),
    source_url           VARCHAR(500),
    source_type          VARCHAR(20),
    signal_impact        INTEGER,
    signal_hype_level    INTEGER,
    signal_source_quality INTEGER,
    published_at         DATE,
    edition_id           VARCHAR(100) REFERENCES editions(id),
    edition_order        INTEGER      -- redaktionelle Reihenfolge innerhalb der Ausgabe
);

CREATE TABLE story_topics (
    story_id VARCHAR(100) REFERENCES stories(id) ON DELETE CASCADE,
    topic_id VARCHAR(50)  REFERENCES topics(id),
    PRIMARY KEY (story_id, topic_id)
);

CREATE TABLE subscribers (
    id            VARCHAR(100) PRIMARY KEY,
    email         VARCHAR(200) UNIQUE NOT NULL,
    subscribed_at TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE TABLE subscriber_topics (
    subscriber_id VARCHAR(100) REFERENCES subscribers(id) ON DELETE CASCADE,
    topic_id      VARCHAR(50)  REFERENCES topics(id),
    PRIMARY KEY (subscriber_id, topic_id)
);
