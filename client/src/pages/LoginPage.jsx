import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5050/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      localStorage.setItem("token", data.token);
      toast.success("Login successful");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDF5F0]">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md border border-[#C9C9C9]">
        <h2 className="text-2xl font-bold text-center text-[#2A4759] mb-6">
          Welcome Back!
        </h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 border border-[#C9C9C9] rounded focus:outline-none focus:ring-2 focus:ring-[#2A4759]"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 border border-[#C9C9C9] rounded focus:outline-none focus:ring-2 focus:ring-[#2A4759]"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className="w-full bg-[#F79B72] hover:bg-[#e88d66] text-white py-2 rounded transition duration-200"
          >
            Log In
          </button>
        </form>
        <p className="mt-4 text-sm text-center text-[#2A4759]">
          Use test credentials or register via Postman.
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
