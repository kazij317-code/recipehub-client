"use client";

import React, { useEffect, useState } from "react";
import { fetchAllUsersAdmin, updateUserRoleAdmin, toggleUserBlockAdmin } from "@/lib/actions/admin";
import { Shield, User as UserIcon, Crown, Check, Ban } from "lucide-react";
import toast from "react-hot-toast";

const ManageUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionUserId, setActionUserId] = useState(null);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await fetchAllUsersAdmin();
        setUsers(data);
      } catch (error) {
        console.error("Failed to load users:", error);
        toast.error("Failed to fetch users.");
      } finally {
        setLoading(false);
      }
    };
    loadUsers();
  }, []);

  const handleToggleRole = async (userId, currentRole) => {
    const nextRole = currentRole === "admin" ? "user" : "admin";
    setActionUserId(userId);
    try {
      await updateUserRoleAdmin(userId, nextRole);
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, role: nextRole } : u))
      );
      toast.success(`User role updated to ${nextRole}`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update role");
    } finally {
      setActionUserId(null);
    }
  };

  const handleToggleBlock = async (userId, currentStatus) => {
    setActionUserId(userId);
    try {
      const response = await toggleUserBlockAdmin(userId, currentStatus);
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, status: response.status } : u))
      );
      toast.success(response.status === "blocked" ? "User account blocked" : "User account unblocked");
    } catch (error) {
      console.error(error);
      toast.error("Failed to change user status");
    } finally {
      setActionUserId(null);
    }
  };

  if (loading) {
    return (
      <div className="py-10 px-4 md:px-10 text-center">
        <p className="text-lg text-slate-700 dark:text-slate-300 animate-pulse">
          Loading users registry...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 py-10 px-4 md:px-10 bg-slate-50/50 dark:bg-zinc-950/20 min-h-screen">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Manage Users 👥
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Block/unblock users and manage roles
        </p>
      </div>

      <div className="overflow-x-auto rounded-3xl border border-slate-100 bg-white dark:border-zinc-800/80 dark:bg-zinc-900/50 shadow-xs">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-slate-100 text-slate-400 dark:border-zinc-800 dark:bg-zinc-900/10">
              <th className="px-6 py-4 text-left font-medium text-xs uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-4 text-left font-medium text-xs uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-4 text-left font-medium text-xs uppercase tracking-wider">
                Premium
              </th>
              <th className="px-6 py-4 text-left font-medium text-xs uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left font-medium text-xs uppercase tracking-wider">
                Joined
              </th>
              <th className="px-6 py-4 text-left font-medium text-xs uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
            {users.map((u, index) => {
              const userName = u.name || u.email?.split("@")[0] || "User";
              const userAvatar = u.image || u.picture || `https://ui-avatars.com/api/?name=${userName}`;
              const isBlocked = u.status === "blocked";
              const isPremium = u.plan === "premium" || u.isPremium;
              const formattedDate = u.createdAt
                ? new Date(u.createdAt).toLocaleDateString("en-GB")
                : "08/01/2026";

              return (
                <tr
                  key={u._id || index}
                  className="transition hover:bg-slate-50/50 dark:hover:bg-zinc-800/20"
                >
                  {/* User Profile Info */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={userAvatar}
                        alt={userName}
                        className="h-10 w-10 rounded-full object-cover border border-slate-200 dark:border-zinc-700 shadow-2xs"
                      />
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-900 dark:text-white">
                          {userName}
                        </span>
                        <span className="text-xs text-slate-400 dark:text-slate-500">
                          {u.email}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Role Badge (Clickable to toggle) */}
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleToggleRole(u._id, u.role)}
                      disabled={actionUserId === u._id}
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold border transition ${
                        u.role === "admin"
                          ? "bg-purple-50 text-purple-700 border-purple-100 hover:bg-purple-100/50 dark:bg-purple-950/20 dark:border-purple-900/30 dark:text-purple-400"
                          : "bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-100/50 dark:bg-blue-950/20 dark:border-blue-900/30 dark:text-blue-400"
                      }`}
                      title="Click to toggle role"
                    >
                      {u.role === "admin" ? (
                        <>
                          <Shield size={12} className="text-purple-600" />
                          <span>Admin</span>
                        </>
                      ) : (
                        <>
                          <UserIcon size={12} className="text-blue-600" />
                          <span>User</span>
                        </>
                      )}
                    </button>
                  </td>

                  {/* Premium status */}
                  <td className="px-6 py-4">
                    {isPremium ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/20 dark:border-emerald-900/30 dark:text-emerald-400">
                        <Crown size={12} className="text-emerald-600" />
                        <span>Premium</span>
                      </span>
                    ) : (
                      <span className="text-slate-400 dark:text-slate-500 text-xs font-medium pl-3">
                        Free
                      </span>
                    )}
                  </td>

                  {/* Account Status */}
                  <td className="px-6 py-4">
                    {isBlocked ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 border border-rose-100 px-3 py-1 text-xs font-semibold text-rose-700 dark:bg-rose-950/20 dark:border-rose-900/30 dark:text-rose-400">
                        <Ban size={12} className="text-rose-600" />
                        <span>Blocked</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/20 dark:border-emerald-900/30 dark:text-emerald-400">
                        <Check size={12} className="text-emerald-600" />
                        <span>Active</span>
                      </span>
                    )}
                  </td>

                  {/* Joined Date */}
                  <td className="px-6 py-4 text-slate-500 dark:text-slate-400 text-xs">
                    {formattedDate}
                  </td>

                  {/* Actions Column */}
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleToggleBlock(u._id, u.status)}
                      disabled={actionUserId === u._id || u.role === "admin"}
                      className={`w-20 rounded-lg py-1.5 text-xs font-bold border transition ${
                        u.role === "admin"
                          ? "bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-500"
                          : isBlocked
                          ? "bg-emerald-50 border-emerald-100 hover:bg-emerald-100 text-emerald-600 dark:bg-emerald-950/20 dark:border-emerald-900/30 dark:text-emerald-400"
                          : "bg-rose-50 border-rose-100 hover:bg-rose-100 text-rose-600 dark:bg-rose-950/20 dark:border-rose-900/30 dark:text-rose-400"
                      }`}
                    >
                      {actionUserId === u._id ? "..." : isBlocked ? "Unblock" : "Block"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUsersPage;
