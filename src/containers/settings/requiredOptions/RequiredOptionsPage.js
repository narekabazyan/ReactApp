import React, { Component } from 'react';
import autoBind from 'react-autobind';
import { connect } from 'react-redux';
import strings from '../../../services/strings';
import { Link,browserHistory } from 'react-router';
import auth from '../../../services/auth';
import Breadcrumbs from '../../../components/Breadcrumbs';
import '../../Page.scss';
import RequiredOptionsList from '../../../components/settings/requiredOptions/RequiredOptionsList';

import * as requiredOptionsActions from '../../../store/requiredOptions/actions';
import * as requiredOptionsSelectors from '../../../store/requiredOptions/selectors';

import Topbar from '../../../components/Topbar';
import NavigationTabs from '../../../components/NavigationTabs';
import Modal from 'boron/DropModal';


class RequiredOptionsPage extends Component {

    state = {
        user :null
    };
    constructor(props) {
        super(props);
        autoBind(this);
    }

    componentDidMount() {
        if(!auth.isAuthenticated()){
            browserHistory.push('/');
        }
        this.setState({user : auth.getLocalUser() ? auth.getLocalUser() : null});

        this.props.fetchAllRequiredOptions();
    }
    handleShowModal() {
        _.delay(() => {
            this.hideSaveModal();
        }, 500);
    }
    showSaveModal() {
        this.refs.saveModal.show();
        _.delay(() => {
            window.location.reload();
        }, 1000);
    }
    hideSaveModal() {
        this.refs.saveModal.hide();
    }
    saveData(data) {
        let updateRequiredOptions = this.props.updateRequiredOptions(data);
        Promise.all([updateRequiredOptions])
            .then(() => {
                this.showSaveModal();
            });
    }
    render() {
        let locale = JSON.parse(localStorage.getItem('language')).iso2;
        return (
            <div className="RequiredOptionsPage">
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
                        <Link to={`/${locale}/`}>{strings.get('Client.homePage.home')}</Link>
                        <Link to={`/${locale}/Settings`}>{strings.get('Client.profilePage.settings')}</Link>
                    </Breadcrumbs>

                    <div className="container-row">
                        <NavigationTabs
                            currentItemId={2}
                        />
                        <RequiredOptionsList
                            items={ this.props.requiredOptions }
                            currentItem={ this.props.currentRequiredOption }
                            updateItem={ this.saveData }
                            setCurrentItemId={ this.props.setCurrentRequiredOptionId }
                            unsetCurrentItemId={ this.props.unsetCurrentRequiredOptionId }
                        />
                    </div>
                </div>
            </div>
        );
    }

}

function mapStateToProps(state) {
    return {
        requiredOptions: requiredOptionsSelectors.getItems(state),
        currentRequiredOption: requiredOptionsSelectors.getCurrentItem(state),
    }
}

function mapDispatchToProps(dispatch) {
    return {
        fetchAllRequiredOptions: () => {
            dispatch(requiredOptionsActions.fetchAllItems())
        },
        updateRequiredOptions: (data) => {
            dispatch(requiredOptionsActions.updateItem(data))
        },
        setCurrentRequiredOptionId: (id) => {
            dispatch(requiredOptionsActions.setCurrentItemId(id))
        },
        unsetCurrentRequiredOptionId: () => {
            dispatch(requiredOptionsActions.unsetCurrentItemId())
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(RequiredOptionsPage);