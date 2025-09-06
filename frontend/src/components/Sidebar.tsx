import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useMutation } from "@tanstack/react-query";

type SidebarProps = {
  onLoginClick: () => void;
};

const sidebarItems = [
  { name: "For You", url: "/" },
  { name: "Explore", url: "/explore" },
  { name: "Following", url: "/following" },
];

async function logoutRequest() {
  return fetch("http://localhost:8080/api/auth/logout", {
    method: "POST",
    credentials: "include",
  }).then((res) => {
    if (!res.ok) {
      throw new Error("Logout failed");
    }
    return res.json().catch(() => null); // handle empty body
  });
}

export function useLogout() {
  return useMutation({
    mutationFn: logoutRequest,
    onSuccess: () => {
      window.location.reload(); 
    },
    onError: (error) => {
      console.error("Logout error:", error);
    },
  });
}

const Sidebar = ({ onLoginClick }: SidebarProps) => {
  const { user} = useAuth();
  const { mutate: logout } = useLogout();

  return (
    <div className="p-5">
      <h1 className="py-3 text-xl">TOKTOK</h1>
      <div className="flex flex-col space-y-3">
        {sidebarItems.map((item, i) => (
          <Link href={item.url} key={i}>
            {item.name}
          </Link>
        ))}
        {user ? (
          <>
            <span>Profile</span>
            <span>{user.username}</span>
            <span>{user.id}</span>
            <button onClick={() => logout()}>Logout</button>
          </>
        ) : (
          <button
            onClick={onLoginClick}
            className="px-3 py-1.5 bg-pink-700 rounded-lg cursor-pointer hover:bg-pink-900"
          >
            Log In
          </button>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
