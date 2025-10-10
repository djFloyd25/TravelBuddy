"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Calendar, MapPin, Users, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { TripsAPI } from "@/lib/trips-api";
import { Trip } from "@/types/trip";
import { TripDetailsTab } from "@/components/trip-details/trip-details-tab";
import { TripMembersTab } from "@/components/trip-details/trip-members-tab";
import { TripSurveysTab } from "@/components/trip-details/trip-surveys-tab";
import { TripItineraryTab } from "@/components/trip-details/trip-itinerary-tab";

export default function TripDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const tripId = params.id as string;

    const [trip, setTrip] = useState<Trip | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("details");

    useEffect(() => {
        loadTrip();
    }, [tripId]);

    const loadTrip = async () => {
        try {
            setLoading(true);
            const data = await TripsAPI.getTrip(tripId);
            setTrip(data);
        } catch (error) {
            console.error("Error loading trip:", error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status: Trip["status"]) => {
        switch (status) {
            case "planning":
                return <Badge variant="warning">Planning</Badge>;
            case "active":
                return <Badge variant="success">Active</Badge>;
            case "completed":
                return <Badge variant="secondary">Completed</Badge>;
            default:
                return null;
        }
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-96 w-full" />
            </div>
        );
    }

    if (!trip) {
        return (
            <div className="flex flex-col items-center justify-center py-12">
                <h2 className="text-2xl font-semibold mb-2">Trip not found</h2>
                <p className="text-muted-foreground mb-4">
                    The trip you're looking for doesn't exist or you don't have access to it.
                </p>
                <Button onClick={() => router.push("/dashboard")}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Dashboard
                </Button>
            </div>
        );
    }

    const memberCount = trip.members?.length || 0;
    const completedSurveys = trip.members?.filter((m) => m.survey_completed).length || 0;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start gap-4">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => router.push("/dashboard")}
                >
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-3xl font-bold">{trip.name}</h1>
                        {getStatusBadge(trip.status)}
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        {trip.destination && (
                            <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                <span>{trip.destination}</span>
                            </div>
                        )}
                        {trip.start_date && trip.end_date && (
                            <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                <span>
                                    {new Date(trip.start_date).toLocaleDateString()} -{" "}
                                    {new Date(trip.end_date).toLocaleDateString()}
                                </span>
                            </div>
                        )}
                        <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            <span>
                                {memberCount} {memberCount === 1 ? "member" : "members"}
                            </span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Settings className="h-4 w-4" />
                            <span>
                                {completedSurveys}/{memberCount} surveys completed
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full max-w-2xl grid-cols-4">
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="members">Members</TabsTrigger>
                    <TabsTrigger value="surveys">Surveys</TabsTrigger>
                    <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="mt-6">
                    <TripDetailsTab trip={trip} onTripUpdate={loadTrip} />
                </TabsContent>

                <TabsContent value="members" className="mt-6">
                    <TripMembersTab trip={trip} onMembersUpdate={loadTrip} />
                </TabsContent>

                <TabsContent value="surveys" className="mt-6">
                    <TripSurveysTab trip={trip} onUpdate={loadTrip} />
                </TabsContent>

                <TabsContent value="itinerary" className="mt-6">
                    <TripItineraryTab trip={trip} />
                </TabsContent>
            </Tabs>
        </div>
    );
}
