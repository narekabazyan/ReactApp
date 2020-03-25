import React, { Component } from 'react';
import autoBind from 'react-autobind';
import config from '../../config';
import strings from '../../services/strings';
import _ from 'lodash';
import './Counter.scss';

class Counter extends Component {

    constructor(props) {
        super(props);
        autoBind(this);
    }

    getItems() {

        return _.map(this.props.items, (item, i) => {
            let className = "col-sm-3 col-xs-6 withDivider";
            if (i === _.size(this.props.items) - 1) {
                className = "col-sm-3 col-xs-6";
            }

            return (
                <div key={`item-${i}`} className={ className }>
                    <p className="count">{ item.count }</p>
                    <p className="title">{ strings.get(`Client.homePage.counter.${item.title}`) }</p>
                </div>
            );
        });
    }

    render() {
        return (
            <div className="counter">
                <div id="counterOpacity" />
                <div className="row">
                    { this.getItems() }
                </div>
            </div>
        );
    }
}

export default Counter;