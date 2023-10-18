const CURSOR_OFFSET_X = -8;
const CURSOR_OFFSET_Y = 16;
const CURSOR_FONT_SIZE = "32px monospace";

export class CursorCommand {
  private x: number;
  private y: number;
  private readonly xOffset = CURSOR_OFFSET_X;
  private readonly yOffset = CURSOR_OFFSET_Y;
  private ctx: CanvasRenderingContext2D | null;

  constructor(ctx: CanvasRenderingContext2D | null, x: number, y: number) {
    this.x = x;
    this.y = y;
    this.ctx = ctx;
  }

  execute(): void {
    if (this.ctx) {
      this.ctx.font = CURSOR_FONT_SIZE;
      this.ctx.fillText("*", this.x + this.xOffset, this.y + this.yOffset);
    }
  }
}
