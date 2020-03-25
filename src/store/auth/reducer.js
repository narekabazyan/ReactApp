import Immutable from 'seamless-immutable';
import { types } from './actions';
import moment from 'moment';
import _ from 'lodash';

const initialState = Immutable({
	profile: {}
});

// Clear cached info
function clearCache(state) {
	return state.merge({
		profile: {}
	})
}

// Save profile to store
function fetchProfileDone(state, payload) {
	return state.merge({
		profile: payload.profile
	})
}

export default function reduce(state = initialState, action = {}) {
  	switch (action.type) {
  		case types.CLEAR_CACHE:
  			return clearCache(state);

		case types.FETCH_PROFILE_DONE:
	        return fetchProfileDone(state, action.payload);

    	default:
      		return state;
  	}
}