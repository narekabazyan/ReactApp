import _ from 'lodash';

export function getItems(state) {
	return state.companyCategories.itemsById;
}

export function getItemsByPage(state, page) {
	if (!state.companyCategories.idsByPage['_' + page]) {
		page = (getPagination(state)).previousPage;
	}
	return _.map(state.companyCategories.idsByPage['_' + page], (itemId) => {
		return state.companyCategories.itemsById['_' + itemId]
	})
}

export function getItemById(state, id) {
	return state.companyCategories.itemsById['_' + id];
}

export function getCurrentItem(state) {
	return state.companyCategories.currentItemId ? getItemById(state, state.companyCategories.currentItemId) : null;
}

export function getFilters(state) {
	return state.companyCategories.filters;
}

export function getPagination(state) {
	return state.companyCategories.pagination;
}

export function getSorter(state) {
	return state.companyCategories.sorter;
}