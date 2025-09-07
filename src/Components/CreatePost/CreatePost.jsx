import React from "react";
import "./CreatePost.module.css";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
export default function CreatePost() {
  const form = useForm({
    defaultValues: {
      body: "",
      image: "",
    },
  });

  const { register, handleSubmit, reset } = form;

  async function handleCreatePost(values) {
    let myData = new FormData();

    if (values.body && values.body.trim() !== "") {
      myData.append("body", values.body);
    }

    if (values.image && values.image.length > 0) {
      myData.append("image", values.image[0]);
    }

    if (!myData.has("body") && !myData.has("image")) {
      toast.error("You must provide text or an image");
      return;
    }

    try {
      const response = await axios.post(
        `https://linked-posts.routemisr.com/posts`,
        myData,
        {
          headers: {
            token: Cookies.get("userToken"),
          },
        }
      );

      if (response.data.message === "success") {
        toast.success("Post created successfully");
        reset(); // ✅ clear input fields
      }
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.error || "Something went wrong");
    }
  }

  function getUserInfo() {
    return axios.get(`https://linked-posts.routemisr.com/users/profile-data`, {
      headers: {
        token: localStorage.getItem("userToken"),
      },
    });
  }

  const { data, error, isError, isLoading } = useQuery({
    queryKey: "userprofile",
    queryFn: getUserInfo,
    select: (data) => data?.data?.user,
  });

  if (isLoading) {
    return <span className="loader py-50"></span>;
  }

  if (isError) {
    return (
      <h2 className="text-4xl text-center text-[#520B05]">{error.message}</h2>
    );
  }

  return (
    <div className="w-full mt-10 lg:w-[48%] md:w-[70%] mx-auto">
      <form
        onSubmit={handleSubmit(handleCreatePost)}
        className="flex items-center p-2 w-full max-w-md gap-2"
      >
        <img
          src={data?.photo}
          alt={data?.name}
          className="w-10 h-10 rounded-full object-cover"
        />

        {/* Text input */}
        <input
          type="text"
          {...register("body")}
          id="body"
          className="flex-1 px-2 outline-none rounded-xl border border-slate-500"
          placeholder="What's on your mind?"
        />

        {/* Image upload */}
        <label htmlFor="photo" className="cursor-pointer">
          <i className="fa-solid fa-image fa-xl p-1"></i>
        </label>
        <input
          {...register("image")}
          type="file"
          id="photo"
          accept="image/*"
          className="hidden"
        />

        {/* Post button */}
        <button
          type="submit"
          className="p-2 text-[#520B05] border rounded-lg hover:bg-[#520B05]/10"
        >
          Post
        </button>
      </form>
    </div>
  );
}
