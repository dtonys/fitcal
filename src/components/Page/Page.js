import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { NOT_FOUND } from 'redux-first-router';
import universal from 'react-universal-component';
import Loading from 'components/Loading/Loading';

import {
  ROUTE_HOME,
  ROUTE_LOGIN,
  ROUTE_SIGNUP,
  ROUTE_LOST_PASSWORD,
  ROUTE_RESET_PASSWORD,
  ROUTE_PROFILE,
  ROUTE_SCHEDULE,
  ROUTE_PLATFORM_SUBSCRIBE,
  ROUTE_USER_SCHEDULE,
  ROUTE_JOIN_EVENT,
  ROUTE_MEMBERSHIP_SUBSCRIBE,
} from 'redux/routesMap';


const options = {
  minDelay: 300,
  loading: Loading,
};
const HomePage = universal(import('pages/Home/Home'), options);
const LoginPage = universal(import('pages/Login/Login'), options);
const SignupPage = universal(import('pages/Signup/Signup'), options);
const NotFoundPage = universal(import('pages/NotFound/NotFound'), options);
const LostPasswordPage = universal(import('pages/LostPassword/LostPassword'), options);
const ResetPasswordPage = universal(import('pages/ResetPassword/ResetPassword'), options);
const ProfilePage = universal(import('pages/Profile/Profile'), options);
const SchedulePage = universal(import('pages/Schedule/Schedule'), options);

const PlatformSubscribePage = universal(import('pages/PlatformSubscribe/PlatformSubscribe'), options);
const UserSchedulePage = universal(import('pages/UserSchedule/UserSchedule'), options);
const JoinEventPage = universal(import('pages/JoinEvent/JoinEvent'), options);
const MembershipSubscribePage = universal(import('pages/MembershipSubscribe/MembershipSubscribe'), options);

const actionToPage = {
  [ROUTE_HOME]: HomePage,
  [ROUTE_LOGIN]: LoginPage,
  [ROUTE_SIGNUP]: SignupPage,
  [ROUTE_LOST_PASSWORD]: LostPasswordPage,
  [ROUTE_RESET_PASSWORD]: ResetPasswordPage,
  [ROUTE_PROFILE]: ProfilePage,
  [ROUTE_SCHEDULE]: SchedulePage,
  [ROUTE_PLATFORM_SUBSCRIBE]: PlatformSubscribePage,
  [ROUTE_USER_SCHEDULE]: UserSchedulePage,
  [ROUTE_JOIN_EVENT]: JoinEventPage,
  [ROUTE_MEMBERSHIP_SUBSCRIBE]: MembershipSubscribePage,
  [NOT_FOUND]: NotFoundPage,
};
const getPageFromRoute = ( routeAction ) => {
  let RouteComponent = actionToPage[routeAction];
  if ( !RouteComponent ) {
    RouteComponent = NotFoundPage;
  }
  return RouteComponent;
};

@connect(
  (state) => ({
    routeAction: state.location.type,
  }),
)
class Page extends Component {
  static propTypes = {
    routeAction: PropTypes.string.isRequired,
  }
  render() {
    const { routeAction } = this.props;
    const RoutedPage = getPageFromRoute(routeAction);

    return (
      <RoutedPage />
    );
  }

}

export default Page;
