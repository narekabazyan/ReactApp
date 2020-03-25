import React, { Component } from 'react';
import autoBind from 'react-autobind';
import strings from '../../services/strings';
import documents from '../../services/documents';
import { browserHistory, Link } from 'react-router';
import { fromCSS } from 'react-css';
import he from 'he';
import _ from 'lodash';

class DocumentFormPreview extends Component {

    constructor(props) {
        super(props);
        autoBind(this);
    }

    getContent() {
        if (_.size(this.props.rules)) {
            return this.buildContent(this.props.rules);
        }
    }

    buildContent(rules) {
        let content = [];

        _.each(rules, rule => {
            let element = null;
            let children = null;

            // Recursively build element children
            if (_.size(rule.children)) {
                // If rule is clause check if it's checked
                if (rule.type == documents.ruleTypes.CLAUSE && rule.value) {
                    children = this.buildContent(rule.children);
                }

                // If rule is selector check if a valid option is selected
                if (rule.type == documents.ruleTypes.SELECTOR) {
                    let optionKey = _.findIndex(rule.children, item => item.name == rule.value);

                    if (optionKey > -1 && _.size(rule.children[optionKey].children)) {
                        children = this.buildContent(rule.children[optionKey].children);
                    }
                }

                // If rule is html simply parse rest of the children
                if (rule.type == documents.ruleTypes.HTML) {
                    children = this.buildContent(rule.children);
                }
            }

            // Build current element
            if (rule.type == documents.ruleTypes.TEXT) {
                element = React.createElement('span', {
                    key: _.uniqueId('text-')
                }, he.decode(rule.value));
                content = content.concat(element);
            }

            else if (rule.type == documents.ruleTypes.HTML) {
                element = React.createElement(rule.value, {
                    key: _.uniqueId('html-'),
                    style: rule.style ? fromCSS(`{${rule.style}}`) : null,
                }, children);
                content = content.concat(element);
            }

            else if (rule.type == documents.ruleTypes.FIELD) {
                let value = rule.value;

                // Handle gender selectors
                if (rule.properties.type == documents.ruleTypes.field.GENDER_SELECTOR) {
                    if (rule.value == documents.genders.MALE) {
                        value = rule.options.male
                    }
                    else if (rule.value == documents.genders.FEMALE) {
                        value = rule.options.female
                    }
                }

                element = React.createElement('span', {
                    key: _.uniqueId('field-'),
                    className: 'input-field',
                }, he.decode('&nbsp;') + value);
                content = content.concat(element);
            }

            else {
                content = content.concat(children);
            }
        });

        return content;
    }

    render() {
        return (
            <div className="DocumentFormPreview" ref="wrapper">
                { this.getContent() }
            </div>
        );
    }
}

DocumentFormPreview.propTypes = {
    rules: React.PropTypes.array,
}

export default DocumentFormPreview;