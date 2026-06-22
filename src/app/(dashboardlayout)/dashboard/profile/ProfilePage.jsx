"use client";

import Link from "next/link";
import { UpdateUserModal } from "@/components/UpdateUserModal";
import { authClient } from "@/lib/auth-client";
import { Avatar } from "@heroui/react";
import { redirect } from "next/navigation";

const ProfilePage = () => {
  const userData = authClient.useSession();
  const user = userData.data?.user;

//   if(!user) {
//     redirect('/signin')
//   }

  return (
    <div className="py-10 px-4 md:px-10">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <h3 className="text-lg font-semibold mb-4">Edit Profile</h3>
            <div className="flex items-center gap-4 mb-6">
              <Avatar className="h-16 w-16">
                <Avatar.Image
                  alt="User"
                  src={user?.image}
                  referrerPolicy="no-referrer"
                />
                <Avatar.Fallback>{user?.name?.charAt(0)}</Avatar.Fallback>
              </Avatar>
              <div>
                <div className="font-semibold">{user?.name}</div>
                <div className="text-xs text-slate-500 mb-1">{user?.email}</div>
                {(user?.plan === "premium" || user?.isPremium) && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 px-2.5 py-0.5 text-xs font-semibold text-white">
                    👑 Premium
                  </span>
                )}
              </div>
            </div>

            <UpdateUserModal />
          </div>
        </div>

        <div>
          {user?.plan === "premium" || user?.isPremium ? (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-center">
              <div className="text-3xl">👑</div>
              <h4 className="mt-4 font-semibold">Premium Member</h4>
              <div className="mt-3 inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-amber-700">✓ Active Premium</div>
              <p className="text-sm text-slate-500 mt-3">You have unlimited recipe uploads and a premium badge</p>
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center">
              <div className="text-3xl">👑</div>
              <h4 className="mt-4 font-semibold">Go Premium</h4>
              <p className="text-sm text-slate-500 mt-3">Unlock unlimited recipe uploads and exclusive features</p>
              <div className="mt-6">
                <Link href="/dashboard/upgrade" className="rounded-full bg-slate-900 px-6 py-3 text-white">Upgrade to Premium</Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
