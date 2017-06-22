import { Action } from 'redux';

import { ToolType } from './IStore';
import { type } from './utils';

export const SELECT_TOOL = type('[Toolbar] select tool');

export interface SelectToolAction extends Action {
  tool: ToolType;
}

export const toolbarActions = {
    selectTool : (tool: ToolType): SelectToolAction => ({type: SELECT_TOOL, tool})
};