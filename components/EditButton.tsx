"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { showBillPopup } from "@/components/bill-complete-popup";

interface EditButtonProps {
  id: string;
  canManage: boolean;
  canEdit: boolean;
}

export default function EditButton({ id, canManage, canEdit }: EditButtonProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathName = usePathname();

  if (!canEdit) return null;

  return (
    <div className="cursor-pointer">
      <div className="flex gap-2 items-center">
        <svg
          onClick={() => showBillPopup(id)}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-6 h-6 text-pink-500 transition-transform duration-200 hover:scale-110 hover:text-pink-700 cursor-pointer"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.935-2.186 2.25 2.25 0 0 0-3.935 2.186Z"
          />
        </svg>

        {canManage && (
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
          className="w-6 h-6 text-blue-500 transition-transform duration-200 hover:scale-110 hover:text-blue-700 cursor-pointer"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.232 5.232a2.828 2.828 0 014 4L7.5 21H3v-4.5L15.232 5.232z"
          />
        </svg>
        )}

        {canManage && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-6 h-6 text-red-500 transition-transform duration-200 hover:scale-110 hover:text-red-700"
          onClick={async () => {
            try {
              const confirmDelete = window.confirm(
                "Bạn có chắc muốn xóa bill này?"
              );
              if (!confirmDelete) return;
              const response = await axios.delete("/api/deleteContact", {
                data: { id: parseInt(id) },
              });
              if (response.data.message === "Okay") {
                router.refresh();
              }
            } catch (error) {
              console.error("Error deleting contact:", error);
              alert("Không xóa được bill");
            }
          }}
        >
          <path d="M3 6h18"></path>
          <path d="M19 6l-2 14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L5 6"></path>
          <path d="M10 11v6"></path>
          <path d="M14 11v6"></path>
          <polyline points="1 1 23 23"></polyline>
        </svg>
        )}
      </div>
    </div>
  );
}
