import React, { Component } from 'react';
import autoBind from 'react-autobind';
import strings from '../services/strings';

import './Switch.scss';

class Switch extends Component {

    state = {
        enabled: true
    }

    constructor(props) {
        super(props);
        autoBind(this);
    }

    componentWillMount() {
        this.setState({
            enabled: !!this.props.enabled
        });
    }

    handleChange(e) {
        this.setState({
            enabled: e.target.checked
        });
        this.props.onChange(e.target.checked);
    }

    render() {
        return (
            <label className="switch">
                <input type="checkbox" checked={ this.state.enabled } onChange={ this.handleChange } />
                <div className="slider round"></div>
            </label>
        );
    }

}

Switch.propTypes = {
    enabled: React.PropTypes.bool,
    onChange: React.PropTypes.func.isRequired,
}

export default Switch;