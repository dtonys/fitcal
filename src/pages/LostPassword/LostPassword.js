import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Form, Field } from 'react-final-form';

import styles from 'pages/LostPassword/LostPassword.scss';
import TextInput from 'components/TextInput/TextInput';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';

import {
  extractLostPasswordState,
} from 'redux/lost-password/reducer';

import {
  LOST_PASSWORD_REQUESTED,
} from 'redux/lost-password/actions';

import {
  required as isRequired,
  email as isEmail,
  composeValidators,
} from 'helpers/validators';


@connect(
  ( globalState ) => ({
    lostPassword: extractLostPasswordState(globalState),
  })
)
class LostPassword extends Component {
  static propTypes = {
    lostPassword: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
  };

  submitForm = ( values ) => {
    this.props.dispatch({ type: LOST_PASSWORD_REQUESTED, payload: values });
  }

  render() {
    const {
      lostPassword: { loading, error, succcess },
    } = this.props;

    return (
      <div className={styles.formWrap}>
        { succcess &&
          <Typography type="headline" align="center" gutterBottom >
            Link sent! Please check your email to reset your password.
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
                  Lost Password
                </Typography>
                <br />
                <Typography type="body1" align="center" gutterBottom >
                  Enter your email below and we will send you a link to reset your password.
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
                  name="email"
                  validate={composeValidators(isRequired, isEmail)}
                  component={TextInput}
                  className={styles.textField}
                  label="email"
                  type="text"
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
export default LostPassword;
