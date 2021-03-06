import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Form, Field } from 'react-final-form';

import styles from 'pages/Login/Login.scss';
import TextInput from 'components/TextInput/TextInput';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import Link from 'redux-first-router-link';

import {
  required as isRequired,
  email as isEmail,
  minLength as isMinLength,
  composeValidators,
} from 'helpers/validators';

import {
  LOGIN_REQUESTED,
} from 'redux/user/actions';
import {
  extractLoginState,
} from 'redux/user/reducer';


@connect(
  ( globalState ) => ({
    login: extractLoginState(globalState),
  }),
)
class LoginPage extends Component {
  static propTypes = {
    login: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
  };

  submitForm = ( values ) => {
    this.props.dispatch({ type: LOGIN_REQUESTED, payload: values });
  }

  render() {
    const {
      login: { error, loading },
    } = this.props;

    return (
      <div className={styles.formWrap}>
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
                Login
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
                disabled={loading}
                data-test="submit"
                onClick={this.btnClick}
              >
                { loading ? 'Submitting...' : 'Submit' }
              </Button>
              <br />
              <br />
              <Link to="/lost-password">
                <Typography
                  type="body1"
                  align="left"
                >
                  Forgot Password?
                </Typography>
              </Link>
              <br />
              <Link to="/signup">
                <Typography
                  type="body1"
                  align="left"
                >
                  {'Don\'t have an account? Sign up to get access.'}
                </Typography>
              </Link>
            </form>
          )}
        </Form>
      </div>
    );
  }
}

export default LoginPage;
