import React, { useContext, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { userContext } from "../../Context/userContext";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Cookies from "js-cookie";
export default function NavBar() {
  const [Open, setOpen] = useState(false);
  let navigate = useNavigate();
  let { userLogin, setuserLogin } = useContext(userContext);
  function changeControl() {
    setOpen(!Open);
  }
  function signOut() {
    Cookies.remove("userToken");
    setuserLogin(null);
    navigate("/login");
  }
  function getUserInfo() {
    return axios.get(`https://linked-posts.routemisr.com/users/profile-data`, {
      headers: {
        token:  Cookies.get("userToken"),
      },
    });
  }
  let { data, error, isError } = useQuery({
    queryKey: "userprofile",
    queryFn: getUserInfo,
    select: (data) => data?.data?.user,
  });
  console.log(data?.data?.user);

  if (isError) {
    return (
      <h2 className=" text-4xl text-center text-[#520B05]">{error.message}</h2>
    );
  }
  return (
    <>
      <nav className="bg-[#EEE0D5] border-[#F65606] border-b-1 dark:bg-gray-900">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <NavLink
            to={"/"}
            className="flex items-center space-x-3 rtl:space-x-reverse"
          >
            <span className="text-[#520B05] font-bold text-4xl self-center  whitespace-nowrap dark:text-white">
              <span className="text-[#F65606] font-bold text-4xl self-center  whitespace-nowrap dark:text-white">
                {" "}
                Social
              </span>{" "}
              App
            </span>
          </NavLink>
          <div className="flex gap-4 items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
            {userLogin ? (
              <div className=" relative inline-block">
                <button
                  onClick={changeControl}
                  className="flex text-sm  bg-amber-50 w-8 h-8 rounded-full md:me-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                  id="user-menu-button"
                  aria-expanded="false"
                  data-dropdown-toggle="user-dropdown"
                  data-dropdown-placement="bottom"
                >
                  <span className="sr-only">Open user menu</span>
                  <img
                    src={data?.photo}
                    alt={data?.name}
                    className=" rounded-[50%]"
                  />
                </button>
                {/* Dropdown menu */}
                <div
                  className=" text-base list-none absolute left-1/2 bg-white  divide-gray-100 rounded-lg shadow-sm dark:bg-gray-700 dark:divide-gray-600"
                  id="user-dropdown"
                >
                  {Open ? (
                    <div className=" absolute right-0   text-base list-none text-white bg-[#520B05] divide-y divide-gray-100 rounded-lg shadow-sm">
                      <div className="px-4 py-3">
                        <span className="block text-sm  dark:text-white">
                          {data?.name}{" "}
                        </span>
                        <span className="block text-sm  truncate dark:text-gray-400">
                          {data?.email}
                        </span>
                      </div>
                      <ul className="py-2" aria-labelledby="user-menu-button">
                        <li>
                          <NavLink
                            to={"/profile"}
                            onClick={() => setOpen(false)}
                            className="block px-4 py-2 text-sm dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                          >
                            Profile
                          </NavLink>
                        </li>
                        <li>
                          <span
                            onClick={signOut}
                            className="block cursor-pointer px-4 py-2 text-sm dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                          >
                            Sign Out
                          </span>
                        </li>
                      </ul>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            ) : (
              <ul className=" flex gap-4">
                <li>
                  <Link
                    className=" text-[#520B05] outline-1 outline-[#520B05] px-3 py-1.5 hover:bg-[#F65606] hover:outline-none border-none hover:py-2 hover:px-4 rounded-l"
                    to="/login"
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link
                    className=" text-[#520B05] outline-1 outline-[#520B05] px-3 py-1.5 hover:bg-[#F65606] hover:outline-none border-none hover:py-2 hover:px-4 rounded-l"
                    to="/register"
                  >
                    Register
                  </Link>
                </li>
              </ul>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}
