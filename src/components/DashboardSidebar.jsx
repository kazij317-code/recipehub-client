import { getUserSession } from "../lib/session/session";
import NavItem from "./NavItem";

const DashboardSidebar = async () => {
  const user = await getUserSession();
  const daashboardItems = {
    user: [
      {
        id: "overview",
        label: "Overview",
        path: "/dashboard",
        icon: "overview",
      },
      {
        id: "add-recipe",
        label: "Add Recipe",
        path: "/dashboard/user/add-recipe",
        icon: "add-recipe",
      },
      {
        id: "my-recipes",
        label: "My Recipes",
        path: "/dashboard/my-recipes",
        icon: "my-recipes",
      },
      {
        id: "favorites",
        label: "Favorites",
        path: "/dashboard/favorites",
        icon: "favorites",
      },
      {
        id: "purchased",
        label: "Purchased",
        path: "/dashboard/purchased",
        icon: "purchased",
      },
      {
        id: "profile",
        label: "Profile",
        path: "/dashboard/profile",
        icon: "profile",
      },
    ],
    admin: [
      {
        id: "overview",
        label: "Overview",
        path: "/dashboard/admin",
        icon: "overview",
      },
      {
        id: "manage-users",
        label: "Manage Users",
        path: "/dashboard/admin/users",
        icon: "manage-users",
      },
      {
        id: "manage-recipes",
        label: "Manage Recipes",
        path: "/dashboard/admin/recipes",
        icon: "manage-recipes",
      },
      {
        id: "reports",
        label: "Reports",
        path: "/dashboard/admin/reports",
        icon: "reports",
      },
      {
        id: "transactions",
        label: "Transactions",
        path: "/dashboard/admin/transactions",
        icon: "transactions",
      },
    ],
  };

  const navItems = daashboardItems[user?.role || "user"];
  const userName = user?.name || user?.email?.split("@")[0] || "User";
  const userEmail = user?.email || "user@example.com";
  const userImage = user?.picture || "https://ui-avatars.com/api/?name=" + userName;
  const isAdmin = user?.role === "admin";

  return (
    <aside className="hidden lg:block w-64 h-screen shrink-0 border-r border-slate-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 sticky top-0 overflow-y-auto">
      {/* Sidebar Header Section */}
      {isAdmin ? (
        <div className="mb-8 flex items-center gap-3 border-b border-slate-100 pb-5 dark:border-zinc-800">
          <span className="text-2xl">🛡️</span>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Admin Panel
          </h2>
        </div>
      ) : (
        <div className="mb-8 space-y-4">
          <div className="flex items-center gap-3">
            <img
              src={userImage}
              alt={userName}
              className="h-12 w-12 rounded-full object-cover"
            />
            <div className="flex-1 min-w-0">
              <h3 className="truncate font-semibold text-slate-900 dark:text-white">
                {userName}
              </h3>
              <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                {userEmail}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <NavItem navItems={navItems} user={user} />
    </aside>
  );

};
export default DashboardSidebar;
