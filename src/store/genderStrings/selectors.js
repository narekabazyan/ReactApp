import _ from 'lodash';

export function getItems(state) {
	return state.genderStrings.itemsById;
}

export function getItemsByPage(state, page) {
	if (!state.genderStrings.idsByPage['_' + page]) {
		page = (getPagination(state)).previousPage;
	}
	return _.map(state.genderStrings.idsByPage['_' + page], (itemId) => {
		return state.genderStrings.itemsById['_' + itemId]
	})
}

export function getItemById(state, id) {
	return state.genderStrings.itemsById['_' + id];
}

export function getCurrentItem(state) {
	return state.genderStrings.currentItemId ? getItemById(state, state.genderStrings.currentItemId) : null;
}

export function getFilters(state) {
	return state.genderStrings.filters;
}

export function getPagination(state) {
	return state.genderStrings.pagination;
}

export function getSorter(state) {
	return state.genderStrings.sorter;
}