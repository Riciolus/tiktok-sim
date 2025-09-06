import { useAuth } from "@/context/AuthContext";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

type LoginModalProps = {
  onClose: () => void;
};

type UserProps = {
  username?: string;
  email: string;
  password: string;
  display_name?: string;
};

export default function LoginModal({ onClose }: LoginModalProps) {
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState<string>("");
  const { setUser } = useAuth();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    display_name: "",
    avatar: "",
  });

  const mutation = useMutation({
    mutationFn: async (payload: UserProps) => {
      const url = isRegister
        ? "http://localhost:8080/api/auth/register"
        : "http://localhost:8080/api/auth/login";

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include", // important for refresh-cookie
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || "Failed request");
      }

      return data;
    },

    onSuccess: (data) => {
      setUser(data.user);
    },

    onError: (error: Error) => {
      setError(error.message);
    },
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (isRegister) {
      mutation.mutate({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        display_name: formData.display_name,
      });
    } else {
      mutation.mutate({
        email: formData.email,
        password: formData.password,
      });
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
      {/* Modal content */}
      <div className="bg-background rounded-2xl shadow-xl w-full max-w-sm p-6 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-white"
        >
          ✕
        </button>

        {/* Title */}
        <h2 className="text-xl font-semibold mb-4 text-center">
          {isRegister ? "Register" : "Login"}
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <>
              <input
                name="username"
                type="text"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-neutral-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                name="display_name"
                type="text"
                placeholder="Display Name"
                value={formData.display_name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-neutral-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </>
          )}

          <input
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-neutral-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-neutral-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full bg-pink-600 text-white py-2 rounded-lg hover:bg-pink-700 transition"
          >
            {mutation.isPending ? "Loading..." : isRegister ? "Register" : "Login"}
          </button>
        </form>

        {error && <div className="text-red-600 mt-2 text-center">{error}</div>}

        {/* Footer */}
        <p className="text-sm text-gray-500 text-center mt-3">
          {isRegister ? (
            <>
              Already have an account?{" "}
              <button
                onClick={() => {
                  setIsRegister(false);
                  setError("");
                  setFormData({
                    username: "",
                    email: "",
                    password: "",
                    display_name: "",
                    avatar: "",
                  });
                }}
                className="text-blue-600"
              >
                Login
              </button>
            </>
          ) : (
            <>
              Don’t have an account?{" "}
              <button
                onClick={() => {
                  setIsRegister(true);
                  setError("");
                  setFormData({
                    username: "",
                    email: "",
                    password: "",
                    display_name: "",
                    avatar: "",
                  });
                }}
                className="text-blue-600"
              >
                Sign up
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
