"use client";

import { useState, useEffect } from "react";
import { Plus, Send, Edit, Trash2, GripVertical } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Trip, SurveyQuestion, QuestionType } from "@/types/trip";
import { TripsAPI } from "@/lib/trips-api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface TripSurveysTabProps {
    trip: Trip;
    onUpdate: () => void;
}

export function TripSurveysTab({ trip, onUpdate }: TripSurveysTabProps) {
    const [questions, setQuestions] = useState<SurveyQuestion[]>([]);
    const [loading, setLoading] = useState(true);
    const [addDialogOpen, setAddDialogOpen] = useState(false);
    const [sendDialogOpen, setSendDialogOpen] = useState(false);
    const [sending, setSending] = useState(false);

    const [newQuestion, setNewQuestion] = useState({
        question_text: "",
        question_type: "text" as QuestionType,
        options: [] as string[],
    });

    useEffect(() => {
        loadQuestions();
    }, [trip.id]);

    const loadQuestions = async () => {
        try {
            setLoading(true);
            const data = await TripsAPI.getSurveyQuestions(trip.id);
            setQuestions(data);
        } catch (error) {
            console.error("Error loading questions:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddQuestion = async () => {
        if (!newQuestion.question_text.trim()) return;

        try {
            const nextOrderIndex = questions.length > 0
                ? Math.max(...questions.map(q => q.order_index)) + 1
                : 1;

            await TripsAPI.addSurveyQuestion(trip.id, {
                question_text: newQuestion.question_text,
                question_type: newQuestion.question_type,
                options: newQuestion.options.length > 0 ? newQuestion.options : null,
                order_index: nextOrderIndex,
                is_default: false,
            });

            await loadQuestions();
            setNewQuestion({
                question_text: "",
                question_type: "text",
                options: [],
            });
            setAddDialogOpen(false);
        } catch (error) {
            console.error("Error adding question:", error);
        }
    };

    const handleDeleteQuestion = async (questionId: string) => {
        try {
            await TripsAPI.deleteSurveyQuestion(questionId);
            await loadQuestions();
        } catch (error) {
            console.error("Error deleting question:", error);
        }
    };

    const handleSendSurveys = async () => {
        try {
            setSending(true);
            // TODO: Implement SMS sending logic via your backend API
            // This would trigger your SMS service to send surveys to all members
            console.log("Sending surveys to all members...");

            // For now, just close the dialog
            setSendDialogOpen(false);
        } catch (error) {
            console.error("Error sending surveys:", error);
        } finally {
            setSending(false);
        }
    };

    const addOption = () => {
        setNewQuestion({
            ...newQuestion,
            options: [...newQuestion.options, ""],
        });
    };

    const updateOption = (index: number, value: string) => {
        const newOptions = [...newQuestion.options];
        newOptions[index] = value;
        setNewQuestion({ ...newQuestion, options: newOptions });
    };

    const removeOption = (index: number) => {
        setNewQuestion({
            ...newQuestion,
            options: newQuestion.options.filter((_, i) => i !== index),
        });
    };

    const getQuestionTypeLabel = (type: QuestionType) => {
        switch (type) {
            case "multiple_choice":
                return "Multiple Choice";
            case "budget_range":
                return "Budget Range";
            case "text":
                return "Text";
            case "rating":
                return "Rating";
            case "yes_no":
                return "Yes/No";
            default:
                return type;
        }
    };

    const needsOptions = ["multiple_choice", "budget_range", "rating", "yes_no"].includes(
        newQuestion.question_type
    );

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Survey Questions</CardTitle>
                            <CardDescription>
                                Customize the questions sent to trip members via SMS
                            </CardDescription>
                        </div>
                        <div className="flex gap-2">
                            <Button onClick={() => setAddDialogOpen(true)} variant="outline">
                                <Plus className="mr-2 h-4 w-4" />
                                Add Question
                            </Button>
                            <Button onClick={() => setSendDialogOpen(true)}>
                                <Send className="mr-2 h-4 w-4" />
                                Send Surveys
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="text-center py-8">Loading questions...</div>
                    ) : questions.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-muted-foreground">No survey questions yet</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {questions.map((question, index) => (
                                <div
                                    key={question.id}
                                    className="flex items-start gap-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                                >
                                    <GripVertical className="h-5 w-5 text-muted-foreground mt-1" />
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-sm font-medium text-muted-foreground">
                                                        Q{index + 1}
                                                    </span>
                                                    <Badge variant="outline">
                                                        {getQuestionTypeLabel(question.question_type)}
                                                    </Badge>
                                                    {question.is_default && (
                                                        <Badge variant="secondary">Default</Badge>
                                                    )}
                                                </div>
                                                <p className="font-medium">{question.question_text}</p>
                                                {question.options && question.options.length > 0 && (
                                                    <div className="mt-2 flex flex-wrap gap-1">
                                                        {(question.options as string[]).map((option, i) => (
                                                            <Badge key={i} variant="outline">
                                                                {option}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                            {!question.is_default && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleDeleteQuestion(question.id)}
                                                >
                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Add Question Dialog */}
            <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Add Custom Question</DialogTitle>
                        <DialogDescription>
                            Create a custom question to add to the survey
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="question-text">
                                Question <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="question-text"
                                placeholder="e.g., What activities are you most interested in?"
                                value={newQuestion.question_text}
                                onChange={(e) =>
                                    setNewQuestion({
                                        ...newQuestion,
                                        question_text: e.target.value,
                                    })
                                }
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="question-type">Question Type</Label>
                            <select
                                id="question-type"
                                value={newQuestion.question_type}
                                onChange={(e) =>
                                    setNewQuestion({
                                        ...newQuestion,
                                        question_type: e.target.value as QuestionType,
                                        options: [],
                                    })
                                }
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            >
                                <option value="text">Text</option>
                                <option value="multiple_choice">Multiple Choice</option>
                                <option value="yes_no">Yes/No</option>
                                <option value="rating">Rating (1-5)</option>
                                <option value="budget_range">Budget Range</option>
                            </select>
                        </div>

                        {needsOptions && (
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label>Options</Label>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={addOption}
                                    >
                                        <Plus className="h-4 w-4 mr-1" />
                                        Add Option
                                    </Button>
                                </div>
                                <div className="space-y-2">
                                    {newQuestion.options.map((option, index) => (
                                        <div key={index} className="flex gap-2">
                                            <Input
                                                placeholder={`Option ${index + 1}`}
                                                value={option}
                                                onChange={(e) => updateOption(index, e.target.value)}
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => removeOption(index)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setAddDialogOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button onClick={handleAddQuestion}>Add Question</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Send Surveys Dialog */}
            <Dialog open={sendDialogOpen} onOpenChange={setSendDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Send Surveys via SMS</DialogTitle>
                        <DialogDescription>
                            This will send the survey questions to all {trip.members?.length || 0} trip
                            members via SMS. Make sure all questions are finalized before sending.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <div className="bg-muted p-4 rounded-lg space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>Total Questions:</span>
                                <span className="font-medium">{questions.length}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span>Recipients:</span>
                                <span className="font-medium">{trip.members?.length || 0}</span>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setSendDialogOpen(false)}
                            disabled={sending}
                        >
                            Cancel
                        </Button>
                        <Button onClick={handleSendSurveys} disabled={sending}>
                            {sending ? "Sending..." : "Send Surveys"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
