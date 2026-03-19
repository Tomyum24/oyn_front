import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import bcrypt from "bcryptjs";

import { useDispatch } from "react-redux";
import { setUser } from "../redux/userSlice";

function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function LoginSubmit(e) {
        e.preventDefault();

        const response = await fetch(`http://localhost:3001/users?email=${email}`);
        const data = await response.json();

        if (!data || data.length === 0) {
            toast.error("User not found");
            return;
        }

        const user = data[0];

        const checkPassword = await bcrypt.compare(password, user.password);

        if (checkPassword) {
            toast.success("You have successfully logged in")
            dispatch(setUser(user))
            navigate("/");
        } else {
            toast.error("Invalid credentials");
        }

    }

    return (
        <>
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
