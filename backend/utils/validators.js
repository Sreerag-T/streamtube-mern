// Lightweight, dependency-free field validation shared across routes
export const isValidEmail = (email) => /^\S+@\S+\.\S+$/.test(email);

export const validateRegisterInput = ({ username, email, password }) => {
  const errors = {};

  if (!username || username.trim().length < 3) {
    errors.username = "Username must be at least 3 characters";
  }
  if (!email || !isValidEmail(email)) {
    errors.email = "Please provide a valid email address";
  }
  if (!password || password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }

  return { isValid: Object.keys(errors).length === 0, errors };
};

export const validateLoginInput = ({ email, password }) => {
  const errors = {};
  if (!email || !isValidEmail(email)) errors.email = "Please provide a valid email address";
  if (!password) errors.password = "Password is required";
  return { isValid: Object.keys(errors).length === 0, errors };
};
