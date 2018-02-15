import React, { Component } from 'react';
// import PropTypes from 'prop-types';
// import { connect } from 'react-redux';

import Button from 'material-ui/Button';


class TrainerProfilePage extends Component {
  render() {
    return (
      <div>
        <div> Actions: </div>
        <br />
        <Button
          raised
          color="primary"
          style={{ marginRight: '10px' }}
        >
          { 'Change Avatar Photo' }
        </Button>
        <Button
          raised
          color="primary"
          style={{ marginRight: '10px' }}
        >
          { 'Change Profile Settings' }
        </Button>
        <Button
          raised
          color="primary"
          style={{ marginRight: '10px' }}
        >
          { 'Deactivate account' }
        </Button>
      </div>
    );
  }
}
export default TrainerProfilePage;
