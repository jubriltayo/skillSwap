import { useEffect, useRef, useState } from "react";
import axiosClient from "../../api/axios-client";
import { useNavigate, useParams } from "react-router-dom";
import { useStateContext } from "../../context/ContextProvider";

export default function PostForm() {
    const { id } = useParams();
    const titleRef = useRef();
    const skillRef = useRef();
    const typeRef = useRef();
    const levelRef = useRef();
    const isActiveRef = useRef();
    const descriptionRef = useRef();
    const navigate = useNavigate();

    const [errors, setErrors] = useState(null);
    const [isEditing, SetIsEditing] = useState(false);
    const { setNotification } = useStateContext();

    // Load post data if editing
    useEffect(() => {
        if (id) {
            SetIsEditing(true);
            axiosClient
                .get(`/posts/${id}`)
                .then(({ data }) => {
                    titleRef.current.value = data.data.title;
                    skillRef.current.value = data.data.skill;
                    typeRef.current.value = data.data.type;
                    levelRef.current.value = data.data.level;
                    isActiveRef.current.checked = data.data.isActive;
                    descriptionRef.current.value = data.data.description;
                })
                .catch(console.error);
        }
    }, [id]);

    const onSubmit = (e) => {
        e.preventDefault();

        const payload = {
            title: titleRef.current.value,
            skill: skillRef.current.value,
            type: typeRef.current.value,
            level: levelRef.current.value,
            isActive: isActiveRef.current.checked,
            description: descriptionRef.current.value,
        };

        if (isEditing) {
            // Edit post
            axiosClient
                .put(`/posts/${id}`, payload)
                .then(() => {
                    setNotification("Post updated successfully")
                    navigate("/user/posts", { replace: true });
                })
                .catch((err) => {
                    const response = err.response;
                    if (response && response.status === 422) {
                        setErrors(response.data.errors);
                    }
                });
        } else {
            // Create new post
            axiosClient
                .post("/posts", payload)
                .then(() => {
                    setNotification("Post created successfully");
                    navigate("/posts", { replace: true });
                })
                .catch((err) => {
                    const response = err.response;
                    if (response && response.status === 422) {
                        setErrors(response.data.errors);
                    }
                });
        }
    };

    return (
        <>
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 lg:px-8">
                <div className="mx-auto w-full max-w-sm">
                    <form
                        onSubmit={onSubmit}
                        action="#"
                        className="space-y-4 mt-10 border border-gray-300 bg-gray-100 p-8 rounded-md"
                    >
                        <h2 className=" text-center text-2xl font-bold tracking-tight text-gray-900">
                            {isEditing ? "Edit Post" : "What's on your mind?"}
                        </h2>

                        {errors && (
                            <div className="mb-4 rounded-lg bg-red-100 px-4 py-3 text-red-700 shadow-sm">
                                {Object.keys(errors).map((key) => (
                                    <p key={key}>{errors[key][0]}</p>
                                ))}
                            </div>
                        )}

                        <div>
                            <div className="mt-2">
                                <input
                                    ref={titleRef}
                                    id="title"
                                    name="title"
                                    type="text"
                                    placeholder="Title"
                                    autoComplete="title"
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                />
                            </div>
                        </div>

                        <div className="mt-2">
                            <select
                                ref={typeRef}
                                id="type"
                                name="type"
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                            >
                                <option value="">Select type</option>
                                <option value="offer">Offering</option>
                                <option value="request">Request</option>
                            </select>
                        </div>

                        <div>
                            <div className="mt-2">
                                <input
                                    ref={skillRef}
                                    id="skill"
                                    name="skill"
                                    type="skill"
                                    placeholder="Skill"
                                    autoComplete="skill"
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                />
                            </div>
                        </div>

                        <div className="mt-2">
                            <select
                                ref={levelRef}
                                id="level"
                                name="level"
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                            >
                                <option value="">Skill level</option>
                                <option value="beginner">Beginner</option>
                                <option value="intermediate">
                                    Intermediate
                                </option>
                                <option value="advanced">Advanced</option>
                            </select>
                        </div>

                        <div className="mt-2 flex items-center">
                            <input
                                ref={isActiveRef}
                                id="isActive"
                                name="isActive"
                                type="checkbox"
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            />
                            <label
                                htmlFor="isActive"
                                className="ml-2 text-gray-700"
                            >
                                Active
                            </label>
                        </div>

                        <div>
                            <div className="mt-2">
                                <textarea
                                    ref={descriptionRef}
                                    id="description"
                                    name="description"
                                    placeholder="Tell others more about what you can offer or need."
                                    required
                                    rows={3}
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                {isEditing ? "Update Post" : "Create Post"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
