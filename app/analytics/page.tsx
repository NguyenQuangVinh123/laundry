import { requireRole } from "@/lib/auth";
import AnalyticsClient from "./analytics-client";

export default async function AnalyticsPage() {
  await requireRole(["ADMIN", "SUPERVISOR"]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 sm:py-8">
      <AnalyticsClient />
    </div>
  );
}
