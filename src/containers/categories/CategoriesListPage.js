import React, { Component } from 'react';
import { connect } from 'react-redux';
import autoBind from 'react-autobind';
import strings from '../../services/strings';

import * as categoriesSelectors from '../../store/categories/selectors';
import * as categoriesActions from '../../store/categories/actions';

import Topbar from '../../components/Topbar';
import CategoryList from "../../../src/components/category/CategoryList";
import Footer from "../../components/footer/Footer";

class CategoriesListPage extends Component {

    constructor(props) {
        super(props);
        autoBind(this);
    }

    componentDidMount() {
        this.props.fetchAllCategories();
        this.props.fetchArticleCategories();
    }

    render() {
        return (
            <div className="CategoriesListPage">
                <Topbar
                    title={strings.get('Client.homePage.moreCategories')}
                    subtitle={strings.get('Client.homePage.subTitle')}
                    searchBox={ true }
                    handleLangChange={this.props.handleLangChange}
                    currentLang={this.props.currentLang}
                />
                <CategoryList
                    items={this.props.categories}
                />
                <Footer items={ this.props.articleCategories }/>
            </div>
        );
    }
}

function mapStateToProps (state) {
    return {
        categories: categoriesSelectors.getItems(state),
        articleCategories: categoriesSelectors.getArticleCategories(state),
    }
}

function mapDispatchToProps (dispatch) {
    return {
        fetchAllCategories: () => {
            dispatch(categoriesActions.fetchAllItems())
        },
        fetchArticleCategories: () => {
            dispatch(categoriesActions.fetchArticleCategories())
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CategoriesListPage);