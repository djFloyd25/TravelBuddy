"use client";

import { useState } from "react";
import { Plus, Trash2, CheckCircle2, XCircle, Phone, User } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Trip, TripMember } from "@/types/trip";
import { TripsAPI } from "@/lib/trips-api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface TripMembersTabProps {
    trip: Trip;
    onMembersUpdate: () => void;
}

export function TripMembersTab({ trip, onMembersUpdate }: TripMembersTabProps) {
    const [addDialogOpen, setAddDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState<TripMember | null>(null);
    const [loading, setLoading] = useState(false);

    const [newMember, setNewMember] = useState({
        phone_number: "",
        name: "",
    });

    const handleAddMember = async () => {
        if (!newMember.phone_number.trim()) return;

        try {
            setLoading(true);
            await TripsAPI.addTripMember(
                trip.id,
                newMember.phone_number,
                newMember.name || undefined
            );
            await onMembersUpdate();
            setNewMember({ phone_number: "", name: "" });
            setAddDialogOpen(false);
        } catch (error) {
            console.error("Error adding member:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteMember = async () => {
        if (!selectedMember) return;

        try {
            setLoading(true);
            await TripsAPI.removeTripMember(selectedMember.id);
            await onMembersUpdate();
            setDeleteDialogOpen(false);
            setSelectedMember(null);
        } catch (error) {
            console.error("Error removing member:", error);
        } finally {
            setLoading(false);
        }
    };

    const members = trip.members || [];

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Trip Members</CardTitle>
                            <CardDescription>
                                Manage who's joining this trip and track their survey progress
                            </CardDescription>
                        </div>
                        <Button onClick={() => setAddDialogOpen(true)}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Member
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {members.length === 0 ? (
                        <div className="text-center py-12">
                            <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <p className="text-muted-foreground">No members added yet</p>
                            <Button
                                onClick={() => setAddDialogOpen(true)}
                                variant="outline"
                                className="mt-4"
                            >
                                Add Your First Member
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {members.map((member) => (
                                <div
                                    key={member.id}
                                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                                >
                                    <div className="flex items-center gap-4 flex-1">
                                        <div className="rounded-full bg-primary/10 p-2">
                                            <User className="h-5 w-5 text-primary" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <p className="font-medium">
                                                    {member.name || "No name"}
                                                </p>
                                                {member.survey_completed ? (
                                                    <Badge variant="success">
                                                        <CheckCircle2 className="h-3 w-3 mr-1" />
                                                        Completed
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="warning">
                                                        <XCircle className="h-3 w-3 mr-1" />
                                                        Pending
                                                    </Badge>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                                <Phone className="h-3 w-3" />
                                                <span>{member.phone_number}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => {
                                            setSelectedMember(member);
                                            setDeleteDialogOpen(true);
                                        }}
                                    >
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}

                    {members.length > 0 && (
                        <div className="mt-6 p-4 bg-muted rounded-lg">
                            <div className="flex items-center justify-between text-sm">
                                <span className="font-medium">Survey Completion</span>
                                <span>
                                    {members.filter((m) => m.survey_completed).length} /{" "}
                                    {members.length}
                                </span>
                            </div>
                            <div className="w-full bg-background rounded-full h-2 mt-2">
                                <div
                                    className="bg-primary h-2 rounded-full transition-all"
                                    style={{
                                        width: `${
                                            (members.filter((m) => m.survey_completed).length /
                                                members.length) *
                                            100
                                        }%`,
                                    }}
                                />
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Add Member Dialog */}
            <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add Trip Member</DialogTitle>
                        <DialogDescription>
                            Add a new member to this trip. They'll receive an SMS survey to share
                            their preferences.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="phone">
                                Phone Number <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="phone"
                                placeholder="+1234567890"
                                value={newMember.phone_number}
                                onChange={(e) =>
                                    setNewMember({ ...newMember, phone_number: e.target.value })
                                }
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="member-name">Name (optional)</Label>
                            <Input
                                id="member-name"
                                placeholder="John Doe"
                                value={newMember.name}
                                onChange={(e) =>
                                    setNewMember({ ...newMember, name: e.target.value })
                                }
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setAddDialogOpen(false);
                                setNewMember({ phone_number: "", name: "" });
                            }}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button onClick={handleAddMember} disabled={loading}>
                            {loading ? "Adding..." : "Add Member"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Member Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Remove Member</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to remove {selectedMember?.name || "this member"}{" "}
                            from the trip? Their survey responses will also be deleted.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setDeleteDialogOpen(false);
                                setSelectedMember(null);
                            }}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDeleteMember}
                            disabled={loading}
                        >
                            {loading ? "Removing..." : "Remove Member"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
