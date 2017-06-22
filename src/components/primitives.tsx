import { Rectangle } from '../models/geometry/rectangle';
import * as React from 'react';

export interface RectProps extends React.SVGProps<SVGGraphicsElement> {
  rect: Rectangle;
  onMouseDown?: React.MouseEventHandler<SVGGraphicsElement>;
}

export class Rect extends React.PureComponent<RectProps, void> {
  public render(): JSX.Element {
    const { x, y, width, height } = this.props.rect.normalize();
    return (
      <rect
        onMouseDown={this.onMouseDown}
        x={x}
        y={y}
        height={height}
        width={width}
        fill={this.props.fill}
        opacity={this.props.opacity}
      />
    );
  }

  private onMouseDown = (evt: React.MouseEvent<SVGGraphicsElement>) => {
    if (this.props.onMouseDown) {
      this.props.onMouseDown(evt);
    }
  }
}

export class Ellipse extends React.PureComponent<RectProps, void> {
  public render(): JSX.Element {
    const { x, y, width, height } = this.props.rect.normalize();
    return (
      <ellipse
        cx={x + width / 2}
        cy={y + height / 2}
        rx={width / 2}
        ry={height / 2}
        onMouseDown={this.onMouseDown}
        fill={this.props.fill}
        opacity={this.props.opacity}
      />
    );
  }

  private onMouseDown = (evt: React.MouseEvent<SVGGraphicsElement>) => {
    if (this.props.onMouseDown) {
      this.props.onMouseDown(evt);
    }
  }
}
