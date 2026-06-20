export const CARD_W = 1080;
export const CARD_H = 1350;
export const PAD = 64;

export function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

export function drawGlowOrb(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  r: number,
  g: number,
  b: number,
  opacity: number,
) {
  const grad = ctx.createRadialGradient(x, y, 0, x, y, radius);
  grad.addColorStop(0, `rgba(${r},${g},${b},${opacity})`);
  grad.addColorStop(1, "transparent");
  ctx.fillStyle = grad;
  ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
}

export function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
): number {
  const words = text.split(" ");
  let line = "";
  let ly = y;
  for (const word of words) {
    const test = line + word + " ";
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line.trim(), x, ly);
      line = word + " ";
      ly += lineHeight;
    } else {
      line = test;
    }
  }
  ctx.fillText(line.trim(), x, ly);
  return ly;
}

export function drawBackground(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = "#0a1628";
  roundRect(ctx, 0, 0, CARD_W, CARD_H, 40);
  ctx.fill();
}

export function drawBorder(ctx: CanvasRenderingContext2D, color = "#1a2744") {
  roundRect(ctx, 0, 0, CARD_W, CARD_H, 40);
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.stroke();
}

export function drawHeader(ctx: CanvasRenderingContext2D) {
  ctx.font = "800 28px Inter";
  ctx.fillStyle = "#6366f1";
  ctx.textBaseline = "top";
  ctx.textAlign = "left";
  ctx.fillText("UP2DAITE", PAD, PAD);
}

export function drawFooter(ctx: CanvasRenderingContext2D, rightText: string) {
  ctx.font = "500 22px Inter";
  ctx.fillStyle = "#334155";
  ctx.textBaseline = "bottom";
  ctx.textAlign = "left";
  ctx.fillText("up2daite.com", PAD, CARD_H - PAD);
  ctx.textAlign = "right";
  ctx.fillText(rightText, CARD_W - PAD, CARD_H - PAD);
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
}

export function getISOWeek(dateStr: string): number {
  const d = new Date(dateStr);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7));
  const week1 = new Date(d.getFullYear(), 0, 4);
  return (
    1 +
    Math.round(
      ((d.getTime() - week1.getTime()) / 86400000 -
        3 +
        ((week1.getDay() + 6) % 7)) /
        7,
    )
  );
}

let fontLoaded = false;

export async function ensureFont(): Promise<void> {
  if (fontLoaded) return;
  try {
    await document.fonts.load("800 48px Inter");
    fontLoaded = true;
  } catch {
    fontLoaded = true;
  }
}
