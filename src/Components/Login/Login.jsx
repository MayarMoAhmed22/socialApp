import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { userContext } from "../../Context/userContext";
import { useNavigate } from "react-router-dom";
import z from "zod";
const schema = z.object({
  email: z.string().email("InValid email"),
  password: z
    .string()
    .regex(
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
      "Must have uppercase, lowercase, number, special char, and min 8 length"
    ),
});
export default function Login() {
  const [loading, setloading] = useState(false);
  const [apiErr, setapiErr] = useState("");
  let { setuserLogin } = useContext(userContext);
  let navigate = useNavigate();
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(schema),
  });
  let { register, handleSubmit, formState } = form;

  function handleLohin(values) {
    setloading(true);
    axios
      .post(`https://linked-posts.routemisr.com/users/signin`, values)
      .then((res) => {
        if (res.data.message === "success") {
          setloading(false);
          localStorage.setItem("userToken", res.data.token);
          setuserLogin(res.data.token);
          navigate("/");
        }
      })
      .catch((err) => {
        setloading(false);
        setapiErr(err.response.data.error);
      });
  }
  return (
    <>
      <form
        className="max-w-md mx-4 md:mx-auto my-30 py-2 flex-col shadow-sm px-4"
        onSubmit={handleSubmit(handleLohin)}
      >
        {apiErr && (
          <p className="bg-[#F65606] text-[#520B05] rounded-2xl p-3 mb-10 text-3xl text-center capitalize">
            {apiErr}
          </p>
        )}

        {/* Email */}
        <div className="relative z-0 w-full mb-10 group">
          <input
            type="email"
            {...register("email")}
            id="email"
            className="block px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 appearance-none  focus:outline-none focus:ring-0 peer"
            placeholder=" "
          />
          <label
            htmlFor="email"
            className="peer-focus:font-medium absolute text-lg text-gray-600  dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 -top-1 -z-10 origin-[0] peer-focus:text-blue-600 peer-focus:dark:text-blue-500"
          >
            Email address
          </label>
          {formState.errors.email && formState.touchedFields.email && (
            <p className="flex items-center w-full max-w-xs p-4 text-gray-500 bg-red rounded-lg shadow-sm">
              {formState.errors.email.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="relative z-0 w-full mb-10 group">
          <input
            type="password"
            {...register("password")}
            id="floating_password"
            className="block px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 appearance-none focus:outline-none  peer"
            placeholder=" "
          />
          <label
            htmlFor="floating_password"
            className="peer-focus:font-medium absolute text-lg text-gray-600 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 -top-1 -z-10 origin-[0]  "
          >
            Password
          </label>
          {formState.errors.password && formState.touchedFields.password && (
            <p className="flex items-center w-full p-4 text-gray-500 bg-red rounded-lg shadow-sm">
              {formState.errors.password.message}
            </p>
          )}
        </div>
        <button
          disabled={loading}
          type="submit"
          className="text-[#520B05] bg-[#F65606] hover:outline-1 hover:outline-[#520B05] focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
        >
          {loading ? <i className=" fas fa-spinner fa-spin  "></i> : "Login"}
        </button>
      </form>
    </>
  );
}
