import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import z from "zod";

const schema = z
  .object({
    name: z
      .string()
      .min(1, "Name is required")
      .max(20, "Max length is 20 characters"),
    email: z.string().email("Invalid email"),
    password: z
      .string()
      .regex(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
        "Must have uppercase, lowercase, number, special char, and min 8 length"
      ),
    rePassword: z.string(),
    dateOfBirth: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)")
      .refine((dateStr) => {
        const userdate = new Date(dateStr);
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        return userdate < now;
      }, "Date cannot be in the future"),
    gender: z.enum(["male", "female"], {
      message: "Gender must be male or female",
    }),
  })
  .refine((data) => data.password === data.rePassword, {
    message: "Password and confirm password must match",
    path: ["rePassword"],
  });

export default function Register() {
  let navigate = useNavigate();
  const [apiErr, setapiErr] = useState("");
  const [loading, setloading] = useState(false);
  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      rePassword: "",
      dateOfBirth: "",
      gender: "",
    },
    resolver: zodResolver(schema),
  });
  let { register, handleSubmit, formState } = form;

  function handleRegister(values) {
    setloading(true);
    axios
      .post(`https://linked-posts.routemisr.com/users/signup`, values)
      .then((res) => {
        if (res.data.message === "success") {
          setloading(false);
          navigate("/login");
        }
      })
      .catch((err) => {
        console.log(err.response.data.error);
        setloading(false);
        setapiErr(err.response.data.error);
      });
  }

  return (
    <>
      <form
        className="max-w-md mx-4 md:mx-auto my-12 py-1 shadow-sm px-3"
        onSubmit={handleSubmit(handleRegister)}
      >
        {apiErr && (
          <p className="bg-[#F65606] text-[#520B05] rounded-2xl p-3 mb-10 text-3xl text-center capitalize">
            {apiErr}
          </p>
        )}

        {/* Name */}
        <div className="relative z-0 w-full mb-6 group">
          <input
            type="text"
            {...register("name")}
            id="floating_first_name"
            className="block px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
          />
          <label
            htmlFor="floating_first_name"
            className="peer-focus:font-medium absolute text-l text-gray-600 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-1 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            UserName
          </label>
          {formState.errors.name && formState.touchedFields.name && (
            <p className="flex items-center w-full max-w-xs p-1 text-gray-500 bg-red rounded-lg shadow-sm">
              {formState.errors.name.message}
            </p>
          )}
        </div>

        {/* Email */}
        <div className="relative z-0 w-full mb-6 group">
          <input
            type="email"
            {...register("email")}
            id="email"
            className="block px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 appearance-none  focus:outline-none focus:ring-0 peer"
            placeholder=" "
          />
          <label
            htmlFor="email"
            className="peer-focus:font-medium absolute text-lg text-gray-600  dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-1 -z-10 origin-[0] peer-focus:text-blue-600 peer-focus:dark:text-blue-500"
          >
            Email address
          </label>
          {formState.errors.email && formState.touchedFields.email && (
            <p className="flex items-center w-full max-w-xs p-1 text-gray-500 bg-red rounded-lg shadow-sm">
              {formState.errors.email.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="relative z-0 w-full mb-6 group">
          <input
            type="password"
            {...register("password")}
            id="floating_password"
            className="block px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 appearance-none focus:outline-none  peer"
            placeholder=" "
          />
          <label
            htmlFor="floating_password"
            className="peer-focus:font-medium absolute text-lg text-gray-600 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-1 -z-10 origin-[0]  "
          >
            Password
          </label>
          {formState.errors.password && formState.touchedFields.password && (
            <p className="flex items-center w-full p-1 text-gray-500 bg-red rounded-lg shadow-sm">
              {formState.errors.password.message}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="relative z-0 w-full mb-6 group">
          <input
            type="password"
            {...register("rePassword")}
            id="floating_repeat_password"
            className="block px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 appearance-none  focus:outline-none focus:ring-0  peer"
            placeholder=" "
          />
          <label
            htmlFor="floating_repeat_password"
            className="peer-focus:font-medium absolute text-lg text-gray-900 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-1 -z-10 origin-[0] peer-focus:text-blue-600 peer-focus:dark:text-blue-500"
          >
            Confirm password
          </label>
          {formState.errors.rePassword &&
            formState.touchedFields.rePassword && (
              <p className="flex items-center w-1/2 p-1 text-sm text-gray-500 bg-red rounded-lg shadow-sm">
                {formState.errors.rePassword.message}
              </p>
            )}
        </div>

        {/* Date of Birth */}
        <div className="relative z-0 w-full mb-6 group">
          <input
            type="date"
            {...register("dateOfBirth")}
            id="floating_date"
            className="block px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
          />
          <label
            htmlFor="floating_date"
            className="peer-focus:font-medium absolute text-lg text-gray-600 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-1 -z-10 origin-[0] peer-focus:text-blue-600 peer-focus:dark:text-blue-500"
          >
            BirthDay
          </label>
          {formState.errors.dateOfBirth &&
            formState.touchedFields.dateOfBirth && (
              <p className="flex items-center w-full max-w-xs p-1 text-gray-500 bg-red rounded-lg shadow-sm">
                {formState.errors.dateOfBirth.message}
              </p>
            )}
        </div>

        {/* Gender */}
        <div className="flex gap-4">
          <div className="flex items-center mb-6">
            <input
              id="gender-male"
              type="radio"
              {...register("gender")}
              value="male"
              className="w-4 h-4 border-gray-300 focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-600 dark:bg-gray-700 dark:border-gray-600"
            />
            <label
              htmlFor="gender-male"
              className="block ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              Male
            </label>
          </div>

          <div className="flex items-center mb-6">
            <input
              id="gender-female"
              type="radio"
              {...register("gender")}
              value="female"
              className="w-4 h-4 border-gray-300 focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-600 dark:bg-gray-700 dark:border-gray-600"
            />
            <label
              htmlFor="gender-female"
              className="block ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              Female
            </label>
          </div>
        </div>

        {formState.errors.gender && formState.touchedFields.gender && (
          <span className="flex items-center mx-2 w-full text-sm max-w-xs p-1 text-gray-500 bg-red rounded-lg shadow-sm">
            {formState.errors.gender.message}
          </span>
        )}

        {/* Submit */}
        <button
          disabled={loading}
          type="submit"
          className="text-[#520B05] bg-[#F65606] hover:outline-1 hover:outline-[#520B05] focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
        >
          {loading ? <i className=" fas fa-spinner fa-spin  "></i> : "submit"}
        </button>
      </form>
    </>
  );
}
