import React, { Component } from 'react';
import autoBind from 'react-autobind';
import strings from '../../services/strings';
import { browserHistory, Link } from 'react-router';
import _ from 'lodash';
import './DocumentList.scss';

class DocumentList extends Component {

    constructor(props) {
        super(props);
        autoBind(this);
    }

    getTitle() {
        if (_.size(this.props.items)) {
            return <h2>Documents</h2>;
        }
    }

    getItems() {
        let locale = JSON.parse(localStorage.getItem('language')).iso2;
        if (this.props.items) {
            return _.map(this.props.items, item => (
                <li key={ item.id }>
                    <Link to={`/${locale}/categories/${item.category_id}/documents/${item.id}`} onMouseOver={() => this.handleMouseOver(item.id) }>
                        <i className="ion-document-text paper-icon"></i>
                        <span className="title">{ item.name }</span>
                        <span className="btn btn-default">Start Documenten</span>
                    </Link>
                </li>
            ));
        }
    }


    handleMouseOver(id) {
        if (this.props.onMouseOver) this.props.onMouseOver(id);
    }

    render() {
        return (
            <div className="DocumentList" style={{ display: _.size(this.props.items) ? 'block' : 'none' }}>
                { this.getTitle() }
                <ul>
                    { this.getItems() }
                </ul>
            </div>
        );
    }
}

DocumentList.propTypes = {
    items: React.PropTypes.array,
    onMouseOver: React.PropTypes.func,
}

export default DocumentList;