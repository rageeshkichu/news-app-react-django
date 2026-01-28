const TOKEN_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_ID: 'user_id',
  IS_SUPERUSER: 'is_superuser',
  USERNAME: 'username'
};

export const saveTokens = (accessToken, refreshToken, userId, isSuperuser, username) => {
  try {
    localStorage.setItem(TOKEN_KEYS.ACCESS_TOKEN, accessToken);
    localStorage.setItem(TOKEN_KEYS.REFRESH_TOKEN, refreshToken);
    localStorage.setItem(TOKEN_KEYS.USER_ID, userId);
    localStorage.setItem(TOKEN_KEYS.IS_SUPERUSER, isSuperuser);
    localStorage.setItem(TOKEN_KEYS.USERNAME, username);
    return true;
  } catch (error) {
    console.error('Error saving tokens:', error);
    return false;
  }
};

export const getAccessToken = () => localStorage.getItem(TOKEN_KEYS.ACCESS_TOKEN);

export const getRefreshToken = () => localStorage.getItem(TOKEN_KEYS.REFRESH_TOKEN);

export const getUserId = () => localStorage.getItem(TOKEN_KEYS.USER_ID);

export const getIsSuperuser = () => localStorage.getItem(TOKEN_KEYS.IS_SUPERUSER) === 'true';

export const getUsername = () => localStorage.getItem(TOKEN_KEYS.USERNAME);

export const isAuthenticated = () => {
  const accessToken = getAccessToken();
  const refreshToken = getRefreshToken();
  return !!(accessToken && refreshToken);
};

export const clearTokens = () => {
  try {
    localStorage.removeItem(TOKEN_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(TOKEN_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(TOKEN_KEYS.USER_ID);
    localStorage.removeItem(TOKEN_KEYS.IS_SUPERUSER);
    localStorage.removeItem(TOKEN_KEYS.USERNAME);
    return true;
  } catch (error) {
    console.error('Error clearing tokens:', error);
    return false;
  }
};

export const updateAccessToken = (accessToken) => {
  try {
    localStorage.setItem(TOKEN_KEYS.ACCESS_TOKEN, accessToken);
    return true;
  } catch (error) {
    console.error('Error updating access token:', error);
    return false;
  }
};

export const getUserData = () => {
  return {
    userId: getUserId(),
    isSuperuser: getIsSuperuser(),
    username: getUsername(),
    isAuthenticated: isAuthenticated()
  };
};
