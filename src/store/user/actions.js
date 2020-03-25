import { browserHistory } from 'react-router';
import api from '../../services/api';
import language from '../../services/language';
import auth from '../auth/actions'
import * as exceptionsActions from '../exceptions/actions';

import _ from 'lodash';

export const types = {
    CLEAR_CACHE: 'user.CLEAR_CACHE',
}

export function clearCache() {
    return {
        type: types.CLEAR_CACHE
    }
}

export function uploadUserImage(file) {
    return async (dispatch) => {
        try {
            let params = new Map();
            params.set('file', file);
            // POST request to API
            await api.postFiles(`/user/image`, params);
        } catch (e) {
            dispatch(exceptionsActions.process(e));
        }
    }
}

export function updateUser(data) {
    return async (dispatch) => {
        try {
            let params = new Map();
            _.map(data, (value, key) => {
                params.set(key, value);
            });
            // PUT request to API
            await api.put(`/user`, params);
            // browserHistory.push(`/user`);
            dispatch(exceptionsActions.clear());
        } catch (e) {
            dispatch(exceptionsActions.process(e));
        }
    }
}
export function updatePassword(data){
    return async (dispatch) => {
        try {
            let params = new Map();
            _.map(data, (value, key) => {
                params.set(key, value);
            });
            //POST request to API
            await api.put(`/user/updatePassword`, params);
            dispatch(exceptionsActions.clear());
        } catch (e) {
            dispatch(exceptionsActions.process(e));
        }
    }
}