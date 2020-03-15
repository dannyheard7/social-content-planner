declare global {
  interface Window { env: any; }
}

window.env = window.env || {};

const settings = {
  AUTH0_DOMAIN: window.env.AUTH0_DOMAIN,
  AUTH0_CLIENT_ID: window.env.AUTH0_CLIENT_ID,
  CLIENT_ADDRESS: window.env.CLIENT_ADDRESS,
  GRAPHQL_HOST: window.env.GRAPHQL_HOST,
  FILE_UPLOAD_ENDPOINT: window.env.FILE_UPLOAD_ENDPOINT,
  FACEBOOK_APP_ID: window.env.FACEBOOK_APP_ID,
};

export default settings;
