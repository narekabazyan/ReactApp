import React, { Component } from 'react';
import autoBind from 'react-autobind';
import strings from '../services/strings';
import language from '../services/language';
import { browserHistory } from 'react-router';
import config from '../config';

import './Topbar.scss';

import Navbar from '../containers/Navbar';
import SearchBox from '../containers/SearchBox';
import LanguageSelector from '../containers/LanguageSelector'; 

class Topbar extends Component {

    state = {
        readMoreLInkShow: false,
        navBarIsVisible: false,
    }

    constructor(props) {
        super(props);
        autoBind(this);
    }

    getSearchBox() {
        if (this.props.searchBox) {
            let className = "";
            if(this.props.currentView === "userProfilePage"){
                className = "profilePage";
            }
            return <SearchBox className={className} currentLang={ language.getIso2() } />;
        }
    }

    getReadMoreButton() {
        if (this.props.readMoreLink) {
            return (
                <a target="_blank" href={ this.props.readMoreLink } className="readMore" onClick={ this.readMoreButtonClick }>
                    { strings.get('Client.homePage.readMore') }
                </a>
            )
        }
    }

    getDivider() {
        if (this.props.divider) {
            return <div className="divider"></div>;
        }
    }

    readMoreButtonClick() {
        this.setState({ descriptionShow: !this.state.descriptionShow });
    }

    handleHWTClick(e) {
        e.preventDefault();
    }

    getHowItWorksButton() {
        return (
            <div id="howItWorks" onClick={ this.handleHWTClick }>
                <a href="#">{strings.get('Client.homePage.howItWorks')}</a>
                <i className="ion-social-youtube"></i>
            </div>
        );
    }

    handleMenuButtonClick() {
        let navbar = document.getElementsByClassName('Navbar')[0];
        let menuButton = document.getElementsByClassName('menuButton')[0];
        
        if (!this.state.navBarIsVisible){
            navbar.setAttribute('style', 'display:block;');
            menuButton.style.right = "105px";
            this.setState({navBarIsVisible: true});
        } else {
            navbar.setAttribute('style', 'display:none;');
            menuButton.style.right = "5px";
            this.setState({navBarIsVisible: false});
        }
    }

    handleLogoClick() {
        browserHistory.push("/");
    }

    render() {
        return (
            <div className="Topbar">
                <div className="logo" onClick={this.handleLogoClick}>
                    <span>Juri</span>
                    <span>docs</span>
                </div>
                <LanguageSelector currentLang={ this.props.currentLang } handleLangChange={this.props.handleLangChange} />
                <Navbar currentLang={this.props.currentLang} handleNewsClick={this.props.handleNewsClick} />
                <div className="menuButton" onClick={this.handleMenuButtonClick }><i className="ion-navicon-round" /></div>
                <div className="title">{ this.props.title }</div>
                { this.getDivider() }
                <div className="subtitle">{ this.props.subtitle }</div>
                { this.props.description ? <div className="description">{ this.props.description }</div> : null }
                { this.getReadMoreButton() }
                { this.getSearchBox() }
                { this.getHowItWorksButton() }
            </div>
        );
    }

}

Topbar.propTypes = {
    title: React.PropTypes.string,
    subtitle: React.PropTypes.string,
    divider: React.PropTypes.bool,
    searchBox: React.PropTypes.bool,
}

export default Topbar;