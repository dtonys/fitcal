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
  showErrorOnBlur,
  showErrorOnSubmit,
} from 'helpers/form';
import {
  SIGNUP_REQUESTED,
} from 'redux/user/actions';
import {
  extractSignupState,
} from 'redux/user/reducer';


async function checkAvailableUsername( value ) {
  const error = composeValidators(isRequired, isMinLength(3))(value);
  if ( error ) return error;
  const response = await fetch('/api/username/' + encodeURIComponent(value) + '/available');
  const { data: available } = await response.json();
  if ( !available ) {
    return 'Username not available';
  }
  return undefined;
}

async function checkAvailableEmail( value ) {
  const error = composeValidators(isRequired, isEmail)(value);
  if ( error ) return error;
  const response = await fetch('/api/email/' + encodeURIComponent(value) + '/available');
  const { data: available } = await response.json();
  if ( !available ) {
    return 'Email not available';
  }
  return undefined;
}


const InfoView = ({
  submitForm,
  error,
  loading,
}) => (
  <Form
    onSubmit={ submitForm }
    validateOnBlur
  >
    {({ handleSubmit }) => (
      <form
        onSubmit={handleSubmit}
        autoComplete="off"
        data-test="signupForm"
      >
        <Typography type="headline" align="center" gutterBottom >
          Sign up
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
          validate={isRequired}
          className={styles.textField}
          label="first name"
          type="text"
          margin="normal"
        />
        <Field
          name="last_name"
          component={TextInput}
          validate={isRequired}
          className={styles.textField}
          label="last name"
          type="text"
          margin="normal"
        />
        <Field
          name="username"
          component={TextInput}
          validate={checkAvailableUsername}
          className={styles.textField}
          label="username"
          type="text"
          margin="normal"
          showError={showErrorOnBlur}
        />
        <Field
          name="phone"
          validate={isRequired}
          component={TextInput}
          className={styles.textField}
          label="phone"
          type="text"
          margin="normal"
        />
        <Field
          name="email"
          validate={checkAvailableEmail}
          component={TextInput}
          className={styles.textField}
          label="email"
          type="text"
          margin="normal"
          showError={showErrorOnBlur}
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
          disabled={loading}
        >
          { loading ? 'Submitting...' : 'Submit' }
        </Button>
      </form>
    )}
  </Form>
);
InfoView.propTypes = {
  submitForm: PropTypes.func.isRequired,
  error: PropTypes.string,
  loading: PropTypes.bool.isRequired,
};
InfoView.defaultProps = {
  error: null,
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

  submitPayment = ( values ) => {
    this.props.dispatch({ type: SIGNUP_REQUESTED, payload: values });
  }

  render() {
    const {
      signup: { error, loading, success },
    } = this.props;

    return (
      <div className={styles.formWrap}>
        { !success &&
          <InfoView
            submitForm={this.submitPayment}
            error={error}
            loading={loading}
          />
        }
        { success &&
          <Typography
            type="subheading"
            color="inherit"
            className={styles.middleContent}
            align="center"
          >
            We sent you a link to verify your account.
            <br /> <br /> Please check your email to activate your account.
          </Typography>
        }
      </div>
    );
  }
}

export default SignupPage;
