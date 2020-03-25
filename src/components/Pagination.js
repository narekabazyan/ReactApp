import React, { Component } from 'react';
import autoBind from 'react-autobind';
import strings from '../services/strings';
import _ from 'lodash';

class Pagination extends Component {

    constructor(props) {
        super(props);
        autoBind(this);
    }

    getPages() {
        let pages = [];
        let totalPages = this.props.pagination.totalPages;
        let currentPage = this.props.pagination.currentPage;

        if (totalPages <= 1) {
            return pages;
        }
        if (currentPage > 1) {
            pages.push("<");
        }
        pages.push(1);
        if (currentPage > 2) {
            pages.push("...");
            if (currentPage === totalPages && totalPages > 3) {
                pages.push(currentPage - 2);
            }
            pages.push(currentPage - 1);
        }
        if (currentPage !=1 && currentPage != totalPages) {
            pages.push(currentPage);
        }
        if (currentPage < totalPages - 1) {
            pages.push(currentPage + 1);
            if (currentPage == 1 && totalPages > 3) {
                pages.push(currentPage + 2);
            }
            pages.push("...");
        }
        if (totalPages >= currentPage) {
            pages.push(totalPages);
        }
        if(currentPage < totalPages) {
            pages.push(">");
        }

        return pages;
    }

    handleLinkClick(page) {
        this.props.setCurrentPage(page);
        this.props.fetchItems();
    }

    render() {
        let pages = this.getPages();
        let links = _.map(pages, (page, i) => {
            if (page == '<') {
                return (
                    <li key={i}><a href="#" onClick={() => this.handleLinkClick(this.props.pagination.currentPage - 1)}>&laquo;</a></li>
                )
            }
            else if (page == '>') {
                return (
                    <li key={i}><a href="#" onClick={() => this.handleLinkClick(this.props.pagination.currentPage + 1)}>&raquo;</a></li>
                )
            }
            else if (page == '...') {
                return (
                    <li key={i}><a href="#">...</a></li>
                )
            }
            else {
                if (page == this.props.pagination.currentPage) {
                    return (
                        <li key={i} className="active"><a href="#">{ page }</a></li>
                    )
                } else {
                    return (
                        <li key={i}><a href="#" onClick={() => this.handleLinkClick(page)}>{ page }</a></li>
                    )
                }
            }
        })

        return (
            <div className="pagination-wrapper">
                <ul className="pagination">
                    { links }
                </ul>
            </div>
        );
    }

}

Pagination.propTypes = {
    pagination: React.PropTypes.object.isRequired,
    setCurrentPage: React.PropTypes.func.isRequired,
    fetchItems: React.PropTypes.func.isRequired,
}

export default Pagination;