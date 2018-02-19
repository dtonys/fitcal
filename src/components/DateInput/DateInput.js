import React, { Component } from 'react';
import PropTypes from 'prop-types';

import TextField from 'material-ui/TextField';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
  showErrorOnSubmit,
} from 'helpers/form';


class DateTextField extends Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    value: PropTypes.string,
    onClick: PropTypes.func,
    name: PropTypes.string,
    input: PropTypes.object,
    meta: PropTypes.object,
  }
  static defaultProps = {
    value: null,
    onClick: null,
    name: null,
    input: null,
    meta: null,
  }

  render() {
    const {
      value,
      onClick,
      name,
      // input,
      meta,
    } = this.props;
    const showError = showErrorOnSubmit(meta);
    return (
      <TextField
        onFocus={ onClick }
        onClick={ onClick }
        label={name}
        value={value}
        type="text"
        fullWidth
        error={showError}
        helperText={showError ? meta.error : '' }
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
      date: props.input.value || null,
    };
  }

  handleChange = (date) => {
    this.setState({ date });
    this.props.input.onChange( date );
  }

  render() {
    const {
      input,
      meta,
      style,
    } = this.props;
    const { date } = this.state;

    return (
      <div style={style}>
        <DatePicker
          name={input.name}
          customInput={
            <DateTextField
              input={input}
              meta={meta}
            />
          }
          selected={date}
          onChange={this.handleChange}
          dateFormat="LLL"
          showTimeSelect

        />
      </div>
    );
  }
}

export default DateInput;
