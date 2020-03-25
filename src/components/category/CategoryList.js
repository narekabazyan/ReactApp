import React, {Component} from 'react';
import autoBind from 'react-autobind';
import strings from '../../services/strings';
import {browserHistory, Link} from 'react-router';
import _ from 'lodash';
import './CategoryList.scss';

class CategoryList extends Component {

    constructor(props) {
        super(props);
        autoBind(this);
    }

    getImage(item) {
        if (item.imageURL) {
            return (<div className="categoryImage" style={{backgroundImage: `url(${item.imageURL})`}} />);
        }
    }

    getItems() {
        let locale = JSON.parse(localStorage.getItem('language')).iso2;
        if (this.props.items) {
            let count = 0;
            return _.map(this.props.items, (item) => {
                if (count > this.props.limit)
                    return;
                count++;
                return (!item.parent_id) ? (<li className="col-sm-4" key={ item.id }>
                    <Link to={`/${locale}/categories/${item.id}`}>
                        { this.getImage(item)}
                        <p>{ item.name }</p>
                    </Link>
                </li>) : (false)
            });
        }
    }

    render() {
        return (
            <div style={{paddingTop: "15px", display: "inline-block", textAlign: "center"}} className="CategoryList container">
                <ul style={{display: "inline-block", padding: "0 calc(6% - 15px)"}} className="row">
                    { this.getItems() }
                </ul>
            </div>
        );
    }
}

CategoryList.propTypes = {
    items: React.PropTypes.object
}

export default CategoryList;