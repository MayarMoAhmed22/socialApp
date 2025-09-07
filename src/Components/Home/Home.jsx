import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Comment from "./../Comment";
import { Link } from "react-router-dom";
import AddComment from "../AddComment/AddComment";
import style from "./Home.module.css";
import CreatePost from "../CreatePost/CreatePost";
import Cookies from "js-cookie";
export default function Home() {
  const [expanded, setExpanded] = useState(false);
  function getAllPosts() {
    return axios.get(`https://linked-posts.routemisr.com/posts?limit=50`, {
      headers: {
        token: Cookies.get("userToken"),
      },
    });
  }

  let { data, isError, isLoading, error } = useQuery({
    queryKey: ["getPosts"],
    queryFn: getAllPosts,
    select: (data) => data?.data?.posts,
  });

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
      <CreatePost />
      {data.map((post) => {
        const words = post.body?.split(" ") || [];
        const wordLimit = 10;
        const shortText = words.slice(0, wordLimit).join(" ");
        const isLong = words.length > wordLimit;

        return (
          <div
            key={post.id}
            className=" w-[95%] my-10 md:w-[70%] lg:w-[50%] rounded-md bg-cream  text-black shadow-xl p-4 mx-auto"
          >
            <Link to={`/postdetails/${post.id}`}>
              <div className=" flex justify-between items-center mb-4">
                <div className=" flex items-center gap-4">
                  <img
                    src={post.user.photo}
                    className="size-[36px]"
                    alt={post.user.name}
                  />
                  <p className=" text-[#520B05]">{post.user.name}</p>
                </div>
                <div className="text-xs text-slate-400">{post.createdAt}</div>
              </div>

              {post.body && (
                <div className="mb-4 text-[#520B05] overflow-hidden overflow-ellipsis">
                  <p className={!expanded ? `${style.caption}` : " "}>
                    {expanded ? post.body : shortText}
                    {isLong && !expanded && "..."}
                  </p>

                  {isLong && (
                    <button
                      className=" text-blue-500 text-sm mt-1"
                      onClick={(e) => {
                        e.preventDefault(); // stop Link navigation
                        setExpanded(!expanded);
                      }}
                    >
                      {expanded ? "Show less" : "Read more"}
                    </button>
                  )}
                </div>
              )}

              {post.image && (
                <img
                  src={post.image}
                  className=" w-full rounded-md"
                  alt={post.body}
                />
              )}
              <div className=" my-3">
                <div className=" flex items-center gap-0.5 py-3 px-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-6 text-[#520B05]"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z"
                    />
                  </svg>
                  <p className=" text-xs text-[#520B05]">Comments</p>
                </div>
                {post.comments.length > 0 && (
                  <Comment comment={post.comments[0]} />
                )}
              </div>
            </Link>
            <AddComment postId={post.id} />
          </div>
        );
      })}
    </>
  );
}
