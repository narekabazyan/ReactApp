import React, { Component } from 'react';
import autoBind from 'react-autobind';
import { connect } from 'react-redux';
import strings from '../services/strings';
import { Link } from 'react-router';
import _ from 'lodash';

import * as authSelectors from '../store/auth/selectors';
import * as authActions from '../store/auth/actions';
import './NavigationTabs.scss';

class NavigationTabs extends Component {

    constructor(props) {
        super(props);
        autoBind(this);
    }

    getMenuItems(primaryId){
        let locale = JSON.parse(localStorage.getItem('language')).iso2;
        let itemsContent = [[strings.get('Client.profilePage.profile') , "/profile"], [strings.get('Client.profilePage.downloads'),"/mydocuments"], [strings.get('Client.profilePage.settings'),"/settings"]];
        let items = _.map(itemsContent, (item, i) => (
            <Link className={(i == primaryId) ? 'btn btn-primary right pull-left' : 'btn btn-default right pull-left'} to={`/${locale+item[1]}`} key={i}>{item[0]}</Link>
        ));
        return items;
    }

    handleLogoutClick() {
        this.props.logout();
    }
    
    render() {
        let className = "NavigationTabs";
        if(this.props.currentView === "UserDocumentsPage") {
            className += " pull-right";
        }
        return (
            <div className={className}>
                { this.getMenuItems(this.props.currentItemId) }
                <Link className="btn btn-default right pull-left" href="#" onClick={ this.handleLogoutClick }>{strings.get('Client.profilePage.logout')}</Link><br/><br/>
            </div>
        );
    }

}
NavigationTabs.propTypes = {
    currentItemId: React.PropTypes.number.isRequired,
}

function mapStateToProps(state) {
    return {
        profile: authSelectors.getProfile(state),
    }
}


function mapDispatchToProps(dispatch) {
    return {
        logout: () => {
            dispatch(authActions.logout())
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(NavigationTabs);
