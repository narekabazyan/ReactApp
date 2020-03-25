import api from '../../services/api';
import _ from 'lodash';
import { browserHistory } from 'react-router';

import * as exceptionsActions from '../exceptions/actions';
import * as partnersSelectors from './selectors';

export const types = {
    FETCH_ALL_ITEMS_DONE: 'partners.FETCH_ALL_ITEMS_DONE',
    FETCH_ITEMS_DONE: 'partners.FETCH_ITEMS_DONE',
    FETCH_ITEM_DONE: 'partners.FETCH_ITEM_DONE',
    SET_SEARCH_TERM: 'partners.SET_SEARCH_TERM',
    SET_CURRENT_PAGE: 'partners.SET_CURRENT_PAGE',
    SET_CURRENT_ITEM_ID: 'partners.SET_CURRENT_ITEM_ID',
    TOGGLE_SORTER: 'partners.TOGGLE_SORTER',
    CLEAR_CACHE: 'partners.CLEAR_CACHE',
    FETCH_TEAM_MEMBERS_DONE: 'partners.FETCH_TEAM_MEMBERS_DONE',
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
            let items = await api.get('/partners');
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
            let item = await api.get(`/partners/${id}`);
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

export function fetchItems(deleteCache = false) {
    return async (dispatch, getState) => {
        let state = getState();
        try {
            // Set additional params
            let params = new Map();
            let pagination = partnersSelectors.getPagination(state);
            params.set('page_size', pagination.pageSize);
            params.set('page_number', deleteCache ? 1 : pagination.currentPage);

            // GET request from API
            let [response, items] = await api.get('/partners', params, true);

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

export function createItem(data) {
    return async (dispatch) => {
        try {
            let params = new Map();
            _.map(data, (value, key) => {
                params.set(key, value);
            })
            // POST request to API
            await api.post(`/partners`, params);
            browserHistory.push('/partners');

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
            await api.put(`/partners/${id}`, params);
            browserHistory.push(`/partners`);

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
            await api.postFiles(`/partners/${id}/image`, params);

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
            let item = await api.post('/partners', params);
            browserHistory.push(`/partners`);

            params = new Map();
            params.set('file', file);
            // POST request to API for Upload
            await api.postFiles(`/partners/${item.id}/image`, params);

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
            await api.delete(`/partners/${id}`);

            dispatch(fetchItems());
            dispatch(exceptionsActions.clear());
        } catch (e) {
            dispatch(exceptionsActions.process(e));
        }
    }
}

export function fetchTeam() {
    return async (dispatch) => {
        try {
            let items = await api.get('/teamMembers');

            dispatch({
                type: types.FETCH_TEAM_MEMBERS_DONE,
                payload: {
                    items
                }
            });
            dispatch(exceptionsActions.clear());
        } catch (e) {
            dispatch(exceptionsActions.process(e));

        }
    }
}