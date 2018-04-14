import React from 'react';
import PropTypes from 'prop-types';

import Button from 'material-ui/Button';
import List, { ListItem, ListItemText } from 'material-ui/List';
import Divider from 'material-ui/Divider';


const ResourceList = ({
  resourceList,
  onEditClick,
  onDeleteClick,
  onUnsubscribeClick,
  onJoinClick,
}) => {
  return (
    <List>
      {resourceList.map((resource) => (
        <div key={resource._id} >
          <ListItem
            dense
          >
            <ListItemText
              primary={resource.name}
              secondary={resource.createdAt.toString()}
            />
            { onEditClick &&
              <Button
                raised
                color="primary"
                style={{ marginRight: '10px' }}
                data-resource-id={resource._id}
                onClick={onEditClick}
              >Edit
              </Button>
            }
            { onDeleteClick &&
              <Button
                raised
                color="primary"
                data-resource-id={resource._id}
                onClick={onDeleteClick}
              >Delete
              </Button>
            }
            { onJoinClick &&
              <Button
                raised
                color="primary"
                data-resource-id={resource._id}
                disabled={!resource.can_join}
                onClick={resource.can_join ? onJoinClick : null}
              >Join
              </Button>
            }
            { onUnsubscribeClick &&
              <Button
                raised
                color="primary"
                data-resource-id={resource._id}
                onClick={onUnsubscribeClick}
              >Unsubscribe
              </Button>
            }
          </ListItem>
          <Divider />
        </div>
      ))}
    </List>
  );
};
ResourceList.propTypes = {
  resourceList: PropTypes.array.isRequired,
  onEditClick: PropTypes.func,
  onDeleteClick: PropTypes.func,
  onUnsubscribeClick: PropTypes.func,
  onJoinClick: PropTypes.func,
};
ResourceList.defaultProps = {
  onEditClick: null,
  onDeleteClick: null,
  onUnsubscribeClick: null,
  onJoinClick: null,
};

export default ResourceList;
