export function showErrorOnBlur( meta ) {
  return Boolean(meta.touched && meta.error);
}

export function showErrorOnSubmit( meta ) {
  return Boolean(meta.submitFailed && meta.touched && meta.error);
}

const DOLLARS_KEY = 'price_dollars';
const CENTS_KEY = 'price_cents';

// Convert dollars to cents. Add cents key, delete dollars key.  Returns updated values.
export function dollarsToCents( formValues ) {
  if ( !formValues[DOLLARS_KEY] ) return formValues;
  const updatedFormValues = {
    ...formValues,
  };
  updatedFormValues[CENTS_KEY] = ( formValues[DOLLARS_KEY]
    ? formValues[DOLLARS_KEY] + '00'
    : '0'
  );
  delete updatedFormValues[DOLLARS_KEY];
  return updatedFormValues;
}

// Convert all date typed objects to string.  Returns updated values.
export function datesToISOString( formValues ) {
  const updatedFormValues = {
    ...formValues,
  };
  Object.keys(formValues).forEach(( key ) => {
    const value = formValues[key];
    if ( Object.prototype.toString.call(value) === '[object Date]') {
      updatedFormValues[key] = formValues[key].toISOString();
    }
  });
  return updatedFormValues;
}

// Convert from values to their proper API format,
// Pass in list of converters to act on the form values object.
export function convertFormValuesToApiFormat(
  formValues,
  formConverters = [ dollarsToCents, datesToISOString ]
) {
  const convertedValues = formConverters.reduce( (updatedValues, converter) => {
    return converter( updatedValues );
  }, formValues);
  return convertedValues;
}
