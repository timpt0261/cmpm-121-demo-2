export class CursorCommand {
  private x: number;
  private y: number;
  private ctx: CanvasRenderingContext2D;
  private fontSize: string;
  private cursor = ".";

  constructor(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    fontSize: string,
    cursor?: string,
  ) {
    this.x = x;
    this.y = y;
    this.ctx = ctx;
    this.fontSize = fontSize;
    if (cursor) this.cursor = cursor;
  }

  draw(): void {
    const offest = -8;
    if (this.ctx) {
      this.ctx.font = this.fontSize;
      this.ctx.fillText(this.cursor, this.x + offest, this.y);
    }
  }
}
