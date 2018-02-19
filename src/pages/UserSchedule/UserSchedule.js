import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Typography from 'material-ui/Typography';
import EventList from 'components/EventList/EventList';
import {
  LOAD_EVENT_LIST_REQUESTED,
} from 'redux/event/actions';
import {
  ROUTE_JOIN_EVENT,
} from 'redux/routesMap';
import {
  extractListState,
} from 'redux/event/reducer';


@connect(
  ( globalState ) => ({
    eventList: extractListState(globalState).items,
    username: globalState.location.payload.id,
  })
)
class UserSchedulePage extends Component {

  static propTypes = {
    eventList: PropTypes.array.isRequired,
    username: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired,
  }

  // NOTE: Load on server for real use case
  componentDidMount() {
    const { username } = this.props;
    this.props.dispatch({
      type: LOAD_EVENT_LIST_REQUESTED,
      meta: { apiUrl: `/api/${username}/events` },
    });
  }

  joinEventRedirect = ( event ) => {
    const id = event.currentTarget.getAttribute('data-resource-id');
    this.props.dispatch({ type: ROUTE_JOIN_EVENT, payload: { id } });
  }

  render() {
    const {
      eventList,
      username,
    } = this.props;

    return (
      <div>
        <Typography type="title" color="primary" gutterBottom >
          {`${username} schedule`}
        </Typography>
        <EventList
          onJoinClick={this.joinEventRedirect}
          eventList={eventList}
        />
      </div>
    );
  }
}
export default UserSchedulePage;
