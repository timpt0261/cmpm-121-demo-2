const FIRST_ITERATION = 0;

interface Coordinates {
  x: number;
  y: number;
}

const scale = 2;
const angle = 90;
const acuteAngle = angle / scale;
const obtuseAngle = angle * scale;
export class LineCommand {
  private points: Coordinates[] = [];
  private ctx: CanvasRenderingContext2D;
  private width: number;
  private color :string;

  private stickerMode = false;
  private sticker = ".";
  private stickerRotation =
    (Math.random() * angle - acuteAngle) * (Math.PI / obtuseAngle);

  constructor(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    color: string,
    stickerMode?: boolean,
    sticker?: string
  ) {
    this.ctx = ctx;
    this.points = [{ x, y }];
    this.width = width;
    if (stickerMode) this.stickerMode = stickerMode;
    if (sticker) this.sticker = sticker;
    this.color = color;
  }

  display(): void {
    if (this.stickerMode) {
      const { x, y } = this.points[FIRST_ITERATION];
      this.ctx.save(); // Save the current context state
      this.ctx.translate(x, y); // Translate to the sticker position
      this.ctx.rotate(this.stickerRotation); // Apply the initial random rotation
      this.ctx.font = "20px monospace";
      this.ctx.fillText(this.sticker, FIRST_ITERATION, FIRST_ITERATION); // Draw the sticker at the rotated position
      this.ctx.restore(); // Restore the context to its previous state
    } else {
      this.ctx.strokeStyle = this.color;
      this.ctx.lineWidth = this.width;
      this.ctx.beginPath();
      const { x, y } = this.points[FIRST_ITERATION];
      this.ctx.moveTo(x, y);
      for (const { x, y } of this.points) {
        this.ctx.lineTo(x, y);
      }
      this.ctx.stroke();
    }
  }
  grow(x: number, y: number): void {
    this.points.push({ x, y });
  }
}
