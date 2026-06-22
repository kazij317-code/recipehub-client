"use client";

import { authClient } from "@/lib/auth-client";
import { Button, Input, Label, Modal, Surface, TextField } from "@heroui/react";
import { useState } from "react";
import toast from "react-hot-toast";
import { BiEdit, BiUser } from "react-icons/bi";

export function UpdateUserModal() {
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const name = e.target.name.value;
    const image = e.target.image.value;

    try {
      await authClient.updateUser({
        name,
        image
      });
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal>
      {/* Trigger Button component adjusted for layout consistency */}
      <Button 
        variant="secondary"
        className="font-bold rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer gap-2"
      >
        <BiEdit className="w-4 h-4" /> Update Profile
      </Button>

      {/* Modal Overlay Backdrop overlay layout configuration */}
      <Modal.Backdrop className="bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm">
        <Modal.Container placement="auto">
          <Modal.Dialog className="sm:max-w-md bg-white dark:bg-[#0f1319] border border-slate-200 dark:border-slate-800/80 rounded-[2.5rem] shadow-2xl p-2 text-left transition-colors overflow-hidden">
            <Modal.CloseTrigger className="absolute right-5 top-5 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors" />
            
            <Modal.Header className="flex items-center gap-3 px-6 pt-6 pb-2">
              <Modal.Icon className="bg-blue-50 dark:bg-purple-950/40 text-blue-600 dark:text-purple-400 rounded-xl w-10 h-10 flex items-center justify-center transition-colors">
                <BiUser className="w-5 h-5" />
              </Modal.Icon>
              <Modal.Heading className="text-xl font-black text-slate-900 dark:text-white transition-colors">
                Update User
              </Modal.Heading>
            </Modal.Header>

            <Modal.Body className="px-6 pb-6 pt-2">
              <Surface variant="default" className="bg-transparent shadow-none border-none p-0">
                <form onSubmit={onSubmit} className="flex flex-col gap-5">
                  
                  {/* Name field controller configuration */}
                  <TextField className="flex flex-col gap-1.5 w-full" name="name" type="text">
                    <Label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 transition-colors">
                      Full Name
                    </Label>
                    <Input 
                      placeholder="Enter your name"
                       
                      classNames={{
                        inputWrapper: "bg-slate-50/50 dark:bg-[#0b0f17]/50 border border-slate-200 dark:border-slate-800 h-12 rounded-xl focus-within:!border-blue-600 dark:focus-within:!border-purple-500 transition-colors",
                        input: "text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm font-medium",
                      }}
                    />
                  </TextField>

                  {/* Image input field pattern controller */}
                  <TextField className="flex flex-col gap-1.5 w-full" name="image" type="url">
                    <Label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 transition-colors">
                      Avatar Image URL
                    </Label>
                    <Input 
                      placeholder="https://example.com/avatar.jpg" 
                      classNames={{
                        inputWrapper: "bg-slate-50/50 dark:bg-[#0b0f17]/50 border border-slate-200 dark:border-slate-800 h-12 rounded-xl focus-within:!border-blue-600 dark:focus-within:!border-purple-500 transition-colors",
                        input: "text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm font-medium",
                      }}
                    />
                  </TextField>

                  {/* Footer Actions Wrapper Block */}
                  <Modal.Footer className="flex gap-3 pt-4 border-t border-slate-100 dark:border-slate-800/40 mt-2">
                    <Button 
                      slot="close" 
                      variant="secondary"
                      className="flex-1 h-11 font-bold rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                    >
                      Cancel
                    </Button>
                    
                    <Button 
                      isLoading={loading}
                      type="submit" 
                      slot="close"
                      className="flex-1 h-11 font-bold rounded-xl text-white bg-gradient-to-r from-[#1d63ed] via-[#653df5] to-[#a426e7] hover:opacity-95 shadow-lg shadow-purple-500/10 transition-all active:scale-[0.99] cursor-pointer"
                    >
                      Save Changes
                    </Button>
                  </Modal.Footer>

                </form>
              </Surface>
            </Modal.Body>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}