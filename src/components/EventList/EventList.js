import React from 'react';
import PropTypes from 'prop-types';

import Button from 'material-ui/Button';
import List, { ListItem, ListItemText } from 'material-ui/List';
import Divider from 'material-ui/Divider';


const EventList = ({
  eventList,
  onEditClick,
  onDeleteClick,
  onJoinClick,
}) => {
  const canJoin = true;
  return (
    <List>
      {eventList.map((event) => (
        <div key={event._id} >
          <ListItem
            dense
          >
            <ListItemText
              primary={event.name}
              secondary={event.start_date.toString()}
            />
            {onEditClick &&
              <Button
                raised
                color="primary"
                style={{ marginRight: '10px' }}
                data-resource-id={event._id}
                onClick={onEditClick}
              >Edit
              </Button>
            }
            { onDeleteClick &&
              <Button
                raised
                color="primary"
                data-resource-id={event._id}
                onClick={onDeleteClick}
              >Delete
              </Button>
            }
            { onJoinClick &&
              <Button
                raised
                color="primary"
                data-resource-id={event._id}
                disabled={!event.current_user.can_join}
                onClick={event.current_user.can_join ? onJoinClick : null}
              >Join
              </Button>
            }
          </ListItem>
          <Divider />
        </div>
      ))}
    </List>
  );
};
EventList.propTypes = {
  eventList: PropTypes.array.isRequired,
  onEditClick: PropTypes.func,
  onDeleteClick: PropTypes.func,
  onJoinClick: PropTypes.func,
};
EventList.defaultProps = {
  onEditClick: null,
  onDeleteClick: null,
  onJoinClick: null,
};

export default EventList;
