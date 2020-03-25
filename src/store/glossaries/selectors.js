import _ from 'lodash';

export function getItems(state) {
	return state.glossaries.itemsById;
}

export function getItemsByPage(state, page) {
	if (!state.glossaries.idsByPage['_' + page]) {
		page = (getPagination(state)).previousPage;
	}
	return _.map(state.glossaries.idsByPage['_' + page], (itemId) => {
		return state.glossaries.itemsById['_' + itemId]
	})
}

export function getItemById(state, id) {
	return state.glossaries.itemsById['_' + id];
}

export function getCurrentItem(state) {
	return state.glossaries.currentItemId ? getItemById(state, state.glossaries.currentItemId) : null;
}

export function getFilters(state) {
	return state.glossaries.filters;
}

export function getPagination(state) {
	return state.glossaries.pagination;
}

export function getSorter(state) {
	return state.glossaries.sorter;
}