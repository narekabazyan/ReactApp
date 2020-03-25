import _ from 'lodash';

export function getItems(state) {
	return state.steps.itemsById;
}

export function getItemById(state, id) {
	return state.steps.itemsById['_' + id];
}

export function getCurrentItem(state) {
	return state.steps.currentItemId ? getItemById(state, state.steps.currentItemId) : null;
}