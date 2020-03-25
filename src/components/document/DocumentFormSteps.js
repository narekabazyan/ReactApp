import React, { Component } from 'react';
import autoBind from 'react-autobind';
import strings from '../../services/strings';
import { browserHistory, Link } from 'react-router';
import _ from 'lodash';

class DocumentFormSteps extends Component {

    state = {
        steps: null,
    }

    constructor(props) {
        super(props);
        autoBind(this);
    }

    componentDidUpdate() {
        if (!this.state.steps && _.size(this.props.rules) && _.size(this.props.steps)) {
            let stepIds = this.getStepIds(this.props.rules);
            let steps = _.map(_.uniq(stepIds), stepId => this.props.steps[`_${stepId}`]);

            // sort steps by predefined order
            steps = _.sortBy(steps, (step) => step.order);

            this.props.onLoaded(steps);
            this.setState({ steps });
        }
    }

    getStepIds(rules, stepIds = []) {
        _.each(rules, rule => {
            if (rule.properties) {
                stepIds.push(rule.properties.stepId);
            } else {
                if (rule.children) {
                    this.getStepIds(rule.children, stepIds);
                }
            }
        });

        return stepIds;
    }

    handleStepClick(step) {
        if (step.id != this.props.currentStep.id) {
            this.props.onChange(step);
        }
    }

    getSteps() {
        if (this.state.steps && this.props.currentStep) {
            return _.map(this.state.steps, (step, key) => {
                let className = step.id == this.props.currentStep.id ? 'active' : '';
                return (
                    <li key={ step.id } className={ className } onClick={() => this.handleStepClick(step)}>
                        <span className="number">{ key + 1 }</span>
                        <span className="name">{ step.name }</span>
                    </li>
                );
            }); 
        }
    }

    render() {
        return (
            <div className="DocumentFormSteps" ref="wrapper">
                <ul>
                    { this.getSteps() }
                </ul>
            </div>
        );
    }
}

DocumentFormSteps.propTypes = {
    steps: React.PropTypes.object,
    rules: React.PropTypes.array,
    currentStep: React.PropTypes.object,
    onChange: React.PropTypes.func.isRequired,
    onLoaded: React.PropTypes.func.isRequired,
}

export default DocumentFormSteps;