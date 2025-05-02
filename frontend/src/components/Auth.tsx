import { SignupInput } from "@project-blog/medium-common";
import { ChangeEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { BE_URL } from "../config";

export const Auth = ({ type }: { type: "signup" | "signin" }) => {

    const [postInputs, setPostInput] = useState<SignupInput>({
        username: "",
        password: "",
        name: ""
    });
    const navigate=useNavigate();

    async function sendRequest(){   
        try {
            const response=await axios.post(`${BE_URL}/api/v1/user/${type}`,postInputs);
            const jwt = response.data.jwt;
            const name = response.data.name;
            localStorage.setItem("token",jwt);
            localStorage.setItem("name",name);
            navigate('/blogs');
        } catch {
            alert("Something went gone wrong");
        }

    }

    return (
        <div className="h-screen flex justify-center flex-col">
            <div className="flex justify-center">
                <div>
                    <div className="px-10">
                        <div className="text-3xl font-bold">
                            Create an account
                        </div>

                        <div className="text-slate-400">
                            {type == "signup" ? "Already have an account?" : "Don't have an account?"}
                            <Link className="pl-2 underline" to={(type === "signin") ? '/signup' : '/signin'}>
                                {(type === "signin") ? 'Sign Up' : 'Sign In'}
                            </Link>
                        </div>
                    </div>

                    <div className="pt-8">
                        <LabelledInput label="Email" type={"email"} placeholder="Enter your email" onChange={(e) => {
                            setPostInput(c => ({
                                ...c,
                                username: e.target.value
                            }))
                        }} />
                        {type === "signup" ? <LabelledInput label="Username" type={"text"} placeholder="Enter your name" onChange={(e) => {
                            setPostInput(c => ({
                                ...c,
                                name: e.target.value
                            }))
                        }} /> : null}
                        <LabelledInput label="Password" type={"password"} placeholder="Enter your password" onChange={(e) => {
                            setPostInput(c => ({
                                ...c,
                                password: e.target.value
                            }))
                        }} />
                        <button
                            type="button"
                            onClick={sendRequest}
                            className="w-full mt-8 text-white bg-gray-800
                          hover:bg-gray-900 focus:outline-none 
                           focus:ring-4 focus:ring-gray-300 
                           font-medium rounded-lg text-sm px-5 
                           py-2.5 me-2 mb-2 dark:bg-gray-800 
                           dark:hover:bg-gray-700 dark:focus:ring-gray-700
                           dark:border-gray-700">
                            {type === "signup" ? "Sign up" : "Sign in"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

interface LabelledInputType {
    label: string;
    placeholder: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    type?: string;
}

function LabelledInput({ label, placeholder, onChange, type }: LabelledInputType) {
    return (
        <div>
            <label className="block mb-2 text-sm font-semibold text-black pt-4">{label}</label>
            <input
                onChange={onChange}
                type={type || "text"}
                id="first_name"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
               focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder={placeholder} required />
        </div>
    );
}
