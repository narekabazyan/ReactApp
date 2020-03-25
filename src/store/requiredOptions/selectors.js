import _ from 'lodash';

export function getItems(state) {
    return state.requiredOptions.itemsById;
}

export function getItemById(state, id) {
    return state.requiredOptions.itemsById['_' + id];
}

export function getCurrentItem(state) {
    return state.requiredOptions.currentItemId ? getItemById(state, state.requiredOptions.currentItemId) : null;
}