import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Link from 'redux-first-router-link';

import { extractUserState } from 'redux/user/reducer';
import {
  LOGOUT_REQUESTED,
} from 'redux/user/actions';

import styles from 'components/Navbar/Navbar.scss';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';


@connect(
  ( globalState ) => ({
    user: extractUserState(globalState).user,
  })
)
class Navbar extends Component {
  static propTypes = {
    user: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
  }
  static defaultProps = {
    user: null,
  }

  logout = () => {
    this.props.dispatch({ type: LOGOUT_REQUESTED });
  }

  render() {
    const {
      user,
    } = this.props;

    return (
      <div className="navbar-fixed" >
        <AppBar position="fixed" color="accent" elevation={1}>
          <Toolbar className={styles.toolBar} >
            <Typography
              type="title"
              color="inherit"
              className={styles.middleContent}
            >
              <Link to={ user ? '/schedule' : '/' }
                style={{
                  fontSize: '16px',
                  position: 'relative',
                  top: '0px',
                  display: 'block',
                  width: '100px',
                  color: '#000',
                }}
              >
                Fitcal
              </Link>
            </Typography>
            { user &&
              <div>
                <Link to="/schedule">
                  <Button color="primary" >Schedule</Button>
                </Link>
                <Link to="/profile">
                  <Button color="primary">
                    { user.email.substr(0, user.email.indexOf('@')) }
                  </Button>
                </Link>
                <Button color="primary" onClick={this.logout} >Logout</Button>
              </div>
            }
            { !user &&
              <div>
                <Link to="/login">
                  <Button color="primary">Login</Button>
                </Link>
                <Link to="/signup">
                  <Button color="primary">Signup</Button>
                </Link>
              </div>
            }
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}
export default Navbar;
