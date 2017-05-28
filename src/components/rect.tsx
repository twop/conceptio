import { Rectangle } from '../models/geometry/rectangle';
import * as React from 'react';

export interface RectProps extends React.SVGProps<SVGRectElement> {
  rect: Rectangle;
  onMouseDown?: React.MouseEventHandler<SVGRectElement>;
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

  private onMouseDown = (evt: React.MouseEvent<SVGRectElement>) => {
    if (this.props.onMouseDown) {
        this.props.onMouseDown(evt);
      }
  }
}
