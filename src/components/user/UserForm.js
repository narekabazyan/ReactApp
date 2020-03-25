import React, { Component } from 'react';
import autoBind from 'react-autobind';
import { connect } from 'react-redux';
import strings from '../../services/strings';
import language from '../../services/language';
import { Link, browserHistory } from 'react-router';
import _ from 'lodash';

import './UserForm.scss';

import Dropzone from 'react-dropzone';

import Modal from 'boron/DropModal';

class UserForm extends Component {

    state = {
        currentItemLoaded: false,
        file: null,
        fileRejected: false,
        form: {
            first_name: '',
            last_name: '',
            email: '',
            image: '',
            password: '',
            newPassword: '',
            confirmPassword: '',
        },
    }
    
    constructor(props) {
        super(props);
        autoBind(this);
    }

    componentDidMount() {
        this.tryLoadCurrentItem();
    }

    componentDidUpdate() {
        this.tryLoadCurrentItem();
    }

    tryLoadCurrentItem() {
        if (this.props.currentItem && !_.isEmpty(this.props.currentItem) && !this.state.currentItemLoaded) {
            let form = _.extend({}, this.state.form);
            _.map(this.state.form, (value, key) => {
                form[key] = (this.props.currentItem[key]) ? this.props.currentItem[key] : this.state.form[key];
            })
            this.setState({
                currentItemLoaded: true,
                form
            });
        }
    }

    hasError(inputName) {
        return !!this.props.exceptions[inputName];
    }

    getErrorClass(inputName, defaultClasses = '') {
        return this.hasError(inputName) ? defaultClasses + ' has-error' : defaultClasses;
    }

    getErrorMessage(inputName) {
        return this.props.exceptions[inputName];
    }

    getPreviewImage() {
        if (this.state.file) {
            return (<img src={ this.state.file.preview } />);
        } else {
            return (this.props.currentItem && this.props.currentItem.imageURL) ? (
                <img src={ this.props.currentItem.imageURL } />
            ) : null;
        }
    }

    handleInputChange(e) {
        let form = {};
        form[e.target.name] = e.target.value;
        this.setState({
            form: _.extend(this.state.form, form)
        });
    }

    handleFileDrop(acceptedFiles, rejectedFiles) {
        if (rejectedFiles.length) {
            this.setState({
                fileRejected: true,
            })
        } else {
            this.setState({
                file: _.first(acceptedFiles),
                fileRejected: false,
            })
        }
    }

    handleSaveClick(e) {
        e.preventDefault();
        this.props.saveItem(this.state);
    }

    handleSavePasswordClick(e) {
        this.props.updatePassword({
            password:this.state.form.password, 
            newPassword:this.state.form.newPassword, 
            confirmPassword:this.state.form.confirmPassword
        });

        setTimeout(() => {
            if (!this.hasError('password') && !this.hasError('newPassword') && !this.hasError('confirmPassword')) {
                this.hideModal();
                this.showSaveModal();
            }
        }, 500);
    }

    handleCancelClick(e) {
        e.preventDefault();
    }

    showModal(){
        this.refs.modalChangePassword.show() ;
    }

    showSaveModal() {
        this.refs.saveModal.show();
    }

    hideSaveModal() {
        this.refs.saveModal.hide();
    }
    
    handleShowModal() {
        _.delay(() => {
            this.hideSaveModal();
        }, 500);
    }

    hideModal(){
        this.refs.modalChangePassword.hide();
    }

    render() {
        let firstNameLabel = this.hasError('first_name') ? `${strings.get('Client.profilePage.firstName')} ${this.getErrorMessage('first_name')}` : strings.get('Client.profilePage.firstName');
        let lastNameLabel = this.hasError('last_name') ? `${strings.get('Client.profilePage.lastName')} ${this.getErrorMessage('last_name')}` : strings.get('Client.profilePage.lastName');
        let emailLabel = this.hasError('email') ? `${strings.get('Client.profilePage.email')} ${this.getErrorMessage('email')}` : strings.get('Client.profilePage.email');
        let passwordLabel = this.hasError('password') ? `${strings.get('Client.changePasswordPage.password')} ${this.getErrorMessage('password')}` : strings.get('Client.changePasswordPage.password');
        let newPasswordLabel = this.hasError('newPassword') ? `${strings.get('Client.changePasswordPage.newPassword')} ${this.getErrorMessage('newPassword')}` : strings.get('Client.changePasswordPage.newPassword');
        let confirmPasswordLabel = this.hasError('confirmPassword') ? `${strings.get('Client.changePasswordPage.confirmPassword')} ${this.getErrorMessage('confirmPassword')}` : strings.get('Client.changePasswordPage.confirmPassword');
        let imageLabel = this.hasError('image') ? strings.get('Exceptions.imageTooBig') : strings.get('Client.profilePage.image');
        let dropzoneContent = this.getPreviewImage() ? this.getPreviewImage() : strings.get('Client.profilePage.chooseImage');
        return (
            <div className="UserForm">
                <form className="col-sm-12 col-md-12">
                    <div className={ this.getErrorClass('first_name', 'form-group') }>
                        <label className="control-label">{ firstNameLabel }</label>
                        <input className="form-control" type="text" name="first_name" value={ this.state.form.first_name } onChange={ this.handleInputChange } />
                    </div>
                    <div className={ this.getErrorClass('last_name', 'form-group') }>
                        <label className="control-label">{ lastNameLabel }</label>
                        <input className="form-control" type="text" name="last_name" value={ this.state.form.last_name } onChange={ this.handleInputChange } />
                    </div>
                    <div className={ this.getErrorClass('email', 'form-group') }>
                        <label className="control-label">{ emailLabel }</label>
                        <input className="form-control" type="text" name="email" value={ this.state.form.email } onChange={ this.handleInputChange } />
                    </div>
                    <div className="form-group">
                        <a className="btn btn-primary pull-left" onClick={this.showModal}>{strings.get('Client.profilePage.changePassword')}</a>
                    </div><br/><br/><br/>
                    <div className={ this.getErrorClass('image', 'form-group') }>
                        <label className="control-label">{ imageLabel }</label>
                        <Dropzone
                            className="dropzone"
                            onDrop={ this.handleFileDrop }
                            multiple={ false }
                            maxSize={ 4096000 }
                            accept="image/*">
                            { dropzoneContent }
                        </Dropzone>
                    </div>
                    <div className="form-actions">
                        <button className="btn btn-primary" onClick={ this.handleSaveClick }>{strings.get('Client.profilePage.save')}</button>
                        <button className="btn btn-default" onClick={ this.handleCancelClick }>{strings.get('Client.profilePage.cancel')}</button>
                        <Link className="btn btn-default close-link" to={'/'}>{strings.get('Client.profilePage.close')}</Link>
                    </div>
                    <Modal className="boron-modal" ref="modalChangePassword">
                        <div>
                            <h2>{ strings.get('Client.profilePage.changePassword') }</h2>
                            <div className={ this.getErrorClass('password', 'form-group')}>
                                <input className="form-control" type="password" name="password" placeholder={ passwordLabel } onChange={ this.handleInputChange } />
                            </div>
                            <div className={ this.getErrorClass('newPassword', 'form-group')}>
                                <input className="form-control" type="password" name="newPassword" placeholder={ newPasswordLabel } onChange={ this.handleInputChange } />
                            </div>
                            <div className={ this.getErrorClass('confirmPassword', 'form-group')}>
                                <input className="form-control" type="password" name="confirmPassword" placeholder={ confirmPasswordLabel } onChange={ this.handleInputChange } />
                            </div>
                        </div>
                        <div className="form-actions">
                            <a className="btn btn-secondary" onClick={ this.handleSavePasswordClick }>{strings.get('Client.changePasswordPage.save')}</a>
                            <a className="btn btn-default" onClick={this.hideModal}>{strings.get('Client.changePasswordPage.cancel')}</a>
                        </div>
                    </Modal>
                    <Modal className="boron-modal" ref="saveModal" onShow={ this.handleShowModal }>
                            <span>
                                <h2>{strings.get('App.settings.settingsSaved')}</h2>
                            </span>
                    </Modal>
                </form>
            </div>

        );
    }

}

UserForm.propTypes = {
    currentItem: React.PropTypes.object,
    saveItem: React.PropTypes.func.isRequired,
}

export default UserForm;