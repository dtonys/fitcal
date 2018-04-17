import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import lodashFind from 'lodash/find';
import Typography from 'material-ui/Typography';
import Divider from 'material-ui/Divider';
import Link from 'redux-first-router-link';
import TextInput from 'components/TextInput/TextInput';
import FormModal from 'components/FormModal/FormModal';
import ResourceList from 'components/ResourceList/ResourceList';
import {
  extractUserState,
  extractPaymentMethodState,
} from 'redux/user/reducer';
import { clientRequest } from 'helpers/request';
import {
  LOAD_PAYMENT_METHOD_REQUESTED,
  LOAD_USER_REQUESTED,
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
  UPDATE_MEMBERSHIP_REQUESTED,
  LOAD_MY_MEMBERSHIPS_REQUESTED,
  DELETE_MEMBERSHIP_REQUESTED,
} from 'redux/membership/actions';
import { extractMyMembershipsState } from 'redux/membership/reducer';
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
const disabledOnEditFields = [ 'price_dollars' ];

function convertApiValuesToFormFormat( membershipItem ) {
  const formValues = {
    name: membershipItem.name,
    description: membershipItem.description,
    price_dollars: (membershipItem.price_cents / 100).toString(),
  };
  return formValues;
}


class MySubscriptions extends Component {

  constructor( props ) {
    super(props);
    this.state = {
      subscriptions: [],
    };
  }

  componentDidMount() {
    this.loadSubscriptions();
  }

  loadSubscriptions = () => {
    clientRequest('/api/subscriptions')
      .then(( requestBody ) => {
        const subscriptionViews = requestBody.data.map((sub) => {
          return {
            ...sub,
            name: sub.membership.name,
            description: sub.membership.name,
          };
        });

        this.setState({
          subscriptions: subscriptionViews,
        });
      });
  }

  onUnsubscribe = ( event ) => {
    const unsubscribeConfirmed = confirm(`Are you sure you want to unsubscribe?
Your membership will be terminated immediately, and you will be removed from all events connected to this membership.
    `);
    if ( unsubscribeConfirmed ) {
      const id = event.currentTarget.getAttribute('data-resource-id');
      clientRequest(`/api/subscriptions/${id}/unsubscribe`, {
        method: 'POST',
      })
        .then(() => {
          this.loadSubscriptions();
        });
    }
  }

  render() {
    const { subscriptions } = this.state;

    return (
      <div>
        <Typography type="title" color="primary" gutterBottom >
          {'My Subscriptions'}
        </Typography>
        <ResourceList
          resourceList={subscriptions}
          onUnsubscribeClick={this.onUnsubscribe}
        />
        <br /><br />
      </div>
    );
  }
}

@connect(
  ( globalState ) => ({
    myMemberships: extractMyMembershipsState(globalState).items,
  })
)
class MyMemberships extends Component {

  static propTypes = {
    myMemberships: PropTypes.array.isRequired,
    dispatch: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      modalContext: 'create',
      modalOpen: false,
      modalActionType: CREATE_MEMBERSHIP_REQUESTED,
      modalTitle: 'Create Membership',
      initialValues: null,
    };
  }

  // NOTE: Load on server for real use case
  componentDidMount() {
    this.props.dispatch({ type: LOAD_MY_MEMBERSHIPS_REQUESTED });
  }

  openCreateModal = () => {
    this.setState({
      modalContext: 'create',
      modalOpen: true,
      modalActionType: CREATE_MEMBERSHIP_REQUESTED,
      modalTitle: 'Create Membership',
      initialValues: null,
    });
  }

  closeModal = () => {
    this.setState({
      modalOpen: false,
    });
  }

  openEditModal = ( event ) => {
    const id = event.currentTarget.getAttribute('data-resource-id');
    const eventItem = lodashFind(this.props.myMemberships, { _id: id }, null);

    const initialFormValues = convertApiValuesToFormFormat(eventItem);
    initialFormValues.id = id;

    this.setState({
      modalContext: 'edit',
      modalOpen: true,
      modalActionType: UPDATE_MEMBERSHIP_REQUESTED,
      modalTitle: 'Edit Membership',
      initialValues: initialFormValues,
    });
  }

  confirmDelete = ( event ) => {
    const id = event.currentTarget.getAttribute('data-resource-id');
    const result = confirm('Are you sure you want to delete this item?'); // eslint-disable-line no-alert
    if ( result ) {
      this.props.dispatch({ type: DELETE_MEMBERSHIP_REQUESTED, payload: id });
    }
  }

  render() {
    const {
      modalContext,
      modalOpen,
      modalActionType,
      modalTitle,
      initialValues,
    } = this.state;
    const { myMemberships } = this.props;

    return (
      <div>
        <Typography type="title" color="primary" gutterBottom >
          {'My Memberships'}
        </Typography>
        <Button
          raised
          color="primary"
          onClick={this.openCreateModal}
        >
          { 'Create Membership' }
        </Button>
        <br /><br />
        <ResourceList
          resourceList={myMemberships}
          onEditClick={this.openEditModal}
          onDeleteClick={this.confirmDelete}
        />
        <FormModal
          modalContext={modalContext}
          open={modalOpen}
          close={this.closeModal}
          submitActionType={modalActionType}
          title={modalTitle}
          fields={membershipFields}
          convertFormValuesToApiFormat={convertFormValuesToApiFormat}
          initialValues={initialValues}
          disabledOnEditFields={disabledOnEditFields}
        />
        <br />
      </div>
    );
  }
}

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

  componentDidMount() {
    this.props.dispatch({ type: LOAD_PAYMENT_METHOD_REQUESTED });
    window.addEventListener('onpopstate', this.closeStripeCheckout);
    if ( !window.StripeCheckout ) {
      appendScriptToHead('https://checkout.stripe.com/checkout.js', this.onCheckoutScriptLoaded );
      return;
    }
    this.onCheckoutScriptLoaded();
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

  stripeDisconnect = () => {
    const result = confirm('Are you sure you want to disconnect from the platform?'); // eslint-disable-line no-alert
    if ( result ) {
      clientRequest('/api/stripe/disconnect', {
        method: 'POST',
      })
        .then(() => {
          this.props.dispatch({ type: LOAD_USER_REQUESTED });
        });
    }
  }

  render() {

    const { paymentMethod, user } = this.props;

    return (
      <div>
        <Typography type="title" color="primary" gutterBottom >
          {'Profile Actions'}
        </Typography>
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
        { user.connected &&
          <span>
            <Button raised disabled color="primary" style={{ marginRight: '10px' }}>
              { 'Connected' }
            </Button>
            <a href="/api/stripe/express-dashboard">
              <Button
                raised
                color="primary"
                style={{ marginRight: '10px' }}
              >
                { 'Visit Express Dashboard' }
              </Button>
            </a>
            <Button
              raised
              color="primary"
              style={{ marginRight: '10px' }}
              onClick={this.stripeDisconnect}
            >
              { 'Disconnect from Platform' }
            </Button>
          </span>
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
        { paymentMethod &&
          <span>
            <Typography type="subheading" color="primary" align="left" gutterBottom >
              Your card details:
            </Typography>
            <pre> {JSON.stringify(paymentMethod, null, 4)} </pre>
          </span>
        }
        <Button raised color="primary" style={{ marginRight: '10px' }} onClick={this.onUpdatePaymentMethod} >
          { paymentMethod ? 'Update Payment Method' : 'Add Payment Method' }
        </Button>
        <br /><br /><br />
        { user.connected &&
          <div>
            <Divider />
            <br />
            <MyMemberships />
          </div>
        }
        <Divider />
        <br />
        <MySubscriptions />
      </div>
    );
  }
}
export default ProfilePage;
