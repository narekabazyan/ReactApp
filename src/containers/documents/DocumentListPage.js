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

import Topbar from '../../components/Topbar';
import Breadcrumbs from '../../components/Breadcrumbs';
import DocumentList from '../../components/document/DocumentList';
import SubCategoriesList from '../../components/category/SubCategoriesList';
import Footer from "../../components/footer/Footer";

class DocumentListPage extends Component {

    constructor(props) {
        super(props);
        autoBind(this);
    }

    componentDidMount() {
        this.props.fetchAllCategories();
        this.props.fetchAllSteps();
        this.props.fetchDocuments();
        this.props.setCurrentCategoryId(this.props.params.catId);
    }

    componentWillReceiveProps(newProps) {
      if (newProps.params.catId !== this.props.params.catId) {
        this.props.fetchAllCategories();
        this.props.fetchAllSteps();
        this.props.fetchDocuments();
        this.props.setCurrentCategoryId(newProps.params.catId);
      }
    }

    componentWillUnmount() {
        this.props.unsetCurrentCategoryId();
    }

    getCategoryLink() {
        let category = this.props.currentCategory;
        if (category) {
            return <Link to={`/categories/${category.id}`}>{ category.name }</Link>;
        }
    }

    handleMouseOver(id) {
        this.props.fetchDocument(id);
    }

    render() {
        let locale = JSON.parse(localStorage.getItem('language')).iso2;
        return (
            <div className="DocumentListPage">
                <Topbar
                    title={strings.get('Client.homePage.title')}
                    subtitle={ this.props.currentCategory ? this.props.currentCategory.name : null }
                    description={ this.props.currentCategory ? this.props.currentCategory.description : null }
                    readMoreLink={ this.props.currentCategory ? this.props.currentCategory.read_more_link : null }
                    handleLangChange={ this.props.handleLangChange }
                    currentLang={ this.props.currentLang }
                    divider={ true }
                />

                <Breadcrumbs>
                    <Link to={`/${locale}/`}>{strings.get('Client.homePage.home')}</Link>
                    { this.getCategoryLink() }
                </Breadcrumbs>

                <div className="content container-row">
                    <SubCategoriesList
                      items={this.props.subCategories}
                      assignedUsers={this.props.currentCategory ? this.props.currentCategory.selectedUsers : null}
                    />
                    <DocumentList
                        items={ this.props.documents }
                        onMouseOver={ this.handleMouseOver }
                    />
                </div>
                <Footer />
            </div>
        );
    }

}

function mapStateToProps(state) {
    let currentCategory = categoriesSelectors.getCurrentItem(state);
    return {
        documents: documentsSelectors.getItemsByCategory(state, currentCategory ? currentCategory.id : null),
        subCategories : currentCategory ? currentCategory.children : null,
        currentCategory: currentCategory,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        fetchDocument: (id) => {
            dispatch(documentsActions.fetchItem(id))
        },
        fetchDocuments: () => {
            dispatch(documentsActions.fetchItems())
        },
        fetchAllCategories: () => {
            dispatch(categoriesActions.fetchAllItems())
        },
        fetchAllSteps: () => {
            dispatch(stepsActions.fetchAllItems())
        },
        setCurrentCategoryId: (id) => {
            dispatch(categoriesActions.setCurrentItemId(id))
        },
        unsetCurrentCategoryId: () => {
            dispatch(categoriesActions.unsetCurrentItemId())
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DocumentListPage);