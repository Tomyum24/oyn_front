import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import { useDispatch } from "react-redux";
import { setUser } from "../redux/userSlice";
import { apiFetch } from "../lib/api";

function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function LoginSubmit(e) {
        e.preventDefault();

        if (password.length < 8) {
            toast.error("Password must be at least 8 characters.");
            return;
        }

        try {
            const data = await apiFetch("/api/auth/login", {
                method: "POST",
                body: JSON.stringify({ email, password })
            });

            const token = data.token || data.accessToken || data.jwt;

            if (token) {
                localStorage.setItem("token", token);
                const user = await apiFetch("/api/auth/me");
                dispatch(setUser(user));
                toast.success("You have successfully logged in");
                navigate("/");
            } else {
                toast.error("Unexpected server response. Please try again.");
            }
        } catch (error) {
            if (error.status === 403) {
                toast.error("Your email hasn't been verified. Please check your inbox.");
            } else if (error.status === 401) {
                toast.error("Incorrect email or password.");
            } else if (error.status === 429) {
                toast.error("Too many login attempts. Please wait a moment and try again.");
            } else {
                toast.error(error.message || "Could not connect to the server. Please try again.");
            }
        }
    }

    return (
        <>
            <ToastContainer />
            <div className="login-page">
                <div className="login-box">
                    <form onSubmit={LoginSubmit}>
                        <div className="login-container">
                            <h2>Login</h2>
                            <div className="input-box">
                                <input
                                    type="email"
                                    value={email}
                                    required
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <label>Email</label>
                            </div>
                            <div className="input-box">
                                <input
                                    type="password"
                                    value={password}
                                    required
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <label>Password</label>
                            </div>
                            <div className="login-btn">
                                <button type="submit">Login</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default Login;
