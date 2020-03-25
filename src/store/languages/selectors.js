import _ from 'lodash';

export function getItems(state) {
	return state.languages.itemsById;
}

export function getItemById(state, id) {
	return state.languages.itemsById['_' + id];
}

export function getCurrentItem(state) {
	return state.languages.currentItemId ? getItemById(state, state.languages.currentItemId) : null;
}