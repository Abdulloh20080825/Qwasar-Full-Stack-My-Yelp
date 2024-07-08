import { isValidEmail } from "./validateEmail";

export const validationLogin = ({ email, password, setError }) => {
  if (email.trim() === "") {
    setError("Email is required !!!");
    return;
  }
  if (!isValidEmail(email)) {
    setError("Please enter a valid email");
    return;
  } 
  if (password.trim() === "") {
    setError("Password is required !!!");
    return;
  }
  setError("");
};
