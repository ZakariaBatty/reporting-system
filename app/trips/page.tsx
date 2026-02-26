import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { TripsContainer } from "@/components/trips/TripsContainer";

export const metadata = {
  title: "Trips - TransitHub",
  description: "Manage and monitor transportation trips",
};

export default async function TripsPage() {
  const session = await auth();

  // Redirect if not authenticated
  if (!session?.user?.id) {
    redirect("/auth/login");
  }

  // Only authenticated users can access trips
  return <TripsContainer />;
}
