import api from './api';

class DocumentsService {

	ruleTypes = {
		SELECTOR: 'selector',
		OPTION: 'option',
		CLAUSE: 'if',
		FIELD: 'field',
		HTML: 'html',
		TEXT: 'text',
		field: {
			TEXT: 'text',
			TEXTAREA: 'textarea',
			NUMERIC: 'numeric',
			DATE: 'date',
			SELECTOR: 'selector',
			GENDER_SELECTOR: 'gender_selector',
		}
	}

	genders = {
		MALE: 'male',
		FEMALE: 'female',
	}

	isRuleField(item) {
		if (item.type == this.ruleTypes.SELECTOR) {
			return true;
		}
		else if (item.type == this.ruleTypes.CLAUSE) {
			return true;
		}
		else if (item.type == this.ruleTypes.FIELD) {
			return true;
		}

		return false;
	}
}

export default new DocumentsService();