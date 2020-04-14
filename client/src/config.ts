declare global {
  interface Window { env: any; }
}

window.env = window.env || {};

const settings = {
  AUTH0_DOMAIN: window.env.AUTH0_DOMAIN,
  AUTH0_CLIENT_ID: window.env.AUTH0_CLIENT_ID,
  CLIENT_ADDRESS: window.env.CLIENT_ADDRESS,
  GRAPHQL_HOST: window.env.GRAPHQL_HOST,
  FILES_ENDPOINT: window.env.FILES_ENDPOINT,
  FACEBOOK_APP_ID: window.env.FACEBOOK_APP_ID,
  GA_TRACKING_ID: window.env.GA_TRACKING_ID,
  RECAPTCHA_SITE_KEY: window.env.RECAPTCHA_SITE_KEY
};

export default settings;
