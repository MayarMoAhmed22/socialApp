import React from "react";
import "./Profile.module.css";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import UserPosts from "../UserPosts/UserPosts";
import ChangePassword from "../ChangePassword/ChangePassword";
import ChangeProfilePhoto from "../ChangeProfilePhoto/ChangeProfilePhoto";
import Cookies from "js-cookie";
export default function Profile() {
  function getUserInfo() {
    return axios.get(`https://linked-posts.routemisr.com/users/profile-data`, {
      headers: {
        token:Cookies.get("userToken"),
      },
    });
  }
  let { data, error, isError, isLoading } = useQuery({
    queryKey: "userprofile",
    queryFn: getUserInfo,
    select: (data) => data?.data?.user,
  });
  console.log(data?.data?.user);
  if (isLoading) {
    return <span className="loader py-50"></span>;
  }
  if (isError) {
    return (
      <h2 className=" text-4xl text-center text-[#520B05]">{error.message}</h2>
    );
  }
  return (
    <>
      <div className=" w-full mt-20 lg:w-[50%] mx-auto border-[#520B05] border-1 rounded-2xl p-4">
        <img src={data?.photo} className=" size-[60px] mx-auto" />
        <div className=" flex justify-center items-center shadow-2xl flex-col my-4 p-5">
          <p>Name : {data?.name}</p>
          <p>Emial : {data?.email}</p>
          <p>Gender : {data?.gender}</p>
          <p>Birthday : {data?.dateOfBirth}</p>
        </div>
      </div>

      <div className=" w-full mt-4 lg:w-[50%] mx-auto border-[#520B05] border-1 rounded-2xl text-center">
        <ChangePassword />
      </div>
      <div className=" w-full my-5 lg:w-[50%] mx-auto border-[#520B05] border-1 rounded-2xl text-center">
        <ChangeProfilePhoto />
      </div>
      <UserPosts id={data?._id} />
    </>
  );
}
