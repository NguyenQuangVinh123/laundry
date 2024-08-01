import { redirect } from "next/navigation";

export default function Home() {
  return  redirect(`/contacts?startDate=${new Date().toDateString()}&endDate=${new Date().toDateString()}&query=`);;
}
