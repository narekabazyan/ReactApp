import React, { Component } from 'react';
import autoBind from 'react-autobind';
import strings from '../../services/strings';
import _ from 'lodash';
import { Link } from 'react-router';
import './Footer.scss';

class Footer extends Component {
    constructor(props) {
        super(props);
        autoBind(this);
    }

    getContent(content, elemId) {

        let SCRIPT_REGEX = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
        while (SCRIPT_REGEX.test(content)) {
            content = content.replace(SCRIPT_REGEX, "");
        }
        $(`#${elemId}`).html(content);
    }

    getArticles(article) {
        return _.map(article, (item) => {
            if(item.url){
                return (
                    <li key={`item-${item.id}`} className="infoItem">
                        <a href={item.url} target="_blank" >{ item.name }</a>
                    </li>
                );
            } else {
                if(item.content_type) {
                    return (
                        <li id={`infoItem${item.id}`} key={`item-${item.id}`} className="infoItem">
                            {this.getContent(item.content, `infoItem${item.id}`)}
                        </li>
                    );
                }else {
                    return (
                        <li key={`item-${item.id}`} className="infoItem">
                            <a href={`/articles/${item.id}`}>{ item.name }</a>
                        </li>
                    );
                }
            }
        })
    }

    getContacts(articles) {
        return _.map(articles, (item) => {
            return (
                <li className="contactItem">
                    <span>{ `${strings.get('Client.homePage.footer.contactUs.phone')}:` }</span>
                    <span>+880 1723801729</span>
                </li>
            );
        })
    }

    getArticleCategories() {
        if(this.props.items) {
            return _.map(this.props.items, (item) => {
                if(item.name !== "Contact Us"){
                    return (
                    <div key={`item-${item.id}`} className="col-lg-3 col-md-3 col-sm-6 infoContainer">
                        <h3>{ item.name }</h3>
                        <ul className="information">
                            { this.getArticles(item.article) }
                        </ul>
                    </div>
                    );
                } else {
                    return (
                        <div key={`item-${item.id}`} className="col-lg-3 col-md-3 col-sm-6 contactContainer">
                            <h3>{ item.name }</h3>
                            <ul className="contactUs">
                                { this.getContacts(item.article) }
                            </ul>
                        </div>
                    );
                }
            })
        } else {
            return null;
        }
    }

    render() {
        let locale = JSON.parse(localStorage.getItem('language')).iso2;
        return (
            <div className="footer">
                <div className="row">
                    <div className="col-lg-3 col-md-3 col-sm-6 footerMenuContainer">
                        <h3>Juridocs</h3>
                        <ul className="footerMenu">
                            <li className="infoItem">
                                <Link to={`/${locale}/`}>{ strings.get('Client.homePage.home') }</Link>
                            </li>
                            <li className="infoItem">
                                <Link to={`/${locale}/`}>{ strings.get('Client.homePage.title') }</Link>
                            </li>
                            <li className="infoItem">
                                <Link to={`/${locale}/`}>{ strings.get('Client.homePage.news.title') }</Link>
                            </li>
                            <li className="infoItem">
                                <Link to={`/${locale}/`}>{ strings.get('Client.homePage.logout') }</Link>
                            </li>
                        </ul>
                    </div>
                    { this.getArticleCategories() }
                    <div className="col-lg-3 col-md-3 col-sm-6 socialContainer">
                        <ul className="socialIcons">
                            <li className="socialIcon googlePlus">
                                <i className="ion-social-googleplus" />
                            </li>
                            <li className="socialIcon twitter">
                                <i className="ion-social-twitter" />
                            </li>
                            <li className="socialIcon facebook">
                                <i className="ion-social-facebook" />
                            </li>
                            <li className="socialIcon linkedIn">
                                <i className="ion-social-linkedin" />
                            </li>
                        </ul>
                        <div className="logo">
                            <span>Juri</span>
                            <span>docs</span>
                        </div>
                    </div>
                </div>
                <p className="copyright">&#9400; 2017 <span className="blue">Juridocs</span> Copyrights. All Rights Reserved.</p>
            </div>
        );
    }
}

export default Footer;