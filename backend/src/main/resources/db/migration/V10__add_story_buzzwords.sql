-- Flyway V10: Buzzwords-Feld für Stories
-- Speichert Keywords/Buzzwords als ||-separierte Liste (wie highlights bei AI Models).
-- Ermöglicht späteres Filtern nach Buzzwords wie "AGI", "Regulation", "Open Source" etc.

ALTER TABLE stories ADD COLUMN buzzwords TEXT NOT NULL DEFAULT '';
