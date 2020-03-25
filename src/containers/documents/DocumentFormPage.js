import React, { Component } from 'react';
import autoBind from 'react-autobind';
import { connect } from 'react-redux';
import strings from '../../services/strings';
import { Link } from 'react-router';
import '../Page.scss';

import * as documentsActions from '../../store/documents/actions';
import * as documentsSelectors from '../../store/documents/selectors';
import * as categoriesActions from '../../store/categories/actions';
import * as categoriesSelectors from '../../store/categories/selectors';
import * as stepsActions from '../../store/steps/actions';
import * as stepsSelectors from '../../store/steps/selectors';
import * as authActions from '../../store/auth/actions';
import * as authSelectors from '../../store/auth/selectors';

import Topbar from '../../components/Topbar';
import Breadcrumbs from '../../components/Breadcrumbs';
import DocumentForm from '../../components/document/DocumentForm';

class DocumentFormPage extends Component {

    constructor(props) {
        super(props);
        autoBind(this);
    }

    componentDidMount() {
        this.props.fetchDocument(this.props.params.docId);
        this.props.fetchAllCategories();
        this.props.fetchAllSteps();
        this.props.setCurrentCategoryId(this.props.params.catId);
        this.props.setCurrentDocumentId(this.props.params.docId);
        this.props.fetchLoggedInUser();
        this.props.getDenyMessage();
    }

    componentWillUnmount() {
        this.props.unsetCurrentCategoryId();
    }

    getCategoryLink() {
        let locale = JSON.parse(localStorage.getItem('language')).iso2;
        let category = this.props.currentCategory;
        if (category) {
            return <Link to={`/${locale}/categories/${category.id}`}>{ category.name }</Link>;
        }
    }

    getDocumentLink() {
        let locale = JSON.parse(localStorage.getItem('language')).iso2;
        let doc = this.props.currentDocument;
        let category = this.props.currentCategory;
        if (doc && category) {
            return <Link to={`/${locale}/categories/${category.id}/documents/${doc.id}`}>{ doc.name }</Link>;
        }
    }

    render() {
        let locale = JSON.parse(localStorage.getItem('language')).iso2;
        return (
            <div className="DocumentFormPage">
                <Topbar
                    title={ this.props.currentDocument ? this.props.currentDocument.name : null }
                    subtitle={ this.props.currentCategory ? this.props.currentCategory.name : null }
                    description={this.props.currentDocument ? this.props.currentDocument.description : null}
                    readMoreLink={this.props.currentDocument ? this.props.currentDocument.read_more_link : null}
                    handleLangChange={ this.props.handleLangChange }
                    currentLang={ this.props.currentLang }
                    divider={ true }
                />

                <Breadcrumbs>
                    <Link to={`/${locale}/`}>{strings.get('Client.homePage.home')}</Link>
                    { this.getCategoryLink() }
                    { this.getDocumentLink() }
                </Breadcrumbs>
                
                <div className="content">
                    <DocumentForm
                        steps={ this.props.steps }
                        currentItem={ this.props.currentDocument }
                        downloadItem={(data) => this.props.downloadDocument(this.props.params.docId, data)}
                        profile={ this.props.profile }
                        denyMessage={ this.props.denyMessage }
                    />
                </div>
            </div>
        );
    }

}

function mapStateToProps(state) {
    return {
        steps: stepsSelectors.getItems(state),
        currentCategory: categoriesSelectors.getCurrentItem(state),
        currentDocument: documentsSelectors.getCurrentItem(state),
        profile: authSelectors.getProfile(state),
        denyMessage: documentsSelectors.getDenyMessage(state),
    }
}

function mapDispatchToProps(dispatch) {
    return {
        fetchDocument: (id) => {
            dispatch(documentsActions.fetchItem(id))
        },
        fetchAllCategories: () => {
            dispatch(categoriesActions.fetchAllItems())
        },
        fetchAllSteps: () => {
            dispatch(stepsActions.fetchAllItems())
        },
        downloadDocument: (id, data) => {
            return dispatch(documentsActions.downloadItem(id, data))
        },
        setCurrentDocumentId: (id) => {
            dispatch(documentsActions.setCurrentItemId(id))
        },
        unsetCurrentDocumentId: () => {
            dispatch(documentsActions.unsetCurrentItemId())
        },
        setCurrentCategoryId: (id) => {
            dispatch(categoriesActions.setCurrentItemId(id))
        },
        unsetCurrentCategoryId: () => {
            dispatch(categoriesActions.unsetCurrentItemId())
        },
        fetchLoggedInUser: () => {
          dispatch(authActions.getUser())
        },
        getDenyMessage: () => {
            dispatch(documentsActions.getDenyMessage())
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DocumentFormPage);