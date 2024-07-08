import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Table from "../../components/Table/Table";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosApi";

const Home = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [restaurans, setRestaurans] = useState([]);
  const navigate = useNavigate();

  // API REDIRECT LOGIN

  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/get-user");
      setUserInfo(response.data);
    } catch (error) {
      console.log(error);
      navigate("/login");
    }
  };

  const getAllRestaurant = async () => {
    try {
      const response = await axiosInstance.get("/get-all-restauran");
      console.log(response.data);
      setRestaurans(response.data.restaurants);
    } catch (error) {
      console.log("Error");
    }
  };
  const onDelete = async (restaurantId) => {
    console.log(restaurantId);
    try {
      const response = await axiosInstance.delete(
        `/delete-restauran/${restaurantId}`
      );
      if (response.data && !response.data.error) {
        getAllRestaurant();
      }
    } catch (error) {
      console.error(error);
    }
  };


  useEffect(() => {
    getUserInfo();
    getAllRestaurant();
  }, []);

  if (!userInfo) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Navbar />
      <Table userInfo={userInfo} restaurans={restaurans} onDelete={onDelete} />
    </div>
  );
};

export default Home;
