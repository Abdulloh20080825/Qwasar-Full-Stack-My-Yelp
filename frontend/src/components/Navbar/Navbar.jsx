import React from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const onLogout = () => {
    localStorage.clear();
    navigate("/login");
  };
  return (
    <div className="d-flex flex-column flex-md-row align-items-center pb-3 mb-4 border-bottom p-3">
      <a
        href="/"
        className="d-flex align-items-center link-body-emphasis text-decoration-none"
      >
        <span className="fs-4">Yelp</span>
      </a>

      <nav className="d-inline-flex mt-2 mt-md-0 ms-md-auto">
        <button
          className="btn  me-3 py-2 link-body-emphasis text-decoration-none"
          onClick={onLogout}
        >
          Logout
        </button>
      </nav>
    </div>
  );
};

export default Navbar;
