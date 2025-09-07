import React, { useState } from "react";
import "./UserPosts.module.css";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Link } from "react-router-dom";
import AddComment from "../AddComment/AddComment";
import style from "./UserPosts.module.css";
import Comment from "./../Comment";
import UpdatePosts from "../UpdatePost/UpdatePosts";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
export default function UserPosts({ id }) {
  const [expanded, setExpanded] = useState(false);
  const [editingPostId, setEditingPostId] = useState(null);
  let queryclient = useQueryClient();
  function handleTroggle(postId) {
    setEditingPostId(postId);
  }
  function deletePost(postId) {
    axios
      .delete(`https://linked-posts.routemisr.com/posts/${postId}`, {
        headers: { token: Cookies.get("userToken") },
      })
      .then((res) => {
        console.log(res);
        toast.success("Post deleted successfully");
        queryclient.invalidateQueries({ queryKey: ["userPosts"] });
      })
      .catch((err) => {
        console.log(err);
      });
  }
  function handleCloseUpdate() {
    setEditingPostId(null);
  }
  function fetchUserPosts() {
    return axios.get(`https://linked-posts.routemisr.com/users/${id}/posts`, {
      headers: {
        token: localStorage.getItem("userToken"),
      },
    });
  }
  console.log(localStorage.getItem("userToken"));
  let { data, error, isError } = useQuery({
    queryKey: ["userPosts", id],
    queryFn: fetchUserPosts,
    select: (data) => data.data.posts,
  });

  if (isError) {
    return (
      <h2 className=" text-4xl text-center text-[#520B05]">{error.message}</h2>
    );
  }

  return (
    <div>
      {data?.map((post) => {
        const words = post.body?.split(" ") || [];
        const wordLimit = 10;
        const shortText = words.slice(0, wordLimit).join(" ");
        const isLong = words.length > wordLimit;

        return (
          <div
            key={post.id}
            className=" w-[95%] my-10 md:w-[70%] lg:w-[50%] rounded-md bg-cream  text-black shadow-xl p-4 mx-auto"
          >
            <div className="flex justify-end items-center gap-2">
              <div className="flex justify-end items-end">
                <i
                  className="fa-regular fa-pen-to-square cursor-pointer"
                  onClick={() => handleTroggle(post.id)}
                ></i>

                {editingPostId === post.id && (
                  <UpdatePosts postId={post.id} onClose={handleCloseUpdate} />
                )}
              </div>
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-6"
                  onClick={() => deletePost(post.id)}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                  />
                </svg>
              </div>
            </div>
            <Link to={`/postdetails/${post.id}`}>
              <div className=" flex justify-between items-center mb-4">
                <div className=" flex items-center gap-4">
                  <img
                    src={post?.user.photo}
                    className="size-[36px]"
                    alt={post.user.name}
                  />
                  <p className=" text-[#520B05]">{post?.user.name}</p>
                </div>
                <div className="text-xs text-slate-400">{post?.createdAt}</div>
              </div>

              {/* 🔹 Body with ReadMore toggle */}
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
                        e.preventDefault();
                        setExpanded(!expanded);
                      }}
                    >
                      {expanded ? "Show less" : "Read more"}
                    </button>
                  )}
                </div>
              )}

              {post?.image && (
                <img
                  src={post?.image}
                  className=" w-full rounded-md"
                  alt={post?.body}
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
              </div>
            </Link>
            {post.comments.length > 0 && (
              <Comment comment={post.comments[0]} postId={post.id} />
            )}
            <AddComment postId={post.id} />
          </div>
        );
      })}
    </div>
  );
}
