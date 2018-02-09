import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { extractUserState } from 'redux/user/reducer';

import styles from 'pages/Home/Home.scss';
import Typography from 'material-ui/Typography';

@connect(
  ( globalState ) => ({
    user: extractUserState(globalState).user,
  })
)
class HomePage extends Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    user: PropTypes.object,
  }
  static defaultProps = {
    user: null,
  }

  render() {
    return (
      <div className={ styles.wrap } >
        <Typography type="display2" color="primary" gutterBottom >
          Team Sweet Cheeks
        </Typography>
        <br />
      </div>
    );
  }
}

export default HomePage;
