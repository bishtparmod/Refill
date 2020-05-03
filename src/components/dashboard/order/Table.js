import React, { PureComponent,Fragment } from 'react'
import PropTypes from 'prop-types'
import Utils from '../../util/Utils';
import { getCategoriesDataTables, getAuthoriztionToken } from '../../../apis/APIs';
import moment from 'moment';

class Table extends PureComponent {

    static propTypes = {
        table_id: PropTypes.string,
        type: PropTypes.string
    }



    Active = () => <tr>
        <th> ID</th>
        <th>Name</th>
        <th>Product Name</th>
        <th>Created Date</th>
        <th>Price</th>
        <th>Order Type</th>
        <th>Shipping Address</th>
        <th>Billing Address</th>
        <th>Status</th>
        <th>Actions</th>
    </tr>

    OrderbyId = () => <tr>
        <th> ID</th>
        <th>Name</th>
        <th>Created Date</th>
        <th>Actions</th>
    </tr>

    OrderbyUser = () => <tr>
        <th> ID</th>
        <th>Name</th>
        <th>Created Date</th>
        <th>Actions</th>
    </tr>

    Past = () => <tr>
        <th> ID</th>
        <th>Name</th>
        <th>Product Name</th>
        <th>Created Date</th>
        <th> Price</th>
        <th>Order Type</th>
        <th>Shipping Address</th>
        <th>Billing Address</th>
        <th>Status</th>
        <th>Action</th>
    </tr>

    Refill = () => <tr>
        <th> ID</th>
        <th>Name</th>
        <th>Product Name</th>
        <th>Created Date</th>
        <th>Next Refill Date</th>
        <th> Price</th>
        <th>Order Type</th>
        <th>Shipping Address</th>
        <th>Billing Address</th>
        <th>Status</th>
        <th>Actions</th>
    </tr>

    Pending = () => <tr>
        <th> ID</th>
        <th>Name</th>
        <th>Product Name</th>
        <th>Created Date</th>
        <th> Price</th>
        <th>Order Type</th>
        <th>Shipping Address</th>
        <th>Billing Address</th>
        <th>Status</th>
        <th>Actions</th>
    </tr>

    _handle_table_row = () => {
        const { type } = this.props;

        switch (type) {
            case 'active':
                return this.Active();
            case 'past':
                return this.Past();
            case 'refill':
                return this.Refill();
            case 'pending':
                return this.Pending();
            case 'orderid':
                return this.OrderbyId();
            case 'orderUser':
                return this.OrderbyUser();
        }
    }
    render() {
        const { table_id, type, exportLoading, exportCSVFileData } = this.props
        return (
            <div className="kt-portlet__body">
            <div className="kt-portlet__head-toolbar ">
                <div className="kt-portlet__head-wrapper">
                    <div className="kt-portlet__head-actions">
                        <div className="row">
                            <div className="col-6">
                            <div className="dropdown dropdown-inline pb-4" style={{float:"left"}}>
                            <button type="button" className="btn btn-default btn-icon-sm dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <i className="la la-download"></i> Export
                                                </button>
                            <div className="dropdown-menu dropdown-menu-right " >
                                <ul className="kt-nav">
                                    <li className="kt-nav__section kt-nav__section--first">
                                        <span className="kt-nav__section-text">Choose an option</span>
                                    </li>
                                    <li className="kt-nav__item">
                                        <a className="kt-nav__link refill_cursor" onClick={exportLoading ? () => { } : exportCSVFileData}>
                                            <i className="kt-nav__link-icon la la-file-text-o"></i>
                                            <span className="kt-nav__link-text">{exportLoading ? "Loading..." : "CSV"}</span>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                            </div>
                            <div className="col-6">
                            <div className="dropdown dropdown-inline pb-4" style={{float:"right"}}>
                            <button type="button" className="btn btn-default btn-icon-sm dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        <i class="fas fa-bars"></i> Search filter
															</button>
                                        <div className="dropdown-menu dropdown-menu-right">
                                            <ul className="kt-nav">
                                                <li className="kt-nav__section kt-nav__section--first">
                                                    <span style={{fontSize:"13px",fontWeight:"700"}}>Id</span>
                                                </li>
                                                <li className="kt-nav__section kt-nav__section--first">
                                                    <span style={{fontSize:"13px",fontWeight:"700"}}>Product Name</span>
                                                </li>
                                            </ul>
                                        </div>
                        </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
                {/* <!--begin: Datatable --> */}
                <table className="table table-striped- table-bordered table-hover table-checkable" id={table_id}>
                    <thead>
                        {this._handle_table_row()}
                    </thead>
                </table>

                {/* <!--end: Datatable --> */}
            </div>
        )
    }
}

export default Table