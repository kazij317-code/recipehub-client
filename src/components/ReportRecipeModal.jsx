"use client";

import React, { useState } from "react";
import { Modal, Button } from "@heroui/react";
import { AlertTriangle, X } from "lucide-react";
import toast from "react-hot-toast";
import { reportRecipeIssue } from "@/lib/actions/admin";

export default function ReportRecipeModal({ recipeId, recipeName, userEmail, onSuccess }) {
  const [reason, setReason] = useState("Spam");
  const [details, setDetails] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!userEmail) {
      toast.error("You must be signed in to report an issue.");
      return;
    }

    setLoading(true);
    try {
      await reportRecipeIssue(recipeId, userEmail, reason, details || "—");
      toast.success("Thank you for your report. Admin will review it.");
      setDetails("");
      setReason("Spam");
      if (onSuccess) onSuccess();
    } catch (error) {
      toast.error(error?.message || "Failed to submit report.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal>
      {/* Trigger Button */}
      <Button
        className="flex items-center gap-2 text-left text-slate-700 hover:text-cyan-600 dark:text-slate-300 dark:hover:text-cyan-400 font-medium bg-transparent p-0 h-auto min-w-0 shadow-none border-none hover:bg-transparent cursor-pointer transition-colors active:scale-100"
      >
        Report Issue
      </Button>

      {/* Modal Backdrop and Container */}
      <Modal.Backdrop className="bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm">
        <Modal.Container placement="auto">
          {/* Modal.Dialog renders the overlay box */}
          <Modal.Dialog className="w-full max-w-md bg-white dark:bg-[#0f1319] border border-slate-200 dark:border-slate-800/80 rounded-[2rem] shadow-2xl p-6 text-left transition-colors overflow-hidden relative">
            
            {/* Custom Close Button */}
            <Modal.CloseTrigger className="absolute right-6 top-6 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer">
              <X className="w-5 h-5" />
            </Modal.CloseTrigger>

            {/* Header */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Report Recipe
              </h2>
            </div>

            {/* Reporting Recipe Info */}
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              Reporting: <span className="font-bold text-slate-900 dark:text-white">{recipeName}</span>
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Reason Selector */}
              <div>
                <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-3">
                  Reason <span className="text-red-500">*</span>
                </label>
                <div className="space-y-3">
                  {[
                    { id: "Spam", label: "Spam" },
                    { id: "Offensive Content", label: "Offensive Content" },
                    { id: "Copyright Issue", label: "Copyright Issue" },
                  ].map((option) => (
                    <div
                      key={option.id}
                      onClick={() => setReason(option.id)}
                      className={`border rounded-2xl p-4 flex items-center gap-3 cursor-pointer transition-all ${
                        reason === option.id
                          ? "border-red-600 bg-red-50/50 dark:bg-red-950/20"
                          : "border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-900/50"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                          reason === option.id
                            ? "border-red-600"
                            : "border-slate-300 dark:border-zinc-700"
                        }`}
                      >
                        {reason === option.id && (
                          <div className="w-2.5 h-2.5 rounded-full bg-red-600" />
                        )}
                      </div>
                      <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                        {option.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Additional Details */}
              <div>
                <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-2">
                  Additional Details (optional)
                </label>
                <textarea
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Provide more context..."
                  className="w-full border border-slate-200 dark:border-zinc-800 rounded-2xl p-4 text-sm bg-transparent text-slate-800 dark:text-slate-200 focus:ring-1 focus:ring-red-500 focus:border-red-500 outline-none resize-none h-28 transition-colors"
                />
              </div>

              {/* Footer / Actions */}
              <div className="flex gap-4 pt-2">
                <Button 
                  slot="close" 
                  className="flex-1 border border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-900/50 rounded-2xl py-6 font-semibold text-slate-700 dark:text-slate-200 bg-transparent text-center text-sm transition-colors cursor-pointer"
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  slot="close"
                  isLoading={loading}
                  className="flex-1 bg-red-700 hover:bg-red-800 disabled:bg-red-700/50 rounded-2xl py-6 font-semibold text-white text-center text-sm transition-colors cursor-pointer"
                >
                  Submit Report
                </Button>
              </div>
            </form>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
