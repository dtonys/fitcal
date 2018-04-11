import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { clientRequest } from 'helpers/request';
import { appendScriptToHead } from 'helpers/domUtils';

import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import Divider from 'material-ui/Divider';
import { extractUserState } from 'redux/user/reducer';
import {
  LOAD_USER_REQUESTED,
} from 'redux/user/actions';


const standardPlan = {
  id: 'tsc_standard',
  object: 'plan',
  amount: 100,
  created: 1520480224,
  currency: 'usd',
  interval: 'week',
  interval_count: 1,
  livemode: false,
  metadata: {},
  nickname: 'tsc_standard',
  product: 'prod_CS9r6IQNfpUE2G',
  trial_period_days: null,
};

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

  // TODO: Move to SSR
  componentDidMount() {
    window.addEventListener('onpopstate', this.closeStripeCheckout);
    appendScriptToHead('https://checkout.stripe.com/checkout.js', this.onCheckoutScriptLoaded );
  }

  componentWillUnmount() {
    window.removeEventListener('onpopstate', this.closeStripeCheckout);
    if ( this.stripeCheckoutHandler ) this.closeStripeCheckout();
  }

  onCheckoutScriptLoaded = () => {
    this.stripeCheckoutHandler = window.StripeCheckout.configure({
      key: STRIPE_API_KEY,
      image: 'https://stripe.com/img/documentation/checkout/marketplace.png',
      token: this.subscribe,
    });
  }

  closeStripeCheckout = () => {
    if ( this.stripeCheckoutHandler ) {
      this.stripeCheckoutHandler.close();
    }
  }

  subscribe = ( token ) => {
    clientRequest('/api/platform/subscribe', {
      method: 'POST',
      body: {
        token: token.id,
      },
    })
      .then(() => {
        // debugger;
        this.props.dispatch({ type: LOAD_USER_REQUESTED });
      });
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
    const { subscribed, connected } = this.props.user;
    const { amount, interval } = standardPlan;

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
