import React from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';
import MenuItem from 'material-ui/Menu/MenuItem';
import {
  showErrorOnSubmit,
} from 'helpers/form';


const SelectInput = ({
  input,
  meta,
  options,
  showError = showErrorOnSubmit,
  ...rest
}) => {
  const errorVisible = showError(meta);
  return (
    <TextField
      { ...input }
      { ...rest }
      select
      onChange={(event) => input.onChange(event.target.value)}
      value={input.value}
      error={errorVisible}
      helperText={errorVisible ? meta.error : ( rest.helperText || '' )}
    >
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  );
};
SelectInput.propTypes = {
  input: PropTypes.object.isRequired,
  meta: PropTypes.object.isRequired,
  options: PropTypes.array.isRequired,
};

export default SelectInput;
