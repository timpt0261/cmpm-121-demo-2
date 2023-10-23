const FIRST_ITERATION = 0;

interface Coordinates {
  x: number;
  y: number;
}

export class LineCommand {
  private points: Coordinates[] = [];
  private ctx: CanvasRenderingContext2D;
  private width: number;

  private stickerMode = false;
  private sticker = ".";

  constructor(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    stickerMode?: boolean,
    sticker?: string,
  ) {
    this.ctx = ctx;
    this.points = [{ x, y }];
    this.width = width;
    if (stickerMode) this.stickerMode = stickerMode;
    if (sticker) this.sticker = sticker;
  }

  display(): void {
    if (this.stickerMode) {
      // place sticker in canvas
      const { x, y } = this.points[FIRST_ITERATION];
      this.ctx.fillText(this.sticker, x, y);
    } else {
      this.ctx.strokeStyle = "black";
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
