import { browserHistory } from 'react-router';
import api from '../../services/api';
import _ from 'lodash';

import * as exceptionsActions from '../exceptions/actions';

export const types = {
	FETCH_ALL_ITEMS_DONE: 'languages.FETCH_ALL_ITEMS_DONE',
	FETCH_ITEM_DONE: 'languages.FETCH_ITEM_DONE',
	SET_CURRENT_ITEM_ID: 'genderStrings.SET_CURRENT_ITEM_ID',
	CLEAR_CACHE: 'languages.CLEAR_CACHE',
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
			let items = await api.get('/languages');
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
			let item = await api.get(`/languages/${id}`);
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
			await api.put(`/languages/${id}`, params);
			
			dispatch(exceptionsActions.clear());
		} catch (e) {
			dispatch(exceptionsActions.process(e));
		}
	}
}