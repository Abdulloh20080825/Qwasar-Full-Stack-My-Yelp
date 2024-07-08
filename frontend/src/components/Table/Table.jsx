import React, { useEffect } from "react";
import axiosInstance from "../../utils/axiosApi";

const Table = ({ userInfo, restaurans, onDelete }) => {
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center my-4">
        <p className="fs-4 fw-bold text-capitalize">
          {userInfo?.username ? userInfo.username : "Loading..."} Restaurants
        </p>
        <button className="btn btn-primary">
          <a href="/add" className="text-light text-decoration-none">
            Add Restaurant
          </a>
        </button>
      </div>
      <div className="table-responsive">
        <table className="table table-hover">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">Description</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {restaurans.map((item, id) => (
              <tr key={id}>
                <th scope="row">{id + 1}</th>
                <td>{item.name}</td>
                <td>{item.description}</td>
                <td>
                  <button
                    className="btn btn-danger btn-sm me-2"
                    onClick={() => onDelete(item._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
