import 'whatwg-fetch';
import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import { Provider } from 'react-redux';
import { Router, Route, Redirect, browserHistory } from 'react-router';
import thunk from 'redux-thunk';

import App from './App';
import LoginPage from './containers/auth/LoginPage';
import HomePage from './containers/home/HomePage';
import UserProfilePage from './containers/profile/UserProfilePage';
import RequiredOptionsPage from './containers/settings/requiredOptions/RequiredOptionsPage';
import UserDocumentsPage from './containers/documents/UserDocumentsPage';
import CategoriesListPage from './containers/categories/CategoriesListPage';
import DocumentListPage from './containers/documents/DocumentListPage';
import DocumentFormPage from './containers/documents/DocumentFormPage';
import ArticlePage from './containers/articles/ArticlePage';
import * as reducers from './store/reducers';

import cacheManager from './services/cacheManager';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
    combineReducers(reducers), 
    composeEnhancers(applyMiddleware(thunk))
);

cacheManager.setVersion("0.0.2");

ReactDOM.render(
    <Provider store={ store }>

        <Router history={ browserHistory }>
            <Route path='login' component={ LoginPage } />
            <Route component={ App }>

                <Route path='/' component={ HomePage } />
                <Route path='/:locale' component={ HomePage } />
                <Route path='/:locale/profile' component={ UserProfilePage } />
                <Route path='/:locale/mydocuments' component={ UserDocumentsPage } />
                <Route path='/:locale/settings' component={ RequiredOptionsPage } />
                <Route path='/:locale/categories' component={ CategoriesListPage } />
                <Route path='/:locale/categories/:catId' component={ DocumentListPage } />
                <Route path='/:locale/categories/:catId/documents/:docId' component={ DocumentFormPage } />
                <Route path='/:locale/articles/:articleId' component={ ArticlePage } />

            </Route>
            <Redirect from='*' to='/'></Redirect>
        </Router>

    </Provider>,
    document.getElementById('root')
);
