export function showErrorOnBlur( meta ) {
  return Boolean(meta.touched && meta.error);
}

export function showErrorOnSubmit( meta ) {
  return Boolean(meta.submitFailed && meta.touched && meta.error);
}
