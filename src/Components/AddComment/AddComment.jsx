import React, { useState } from "react";
import "./AddComment.module.css";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";

export default function AddComment({ postId }) {
  const [isOpen, setisOpen] = useState(false);

  async function addComent(values) {
    try {
      let res = await axios.post(
        `https://linked-posts.routemisr.com/comments`,
        values,
        {
          headers: { token: localStorage.getItem("userToken") },
        }
      );
      console.log(res);
      if (res.data.message === "success") {
        setisOpen(false); // ✅ just close modal
        toast.success("comment created successfully" ,{
          style:{backgroundColor:"#520B05", color:"white"}
        });
      }
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong !!");
    }
  }

  function handleTroggle() {
    setisOpen(true);
  }

  const form = useForm({
    defaultValues: {
      content: "",
      post: postId,
    },
  });
  const { register, handleSubmit } = form;

  return (
    <>
      <div>
        {/* Modal toggle */}
        <button
          onClick={handleTroggle}
          className="block text-[#520B05] bg-[#F65606] focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          type="button"
        >
          Add comment here ...
        </button>

        {/* Main modal */}
        {isOpen && (
          <div className="overflow-y-auto flex fixed top-0 right-0 left-0 z-50 justify-center items-center w-full h-[calc(100%-1rem)] max-h-full">
            <div className="relative p-4 w-full max-w-md max-h-full">
              {/* Modal content */}
              <div className="relative bg-[#EEE0D5] rounded-lg shadow-lg dark:bg-gray-700">
                <div className="p-4 md:p-5">
                  <div className="flex items-center justify-between p-2 md:p-2 rounded-t">
                    <button
                      type="button"
                      onClick={() => setisOpen(false)}
                      className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
                    >
                      <svg
                        className="w-3 h-3"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 14 14"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                        />
                      </svg>
                    </button>
                  </div>

                  <form
                    onSubmit={handleSubmit(addComent)}
                    className="space-y-4"
                    action="#"
                  >
                    <div>
                      <label
                        htmlFor="comment"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Add comment
                      </label>
                      <input
                        type="text"
                        id="comment"
                        {...register("content")}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                      />
                    </div>

                    <input {...register("post")} type="hidden" value={postId} />

                    <button
                      type="submit"
                      className="w-full text-[#520B05] bg-[#F65606] font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                    >
                      Done
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
