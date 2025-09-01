import React from "react";
import "./CreatePost.module.css";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
export default function CreatePost() {
  let form = useForm({
    defaultValues: {
      body: "",
      image: "",
    },
  });
  let { register, handleSubmit } = form;
  async function handleCrestePost(values) {
    let myData = new FormData();
    myData.append("body", values.body);
    myData.append("image", values.image[0]);

    try {
      let response = await axios.post(
        `https://linked-posts.routemisr.com/posts`,
        myData,
        {
          headers: {
            token: localStorage.getItem("userToken"),
          },
        }
      );

      if (response.data.message === "success") {
        toast.success("Post created successfully");
      }
    } catch (err) {
      console.log(err);
      toast.error(err.response.data.error);
    }
  }
  function getUserInfo() {
    return axios.get(`https://linked-posts.routemisr.com/users/profile-data`, {
      headers: {
        token: localStorage.getItem("userToken"),
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
    <div className=" w-full mt-10  lg:w-[48%] md:w-[70%] mx-auto ">
      <form
        onSubmit={handleSubmit(handleCrestePost)}
        className="flex  items-center p-2 w-[100%] max-w-md"
      >
        <img
          src={data?.photo}
          alt={data?.name}
          className=" w-10 mr-2 h-10 rounded-full object-cover"
        />
        <div>
          <input
            type="text"
            {...register("body")}
            id="body"
            className="pr-18 md:pr-50 lg:pr-80 outline-none rounded-xl  border-slate-500"
            placeholder="what's on your mind"
          />
        </div>
        <div>
          <label htmlFor="photo">
            {" "}
            <i className=" fa-solid p-1 fa-image fa-2xl"></i>
          </label>
          <input
            {...register("image")}
            type="file"
            id="photo"
            className="hidden"
          />
        </div>
        <div className="flex justify-end items-center">
          <button className=" p-2  text-[#520B05] outline-1 outline-[#520B05]  py-1.5  border-none  rounded-l ">
            {" "}
            post
          </button>
        </div>
      </form>
    </div>
  );
}
