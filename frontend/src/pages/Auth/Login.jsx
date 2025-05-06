import { useRef, useState } from "react";
import { useStateContext } from "../../context/ContextProvider";
import { Link, useNavigate } from "react-router-dom";
import axiosClient from "../../api/axios-client";

export default function Login() {
    const emailRef = useRef();
    const passwordRef = useRef();
    const [errors, setErrors] = useState(null);
    const { setUser, setToken } = useStateContext();
    const navigate = useNavigate();

    const onSubmit = (e) => {
        e.preventDefault();
        setErrors(null);

        const payload = {
            email: emailRef.current.value,
            password: passwordRef.current.value,
        };

        axiosClient
            .post("/login", payload)
            .then(({ data }) => {
                setUser(data.user);
                setToken(data.token);
                navigate("/");
            })
            .catch((err) => {
                const response = err.response; // we could destructure -> const {response} = err

                if (response && response.status == 422) {
                    // Validation errors (like missing fields)
                    setErrors(response.data.errors);
                } else if (response && response.status == 401) {
                    // Invalid credentials
                    setErrors({
                        email: [response.data.message],
                    });
                } else {
                    setErrors({
                        email: ["An unexpected error occured"],
                    });
                }
            });
    };

    return (
        <>
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                <div className="mx-auto w-full max-w-sm">
                    <h1 className="text-6xl text-center font-bold italic mb-16">
                        Skill Swap
                    </h1>
                    <form
                        onSubmit={onSubmit}
                        className="space-y-6 mt-10 border border-gray-300 bg-gray-100 p-8 rounded-md"
                    >
                        <h2 className=" text-center text-2xl font-bold tracking-tight text-gray-900">
                            Log in to your account
                        </h2>

                        {errors && ( // Object.keys(errors).length > 0 &&
                            <div className="mb-4 rounded-lg bg-red-100 px-4 py-3 text-red-700 shadow-sm">
                                {Object.keys(errors).map((key) => (
                                    <p key={key}>{errors[key][0]}</p>
                                ))}
                            </div>
                        )}

                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm/6 text-left font-medium text-gray-900"
                            >
                                Email address
                            </label>
                            <div className="mt-2">
                                <input
                                    ref={emailRef}
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="Email address"
                                    autoComplete="email"
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                />
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm/6 font-medium text-gray-900"
                            >
                                Password
                            </label>
                            <div className="mt-2">
                                <input
                                    ref={passwordRef}
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="Password"
                                    // required
                                    autoComplete="current-password"
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                Log in
                            </button>
                        </div>

                        <p className="mt-10 text-center text-sm/6 text-gray-500">
                            Don't have an account?{" "}
                            <Link
                                to="/auth/signup"
                                className="font-semibold text-indigo-600 hover:text-indigo-500"
                            >
                                Create an account
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </>
    );
}
