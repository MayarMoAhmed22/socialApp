import React, { useState } from "react";
import "./ChangePassword.module.css";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import axios from "axios";
import Cookies from "js-cookie";
export default function ChangePassword() {
  const [isOpen, setisOpen] = useState(false);
  function handleTroggle() {
    setisOpen(!isOpen);
  }
  function changePass(values) {
    axios
      .patch(
        `https://linked-posts.routemisr.com/users/change-password`,
        values,
        {
          headers: { token: Cookies.get("userToken") },
        }
      )
      .then((res) => {
        console.log(res);
        if (res.data.message === "success") {
          console.log(res);
          localStorage.setItem("userToken", res.data.token);
          setisOpen(false); // ✅ just close modal
          toast.success("password changed successfully", {
            style: { backgroundColor: "#520B05", color: "white" },
          });
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error("Something went wrong !!");
      });
  }
  const form = useForm({
    defaultValues: {
      password: "",
      newPassword: "",
    },
  });

  const { register, handleSubmit } = form;
  return (
    <>
      <button
        onClick={handleTroggle}
        className="  py-2.5 text-center"
        type="button"
      >
        Change Password
      </button>
      {isOpen && (
        <div className="overflow-y-auto flex fixed top-0 right-0 left-0 z-50 justify-center items-center w-full h-[calc(100%-1rem)] max-h-full">
          <div className="relative p-4 w-full max-w-md max-h-full">
            {/* Modal content */}
            <div className="relative bg-[#EEE0D5] rounded-lg shadow-lg dark:bg-gray-700">
              <div className="p-4 md:p-5">
                <div className="flex items-center justify-between p-2 md:p-2 rounded-t">
                  <button
                    type="button"
                    onClick={handleTroggle}
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
                  onSubmit={handleSubmit(changePass)}
                  className="space-y-4"
                  action="#"
                >
                  <div>
                    <label
                      htmlFor="comment"
                      className="block mb-2 text-sm text-start font-medium text-gray-900 dark:text-white"
                    >
                      Password
                    </label>
                    <input
                      type="password"
                      id="comment"
                      {...register("password")}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="comment"
                      className="block mb-2 text-sm text-start font-medium text-gray-900 dark:text-white"
                    >
                      new Password
                    </label>
                    <input
                      type="password"
                      id="comment"
                      {...register("newPassword")}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                    />
                  </div>

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
    </>
  );
}
