import React, { useState } from "react";
import axios from "axios";

function App() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [token, setToken] = useState("");

    const handleLogin = async () => {
        try {
            const response = await axios.post("http://127.0.0.1:8000/token", new URLSearchParams({
                username: username,
                password: password
            }), {
                headers: { "Content-Type": "application/x-www-form-urlencoded" }
            });

            setToken(response.data.access_token);
            setMessage("Login successful!");
        } catch (error) {
            setMessage("Login failed!");
        }
    };

    const accessProtectedRoute = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:8000/protected-route", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage(response.data.message);
        } catch (error) {
            setMessage("Access denied!");
        }
    };

    return (
        <div>
            <h1>FastAPI + React Authentication</h1>
            <input type="text" placeholder="Username" onChange={e => setUsername(e.target.value)} />
            <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
            <button onClick={handleLogin}>Login</button>
            <button onClick={accessProtectedRoute}>Access Protected Route</button>
            <p>{message}</p>
        </div>
    );
}

export default App;
