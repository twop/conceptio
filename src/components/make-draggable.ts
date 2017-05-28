// // import { Subject } from 'rxjs/Subject';
// import * as React from 'react';
// import * as ReactDOM from 'react-dom';

// import { DragAndDrop, IDragActions } from '../logic/dragndrop';

// export function makeDraggable<T>(Component: React.ComponentClass<T>): React.ComponentClass<T & IDraggableProps> {

//   type Props = T & IDraggableProps;
//   return class DraggableComponent extends React.Component<Props, void> {
//     private dragSubscription: IDragSubscription = null;
//     private readonly mouseDown$ = new Subject<React.MouseEvent<any>>();

//     // TODO remove type hack
//     private get draggableProps(): IDraggableProps {
//       return this.props as any;
//     }

//     private get componentProps(): T {
//       return this.props as any;
//     }

//     private onMouseDown = (evt: React.MouseEvent<any>) => {
//       if (this.draggableProps.onDown) { this.draggableProps.onDown(evt); }
//       this.mouseDown$.next(evt);
//     }

//     public componentDidMount() {
//       const {dnd, relativeTo} = this.draggableProps;

//       const parent = getParent(this, relativeTo);
//       this.dragSubscription = dnd.subscribe(this.props, this.mouseDown$, parent);
//     }

//     public componentWillUnmount() { this.dragSubscription.unsubscribe(); }

//     public render(): JSX.Element {
//       const props = Object.assign({}, this.componentProps, { onMouseDown: this.onMouseDown });
//       return React.createElement(Component, props);
//     }
//   };
// }
