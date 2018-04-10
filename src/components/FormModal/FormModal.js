import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { Form, Field } from 'react-final-form';
import Dialog, {
  DialogActions,
  DialogContent,
  // DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';
import Button from 'material-ui/Button';


@connect()
class FormModal extends Component {
  static propTypes = {
    modalContext: PropTypes.string,
    open: PropTypes.bool.isRequired,
    close: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    fields: PropTypes.array.isRequired,
    submitActionType: PropTypes.string.isRequired,
    convertFormValuesToApiFormat: PropTypes.func,
    showMap: PropTypes.object,
    initialValues: PropTypes.object,
    disabledOnEditFields: PropTypes.array,
    dispatch: PropTypes.func.isRequired,
  }
  static defaultProps = {
    modalContext: null,
    convertFormValuesToApiFormat: null,
    showMap: {},
    initialValues: null,
    disabledOnEditFields: null,
  }

  submitForm = ( values ) => {
    const {
      dispatch,
      close,
      submitActionType,
      convertFormValuesToApiFormat,
    } = this.props;
    let apiValues = values;
    if ( convertFormValuesToApiFormat ) {
      apiValues = convertFormValuesToApiFormat(values);
    }
    dispatch({ type: submitActionType, payload: apiValues });
    close();
  }

  render() {
    const {
      modalContext,
      open,
      close,
      title,
      fields,
      showMap,
      initialValues,
      disabledOnEditFields,
    } = this.props;

    return (
      <Dialog
        open={open}
        onClose={close}
      >
        <Form
          onSubmit={ this.submitForm }
          initialValues={initialValues}
        >
          {({ handleSubmit, values }) => {
            // clear conditional field values
            Object.keys(showMap).forEach(( conditionalField ) => {
              if ( values[conditionalField] && !showMap[conditionalField](values) ) {
                delete values[conditionalField];
              }
            });
            return (
              <form
                onSubmit={ handleSubmit }
                autoComplete="off"
                data-test="loginForm"
              >
                <DialogTitle id="form-dialog-title">{title}</DialogTitle>
                <DialogContent>
                  { fields.map(( field ) => {
                    // handle conditional field render
                    if ( showMap[field.name] && !showMap[field.name](values) ) {
                      return null;
                    }
                    let fieldDisabled = false;
                    // fields disabled on edit
                    if (
                      modalContext === 'edit' &&
                      disabledOnEditFields.indexOf(field.name) !== -1
                    ) {
                      fieldDisabled = true;
                    }

                    return (
                      <Field
                        {...field}
                        key={field.name}
                        id={field.name}
                        label={field.label || field.name}
                        disabled={fieldDisabled}
                      />
                    );
                  }) }
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
            );
          }}
        </Form>
      </Dialog>
    );
  }
}

export default FormModal;
