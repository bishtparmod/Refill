import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

export default class ConfirmAlert extends PureComponent {
    static propTypes = {
        _id: PropTypes.string,
        label: PropTypes.string,
        description: PropTypes.string,
        onConfirm: PropTypes.func,
        loading: PropTypes.bool,
        confirm_btn: PropTypes.string,
        close_btn: PropTypes.string
    }

    static defaultProps = {
        confirm_btn: "Confirm",
        close_btn: "Close"
    }

    render() {
        const { _id, label, description, loading, onConfirm, confirm_btn, close_btn } = this.props;
        return (
            <div className="modal modal-stick-to-bottom fade" id={_id} tabIndex={-1} role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLongTitle">{label}</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            </button>
                        </div>
                        <div className="modal-body">
                            <p>{description}</p>
                        </div>
                        <div className="modal-footer">
                            <button type="button" id={`close_${_id}`} className="btn btn-secondary" data-dismiss="modal">{close_btn}</button>
                            <button type="button" id={`confirm_${_id}`} className="btn btn-primary" onClick={onConfirm}>{loading ? "Loading..." : confirm_btn}</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
