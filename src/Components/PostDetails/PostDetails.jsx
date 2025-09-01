import React, { useState } from "react";
import "./PostDetails.module.css";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Comment from "./../Comment";

export default function PostDetails() {
  const [expanded, setExpanded] = useState(false);
  const { id } = useParams();

  function singlePage() {
    return axios.get(`https://linked-posts.routemisr.com/posts/${id}`, {
      headers: { token: localStorage.getItem("userToken") },
    });
  }

  const { data, isError, error } = useQuery({
    queryKey: ["singlePost", id],
    queryFn: singlePage,
    select: (res) => res?.data?.post,
  });

  if (isError) return <p>{error.message}</p>;
  if (!data) {
    return <span className="loader py-50"></span>;
  }
  const text = data?.body ?? "";
  const words = text.trim().split(/\s+/);
  const WORD_LIMIT = 10;
  const isLong = words.length > WORD_LIMIT;
  const shortText = words.slice(0, WORD_LIMIT).join(" ");

  return (
    <div className="w-full my-10 md:w-[80%] lg:w-[55%] rounded-md bg-cream text-black shadow-2xl p-4 mx-auto">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <img
            src={data?.user?.photo}
            className="size-[36px]"
            alt={data?.user?.name}
          />
          <p className="text-[#520B05]">{data.user.name}</p>
        </div>
        <div className="text-xs text-slate-400">{data.createdAt}</div>
      </div>

      {/* Caption */}
      {text && (
        <div className="overflow-hidden overflow-ellipsis">
          {!expanded ? (
            <p className="pl-6 opacity-90 text-sm">
              {shortText}
              {isLong && "…"}
            </p>
          ) : (
            // show full body on a NEW line, preserving original line breaks
            <p className="pl-6 opacity-90 text-sm mt-2 whitespace-pre-line">
              {text}
            </p>
          )}

          {isLong && (
            <button
              onClick={() => setExpanded((v) => !v)}
              className="text-blue-600 text-sm mt-1 pl-6 underline"
            >
              {expanded ? "Show less" : "Read more"}
            </button>
          )}
        </div>
      )}

      {data.image && (
        <img
          src={data.image}
          className="w-full rounded-md mt-4"
          alt={data.body}
        />
      )}

      <div className="my-3">
        <div className="flex items-center gap-0.5 py-3 px-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5" // camelCase in JSX
            stroke="currentColor"
            className="size-6 text-[#520B05]"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z"
            />
          </svg>
          <p className="text-xs text-[#520B05]">Comments</p>
        </div>

        {(data.comments || []).map((comment) => (
          <Comment key={comment.id || comment._id} comment={comment} />
        ))}
      </div>
    </div>
  );
}
