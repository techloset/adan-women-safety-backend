"use client";

import { useState } from "react";

import Image from "next/image";
import toast from "react-hot-toast";

import { useRouter } from "next/navigation";
import axios from "axios";

export default function Home({ params }: { params: { id: string } }) {
  const id: string = params.id;
  const [confirmPassword, setConfirmPassword] = useState<string>();
  const [password, setPassword] = useState<string>();

  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const onHandleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      toast.error("please fill all the fields");
      return null;
    }
    if (password !== confirmPassword) {
      toast.error("password and confirm password are not same");
      return null;
    }

    if (password.length < 6) {
      toast.error("Password should be at least 6 characters long");
      return null;
    }

    try {
      setIsLoading(true);
      const res = await axios.put("/api/auth/resetPassword", { password, id });
      toast.success(res.data.message);
    } catch (error) {
      console.log("---------------------------------");
      console.log(error);
      console.log("---------------------------------");
      toast.error("Something went wrong plz try again");
    }
  };

  return (
    <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8 lg:h-screen h-auto font-thin">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="mt-6 text-center text-3xl font-bold tracking-tight text-black ">
          Reset your password
        </h1>
      </div>
      <div className=" mt-8 sm:mx-auto sm:w-full sm:max-w-md ">
        <div className=" bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6 " onSubmit={onHandleSubmit}>
            <div>
              <label
                className="block text-sm font-bold leading-5 text-gray-900"
                htmlFor="Email"
              >
                New password
              </label>
              <div className="mt-2">
                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password.."
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  disabled={isLoading}
                  className={`block w-full rounded-md border-0 py-1.5 dark:placeholder:text-black text-black text-medium shadow-sm ring-1 ring-inset placeholder:text-opacity-25 focus:ring-2  focus:ring-inset focus:ring-white sm:text-sm sm:leading-6 px-2 bg-blue-100 ${
                    isLoading && "opacity-50 cursor-default"
                  }`}
                />
              </div>
            </div>

            <div>
              <label
                className="block text-sm font-bold leading-5 text-gray-900"
                htmlFor="confirmPassword"
              >
                Confirm Password
              </label>
              <div className="mt-2">
                <input
                  id="confirmPassword"
                  type="password"
                  placeholder="Enter your Confirm password.."
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  value={confirmPassword}
                  disabled={isLoading}
                  className={`block w-full rounded-md border-0 py-1.5 dark:placeholder:text-black text-black text-medium shadow-sm ring-1 ring-inset placeholder:text-opacity-25 focus:ring-2  focus:ring-inset focus:ring-white sm:text-sm sm:leading-6 px-2 bg-blue-100 ${
                    isLoading && "opacity-50 cursor-default"
                  }`}
                />
              </div>
            </div>

            <button
              type="submit"
              className={`flex hover:cursor-pointer justify-center rounded-md px-3 py-2 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 w-full bg-blue-300 text-slate-950 ${
                isLoading && "opacity-50 cursor-default bg-green-400"
              }`}
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
