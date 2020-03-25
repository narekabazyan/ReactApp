import React, {Component} from 'react';
import autoBind from 'react-autobind';
import strings from '../../services/strings';
import {browserHistory, Link} from 'react-router';
import _ from 'lodash';
import './SubCategoryList.scss';

class SubCategoriesList extends Component {

    constructor(props) {
        super(props);
        autoBind(this);
    }

    getImage(item) {
        if (item.imageURL) {
            return (<div className="categoryImage" style={{backgroundImage: `url(${item.imageURL})`}} />);
        }
    }

    getTitle() {
        if (_.size(this.props.items)) {
            return <h2>Subcategories</h2>;
        }
    }

    getItems() {
        let locale = JSON.parse(localStorage.getItem('language')).iso2;
        if (this.props.items) {
            return _.map(this.props.items, (item) => {
                return (<li className="col-sm-4" key={ item.id }>
                    <Link to={`/${locale}/categories/${item.id}`}>
                        <i className="ion-document-text paper-icon"></i>
                        <span className="title">{ item.name }</span>
                        <span className="btn btn-default">View</span>
                    </Link>
                </li>);
            });
        }
    }

    getAssignedUsers() {
        if(this.props.assignedUsers) {
            return _.map(this.props.assignedUsers, (user) => {
                return (
                    <p key={`item-${user.id}`}>{`${user.first_name} ${user.last_name}`}</p>
                );
            });
        }

    }

    render() {
        return (
            <div className="SubCategoryList" style={{ display: _.size(this.props.items) ? 'block' : 'none' }}>
                { this.getTitle() }
                <ul>
                    { this.getItems() }
                </ul>
                <div>
                    { this.getAssignedUsers() }
                </div>
            </div>
        );
    }
}

SubCategoriesList.propTypes = {
    items: React.PropTypes.array,
    assignedUsers: React.PropTypes.array,
};

export default SubCategoriesList;