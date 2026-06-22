"use client";
import { authClient } from "@/lib/auth-client";
import { ArrowRightFromSquare } from "@gravity-ui/icons";
import { Dropdown } from "@heroui/react";
import { User, ChevronDown } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const DropdownButton = ({ user }) => {
  const router = useRouter();

  const handleLogout = async () => {
    await authClient.signOut();
    toast.success("logout successfully");
  };

  return (
    <Dropdown>
      <Dropdown.Trigger>
        <div className="flex items-center gap-3 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          <Image
            width={40}
            height={40}
            src={
              user?.image ||
              user?.Image ||
              "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?q=80&w=400"
            }
            alt={user?.name || "avatar"}
            className="w-10 h-10 rounded-full object-cover"
          />

          <div className="text-left hidden lg:block">
            <p className="text-sm font-bold truncate max-w-24 text-slate-900 dark:text-white">
              {user?.name}
            </p>
          </div>
          <ChevronDown className="text-slate-700 dark:text-slate-300" />
        </div>
      </Dropdown.Trigger>
      <Dropdown.Popover>
        <div className="px-4 py-3 border-b">
          <div className="flex items-center gap-3">
            <div>
              <p className="font-semibold">Welcome back!</p>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
          </div>
        </div>

        <Dropdown.Menu>
          <Dropdown.Item
            className="w-full flex items-center gap-2"
            onAction={() => router.push(`/dashboard/${user.role}`)}
          >
            <User size={16} className="text-gray-500" />
            Dashboard
          </Dropdown.Item>
          <Dropdown.Item
            className="w-full flex items-center gap-2 text-danger"
            variant="danger"
            onAction={handleLogout}
          >
            <ArrowRightFromSquare className="size-3.5 text-danger" />
            Logout
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );
};

export default DropdownButton;
