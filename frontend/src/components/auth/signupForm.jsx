// components/auth/SignupForm.jsx
import { useState } from "react";

const SignupForm = ({ onSubmit, loading, error }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(username, email, password);
      }}
    >
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div>
        <label className="block text-sm font-medium text-gray-700">
          UserName :
        </label>
        <div>
          <input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="mt-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 "
          />
        </div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 mt-3"
        >
          Email :
        </label>
        <div>
          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 "
          />
        </div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700 mt-3"
        >
          Password :
        </label>
        <div>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 "
          />
        </div>
      </div>
      <div className="text-center">
        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary mt-3 mb-3"
        >
          {loading ? "Signing up..." : "Sign Up"}
        </button>
      </div>
    </form>
  );
};

export default SignupForm;
