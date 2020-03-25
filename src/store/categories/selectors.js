import _ from 'lodash';

export function getItems(state) {
	return state.categories.itemsById;
}
export function getItemsByPage(state, page) {
	if (!state.categories.idsByPage['_' + page]) {
		page = (getPagination(state)).previousPage;
	}
	return _.map(state.categories.idsByPage['_' + page], (itemId) => {
		return state.categories.itemsById['_' + itemId]
	})
}

export function getItemById(state, id) {
	return state.categories.itemsById['_' + id];
}

export function getCurrentItem(state) {
	return state.categories.currentItemId ? getItemById(state, state.categories.currentItemId) : null;
}

export function getFilters(state) {
	return state.categories.filters;
}

export function getPagination(state) {
	return state.categories.pagination;
}

export function getSorter(state) {
	return state.categories.sorter;
}

export function getArticleCategories(state) {
	return state.categories.articleCategories;
}