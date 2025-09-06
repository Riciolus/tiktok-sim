import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

type SidebarProps = {
  onLoginClick: () => void;
};

const sidebarItems = [
  { name: "For You", url: "/" },
  { name: "Explore", url: "/explore" },
  { name: "Following", url: "/following" },
];

const Sidebar = ({ onLoginClick }: SidebarProps) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
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
          <span>Profike</span>
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
