import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import Footer from '../../components/dashboard/Footer'
import Header from '../../components/dashboard/Header'
import Sidebar from '../../components/dashboard/Sidebar'
import asyncComponent from '../../components/base_components/AsyncComponent';
import { Switch } from "react-router-dom";
import { AuthRoute } from '../../components/base_components'
import { connect } from 'react-redux'
import { USER_KEY, USER_DATA, ACTIVE } from '../../redux/Types'

const routes = {
    index: '/',
    reset_password: '/reset_password',
    change_password: '/profile/change_password',
    add_product: '/product/add',
    product_list: '/product/list',
    product_view:'/product/view/:id',
    edit_product: '/product/edit/:id',
    add_category: '/category/add',
    list_category: '/category/list',
    edit_categoryt: '/category/edit',
    user_list: '/user/list',
    user_add: '/user/add',
    user_edit:'/user/edit/:id',
    user_view:'/user/view/:id',
    order_list:'/order/list',
    order_view:'/order/view/:id',
    order_edit:'/order/edit/:id',
    report_list:'/report/list',
    deriver_list:'/deriver/list',
    deriver_add:'/deriver/add',
    deriver_edit:'/deriver/edit/:id',
    deriver_view:'/deriver/view/:id',
    splash:'/splash',
    addScreen:'/store/addscreen',
    discount:'/discount',
    sales:'/sales',


}

class Routes extends PureComponent {

    _replacePage = (url) => {
        const { history } = this.props;

        if (!url) return;

        history.replace(url);
    }

    componentDidMount = () => {
        const { is_reset_password } = this.props;
        if (is_reset_password === ACTIVE) this._replacePage('/reset_password');
    }

    render() {
        return (
            <Switch>
                <AuthRoute
                    exact
                    path={routes.index}
                    component={asyncComponent(() => import("./Home"))}
                    props={this.props}
                />
                <AuthRoute
                    exact
                    path={routes.product_list}
                    component={asyncComponent(() => import("./product/List"))}
                    props={this.props}
                />
                <AuthRoute
                    exact
                    path={routes.add_product}
                    component={asyncComponent(() => import("./product/Add"))}
                    props={this.props}
                />
                <AuthRoute
                    exact
                    path={routes.edit_product}
                    component={asyncComponent(() => import("./product/Edit"))}
                    props={this.props}
                />
                <AuthRoute
                    exact
                    path={routes.product_view}
                    component={asyncComponent(() => import("./product/View"))}
                    props={this.props}
                />
                <AuthRoute
                    exact
                    path={routes.change_password}
                    component={asyncComponent(() => import("./settings/ChangePassword"))}
                    props={this.props}
                />
                <AuthRoute
                    exact
                    path={routes.reset_password}
                    component={asyncComponent(() => import("./settings/ResetPassword"))}
                    props={this.props}
                />
                <AuthRoute
                    exact
                    path={routes.add_category}
                    component={asyncComponent(() => import("./category/Add"))}
                    props={this.props}
                />
                <AuthRoute
                    exact
                    path={routes.list_category}
                    component={asyncComponent(() => import("./category/List"))}
                    props={this.props}
                />
                <AuthRoute
                    exact
                    path={routes.user_list}
                    component={asyncComponent(() => import("./users/List"))}
                    props={this.props}
                />,
                <AuthRoute
                    exact
                    path={routes.user_add}
                    component={asyncComponent(() => import("./users/Add"))}
                    props={this.props}
                />
                <AuthRoute
                    exact
                    path={routes.user_edit}
                    component={asyncComponent(() => import("./users/Edit"))}
                    props={this.props}
                />
                <AuthRoute
                    exact
                    path={routes.user_view}
                    component={asyncComponent(() => import("./users/View"))}
                    props={this.props}
                />
                 <AuthRoute
                    exact
                    path={routes.order_list}
                    component={asyncComponent(() => import("./order/List"))}
                    props={this.props}
                />
                 <AuthRoute
                    exact
                    path={routes.order_edit}
                    component={asyncComponent(() => import("./order/Edit"))}
                    props={this.props}
                />
                 <AuthRoute
                    exact
                    path={routes.order_view}
                    component={asyncComponent(() => import("./order/View"))}
                    props={this.props}
                />
                <AuthRoute
                    exact
                    path={routes.report_list}
                    component={asyncComponent(() => import("./report/List"))}
                    props={this.props}
                />
                 <AuthRoute
                    exact
                    path={routes.deriver_list}
                    component={asyncComponent(() => import("./deriver/List"))}
                    props={this.props}
                />
                <AuthRoute
                    exact
                    path={routes.deriver_add}
                    component={asyncComponent(() => import("./deriver/Add"))}
                    props={this.props}
                />
                <AuthRoute
                    exact
                    path={routes.deriver_edit}
                    component={asyncComponent(() => import("./deriver/Edit"))}
                    props={this.props}
                />
                <AuthRoute
                    exact
                    path={routes.deriver_view}
                    component={asyncComponent(() => import("./deriver/View"))}
                    props={this.props}
                />
                <AuthRoute
                    exact
                    path={routes.splash}
                    component={asyncComponent(() => import("./store/Splash"))}
                    props={this.props}
                />
                 <AuthRoute
                    exact
                    path={routes.addScreen}
                    component={asyncComponent(() => import("./store/Addsplashscreen"))}
                    props={this.props}
                />
                <AuthRoute
                    exact
                    path={routes.discount}
                    component={asyncComponent(() => import("./store/Discount"))}
                    props={this.props}
                />
                 <AuthRoute
                    exact
                    path={routes.sales}
                    component={asyncComponent(() => import("./store/SalesTax"))}
                    props={this.props}
                />
            </Switch>
        )
    }
}

const mapToProps = ({ user }) => {
    const user_data = user && user[USER_KEY] ? user[USER_KEY] : undefined;
    const is_reset_password = user_data && user_data[USER_DATA] && user_data[USER_DATA].reset_password ? user_data[USER_DATA].reset_password : 0;

    return ({
        is_reset_password
    });
}

export default connect(mapToProps)(Routes);