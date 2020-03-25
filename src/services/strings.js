import api from './api';
import _ from 'lodash';
class StringsService {

	// Component where strings service instance has been initialised
	componentName;

	// Default language
	language  = {id : '2',iso2:'NL'};
	languages = {};

	// Strings map
	strings = new Map();

    async getJson() {
    	let data = await api.get('/strings');
		_.map(data, (value, key) => {
			this.languages[key] = value;
		});
		this.strings = new Map();
		this.loadStrings(this.languages[this.language.iso2]);
		//console.log(this.languages,this.language);asdasd
    }

	constructor() {
        this.languages = {};
        this.getJson();
	}

	get(string, params = {}) {
		let value = this.strings.get(string);
		return this.replaceParams(value, params);
	}

	getLanguage() {
		return this.language;
	}

	async setLanguage(language) {
        this.language = language;
        await this.getJson();
	}

	setComponentName(name) {
		this.componentName = name;
	}

	setComponent(component) {
		this.setComponentName(component.constructor.name);
	}

	loadStrings(strings, prefix = '') {
		for (let key in strings) {
			let nextPrefix = (prefix == '') ? key : prefix + '.' + key;

			if (typeof strings[key] == 'object') {
				this.loadStrings(strings[key], nextPrefix);
			} else {
				this.strings.set(nextPrefix, strings[key]);
			}
		}
	}

	replaceParams(string, params) {
		let result = string;
		for (let key in params) {
			result = result.replace('{' + key + '}', params[key]);
		}
		return result;
	}

}

export default new StringsService();