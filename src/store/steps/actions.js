import { browserHistory } from 'react-router';
import api from '../../services/api';
import language from '../../services/language';
import _ from 'lodash';

import * as exceptionsActions from '../exceptions/actions';
import * as stepsSelectors from './selectors';

export const types = {
	FETCH_ALL_ITEMS_DONE: 'steps.FETCH_ALL_ITEMS_DONE',
	FETCH_ITEM_DONE: 'steps.FETCH_ITEM_DONE',
	SET_CURRENT_ITEM_ID: 'steps.SET_CURRENT_ITEM_ID',
	CLEAR_CACHE: 'steps.CLEAR_CACHE',
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

			let items = await api.get('/steps', params);
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

export function fetchItem(id) {
	return async (dispatch) => {
		try {
			// GET request from API
			let item = await api.get(`/steps/${id}`);
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

export function orderItems(items) {
	return async (dispatch) => {
		try {
			let params = new Map();
			_.map(items, (value, key) => {
				params.set(`steps[${key}][id]`, value.id);
				params.set(`steps[${key}][order]`, key + 1);
			})
			// PUT request to API
			await api.put('/steps/order', params);

			dispatch(exceptionsActions.clear());
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
			let item = await api.post('/steps', params);
			browserHistory.push(`/glossaries/steps`);

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
			await api.put(`/steps/${id}`, params);
			browserHistory.push(`/glossaries/steps`);
			
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
			await api.delete('/steps/' + id);
			dispatch(fetchAllItems());
		} catch (e) {
			dispatch(exceptionsActions.process(e));
		}
	}
}