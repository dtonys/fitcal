import lodashDifference from 'lodash/difference';
import lodashGet from 'lodash/get';
import querySerializer from 'query-string';
import { redirect, NOT_FOUND } from 'redux-first-router';

export const ROUTE_HOME = 'ROUTE_HOME';
export const ROUTE_LOGIN = 'ROUTE_LOGIN';
export const ROUTE_SIGNUP = 'ROUTE_SIGNUP';
export const ROUTE_LOST_PASSWORD = 'ROUTE_LOST_PASSWORD';
export const ROUTE_RESET_PASSWORD = 'ROUTE_RESET_PASSWORD';
export const ROUTE_PROFILE = 'ROUTE_PROFILE';
export const ROUTE_SCHEDULE = 'ROUTE_SCHEDULE';
export const ROUTE_PLATFORM_SUBSCRIBE = 'ROUTE_PLATFORM_SUBSCRIBE';
export const ROUTE_USER_SCHEDULE = 'ROUTE_USER_SCHEDULE';
export const ROUTE_JOIN_EVENT = 'ROUTE_JOIN_EVENT';
export const ROUTE_MEMBERSHIP_SUBSCRIBE = 'ROUTE_MEMBERSHIP_SUBSCRIBE';
export const ROUTE_LOGONAS = 'ROUTE_LOGONAS';

import {
  extractUserState,
} from 'redux/user/reducer';


const routesMap = {
  [ROUTE_HOME]: {
    path: '/',
  },
  [ROUTE_LOGIN]: {
    path: '/login',
    loggedOutOnly: true,
  },
  [ROUTE_SIGNUP]: {
    path: '/signup',
    loggedOutOnly: true,
  },
  [ROUTE_LOST_PASSWORD]: {
    path: '/lost-password',
  },
  [ROUTE_RESET_PASSWORD]: {
    path: '/reset-password',
  },
  [ROUTE_PROFILE]: {
    path: '/profile',
  },
  [ROUTE_SCHEDULE]: {
    path: '/schedule',
  },
  [ROUTE_PLATFORM_SUBSCRIBE]: {
    path: '/subscribe',
  },
  [ROUTE_USER_SCHEDULE]: {
    path: '/users/:id/schedule',
  },
  [ROUTE_JOIN_EVENT]: {
    path: '/events/:id/join',
  },
  [ROUTE_MEMBERSHIP_SUBSCRIBE]: {
    path: '/memberships/:id/subscribe',
  },
  [ROUTE_LOGONAS]: {
    path: '/logonas',
  },
  [NOT_FOUND]: {
    path: '/not-found',
  },
};

export const routeOptions = {
  querySerializer,
  // Defer route initial dispatch until after saga is running
  initialDispatch: !__SERVER__,
  // Check permissions and redirect if not authorized for given route
  onBeforeChange: ( dispatch, getState, { action }) => {
    const { user } = extractUserState(getState());
    const { loggedOutOnly, loggedInOnly, requireRoles } = routesMap[action.type];
    const requiresLogin = Boolean( loggedInOnly || requireRoles );

    // redirect to home page if logged in and visiting logged out only routes
    if ( loggedOutOnly && user ) {
      dispatch( redirect({ type: ROUTE_HOME }) );
      return;
    }

    if ( requiresLogin && !user ) {
      const nextAction = JSON.stringify({
        type: action.type,
        payload: action.payload,
        query: action.meta.location.current.query,
      });
      dispatch( redirect({
        type: ROUTE_LOGIN,
        payload: {
          query: { next: nextAction },
        },
      }) );
      return;
    }

    // redirect to 404 if logged in but invalid role
    if ( requireRoles ) {
      const userRoles = lodashGet( user, 'roles' );
      const hasRequiredRoles = userRoles && lodashDifference(requireRoles, userRoles).length === 0;
      if ( !hasRequiredRoles ) {
        dispatch( redirect({ type: NOT_FOUND }) );
      }
    }
  },
};


export default routesMap;
