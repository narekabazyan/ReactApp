import React, { Component } from 'react';
import autoBind from 'react-autobind';
import { connect } from 'react-redux';
import strings from '../../services/strings';
import { Link,browserHistory } from 'react-router';
import auth from '../../services/auth';
import Breadcrumbs from '../../components/Breadcrumbs';
import '../Page.scss';

import * as authActions from '../../store/auth/actions';
import * as authSelectors from '../../store/auth/selectors';
import * as userActions from '../../store/user/actions';

import UserForm from '../../components/user/UserForm'
import NavigationTabs from '../../components/NavigationTabs';
import Topbar from '../../components/Topbar';
import Modal from 'boron/DropModal';


class UserProfilePage extends Component {

    constructor(props) {
        super(props);
        autoBind(this);
    }

    componentDidMount() {
        if(!auth.isAuthenticated()){
            browserHistory.push('/');
        }
        this.setState({ user: auth.getLocalUser() ? auth.getLocalUser() : null});
    }

    handleShowModal() {
        _.delay(() => {
            this.hideSaveModal();
        }, 500);
    }

    showSaveModal() {
        this.refs.saveModal.show();
    }

    hideSaveModal() {
        this.refs.saveModal.hide();
    }

    async saveUser(data) {
        await this.props.updateUser(data.form);
        this.props.getUser();
        
        if (data.file) {
            await this.props.uploadUserImage(data.file);
        }

        this.showSaveModal();
    }

    savePassword(data){
        this.props.updatePassword(data);
    }
    
    render() {
        let locale = JSON.parse(localStorage.getItem('language')).iso2;
        return (
            <div className="UserProfilePage">
                <Modal className="boron-modal no-body" ref="saveModal" onShow={ this.handleShowModal }>
                    <span>
                        <h2>{strings.get('App.settings.settingsSaved')}</h2>
                    </span>
                </Modal>
                <Topbar
                    title={strings.get('Client.homePage.title')}
                    subtitle={strings.get('Client.homePage.subTitle')}
                    searchBox={ true }
                    handleLangChange={ this.props.handleLangChange }
                    currentLang={ this.props.currentLang }
                    currentView="userProfilePage"
                />
                <div className="container">
                
                    <Breadcrumbs>
                        <Link to={`/${locale}/`}>{ strings.get('Client.homePage.home') }</Link>
                        <Link to={`/${locale}/profile`}>{ strings.get('Client.homePage.profile') }</Link>
                    </Breadcrumbs>

                    <div className="container-row">
                        <NavigationTabs
                            currentItemId={0}
                            currentLang={ this.props.currentLang }
                        />
                        <UserForm
                            exceptions={ this.props.exceptions }
                            currentItem={ this.props.profile }
                            saveItem={ this.saveUser }
                            updatePassword={ this.savePassword }
                            currentLang={ this.props.currentLang }
                        />
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {   
        profile: authSelectors.getProfile(state),
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getUser: () => {
            dispatch(authActions.getUser())
        },
        updateUser: (data) => {
            return dispatch(userActions.updateUser(data))
        },
        updatePassword: (data) => {
            return dispatch(userActions.updatePassword(data))
        },
        uploadUserImage: (file) => {
            return dispatch(userActions.uploadUserImage(file))
        },

    }
}
export default connect(mapStateToProps, mapDispatchToProps)(UserProfilePage);