import { combineReducers } from 'redux'
import initData from '../modules/initData'
import { flags } from '../data/defaultFlags'
import { keys } from '../data/defaultKeys'

const sampleData = initData();
const defaultState = {
    flags: flags,
    keys: keys
}
const initialState = {...sampleData, ...defaultState};

const reduceTasks = (state = initialState.tasks, action) => {
    switch (action.type) {
        case 'UPDATE_TASKS':
            let updateTasks = {...state};
            updateTasks[action.key] = action.data
            return updateTasks;
        case 'REMOVE_TASKS':
            let removeTasks = {...state};
            delete removeTasks[action.key]
            return removeTasks;
        default:
            return state;
    }
};

const reduceMembers = (state = initialState.members, action) => {
    switch (action.type) {
        case 'UPDATE_MEMBERS':
            let updateMembers = {...state};
            updateMembers[action.key] = action.data;
            return updateMembers;
        case 'REMOVE_MEMBERS':
            let removeMembers = {...state};
            delete removeMembers[action.key];
            return removeMembers;
        default:
            return state;
    }
};

const reduceFlags = (state = initialState.flags, action) => {
    switch (action.type) {
        case 'UPDATE_FLAGS':
            return {...state, ...action.data};
        default:
            return state;
    }
};

const reduceKeys = (state = initialState.keys, action) => {
    switch (action.type) {
        case 'UPDATE_KEYS':
            return {...state, ...action.data};
        default:
            return state;
    }
};

export const reducer = combineReducers({
    tasks: reduceTasks,
    members: reduceMembers,
    flags: reduceFlags,
    keys: reduceKeys
})