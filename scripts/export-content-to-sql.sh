#!/bin/bash
# up2daite Content Export to SQL
# Exportiert neue/geänderte Content (Editions, Stories, Models, Jobs) aus der DB
# als versionierbares SQL-Skript — KEIN Claude, nur lokale DB-Abfrage

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
CONTENT_UPDATES_DIR="$PROJECT_DIR/db/content-updates"

# Konfiguration
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-45432}"
DB_USER="${DB_USER:-up2daite}"
DB_NAME="${DB_NAME:-up2daite}"
SINCE_DATE="${1:-$(date -u +%Y-%m-%d)}"  # Default: heute

# Sicherstellen, dass content-updates Ordner existiert
mkdir -p "$CONTENT_UPDATES_DIR"

TIMESTAMP=$(date +%Y-%m-%d_%H-%M-%S)
OUTPUT_FILE="$CONTENT_UPDATES_DIR/${SINCE_DATE}-content-${TIMESTAMP}.sql"

echo "📦 Exporting content from PostgreSQL..."
echo "   Date filter: $SINCE_DATE"
echo "   Output: $OUTPUT_FILE"
echo ""

# Header
cat > "$OUTPUT_FILE" << EOF
-- up2daite Content Export
-- Generated: $(date)
-- Filter: Entries since $SINCE_DATE

BEGIN;

EOF

# ─────────────────────────────────────────────────────────────────────────────
# EDITIONS (mit Editor-Notiz)
# ─────────────────────────────────────────────────────────────────────────────
echo "-- ═══ EDITIONS ═════════════════════════════════════════════" >> "$OUTPUT_FILE"

psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" \
  -t -A -F'|' \
  -c "SELECT id, slug, number, title, published_at, status, editor_note
      FROM editions
      WHERE published_at >= '$SINCE_DATE'::date
      ORDER BY published_at DESC" | \
while IFS='|' read -r id slug number title published_at status editor_note; do
  # Escape single quotes
  title="${title//\'/\'\'}"
  editor_note="${editor_note//\'/\'\'}"

  cat >> "$OUTPUT_FILE" << EOF

INSERT INTO editions (id, slug, number, title, published_at, status, editor_note)
VALUES (
  '$id',
  '$slug',
  $number,
  '$title',
  '$published_at',
  '$status',
  '$editor_note'
) ON CONFLICT (id) DO NOTHING;
EOF
done

# ─────────────────────────────────────────────────────────────────────────────
# STORIES (mit Signal Scores)
# ─────────────────────────────────────────────────────────────────────────────
echo "-- ═══ STORIES ═════════════════════════════════════════════" >> "$OUTPUT_FILE"

psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" \
  -t -A -F'|' \
  -c "SELECT s.id, s.title, s.editorial_comment, s.source_name, s.source_url, s.source_type,
          s.signal_impact, s.signal_hype_level, s.signal_source_quality,
          s.published_at, s.edition_id, s.edition_order
      FROM stories s
      WHERE s.published_at >= '$SINCE_DATE'::date
      ORDER BY s.published_at DESC" | \
while IFS='|' read -r id title comment source_name source_url source_type impact hype quality published_at edition_id order; do
  title="${title//\'/\'\'}"
  comment="${comment//\'/\'\'}"
  source_name="${source_name//\'/\'\'}"

  cat >> "$OUTPUT_FILE" << EOF

INSERT INTO stories (id, title, editorial_comment, source_name, source_url, source_type,
                     signal_impact, signal_hype_level, signal_source_quality,
                     published_at, edition_id, edition_order)
VALUES (
  '$id',
  '$title',
  '$comment',
  '$source_name',
  '$source_url',
  '$source_type',
  $impact,
  $hype,
  $quality,
  '$published_at',
  '$edition_id',
  $order
) ON CONFLICT (id) DO NOTHING;
EOF
done

# ─────────────────────────────────────────────────────────────────────────────
# STORY → TOPICS (Beziehungen)
# ─────────────────────────────────────────────────────────────────────────────
echo "-- ═══ STORY-TOPIC ASSIGNMENTS ═════════════════════════════" >> "$OUTPUT_FILE"

psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" \
  -t -A -F'|' \
  -c "SELECT st.story_id, st.topic_id
      FROM story_topics st
      INNER JOIN stories s ON s.id = st.story_id
      WHERE s.published_at >= '$SINCE_DATE'::date" | \
while IFS='|' read -r story_id topic_id; do
  cat >> "$OUTPUT_FILE" << EOF

INSERT INTO story_topics (story_id, topic_id)
VALUES ('$story_id', '$topic_id')
ON CONFLICT DO NOTHING;
EOF
done

# ─────────────────────────────────────────────────────────────────────────────
# AI MODELS (Updates nur wenn Rank/Score sich änderte)
# ─────────────────────────────────────────────────────────────────────────────
echo "-- ═══ AI MODELS (nur geänderte) ═══════════════════════════" >> "$OUTPUT_FILE"

psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" \
  -t -A -F'|' \
  -c "SELECT id, name, company, logo, gradient, accent_color, rank_pos, category, highlights, release_year
      FROM ai_models
      ORDER BY rank_pos ASC" | \
while IFS='|' read -r id name company logo gradient accent_color rank_pos category highlights release_year; do
  name="${name//\'/\'\'}"
  company="${company//\'/\'\'}"
  logo="${logo//\'/\'\'}"
  gradient="${gradient//\'/\'\'}"
  accent_color="${accent_color//\'/\'\'}"
  category="${category//\'/\'\'}"
  highlights="${highlights//\'/\'\'}"

  cat >> "$OUTPUT_FILE" << EOF

INSERT INTO ai_models (id, name, company, logo, gradient, accent_color, rank_pos, category, highlights, release_year)
VALUES (
  '$id',
  '$name',
  '$company',
  '$logo',
  '$gradient',
  '$accent_color',
  $rank_pos,
  '$category',
  '$highlights',
  $release_year
) ON CONFLICT (id) DO UPDATE SET
  rank_pos = EXCLUDED.rank_pos,
  category = EXCLUDED.category,
  highlights = EXCLUDED.highlights;
EOF
done

# ─────────────────────────────────────────────────────────────────────────────
# AI JOBS (Updates bei Risk Score/Trend Änderung)
# ─────────────────────────────────────────────────────────────────────────────
echo "-- ═══ AI JOBS (neu + aktualisiert) ════════════════════════" >> "$OUTPUT_FILE"

psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" \
  -t -A -F'|' \
  -c "SELECT id, title, category, risk_score, trend, reasoning, affected_tasks, sort_order
      FROM ai_jobs
      ORDER BY sort_order ASC" | \
while IFS='|' read -r id title category risk_score trend reasoning affected_tasks sort_order; do
  title="${title//\'/\'\'}"
  category="${category//\'/\'\'}"
  trend="${trend//\'/\'\'}"
  reasoning="${reasoning//\'/\'\'}"
  affected_tasks="${affected_tasks//\'/\'\'}"

  cat >> "$OUTPUT_FILE" << EOF

INSERT INTO ai_jobs (id, title, category, risk_score, trend, reasoning, affected_tasks, sort_order)
VALUES (
  '$id',
  '$title',
  '$category',
  $risk_score,
  '$trend',
  '$reasoning',
  '{$affected_tasks}',
  $sort_order
) ON CONFLICT (id) DO UPDATE SET
  risk_score = EXCLUDED.risk_score,
  trend = EXCLUDED.trend,
  reasoning = EXCLUDED.reasoning;
EOF
done

# Commit & Summary
cat >> "$OUTPUT_FILE" << EOF

COMMIT;

-- Summary:
-- Exported: $(date)
-- Since: $SINCE_DATE
-- Review before applying: psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME < $OUTPUT_FILE
EOF

echo ""
echo "✅ Export complete!"
echo ""
echo "📊 Content Statistics:"
psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "
  SELECT
    (SELECT count(*) FROM editions WHERE published_at >= '$SINCE_DATE'::date) as editions,
    (SELECT count(*) FROM stories WHERE published_at >= '$SINCE_DATE'::date) as stories,
    (SELECT count(*) FROM ai_models) as total_models,
    (SELECT count(*) FROM ai_jobs) as total_jobs;
"

echo ""
echo "📁 Output file:"
echo "   $OUTPUT_FILE"
echo ""

# Kopiere in "latest.sql" für CI/CD (wird in Git committed)
cp "$OUTPUT_FILE" "$BACKUP_DIR/latest.sql"

echo "Next steps:"
echo "  1. Review the SQL file: cat $OUTPUT_FILE"
echo "  2. Commit to Git: git add db/content-updates/ && git commit -m 'content: KW XX update'"
echo "  3. On next deploy: CI/CD applies latest.sql automatically"
