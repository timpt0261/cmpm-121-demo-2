const LINE_STROKE_WIDTH = 4;
const FIRST_ITERATION = 0;

interface Coordinates {
  x: number;
  y: number;
}
export class LineCommand {
  private points: Coordinates[] = [];
  private ctx: CanvasRenderingContext2D;

  constructor(ctx: CanvasRenderingContext2D, x: number, y: number) {
    this.ctx = ctx;
    this.points = [{ x, y }];
  }

  display(): void {
    if (this.ctx) {
      this.ctx.strokeStyle = "black";
      this.ctx.lineWidth = LINE_STROKE_WIDTH;
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
