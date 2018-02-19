import React from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';
import {
  showErrorOnSubmit,
} from 'helpers/form';


const TextInput = ({
  input,
  meta,
  showError = showErrorOnSubmit,
  ...rest
}) => {
  const errorVisible = showError(meta);
  return (
    <TextField
      { ...input }
      { ...rest }
      onChange={(event) => input.onChange(event.target.value)}
      value={input.value || ''}
      error={errorVisible}
      helperText={errorVisible ? meta.error : ( rest.helperText || '' )}
    />
  );
};
TextInput.propTypes = {
  input: PropTypes.object.isRequired,
  meta: PropTypes.object.isRequired,
};

export default TextInput;
