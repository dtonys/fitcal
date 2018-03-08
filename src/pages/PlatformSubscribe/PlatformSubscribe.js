import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import {
//   StripeProvider,
//   Elements,
//   injectStripe,
// } from 'react-stripe-elements';

import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import Divider from 'material-ui/Divider';


const standardPlan = {
  id: 'tsc_standard',
  object: 'plan',
  amount: 100,
  created: 1520480224,
  currency: 'usd',
  interval: 'week',
  interval_count: 1,
  livemode: false,
  metadata: {
  },
  nickname: 'tsc_standard',
  product: 'prod_CS9r6IQNfpUE2G',
  trial_period_days: null,
};

// @injectStripe
// class CheckoutForm extends Component {
//   static propTypes = {
//     stripe: PropTypes.object.isRequired,
//   }

//   handleSubmit = ( event ) => {
//     event.preventDefault();
//   }

//   render() {
//     return (
//       <div>
//         Stripe CheckoutForm
//       </div>
//     );
//   }
// }

@connect()
class PlatformSubscribePage extends Component {

  subscribe = () => {
    alert('POST /api/platform/subscribe');
  }

  stripeConnect = () => {
    alert('Stripe Connect Flow');
  }

  // redirect to dashboard

  render() {
    const { amount, interval } = standardPlan;

    return (
      <div style={{ textAlign: 'center' }} >
        <Typography type="display1" color="primary" align="center" gutterBottom >
          {'Join our platform'}
        </Typography>
        <Divider />
        <br /><br />
        <div style={{ textAlign: 'left' }} >
          <pre> { JSON.stringify(standardPlan, null, 4) } </pre>
        </div>
        <Typography type="subheading" color="primary" align="center" gutterBottom >
          {`Join for $${(amount / 100).toFixed(2)} / ${interval}`}
        </Typography>
        { /*
          <StripeProvider apiKey="pk_test_yOIGYyEYINNZdBRrvyFkfUTH" >
            <Elements>
              <CheckoutForm />
            </Elements>
          </StripeProvider>
        */}
        <Button
          raised
          color="primary"
          type="submit"
          onClick={this.subscribe}
        >
          Subscribe to Platform
        </Button>
        <br /><br />
        <Divider />
        <br /><br />
        <Button
          raised
          color="primary"
          type="submit"
          onClick={this.stripeConnect}
        >
          Connect Stripe Account
        </Button>
      </div>
    );
  }
}
export default PlatformSubscribePage;
