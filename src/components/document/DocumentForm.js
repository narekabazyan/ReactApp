import React, { Component } from 'react';
import autoBind from 'react-autobind';
import strings from '../../services/strings';
import documents from '../../services/documents';
import { browserHistory, Link } from 'react-router';
import he from 'he';
import _ from 'lodash';
import './DocumentForm.scss';
import api from '../../services/api'
import auth from '../../services/auth';

import DocumentFormSteps from './DocumentFormSteps';
import DocumentFormFields from './DocumentFormFields';
import DocumentFormPreview from './DocumentFormPreview';
import ActiveLabel from '../ActiveLabel';
import Modal from 'boron/FadeModal';

class DocumentForm extends Component {

    state = {
        currentStep: null,
        isFirstStep: false,
        isLastStep: false,
        hasErrors: {}, // keep track of invalid fields 
        steps: null,
        rules: null,
        paths: null,
        documentName : '',
        shareEmails: [],
        shareEmail : '',
        shareEmailId : -1,
        userEmail : '',
        showError : false,
        showEmailPushError : false,
        user : null,
        require : false,
    }

    rendered = {}; // current rendered fields

    constructor(props) {
        super(props);
        autoBind(this);
    }

    componentDidMount() {
        let userEmail = localStorage.getItem('loggedInUserEmail');
        this.setState({userEmail : userEmail});
        this.setState({user : auth.getLocalUser() ? auth.getLocalUser() : null});
        this.initHeight();
    }

    componentDidUpdate() {
        if (this.props.currentItem && this.props.currentItem.rulesTree && !this.state.rules) {
            this.setState({ rules: this.props.currentItem.rulesTree });
        }
    }

    isFieldValid(item) {
        let valid = true;

        // If there is a profile fetched and required fields is OFF
        // every field is valid
        if (this.props.profile && !this.props.profile.required_fields){
            return valid;
        }
        
        // check if field is filled
        if (item.value.toString().match(/\S/)) {
            if (item.type == documents.ruleTypes.FIELD && item.properties.type == documents.ruleTypes.field.NUMERIC) {
                // check numeric field condition
                if (item.properties.condition && item.properties.condition.field) {
                    // check if comparation field has been saved to paths
                    let comparationField = item.properties.condition.field;
                    if (this.state.paths && this.state.paths.field && _.size(this.state.paths.field[comparationField])) {
                        // check if the condition is fullfilled
                        let comparationValue = parseFloat(_.first(_.map(this.state.paths.field[comparationField], item => item)).node.value);
                        let currentValue = parseFloat(item.value);
                        let percentage = parseFloat(item.properties.condition.percentage);

                        if (comparationValue) {
                            if (item.properties.condition.type == '>' || item.properties.condition.type == '>%') {
                                if (currentValue < percentage / 100 * comparationValue) {
                                    valid = false;
                                }
                            }

                            else if (currentValue > percentage / 100 * comparationValue) {
                                valid = false;
                            }
                        }
                    }
                }
            }
        } else
            if (item.properties.isRequired==1) {
                valid = false;
            }
            else if (item.properties.isRequired==2 && this.state.require==false ) {
                this.requiredDownload();
                valid = false ;
            }
            else if (item.properties.isRequired==2 && this.state.require==true) {
                valid = false;
            }

        return valid;
    }

    isFormValid() {
        let hasErrors = {};

        // a form is valid if each of the currently
        // rendered fields are valid
        _.each(this.rendered, (fields, type) => {
            _.each(fields, field => {
                if (field.properties.isRequired==1 && !this.isFieldValid(field)) {
                    this.state.require = true;
                }
                else if(field.properties.isRequired==1 && this.isFieldValid(field)){
                    this.state.require = false;
                }

            })
            _.each(fields, field => {
                if (!this.isFieldValid(field)) {
                    hasErrors[field.name] = true;
                }
            })
        });

        this.setState({ hasErrors });
        return _.isEmpty(hasErrors);
    }

    initHeight() {
        let height = window.innerHeight - 52;
        this.refs.steps.refs.wrapper.style.height = `${height}px`;
        this.refs.fields.refs.wrapper.style.height = `${height}px`;
        this.refs.preview.refs.wrapper.style.height = `${height}px`;
    }

    setCurrentStep(step) {
        if (_.size(this.state.steps) && step) {
            this.setState({ 
                currentStep: step, 
                isFirstStep: _.first(this.state.steps).id == step.id,
                isLastStep: _.last(this.state.steps).id == step.id,
            });
        }
    }

    handleStepChange(step) {
        let changeStep = false;

        // change step if one of the previous step is required
        if (step.order < this.state.currentStep.order) {
            changeStep = true;
        }
        // check if form is valid
        else if (this.isFormValid()) {
            changeStep = true;
        }

        if (changeStep) {
            this.setCurrentStep(step);
        }
    }

    handleStepsLoaded(steps) {
        this.setState({ steps }, () => {
            this.setCurrentStep(steps[0]);
        });
    }

    handleFormRender(rendered) {
        this.rendered = rendered;
    }

    handleFormChange(rules, paths) {
        this.setState({ rules, paths });      
    }

    handlePrevStep() {
        let index = _.findIndex(this.state.steps, step => step.id == this.state.currentStep.id) - 1;
        this.handleStepChange(this.state.steps[index]);
    }

    handleNextStep() {
        let index = _.findIndex(this.state.steps, step => step.id == this.state.currentStep.id) + 1;
        this.handleStepChange(this.state.steps[index]);
    }
    handleInputChangeDocumentName(e){
        this.setState({documentName : e.target.value})
    }
    handleInputChangeUserEmail(e){
        this.setState({userEmail : e.target.value})
    }
    handleInputAddEmail(e){
        e.preventDefault();
        let { shareEmail,shareEmails,shareEmailId } = this.state;
        let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if(shareEmail.length > 0 && re.test(shareEmail)){
            shareEmailId++;
            shareEmails.push({
                id:shareEmailId,
                email:shareEmail,
                value:shareEmailId
            });
            this.setState({
                shareEmail : '',
                shareEmails:shareEmails,
                shareEmailId : shareEmailId,
                showEmailPushError : false
            })
        }
        else{
            this.setState({showEmailPushError : true})
        }
    }
    handleInputChangeShareDocument(e){
      this.setState({shareEmail : e.target.value})
    }
    async download(){
        let { documentName , shareEmails , userEmail} = this.state;
        if (this.isFormValid()) {
            await this.props.downloadItem({
                template: '<div style="font-size: 12px; text-align: justify;">' + this.refs.preview.refs.wrapper.innerHTML + '</div>',
                name : documentName,
                shareEmails : JSON.stringify(shareEmails),
                userEmail : userEmail
            });
        }
    }

    async downloadModal(){
        let { documentName , shareEmails , userEmail} = this.state;
            await this.props.downloadItem({
                template: '<div style="font-size: 12px; text-align: justify;">' + this.refs.preview.refs.wrapper.innerHTML + '</div>',
                name : documentName,
                shareEmails : JSON.stringify(shareEmails),
                userEmail : userEmail
            });
    }

    handleDocumentNameChangeClick(){
        let { userEmail } = this.state;
        let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if(re.test(userEmail)){
          this.download();
          this.setState({showError : false})
          this.refs.documentNameModal.hide();
        }else{
          this.setState({showError : true})
        }
    }
    handlerequiredDenyOptionClick(){
        this.downloadModal();
        this.refs.requiredDenyOptionModal.hide();
    }

    handleModalHide(){
        this.refs.documentNameModal.hide();
    }
    handleCancelClick(){
        this.refs.documentNameModal.hide();
    }
    handleDownload() {
        this.refs.documentNameModal.show()
    }
    requiredDownload() {
        this.refs.requiredDenyOptionModal.show()
    }

    requiredModalHide(){
        this.refs.requiredDenyOptionModal.hide();
    }
    requiredCancelClick(){
        this.refs.requiredDenyOptionModal.hide();
    }



    handleRemove(value) {
      let {shareEmails} = this.state;
      let selected = _.filter(shareEmails, (item) => {
        return item.id != value;
      });
      this.setState({ shareEmails:selected });
    }
    addedShareEmail(){
        let {shareEmails} = this.state;
        let addedShareEmail = _.map(shareEmails, (user) => {
            return (
                <ActiveLabel
                    name={`${user.email}`}
                    value={ user.id }
                    onRemove={ this.handleRemove }
                    key={ user.id }
                />
            );
        });
        return addedShareEmail;
    }
    userEmailInput(){
        let { showError } = this.state;
        let userEmailInput = showError ? (
            <div className="form-group text-left has-error">
                <label className="control-label">Your Email *</label>
                <input className="form-control" type="text" name="userEmail" value={ this.state.userEmail } onChange={ this.handleInputChangeUserEmail } />
            </div>
        ) : (
            <div className="form-group text-left">
                <label className="control-label">Your Email *</label>
                <input className="form-control" type="text" name="userEmail" value={ this.state.userEmail } onChange={ this.handleInputChangeUserEmail } />
            </div>
        );
        return userEmailInput;
    }
    shareDocument(){
        let { showEmailPushError } = this.state;
        let shareDocument = showEmailPushError ? (
            <div className="form-group text-left has-error">
                <label className="control-label ">Share Document</label>
                <input className="form-control" type="text" name="shareEmail" value={ this.state.shareEmail } onChange={ this.handleInputChangeShareDocument } />
            </div>
        ):(
            <div className="form-group text-left">
                <label className="control-label">Share Document</label>
                <input className="form-control" type="text" name="shareEmail" value={ this.state.shareEmail } onChange={ this.handleInputChangeShareDocument } />
            </div>
        );
        return shareDocument;
    }
    render() {
        let addedShareEmail = this.addedShareEmail();
        let userEmailInput = this.userEmailInput();
        let shareDocument = this.shareDocument();
        return (
            <div className="DocumentForm">
                <Modal className="boron-modal form-modal" ref="documentNameModal" onHide={ this.handleModalHide }>
                    <div className="form-group text-left">
                      <label className="control-label">Document Name</label>
                      <input className="form-control" type="text" name="documentName" value={ this.state.documentName } onChange={ this.handleInputChangeDocumentName } />
                    </div>
                    {userEmailInput}
                    {shareDocument}
                    <div className="form-group text-right">
                      <button className="btn btn-secondary add-btn" onClick={ this.handleInputAddEmail }>+</button>
                    </div>
                  <div className="form-group text-left">
                    {addedShareEmail}
                  </div>
                  <div className="form-actions">
                        <button className="btn btn-secondary" onClick={ this.handleDocumentNameChangeClick }>Save</button>
                        <button className="btn btn-default" onClick={ this.handleCancelClick }>Cancel</button>
                    </div>
                </Modal>
                <Modal className="boron-modal form-modal" ref="requiredDenyOptionModal" onHide={ this.requiredModalHide }>
                   <div>
                       <p>{ this.props.denyMessage }</p>
                   </div>
                    <div className="form-actions">
                        <button className="btn btn-secondary" onClick={ this.handlerequiredDenyOptionClick }>Go it</button>
                        <button className="btn btn-default" onClick={ this.requiredCancelClick }>Cancel</button>
                    </div>
                </Modal>
                <div className="row">
                    <div className="col-sm-2">
                        <DocumentFormSteps
                            ref="steps"
                            steps={ this.props.steps }
                            rules={ this.state.rules }
                            currentStep={ this.state.currentStep }
                            onChange={ this.handleStepChange }
                            onLoaded={ this.handleStepsLoaded }
                        />
                    </div>
                    <div className="col-sm-5">
                        <DocumentFormFields
                            ref="fields"
                            rules={ this.state.rules }
                            currentStep={ this.state.currentStep }
                            isFirstStep={ this.state.isFirstStep }
                            isLastStep={ this.state.isLastStep }
                            hasErrors={ this.state.hasErrors }
                            onChange={ this.handleFormChange }
                            onRender={ this.handleFormRender }
                            onDownload={ this.handleDownload }
                            onPrevStep={ this.handlePrevStep }
                            onNextStep={ this.handleNextStep }
                        />
                    </div>
                    <div className="col-sm-5">
                        <DocumentFormPreview
                            ref="preview"
                            rules={ this.state.rules }
                        />
                    </div>
                </div>
            </div>
        );
    }
}

DocumentForm.propTypes = {
    denyMessage: React.PropTypes.string,
    steps: React.PropTypes.object,
    currentItem: React.PropTypes.object,
    downloadItem: React.PropTypes.func,
    profile: React.PropTypes.object,
}

export default DocumentForm;