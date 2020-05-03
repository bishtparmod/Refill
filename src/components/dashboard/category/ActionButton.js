import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

export default class ActionButton extends PureComponent {
    static propTypes = {

    }

    loading() {
        return `<div class="kt-spinner kt-spinner--sm kt-spinner--success"></div>`;
    }

    render() {
        return `
        <a href="#" class="btn btn-sm btn-clean btn-icon btn-icon-md" title="View">
          <i class="fa fa-lock"></i>
        </a>`
    }
}
