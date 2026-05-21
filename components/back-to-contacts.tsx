import Link from "next/link";
import { IoArrowBack } from "react-icons/io5";

export default function BackToContacts() {
  return (
    <Link
      href="/contacts"
      className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors mb-4"
    >
      <IoArrowBack size={18} />
      Quay lại danh sách
    </Link>
  );
}
