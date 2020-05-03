import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

export default class Table extends PureComponent {
    static propTypes = {
        table_id: PropTypes.string,
        type: PropTypes.string
    }

    _category = () => <tr>
        <th>Order ID</th>
        <th>Name</th>
        <th>Created Date</th>
        <th>Actions</th>
    </tr>

    _sub_category = () => <tr>
        <th>Order ID</th>
        <th>Category ID</th>
        <th>Name</th>
        <th>Created Date</th>
        <th>Actions</th>
    </tr>

    _handle_table_row = () => {
        const { type } = this.props;

        switch (type) {
            case 'category':
                return this._category();
            case 'sub_category':
                return this._sub_category();
        }
    }

    render() {
        const { table_id, type } = this.props;

        return (
            <div className="kt-container  kt-container--fluid  kt-grid__item kt-grid__item--fluid">
                <div className="kt-portlet kt-portlet--mobile">
                    <div className="kt-portlet__body">
                        {/* <!--begin: Datatable --> */}
                        <table className="table table-striped- table-bordered table-hover table-checkable" id={table_id}>
                            <thead>
                                {this._handle_table_row()}
                            </thead>
                        </table>

                        {/* <!--end: Datatable --> */}
                    </div>
                </div>
            </div>
        )
    }
}






// <div className="kt-portlet__head kt-portlet__head--lg">
//     <div className="kt-portlet__head-label">
//         <span className="kt-portlet__head-icon">
//             <i className="kt-font-brand flaticon2-line-chart"></i>
//         </span>
//         <h3 className="kt-portlet__head-title">
//             Category List
// 												</h3>
//     </div>
//     <div className="kt-portlet__head-toolbar">
//         <div className="kt-portlet__head-wrapper">
//             <div className="kt-portlet__head-actions">
//                 <div className="dropdown dropdown-inline">
//                     <button type="button" className="btn btn-default btn-icon-sm dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
//                         <i className="la la-download"></i> Export
// 															</button>
//                     <div className="dropdown-menu dropdown-menu-right">
//                         <ul className="kt-nav">
//                             <li className="kt-nav__section kt-nav__section--first">
//                                 <span className="kt-nav__section-text">Choose an option</span>
//                             </li>
//                             <li className="kt-nav__item">
//                                 <a href="#" className="kt-nav__link">
//                                     <i className="kt-nav__link-icon la la-file-text-o"></i>
//                                     <span className="kt-nav__link-text">CSV</span>
//                                 </a>
//                             </li>
//                         </ul>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     </div>
// </div>