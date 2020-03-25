import _ from 'lodash';

export function getItems(state) {
    return state.partners.itemsById;
}

export function getItemById(state, id) {
    return state.partners.itemsById['_' + id];
}

export function getCurrentItem(state) {
    return state.partners.currentItemId ? getItemById(state, state.partners.currentItemId) : null;
}

export function getPagination(state) {
    return state.partners.pagination;
}

export function getItemsByPage(state, page) {
    if (!state.partners.idsByPage['_' + page]) {
        page = (getPagination(state)).previousPage;
    }
    return _.map(state.partners.idsByPage['_' + page], (itemId) => {
        return state.partners.itemsById['_' + itemId]
    })
}

export function getTeam(state) {
    return state.partners.teamMembers;
}
