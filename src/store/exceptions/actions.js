import exception from '../../services/exception';
import * as authActions from '../auth/actions';

export const types = {
	PROCESS: 'exceptions.PROCESS',
	ADD: 'exceptions.ADD',
	CLEAR: 'exceptions.CLEAR',
}

export function clear() {
	return {
		type: types.CLEAR
	}
}

export function process(e) {
	return (dispatch) => {
		if (exception.checkType(exception.types.VALIDATION, e)) {
			dispatch(add(e));
		} 
		else if (exception.checkType(exception.types.AUTH, e)) {
			dispatch(authActions.logout())
		}
		else if(exception.checkType(exception.types.BLOCKED, e)){
			dispatch(add(e));
		}
		else {
			console.error(e.stack);
		}
	}
}

export function add(exception) {
	return {
		type: types.ADD,
		payload: {
			exception
		}
	};
}