import { browserHistory } from 'react-router';
import api from '../../services/api';
import language from '../../services/language';
import _ from 'lodash';

import * as exceptionsActions from '../exceptions/actions';
import * as documentsSelectors from './selectors';

export const types = {
	FETCH_ALL_ITEMS_DONE: 'documents.FETCH_ALL_ITEMS_DONE',
	FETCH_ITEMS_DONE: 'documents.FETCH_ITEMS_DONE',
	FETCH_ITEM_DONE: 'documents.FETCH_ITEM_DONE',
	FETCH_STATS_DONE: 'categories.FETCH_STATS_DONE',
	SET_SORTER: 'documents.SET_SORTER',
	SET_SEARCH_TERM: 'documents.SET_SEARCH_TERM',
	SET_CATEGORY_ID: 'documents.SET_CATEGORY_ID',
    FETCH_PLACEHOLDER_DONE: 'documents.FETCH_PLACEHOLDER_DONE',
    FETCH_DENY_MESSAGE: 'documents.FETCH_DENY_MESSAGE',
	SET_CURRENT_PAGE: 'documents.SET_CURRENT_PAGE',
	SET_CURRENT_ITEM_ID: 'documents.SET_CURRENT_ITEM_ID',
	TOGGLE_SORTER: 'documents.TOGGLE_SORTER',
	CLEAR_CACHE: 'documents.CLEAR_CACHE',
}

export function setCategoryId(id) {
	return {
		type: types.SET_CATEGORY_ID,
		payload: {
			id
		}
	}
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
			let params = new Map();
			params.set('language_id', language.get());
			params.set('expand', 'downloads');
			params.set('sort_by', 'name');

			let items = await api.get('/documents', params);
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

export function getPlaceholder() {
    return async (dispatch, getState) => {
        try {
            let params = new Map();
            params.set('language_id',language.get());

            let item = await api.get('/settings/search_placeholder', params);

            if (item) {
	            dispatch({
	                type: types.FETCH_PLACEHOLDER_DONE,
	                payload: {
	                    item
	                }
	            });
            }
        } catch (e) {
            dispatch(exceptionsActions.process(e));
        }
    }
}

export function getDenyMessage() {
    return async (dispatch, getState) => {
        try {
            let params = new Map();

            let item = await api.get('/settings/deny_message');
            //dispatch(clearCache());

            if (item) {
	            dispatch({
	                type: types.FETCH_DENY_MESSAGE,
	                payload: {
	                    item
	                }
	            });
            }
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
			let filters = documentsSelectors.getFilters(state);
			let sorter = documentsSelectors.getSorter(state);
			params.set('language_id', language.get());
			params.set('expand', 'downloads');
			params.set('name~', filters.searchTerm);
			params.set('category_id', filters.categoryId ? filters.categoryId : '');
			params.set('sort_by', sorter.column);
			params.set('sort_desc', sorter.descending);

			// GET request from API
			let [response, items] = await api.get('/documents', params, true);

			// Clear cache if deleteCache is enabled
			if (deleteCache) {
				dispatch(clearCache());
			}

			dispatch({
				type: types.FETCH_ITEMS_DONE,
				payload: { items }
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
			params.set('withRulesTree', 'true');
			params.set('expand', 'downloads');

			// GET request from API
			let item = await api.get(`/documents/${id}`, params);
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
			let item = await api.post('/documents', params);
			browserHistory.push(`/documents`);

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
			await api.put(`/documents/${id}`, params);
			browserHistory.push(`/documents`);
			
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
			await api.postFiles(`/documents/${id}/image`, params);

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
			let item = await api.post('/documents', params);
			browserHistory.push(`/documents`);

			params = new Map();
			params.set('file', file);
			// POST request to API for Upload
			await api.postFiles(`/documents/${item.id}/image`, params);

			dispatch(fetchItem(item.id));
			dispatch(exceptionsActions.clear());
		} catch (e) {
			dispatch(exceptionsActions.process(e));
		}
	}
}
export function downloadItem(id, data) {
    return async (dispatch) => {
        try {
            let params = new Map();
            _.map(data, (value, key) => {
                params.set(key, value);
            })
            // POST request to API
            let url = await api.post(`/documents/${id}/download`, params);

            let a = document.createElement('a');
            a.href = url;
            a.target = '_blank';
            a.click();

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
			await api.delete('/documents/' + id);
			dispatch(fetchItems());
		} catch (e) {
			dispatch(exceptionsActions.process(e));
		}
	}
}

export function fetchStats() {
	return async (dispatch) => {
		try {
			let items = await api.get('/stats');

			dispatch({
				type: types.FETCH_STATS_DONE,
				payload: { items }
			});
		} catch (e) {
			dispatch(exceptionsActions.process(e));
		}
	}
}