const LOCAL_URL = 'http://20.108.65.118:5001';
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