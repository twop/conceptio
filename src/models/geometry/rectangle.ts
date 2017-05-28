import { Point } from './point';
import { Size } from './size';

export class Rectangle {
  public static fromSize(size: Size): Rectangle {
    return new Rectangle(0, 0, size.width, size.height);
  }

  public static betweenPoints(from: Point, to: Point): Rectangle {
    return new Rectangle(from.x, from.y, to.x - from.x, to.y - from.y);
  }

  public static fromCenter(center: Point, { width, height }: Size): Rectangle {
    return new Rectangle(center.x - width / 2, center.y - height / 2, width, height);
  }
  
  constructor(
    public x: number,
    public y: number,
    public width: number,
    public height: number) { }

  public contains(point: Point): boolean {
    return ((point.x >= this.x) && (point.x <= (this.x + this.width))
      && (point.y >= this.y) && (point.y <= (this.y + this.height)));
  }

  public normalize(): Rectangle {
    return new Rectangle(
      Math.min(this.x, this.right),
      Math.min(this.y, this.bottom),
      Math.abs(this.width),
      Math.abs(this.height));
  }

  public inflate(dx: number, dy: number) {
    this.x -= dx;
    this.y -= dy;
    this.width += dx + dx;
    this.height += dy + dy;
  }

  public moveBy(delta: Point): void {
    this.x += delta.x;
    this.y += delta.y;
  }

  public moveTo(newLocation: Point): Rectangle {
    return new Rectangle(newLocation.x, newLocation.y, this.width, this.height);
  }

  public union(rectangle: Rectangle): Rectangle {
    return new Rectangle(this.x, this.y, this.width, this.height).unionInPlace(rectangle);
  }

  public unionInPlace({ x, y, width, height }: Rectangle): Rectangle {
    const x1 = (this.x < x) ? this.x : x;
    const y1 = (this.y < y) ? this.y : y;
    const x2 = ((this.x + this.width) < (x + width)) ? (x + width) : (this.x + this.width);
    const y2 = ((this.y + this.height) < (y + height)) ? (y + height) : (this.y + this.height);

    this.x = x1;
    this.y = y1;
    this.width = x2 - x1;
    this.height = y2 - y1;

    return this;
  }

  public get leftTop(): Point {
    return new Point(this.x, this.y);
  }

  public get rightBottom(): Point {
    return new Point(this.x + this.width, this.y + this.height);
  }

  public get center(): Point {
    return new Point(this.x + this.width / 2, this.y + this.height / 2);
  }

  public get right(): number {
    return this.x + this.width;
  }

  public get bottom(): number {
    return this.y + this.height;
  }

  public clone(): Rectangle {
    return new Rectangle(this.x, this.y, this.width, this.height);
  }

}
