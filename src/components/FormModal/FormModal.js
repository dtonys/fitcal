import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Form, Field } from 'react-final-form';
import Dialog, {
  DialogActions,
  DialogContent,
  // DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';
import Button from 'material-ui/Button';


class FormModal extends Component {
  static propTypes = {
    open: PropTypes.bool.isRequired,
    close: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    fields: PropTypes.array.isRequired,
  }

  submitForm = ( values ) => {
    alert( JSON.stringify(values, null, 4) );
    // dispatch create event
    this.props.close();
  }

  render() {
    const {
      open,
      close,
      title,
      fields,
    } = this.props;

    return (
      <Dialog
        open={open}
        onClose={close}
      >
        <Form
          onSubmit={ this.submitForm }
        >
          {({ handleSubmit }) => (
            <form
              onSubmit={ handleSubmit }
              autoComplete="off"
              data-test="loginForm"
            >
              <DialogTitle id="form-dialog-title">{title}</DialogTitle>
              <DialogContent>
                { fields.map(( field ) => (
                  <Field
                    {...field}
                    key={field.name}
                    id={field.name}
                    label={field.name}
                  />
                )) }
              </DialogContent>
              <DialogActions>
                <Button onClick={close} color="primary">
                  Cancel
                </Button>
                <Button type="submit" color="primary">
                  Submit
                </Button>
              </DialogActions>
            </form>
          )}
        </Form>
      </Dialog>
    );
  }
}

export default FormModal;
