import api from '../../services/api';

import * as exceptionsActions from '../exceptions/actions';

export const types = {
    FETCH_ITEM_DONE: 'article.FETCH_ITEM_DONE',
    SET_CURRENT_ITEM_ID: 'article.SET_CURRENT_ITEM_ID',
    CLEAR_CACHE: 'article.CLEAR_CACHE',
    FETCH_ARTICLE_CATEGORIES_DONE: 'article.FETCH_ARTICLE_CATEGORIES_DONE',
};

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

export function fetchItem(id) {
    return async (dispatch) => {
        try {
            // GET request from API
            let item = await api.get(`/articles/${id}`);
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