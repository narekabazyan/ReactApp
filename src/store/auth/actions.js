import { browserHistory } from 'react-router';
import api from '../../services/api';
import auth from '../../services/auth';
import * as exceptionsActions from '../exceptions/actions';

export const types = {
	GET_TOKEN_DONE: 'auth.GET_TOKEN_DONE',
	FETCH_PROFILE_DONE: 'auth.FETCH_PROFILE_DONE',
}

export function login(data) {
	return async (dispatch) => {
		try {
			let params = new Map();
			_.map(data, (value, key) => {
				params.set(key, value);
			});
			// POST request to API
			let payload = await api.post('/auth/login', params);

			if (payload.token) {
				auth.setLocalAccessToken(payload.token);
				browserHistory.push('/');
				window.location.reload();
			}

			dispatch(exceptionsActions.clear());
		} catch (e) {
			dispatch(exceptionsActions.process(e));
		}
	}
}

export function getUser() {
  	return async (dispatch) => {
	    try {
	      	let params = new Map();
	      	// POST request to API
	      	let payload = await api.get('/auth/getUser', params);

	        if (payload.user) {
	            auth.setLocalUser(payload.user);
	            localStorage.setItem('loggedInUserEmail', payload.user.email);

	            dispatch({
	            	type: types.FETCH_PROFILE_DONE,
	            	payload: {
	            		profile: payload.user
	            	}
	            });
	        }
	        dispatch(exceptionsActions.clear());
	    } catch (e) {
	      	dispatch(exceptionsActions.process(e));
	    }
 	}
}

export function register(data) {
	return async (dispatch) => {
		try {
			let params = new Map();
			_.map(data, (value, key) => {
				params.set(key, value);
			});
			// POST request to API
			await api.post('/auth/register', params);
			browserHistory.push('/');
			window.location.reload();

			dispatch(exceptionsActions.clear());
		} catch (e) {
			dispatch(exceptionsActions.process(e));
		}
	}
}

export function logout() {
	return async (dispatch) => {
		localStorage.clear();
		browserHistory.push('/');
		window.location.reload();
	}
}