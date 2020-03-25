import _ from 'lodash';

export function getItems(state) {
	return state.documents.itemsById;
}

export function getItemsByCategory(state, catId) {
	let items =  _.map(state.documents.idsByCategory[`_${catId}`], (itemId) => {
		return state.documents.itemsById[`_${itemId}`];
	});

	return _.filter(items, item => item);
}

export function getItemById(state, id) {
	return state.documents.itemsById['_' + id];
}

export function getCurrentItem(state) {
	return state.documents.currentItemId ? getItemById(state, state.documents.currentItemId) : null;
}

export function getFilters(state) {
	return state.documents.filters;
}

export function getSorter(state) {
	return state.documents.sorter;
}

export function getSearchPlaceholder(state) {
	return state.documents.placeholder;
}

export function getDenyMessage(state) {
    return state.documents.denyMessage;
}

export function getStats(state) {
    return state.documents.stats;
}