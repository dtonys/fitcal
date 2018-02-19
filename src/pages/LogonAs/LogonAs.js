import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Form, Field } from 'react-final-form';
import { redirect } from 'redux-first-router';
import lodashGet from 'lodash/get';

import styles from 'pages/LogonAs/LogonAs.scss';
import TextInput from 'components/TextInput/TextInput';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import { clientRequest } from 'helpers/request';

import {
  ROUTE_SCHEDULE,
} from 'redux/routesMap';

import {
  required as isRequired,
  email as isEmail,
  minLength as isMinLength,
  composeValidators,
} from 'helpers/validators';


@connect()
class LogonAsPage extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
  };

  constructor( props ) {
    super( props );
    this.state = {
      serverError: null,
      loading: false,
    };
  }

  submitForm = ( values ) => {
    this.setState({
      loading: true,
    });
    clientRequest('/api/logonas', {
      method: 'POST',
      body: values,
    })
      .then(() => {
        window.location.href = '/schedule';
      })
      .catch(( error ) => {
        const message = lodashGet( error, 'error.message' );
        this.setState({
          serverError: message,
          loading: false,
        });
      });
  }

  render() {
    const { loading, serverError } = this.state;

    return (
      <div className={styles.formWrap}>
        <Form
          onSubmit={ this.submitForm }
        >
          {({ handleSubmit }) => (
            <form
              onSubmit={ handleSubmit }
              autoComplete="off"
            >
              <Typography type="headline" align="center" gutterBottom >
                LogonAs
              </Typography>
              { serverError &&
                <div>
                  <br />
                  <Typography
                    color="error"
                    type="subheading"
                    align="center"
                    gutterBottom
                    data-test="serverError"
                  >
                    {serverError}
                  </Typography>
                </div>
              }
              <Field
                name="email"
                validate={composeValidators(isRequired, isEmail)}
                component={TextInput}
                className={styles.textField}
                label="user email"
                type="text"
                margin="normal"
                fullWidth
              />
              <Field
                name="adminEmail"
                validate={composeValidators(isRequired, isEmail)}
                component={TextInput}
                className={styles.textField}
                label="admin email"
                type="text"
                margin="normal"
                fullWidth
              />
              <Field
                name="adminPassword"
                validate={composeValidators(isRequired, isMinLength(3))}
                component={TextInput}
                className={styles.textField}
                label="admin password"
                type="password"
                margin="normal"
                fullWidth
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
            </form>
          )}
        </Form>
      </div>
    );
  }
}
export default LogonAsPage;
