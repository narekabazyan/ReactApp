import React, { Component } from 'react';
import autoBind from 'react-autobind';
import { connect } from 'react-redux';
import strings from '../services/strings';
import auth from '../services/auth';
import { Link } from 'react-router';
import _ from 'lodash';
import './Navbar.scss';

import * as authActions from '../store/auth/actions';
import * as authSelectors from '../store/auth/selectors';
import * as exceptionsSelectors from '../store/exceptions/selectors';
import * as exceptionsActions from '../store/exceptions/actions';

import Modal from 'boron/DropModal';
import scrollToComponent from 'react-scroll-to-component';

class Navbar extends Component {

    state = {
        showDropdown: false,
        userLoaded: false,
        form: {
            first_name: '',
            last_name: '',
            email: '',
            password: '',
        },
    }

    listeners = {};

    componentDidUpdate(){
        _.delay(()=>{
            if(localStorage.getItem("userUpdated") ===  "true"){
                this.setState({user : auth.getLocalUser()});
                localStorage.setItem("userUpdated",false);
            }
        },250);
    }

    componentDidMount() {
        this.listeners.onMouseUp = (e) => {
            this.setState({ showDropdown: false });
        }

        window.addEventListener('mouseup', this.listeners.onMouseUp);
    }

    constructor(props) {
        super(props);
        autoBind(this);
    }

    componentWillUnmount() {
        window.removeEventListener('mouseup', this.listeners.onMouseUp);
    }

    hasError(inputName) {
        return !!this.props.exceptions[inputName];
    }

    getErrorClass(inputName, defaultClasses = '') {
        return this.hasError(inputName) ? defaultClasses + ' has-error' : defaultClasses;
    }

    getLoginErrors() {
        let error = '';
        if (_.size(this.props.exceptions)) {
            if(this.props.exceptions.errors == "user_blocked"){
                error = strings.get('Exceptions.user_blocked');
            }else {
                error = 'Invalid Credentials.';
            }
            return (
                <div className="alert alert-danger">{ error }</div>
            );
        }
    }

    getRegisterErrors() {
        let error = '';
        if (_.size(this.props.exceptions)) {
            if (this.props.exceptions.email && this.props.exceptions.email == strings.get('Exceptions.duplicated')) {
                error = 'Email already in use.';
            } else {
                error = 'All fields are required.';
            }

            return (
                <div className="alert alert-danger">{ error }</div>
            );
        }
    }

    getLoginModal() {
        return (
            <Modal className="boron-modal form-modal" ref="loginModal" onHide={ this.handleModalHide }>
                <h2>Login to your Account</h2>
                <p>Join our wonderful community and let other helps you without a single penny.</p>
                { this.getLoginErrors() }
                <div className="form-group">
                    <input className="form-control" type="text" name="email" placeholder={strings.get('Client.loginPage.email')} value={ this.state.form.email } onChange={ this.handleInputChange } />
                </div>
                <div className="form-group">
                    <input className="form-control" type="password" name="password" placeholder={strings.get('Client.loginPage.password')} value={ this.state.form.password } onChange={ this.handleInputChange } />
                </div>
                <div className="form-actions">
                    <button className="btn btn-secondary" onClick={ this.handleLoginSendClick }>{strings.get('Client.loginPage.login')}</button>
                    <button className="btn btn-default" onClick={ this.handleCancelClick }>{strings.get('Client.loginPage.cancel')}</button>
                </div>
            </Modal>
        )
    }

    getRegisterModal() {
        return (
            <Modal className="boron-modal form-modal" ref="registerModal" onHide={ this.handleModalHide }>
                <h2>Create New Account</h2>
                <p>Join our wonderful community and let other helps you without a single penny.</p>
                { this.getRegisterErrors() }
                <div className={ this.getErrorClass('first_name', 'form-group') }>
                    <input className="form-control" type="text" name="first_name" placeholder={strings.get('Client.registerPage.firstName')} value={ this.state.form.first_name } onChange={ this.handleInputChange } />
                </div>
                <div className={ this.getErrorClass('last_name', 'form-group') }>
                    <input className="form-control" type="text" name="last_name" placeholder={strings.get('Client.registerPage.lastName')} value={ this.state.form.last_name } onChange={ this.handleInputChange } />
                </div>
                <div className={ this.getErrorClass('email', 'form-group') }>
                    <input className="form-control" type="text" name="email" placeholder={strings.get('Client.registerPage.email')} value={ this.state.form.email } onChange={ this.handleInputChange } />
                </div>
                <div className={ this.getErrorClass('password', 'form-group') }>
                    <input className="form-control" type="password" name="password" placeholder={strings.get('Client.registerPage.password')} value={ this.state.form.password } onChange={ this.handleInputChange } />
                </div>
                <div className="form-actions">
                    <button className="btn btn-secondary" onClick={ this.handleRegisterSendClick }>{strings.get('Client.registerPage.register')}</button>
                    <button className="btn btn-default" onClick={ this.handleCancelClick }>{strings.get('Client.registerPage.cancel')}</button>
                </div>
            </Modal>
        )
    }

    getUserName() {
        if (this.props.profile && !_.isEmpty(this.props.profile)) {
            return `${this.props.profile.first_name} ${this.props.profile.last_name}`;
        }
    }

    getMenu() {
        let locale = JSON.parse(localStorage.getItem('language')).iso2;
        if (this.props.profile && !_.isEmpty(this.props.profile)) {
            let userImg = this.props.profile.imageURL ? <img src={this.props.profile.imageURL} /> : <i className="ion-person"></i> ;
            return (
                <span>
                    <Link className="btn" to={`/${locale}/`}>{strings.get('Client.homePage.home')}</Link>
                    <Link className="btn" to={`/${locale}/categories`}>{strings.get('Client.homePage.title')}</Link>
                    <Link style={{marginRight: "15px"}} className="btn" to={`/${locale}/newsContainer`} onClick={this.props.handleNewsClick}>{strings.get('Client.homePage.news.title')}</Link>

                    <a href="#" className="profile" onClick={ this.handleProfileClick }>
                        { userImg } { this.getUserName() }
                    </a>
                </span>
            )
        } else {
            return (
                <span>
                    <Link className="btn" to={`/${locale}/`}>{strings.get('Client.homePage.home')}</Link>
                    <Link className="btn" to={`/${locale}/categories`}>{strings.get('Client.homePage.title')}</Link>
                    <Link className="btn" to={`/${locale}/#newsContainer`} onClick={this.props.handleNewsClick}>{strings.get('Client.homePage.news.title')}</Link>
                    <a className="btn" href="#" onClick={ this.handleLoginClick }>{strings.get('Client.homePage.login')}</a>
                    <a className="btn btn-primary" href="#" onClick={ this.handleRegisterClick }>{strings.get('Client.homePage.register')}</a>
                </span>
            );
        }
    }

    getDropdown() {
        let locale = JSON.parse(localStorage.getItem('language')).iso2;

        if (this.state.showDropdown) {
            return (
                <ul className="dropdown-menu">
                    <li>
                        <Link to={`/${locale}/profile`}>{strings.get('Client.homePage.profile')}</Link>
                    </li>
                    <li><a href="#" onClick={ this.handleLogoutClick }>{strings.get('Client.homePage.logout')}</a></li>
                </ul>
            );
        }
    }

    handleInputChange(e) {
        let item = {};
        item[e.target.name] = e.target.value;
        this.setState({
            form: _.extend(this.state.form, item)
        });
    }

    handleModalHide() {
        this.props.clearExceptions();
        this.setState({
            form: {
                first_name: '',
                last_name: '',
                email: '',
                password: '',
            }
        })
    }

    handleProfileClick(e) {
        this.setState({ showDropdown: !this.state.showDropdown });
    }

    handleMouseOver() {
        window.removeEventListener('mouseup', this.listeners.onMouseUp);
    }

    handleMouseOut() {
        window.addEventListener('mouseup', this.listeners.onMouseUp);
    }

    handleLogoutClick() {
        this.setState({ showDropdown: false });
        this.props.logout();
    }

    handleLoginClick() {
        this.refs.loginModal.show();
    }

    handleRegisterClick() {
        this.refs.registerModal.show();
    }

    handleLoginSendClick() {
        this.props.login(this.state.form);
    }

    handleRegisterSendClick() {
        this.props.register(this.state.form);
    }

    handleCancelClick() {
        this.refs.registerModal.hide();
        this.refs.loginModal.hide();
    }

    render() {
        return (
            <div className="Navbar" onMouseOver={ this.handleMouseOver } onMouseOut={ this.handleMouseOut }>
                { this.getLoginModal() }
                { this.getRegisterModal() }

                { this.getMenu() }
                { this.getDropdown() }
            </div>
        );
    }

}

function mapStateToProps(state) {
    return {
        exceptions: exceptionsSelectors.getItems(state),
        profile: authSelectors.getProfile(state),
    }
}

function mapDispatchToProps(dispatch) {
    return {
        login: (data) => {
            dispatch(authActions.login(data))
        },
        register: (data) => {
            dispatch(authActions.register(data))
        },
        logout: () => {
            dispatch(authActions.logout())
        },
        clearExceptions: () => {
            dispatch(exceptionsActions.clear())
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);