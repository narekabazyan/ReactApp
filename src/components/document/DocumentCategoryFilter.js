import React, { Component } from 'react';
import autoBind from 'react-autobind';
import strings from '../../services/strings';
import language from '../../services/language';
import _ from 'lodash';

import './DocumentCategoryFilter.scss';

class DocumentCategoryFilter extends Component {

    constructor(props) {
        super(props);
        autoBind(this);
    }

    getCategories() {
        if (this.props.categories) {
            return _.map(this.props.categories, category => {
                return <option value={ category.id } key={ category.id }>{ category.name }</option>;
            });
        }
    }

    getSelectedCategory() {
        if (this.props.filters) {
            return this.props.filters.categoryId;
        }

        return '';
    }

    handleChange(e) {
        this.props.setCategoryId(e.target.value);
        this.props.fetchItems(true);
    }

    render() {
        return (
            <div className="DocumentCategoryFilter">
                <label>{strings.get('Client.downloadsPage.from')}</label>
                <select className="form-control" name="groups" value={ this.getSelectedCategory() } onChange={ this.handleChange }>
                    <option value="">{strings.get('Client.downloadsPage.allCategories')}</option>
                    { this.getCategories() }
                </select>
            </div>
        );
    }

}

DocumentCategoryFilter.propTypes = {
    filters: React.PropTypes.object,
    categories: React.PropTypes.object,
    setCategoryId: React.PropTypes.func.isRequired,
    fetchItems: React.PropTypes.func.isRequired,
}

export default DocumentCategoryFilter;