import exception from './exception';
import api from './api';
import config from '../config'

const API_ENDPOINT = config.API_ENDPOINT;
const LIFETIME = 5 * 60 * 1000; // 5 minutes

class AuthService {

	/**
	 * One of the requests is in the process 
	 * of refreshing the token.
	 * 
	 * @type {Boolean}
	 */
	refreshingAccessToken = false;

	/**
	 * Check if there is a local token saved.
	 * 
	 * @return {Boolean}
	 */
	isAuthenticated() {
		return !!this.getLocalAccessToken().value;
	}

	/**
	 * Retrieve access token from local storage.
	 * 
	 * @return object
	 */
	getLocalAccessToken() {
		try {
			let token = JSON.parse(localStorage.getItem('accessToken'));
			if (token) {
				return token;
			} else {
				throw new Exception();
			}
		} catch (e) {
			return {
				value: '',
				timestamp: null,
			};
		}
	}

	/**
	 * Save access token to local storage.
	 * 
	 * @param string value
	 */
	setLocalAccessToken(value) {
		let accessToken = {
			value,
			timestamp: Date.now(),
		};
		localStorage.setItem('accessToken', JSON.stringify(accessToken));
	}

	setLocalUser(user){
        localStorage.setItem('user', JSON.stringify(user));
    }

    getLocalUser(){
        try {
            let user = JSON.parse(localStorage.getItem('user'));
            if (user) {
                return user;
            } else {
                throw new Exception();
            }
        } catch (e) {
            return {};
        }
    }

	/**
	 * Retrieve access token from local storage
	 * and refresh if older than LIFETIME.
	 * 
	 * @return object
	 */
	async getAccessToken() {
		if (this.refreshingAccessToken) {
			await this.sleep(100);
			return this.getAccessToken();
		}

		let accessToken = this.getLocalAccessToken();

		if (!accessToken.timestamp || (Date.now() - accessToken.timestamp) > LIFETIME) {
			await this.refreshAccessToken();
			accessToken = this.getLocalAccessToken();
		}

		return accessToken;
	}

	/**
	 * Fetch and save a refreshed token from API.
	 */
	async refreshAccessToken() {
		this.refreshingAccessToken = true;

		let options = {
			method: 'GET',
	      	headers: {
	        	'Accept': 'application/json',
	        	'Content-Type': 'application/x-www-form-urlencoded'
	      	}
		};

		let [response, payload] = await api.request(`${API_ENDPOINT}/auth/refresh-token`, options, this.getLocalAccessToken().value);
		if (!response.ok) {
			return exception.throwFromResponse(payload);
		}

		this.setLocalAccessToken(payload.data.token);
		this.refreshingAccessToken = false;
	}

	/**
	 * Force code execution to wait for a given amount of time.
	 * 
	 * @param  int 	ms
	 */
	sleep(ms) {
	  	return new Promise(resolve => setTimeout(resolve, ms));
	}
}

export default new AuthService();