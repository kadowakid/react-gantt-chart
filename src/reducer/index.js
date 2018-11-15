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

const reduceCategories = (state = initialState.categories, action) => {
    switch (action.type) {
        case 'UPDATE_CATEGORIES':
            let updateCategories = {...state};
            updateCategories[action.key] = action.data;
            return updateCategories;
        case 'REMOVE_CATEGORIES':
            let removeCategories = {...state};
            delete removeCategories[action.key];
            return removeCategories;
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
    categories: reduceCategories,
    flags: reduceFlags,
    keys: reduceKeys
})