import Immutable from 'seamless-immutable';
import { types } from './actions';
import moment from 'moment';
import _ from 'lodash';

const initialState = Immutable({
	filters: {
		searchTerm: '',
		categoryId: '',
	},
	sorter: {
		column: 'name',
		descending: false,
	},
	currentItemId: null,
	stats: null,
	itemsById: {
		// _id: {item_details}
	},
	idsByCategory: {},
});

// Set the id of current item
function setCurrentItemId(state, payload) {
	return state.merge({
		currentItemId: payload.id
	})
}

// Set category id filter
function setCategoryId(state, payload) {
	return state.merge({
		filters: {
			categoryId: payload.id
		}
	}, { deep: true });
}

// Change and toggle sorter
function toggleSorter(state, payload) {
	if (state.sorter.column == payload.column) {
		return state.merge({
			sorter: {
				column: payload.column,
				descending: !state.sorter.descending
			}
		})
	} else {
		return state.merge({
			sorter: {
				column: payload.column,
				descending: false
			}
		})
	}
}

// Clear cached info
function clearCache(state) {
	return state.merge({
		filters: state.filters,
		sorter: state.sorter,
		itemsById: {},
	})
}

// Set sorter
function setSorter(state, payload) {
	return state.merge({
		sorter: payload.sorter
	});
}

// Set current search term
function setSearchTerm(state, payload) {
	return state.merge({
		filters: {
			searchTerm: payload.searchTerm
		}
	}, { deep: true });
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
	return state.merge(newState, { deep: true })
}

// Save items to store
function fetchItemsDone(state, payload) {
	let newState = {
		itemsById: {},
		idsByCategory: {},
	}
	_.map(payload.items, (item) => {
		if (item.imageURL) {
			item.imageURL += `?t=${moment().unix()}`;
		}
		newState['itemsById']['_' + item.id] = item;

		if (!newState['idsByCategory'][`_${item.category_id}`]) {
			newState['idsByCategory'][`_${item.category_id}`] = [];
		}
		newState['idsByCategory'][`_${item.category_id}`].push(item.id);
	})
	return state.merge(newState, { deep: true });
}

// Save items to store
function fetchAllItemsDone(state, payload) {
	let newState = {
		itemsById: {},
		idsByCategory: {},
	}
	_.map(payload.items, (item) => {
		if (item.imageURL) {
			item.imageURL += `?t=${moment().unix()}`;
		}
		newState['itemsById']['_' + item.id] = item;

		if (!newState['idsByCategory'][`_${item.category_id}`]) {
			newState['idsByCategory'][`_${item.category_id}`] = [];
		}
		newState['idsByCategory'][`_${item.category_id}`].push(item.id);
	});
	return state.merge(newState, { deep: true });
}

function setSearchPlaceholder(state, payload){
	let newState = {
		placeholder: payload.item.value,
	}
	return state.merge(newState, { deep:true });
}

function setDenyMessage(state, payload){
    let newState = {
        denyMessage: payload.item.value,
    }
    return state.merge(newState, { deep:true });
}

function fetchStatsDone(state, payload) {
	return state.merge({
		stats: payload.items,
	});
}

export default function reduce(state = initialState, action = {}) {
  	switch (action.type) {
  		case types.CLEAR_CACHE:
  			return clearCache(state);
		
		case types.SET_CURRENT_ITEM_ID:
			return setCurrentItemId(state, action.payload);

  		case types.TOGGLE_SORTER:
  			return toggleSorter(state, action.payload);

  		case types.SET_SORTER:
  			return setSorter(state, action.payload);

  		case types.SET_SEARCH_TERM:
  			return setSearchTerm(state, action.payload);

  		case types.SET_CATEGORY_ID:
  			return setCategoryId(state, action.payload);

        case types.FETCH_PLACEHOLDER_DONE:
            return setSearchPlaceholder(state, action.payload);

        case types.FETCH_DENY_MESSAGE:
            return setDenyMessage(state, action.payload);

		case types.FETCH_ITEM_DONE:
	        return fetchItemDone(state, action.payload);

    	case types.FETCH_ITEMS_DONE:
            return fetchItemsDone(state, action.payload);

        case types.FETCH_ALL_ITEMS_DONE:
            return fetchAllItemsDone(state, action.payload);

		case types.FETCH_STATS_DONE:
            return fetchStatsDone(state, action.payload);

    	default:
      		return state;
  	}
}