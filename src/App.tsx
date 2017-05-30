import * as React from 'react';
import './App.css';
import { DragAndDrop } from './logic/dragndrop';
import { Canvas } from './components/canvas';

export class App extends React.Component<{ dnd: DragAndDrop }, null> {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>Conceptio</h2>
          <h4>Fastfood for diagrams</h4>
          <div>mouse down => drag => mouse up : create rect</div>
          <div>then select a rect to move or resize using handlers.</div>
        </div>
        <Canvas width={800} dnd={this.props.dnd} />
      </div>
    );
  }
}

export default App;
