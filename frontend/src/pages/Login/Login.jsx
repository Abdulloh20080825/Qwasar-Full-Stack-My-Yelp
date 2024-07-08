import { useState } from "react";
import "../../styles/signup.css";
import { validationLogin } from "../../constants/validationLogin";
import axiosInstance from "../../utils/axiosApi";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const loginHandler = async (e) => {
    e.preventDefault();

    validationLogin({ email, password, setError });

    // Login API

    try {
      const response = await axiosInstance.post("/login", {
        email,
        password,
      });

      if (response.data.error) {
        setError(response.data.message);
      } else {
        localStorage.setItem("token", response.data.accessToken);
        navigate("/");
      }
    } catch (error) {
      setError("Login error. Please try again.");
      console.log(error);
    }
  };

  return (
    <div className="signup">
      <main className="form-signin w-75 m-auto">
        <form>
          <h1 className="h3 mb-3 fw-normal">Login to Yelp</h1>
          {error && <p className="text-danger">{error}</p>}
          <div className="form-floating">
            <input
              type="email"
              className="form-control my-3"
              name="email"
              id="floatingInput"
              placeholder="user@gmail.com"
              autoComplete="off"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label htmlFor="floatingInput">Email</label>
          </div>
          <div className="form-floating">
            <input
              type="password"
              className="form-control my-3"
              name="password"
              id="floatingInput"
              autoComplete="off"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label htmlFor="floatingInput">Password</label>
          </div>
          <p className="text-dark">
            Don't have an account?{" "}
            <a href="/register" className="text-primary text-decoration-none">
              Register
            </a>
          </p>
          <button
            className="btn btn-primary w-100 py-2 my-3"
            type="submit"
            onClick={loginHandler}
          >
            Login
          </button>
        </form>
      </main>
    </div>
  );
};

export default Login;
