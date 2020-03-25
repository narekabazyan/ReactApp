import React, { Component } from 'react';
import autoBind from 'react-autobind';
import strings from '../services/strings';
import _ from 'lodash';

import './Breadcrumbs.scss';

class Breadcrumbs extends Component {

    constructor(props) {
        super(props);
        autoBind(this);
    }

    getItems() {
        let items = [];
        if (this.props.children) {
            _.each(this.props.children, (item, key) => {
                items.push(
                    <span key={ _.uniqueId() }>{ item }</span>
                )

                if (key != this.props.children.length - 1) {
                    items.push(
                        <span className="divider" key={ _.uniqueId() }>/</span>
                    );
                }
            });
        }

        return items;
    }

    render() {
        return (
            <div className="Breadcrumbs">
                { this.getItems() }
            </div>
        );
    }

}

Breadcrumbs.propTypes = {
    //
}

export default Breadcrumbs;