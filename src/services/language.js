import api from './api';

class LanguageService {

	defaultLanguage = {id : '2',iso2:'NL'};


	get() {
		let language = localStorage.getItem('language');

		if (!language) {
			language = this.defaultLanguage;
			this.set(language);
			return this.defaultLanguage.id;
		}

        return JSON.parse(language).id;
	}

    getIso2() {
        let language = localStorage.getItem('language');
		if (!language) {
            language = this.defaultLanguage;
            this.set(language);
            return this.defaultLanguage.iso2;
        }

        return JSON.parse(language).iso2;
    }

	set(language) {
        language = JSON.stringify(language);
		localStorage.setItem('language', language);
	}
}

export default new LanguageService();