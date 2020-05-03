import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Loader  } from '.'

export default function asyncComponent(importComponent) {
    class AsyncFunc extends Component {
        constructor(props) {
            super(props);
            this.state = {
                component: null,
            };
        }

        componentWillUnmount() {
            this.mounted = false;
        }

        async componentDidMount() {
            this.mounted = true;
            const { default: Component } = await importComponent();
            if (this.mounted) {
                this.setState({
                    component: <Component {...this.props} />,
                });
            }
        }

        render() {
            const Component = this.state.component || <Loader />;
            return Component;
        }
    }
    return AsyncFunc;
}
