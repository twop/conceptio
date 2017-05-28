import * as React from 'react';
import './App.css';
import { DragAndDrop } from './logic/dragndrop';
import { Canvas } from './components/canvas';

const logo = require('./logo.svg');

export class App extends React.Component<{ dnd: DragAndDrop }, null> {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <Canvas width={800} dnd={this.props.dnd} />
      </div>
    );
  }
}

export default App;
