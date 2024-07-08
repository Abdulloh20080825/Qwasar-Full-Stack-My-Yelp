import { isValidEmail } from "./validateEmail";

export const validationRegister = ({ name, email, password, setError }) => {
  if (name.trim() === "") {
    setError("Name is required !!!");
    return;
  }
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
