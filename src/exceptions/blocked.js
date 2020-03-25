/**
 * Created by Admin on 7/26/2017.
 */

export default class BlockedException {

    errors = {
        // field_name: error_message
    }

    constructor(errors) {
        this.errors = errors;
    }
}