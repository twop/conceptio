import { Action } from 'redux';
export enum ToolbarIcon {
    undo,
    redo,
    delete
}

export interface ToolbarItem {
    enabled: boolean;
    action: Action;
    icon: ToolbarIcon;
    tooltip: string;
}
