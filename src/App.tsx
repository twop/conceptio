import * as React from 'react';

import { CommandToolbar } from './containers/toolbar';
import { DragAndDrop } from './logic/dragndrop';
import { Canvas } from './containers/canvas';
import { MuiThemeProvider } from 'material-ui/styles';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

const theme = getMuiTheme(darkBaseTheme);
export class App extends React.Component<{ dnd: DragAndDrop }, null> {
  render() {
    return (
      <MuiThemeProvider muiTheme={theme}>
        <div>
          <CommandToolbar />
          <Canvas width={800} dnd={this.props.dnd} />
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
