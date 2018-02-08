import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Form, Field } from 'react-final-form';

import styles from 'pages/ResetPassword/ResetPassword.scss';
import TextInput from 'components/TextInput/TextInput';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import Link from 'redux-first-router-link';

import {
  required as isRequired,
  composeValidators,
} from 'helpers/validators';

import {
  extractResetPasswordState,
} from 'redux/lost-password/reducer';
import {
  RESET_PASSWORD_REQUESTED,
} from 'redux/lost-password/actions';


@connect(
  ( globalState ) => ({
    resetPassword: extractResetPasswordState(globalState),
  })
)
class ResetPassword extends Component {
  static propTypes = {
    resetPassword: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
  };

  submitForm = ( values ) => {
    const sessionToken = ( window.location.search
      ? window.location.search.split('sessionToken=')[1].split('&')[0]
      : ''
    );
    const payloadWithToken = {
      ...values,
      sessionToken,
    };
    this.props.dispatch({ type: RESET_PASSWORD_REQUESTED, payload: payloadWithToken });
  }

  render() {
    const {
      resetPassword: { loading, error, succcess },
    } = this.props;

    return (
      <div className={styles.formWrap}>
        { succcess &&
          <Typography type="headline" align="center" gutterBottom >
            Your password was updated.
            <br /><br />
            <Link to="/login">Click here to log in.</Link>
          </Typography>
        }
        { !succcess &&
          <Form
            onSubmit={ this.submitForm }
          >
            {({ handleSubmit }) => (
              <form
                onSubmit={ handleSubmit }
                autoComplete="off"
                data-test="loginForm"
              >
                <Typography type="headline" align="center" gutterBottom >
                  Reset Password
                </Typography>
                <br />
                <Typography type="body1" align="center" gutterBottom >
                  Enter your new password below to reset your password.
                </Typography>
                { error &&
                  <div>
                    <br />
                    <Typography
                      color="error"
                      type="subheading"
                      align="center"
                      gutterBottom
                    >
                      {error}
                    </Typography>
                  </div>
                }
                <Field
                  name="password"
                  validate={composeValidators(isRequired)}
                  component={TextInput}
                  className={styles.textField}
                  label="new password"
                  type="password"
                  margin="normal"
                />
                <Field
                  name="passwordConfirm"
                  validate={composeValidators(isRequired)}
                  component={TextInput}
                  className={styles.textField}
                  label="new password confirmation"
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
                  data-test="submit"
                >
                  { loading ? 'Submitting...' : 'Submit' }
                </Button>
              </form>
            )}
          </Form>
        }
      </div>
    );
  }

}
export default ResetPassword;
