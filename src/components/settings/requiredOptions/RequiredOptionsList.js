import React, { Component } from 'react';
import autoBind from 'react-autobind';
import strings from '../../../services/strings';
import { browserHistory } from 'react-router';
import _ from 'lodash';
import './RequiredOptionsList.scss';

import Switch from '../../Switch.js';

class RequiredOptionsList extends Component {

    constructor(props) {
        super(props);
        autoBind(this);
    }

    handleChange(enabled) {
        this.props.updateItem({
            required_fields: (enabled ? 1 : 0)
        });
    }

    render() {
        let items = _.map(this.props.items, (value) => {
            return (
                <tr key={ value.id }>
                    <td>{strings.get('Client.settings.requiredOptions')}</td>
                    <td>
                        <Switch
                            enabled={ !!value.required_fields}
                            onChange={ (enabled) => this.handleChange(enabled) }
                        />
                    </td>
                </tr>
            );
        });

        return (
            <span className="RequiredOptionsList">
                <table className="table">
                    <tbody>
                        { items }
                    </tbody>
                </table>
            </span>
        );
    }
}

RequiredOptionsList.propTypes = {
    items: React.PropTypes.object.isRequired,
    updateItem: React.PropTypes.func.isRequired,
    setCurrentItemId: React.PropTypes.func.isRequired,
    unsetCurrentItemId: React.PropTypes.func.isRequired,
}

export default RequiredOptionsList;