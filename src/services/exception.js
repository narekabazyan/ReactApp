import ValidationException from '../exceptions/validation';
import AuthException from '../exceptions/auth';
import BlockedException from '../exceptions/blocked';
import strings from './strings';
import _ from 'lodash';

class ExceptionService {

	// Exceptions types
	types = {
		VALIDATION: 'validation',
		AUTH: 'auth',
		BLOCKED : 'blocked'
	}

	// General validation errors
	validationErrors = [
        'invalid_credentials',
        'confirmPassword',
        'wrong_password',
		'newPassword'
	]
	blockedErrors = [
		'user_blocked'
	]

	throw(exception) {
		throw exception;
	}

	// Throw exception based on API Response
	throwFromResponse(data) {
        if (this.hasResponseErrors(this.types.BLOCKED, data)) {
            let blockedException = this.createFromResponse(this.types.BLOCKED, data);
            this.throw(blockedException);
        }
        // Throw ValidationError
        if (this.hasResponseErrors(this.types.VALIDATION, data)) {
            let validationException = this.createFromResponse(this.types.VALIDATION, data);
            this.throw(validationException);
        }
		// Throw AuthError
		if (this.hasResponseErrors(this.types.AUTH, data)) {
			let authException = this.createFromResponse(this.types.AUTH, data);
			this.throw(authException);
		}
	}

	// Retrieve message string based on error type and strings
	getMessage(field, type = null) {
        if (type) {
			return strings.get('Exceptions.' + type, {
				field: _.capitalize(field)
			});
		} else {
			return strings.get('Exceptions.' + field);
		}
	}

	checkType(type, e) {
		if (e instanceof ValidationException && type == this.types.VALIDATION) {
			return true;
		}
		else if(e instanceof BlockedException && type == this.types.BLOCKED){
			return true;
		}
		else if (e instanceof AuthException && type == this.types.AUTH) {
			return true;
		}
		return false;
	}

	hasResponseErrors(type, data) {
		// Check for validation errors
        if (type == this.types.BLOCKED) {
            if (data.errors) {
                if ((_.isObject(data) || (_.isString(data) && _.indexOf(this.blockedErrors, data) >= 0)) && (data.errors.blocked)) {
                    return true;
                }
            }
        }

		else if (type == this.types.VALIDATION) {
            if (data.errors) {
                if ((_.isObject(data.errors) || (_.isString(data.errors) && _.indexOf(this.validationErrors, data.errors) >= 0)) && (!data.errors.blocked)) {
                    return true;
                }
            }
        }
		// Check for auth errors
		else if (type == this.types.AUTH) {
			if (data.errors) {
				if (_.isString(data.errors) && (data.errors == 'absent_token' || data.errors == 'invalid_token' || data.errors == 'expired_token')) {
					return true;
				}
			}
		}
		return false;
	}

	createFromResponse(type, data) {
		let errors = {};
		// Handle ValidationException
		if (type == this.types.VALIDATION) {

            if (data.errors) {

                // Error is just a message
				if (_.isString(data.errors)) {
					errors[data.errors] = this.getMessage(data.errors);
				}
				// Multiple errors for different fields
				else if (_.isObject(data.errors) && _.size(data.errors) > 0) {

                    _.forEach(data.errors, (value, key) => {
						if (_.isString(value)) {
                            errors[key] = this.getMessage(key, value);
                        } else {
							errors[key] = value;
						}
					});
				}
			}
		}else if (type == this.types.BLOCKED){
            if (data.errors.errors) {
                // Error is just a message
                if (_.isString(data.errors)) {
                    errors[data.errors] = this.getMessage(data.errors);
                }
                // Multiple errors for different fields
                else if (_.isObject(data.errors) && _.size(data.errors) > 0) {
                    // _.forEach(data.errors, (value, key) => {
                    //     if (_.isString(value)) {
                    //     	errors[key] = this.getMessage(key, value);
                    //     } else {
                    //         errors[key] = value;
                    //     }
                    //     errors[key] = this.getMessage(this.blockedErrors[0]+"."+key);
                    // });
					errors["errors"] = data.errors.errors;
					// errors["reason"] = data.errors.reason;
                }
            }
		}

		// Handle AuthException
		else if (type == this.types.AUTH) {
			// nothing to process here for now
		}
		return this.create(type, errors);
	}

	create(type, errors) {
		// Create ValidationException
		if (type == this.types.VALIDATION) {
			return new ValidationException(errors);
		}
		//Create BlockedException
		else if(type == this.types.BLOCKED){
			return new BlockedException(errors);
		}
		// Create AuthException
		else if (type == this.types.AUTH) {
			return new AuthException();
		}
	}

}

export default new ExceptionService();