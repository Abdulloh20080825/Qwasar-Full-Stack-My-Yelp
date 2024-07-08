import React, { useState } from "react";
import { validationRegister } from "../../constants/validationRegister";
import axiosInstance from "../../utils/axiosApi";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const registerHandler = async (e) => {
    e.preventDefault();
    validationRegister({ name, email, password, setError });

    try {
      const response = await axiosInstance.post("/create-accaunt", {
        username: name,
        email: email,
        password: password,
      });
      if (response.data && response.data.error) {
        setError(response.data.message);
        return;
      }
      localStorage.setItem("token", response.data.accessToken);
      navigate("/");
    } catch (error) {
      console.log(error);
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      }
      setError("Something went wrong. Pleace try againg");
    }
  };

  // Register API

  return (
    <div className="signup">
      <main className="form-signin w-75 m-auto">
        <form>
          <h1 className="h3 mb-3 fw-normal">Register to Yelp</h1>
          <p className="text-danger">{error}</p>
          <div className="form-floating">
            <input
              type="text"
              className="form-control my-3"
              value={name}
              name="username"
              id="floatingInput"
              autoComplete="off"
              placeholder="username"
              onChange={(e) => setName(e.target.value)}
            />
            <label htmlFor="floatingInput">Username</label>
          </div>
          <div className="form-floating">
            <input
              type="email"
              className="form-control my-3"
              value={email}
              name="email"
              autoComplete="off"
              id="floatingInput"
              placeholder="user@gmail.com"
              onChange={(e) => setEmail(e.target.value)}
            />
            <label htmlFor="floatingInput">Email</label>
          </div>
          <div className="form-floating">
            <input
              type="password"
              className="form-control my-3"
              value={password}
              name="password"
              id="floatingInput"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <label htmlFor="floatingInput">Password</label>
          </div>
          <p className="text-dark">
            Already have a accaunt ?{" "}
            <a href="/login" className="text-primary text-decoration-none">
              Login
            </a>
          </p>
          <button
            className="btn btn-primary w-100 py-2 my-3"
            type="submit"
            onClick={registerHandler}
          >
            Register
          </button>
        </form>
      </main>
    </div>
  );
};

export default Register;
