import axios from 'axios';

const API_KEY = '580799';
const BASE_URL = 'https://www.thesportsdb.com/api/v1/json';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000
});

// Configuration des retries
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

export const fetchWithRetry = async (endpoint: string, retries = MAX_RETRIES): Promise<any> => {
  try {
    const response = await api.get(`/${API_KEY}${endpoint}`);
    return response.data;
  } catch (error) {
    if (retries > 0 && isRetryableError(error)) {
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * (MAX_RETRIES - retries + 1)));
      return fetchWithRetry(endpoint, retries - 1);
    }
    throw error;
  }
};

const isRetryableError = (error: any): boolean => {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    return !status || status >= 500 || status === 429;
  }
  return true;
};

export const isNetworkError = (error: any): boolean => {
  return axios.isAxiosError(error) && !error.response;
};

export const formatApiError = (error: any): string => {
  if (isNetworkError(error)) {
    return 'Erreur de connexion. Veuillez vérifier votre connexion internet.';
  }
  
  if (axios.isAxiosError(error) && error.response) {
    switch (error.response.status) {
      case 404:
        return 'Ressource non trouvée.';
      case 429:
        return 'Trop de requêtes. Veuillez réessayer dans quelques minutes.';
      case 500:
      case 502:
      case 503:
      case 504:
        return 'Le service est temporairement indisponible.';
      default:
        return 'Une erreur est survenue. Veuillez réessayer plus tard.';
    }
  }
  
  return 'Une erreur inattendue est survenue.';
};