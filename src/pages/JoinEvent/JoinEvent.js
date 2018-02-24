import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  extractEventDetailState,
} from 'redux/event/reducer';
import Button from 'material-ui/Button';
import {
  LOAD_EVENT_DETAIL_REQUESTED,
  JOIN_EVENT_REQUESTED,
} from 'redux/event/actions';

@connect(
  (globalState) => ({
    eventDetailState: extractEventDetailState(globalState),
    eventId: globalState.location.payload.id,
  })
)
class JoinEventPage extends Component {
  static propTypes = {
    eventDetailState: PropTypes.object.isRequired,
    eventId: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired,
  }

  // NOTE: Server render
  componentDidMount() {

    this.props.dispatch({
      type: LOAD_EVENT_DETAIL_REQUESTED,
      payload: this.props.eventId,
    });
  }

  confirmJoin = () => {
    this.props.dispatch({
      type: JOIN_EVENT_REQUESTED,
      payload: this.props.eventId,
    });
  }

  render() {
    const {
      eventDetailState,
    } = this.props;

    return (
      <div>
        <pre> {JSON.stringify(eventDetailState.data, null, 4)} </pre>
        <br /><br /><br />
        <Button
          raised
          color="primary"
          onClick={this.confirmJoin}
        >
          { 'Confirm Join Event' }
        </Button>
      </div>
    );
  }
}
export default JoinEventPage;
