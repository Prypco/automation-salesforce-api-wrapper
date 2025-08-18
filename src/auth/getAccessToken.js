import axios from 'axios';
import { BASE_URL, CLIENT_ID, CLIENT_SECRET, USERNAME, PASSWORD, GRANT_TYPE } from '../config.js';
import { logError } from '../utils/logger.js';

let cachedToken = null;
let tokenExpiry = null; 

export const getAccessToken = async () => {
  const now = Date.now();

  if (cachedToken && tokenExpiry && now < tokenExpiry) {
    return cachedToken;
  }
  
  let formDataJson = {};

  if(GRANT_TYPE === 'password') {
    formDataJson = {
      grant_type: 'password',
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      username: USERNAME,
      password: PASSWORD,
    }
  }
  else if(GRANT_TYPE === 'client_credentials') {
    formDataJson = {
      grant_type: 'client_credentials',
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
    }
  }

  const url = `${BASE_URL}/oauth2/token`;
  const formData = new URLSearchParams(formDataJson);

  try {
    const { data } = await axios.post(url, formData);
    console.log("🔑 Salesforce access token retrieved successfully");

    cachedToken = data.access_token;
    tokenExpiry = now + (data.expires_in || 3600) * 1000; // 1 hour default
    return cachedToken;
  } catch (error) {
    const errData = error.response?.data || error.message;
    logError(error, url, {}, 'Retrieving Salesforce access token');
    console.error("❌ Failed to retrieve access token", errData);
    throw new Error(`Failed to retrieve access token: ${errData?.error_description || 'Unknown error'}`);
  }
};
