import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useMutation } from "@tanstack/react-query";
import {
  Compass,
  Home,
  PlusSquare,
  User,
  UserCircle2,
  Users,
} from "lucide-react";

type SidebarProps = {
  onLoginClick: () => void;
};

const sidebarItems = [
  { name: "For You", url: "/", icon: Home },
  { name: "Explore", url: "/explore", icon: Compass },
  { name: "Following", url: "/following", icon: Users },
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
  const { user } = useAuth();
  const { mutate: logout } = useLogout();

  return (
    <div className="px-6">
      <h1 className="py-3 text-2xl font-semibold cursor-pointer hover:text-pink-600">
        <Link href="/">TOKTOK</Link>
      </h1>
      <div className="flex flex-col space-y-3">
        {sidebarItems.map((item, i) => (
          <Link href={item.url} key={i} className="flex items-center gap-3">
            <item.icon className="w-5 h-5" />
            {item.name}
          </Link>
        ))}
        {user ? (
          <>
            <Link
              href={`/profile/${user.id}`}
              className="flex items-center gap-3"
            >
              <UserCircle2 className="w-5 h-5" />
              Profile
            </Link>
            <Link href="/upload" className="flex items-center gap-3">
              <PlusSquare className="w-5 h-5" />
              Upload
            </Link>
            <button
              onClick={() => logout()}
              className="px-3 py-1.5 bg-pink-700 rounded-lg cursor-pointer hover:bg-pink-900"
            >
              Logout
            </button>
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
