import Immutable from 'seamless-immutable';
import { types } from './actions';
import moment from 'moment';
import _ from 'lodash';

const initialState = Immutable({
	currentItemId: null,
	itemsById: {
		// _id: {item_details}
	},
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
		itemsById: {},
	})
}

// Save item to store
function fetchItemDone(state, payload) {
	let newState = {
		itemsById: {}
	}
	if (payload.item.imageURL) {
		payload.item.imageURL += `?t=${moment().unix()}`;
	}
	newState['itemsById']['_' + payload.item.id] = payload.item;
	return state.merge(newState, {deep: true})
}

// Save items to store
function fetchAllItemsDone(state, payload) {
	_.map(payload.items, (item) => {
		if (item.imageURL) {
			item.imageURL += `?t=${moment().unix()}`;
		}
		return item;
	});
	return state.merge({
		itemsById: _.keyBy(payload.items, (item) => '_' + item.id)
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

        case types.FETCH_ALL_ITEMS_DONE:
            return fetchAllItemsDone(state, action.payload);

    	default:
      		return state;
  	}
}