"use client";
import React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { useLocalStorage } from "usehooks-ts";

interface EditButtonProps {
  readonly id: string;
}

export default function EditButton({ id }: EditButtonProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathName = usePathname();
  const [value, setValue, removeValue] = useLocalStorage("isAdmin", false);

  return (
    <td className="cursor-pointer">
      {value && (
        <div className="flex gap-1">
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
            className="w-5 h-5 mr-1"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.232 5.232a2.828 2.828 0 014 4L7.5 21H3v-4.5L15.232 5.232z"
            />
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            onClick={async () => {
              try {
                const checking = window.confirm(
                  "Are you sure you want to delete this bill?"
                );
                if (!checking) return;
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
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6l-2 14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L5 6"></path>
            <path d="M10 11v6"></path>
            <path d="M14 11v6"></path>
            <line x1="1" y1="1" x2="23" y2="23"></line>
          </svg>
        </div>
      )}
    </td>
  );
}
