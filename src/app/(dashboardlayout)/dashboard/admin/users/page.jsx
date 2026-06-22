"use client";

import React, { useEffect, useState } from "react";
import { fetchAllUsersAdmin, updateUserRoleAdmin, deleteUserAdmin } from "@/lib/actions/admin";
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
      toast.error(error?.message || "Failed to update role");
    } finally {
      setActionUserId(null);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm("Are you sure you want to permanently delete this user?")) return;

    setActionUserId(userId);
    try {
      await deleteUserAdmin(userId);
      setUsers((prev) => prev.filter((u) => u._id !== userId));
      toast.success("User deleted successfully");
    } catch (error) {
      console.error(error);
      toast.error(error?.message || "Failed to delete user");
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
    <div className="space-y-6 py-10 px-4 md:px-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Manage Users
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Review accounts, edit roles, and delete platform members.
        </p>
      </div>

      <hr className="border-slate-200 dark:border-zinc-800" />

      {users.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-slate-500 dark:text-slate-400">No users found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 shadow-xs">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 dark:border-zinc-800 dark:bg-zinc-800/50">
                <th className="px-6 py-4 text-left font-semibold tracking-wider text-slate-500 uppercase text-xs dark:text-slate-400">
                  User
                </th>
                <th className="px-6 py-4 text-left font-semibold tracking-wider text-slate-500 uppercase text-xs dark:text-slate-400">
                  Email
                </th>
                <th className="px-6 py-4 text-left font-semibold tracking-wider text-slate-500 uppercase text-xs dark:text-slate-400">
                  Role
                </th>
                <th className="px-6 py-4 text-left font-semibold tracking-wider text-slate-500 uppercase text-xs dark:text-slate-400">
                  Plan
                </th>
                <th className="px-6 py-4 text-left font-semibold tracking-wider text-slate-500 uppercase text-xs dark:text-slate-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, index) => {
                const userName = u.name || u.email?.split("@")[0] || "User";
                const userAvatar = u.image || u.picture || `https://ui-avatars.com/api/?name=${userName}`;

                return (
                  <tr
                    key={u._id || index}
                    className="border-b border-slate-100 transition hover:bg-slate-50 dark:border-zinc-800 dark:hover:bg-zinc-800/40"
                  >
                    {/* User Avatar + Name */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={userAvatar}
                          alt={userName}
                          className="h-10 w-10 rounded-full object-cover border border-slate-100 dark:border-zinc-800"
                        />
                        <span className="font-semibold text-slate-900 dark:text-white">
                          {userName}
                        </span>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                      {u.email}
                    </td>

                    {/* Role */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider ${
                          u.role === "admin"
                            ? "bg-rose-100 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400"
                            : "bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400"
                        }`}
                      >
                        {u.role || "user"}
                      </span>
                    </td>

                    {/* Plan */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider ${
                          u.plan === "premium"
                            ? "bg-purple-100 text-purple-700 dark:bg-purple-950/30 dark:text-purple-400"
                            : "bg-slate-100 text-slate-700 dark:bg-zinc-800 dark:text-slate-400"
                        }`}
                      >
                        {u.plan || "free"}
                      </span>
                    </td>

                    {/* Action buttons */}
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleToggleRole(u._id, u.role)}
                          disabled={actionUserId === u._id}
                          className="rounded-lg border border-slate-200 bg-white hover:bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 transition dark:border-zinc-700 dark:bg-zinc-800 dark:text-slate-200 dark:hover:bg-zinc-700"
                        >
                          {u.role === "admin" ? "Demote to User" : "Make Admin"}
                        </button>
                        <button
                          onClick={() => handleDeleteUser(u._id)}
                          disabled={actionUserId === u._id}
                          className="rounded-lg bg-rose-50 hover:bg-rose-100 px-3 py-1.5 text-xs font-semibold text-rose-600 transition dark:bg-rose-950/20 dark:hover:bg-rose-950/30 dark:text-rose-400"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageUsersPage;
