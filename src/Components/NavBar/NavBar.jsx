import React, { useContext, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { userContext } from "../../Context/userContext";

export default function NavBar() {
  const [Open, setOpen] = useState(false);
  let navigate = useNavigate();
  let { userLogin, setuserLogin } = useContext(userContext);
  function changeControl() {
    if (Open) {
      setOpen(false);
    } else {
      setOpen(true);
    }
  }
  function signOut() {
    localStorage.removeItem("userToken");
    setuserLogin(null);
    navigate("/login");
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
                  type="button"
                  onClick={() => changeControl()}
                  className="flex text-sm  bg-amber-50 w-8 h-8 rounded-full md:me-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                  id="user-menu-button"
                  aria-expanded="false"
                  data-dropdown-toggle="user-dropdown"
                  data-dropdown-placement="bottom"
                >
                  <span className="sr-only">Open user menu</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    className=" h-8 w-8 rounded-full"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                    />
                  </svg>
                </button>
                {/* Dropdown menu */}
                <div
                  className=" text-base list-none absolute left-1/2 bg-white  divide-gray-100 rounded-lg shadow-sm dark:bg-gray-700 dark:divide-gray-600"
                  id="user-dropdown"
                >
                  {Open ? (
                    <div className=" absolute right-0   text-base list-none text-[#520B05] bg-[#F65606] divide-y divide-gray-100 rounded-lg shadow-sm">
                      <div className="px-4 py-3">
                        <span className="block text-sm text-gray-900 dark:text-white">
                          Bonnie Green
                        </span>
                        <span className="block text-sm text-gray-500 truncate dark:text-gray-400">
                          name@flowbite.com
                        </span>
                      </div>
                      <ul className="py-2" aria-labelledby="user-menu-button">
                        <li>
                          <NavLink
                            to={"/profile"}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                          >
                            Profile
                          </NavLink>
                        </li>
                        <li>
                          <span
                            onClick={signOut}
                            className="block cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
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
