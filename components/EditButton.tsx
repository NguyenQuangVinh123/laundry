"use client";
import React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { useLocalStorage } from "usehooks-ts";

interface EditButtonProps {
  id: string;
}

export default function EditButton({ id }: EditButtonProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathName = usePathname();
  const [value, setValue, removeValue] = useLocalStorage("isAdmin", false);

  return (
    <div className="cursor-pointer">
      {value && (
        <div className="flex gap-2 items-center">
          {/* Edit Icon */}
          <svg
            onClick={() => {
              const params = new URLSearchParams(searchParams.toString());
              params.set("id", id);
              router.replace(`${pathName}/create?${params.toString()}`);
            }}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6 text-blue-500 transition-transform duration-200 hover:scale-110 hover:text-blue-700"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.232 5.232a2.828 2.828 0 014 4L7.5 21H3v-4.5L15.232 5.232z"
            />
          </svg>

          {/* Delete Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            className="w-6 h-6 text-red-500 transition-transform duration-200 hover:scale-110 hover:text-red-700"
            onClick={async () => {
              try {
                const confirmDelete = window.confirm("Are you sure you want to delete this bill?");
                if (!confirmDelete) return;
                const response = await axios.delete("/api/deleteContact", {
                  data: { id: parseInt(id) },
                });
                if (response.data.message === "Okay") {
                  window.location.reload();
                }
              } catch (error) {
                console.error("Error deleting contact:", error);
                return { message: "Failed to delete contact" };
              }
            }}
          >
            <path d="M3 6h18"></path>
            <path d="M19 6l-2 14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L5 6"></path>
            <path d="M10 11v6"></path>
            <path d="M14 11v6"></path>
            <polyline points="1 1 23 23"></polyline>
          </svg>
        </div>
      )}
    </div>

  );
}
