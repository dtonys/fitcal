import lodashGet from 'lodash/get';
import querystring from 'querystring';


function getPath( req, url, query ) {
  const queryString = query ? ('?' + querystring.stringify(query)) : '';
  // NOTE: Use full url if it starts with http
  if ( /http/.test(url) ) {
    return url + queryString;
  }
  const basePath = req ? (`${req.protocol}://${req.get('host')}`) : '';
  return basePath + url + queryString;
}

// Make one-off browser side requests
export const clientRequest = ( url, options = {}) => {
  const defaults = {
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
    },
  };
  if ( options.body && typeof options.body === 'object' ) {
    options.body = JSON.stringify(options.body);
  }

  return new Promise((resolve, reject) => {
    fetch(url, {
      ...defaults,
      ...options,
    })
      .then(( response ) => {
        return response.json()
          .then(( body ) => {
            if ( response.ok ) {
              resolve(body);
            }
            return Promise.reject({
              ...body,
              status: response.status,
            });
          });
      });
  });

};

// Isomorphic requests
const makeRequest = (req) => (url, options = {}) => {
  const path = getPath(req, url, options.query);
  const fetchOptions = {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  };
  if ( options.body && typeof options.body === 'object' ) {
    fetchOptions.body = JSON.stringify(options.body);
  }
  if ( req && lodashGet(req, 'headers.cookie') ) {
    fetchOptions.headers['cookie'] = req.headers.cookie;
  }

  return fetch(path, fetchOptions)
    .then((response) => {
      return response.json()
        .then(( body ) => {
          if ( response.ok ) {
            return body;
          }
          return Promise.reject({
            ...body,
            status: response.status,
          });
        });
    })
    .catch((error) => {
      return Promise.reject(error);
    });
};

export default makeRequest;

