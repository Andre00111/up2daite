import type { Edition, Story } from "../../types";
import {
  CARD_W,
  CARD_H,
  PAD,
  roundRect,
  drawGlowOrb,
  wrapText,
  wrapTextClamped,
  drawBackground,
  drawBorder,
  drawHeader,
  getISOWeek,
} from "./canvasUtils";

const STORY_COLORS: Array<[string, string]> = [
  ["#22c55e", "#16a34a"],
  ["#3b82f6", "#1d4ed8"],
  ["#f59e0b", "#d97706"],
  ["#8b5cf6", "#6366f1"],
  ["#ef4444", "#dc2626"],
  ["#06b6d4", "#0891b2"],
];

const STORY_EMOJIS = ["📰", "💬", "⚖️", "🤖", "💼", "🔬"];

export function drawEditionCover(
  ctx: CanvasRenderingContext2D,
  edition: Edition,
  stories: Story[],
) {
  const W = CARD_W,
    H = CARD_H;

  drawBackground(ctx);
  drawGlowOrb(ctx, 200, H - 100, 500, 139, 92, 246, 0.06);
  drawGlowOrb(ctx, W - 100, 100, 350, 99, 102, 241, 0.08);
  drawBorder(ctx);
  drawHeader(ctx);

  // Ausgabe pill
  const ausgabeText = `Ausgabe #${edition.number}`;
  ctx.font = "600 22px Inter";
  const pillTextW = ctx.measureText(ausgabeText).width;
  const pillW = pillTextW + 48;
  roundRect(ctx, W - PAD - pillW, PAD - 6, pillW, 48, 24);
  ctx.fillStyle = "#1a2744";
  ctx.fill();
  ctx.strokeStyle = "#2d3f6b";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = "#94a3b8";
  ctx.textAlign = "center";
  ctx.fillText(ausgabeText, W - PAD - pillW / 2, PAD + 7);
  ctx.textAlign = "left";

  // Edition title
  ctx.font = "700 22px Inter";
  ctx.fillStyle = "#8b5cf6";
  ctx.fillText("DIESE WOCHE", PAD, 180);

  ctx.font = "900 62px Inter";
  ctx.fillStyle = "white";
  wrapText(ctx, edition.title, PAD, 220, W - PAD * 2, 76);

  // Decorative line
  const lineGrad = ctx.createLinearGradient(PAD, 0, W - PAD, 0);
  lineGrad.addColorStop(0, "#6366f1");
  lineGrad.addColorStop(0.5, "#8b5cf6");
  lineGrad.addColorStop(1, "transparent");
  ctx.fillStyle = lineGrad;
  ctx.fillRect(PAD, 340, W - PAD * 2, 2);

  // Story list — dynamische Kartenhöhe je nach Anzahl
  const visibleStories = stories.slice(0, 5);
  const N = visibleStories.length || 1;
  const storiesStartY = 380;
  const ctaY = H - 180;
  const GAP = 14;
  const cardH = Math.min(148, Math.max(100,
    Math.floor((ctaY - storiesStartY - 16 - GAP * (N - 1)) / N),
  ));
  const stride = cardH + GAP;
  const iconSz = Math.min(80, cardH - 24);
  const iconPad = Math.round((cardH - iconSz) / 2);
  const emojiSz = Math.round(iconSz * 0.5);
  const titleFontSz = cardH >= 130 ? 27 : 22;
  const titleLineH = titleFontSz + 9;

  visibleStories.forEach((story, i) => {
    const sy = storiesStartY + i * stride;
    const [c1, c2] = STORY_COLORS[i % STORY_COLORS.length];

    roundRect(ctx, PAD, sy, W - PAD * 2, cardH, 18);
    ctx.fillStyle = "#0f1f3d";
    ctx.fill();

    // Emoji icon box
    const iconX = PAD + 20;
    const iconY = sy + iconPad;
    const iconGrad = ctx.createLinearGradient(iconX, iconY, iconX + iconSz, iconY + iconSz);
    iconGrad.addColorStop(0, c1);
    iconGrad.addColorStop(1, c2);
    roundRect(ctx, iconX, iconY, iconSz, iconSz, 14);
    ctx.fillStyle = iconGrad;
    ctx.fill();

    ctx.font = `${emojiSz}px serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(STORY_EMOJIS[i % STORY_EMOJIS.length], iconX + iconSz / 2, iconY + iconSz / 2);
    ctx.textAlign = "left";
    ctx.textBaseline = "top";

    // Story title — max 2 Zeilen
    const titleX = PAD + 20 + iconSz + 20;
    const titleMaxW = W - PAD * 2 - iconSz - 60;
    const titleY = sy + Math.round((cardH - titleLineH * 2) / 2);
    ctx.font = `700 ${titleFontSz}px Inter`;
    ctx.fillStyle = "#e2e8f0";
    wrapTextClamped(ctx, story.title, titleX, titleY, titleMaxW, titleLineH, 2);
  });

  // CTA footer
  ctx.beginPath();
  ctx.moveTo(PAD, ctaY);
  ctx.lineTo(W - PAD, ctaY);
  ctx.strokeStyle = "#1a2744";
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.font = "500 22px Inter";
  ctx.fillStyle = "#334155";
  ctx.textBaseline = "top";
  ctx.fillText("up2daite.com", PAD, ctaY + 30);

  // CTA button
  const btnW = 260,
    btnH = 56;
  const btnX = W - PAD - btnW,
    btnY = ctaY + 16;
  const btnGrad = ctx.createLinearGradient(btnX, 0, btnX + btnW, 0);
  btnGrad.addColorStop(0, "#6366f1");
  btnGrad.addColorStop(1, "#8b5cf6");
  roundRect(ctx, btnX, btnY, btnW, btnH, 28);
  ctx.fillStyle = btnGrad;
  ctx.fill();
  ctx.font = "700 24px Inter";
  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.fillText("Jetzt lesen →", btnX + btnW / 2, btnY + 16);
  ctx.textAlign = "left";

  // Bottom footer
  ctx.font = "500 22px Inter";
  ctx.fillStyle = "#334155";
  ctx.textBaseline = "bottom";
  ctx.textAlign = "left";
  ctx.fillText("up2daite.com", PAD, H - PAD);
  const kw = getISOWeek(edition.publishedAt);
  ctx.textAlign = "right";
  ctx.fillText(`${visibleStories.length} Stories · KW ${kw}`, W - PAD, H - PAD);
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
}
