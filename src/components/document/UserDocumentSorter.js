import React, { Component } from 'react';
import autoBind from 'react-autobind';
import strings from '../../services/strings';
import language from '../../services/language';
import _ from 'lodash';

import './UserDocumentSorter.scss';

class DocumentSorter extends Component {
    constructor(props) {
        super(props);
        autoBind(this);
    }

    getSorter() {
        if (this.props.sorter) {
            return this.props.sorter.column;
        }

        return '';
    }

    getDescending(){
        if (this.props.sorter) {
            return this.props.sorter.descending;
        }

        return '';
    }

    handleChangeSorter(e) {
        let sorter = {
            column: e.target.value,
            descending: this.props.sorter.descending,
        };
        this.props.setSorter(sorter);
        this.props.fetchItems(true);
    }
    handleChangeDescending(e){
        let sorter = {
            column: this.props.sorter.column,
            descending: e.target.value === 'true'
        };
        this.props.setSorter(sorter);
        this.props.fetchItems(true);
    }
    render() {
        return (
            <div className="DocumentSorter">
                {/*<label>{strings.get('Client.downloadsPage.sorter.title')}</label>
                <select className="form-control" name="sorter" value={ this.getSorter() } onChange={ this.handleChangeSorter }>
                    <option value="created_at">{strings.get('Client.downloadsPage.sorter.newest')}</option>
                    <option value="name">{strings.get('Client.downloadsPage.sorter.name')}</option>
                    <option value="price">{strings.get('Client.downloadsPage.sorter.price')}</option>
                </select>*/}
                <select className="form-control" name="sorter" value={ this.getDescending() } onChange={ this.handleChangeDescending }>
                    <option value={false}>{strings.get('Client.downloadsPage.sorter.asc')}</option>
                    <option value={true}>{strings.get('Client.downloadsPage.sorter.desc')}</option>
                </select>
            </div>
        );
    }
}

DocumentSorter.propTypes = {
    sorter: React.PropTypes.object,
    setSorter: React.PropTypes.func.isRequired,
    fetchItems: React.PropTypes.func.isRequired,
}

export default DocumentSorter;