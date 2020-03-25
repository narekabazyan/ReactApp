import React, { Component } from 'react';
import autoBind from 'react-autobind';
import { connect } from 'react-redux';
import strings from '../services/strings';
import language from '../services/language';
import { Link } from 'react-router';
import _ from 'lodash';

import './SearchBox.scss';

import * as documentsActions from '../store/documents/actions';
import * as documentsSelectors from '../store/documents/selectors';

class SearchBox extends Component {

    state = {
        searchTerm: '',
    }

    fetched = [];

    constructor(props) {
        super(props);
        autoBind(this);
    }

    componentDidMount() {
        this.props.fetchAllDocuments();
        this.props.getPlaceholder();
        window.addEventListener('click', this.handleWindowClick);
        // this.props.getDenyMessage();
    }

    componentWillUpdate(prevProps) {
        if(prevProps.currentLang !== this.props.currentLang)
            this.props.getPlaceholder();
    }

    componentWillUnmount() {
        window.removeEventListener('click', this.handleWindowClick);
    }

    getResult() {
        let locale = JSON.parse(localStorage.getItem('language')).iso2;
        let items = _.filter(this.props.documents, item => {
            return !!item.name.toLocaleLowerCase().match(this.state.searchTerm.toLocaleLowerCase());
        });

        items = _.map(items, item => (
            <li key={ _.uniqueId() }>
                <Link to={`${locale}/categories/${item.category_id}/documents/${item.id}`} onMouseOver={() => this.handleMouseOver(item.id) }>{ item.name }</Link>
            </li>
        ));
        items = _.slice(items, 0, 5);

        if (this.state.searchTerm && _.size(items)) {
            return <div className="list-wrapper"><ul>{ items }</ul></div>;
        }
    }

    handleMouseOver(id) {
        if (!_.find(this.fetched, item => item == id)) {
            this.props.fetchDocument(id);
            this.fetched.push(id);
        }
    }

    handleSubmit(e) {
        e.preventDefault();
    }

    handleChange(e) {
        let searchTerm = e.target.value;
        this.setState({ searchTerm });
    }

    handleWindowClick() {
        this.setState({ searchTerm: '' });
    }

    render() {
        let className = "SearchBox "+this.props.className;
        return (
            <div className={ className }>
                <form onSubmit={ this.handleSubmit }>
                    <input type="text" placeholder={ this.props.placeholder } value={ this.state.searchTerm } onChange={ this.handleChange } />
                    <i className="ion-search"></i>
                </form>
                { this.getResult() }
            </div>
        );
    }

}

function mapStateToProps(state) {
    return {
        documents: documentsSelectors.getItems(state),
        placeholder: documentsSelectors.getSearchPlaceholder(state),
        denyMessage: documentsSelectors.getDenyMessage(state),
    }
}

function mapDispatchToProps(dispatch) {
    return {
        fetchDocument: (id) => {
            dispatch(documentsActions.fetchItem(id))
        },
        fetchAllDocuments: () => {
            dispatch(documentsActions.fetchAllItems())
        },
        getPlaceholder: () => {
            dispatch(documentsActions.getPlaceholder())
        },
        getDenyMessage: () => {
            dispatch(documentsActions.getDenyMessage())
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchBox);