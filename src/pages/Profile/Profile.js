import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Typography from 'material-ui/Typography';
import Divider from 'material-ui/Divider';
import Link from 'redux-first-router-link';
import TextInput from 'components/TextInput/TextInput';
import FormModal from 'components/FormModal/FormModal';
import {
  extractUserState,
  extractPaymentMethodState,
} from 'redux/user/reducer';
import { clientRequest } from 'helpers/request';
import {
  LOAD_USER_REQUESTED,
  LOAD_PAYMENT_METHOD_REQUESTED,
} from 'redux/user/actions';
import { appendScriptToHead } from 'helpers/domUtils';
import Button from 'material-ui/Button';
import {
  required as isRequired,
} from 'helpers/validators';
import {
  dollars as normalizeDollars,
  number as normalizeNumber,
} from 'helpers/normalizers';
import {
  CREATE_MEMBERSHIP_REQUESTED,
} from 'redux/membership/actions';
import { convertFormValuesToApiFormat } from 'helpers/form';


const commonProps = {
  margin: 'dense',
  fullWidth: true,
  style: { marginBottom: '10px' },
  validate: isRequired,
};
const textFieldProps = {
  component: TextInput,
  type: 'text',
  ...commonProps,
};
const membershipFields = [
  {
    name: 'name',
    ...textFieldProps,
  },
  {
    name: 'description',
    ...textFieldProps,
  },
  {
    component: TextInput,
    name: 'price_dollars',
    label: 'monthly subscription price',
    type: 'text',
    parse: normalizeNumber,
    format: normalizeDollars,
    ...commonProps,
  },
];


@connect(
  ( globalState ) => ({
    user: extractUserState(globalState).user,
    paymentMethod: extractPaymentMethodState(globalState).data,
  })
)
class ProfilePage extends Component { // eslint-disable-line
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
    paymentMethod: PropTypes.object,
  }
  static defaultProps = {
    paymentMethod: null,
  }

  constructor( props ) {
    super(props);
    this.state = {
      modalOpen: false,
      modalActionType: CREATE_MEMBERSHIP_REQUESTED,
      modalTitle: 'Create Membership',
      initialValues: null,
    };
  }

  componentDidMount() {
    this.props.dispatch({ type: LOAD_PAYMENT_METHOD_REQUESTED });
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
      token: this.updatePaymentMethod,
    });
  }

  onUpdatePaymentMethod = () => {
    event.preventDefault();
    const { email } = this.props.user;
    this.stripeCheckoutHandler.open({
      name: 'Team Sweetcheecks',
      panelLabel: 'Update Card',
      description: 'Update Payment Method',
      email,
    });
  }

  closeStripeCheckout = () => {
    if ( this.stripeCheckoutHandler ) {
      this.stripeCheckoutHandler.close();
    }
  }

  updatePaymentMethod = (token) => {
    clientRequest('/api/payment/method/update', {
      method: 'POST',
      body: {
        token: token.id,
      },
    })
      .then(() => {
        this.props.dispatch({ type: LOAD_PAYMENT_METHOD_REQUESTED });
      });
  }

  cancelSubscription = () => {
    const confirmed = confirm('Are you sure you want to cancel your subscription?'); // eslint-disable-line
    if ( confirmed ) {
      clientRequest('/api/platform/unsubscribe', {
        method: 'POST',
      })
        .then(() => {
          this.props.dispatch({ type: LOAD_USER_REQUESTED });
        });
    }
  }

  closeModal = () => {
    this.setState({
      modalOpen: false,
    });
  }

  openCreateModal = () => {
    this.setState({
      modalOpen: true,
      modalActionType: CREATE_MEMBERSHIP_REQUESTED,
      modalTitle: 'Create Membership',
      initialValues: null,
    });
  }

  render() {
    const {
      modalOpen,
      modalActionType,
      modalTitle,
      initialValues,
    } = this.state;
    const { paymentMethod, user } = this.props;

    return (
      <div>
        <Typography type="title" color="primary" gutterBottom >
          {'Profile Actions'}
        </Typography>
        <br />
        <Button raised color="primary" style={{ marginRight: '10px' }}>
          { 'Change Avatar Photo' }
        </Button>
        <Button raised color="primary" style={{ marginRight: '10px' }} >
          { 'Change Profile Settings' }
        </Button>
        <Button raised color="primary" style={{ marginRight: '10px' }}>
          { 'Deactivate account' }
        </Button>
        <Link to={`/users/${user.username}`}>
          <Button raised color="primary" style={{ marginRight: '10px' }}>
            { 'View Public Profile' }
          </Button>
        </Link>

        <br /> <br />
        <Divider />
        <br />
        <Typography type="title" color="primary" gutterBottom >
          {'Account Actions'}
        </Typography>
        { !user.subscribed &&
          <Link to="/subscribe">
            <Button raised color="primary" style={{ marginRight: '10px' }}>
              { 'Subscribe to Platform' }
            </Button>
          </Link>
        }
        { user.subscribed &&
          <span>
            <Button raised color="primary" style={{ marginRight: '10px' }} disabled>
              { 'Subscribed' }
            </Button>
            <Button
              raised
              color="primary"
              style={{ marginRight: '10px' }}
              onClick={this.cancelSubscription}
            >
              { 'Cancel your subscription' }
            </Button>
          </span>
        }
        { user.connected &&
          <Button raised disabled color="primary" style={{ marginRight: '10px' }}>
            { 'Connected' }
          </Button>
        }
        { !user.connected &&
          <Link to="/subscribe">
            <Button raised color="primary" style={{ marginRight: '10px' }}>
              { 'Connect Stripe Account' }
            </Button>
          </Link>
        }
        <br /> <br />
        <Divider />
        <br />
        <Typography type="title" color="primary" gutterBottom >
          {'Payment'}
        </Typography>
        <br />

        <Typography type="subheading" color="primary" align="left" gutterBottom >
          Your card details:
        </Typography>
        { paymentMethod &&
          <pre> {JSON.stringify(paymentMethod, null, 4)} </pre>
        }
        <br />
        <Button raised color="primary" style={{ marginRight: '10px' }} onClick={this.onUpdatePaymentMethod} >
          { 'Update Payment Method' }
        </Button>
        <br /><br /><br />
        <Divider />
        <br />
        <Typography type="title" color="primary" gutterBottom >
          {'My Memberships'}
        </Typography>
        <br />
        <Button
          raised
          color="primary"
          onClick={this.openCreateModal}
        >
          { 'Create Membership' }
        </Button>
        <FormModal
          open={modalOpen}
          close={this.closeModal}
          submitActionType={modalActionType}
          title={modalTitle}
          fields={membershipFields}
          convertFormValuesToApiFormat={convertFormValuesToApiFormat}
          initialValues={initialValues}
        />
        <br /><br /><br />
      </div>
    );
  }
}
export default ProfilePage;
