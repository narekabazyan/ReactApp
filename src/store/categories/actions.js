import { browserHistory } from 'react-router';
import api from '../../services/api';
import language from '../../services/language';
import _ from 'lodash';

import * as exceptionsActions from '../exceptions/actions';
import * as categoriesSelectors from './selectors';

export const types = {
	FETCH_ALL_ITEMS_DONE: 'categories.FETCH_ALL_ITEMS_DONE',
	FETCH_ITEMS_DONE: 'categories.FETCH_ITEMS_DONE',
	FETCH_ITEM_DONE: 'categories.FETCH_ITEM_DONE',
	SET_SEARCH_TERM: 'categories.SET_SEARCH_TERM',
	SET_CURRENT_PAGE: 'categories.SET_CURRENT_PAGE',
	SET_CURRENT_ITEM_ID: 'categories.SET_CURRENT_ITEM_ID',
	TOGGLE_SORTER: 'categories.TOGGLE_SORTER',
	CLEAR_CACHE: 'categories.CLEAR_CACHE',
	FETCH_ARTICLE_CATEGORIES_DONE: 'categories.FETCH_ARTICLE_CATEGORIES_DONE',
};

export function setCurrentPage(page) {
	return {
		type: types.SET_CURRENT_PAGE,
		payload: {
			page
		}
	}
}

export function setCurrentItemId(id) {
	return {
		type: types.SET_CURRENT_ITEM_ID,
		payload: {
			id
		}
	}
}

export function unsetCurrentItemId() {
	return {
		type: types.SET_CURRENT_ITEM_ID,
		payload: {
			id: null,
		}
	}
}

export function toggleSorter(column) {
	return {
		type: types.TOGGLE_SORTER,
		payload: {
			column
		}
	}
}

export function setSearchTerm(searchTerm) {
	return {
		type: types.SET_SEARCH_TERM,
		payload: {
			searchTerm
		}
	}
}

export function clearCache() {
	return {
		type: types.CLEAR_CACHE
	}
}

export function fetchAllItems() {
	return async (dispatch, getState) => {
		try {
			let params = new Map();
			params.set('language_id', language.get());
			params.set('expand', 'children,users,groups,groups.users');

			let items = await api.get('/categories', params);
			dispatch(clearCache());
			dispatch({
				type: types.FETCH_ALL_ITEMS_DONE,
				payload: {
					items
				}
			});
		} catch (e) {
			dispatch(exceptionsActions.process(e));
		}
	}
}

export function fetchItems(deleteCache = false) {
	return async (dispatch, getState) => {
		let state = getState();
		try {
			// Set additional params
			let params = new Map();
			let filters = categoriesSelectors.getFilters(state);
			let sorter = categoriesSelectors.getSorter(state);
			let pagination = categoriesSelectors.getPagination(state);
			params.set('language_id', language.get());
			params.set('expand', 'children,users,groups,groups.users');
			params.set('name~', filters.searchTerm);
			params.set('page_size', pagination.pageSize);
			params.set('page_number', deleteCache ? 1 : pagination.currentPage);
			params.set('sort_by', sorter.column);
			params.set('sort_desc', sorter.descending);

			// GET request from API
			let [response, items] = await api.get('/categories', params, true);

			// Clear cache if deleteCache is enabled
			if (deleteCache) {
				dispatch(clearCache());
			}

			dispatch({
				type: types.FETCH_ITEMS_DONE,
				payload: {
					totalPages: parseInt(response.headers.get('X-Total-Pages')),
					items
				}
			});
		} catch (e) {
			dispatch(exceptionsActions.process(e));
		}
	}
}

export function fetchItem(id) {
	return async (dispatch) => {
		try {
			let params = new Map();
			params.set('expand', 'children,users,groups,groups.users');
			// GET request from API
			let item = await api.get(`/categories/${id}`, params);
			dispatch({
				type: types.FETCH_ITEM_DONE,
				payload: {
					item
				}
			})
		} catch (e) {
			dispatch(exceptionsActions.process(e));
		}
	}
}

export function createItem(data) {
	return async (dispatch) => {
		try {
			let params = new Map();
			_.map(data, (value, key) => {
				params.set(key, value);
			})
			// POST request to API
			let item = await api.post('/categories', params);
			browserHistory.push(`/categories`);

			dispatch(exceptionsActions.clear());
		} catch (e) {
			dispatch(exceptionsActions.process(e));
		}
	}
}

export function updateItem(id, data) {
	return async (dispatch) => {
		try {
			let params = new Map();
			_.map(data, (value, key) => {
				params.set(key, value);
			})
			// PUT request to API
			await api.put(`/categories/${id}`, params);
			browserHistory.push(`/categories`);
			
			dispatch(exceptionsActions.clear());
		} catch (e) {
			dispatch(exceptionsActions.process(e));
		}
	}
}

export function uploadItemLogo(id, file) {
	return async (dispatch) => {
		try {
			let params = new Map();
			params.set('file', file);
			// POST request to API
			await api.postFiles(`/categories/${id}/image`, params);

			dispatch(fetchItem(id));
		} catch (e) {
			dispatch(exceptionsActions.process(e));
		}
	}
}

export function createItemWithLogo(data, file) {
	return async (dispatch) => {
		try {
			let params = new Map();
			_.map(data, (value, key) => {
				params.set(key, value);
			})
			// POST request to API
			let item = await api.post('/categories', params);
			browserHistory.push(`/categories`);

			params = new Map();
			params.set('file', file);
			// POST request to API for Upload
			await api.postFiles(`/categories/${item.id}/image`, params);

			dispatch(fetchItem(item.id));
			dispatch(exceptionsActions.clear());
		} catch (e) {
			dispatch(exceptionsActions.process(e));
		}
	}
}

export function deleteItem(id) {
	return async (dispatch) => {
		try {
			// DELETE request to API
			await api.delete('/categories/' + id);
			dispatch(fetchItems());
		} catch (e) {
			dispatch(exceptionsActions.process(e));
		}
	}
}


export function fetchArticleCategories() {
	return async (dispatch) => {
		try {
			let params = new Map();
			params.set('expand', 'article');
			params.set('language_id', language.get());

			let items = await api.get('/articleCategories', params);

			dispatch({
				type: types.FETCH_ARTICLE_CATEGORIES_DONE,
				payload: { items }
			});
		} catch (e) {
			dispatch(exceptionsActions.process(e));
		}
	}
}