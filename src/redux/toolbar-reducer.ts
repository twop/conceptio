import { createReducer, HandlerMap } from 'nested-reducer';
import { Reducer } from 'redux';

import { Tool } from './IStore';
import { SELECT_TOOL, SelectToolAction } from './toolbar-actions';

const initialState: Tool = { active: 'rect' };

const toolbarHandlers: HandlerMap<Tool> = {
    [SELECT_TOOL]: (state, { tool }: SelectToolAction) => ({ ...state, active: tool })
};

export const toolbarReducer: Reducer<Tool> = createReducer(toolbarHandlers, initialState);