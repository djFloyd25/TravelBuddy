import { supabase } from "./supabase-client";
import { Trip, CreateTripData, UpdateTripData, TripMember, SurveyQuestion, DEFAULT_SURVEY_QUESTIONS } from "@/types/trip";

export class TripsAPI {
  // Create a new trip with members
  static async createTrip(userId: string, data: CreateTripData): Promise<Trip> {
    // Create the trip
    const { data: trip, error: tripError } = await supabase
      .from("trips")
      .insert({
        user_id: userId,
        name: data.name,
        status: "planning",
      })
      .select()
      .single();

    if (tripError) throw tripError;

    // Add members
    if (data.members.length > 0) {
      const { error: membersError } = await supabase
        .from("trip_members")
        .insert(
          data.members.map((member) => ({
            trip_id: trip.id,
            phone_number: member.phone_number,
            name: member.name || null,
          }))
        );

      if (membersError) throw membersError;
    }

    // Create default survey questions
    const { error: questionsError } = await supabase
      .from("survey_questions")
      .insert(
        DEFAULT_SURVEY_QUESTIONS.map((q) => ({
          trip_id: trip.id,
          question_text: q.question_text,
          question_type: q.question_type,
          options: q.options,
          order_index: q.order_index,
          is_default: q.is_default,
        }))
      );

    if (questionsError) throw questionsError;

    return trip;
  }

  // Get all trips for a user
  static async getUserTrips(userId: string): Promise<Trip[]> {
    const { data, error } = await supabase
      .from("trips")
      .select(`
        *,
        members:trip_members(*)
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return data as Trip[];
  }

  // Get a single trip with all details
  static async getTrip(tripId: string): Promise<Trip | null> {
    const { data, error } = await supabase
      .from("trips")
      .select(`
        *,
        members:trip_members(*)
      `)
      .eq("id", tripId)
      .single();

    if (error) throw error;

    return data as Trip;
  }

  // Update trip details
  static async updateTrip(tripId: string, data: UpdateTripData): Promise<Trip> {
    const { data: trip, error } = await supabase
      .from("trips")
      .update(data)
      .eq("id", tripId)
      .select()
      .single();

    if (error) throw error;

    return trip;
  }

  // Delete a trip
  static async deleteTrip(tripId: string): Promise<void> {
    const { error } = await supabase.from("trips").delete().eq("id", tripId);

    if (error) throw error;
  }

  // Get trip members
  static async getTripMembers(tripId: string): Promise<TripMember[]> {
    const { data, error } = await supabase
      .from("trip_members")
      .select("*")
      .eq("trip_id", tripId)
      .order("created_at", { ascending: true });

    if (error) throw error;

    return data;
  }

  // Add a member to a trip
  static async addTripMember(
    tripId: string,
    phoneNumber: string,
    name?: string
  ): Promise<TripMember> {
    const { data, error } = await supabase
      .from("trip_members")
      .insert({
        trip_id: tripId,
        phone_number: phoneNumber,
        name: name || null,
      })
      .select()
      .single();

    if (error) throw error;

    return data;
  }

  // Remove a member from a trip
  static async removeTripMember(memberId: string): Promise<void> {
    const { error } = await supabase
      .from("trip_members")
      .delete()
      .eq("id", memberId);

    if (error) throw error;
  }

  // Update member information
  static async updateTripMember(
    memberId: string,
    data: { name?: string; phone_number?: string }
  ): Promise<TripMember> {
    const { data: member, error } = await supabase
      .from("trip_members")
      .update(data)
      .eq("id", memberId)
      .select()
      .single();

    if (error) throw error;

    return member;
  }

  // Get survey questions for a trip
  static async getSurveyQuestions(tripId: string): Promise<SurveyQuestion[]> {
    const { data, error } = await supabase
      .from("survey_questions")
      .select("*")
      .eq("trip_id", tripId)
      .order("order_index", { ascending: true });

    if (error) throw error;

    return data;
  }

  // Add a custom survey question
  static async addSurveyQuestion(
    tripId: string,
    questionData: Omit<SurveyQuestion, "id" | "trip_id" | "created_at">
  ): Promise<SurveyQuestion> {
    const { data, error } = await supabase
      .from("survey_questions")
      .insert({
        trip_id: tripId,
        ...questionData,
      })
      .select()
      .single();

    if (error) throw error;

    return data;
  }

  // Update a survey question
  static async updateSurveyQuestion(
    questionId: string,
    data: Partial<Pick<SurveyQuestion, "question_text" | "options" | "order_index">>
  ): Promise<SurveyQuestion> {
    const { data: question, error } = await supabase
      .from("survey_questions")
      .update(data)
      .eq("id", questionId)
      .select()
      .single();

    if (error) throw error;

    return question;
  }

  // Delete a survey question
  static async deleteSurveyQuestion(questionId: string): Promise<void> {
    const { error } = await supabase
      .from("survey_questions")
      .delete()
      .eq("id", questionId);

    if (error) throw error;
  }

  // Get survey responses for a trip
  static async getSurveyResponses(tripId: string) {
    const { data, error } = await supabase
      .from("survey_responses")
      .select(`
        *,
        trip_member:trip_members(*),
        question:survey_questions(*)
      `)
      .in(
        "trip_member_id",
        supabase
          .from("trip_members")
          .select("id")
          .eq("trip_id", tripId)
      );

    if (error) throw error;

    return data;
  }

  // Get itinerary for a trip
  static async getItinerary(tripId: string) {
    const { data, error } = await supabase
      .from("itineraries")
      .select("*")
      .eq("trip_id", tripId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // No itinerary found
        return null;
      }
      throw error;
    }

    return data;
  }

  // Create or update itinerary
  static async saveItinerary(tripId: string, content: any) {
    const { data, error } = await supabase
      .from("itineraries")
      .upsert({
        trip_id: tripId,
        content,
      })
      .select()
      .single();

    if (error) throw error;

    return data;
  }
}
