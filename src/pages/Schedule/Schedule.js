import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import { connect } from 'react-redux';
import { Form, Field } from 'react-final-form';

import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';
import AddIcon from 'material-ui-icons/Add';
import styles from  'pages/Schedule/Schedule.scss';
import TextInput from 'components/TextInput/TextInput';
import TextField from 'material-ui/TextField';
import Dialog, {
  DialogActions,
  DialogContent,
  // DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';
// import Typography from 'material-ui/Typography';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
// import moment from 'moment';


class DateTextField extends Component {
  static propTypes = {
    value: PropTypes.string,
    onClick: PropTypes.func,
    name: PropTypes.string,
  }
  static defaultProps = {
    value: null,
    onClick: null,
    name: null,
  }

  render() {
    const {
      value,
      onClick,
      name,
    } = this.props;
    return (
      <TextField
        onFocus={ onClick }
        onClick={ onClick }
        label={name}
        value={value}
        type="text"
        fullWidth
      />
    );
  }
}

class DateInput extends Component {

  static propTypes = {
    date: PropTypes.object,
    input: PropTypes.object.isRequired,
    meta: PropTypes.object.isRequired,
    style: PropTypes.object,
  }
  static defaultProps = {
    date: null,
    style: {},
  }

  constructor( props ) {
    super(props);
    this.state = {
      date: props.date,
    };
  }

  handleChange = (date) => {
    this.setState({ date });
    this.props.input.onChange( date );
  }

  render() {
    const {
      input,
      style,
    } = this.props;
    const { date } = this.state;

    return (
      <div style={style}>
        <DatePicker
          name={input.name}
          customInput={<DateTextField />}
          selected={date}
          onChange={this.handleChange}
          dateFormat="LLL"
          showTimeSelect
        />
      </div>
    );
  }
}

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

const _6AM_6PM = [ 6, 7, 8, 9, 10, 11, 12, 1, 2, 3, 4, 5 ];
const _sun_sat = [ 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat' ];
const Calendar = () => (
  <div className={styles.schedule__wrap}>
    <div className={styles.hourAxis}>
      <div className={styles.hourUnit} > - </div>
      { _6AM_6PM.map((hour) => (
        <div key={hour} className={styles.hourUnit} style={{ paddingTop: '12px', paddingLeft: '5px' }} > {hour} </div>
      )) }
    </div>
    <Grid container>
      { _sun_sat.map((day) => (
        <Grid key={day} item xs >
          <div className={styles.hourUnit} >{day}</div>
          { _6AM_6PM.map((hour) => (
            <div key={day + hour} className={styles.hourUnit} >
              <Button
                variant="fab"
                fullWidth
                color="primary"
                style={{ height: '100%' }}
              >
                <AddIcon />
              </Button>
            </div>
          )) }
        </Grid>
      )) }
    </Grid>
  </div>
);

const commonProps = {
  margin: 'dense',
  fullWidth: true,
  style: { marginBottom: '10px' },
};
const fields = [
  {
    component: TextInput,
    name: 'name',
    type: 'text',
    ...commonProps,
  },
  {
    component: TextInput,
    name: 'location',
    type: 'text',
    ...commonProps,
  },
  {
    component: DateInput,
    name: 'start',
    type: 'text',
    ...commonProps,
  },
  {
    component: DateInput,
    name: 'end',
    type: 'text',
    ...commonProps,
  },
  {
    component: TextInput,
    name: 'repeats',
    type: 'text',
    ...commonProps,
  },
  {
    component: TextInput,
    name: 'capacity',
    type: 'text',
    ...commonProps,
  },
  {
    component: TextInput,
    name: 'price',
    type: 'text',
    ...commonProps,
  },
];

class SchedulePage extends Component {

  constructor( props ) {
    super(props);
    this.state = {
      createModalOpen: false,
    };
  }

  openCreateModal = () => {
    this.setState({
      createModalOpen: true,
    });
  }

  closeCreateModal = () => {
    this.setState({
      createModalOpen: false,
    });
  }

  render() {
    const { createModalOpen } = this.state;

    return (
      <div>
        <div> Actions: </div>
        <br />
        <Button
          className={styles.cta__button}
          raised
          color="primary"
          type="submit"
          data-test="submit"
          onClick={this.btnClick}
        >
          { 'Connect Stripe Account' }
        </Button>
        <Button
          className={styles.cta__button}
          raised
          color="primary"
          type="submit"
          data-test="submit"
          onClick={this.btnClick}
        >
          { 'Create membership' }
        </Button>
        <Button
          className={styles.cta__button}
          raised
          color="primary"
          type="submit"
          data-test="submit"
          onClick={this.openCreateModal}
        >
          { 'Create event' }
        </Button>
        <FormModal
          open={createModalOpen}
          close={this.closeCreateModal}
          title="Create Event"
          fields={fields}
        />
        <br /> <br />
        <div> Memberships: </div>
        <br /><br />
        <div>
          <div> My Schedule </div>
          <Calendar />
        </div>
      </div>
    );
  }
}
export default SchedulePage;
