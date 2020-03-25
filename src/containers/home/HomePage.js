import React, { Component } from 'react';
import autoBind from 'react-autobind';
import { connect } from 'react-redux';
import strings from '../../services/strings';
import language from '../../services/language';
import { Link, browserHistory } from 'react-router';
import _ from 'lodash';
import '../Page.scss';

import * as categoriesActions from '../../store/categories/actions';
import * as categoriesSelectors from '../../store/categories/selectors';
import * as documentsActions from '../../store/documents/actions';
import * as documentsSelectors from '../../store/documents/selectors';
import * as partnersActions from '../../store/partners/actions';
import * as partnersSelectors from '../../store/partners/selectors';
import * as stepsActions from '../../store/steps/actions';
import * as stepsSelectors from '../../store/steps/selectors';

import Topbar from '../../components/Topbar';
import CategoryList from '../../components/category/CategoryList';
import NewsList from '../../components/news/NewsList';
import PartnerList from "../../components/partners/PartnerList";
import TeamList from "../../components/team/TeamList";
import Counter from "../../components/counter/Counter";
import Footer from "../../components/footer/Footer";

import scrollToComponent from 'react-scroll-to-component';

class HomePage extends Component {

    constructor(props) {
        super(props);
        autoBind(this);
    }

    componentDidMount() {
        let locale = this.props.params.locale ? this.props.params.locale.toUpperCase() : null;
        if(!locale){
            browserHistory.push(window.location.href+"nl");
        }
        let languages = JSON.parse(localStorage.getItem('languages'));
        let lang = {id: 2, iso2: "NL"};
        for(let i = 0;i < languages.length;i++){
            if(locale === languages[i].iso2){
                lang = languages[i];
                break;
            }else{
                let loc = window.location.href.split("/");
                loc[loc.length-1] = 'nl';
                let newLoc = loc.join("/");
                browserHistory.push(newLoc);
            }
        };
        language.set(lang);
        strings.setLanguage(lang).then(() => {
            this.props.handleLangChange();
        });

        this.props.fetchAllCategories();
        this.props.fetchStats();
        this.props.fetchArticleCategories();
        this.props.fetchAllSteps();
        this.props.fetchAllPartners();
        this.props.fetchTeamMembers();

        let obj = _.extend({}, this.state);
        obj.language = {id:lang.id,iso2:lang.iso2};
        this.setState(obj);
        if(window.location.hash) {
            let hash = window.location.hash.replace("#", "");
            if(hash === "newsContainer")
                this.handleNewsClick();
        }
    }

    handleNewsClick() {
        scrollToComponent(this.refs.newsContainer, {duration: 1500});
    }

    render() {
        let locale = JSON.parse(localStorage.getItem('language')).iso2;
        /*let teamMembers = [
            {first_name: "Muhamed", last_name:"Ali", imageURL: "", position: "Professional Boxer", description: "Neque porro quisquam dolorem utn ipsum quia dolormet consectet dsu adipisci velit, sed ut quia.", visible: false},
            {first_name: "Jonathan", last_name:"Smith", imageURL: "", position: "Business & Marketing Expert", description: "Neque porro quisquam dolorem utn ipsum quia dolormet consectet dsu adipisci velit, sed ut quia.", visible: false},
            {first_name: "Jannatul", last_name:"Ferdous", imageURL: "", position: "Business & Marketing Expert", description: "Neque porro quisquam dolorem utn ipsum quia dolormet consectet dsu adipisci velit, sed ut quia.", visible: true},
            {first_name: "Rashed", last_name:"Kabir", imageURL: "", position: "Business & Marketing Expert", description: "Neque porro quisquam dolorem utn ipsum quia dolormet consectet dsu adipisci velit, sed ut quia.", visible: true},
            {first_name: "Jonathan", last_name:"Smith", imageURL: "", position: "Business & Marketing Expert", description: "Neque porro quisquam dolorem utn ipsum quia dolormet consectet dsu adipisci velit, sed ut quia.", visible: true},
            {first_name: "Rashed", last_name:"Kabir", imageURL: "", position: "Business & Marketing Expert", description: "Neque porro quisquam dolorem utn ipsum quia dolormet consectet dsu adipisci velit, sed ut quia.", visible: true},
            {first_name: "Muhibbur", last_name:"Rashid", imageURL: "", position: "Business & Marketing Expert", description: "Neque porro quisquam dolorem utn ipsum quia dolormet consectet dsu adipisci velit, sed ut quia.", visible: false},
            {first_name: "Muhamed", last_name:"Ali", imageURL: "", position: "Professional Boxer", description: "Neque porro quisquam dolorem utn ipsum quia dolormet consectet dsu adipisci velit, sed ut quia.", visible: false}
        ];*/

        let stats = [
            {title:"category", count: this.props.stats ? this.props.stats.category : null},
            {title:"document", count: this.props.stats ? this.props.stats.document : null},
            {title:"download", count: this.props.stats ? this.props.stats.download : null},
            {title:"user", count: this.props.stats ? this.props.stats.user : null}
        ];

        return (
            <div className="HomePage">
                <Topbar
                    title={strings.get('Client.homePage.title')}
                    subtitle={strings.get('Client.homePage.subTitle')}
                    searchBox={ true }
                    handleLangChange={this.props.handleLangChange}
                    currentLang={this.props.currentLang}
                    handleNewsClick={this.handleNewsClick}
                />

                <div className="content">
                    <h2>{ strings.get('Client.homePage.popularCategories')}</h2>
                    <div className="container-row">
                        <CategoryList
                            items={ this.props.categories }
                            limit={5}
                        />
                    </div>
                    <Link className="btn moreCategories" to={`/${locale}/categories`}>{ strings.get('Client.homePage.moreCategories') }</Link>
                    <NewsList
                        items={[{ content: "Lorem" }, { content: "Lorem" }]}
                        ref="newsContainer"
                    />
                    <PartnerList
                        items={ this.props.partners }
                    />
                    <TeamList
                        items={this.props.teamMembers}
                    />
                    <Counter
                        items={ stats }
                    />
                </div>
                <Footer items={ this.props.articleCategories } />
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        categories: categoriesSelectors.getItems(state),
        stats: documentsSelectors.getStats(state),
        partners: partnersSelectors.getItems(state),
        teamMembers: partnersSelectors.getTeam(state),
        articleCategories: categoriesSelectors.getArticleCategories(state),
    }
}

function mapDispatchToProps(dispatch) {
    return {
        fetchAllCategories: () => {
            dispatch(categoriesActions.fetchAllItems())
        },
        fetchAllSteps: () => {
            dispatch(stepsActions.fetchAllItems())
        },
        fetchStats: () => {
            dispatch(documentsActions.fetchStats())
        },
        fetchAllPartners: () => {
            dispatch(partnersActions.fetchAllItems());
        },
        fetchTeamMembers: () => {
            dispatch(partnersActions.fetchTeam());
        },
        fetchArticleCategories: () => {
            dispatch(categoriesActions.fetchArticleCategories())
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);