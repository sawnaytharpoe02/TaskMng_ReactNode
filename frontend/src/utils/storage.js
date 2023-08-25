const token_ = 'employee_token';
const employee_ = 'employee_data';

export const setToken = (value) => {
  localStorage.setItem(`${token_}`, value);
};

export const setUser = (value) => {
  const jsonString = JSON.stringify(value);
  localStorage.setItem(`${employee_}`, jsonString);
};

export const getToken = () => {
  return localStorage.getItem(`${token_}`);
};

export const getUser = () => {
  const userString = localStorage.getItem(`${employee_}`);
  if (userString) {
    return JSON.parse(userString);
  }
  return null;
};

export const removeToken = () => {
  localStorage.removeItem(`${token_}`);
};

export const removeUser = () => {
  localStorage.removeItem(`${employee_}`);
};
