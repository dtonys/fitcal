import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Form, Field } from 'react-final-form';

import styles from 'pages/Signup/Signup.scss';
import TextInput from 'components/TextInput/TextInput';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';

import {
  required as isRequired,
  email as isEmail,
  minLength as isMinLength,
  composeValidators,
} from 'helpers/validators';
import {
  SIGNUP_REQUESTED,
} from 'redux/user/actions';
import {
  extractSignupState,
} from 'redux/user/reducer';


const InfoView = ({
  submitForm,
  error,
}) => (
  <Form
    onSubmit={ submitForm }
  >
    {({ handleSubmit }) => (
      <form
        onSubmit={handleSubmit}
        autoComplete="off"
        data-test="signupForm"
      >
        <Typography type="headline" align="center" gutterBottom >
          Trainer sign up
        </Typography>
        { error &&
          <div>
            <br />
            <Typography
              color="error"
              type="subheading"
              align="center"
              gutterBottom
              data-test="serverError"
            >
              {error}
            </Typography>
          </div>
        }
        <Field
          name="first_name"
          component={TextInput}
          className={styles.textField}
          label="first name"
          type="text"
          margin="normal"
        />
        <Field
          name="last_name"
          component={TextInput}
          className={styles.textField}
          label="last name"
          type="text"
          margin="normal"
        />
        <Field
          name="username"
          component={TextInput}
          className={styles.textField}
          label="username"
          type="text"
          margin="normal"
        />
        <Field
          name="phone"
          validate={composeValidators(isRequired)}
          component={TextInput}
          className={styles.textField}
          label="phone"
          type="text"
          margin="normal"
        />
        <Field
          name="email"
          validate={composeValidators(isRequired, isEmail)}
          component={TextInput}
          className={styles.textField}
          label="email"
          type="text"
          margin="normal"
        />
        <Field
          name="password"
          validate={composeValidators(isRequired, isMinLength(3))}
          component={TextInput}
          className={styles.textField}
          label="password"
          type="password"
          margin="normal"
        />
        <br /><br /><br />
        <Button
          raised
          color="primary"
          fullWidth
          type="submit"
        >
          Next
        </Button>
      </form>
    )}
  </Form>
);
InfoView.propTypes = {
  submitForm: PropTypes.func.isRequired,
  error: PropTypes.string,
};
InfoView.defaultProps = {
  error: null,
};

const PaymentView = ({
  submitPayment,
  loading,
}) => (
  <div>
    <Typography type="body1" align="center" gutterBottom >
      Enter your payment details below
    </Typography>
    <Typography type="body1" align="center" gutterBottom >
      Price: 10$
    </Typography>
    <br />
    <Button
      raised
      color="primary"
      fullWidth
      type="submit"
      disabled={loading}
      onClick={() => { submitPayment(); }}
    >
      { loading ? 'Submitting...' : 'Pay' }
    </Button>
  </div>
);
PaymentView.propTypes = {
  submitPayment: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};

@connect(
  ( globalState ) => ({
    signup: extractSignupState(globalState),
  }),
)
class SignupPage extends Component {
  static propTypes = {
    signup: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
  };

  constructor( props ) {
    super(props);
    this.state = {
      step: 1,
      signupData: {},
    };
  }

  submitInfo = ( values ) => {
    this.setState({
      ...this.state,
      signupData: {
        ...this.state.signupData,
        ...values,
      },
      step: 2,
    });
  }

  submitPayment = ( paymentToken = 'mock_token' ) => {
    const apiValues = {
      ...this.state.signupData,
      paymentToken,
    };
    this.props.dispatch({ type: SIGNUP_REQUESTED, payload: apiValues });
  }

  render() {
    const { step } = this.state;
    const {
      signup: { error, loading },
    } = this.props;

    return (
      <div className={styles.formWrap}>
        { step === 1 &&
          <InfoView
            submitForm={this.submitInfo}
            error={error}
          />
        }
        { step === 2 &&
          <PaymentView
            submitPayment={this.submitPayment}
            loading={loading}
          />
        }
      </div>
    );
  }
}

export default SignupPage;
