import { browserHistory } from 'react-router';
import api from '../../services/api';
import _ from 'lodash';

import * as exceptionsActions from '../exceptions/actions';

export const types = {
    FETCH_ALL_ITEMS_DONE: 'userRequiredOptions.FETCH_ALL_ITEMS_DONE',
    FETCH_ITEM_DONE: 'userRequiredOptions.FETCH_ITEM_DONE',
    SET_CURRENT_ITEM_ID: 'userRequiredOptions.SET_CURRENT_ITEM_ID',
    CLEAR_CACHE: 'userRequiredOptions.CLEAR_CACHE',
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
            let items = await api.get('/userRequiredOptions');
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

export function updateItem(data) {
    return async (dispatch) => {
        try {
            let params = new Map();
            _.map(data, (value, key) => {
                params.set(key, value);
            })
            // PUT request to API
            await api.put(`/userRequiredOptionsUpdate`, params);

            dispatch(exceptionsActions.clear());
        } catch (e) {
            dispatch(exceptionsActions.process(e));
        }
    }
}