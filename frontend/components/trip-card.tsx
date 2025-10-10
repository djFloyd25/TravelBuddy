"use client";

import { Calendar, MapPin, Users, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trip } from "@/types/trip";
import { format } from "date-fns";

interface TripCardProps {
  trip: Trip;
  onViewTrip: (tripId: string) => void;
}

export function TripCard({ trip, onViewTrip }: TripCardProps) {
  const memberCount = trip.members?.length || 0;
  const completedSurveys =
    trip.members?.filter((m) => m.survey_completed).length || 0;
  const surveyCompletionRate =
    memberCount > 0 ? Math.round((completedSurveys / memberCount) * 100) : 0;

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

  const formatDateRange = () => {
    if (!trip.start_date && !trip.end_date) {
      return "Dates TBD";
    }
    if (trip.start_date && trip.end_date) {
      return `${format(new Date(trip.start_date), "MMM d")} - ${format(
        new Date(trip.end_date),
        "MMM d, yyyy"
      )}`;
    }
    if (trip.start_date) {
      return `Starting ${format(new Date(trip.start_date), "MMM d, yyyy")}`;
    }
    return "Dates TBD";
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-xl">{trip.name}</CardTitle>
          {getStatusBadge(trip.status)}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Destination */}
        <div className="flex items-center gap-2 text-sm">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">
            {trip.destination || "Destination TBD"}
          </span>
        </div>

        {/* Dates */}
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">{formatDateRange()}</span>
        </div>

        {/* Members */}
        <div className="flex items-center gap-2 text-sm">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">
            {memberCount} {memberCount === 1 ? "member" : "members"}
          </span>
        </div>

        {/* Survey Completion */}
        <div className="pt-2 border-t">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground">Survey Progress</span>
            <span className="font-medium">
              {completedSurveys}/{memberCount}
            </span>
          </div>
          <div className="w-full bg-secondary rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all"
              style={{ width: `${surveyCompletionRate}%` }}
            />
          </div>
          {surveyCompletionRate === 100 && memberCount > 0 && (
            <div className="flex items-center gap-1 mt-2 text-sm text-green-600">
              <CheckCircle2 className="h-4 w-4" />
              <span>All surveys completed!</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={() => onViewTrip(trip.id)}
          className="w-full"
          variant="outline"
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
}
