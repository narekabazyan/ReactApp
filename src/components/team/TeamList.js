import React, { Component } from 'react';
import autoBind from 'react-autobind';
import strings from '../../services/strings';
import { Link } from 'react-router';
import _ from 'lodash';
import './TeamList.scss';

class TeamList extends Component {

    constructor(props) {
        super(props);
        autoBind(this);
    }

    handleLeftArrowClick() {
        let arr = document.getElementsByClassName('teamMember');
        if(arr.length <= 4)
            return;

        let visibles = document.getElementsByClassName('teamMember visible');
        visibles = _.map(visibles, (item) => {return item;});

        for(let i = 0; i < arr.length; i++) {
            if(visibles.indexOf(arr[i]) >= 0) {
                let n = i;
                n++;
                if(n > arr.length - 1)
                    return;

                arr[n].classList.add('visible');
            }
        }
        visibles[0].classList.remove('visible');
    }

    handleRightArrowClick() {
        let arr = document.getElementsByClassName('teamMember');
        if(arr.length <= 4)
            return;

        let visibles = document.getElementsByClassName('teamMember visible');
        visibles = _.map(visibles, (item) => {return item;});
        for(let i = 0; i < arr.length; i++) {
            if(visibles.indexOf(arr[i]) >= 0) {
                let n = i;
                n--;
                if(n < 0)
                    return;

                arr[n].classList.add('visible');
            }
        }
        visibles[3].classList.remove('visible');
    }

    getImage(item) {
        if(item.imageURL) {
            return (
                <div style={{backgroundColor: "#fff"}} className="grey">
                    <img style={{width: "auto", height: "auto", maxWidth: "100%", maxHeight: "100%"}} src={item.imageURL}/>
                </div>
            );
        } else {
            return(
                <div className="grey" />
            );
        }
    }

    getItems() {
        let locale = JSON.parse(localStorage.getItem('language')).iso2;
        return _.map(this.props.items, (item, i) => {
            let className = item.visible ? "col-md-3 teamMember visible" : "col-md-3 teamMember";
            return (
                <div key={`teamMember-${i}`} id={`teamMember-${i}`} className={ className }>
                    { this.getImage(item) }
                    <Link className="name" to={`${locale}`}>{`${item.first_name} ${item.last_name}`}</Link>
                    <p className="position">{item.position}</p>
                    <p className="description">{item.description}</p>
                </div>
            );
        });
    }

    render() {
        return (
            <div className="teamList">
                <div className="row">
                    <h2>{strings.get('Client.homePage.ourTeam')}</h2>
                    <div className="arrows">
                        <div className="arrow ion-ios-arrow-left" onClick={ this.handleLeftArrowClick }></div>
                        <div className="arrow ion-ios-arrow-right" onClick={ this.handleRightArrowClick }></div>
                    </div>
                    { this.getItems() }
                </div>
            </div>
        );
    }
}

export default TeamList;
