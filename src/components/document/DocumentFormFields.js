import React, { Component } from 'react';
import autoBind from 'react-autobind';
import strings from '../../services/strings';
import documents from '../../services/documents';
import { browserHistory, Link } from 'react-router';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import moment from 'moment';
import validURL from 'valid-url';
import _ from 'lodash';

import Modal from 'boron/DropModal';
import DatePicker from 'react-datepicker';

class DocumentFormFields extends Component {

    state = {
        pendingDownload: false,
    }

    // a field can have multiple paths
    // as long as it can be used multiple times in the document
    paths = {};

    // keep track of rendered fields
    rendered = {};

    constructor(props) {
        super(props);
        autoBind(this);
    }

    getTitle() {
        if (this.props.currentStep) {
            return this.props.currentStep.name;
        }
    }

    getFieldClass(item, defaultClasses) {
        if (_.size(this.props.hasErrors) && this.props.hasErrors[item.name] && item.properties.isRequired==2)
        {
            return `${defaultClasses} has-dangerous`;
        }
        else if (_.size(this.props.hasErrors) && this.props.hasErrors[item.name]) {
            return `${defaultClasses} has-error`;
        }

        return defaultClasses;
    }

    showHelperModal(){
        this.refs.helperTextModal.show();
    }

    hideHelperModal(){
        this.refs.helperTextModal.hide();
    }

    getHelper(item) {
        if (item.properties.helperText) {
            let helperContentLink = validURL.isUri(item.properties.helperLink) ? <button className="btn btn-default" onClick={ () => this.handleHelperClick(item) }>Link</button> : '';
            
            this.helperTextModalContent = (
                <div className="helperTextContent">
                    <span className="helperName"><b>{ item.name }</b></span><br/>
                    <span className="helperText">{ item.properties.helperText }</span><br/>
                    { helperContentLink }
                    <button className="btn btn-secondary" onClick={ this.hideHelperModal }>Got It</button>
                </div>
            );

            return (
                <div className="helper clickable" onClick={ this.showHelperModal }>
                    <i className="ion-help-circled"></i>
                </div>
            );
        }
    }

    getButtons() {
        let buttons = [];

        if (this.props.isLastStep) {
            buttons.push(
                <button className="btn btn-primary pull-right" disabled={ this.state.pendingDownload } onClick={ this.handleDownloadClick } key={_.uniqueId()}>Download</button>
            );
        } else {
            buttons.push(
                <button className="btn btn-primary pull-right" onClick={ this.handleNextStepClick } key={_.uniqueId()}>Volgende</button>
            );
        }

        if (!this.props.isFirstStep) {
            buttons.push(
                <button className="btn btn-default pull-left" onClick={ this.handlePrevStepClick } key={_.uniqueId()}>Vorige</button>
            );
        }
        return buttons;
    }

    getForm() {
        if (this.props.currentStep && this.props.rules) {
            // we want to rebuild the form
            // so we reset rendered fields tracker
            this.rendered = {};

            let form = this.buildForm(this.props.currentStep.id, this.props.rules);
            this.props.onRender(this.rendered);

            // group and order elements
            form = _.sortBy(form, ['props.order']);
            
            return form;
        }
    }

    shouldRender(node, path, currentStepId) {
        let shouldRender = true;

        // if node is not a field 
        // there is no need for render and processing
        if (!documents.isRuleField(node)) {
            return false;
        }

        // if field step is different than the current step
        // don't render it
        if (node.properties && node.properties.stepId != currentStepId) {
            return false;
        }

        // init rendered and paths type
        if (!this.rendered[node.type]) this.rendered[node.type] = {};
        if (!this.paths[node.type]) this.paths[node.type] = {};

        // init paths object for this specific field
        if (!this.paths[node.type][node.name]) this.paths[node.type][node.name] = {};
        let paths = this.paths[node.type][node.name];

        // if the field already has a different path added
        // there is no need to add the input again in the form
        if (_.size(paths) && paths[_.first(_.keys(paths))].value.toString() != path.toString()) {
            // propagate existing value to the current field
            let rules = _.extend(this.props.rules, {});
            if (rules.asMutable) rules = rules.asMutable();

            rules = this.replaceValue(rules, paths[_.first(_.keys(paths))].node.value, path);
            shouldRender = false;
        } else {
            // mark field as rendered
            this.rendered[node.type][node.name] = node;
        }

        // add the current path
        paths[path.toString()] = {
            node,
            value: path,
        };

        return shouldRender;
    }

    replaceValue(form, value, path) {
        if (form.asMutable) {
            form = form.asMutable();
        } 
        if (_.size(path) == 0) {
            // replace value in the rules tree
            form.value = value;
            return form;
        }

        form[_.head(path)] = this.replaceValue(form[_.head(path)], value, _.tail(path));
        return form;
    }
    renderedKeys = "";
    buildForm(stepId, variables, path = []) {
        let form = [];

        _.each(variables, (node, key) => {
            let element = null;
            let keys = this.renderedKeys ? this.renderedKeys : "";

            // check whether or not current node should be rendered
            // and build it accordingly
            if (this.shouldRender(node, path.concat(key), stepId)) {
                if (node.type == documents.ruleTypes.SELECTOR) {
                    element = this.buildSelector(node, path.concat(key));
                }
                else if (node.type == documents.ruleTypes.CLAUSE) {
                    element = this.buildClause(node, path.concat(key));
                }
                else if (node.type == documents.ruleTypes.FIELD) {
                    element = this.buildField(node, path.concat(key));
                }
            }

            if (element) {
                form.push(element);
            }

            // build recursively the rest of the form tree
            if (_.size(node.children)) {
                // if node is clause check if it's checked
                if (node.type == documents.ruleTypes.CLAUSE && node.value) {
                    let nodes = this.buildForm(stepId, node.children, path.concat(key).concat('children'));
                    form = form.concat(nodes);
                }

                // if node is selector check if a valid option is selected
                else if (node.type == documents.ruleTypes.SELECTOR) {
                    let optionKey = _.findIndex(node.children, item => item.name == node.value);

                    if (optionKey > -1 && _.size(node.children[optionKey].children)) {
                        let nodes = this.buildForm(
                            stepId,
                            node.children[optionKey].children, 
                            path.concat(key).concat('children').concat(optionKey).concat('children')
                        );
                        form = form.concat(nodes);
                    }
                }

                // if node is html simply parse rest of the children
                else if (node.type == documents.ruleTypes.HTML) {
                    let nodes = this.buildForm(stepId, node.children, path.concat(key).concat('children'));
                    form = form.concat(nodes);
                }
            }
        });

        return form;
    }

    buildSelector(item, path) {
        let options = _.map(item.children, option => (
            <option key={ option.name } value={ option.name }>{ option.name }</option>
        ));

        return (
            <div key={`selector-${item.name}`} className={ this.getFieldClass(item, 'form-group') } type={ 1 } order={ item.properties.index }>
                <label>{ item.properties.description }</label>
                { this.getHelper(item) }
                <select className="form-control" value={ item.value } onChange={(e) => this.handleInputChange(e, this.paths[item.type][item.name])}>
                    <option value=""></option>
                    { options }
                </select>
            </div>
        );
    }

    buildClause(item, path) {
        return (
            <div key={`clause-${item.name}`} className={ this.getFieldClass(item, 'checkbox') } type={ 2 } order={ item.properties.index }>
                <label>
                    <input type="checkbox" checked={ item.value } onChange={(e) => this.handleCheckboxChange(e, this.paths[item.type][item.name])} />
                    { item.properties.description }
                </label>
                { this.getHelper(item) }
            </div>
        );
    }
    
    buildField(item, path) {
        if (item.properties.type == documents.ruleTypes.field.TEXT) {
            return (
                <div key={`field-${item.name}`} className={ this.getFieldClass(item, 'form-group') } type={ 0 } order={ item.properties.index }>
                    <label>{ item.properties.label }</label>
                    { this.getHelper(item) }
                    <input className="form-control" type="text" value={ item.value } placeholder={ item.properties.placeholder } onChange={(e) => this.handleInputChange(e, this.paths[item.type][item.name])} />
                </div>
            );
        }

        else if (item.properties.type == documents.ruleTypes.field.TEXTAREA) {
            return (
                <div key={`field-${item.name}`} className={ this.getFieldClass(item, 'form-group') } type={ 0 } order={ item.properties.index }>
                    <label>{ item.properties.label }</label>
                    { this.getHelper(item) }
                    <textarea className="form-control" value={ item.value } rows="3" placeholder={ item.properties.placeholder } onChange={(e) => this.handleInputChange(e, this.paths[item.type][item.name])} ></textarea>
                </div>
            );
        }

        else if (item.properties.type == documents.ruleTypes.field.NUMERIC) {
            return (
                <div key={`field-${item.name}`} className={ this.getFieldClass(item, 'form-group') } type={ 0 } order={ item.properties.index }>
                    <label>{ item.properties.label }</label>
                    { this.getHelper(item) }
                    <input className="form-control" type="number" value={ item.value } placeholder={ item.properties.placeholder } onChange={(e) => this.handleInputChange(e, this.paths[item.type][item.name])} />
                </div>
            );
        }

        else if (item.properties.type == documents.ruleTypes.field.SELECTOR) {
            let options = _.map(item.properties.options, option => (
                <option key={ option } value={ option }>{ option }</option>
            ));

            return (
                <div key={`field-${item.name}`} className={ this.getFieldClass(item, 'form-group') } type={ 0 } order={ item.properties.index }>
                    <label>{ item.properties.label }</label>
                    <select className="form-control" value={ item.value } onChange={(e) => this.handleInputChange(e, this.paths[item.type][item.name])}>
                        <option value=""></option>
                        { options }
                    </select>
                </div>
            );
        }

        else if (item.properties.type == documents.ruleTypes.field.GENDER_SELECTOR) {
            return (
                <div key={`field-${item.name}`} className={ this.getFieldClass(item, 'form-group') } type={ 0 } order={ item.properties.index }>
                    <label>{ item.properties.label }</label>
                    <select className="form-control" value={ item.value } onChange={(e) => this.handleInputChange(e, this.paths[item.type][item.name])}>
                        <option value=""></option>
                        <option value={ documents.genders.MALE }>{ item.properties.male }</option>
                        <option value={ documents.genders.FEMALE }>{ item.properties.female }</option>
                    </select>
                </div>
            );
        }

        else if (item.properties.type == documents.ruleTypes.field.DATE) {
            return (
                <div key={`field-${item.name}`} className={ this.getFieldClass(item, 'form-group') } type={ 0 } order={ item.properties.index }>
                    <label>{ item.properties.label }</label>
                    <DatePicker
                        fixedHeight
                        dateFormat="DD MMM YYYY"
                        className="form-control"
                        selected={ item.value ? moment(item.value, 'DD MMM YYYY') : null }
                        onChange={(date) => this.handleDateInputChange(date, this.paths[item.type][item.name]) }
                    />
                </div>
            );
        }
    }

    handleHelperClick(item) {
        let link = item.properties.helperLink; 
        if (validURL.isUri(link)) {
            window.open(link,'_blank');
        }
    }

    handleInputChange(e, paths) {
        this.handleFieldChange(e.target.value, paths);
    }

    handleDateInputChange(date, paths) {
        this.handleFieldChange(date.format('DD MMM YYYY'), paths);
    }

    handleCheckboxChange(e, paths) {
        this.handleFieldChange(e.target.checked, paths);
    }

    handleFieldChange(value, paths) {
        let rules = _.extend(this.props.rules, {});
        if (rules.asMutable) {
            rules = rules.asMutable();
        }
        _.each(paths, path => {
            rules = this.replaceValue(rules, value, path.value);
        });
        this.props.onChange(rules, this.paths);
    }

    async handleDownloadClick(e) {
        e.preventDefault();
        this.setState({ pendingDownload: true });

        await this.props.onDownload();
        
        this.setState({ pendingDownload: false });
    }

    handlePrevStepClick(e) {
        e.preventDefault();
        this.props.onPrevStep();
    }

    handleNextStepClick(e) {
        e.preventDefault();
        this.props.onNextStep();
    }

    render() {
        return (
            <div className="DocumentFormFields" ref="wrapper">
                <div className="title">
                    { this.getTitle() }
                </div>

                <div className="form">
                    <Modal className="boron-modal helperText" ref="helperTextModal">
                        { this.helperTextModalContent }
                    </Modal>
                    { this.getForm() }
                    { this.getButtons() }
                </div>
            </div>
        );
    }
}

DocumentFormFields.propTypes = {
    rules: React.PropTypes.array,
    currentStep: React.PropTypes.object,
    isFirstStep: React.PropTypes.bool,
    isLastStep: React.PropTypes.bool,
    hasErrors: React.PropTypes.object,
    onRender: React.PropTypes.func.isRequired,
    onChange: React.PropTypes.func.isRequired,
    onDownload: React.PropTypes.func.isRequired,
    onPrevStep: React.PropTypes.func.isRequired,
    onNextStep: React.PropTypes.func.isRequired,
}

export default DocumentFormFields;