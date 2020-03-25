import React, { Component } from 'react';
import autoBind from 'react-autobind';
import strings from '../../services/strings';
import { Link,browserHistory } from 'react-router';
import auth from '../../services/auth';
import config from '../../config'
import _ from 'lodash';

import './UserDocumentList.scss';

import * as authActions from '../../store/auth/actions';
import * as userActions from '../../store/user/actions';

import Topbar from '../../components/Topbar';
import Modal from 'boron/DropModal';

const API_ENDPOINT = config.API_ENDPOINT;


class UserDocumentList extends Component {

    state = {
        user: null
    };

    constructor(props) {
        super(props);
        autoBind(this);
    }

    componentDidMount() {
        if(!auth.isAuthenticated()) {
            browserHistory.push('/');
        }
        this.setState({
            user : auth.getLocalUser() ? auth.getLocalUser() : null
        });
    }

    showDeleteModal() {
        this.refs.deleteModal.show();
    }

    hideDeleteModal() {
        this.refs.deleteModal.hide();
    }

    handleDeleteClick(id) {
        this.props.setCurrentItemId(id);
        this.showDeleteModal();
    }
    handleConfirmDeleteClick() {
        this.props.deleteItem(this.props.currentItem.id);
        _.delay(() => this.props.unsetCurrentItemId(), 250);
        this.hideDeleteModal();
    }
    handleCancelDeleteClick() {
        _.delay(() => this.props.unsetCurrentItemId(), 250);
        this.hideDeleteModal();
    }
    getDocuments(){
        if (this.props.items) {
            return _.map(this.props.items, (item) => {
               return (
                   <tr key={ item.id }>
                       <td>{ item.downloadDate }</td>
                       <td><i className="ion-document-text document-icon"></i></td>
                       <td>
                           <div className="description">
                               {item.category_name }
                           </div>
                       </td>
                       <td>
                           <div className="details">
                               <div className="name">
                                   <a href={ item.downloadURL } target="_blank">
                                        { item.document.name }
                                   </a>
                               </div>
                           </div>
                       </td>
                   </tr>
               );
            });
        }
    }
    render() {
        let deleteModalContent = this.props.currentItem ? (
            <span>
                <h2>{ strings.get('App.deleteModal.message', { itemName: this.props.currentItem.name}) }</h2>
                <div className="form-actions">
                    <button className="btn btn-lg btn-danger" onClick={ this.handleConfirmDeleteClick }>{ strings.get('App.deleteModal.delete') }</button>
                    <button className="btn btn-lg btn-default" onClick={ this.handleCancelDeleteClick }>{ strings.get('App.deleteModal.cancel') }</button>
                </div>
            </span>
        ) : null;
        return (
            <div className="UserDocumentList">
                <span className="DocumentList">
                    <Modal className="boron-modal" ref="deleteModal">
                        { deleteModalContent }
                    </Modal>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>{strings.get('Client.downloadsPage.downloadDate')}</th>
                                <th>{strings.get('Client.downloadsPage.type')}</th>
                                <th>{strings.get('Client.downloadsPage.category')}</th>
                                <th>{strings.get('Client.downloadsPage.documentName')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            { this.getDocuments() }
                        </tbody>
                    </table>
                </span>
            </div>
        );
    }

}
UserDocumentList.propTypes = {
    items: React.PropTypes.array.isRequired,
    sorter: React.PropTypes.object.isRequired,
    fetchItems: React.PropTypes.func.isRequired,
    setCurrentItemId: React.PropTypes.func.isRequired,
    unsetCurrentItemId: React.PropTypes.func.isRequired,
    deleteItem: React.PropTypes.func.isRequired,
    toggleSorter: React.PropTypes.func.isRequired,
};

export default UserDocumentList;