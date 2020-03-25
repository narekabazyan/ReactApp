import React, { Component } from 'react';
import autoBind from 'react-autobind';
import { connect } from 'react-redux';
import strings from '../../services/strings';
import { Link,browserHistory } from 'react-router';
import auth from '../../services/auth';
import Breadcrumbs from '../../components/Breadcrumbs';
import * as categoriesSelectors from '../../store/categories/selectors';

import '../Page.scss';

import * as authActions from '../../store/auth/actions';
import * as userActions from '../../store/user/actions';
import * as userDocumentsSelectors from '../../store/userDocuments/selectors';
import * as userDocumentsActions from '../../store/userDocuments/actions';
import * as categoriesActions from '../../store/categories/actions';

import Topbar from '../../components/Topbar';
import Modal from 'boron/DropModal';
import NavigationTabs from '../../components/NavigationTabs';
import UserDocumentList from '../../components/document/UserDocumentList'
import UserDocumentSorter from '../../components/document/UserDocumentSorter'
import DocumentCategoryFilter from '../../components/document/DocumentCategoryFilter';
import Pagination from '../../components/Pagination';


class UserDocumentsPage extends Component {

    state = {
        user :null
    };
    constructor(props) {
        super(props);
        autoBind(this);
    }

    componentWillMount() {
        this.props.fetchDocuments();
        this.props.fetchAllCategories();
    }

    componentDidMount() {
        if(!auth.isAuthenticated()){
            browserHistory.push('/');
        }
        this.props.fetchUserDocuments(true);
        this.setState({user : auth.getLocalUser() ? auth.getLocalUser() : null});
    }
    handleShowModal() {
        _.delay(() => {
            this.hideSaveModal();
        }, 500);
    }
    showSaveModal() {
        this.refs.saveModal.show();
    }
    hideSaveModal() {
        this.refs.saveModal.hide();
    }
    render() {
        let locale = JSON.parse(localStorage.getItem('language')).iso2;
        return (
            <div className="UserDocumentsPage">
                <Modal className="boron-modal no-body" ref="saveModal" onShow={ this.handleShowModal }>
                    <span>
                        <h2>{strings.get('App.settings.settingsSaved')}</h2>
                    </span>
                </Modal>
                <Topbar
                    title={strings.get('Client.homePage.title')}
                    subtitle={strings.get('Client.homePage.subTitle')}
                    searchBox={ true }
                    handleLangChange={ this.props.handleLangChange }
                    currentLang={this.props.currentLang}
                    currentView="userProfilePage"
                />
                <div className="container">
                    <Breadcrumbs>
                        <Link to={`/${locale}/`}>{strings.get('Client.homePage.home')}</Link>
                        <Link to={`/${locale}/mydocuments`}>{strings.get('Client.downloadsPage.myDocuments')}</Link>
                    </Breadcrumbs>

                    <div className="container-row">
                        <DocumentCategoryFilter
                            filters={ this.props.filters }
                            categories={ this.props.categories }
                            fetchItems={ this.props.fetchDocuments }
                            setCategoryId={ this.props.setCategoryId }
                        />
                        <UserDocumentSorter
                            sorter={ this.props.sorter }
                            fetchItems={ this.props.fetchUserDocuments }
                            setSorter={ this.props.setSorter }
                        />
                        <NavigationTabs
                            currentItemId={1}
                            currentView="UserDocumentsPage"
                        />
                        <UserDocumentList
                            items={this.props.userDocuments}
                            currentItem={this.props.currentUserDocument}
                            sorter={this.props.sorter}
                            fetchItems={this.props.fetchUserDocuments}
                            setCurrentItemId={this.props.setCurrentUserDocumentId}
                            unsetCurrentItemId={this.props.unsetCurrentUserDocumentId}
                            deleteItem={this.props.deleteUserDocument}
                            toggleSorter={this.props.toggleSorter}
                        />
                        <div className="col-md-2 col-md-offset-5">
                            <Pagination
                                pagination={ this.props.pagination }
                                setCurrentPage={ this.props.setCurrentPage }
                                fetchItems={ this.props.fetchUserDocuments }
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}

function mapStateToProps(state) {
    return {
        categories: categoriesSelectors.getItems(state),
        userDocuments: userDocumentsSelectors.getItemsByPage(state, (userDocumentsSelectors.getPagination(state)).currentPage),
        sorter: userDocumentsSelectors.getSorter(state),
        filters: userDocumentsSelectors.getFilters(state),
        pagination: userDocumentsSelectors.getPagination(state),
        currentUserDocument: userDocumentsSelectors.getCurrentItem(state),
    }
}

function mapDispatchToProps(dispatch) {
    return {
        fetchAllCategories: () => {
            dispatch(categoriesActions.fetchAllItems())
        },
        getUser: () => {
            dispatch(authActions.getUser())
        },
        updateUser: (data) => {
            dispatch(userActions.updateUser(data))
        },
        uploadUserImage: (file) => {
            dispatch(userActions.uploadUserImage(file))
        },
        fetchUserDocuments: (deleteCache) => {
            dispatch(userDocumentsActions.fetchItems(deleteCache))
        },
        setSearchTerm: (searchTerm) => {
            dispatch(userDocumentsActions.setSearchTerm(searchTerm))
        },
        toggleSorter: (searchTerm) => {
            dispatch(userDocumentsActions.toggleSorter(searchTerm))
        },
        setSorter: (sorter) => {
            dispatch(userDocumentsActions.setSorter(sorter))
        },
        setCurrentPage: (page) => {
            dispatch(userDocumentsActions.setCurrentPage(page))
        },

        setCurrentUserDocumentId: (id) => {
            dispatch(userDocumentsActions.setCurrentItemId(id))
        },
        unsetCurrentUserDocumentId: () => {
            dispatch(userDocumentsActions.unsetCurrentItemId())
        },
        deleteUserDocument: (id) => {
            dispatch(userDocumentsActions.deleteItem(id))
        },
        setCategoryId: (id) => {
            dispatch(userDocumentsActions.setCategoryId(id))
        },
        fetchDocuments: (deleteCache) => {
            dispatch(userDocumentsActions.fetchItems(deleteCache))
        },

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserDocumentsPage);