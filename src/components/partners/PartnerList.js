import React, { Component } from 'react';
import autoBind from 'react-autobind';
import config from '../../config';
import strings from '../../services/strings';
import _ from 'lodash';
import './PartnerList.scss';

class PartnerList extends Component {

    constructor(props) {
        super(props);
        autoBind(this);
    }

    handleLeftArrowClick(e) {
        let arr = document.getElementsByClassName('partner');
        if(arr.length <= 4)
            return;

        let visibles = document.getElementsByClassName('partner visible');
        visibles = _.map(visibles, (item) => {return item;});
        for(let i = 0; i < arr.length; i++) {
            if(visibles.indexOf(arr[i]) >= 0){
                let n = i;
                n++;
                if(n > arr.length-1)
                    return

                arr[n].classList.add('visible');
            }
        }
        visibles[0].classList.remove('visible');
    }

    handleRightArrowClick(e) {
        let arr = document.getElementsByClassName('partner');
        if(arr.length <= 4)
            return;

        let visibles = document.getElementsByClassName('partner visible');
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

    getItems() {
        let visiblesCount = 0;
        return _.map(this.props.items, (item, i)=> {
            let className = "partner col-md-2";
            if(item.visible) {
                if(visiblesCount < 4) {
                    className = "partner col-md-2 visible";
                }
                visiblesCount++;
            } else {
                className = "partner col-md-2";
            }
            return(
                <div className={className} key={`item-${i}`}>
                    <a href={item.url} target="_blank">
                        <img src={item.imageURL} alt={item.name}/>
                    </a>
                </div>
            );
        })
    }

    render() {
        return (
            <div className="partnerList">
                <h2>{strings.get('Client.homePage.ourPartners')}</h2>
                <div className="row">
                    <div className="arrows ion-ios-arrow-left left col-md-1" onClick={ this.handleLeftArrowClick }></div>
                    { this.getItems() }
                    <div className="arrows ion-ios-arrow-right right col-md-1" onClick={ this.handleRightArrowClick }></div>
                </div>
            </div>
        );
    }
}

export default PartnerList;