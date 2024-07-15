const LOCAL_URL = 'http://10.0.2.2:5001';
const PRODUCTION_URL = 'https://your-production-url.com';

const getApiUrl = () => {
  if (__DEV__) {
    return LOCAL_URL;
  } else {
    return PRODUCTION_URL;
  }
};

export default {
  API_URL: getApiUrl(),
};