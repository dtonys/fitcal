import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { clientRequest } from 'helpers/request';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogTitle,
} from 'material-ui/Dialog';
import Button from 'material-ui/Button';
import {
  extractUserState,
  extractPaymentMethodState,
} from 'redux/user/reducer';
import {
  LOAD_PAYMENT_METHOD_REQUESTED,
  LOAD_USER_REQUESTED,
} from 'redux/user/actions';
import { appendScriptToHead } from 'helpers/domUtils';


@connect(
  ( globalState ) => ({
    user: extractUserState(globalState).user,
    paymentMethodState: extractPaymentMethodState(globalState),
  })
)
class SubscribeModal extends Component { // eslint-disable-line
  static propTypes = {
    paymentMethodState: PropTypes.object,
    open: PropTypes.bool.isRequired,
    close: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    membership: PropTypes.object,
    user: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
  }

  static defaultProps = {
    paymentMethodState: null,
    membership: null,
  }

  componentDidUpdate( prevProps /* , prevState */ ) {
    // on open, load payment method
    const modalOpened = (!prevProps.open && this.props.open);
    if ( modalOpened ) {
      this.props.dispatch({ type: LOAD_PAYMENT_METHOD_REQUESTED });
    }
    // if payment method is loaded and empty, setup stripe to collect payment method
    const paymentLoadedWhileModalOpen = (
      this.props.open &&
      !prevProps.paymentMethodState.loaded &&
      this.props.paymentMethodState.loaded
    );
    if ( paymentLoadedWhileModalOpen && !this.props.paymentMethodState.data ) {
      this.setupStripeCheckout();
    }
  }

  setupStripeCheckout = () => {
    if ( !window.StripeCheckout ) {
      appendScriptToHead('https://checkout.stripe.com/checkout.js', this.onCheckoutScriptLoaded );
      return;
    }
    this.onCheckoutScriptLoaded();
  }

  onCheckoutScriptLoaded = () => {
    this.stripeCheckoutHandler = window.StripeCheckout.configure({
      key: STRIPE_API_KEY,
      image: 'https://stripe.com/img/documentation/checkout/marketplace.png',
      token: this.subscribeToMembership,
    });
  }

  collectPaymentMethod = () => {
    event.preventDefault();
    const { membership, user } = this.props;
    this.stripeCheckoutHandler.open({
      name: membership.name,
      panelLabel: 'Pay and Subscribe',
      description: membership.description,
      email: user.email,
    });
  }

  closeStripeCheckout = () => {
    if ( this.stripeCheckoutHandler ) {
      this.stripeCheckoutHandler.close();
    }
  }

  onSubscribeClick = () => {
    const { paymentMethodState } = this.props;
    if ( paymentMethodState.data ) {
      this.subscribeToMembership();
      return;
    }
    this.collectPaymentMethod();
  }

  subscribeToMembership = ( token ) => {
    const { membership, close } = this.props;
    clientRequest(`/api/memberships/${membership._id}/subscribe`, {
      method: 'POST',
      body: {
        token: token || undefined,
      },
    })
      .then(() => {
        this.props.dispatch({ type: LOAD_USER_REQUESTED });
        this.closeStripeCheckout();
        close();
      });
  }

  render() {
    const {
      open,
      close,
      title,
      membership,
      paymentMethodState,
    } = this.props;

    const hasPaymentMethod = Boolean(paymentMethodState.data);

    return (
      <Dialog
        open={open}
        onClose={close}
      >
        <DialogTitle id="form-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <div> Membership </div>
          <pre> {JSON.stringify(membership, null, 4)} </pre>
          <div> Payment Method </div>
          <pre> {JSON.stringify(paymentMethodState.data, null, 4)} </pre>
        </DialogContent>
        <DialogActions>
          <Button onClick={close} color="primary">
            Cancel
          </Button>
          <Button onClick={this.onSubscribeClick} type="submit" color="primary">
            { hasPaymentMethod ? 'Pay and Subscribe' : 'Enter payment method' }
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default SubscribeModal;
