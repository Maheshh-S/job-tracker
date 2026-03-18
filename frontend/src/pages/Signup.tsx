import { useState } from "react";
import { signupUser } from "../services/authService";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await signupUser(email, password);
      toast.success("Signup successful");
      navigate("/");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div>
      <h2>Signup</h2>

      <form onSubmit={handleSignup}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Signup</button>
      </form>
    </div>
  );
};

export default Signup;