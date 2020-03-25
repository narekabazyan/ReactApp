import React, { Component } from 'react';
import autoBind from 'react-autobind';
import strings from '../../services/strings';
import { Link } from 'react-router';
import _ from 'lodash';
import config from '../../config';
import './NewsList.scss';

class NewsList extends Component {

    constructor(props) {
        super(props);
        autoBind(this);
    }

    getItems() {
        let locale = JSON.parse(localStorage.getItem('language')).iso2;
        let className = "row";
        return _.map(this.props.items, (item, i) => {
            className = i === 0 ? "row active" : "row";
            return (
                <div className={className} id={`container-${i}`} key={`item-${i}`}>
                    <div className="col-md-5 leftContainer">
                        <img className="newsImage" src={config.API_ENDPOINT+'/images/News.jpg'} />
                    </div>
                    <div className="col-md-7 rightContainer">
                        <p className="newsTitle">Lorem ipsum is dolor sit amet <b>{i}</b></p>
                        <p className="newsDate">{strings.get('Client.homePage.news.created')}: <span className="date">Feb, 04, 2016</span> <span className="divider">|</span> {strings.get('Client.homePage.news.updated')}: <span className="date">April, 04, 2017</span></p>
                        <hr/>
                        <p className="newsContent">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi vitae neque mauris. Aliquam at sodales eros. Praesent interdum auctor nunc, et blandit neque lacinia ut. Integer aliquet pulvinar fringilla. Vestibulum eget pharetra nisl. Quisque ut dolor non lorem interdum malesuada.</p>
                        <Link to={`/${locale}/news/${i}`}>{ strings.get('Client.homePage.readMore') }</Link>
                    </div>
                </div>
            );
        });
    }

    getBullets() {
        let className = "bullet";
        return _.map(this.props.items, (item, i) => {
            className = i === 0 ? "bullet active" : "bullet";
            return (
                <li id={`bullet-${i}`} className={className} key={`item-${i}`} onClick={this.handleBulletClick}/>
            );
        })
    }

    handleBulletClick(e) {
        let prevBullet = document.getElementsByClassName('bullet active')[0];
        let prevId = prevBullet.id.split('bullet-')[1];
        let prevContainer = document.getElementById('container-'+prevId);
        let nextBullet = e.target;
        let nextId = e.target.id.split('bullet-')[1];
        let nextContainer = document.getElementById('container-'+nextId);
        prevContainer.classList.remove("active");
        nextContainer.classList.add("active");
        prevBullet.classList.remove("active");
        nextBullet.classList.add("active");
    }

    render() {
        return(
            <div className="newsList">
                <h2>{strings.get('Client.homePage.news.title')}</h2>
                {this.getItems()}
                <ul className="bullets">
                    {this.getBullets()}
                </ul>
            </div>
        );
    }
}

export default NewsList;