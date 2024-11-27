const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'sportify2024';

export const login = (username: string, password: string): boolean => {
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    localStorage.setItem('auth_token', 'admin_authenticated');
    return true;
  }
  return false;
};

export const logout = () => {
  localStorage.removeItem('auth_token');
};

export const isAuthenticated = (): boolean => {
  return localStorage.getItem('auth_token') === 'admin_authenticated';
};
