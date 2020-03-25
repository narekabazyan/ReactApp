import _ from 'lodash';

export function getItems(state) {
	return state.groups.itemsById;
}

export function getItemsByPage(state, page) {
	if (!state.groups.idsByPage['_' + page]) {
		page = (getPagination(state)).previousPage;
	}
	return _.map(state.groups.idsByPage['_' + page], (itemId) => {
		return state.groups.itemsById['_' + itemId]
	})
}

export function getItemById(state, id) {
	return state.groups.itemsById['_' + id];
}

export function getCurrentItem(state) {
	return state.groups.currentItemId ? getItemById(state, state.groups.currentItemId) : null;
}

export function getFilters(state) {
	return state.groups.filters;
}

export function getPagination(state) {
	return state.groups.pagination;
}

export function getSorter(state) {
	return state.groups.sorter;
}