"use client";

import { useAuth } from "@/lib/auth-context";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreateTripModal } from "@/components/create-trip-modal";
import { TripCard } from "@/components/trip-card";
import { TripsAPI } from "@/lib/trips-api";
import { Trip } from "@/types/trip";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [trips, setTrips] = useState<Trip[]>([]);
    const [loading, setLoading] = useState(true);
    const [createModalOpen, setCreateModalOpen] = useState(false);

    useEffect(() => {
        if (!authLoading && user) {
            loadTrips();
        }
    }, [authLoading, user]);

    const loadTrips = async () => {
        if (!user) return;

        try {
            setLoading(true);
            const data = await TripsAPI.getUserTrips(user.id);
            setTrips(data);
        } catch (error) {
            console.error("Error loading trips:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateTrip = async (data: { name: string; members: { phone_number: string; name?: string }[] }) => {
        if (!user) return;

        try {
            await TripsAPI.createTrip(user.id, data);
            await loadTrips();
        } catch (error) {
            console.error("Error creating trip:", error);
            throw error;
        }
    };

    const handleViewTrip = (tripId: string) => {
        router.push(`/dashboard/trips/${tripId}`);
    };

    if (authLoading || loading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <Skeleton className="h-10 w-48" />
                    <Skeleton className="h-10 w-32" />
                </div>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-64" />
                    ))}
                </div>
            </div>
        );
    }

    const activeTrips = trips.filter((t) => t.status !== "completed");
    const pastTrips = trips.filter((t) => t.status === "completed");

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">My Trips</h1>
                    <p className="text-muted-foreground mt-1">
                        Plan and manage your group travel adventures
                    </p>
                </div>
                <Button className="bg-black hover:bg-gray-900 text-white" 
                    onClick={() => setCreateModalOpen(true)}
                    variant="travel"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    New Trip
                </Button>
            </div>

            {/* Empty State */}
            {trips.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="rounded-full bg-muted p-6 mb-4">
                        <Plus className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <h2 className="text-2xl font-semibold mb-2">No trips yet</h2>
                    <p className="text-muted-foreground mb-6 max-w-md">
                        Get started by creating your first trip. Add group members and
                        collect their preferences to plan the perfect adventure together.
                    </p>
                    <Button 
                        onClick={() => setCreateModalOpen(true)} 
                        size="lg"
                        variant="brand"
                    >
                        <Plus className="mr-2 h-5 w-5" />
                        Create Your First Trip
                    </Button>
                </div>
            )}

            {/* Active Trips */}
            {activeTrips.length > 0 && (
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Active Trips</h2>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {activeTrips.map((trip) => (
                            <TripCard
                                key={trip.id}
                                trip={trip}
                                onViewTrip={handleViewTrip}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Past Trips */}
            {pastTrips.length > 0 && (
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Past Trips</h2>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {pastTrips.map((trip) => (
                            <TripCard
                                key={trip.id}
                                trip={trip}
                                onViewTrip={handleViewTrip}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Create Trip Modal */}
            <CreateTripModal
                open={createModalOpen}
                onOpenChange={setCreateModalOpen}
                onCreateTrip={handleCreateTrip}
            />
        </div>
    );
}
