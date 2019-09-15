import base64UrlDecode from './decode';

class InvalidTokenError extends Error {
  constructor(message: string) {
    super();
    this.message = message;
  }
}

const decode = (token: string, options = <any>{}) => {
  if (typeof token !== 'string') {
    throw new InvalidTokenError('Invalid token specified');
  }

  const pos = options.header === true ? 0 : 1;
  try {
    return JSON.parse(base64UrlDecode(token.split('.')[pos]));
  } catch (e) {
    throw new InvalidTokenError(`Invalid token specified: ${e.message}`);
  }
};

export { decode };
