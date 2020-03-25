import Immutable from 'seamless-immutable';
import { types } from './actions';
import _ from 'lodash';

const initialState = Immutable({
    currentItemId: null,
    currentItem: {},
});

// Set the id of current item
function setCurrentItemId(state, payload) {
    return state.merge({
        currentItemId: payload.id
    })
}

// Clear cached info
function clearCache(state) {
    return state.merge({
        currentItemId: null,
        currentItem: {},
    })
}

// Save item to store
function fetchItemDone(state, payload) {
    let newState = {
        currentItemId: null,
        currentItem: {},
    };
    newState['currentItemId'] = ['_' + payload.item.id];
    newState['currentItem'] = payload.item;
    return state.merge(newState, {deep: true})
}

function fetchArticleCategoriesDone(state, payload) {
    return state.merge({
        articleCategories: payload.items
    })
}

export default function reduce(state = initialState, action = {}) {
    switch (action.type) {
        case types.CLEAR_CACHE:
            return clearCache(state);

        case types.SET_CURRENT_ITEM_ID:
            return setCurrentItemId(state, action.payload);

        case types.FETCH_ITEM_DONE:
            return fetchItemDone(state, action.payload);

        case types.FETCH_ARTICLE_CATEGORIES_DONE:
            return fetchArticleCategoriesDone(state, action.payload);

        default:
            return state;
    }
}