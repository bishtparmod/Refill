import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

export default class Table extends PureComponent {
    static propTypes = {
        table_id: PropTypes.string
    }

    render() {
        const { table_id, exportCSVFileData, exportProductLoading } = this.props;
        return (
            <div className="kt-container  kt-container--fluid  kt-grid__item kt-grid__item--fluid">
                <div className="kt-portlet kt-portlet--mobile">
                    <div className="kt-portlet__head kt-portlet__head--lg">
                        <div className="kt-portlet__head-label">
                            <span className="kt-portlet__head-icon">
                                <i className="kt-font-brand flaticon2-line-chart"></i>
                            </span>
                            <h3 className="kt-portlet__head-title">
                                Driver List
												</h3>
                        </div>
                        <div className="kt-portlet__head-toolbar">
                            <div className="kt-portlet__head-wrapper">
                                <div className="kt-portlet__head-actions">
                                    {/* <div className="dropdown dropdown-inline">
                                        <button type="button" className="btn btn-default btn-icon-sm dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                            <i className="la la-download"></i> Export
															</button>
                                        <div className="dropdown-menu dropdown-menu-right">
                                            <ul className="kt-nav">
                                                <li className="kt-nav__section kt-nav__section--first">
                                                    <span className="kt-nav__section-text">Choose an option</span>
                                                </li>
                                                <li className="kt-nav__item">
                                                    <a className="kt-nav__link refill_cursor" onClick={exportProductLoading ? () => { } : exportCSVFileData}>
                                                        <i className="kt-nav__link-icon la la-file-text-o"></i>
                                                        <span className="kt-nav__link-text">{exportProductLoading ? "Loading..." : "CSV"}</span>
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                    </div> */}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="kt-portlet__body">
                        {/* <!--begin: Datatable --> */}
                        <table className="table table-striped- table-bordered table-hover table-checkable" id={table_id}>
                            <thead>
                                <tr>
                                    <th> ID</th>
                                    <th>Name</th>
                                    <th>VehicleName</th>
                                    <th>VehicleNumber</th>
                                    <th>email</th>
                                    <th>licenseNumber</th>
                                    <th>Address</th>
                                    <th>Created Date</th>
                                    <th>Actions</th>   
                                </tr>
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