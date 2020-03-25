import React, { Component } from 'react';
import autoBind from 'react-autobind';
import { connect } from 'react-redux';
import strings from '../../services/strings';
import '../Page.scss';

import * as categoriesActions from '../../store/categories/actions';
import * as categoriesSelectors from '../../store/categories/selectors';
import * as articleActions from '../../store/articles/actions';
import * as articleSelectors from '../../store/articles/selectors';

import Topbar from '../../components/Topbar';
import Footer from '../../components/footer/Footer';

class ArticlePage extends Component {
    constructor(props) {
        super(props);
        autoBind(this);
    }

    componentWillMount() {
        this.props.fetchArticleCategories();
    }

    componentDidMount() {
        this.props.fetchItem(this.props.params.articleId);
    }

    getContent() {
        let content = this.props.article.content;

        let SCRIPT_REGEX = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
        while (SCRIPT_REGEX.test(content)) {
            content = content.replace(SCRIPT_REGEX, "");
        }
        $(".content").html(content);
    }

    render() {
        this.getContent()
        return (
            <div className="ArticlePage">
                <Topbar
                    title={strings.get('Client.homePage.title')}
                    subtitle={strings.get('Client.homePage.subTitle')}
                    searchBox={ true }
                    handleLangChange={this.props.handleLangChange}
                    currentLang={this.props.currentLang}
                />

                <div className="content">
                </div>
                <Footer items={ this.props.articleCategories } />
            </div>
        );
    }
}

function mapStateToProps (state) {
    return {
        article: articleSelectors.getItem(state),
        articleCategories: categoriesSelectors.getArticleCategories(state),
    }
}

function mapDispatchToProps (dispatch) {
    return {
        fetchItem: (id) => {
            dispatch(articleActions.fetchItem(id));
        },
        fetchArticleCategories: () => {
            dispatch(categoriesActions.fetchArticleCategories())
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ArticlePage);