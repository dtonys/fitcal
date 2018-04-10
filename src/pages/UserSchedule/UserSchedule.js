import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Typography from 'material-ui/Typography';
import ResourceList from 'components/ResourceList/ResourceList';
import {
  LOAD_USER_EVENTS_REQUESTED,
} from 'redux/event/actions';
import {
  ROUTE_JOIN_EVENT,
} from 'redux/routesMap';
import {
  extractUserEventsState,
} from 'redux/event/reducer';


@connect(
  ( globalState ) => ({
    userEvents: extractUserEventsState(globalState).items,
    username: globalState.location.payload.id,
  })
)
class UserSchedulePage extends Component {

  static propTypes = {
    userEvents: PropTypes.array.isRequired,
    username: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired,
  }

  // NOTE: Load on server for real use case
  componentDidMount() {
    const { username } = this.props;
    this.props.dispatch({
      type: LOAD_USER_EVENTS_REQUESTED,
      payload: username,
    });
  }

  joinEventRedirect = ( event ) => {
    const id = event.currentTarget.getAttribute('data-resource-id');
    this.props.dispatch({ type: ROUTE_JOIN_EVENT, payload: { id } });
  }

  render() {
    const {
      userEvents,
      username,
    } = this.props;

    return (
      <div>
        <Typography type="title" color="primary" gutterBottom >
          {`${username} schedule`}
        </Typography>
        <ResourceList
          onJoinClick={this.joinEventRedirect}
          resourceList={userEvents}
        />
      </div>
    );
  }
}
export default UserSchedulePage;
