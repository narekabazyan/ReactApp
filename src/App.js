import classNames from 'classnames';
import React, { Component } from 'react';
import autoBind from 'react-autobind';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import strings from './services/strings';
import language from './services/language';
import auth from './services/auth';
import './App.scss';
import './AppTabletLandscape.scss';
import './AppTabletPortret.scss';
import './AppMobile.scss';

import * as authActions from './store/auth/actions';
import * as exceptionsSelectors from './store/exceptions/selectors';
import * as exceptionsActions from './store/exceptions/actions';

class App extends Component {

    state = {
        userLoaded: false,
    };

    constructor(props) {
        super(props);
        autoBind(this);
        let locale = this.props.params ? this.props.params.locale : null;
        if(locale){
            let locale = this.props.params.locale.toUpperCase();
            let languages = JSON.parse(localStorage.getItem('languages'));
            let lang = {id: 2, iso2: "NL"};
            for(let i = 0;i < languages.length;i++){
                if(locale === languages[i].iso2){
                    lang = languages[i];
                    break;
                }
            };
            language.set(lang);
            strings.setLanguage(lang).then(() => {
                this.props.handleLangChange();
            });
        }else{
            let lang = {id: 2, iso2: "NL"};
            language.set(lang);
            strings.setLanguage(lang).then(() => {
                this.props.handleLangChange();
            });
        }
    }



    componentDidMount() {
        try{
            let languages = [{id:1,iso2:'GB'},{id:2,iso2:'NL'},{id:3,iso2:'RU'}];
            localStorage.setItem('languages',JSON.stringify(languages));
        }catch(e){
            console.log(e);
        }
        this.tryLoadUser();
    }

    componentDidUpdate() {
        this.tryLoadUser();
    }

    async tryLoadUser() {
        if (!this.state.userLoaded) {
            await this.props.getUser();
            this.setState({ userLoaded: true });
        }
    }

    handleLangChange() {
        let lang = {};
        lang['id'] = language.get();
        lang['iso2'] = language.getIso2();
        this.setState({lang})
    }

    render() {
        let children = React.Children.map(this.props.children, (child) => {
            return React.cloneElement(child, {
                exceptions: this.props.exceptions,
                clearExceptions: this.props.clearExceptions,
                handleLangChange: this.handleLangChange,
                currentLang: this.state.lang,
            })
        })

        return (
            <div className="App">
                { children }
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        exceptions: exceptionsSelectors.getItems(state),
    }
}

function mapDispatchToProps(dispatch) {
    return {
        logout: () => {
            dispatch(authActions.logout())
        },
        clearExceptions: () => {
            dispatch(exceptionsActions.clear())
        },
        getUser: () => {
            return dispatch(authActions.getUser())
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);