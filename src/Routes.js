import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router';
import { Switch } from "react-router-dom";
import asyncComponent from './components/base_components/AsyncComponent';
import { AuthRoute, UnAuthRoute, AppliedRoute } from './components/base_components';

export const routes = {
    index: '/',
    login: '/login',
    forgot_password: '/forgot_password'
}

const publicRoutes = ({ childProps }) =>
    <Switch>
        <UnAuthRoute
            exact
            path={routes.login}
            component={asyncComponent(() => import("./pages/public/Login"))}
            props={childProps}
        />
        <UnAuthRoute
            exact
            path={routes.forgot_password}
            component={asyncComponent(() => import("./pages/public/ForgotPassword"))}
            props={childProps}
        />
        <AppliedRoute
            path={routes.index}
            component={asyncComponent(() => import("./pages/dashboard/Dashboard"))}
            props={childProps}
        />
    </Switch>

export default publicRoutes;
