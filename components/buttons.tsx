"use client";

import Link from "next/link";
import { IoAddSharp } from "react-icons/io5";
import { useFormStatus } from "react-dom";
import clsx from "clsx";

export const CreateButton = ({link} : {link: string}) => {
  return (
    <Link
      href={link}
      className="inline-flex items-center space-x-1 text-white bg-blue-700 hover:bg-blue-800 px-5 py-[9px] rounded-sm text-sm"
    >
      <IoAddSharp size={20} />
      Create
    </Link>
  );
};

export const SubmitButton = ({ label }: { label: string }) => {
  const { pending } = useFormStatus();

  const className = clsx(
    "text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-sm text-sm w-full px-5 py-3 text-center",
    {
      "opacity-50 cursor-progress": pending,
    }
  );

  return (
    <button type="submit" className={className} disabled={pending}>
      {label === "save" && <span>{pending ? "Saving..." : "Save"}</span>}
    </button>
  );
};
