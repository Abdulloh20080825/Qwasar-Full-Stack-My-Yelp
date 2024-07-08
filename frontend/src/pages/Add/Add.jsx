import React, { useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosApi";

const Add = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const addRestauran = async (e) => {
    e.preventDefault();
    if (!name) {
      setError("All field is required");
      return;
    }
    if (!description) {
      setError("All field is required");
      return;
    }

    setError("");
    try {
      await axiosInstance.post("/add-restauran", {
        name,
        description,
      });
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Navbar />
      <main className="form-signin w-75 m-auto">
        <form>
          <h1 className="h3 mb-3 fw-normal">Add new Restaurant</h1>

          <p className="text-danger text-capitalize">{error}</p>

          <div className="form-floating">
            <input
              type="text"
              className="form-control my-3"
              name="name"
              id="floatingInput"
              value={name}
              autoComplete="off"
              placeholder="Name"
              onChange={(e) => setName(e.target.value)}
            />
            <label htmlFor="floatingInput">Name</label>
          </div>
          <div className="form-floating">
            <textarea
              className="form-control my-3"
              placeholder="Leave a comment here"
              autoComplete="off"
              name="description"
              value={description}
              id="floatingTextarea"
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
            <label htmlFor="floatingTextarea">Description</label>
          </div>
          <button
            className="btn btn-primary w-100 py-2 my-3"
            type="submit"
            onClick={addRestauran}
          >
            Add Restaurant
          </button>
        </form>
      </main>
    </div>
  );
};

export default Add;
