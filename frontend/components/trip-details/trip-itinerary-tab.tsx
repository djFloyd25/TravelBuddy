"use client";

import { useState, useEffect } from "react";
import { Sparkles, Calendar, MapPin, DollarSign, Utensils, Clock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Trip, Itinerary } from "@/types/trip";
import { TripsAPI } from "@/lib/trips-api";

interface TripItineraryTabProps {
    trip: Trip;
}

export function TripItineraryTab({ trip }: TripItineraryTabProps) {
    const [itinerary, setItinerary] = useState<Itinerary | null>(null);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);

    useEffect(() => {
        loadItinerary();
    }, [trip.id]);

    const loadItinerary = async () => {
        try {
            setLoading(true);
            const data = await TripsAPI.getItinerary(trip.id);
            setItinerary(data);
        } catch (error) {
            console.error("Error loading itinerary:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateItinerary = async () => {
        try {
            setGenerating(true);
            // TODO: Implement AI itinerary generation
            // This would call your backend API which uses AI to analyze survey responses
            // and generate a personalized itinerary
            console.log("Generating AI itinerary...");

            // Mock data for now
            const mockItinerary = {
                days: [
                    {
                        day: 1,
                        date: trip.start_date || new Date().toISOString(),
                        activities: [
                            {
                                time: "9:00 AM",
                                title: "Arrival & Hotel Check-in",
                                description: "Check into hotel and freshen up",
                                location: trip.destination || "Destination",
                                estimated_cost: 0,
                            },
                            {
                                time: "2:00 PM",
                                title: "City Walking Tour",
                                description: "Explore the historic downtown area",
                                location: "Downtown",
                                estimated_cost: 25,
                            },
                        ],
                        meals: [
                            {
                                type: "lunch" as const,
                                restaurant: "Local Cafe",
                                estimated_cost: 15,
                            },
                            {
                                type: "dinner" as const,
                                restaurant: "Traditional Restaurant",
                                estimated_cost: 35,
                            },
                        ],
                        accommodation: "City Center Hotel",
                    },
                ],
                summary: "A balanced itinerary based on your group's preferences",
                total_budget: 500,
                recommendations: [
                    "Book activities in advance for better rates",
                    "Consider purchasing a city pass for attractions",
                    "Try local street food for authentic experiences",
                ],
            };

            await TripsAPI.saveItinerary(trip.id, mockItinerary);
            await loadItinerary();
        } catch (error) {
            console.error("Error generating itinerary:", error);
        } finally {
            setGenerating(false);
        }
    };

    if (loading) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-96 w-full" />
            </div>
        );
    }

    if (!itinerary) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>AI-Generated Itinerary</CardTitle>
                    <CardDescription>
                        Generate a personalized itinerary based on survey responses
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="rounded-full bg-primary/10 p-6 mb-4">
                            <Sparkles className="h-12 w-12 text-primary" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">No Itinerary Yet</h3>
                        <p className="text-muted-foreground mb-6 max-w-md">
                            Once you've collected survey responses from your group members, our AI
                            will analyze their preferences and generate a personalized itinerary.
                        </p>
                        <div className="space-y-2 text-sm text-muted-foreground mb-6">
                            <p>
                                ✓ Survey Progress:{" "}
                                {trip.members?.filter((m) => m.survey_completed).length || 0} /{" "}
                                {trip.members?.length || 0} completed
                            </p>
                            {trip.destination && <p>✓ Destination: {trip.destination}</p>}
                            {trip.start_date && trip.end_date && (
                                <p>✓ Dates: {new Date(trip.start_date).toLocaleDateString()} - {new Date(trip.end_date).toLocaleDateString()}</p>
                            )}
                        </div>
                        <Button
                            onClick={handleGenerateItinerary}
                            disabled={generating}
                            size="lg"
                        >
                            <Sparkles className="mr-2 h-5 w-5" />
                            {generating ? "Generating..." : "Generate Itinerary with AI"}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            {/* Summary Card */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Trip Summary</CardTitle>
                            <CardDescription>{itinerary.content.summary}</CardDescription>
                        </div>
                        <Button onClick={handleGenerateItinerary} disabled={generating}>
                            <Sparkles className="mr-2 h-4 w-4" />
                            Regenerate
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-3">
                        {itinerary.content.total_budget && (
                            <div className="flex items-center gap-3">
                                <div className="rounded-full bg-primary/10 p-2">
                                    <DollarSign className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Total Budget</p>
                                    <p className="text-xl font-semibold">
                                        ${itinerary.content.total_budget}
                                    </p>
                                </div>
                            </div>
                        )}
                        <div className="flex items-center gap-3">
                            <div className="rounded-full bg-primary/10 p-2">
                                <Calendar className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Duration</p>
                                <p className="text-xl font-semibold">
                                    {itinerary.content.days?.length || 0} Days
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="rounded-full bg-primary/10 p-2">
                                <MapPin className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Destination</p>
                                <p className="text-xl font-semibold">
                                    {trip.destination || "TBD"}
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Recommendations */}
            {itinerary.content.recommendations && itinerary.content.recommendations.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Recommendations</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2">
                            {itinerary.content.recommendations.map((rec, index) => (
                                <li key={index} className="flex items-start gap-2">
                                    <Badge variant="outline" className="mt-0.5">
                                        {index + 1}
                                    </Badge>
                                    <span className="text-sm">{rec}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            )}

            {/* Daily Itinerary */}
            {itinerary.content.days?.map((day) => (
                <Card key={day.day}>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="h-5 w-5" />
                            Day {day.day} - {new Date(day.date).toLocaleDateString()}
                        </CardTitle>
                        {day.accommodation && (
                            <CardDescription>
                                Accommodation: {day.accommodation}
                            </CardDescription>
                        )}
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Activities */}
                        <div className="space-y-3">
                            <h4 className="font-semibold flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                Activities
                            </h4>
                            {day.activities.map((activity, index) => (
                                <div
                                    key={index}
                                    className="flex gap-4 p-4 border rounded-lg bg-muted/30"
                                >
                                    <div className="flex-shrink-0 w-20">
                                        <Badge variant="outline">{activity.time}</Badge>
                                    </div>
                                    <div className="flex-1">
                                        <h5 className="font-medium mb-1">{activity.title}</h5>
                                        <p className="text-sm text-muted-foreground mb-2">
                                            {activity.description}
                                        </p>
                                        <div className="flex items-center gap-4 text-sm">
                                            {activity.location && (
                                                <div className="flex items-center gap-1 text-muted-foreground">
                                                    <MapPin className="h-3 w-3" />
                                                    <span>{activity.location}</span>
                                                </div>
                                            )}
                                            {activity.estimated_cost !== undefined && (
                                                <div className="flex items-center gap-1 text-muted-foreground">
                                                    <DollarSign className="h-3 w-3" />
                                                    <span>${activity.estimated_cost}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Meals */}
                        {day.meals && day.meals.length > 0 && (
                            <div className="space-y-3">
                                <h4 className="font-semibold flex items-center gap-2">
                                    <Utensils className="h-4 w-4" />
                                    Meals
                                </h4>
                                <div className="grid gap-3 md:grid-cols-3">
                                    {day.meals.map((meal, index) => (
                                        <div key={index} className="p-3 border rounded-lg">
                                            <p className="font-medium capitalize mb-1">
                                                {meal.type}
                                            </p>
                                            {meal.restaurant && (
                                                <p className="text-sm text-muted-foreground">
                                                    {meal.restaurant}
                                                </p>
                                            )}
                                            {meal.estimated_cost !== undefined && (
                                                <p className="text-sm text-muted-foreground mt-1">
                                                    ~${meal.estimated_cost}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
