import React, { useState } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Auth = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLogin, setIsLogin] = useState(true);
    const navigate = useNavigate(); 

    //authenticates the user by their email and password
    const handleAuth = async (e) => {
        e.preventDefault();
        try {
            if (isLogin) {
                await signInWithEmailAndPassword(auth, email, password);
            } else {
                await createUserWithEmailAndPassword(auth, email, password);
            }
            navigate("/dashboard"); 
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="auth-container">
            <h2>{isLogin ? "Login" : "Create Account"}</h2>
            {error && <p className="error-message">{error}</p>}
            
            <form onSubmit={handleAuth}>
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="submit">{isLogin ? "Login" : "Sign Up"}</button>
            </form>

            <button className="switch-btn" onClick={
                () => setIsLogin(!isLogin)
                }>
                {isLogin ? "Create an account" : "Already have an account? Login"}
            </button>
        </div>
    );
};

export default Auth;
