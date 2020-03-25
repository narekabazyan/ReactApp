import React, { Component } from 'react';
import autoBind from 'react-autobind';
import { connect } from 'react-redux';
import strings from '../services/strings';
import language from '../services/language';
import { Link, browserHistory } from 'react-router';

import * as categoriesActions from '../store/categories/actions';
import * as documentsActions from '../store/documents/actions';
import * as glossariesActions from '../store/glossaries/actions';
import * as genderStringsActions from '../store/genderStrings/actions';
import * as stepsActions from '../store/steps/actions';

import * as languagesActions from '../store/languages/actions';
import * as languagesSelectors from '../store/languages/selectors';
import _ from 'lodash';

import ReactFlagsSelect from 'react-flags-select';
import 'react-flags-select/scss/react-flags-select.scss';
import './LanguageSelector.scss';

class LanguageSelector extends Component {

    state = {
        language: {id: language.get(),iso2: language.getIso2()},
        languagesLoaded : false,
        langs : {},
    }

    constructor(props) {
        super(props);
        autoBind(this);
    }

    componentWillMount() {
        try{
            let langs = JSON.parse(localStorage.getItem('languages'));
            let languages = [];
            _.map(langs,function(item,key){
                languages[key] = item.iso2;
            });
            this.setState({ langs : languages });
        }catch(e){}
        this.props.fetchAllLanguages();
    }

    componentDidUpdate() {
        this.tryLoadCurrentItem();
    }

    handleChange(e) {
        let lang = this.state.languages[e];
        let loc = window.location.href;
        let position = (loc.search(language.getIso2()) !== -1) ? loc.search(language.getIso2()) : loc.search(language.getIso2().toLowerCase());
        let output = loc.substr(0,position) + e + loc.substr(position+e.length);
        language.set({id:lang.id,iso2:lang.iso2});
        strings.setLanguage(e).then(() => {
            this.props.handleLangChange();
        });

        this.props.fetchCategories(true);
        this.props.fetchDocuments(true);
        this.props.fetchArticleCategories();
        this.props.fetchGenderStrings(true);
        this.props.fetchSteps(true);

        let obj = _.extend({}, this.state);
        obj.language = {id:lang.id,iso2:lang.iso2};
        this.setState(obj);
        browserHistory.push(output);
    }

    componentWillReceiveProps(nextProps) {
        // console.log(nextProps.currentLang);
        let lang = nextProps.currentLang ? nextProps.currentLang : null;
        if(lang){
            language.set(lang);
            strings.setLanguage(lang).then(() => {
                this.props.handleLangChange();
            });
        }
    }

    tryLoadCurrentItem() {
        if(!this.state.languagesLoaded && _.size(this.props.languages)) {
            let languages = {};
            _.map(this.props.languages, (item) => {
                languages[item.iso2] = item;
            });
            this.setState({languages: languages, languagesLoaded: true}, ()=>{
                strings.setLanguage({id: language.get(), iso2: language.getIso2()}).then(() => {
                    this.props.handleLangChange();
                });
            });
        }
    }

    render() {
        let obj = {};
        _.map(this.state.languages, (lang) => {
            obj[lang.iso2] = strings.get(`Languages.${lang.iso2}`);
        });
        let defaultLang = this.state.language ? this.state.language.iso2 : null;
        return (
            <span className="LanguageSelector">
                <div className="form-group">
                    <ReactFlagsSelect
                        className="flagSelect"
                        countries={ this.state.langs }
                        defaultCountry={defaultLang}
                        customLabels={ obj }
                        onSelect={this.handleChange}
                    />
                </div>
            </span>
        );
    }

}

function mapStateToProps(state) {
    return {
        languages: languagesSelectors.getItems(state),
    }
}

function mapDispatchToProps(dispatch) {
    return {
        fetchAllLanguages: () => {
            dispatch(languagesActions.fetchAllItems())
        },
        fetchCategories: (deleteCache) => {
            dispatch(categoriesActions.fetchItems(deleteCache))
        },
        fetchDocuments: (deleteCache) => {
            dispatch(documentsActions.fetchItems(deleteCache))
        },
        fetchGlossaries: (deleteCache) => {
            dispatch(glossariesActions.fetchItems(deleteCache))
        },
        fetchGenderStrings: (deleteCache) => {
            dispatch(genderStringsActions.fetchItems(deleteCache))
        },
        fetchSteps: (deleteCache) => {
            dispatch(stepsActions.fetchAllItems())
        },
        fetchArticleCategories: () => {
            dispatch(categoriesActions.fetchArticleCategories())
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LanguageSelector);