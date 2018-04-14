import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import lodashFind from 'lodash/find';

import Typography from 'material-ui/Typography';
import ResourceList from 'components/ResourceList/ResourceList';
import SubscribeModal from 'components/SubscribeModal/SubscribeModal';
import { clientRequest } from 'helpers/request';
import {
  LOAD_USER_EVENTS_REQUESTED,
} from 'redux/event/actions';
import {
  ROUTE_JOIN_EVENT, ROUTE_LOGIN,
} from 'redux/routesMap';
import {
  extractUserEventsState,
} from 'redux/event/reducer';
import { extractUserState } from 'redux/user/reducer';


@connect(
  ( globalState ) => ({
    user: extractUserState(globalState).user,
    userEvents: extractUserEventsState(globalState).items,
    username: globalState.location.payload.id,
  })
)
class UserSchedulePage extends Component {

  static propTypes = {
    user: PropTypes.object,
    userEvents: PropTypes.array.isRequired,
    username: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired,
  }
  static defaultProps = {
    user: null,
  }

  constructor( props ) {
    super(props);
    this.state = {
      memberships: [],
      subscribeModalOpen: false,
      selectedMembership: null,
    };
  }

  // NOTE: Load on server for real use case
  componentDidMount() {
    const { username } = this.props;
    this.props.dispatch({
      type: LOAD_USER_EVENTS_REQUESTED,
      payload: username,
    });
    this.loadMemberships();
  }

  loadMemberships = () => {
    const { username } = this.props;
    clientRequest(`/api/${username}/memberships`)
      .then((body) => {
        this.setState({
          memberships: body.data.items,
        });
      });
  }

  joinEventRedirect = ( event ) => {
    const { user, dispatch } = this.props;
    // Redirect to login if not logged in
    if ( !user ) {
      dispatch({ type: ROUTE_LOGIN });
      return;
    }
    const id = event.currentTarget.getAttribute('data-resource-id');
    dispatch({ type: ROUTE_JOIN_EVENT, payload: { id } });
  }

  showSubscribeModal = (membership) => {
    this.setState({
      subscribeModalOpen: true,
      selectedMembership: membership,
    });
  }

  closeSubscribeModal = () => {
    this.setState({
      subscribeModalOpen: false,
      selectedMembership: null,
    });
  }

  onJoinMembershipClick = ( event ) => {
    const { user, dispatch } = this.props;
    // Redirect to login if not logged in
    if ( !user ) {
      dispatch({ type: ROUTE_LOGIN });
      return;
    }
    const id = event.currentTarget.getAttribute('data-resource-id');
    const membership = lodashFind(this.state.memberships, { _id: id }, null);
    this.showSubscribeModal(membership);
  }

  onSubscribeSuccess = () => {
    this.loadMemberships();
  }

  render() {
    const {
      userEvents,
      username,
    } = this.props;
    const {
      memberships,
      subscribeModalOpen,
      selectedMembership,
    } = this.state;

    return (
      <div>
        <Typography type="title" color="primary" gutterBottom >
          {`${username}'s schedule`}
        </Typography>
        <ResourceList
          onJoinClick={this.joinEventRedirect}
          resourceList={userEvents}
        />
        <br />
        <Typography type="title" color="primary" gutterBottom >
          {`${username}'s memberships`}
        </Typography>
        <ResourceList
          onJoinClick={this.onJoinMembershipClick}
          resourceList={memberships}
        />
        <SubscribeModal
          open={subscribeModalOpen}
          close={this.closeSubscribeModal}
          title="Subscribe to Membership"
          membership={selectedMembership}
          onSubscribeSuccess={this.onSubscribeSuccess}
        >
          SubscribeModal
        </SubscribeModal>
      </div>
    );
  }
}
export default UserSchedulePage;
