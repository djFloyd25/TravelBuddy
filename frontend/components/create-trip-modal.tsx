"use client";

import { useState } from "react";
import { X, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreateTripData } from "@/types/trip";

interface CreateTripModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateTrip: (data: CreateTripData) => Promise<void>;
}

interface MemberInput {
  id: string;
  phone_number: string;
  name: string;
}

export function CreateTripModal({
  open,
  onOpenChange,
  onCreateTrip,
}: CreateTripModalProps) {
  const [tripName, setTripName] = useState("");
  const [members, setMembers] = useState<MemberInput[]>([
    { id: "1", phone_number: "", name: "" },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ tripName?: string; members?: string }>({});

  const addMember = () => {
    setMembers([
      ...members,
      { id: Date.now().toString(), phone_number: "", name: "" },
    ]);
  };

  const removeMember = (id: string) => {
    if (members.length > 1) {
      setMembers(members.filter((m) => m.id !== id));
    }
  };

  const updateMember = (id: string, field: "phone_number" | "name", value: string) => {
    setMembers(
      members.map((m) => (m.id === id ? { ...m, [field]: value } : m))
    );
  };

  const validateForm = (): boolean => {
    const newErrors: { tripName?: string; members?: string } = {};

    if (!tripName.trim()) {
      newErrors.tripName = "Trip name is required";
    }

    const validMembers = members.filter((m) => m.phone_number.trim());
    if (validMembers.length === 0) {
      newErrors.members = "At least one member with a phone number is required";
    }

    // Validate phone numbers (basic validation)
    const invalidPhones = members.filter(
      (m) =>
        m.phone_number.trim() &&
        !/^[\d\s\-\+\(\)]+$/.test(m.phone_number.trim())
    );
    if (invalidPhones.length > 0) {
      newErrors.members = "Please enter valid phone numbers";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const validMembers = members
        .filter((m) => m.phone_number.trim())
        .map((m) => ({
          phone_number: m.phone_number.trim(),
          name: m.name.trim() || undefined,
        }));

      await onCreateTrip({
        name: tripName.trim(),
        members: validMembers,
      });

      // Reset form
      setTripName("");
      setMembers([{ id: "1", phone_number: "", name: "" }]);
      setErrors({});
      onOpenChange(false);
    } catch (error) {
      console.error("Error creating trip:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Trip</DialogTitle>
          <DialogDescription>
            Start by naming your trip and adding group members. You'll be able to add
            more details later.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Trip Name */}
            <div className="grid gap-2">
              <Label htmlFor="trip-name">
                Trip Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="trip-name"
                placeholder="e.g., Summer Europe Trip"
                value={tripName}
                onChange={(e) => setTripName(e.target.value)}
                className={errors.tripName ? "border-destructive" : ""}
              />
              {errors.tripName && (
                <p className="text-sm text-destructive">{errors.tripName}</p>
              )}
            </div>

            {/* Members */}
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label>
                  Group Members <span className="text-destructive">*</span>
                </Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addMember}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Member
                </Button>
              </div>

              <div className="space-y-3">
                {members.map((member, index) => (
                  <div key={member.id} className="flex gap-2 items-start">
                    <div className="flex-1 grid grid-cols-2 gap-2">
                      <div>
                        <Input
                          placeholder="Phone number"
                          value={member.phone_number}
                          onChange={(e) =>
                            updateMember(member.id, "phone_number", e.target.value)
                          }
                          className="text-sm"
                        />
                      </div>
                      <div>
                        <Input
                          placeholder="Name (optional)"
                          value={member.name}
                          onChange={(e) =>
                            updateMember(member.id, "name", e.target.value)
                          }
                          className="text-sm"
                        />
                      </div>
                    </div>
                    {members.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeMember(member.id)}
                        className="h-9 w-9"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              {errors.members && (
                <p className="text-sm text-destructive">{errors.members}</p>
              )}
            </div>

            <p className="text-sm text-muted-foreground">
              Members will receive SMS surveys to share their preferences for the trip.
            </p>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Trip"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
