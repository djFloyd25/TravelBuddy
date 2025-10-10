export type TripStatus = 'planning' | 'active' | 'completed';

export type QuestionType = 'multiple_choice' | 'budget_range' | 'text' | 'rating' | 'yes_no';

export interface Trip {
  id: string;
  user_id: string;
  name: string;
  destination: string | null;
  start_date: string | null;
  end_date: string | null;
  status: TripStatus;
  created_at: string;
  updated_at: string;
  members?: TripMember[];
  survey_completion_rate?: number;
}

export interface TripMember {
  id: string;
  trip_id: string;
  phone_number: string;
  name: string | null;
  survey_completed: boolean;
  created_at: string;
}

export interface SurveyQuestion {
  id: string;
  trip_id: string;
  question_text: string;
  question_type: QuestionType;
  options: string[] | null;
  order_index: number;
  is_default: boolean;
  created_at: string;
}

export interface SurveyResponse {
  id: string;
  trip_member_id: string;
  question_id: string;
  response_value: any;
  created_at: string;
}

export interface Itinerary {
  id: string;
  trip_id: string;
  content: {
    days?: ItineraryDay[];
    summary?: string;
    total_budget?: number;
    recommendations?: string[];
  };
  generated_at: string;
}

export interface ItineraryDay {
  day: number;
  date: string;
  activities: Activity[];
  meals: Meal[];
  accommodation?: string;
}

export interface Activity {
  time: string;
  title: string;
  description: string;
  location?: string;
  estimated_cost?: number;
}

export interface Meal {
  type: 'breakfast' | 'lunch' | 'dinner';
  restaurant?: string;
  estimated_cost?: number;
}

export interface CreateTripData {
  name: string;
  members: { phone_number: string; name?: string }[];
}

export interface UpdateTripData {
  name?: string;
  destination?: string;
  start_date?: string;
  end_date?: string;
  status?: TripStatus;
}

// Default survey questions
export const DEFAULT_SURVEY_QUESTIONS: Omit<SurveyQuestion, 'id' | 'trip_id' | 'created_at'>[] = [
  {
    question_text: "What is your preferred accommodation style?",
    question_type: "multiple_choice",
    options: ["Hotel", "Airbnb/Vacation Rental", "Hostel", "Camping", "No Preference"],
    order_index: 1,
    is_default: true,
  },
  {
    question_text: "What is your budget range for this trip (per person)?",
    question_type: "budget_range",
    options: ["Under $500", "$500-$1000", "$1000-$2000", "$2000-$5000", "Over $5000"],
    order_index: 2,
    is_default: true,
  },
  {
    question_text: "What types of activities interest you most?",
    question_type: "multiple_choice",
    options: [
      "Adventure/Outdoor Activities",
      "Cultural/Historical Sites",
      "Beach/Relaxation",
      "Food/Dining Experiences",
      "Shopping",
      "Nightlife/Entertainment",
      "Nature/Wildlife"
    ],
    order_index: 3,
    is_default: true,
  },
  {
    question_text: "Do you have any dietary restrictions?",
    question_type: "text",
    options: null,
    order_index: 4,
    is_default: true,
  },
  {
    question_text: "How would you rate your interest in group activities vs. free time?",
    question_type: "rating",
    options: ["1 (Prefer lots of free time)", "2", "3 (Balanced)", "4", "5 (Prefer structured group activities)"],
    order_index: 5,
    is_default: true,
  },
  {
    question_text: "Are you interested in trying local street food?",
    question_type: "yes_no",
    options: ["Yes", "No"],
    order_index: 6,
    is_default: true,
  },
  {
    question_text: "What is your preferred pace of travel?",
    question_type: "multiple_choice",
    options: ["Relaxed (few activities per day)", "Moderate (balanced schedule)", "Fast-paced (maximize experiences)"],
    order_index: 7,
    is_default: true,
  },
];
