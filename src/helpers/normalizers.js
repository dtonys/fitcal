/**
 * 9999999 -> `9,999,999`
 */
export function commify( value ) {
  if (!value) {
    return value;
  }

  return value.toString().replace(/\B(?=([0-9]{3})+(?![0-9]))/g, ',');
}

export function number( value ) {
  if ( !value ) {
    return value;
  }

  return value.replace(/[^0-9]/g, '');
}

/**
 * 9999999 -> `$9,999,999`
 */
export function dollars( value ) {
  if ( typeof value === 'number' ) {
    value = value.toString();
  }
  if (!value) {
    return value;
  }

  let result = value;
  result = number( result );
  result = commify( result );

  if ( result ) {
    result = '$' + result;
  }
  return result;
}

/**
 * 9999999 -> 999999900
 */
export function dollarsToCents( value ) {
  let result = value;
  result = number( result );
  result += '0';
  return result;
}

export function centsToDollars( value ) {
  let result = value;
  result = number( result );
  result += '0';
  return result;
}

