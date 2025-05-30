"use client";

import { IoSearch } from "react-icons/io5";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

const Search = () => {
  const searchParams: any = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);
  const handleChange = (e: any) => {
    const params = new URLSearchParams(searchParams);
    params.set("date", e);
    replace(`${pathname}?${params.toString()}`);
  };
  return (
    <div className="relative flex flex-1 flex-col gap-2">
      <div>
        <input
          type="text"
          className="w-full border border-gray-200 py-2 pl-10 text-sm outline-2 rounded-sm"
          placeholder="Search..."
          onChange={(e) => handleSearch(e.target.value)}
          defaultValue={searchParams.get("query")?.toString()}
        />
        <IoSearch className="absolute left-3 top-2 h-5 w-5 text-gray-500" />
      </div>

      <input
        max={new Date().toISOString().split("T")[0]}
        className="w-full border border-gray-200 py-1 pl-2 text-sm outline-2 rounded-sm"
        type="date"
        onChange={(e) => handleChange(e.target.value)}
      />
    </div>
  );
};

export default Search;
