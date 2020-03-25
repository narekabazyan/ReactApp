import { browserHistory } from 'react-router';
import api from '../../services/api';
import _ from 'lodash';

import * as exceptionsActions from '../exceptions/actions';
import * as userDocumentsSelector from './selectors';

export const types = {
	FETCH_ALL_ITEMS_DONE: 'userDocuments.FETCH_ALL_ITEMS_DONE',
	FETCH_ITEMS_DONE: 'userDocuments.FETCH_ITEMS_DONE',
	FETCH_ITEM_DONE: 'userDocuments.FETCH_ITEM_DONE',
	SET_SEARCH_TERM: 'userDocuments.SET_SEARCH_TERM',
	SET_CURRENT_PAGE: 'userDocuments.SET_CURRENT_PAGE',
    SET_SORTER: 'userDocuments.SET_SORTER',
    SET_CURRENT_ITEM_ID: 'userDocuments.SET_CURRENT_ITEM_ID',
	TOGGLE_SORTER: 'userDocuments.TOGGLE_SORTER',
	CLEAR_CACHE: 'userDocuments.CLEAR_CACHE',
    SET_CATEGORY_ID: 'userDocuments.SET_CATEGORY_ID',
}

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
export function setSorter(sorter) {
    return {
        type: types.SET_SORTER,
        payload: {
            sorter
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
			let items = await api.get('/userDocuments');
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
			let filters = userDocumentsSelector.getFilters(state);
			let sorter = userDocumentsSelector.getSorter(state);
			let pagination = userDocumentsSelector.getPagination(state);
            params.set('expand', 'document,user');
            params.set('category_id',filters.categoryId);
            params.set('name~', filters.searchTerm);
			params.set('page_size', pagination.pageSize);
			params.set('page_number', deleteCache ? 1 : pagination.currentPage);
			params.set('sort_by', sorter.column);
			params.set('sort_desc', sorter.descending);
            params.set('key', 'sorter');
			// GET request from API
			let [response, items] = await api.get('/downloads', params, true);

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
			// GET request from API
			let item = await api.get(`/userDocuments/${id}`);
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
export function updateItem(id, data) {
	return async (dispatch) => {
		try {
			let params = new Map();
			_.map(data, (value, key) => {
				params.set(key, value);
			})
			// PUT request to API
			await api.put(`/userDocuments/${id}`, params);
			browserHistory.push(`/userDocuments`);

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
			await api.delete('/userDocuments/' + id);
			dispatch(fetchItems());
		} catch (e) {
			dispatch(exceptionsActions.process(e));
		}
	}
}

export function setCategoryId(id) {
    return {
        type: types.SET_CATEGORY_ID,
        payload: {
            id
        }
    }
}