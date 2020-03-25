import _ from 'lodash';

export function getItems(state) {
	return state.companies.itemsById;
}

export function getItemsByPage(state, page) {
	if (!state.companies.idsByPage['_' + page]) {
		page = (getPagination(state)).previousPage;
	}
	return _.map(state.companies.idsByPage['_' + page], (itemId) => {
		return state.companies.itemsById['_' + itemId]
	})
}

export function getItemById(state, id) {
	return state.companies.itemsById['_' + id];
}

export function getCurrentItem(state) {
	return state.companies.currentItemId ? getItemById(state, state.companies.currentItemId) : null;
}

export function getFilters(state) {
	return state.companies.filters;
}

export function getPagination(state) {
	return state.companies.pagination;
}

export function getSorter(state) {
	return state.companies.sorter;
}