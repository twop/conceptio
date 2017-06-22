import { ToolbarIcon, ToolbarItem } from '../models/toolbar';
import { Dispatch } from 'redux';
import { connect, MapStateToProps } from 'react-redux';
import { MuiTheme } from 'material-ui/styles';
import * as React from 'react';
import IconButton from 'material-ui/IconButton';
import UndoIcon from 'material-ui/svg-icons/content/undo';
import RedoIcon from 'material-ui/svg-icons/content/redo';
import RectIcon from 'material-ui/svg-icons/content/add-box';
import EllipseIcon from 'material-ui/svg-icons/content/add-circle';
import DeleteIcon from 'material-ui/svg-icons/action/delete';
import muiThemeable from 'material-ui/styles/muiThemeable';
import { check } from '../utils';
import { AppStore, ToolType } from '../redux/IStore';
import { canvasActions } from '../redux/canvas.actions';
import { toolbarActions } from '../redux/toolbar-actions';

export interface CommandToolbarProps {
    muiTheme?: MuiTheme;
}

export interface CommandToolbarReduxProps {
    items: ToolbarItem[];
    activeTool: ToolType;
}

export interface CommandToolbarState {
}

type Props = CommandToolbarProps & CommandToolbarReduxProps & { dispatch: Dispatch<{}> };

class CommandToolbarComponent extends React.Component<Props, CommandToolbarState> {
    render() {
        const backgroundColor = check(check(check(this.props.muiTheme).palette).canvasColor);
        const dispatch: Dispatch<{}> = this.props.dispatch;
        return (
            <div style={{ backgroundColor }}>
                <IconButton
                    key={'rectTool'}
                    onTouchTap={() => dispatch(toolbarActions.selectTool('rect'))}
                    tooltip={'rect tool'}
                >
                    <RectIcon />
                </IconButton>
                <IconButton
                    key={'ellipseTool'}
                    onTouchTap={() => dispatch(toolbarActions.selectTool('ellipse'))}
                    tooltip={'ellipse tool'}
                >
                    <EllipseIcon />
                </IconButton>
                {this.props.items.map(({ tooltip, action, icon, enabled }) => (
                    <IconButton
                        key={icon}
                        onTouchTap={() => dispatch(action)}
                        disabled={!enabled}
                        tooltip={tooltip}
                    >
                        {renderIcon(icon)}
                    </IconButton>)
                )}
            </div>
        );
    }
}

function renderIcon(icon: ToolbarIcon): JSX.Element {
    switch (icon) {
        case ToolbarIcon.delete:
            return <DeleteIcon />;

        case ToolbarIcon.redo:
            return <RedoIcon />;

        case ToolbarIcon.undo:
            return <UndoIcon />;

        default:
            throw new Error('unkown element');
    }
}

const mapStateToProps: MapStateToProps<CommandToolbarReduxProps, CommandToolbarProps> =
    ({ canvas, tool }: AppStore) => {
        const present = canvas.present;
        const newProps: CommandToolbarReduxProps = {
            activeTool: tool.active,
            items: [
                {
                    action: canvasActions.undo(),
                    enabled: canvas.past.length > 0,
                    icon: ToolbarIcon.undo,
                    tooltip: 'Undo'
                },
                {
                    action: canvasActions.redo(),
                    enabled: canvas.future.length > 0,
                    icon: ToolbarIcon.redo,
                    tooltip: 'Redo'
                },
                {
                    action: canvasActions.deleteFigure(present.selected),
                    enabled: present.selected !== 0,
                    icon: ToolbarIcon.delete,
                    tooltip: 'Delete'
                },
            ]
        };

        return newProps;
    };

export const CommandToolbar = muiThemeable()(connect(mapStateToProps)(CommandToolbarComponent));