import * as SecureStore from "expo-secure-store";

const SESSION_TOKEN_KEY = "app_session_token";
const SESSION_EXPIRES_KEY = "app_session_expires";

export const getSessionToken = () => SecureStore.getItemAsync(SESSION_TOKEN_KEY);
export const setSessionToken = (token: string) => SecureStore.setItemAsync(SESSION_TOKEN_KEY, token);
export const deleteSessionToken = () => SecureStore.deleteItemAsync(SESSION_TOKEN_KEY);

export const getSessionExpires = () => SecureStore.getItemAsync(SESSION_EXPIRES_KEY);
export const setSessionExpires = (expires: string) => SecureStore.setItemAsync(SESSION_EXPIRES_KEY, expires);
export const deleteSessionExpires = () => SecureStore.deleteItemAsync(SESSION_EXPIRES_KEY);

export const clearSession = async () => {
  await deleteSessionToken();
  await deleteSessionExpires();
};

export const isSessionValid = async (): Promise<boolean> => {
  const expires = await getSessionExpires();
  if (!expires) return false;
  
  const expiryDate = new Date(expires);
  return expiryDate > new Date();
};
