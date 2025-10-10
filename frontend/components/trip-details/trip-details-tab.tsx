"use client";

import { useState } from "react";
import { Save, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trip, UpdateTripData } from "@/types/trip";
import { TripsAPI } from "@/lib/trips-api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface TripDetailsTabProps {
    trip: Trip;
    onTripUpdate: () => void;
}

export function TripDetailsTab({ trip, onTripUpdate }: TripDetailsTabProps) {
    const router = useRouter();
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const [formData, setFormData] = useState<UpdateTripData>({
        name: trip.name,
        destination: trip.destination || "",
        start_date: trip.start_date || "",
        end_date: trip.end_date || "",
        status: trip.status,
    });

    const handleSave = async () => {
        try {
            setSaving(true);
            await TripsAPI.updateTrip(trip.id, formData);
            await onTripUpdate();
            setEditing(false);
        } catch (error) {
            console.error("Error updating trip:", error);
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        setFormData({
            name: trip.name,
            destination: trip.destination || "",
            start_date: trip.start_date || "",
            end_date: trip.end_date || "",
            status: trip.status,
        });
        setEditing(false);
    };

    const handleDelete = async () => {
        try {
            setDeleting(true);
            await TripsAPI.deleteTrip(trip.id);
            router.push("/dashboard");
        } catch (error) {
            console.error("Error deleting trip:", error);
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Trip Information</CardTitle>
                    <CardDescription>
                        Manage the basic details of your trip
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="name">Trip Name</Label>
                            {editing ? (
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) =>
                                        setFormData({ ...formData, name: e.target.value })
                                    }
                                />
                            ) : (
                                <p className="text-sm py-2">{trip.name}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="destination">Destination</Label>
                            {editing ? (
                                <Input
                                    id="destination"
                                    value={formData.destination}
                                    onChange={(e) =>
                                        setFormData({ ...formData, destination: e.target.value })
                                    }
                                    placeholder="e.g., Paris, France"
                                />
                            ) : (
                                <p className="text-sm py-2">
                                    {trip.destination || "Not set"}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="start_date">Start Date</Label>
                            {editing ? (
                                <Input
                                    id="start_date"
                                    type="date"
                                    value={formData.start_date}
                                    onChange={(e) =>
                                        setFormData({ ...formData, start_date: e.target.value })
                                    }
                                />
                            ) : (
                                <p className="text-sm py-2">
                                    {trip.start_date
                                        ? new Date(trip.start_date).toLocaleDateString()
                                        : "Not set"}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="end_date">End Date</Label>
                            {editing ? (
                                <Input
                                    id="end_date"
                                    type="date"
                                    value={formData.end_date}
                                    onChange={(e) =>
                                        setFormData({ ...formData, end_date: e.target.value })
                                    }
                                />
                            ) : (
                                <p className="text-sm py-2">
                                    {trip.end_date
                                        ? new Date(trip.end_date).toLocaleDateString()
                                        : "Not set"}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
                            {editing ? (
                                <select
                                    id="status"
                                    value={formData.status}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            status: e.target.value as Trip["status"],
                                        })
                                    }
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
                                >
                                    <option value="planning">Planning</option>
                                    <option value="active">Active</option>
                                    <option value="completed">Completed</option>
                                </select>
                            ) : (
                                <p className="text-sm py-2 capitalize">{trip.status}</p>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-2 pt-4">
                        {editing ? (
                            <>
                                <Button onClick={handleSave} disabled={saving}>
                                    <Save className="mr-2 h-4 w-4" />
                                    {saving ? "Saving..." : "Save Changes"}
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={handleCancel}
                                    disabled={saving}
                                >
                                    Cancel
                                </Button>
                            </>
                        ) : (
                            <Button onClick={() => setEditing(true)}>Edit Details</Button>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="border-destructive">
                <CardHeader>
                    <CardTitle className="text-destructive">Danger Zone</CardTitle>
                    <CardDescription>
                        Irreversible and destructive actions
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium">Delete this trip</p>
                            <p className="text-sm text-muted-foreground">
                                This will permanently delete all trip data, members, surveys, and
                                responses.
                            </p>
                        </div>
                        <Button
                            variant="destructive"
                            onClick={() => setDeleteDialogOpen(true)}
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Trip
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Are you sure?</DialogTitle>
                        <DialogDescription>
                            This will permanently delete "{trip.name}" and all associated data.
                            This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setDeleteDialogOpen(false)}
                            disabled={deleting}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={deleting}
                        >
                            {deleting ? "Deleting..." : "Delete Trip"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
