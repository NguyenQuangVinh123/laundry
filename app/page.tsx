import { redirect } from "next/navigation";

export default function Home() {
  return  redirect(`/contacts?startDate=${new Date()}&endDate=${new Date()}&query=`);;
}
