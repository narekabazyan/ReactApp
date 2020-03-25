import _ from 'lodash';

export function getItems(state) {
	return state.userDocuments.itemsById;
}

export function getItemsByPage(state, page) {
	if (!state.userDocuments.idsByPage['_' + page]) {
		page = (getPagination(state)).previousPage;
	}
	return _.map(state.userDocuments.idsByPage['_' + page], (itemId) => {
		return state.userDocuments.itemsById['_' + itemId]
	})
}

export function getItemById(state, id) {
	return state.userDocuments.itemsById['_' + id];
}

export function getCurrentItem(state) {
	return state.userDocuments.currentItemId ? getItemById(state, state.userDocuments.currentItemId) : null;
}

export function getFilters(state) {
	return state.userDocuments.filters;
}

export function getPagination(state) {
	return state.userDocuments.pagination;
}

export function getSorter(state) {
	return state.userDocuments.sorter;
}