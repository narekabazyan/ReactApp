
export default class ValidationException {

	errors = {
		// field_name: error_message
	}

	constructor(errors) {
		this.errors = errors;
	}
}