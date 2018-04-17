import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import Divider from 'material-ui/Divider';
import { extractUserState } from 'redux/user/reducer';


@connect(
  ( globalState ) => ({
    user: extractUserState(globalState).user,
  })
)
class PlatformSubscribePage extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
  }

  onSubmit = ( event ) => {
    event.preventDefault();
    const { email } = this.props.user;
    this.stripeCheckoutHandler.open({
      name: 'Team Sweetcheecks',
      description: 'Platform Membership',
      amount: 100,
      email,
    });
  }

  render() {
    const { connected } = this.props.user;

    return (
      <div style={{ textAlign: 'center' }} >
        <Typography type="display1" color="primary" align="center" gutterBottom >
          {'Join our platform'}
        </Typography>
        <Divider />
        <br /><br />
        { connected &&
          <Typography type="subheading" color="primary" align="center" gutterBottom >
            Your Stripe account is connected to the platform!
          </Typography>
        }
        { !connected &&
          <a href="/api/stripe/connect">
            <Typography type="subheading" color="primary" align="center" gutterBottom >
              {`
Team Sweetcheecks uses Stripe to get you paid quickly and keep your personal and payment information secure.
Thousands of companies around the world trust Stripe to process payments for their users.
Set up a Stripe account to get paid with Team Sweetcheecks.
              `}
            </Typography>

            <Button
              raised
              color="primary"
              type="submit"
            >
              Connect Stripe Account
            </Button>
          </a>
        }
      </div>
    );
  }
}
export default PlatformSubscribePage;
