-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE trip_status AS ENUM ('planning', 'active', 'completed');
CREATE TYPE question_type AS ENUM ('multiple_choice', 'budget_range', 'text', 'rating', 'yes_no');

-- Create trips table
CREATE TABLE trips (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    destination TEXT,
    start_date DATE,
    end_date DATE,
    status trip_status DEFAULT 'planning',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create trip_members table
CREATE TABLE trip_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    phone_number TEXT NOT NULL,
    name TEXT,
    survey_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(trip_id, phone_number)
);

-- Create survey_questions table
CREATE TABLE survey_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    question_type question_type NOT NULL,
    options JSONB,
    order_index INTEGER NOT NULL,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create survey_responses table
CREATE TABLE survey_responses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trip_member_id UUID NOT NULL REFERENCES trip_members(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES survey_questions(id) ON DELETE CASCADE,
    response_value JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(trip_member_id, question_id)
);

-- Create itineraries table
CREATE TABLE itineraries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    content JSONB NOT NULL,
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(trip_id)
);

-- Create indexes for better query performance
CREATE INDEX idx_trips_user_id ON trips(user_id);
CREATE INDEX idx_trips_status ON trips(status);
CREATE INDEX idx_trip_members_trip_id ON trip_members(trip_id);
CREATE INDEX idx_survey_questions_trip_id ON survey_questions(trip_id);
CREATE INDEX idx_survey_responses_trip_member_id ON survey_responses(trip_member_id);
CREATE INDEX idx_itineraries_trip_id ON itineraries(trip_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add trigger to trips table
CREATE TRIGGER update_trips_updated_at BEFORE UPDATE ON trips
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE trip_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE itineraries ENABLE ROW LEVEL SECURITY;

-- RLS Policies for trips
CREATE POLICY "Users can view their own trips"
    ON trips FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own trips"
    ON trips FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own trips"
    ON trips FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own trips"
    ON trips FOR DELETE
    USING (auth.uid() = user_id);

-- RLS Policies for trip_members
CREATE POLICY "Users can view members of their trips"
    ON trip_members FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM trips WHERE trips.id = trip_members.trip_id AND trips.user_id = auth.uid()
    ));

CREATE POLICY "Users can add members to their trips"
    ON trip_members FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM trips WHERE trips.id = trip_members.trip_id AND trips.user_id = auth.uid()
    ));

CREATE POLICY "Users can update members of their trips"
    ON trip_members FOR UPDATE
    USING (EXISTS (
        SELECT 1 FROM trips WHERE trips.id = trip_members.trip_id AND trips.user_id = auth.uid()
    ));

CREATE POLICY "Users can delete members from their trips"
    ON trip_members FOR DELETE
    USING (EXISTS (
        SELECT 1 FROM trips WHERE trips.id = trip_members.trip_id AND trips.user_id = auth.uid()
    ));

-- RLS Policies for survey_questions
CREATE POLICY "Users can view questions for their trips"
    ON survey_questions FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM trips WHERE trips.id = survey_questions.trip_id AND trips.user_id = auth.uid()
    ));

CREATE POLICY "Users can create questions for their trips"
    ON survey_questions FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM trips WHERE trips.id = survey_questions.trip_id AND trips.user_id = auth.uid()
    ));

CREATE POLICY "Users can update questions for their trips"
    ON survey_questions FOR UPDATE
    USING (EXISTS (
        SELECT 1 FROM trips WHERE trips.id = survey_questions.trip_id AND trips.user_id = auth.uid()
    ));

CREATE POLICY "Users can delete questions from their trips"
    ON survey_questions FOR DELETE
    USING (EXISTS (
        SELECT 1 FROM trips WHERE trips.id = survey_questions.trip_id AND trips.user_id = auth.uid()
    ));

-- RLS Policies for survey_responses
CREATE POLICY "Users can view responses for their trips"
    ON survey_responses FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM trip_members
        JOIN trips ON trips.id = trip_members.trip_id
        WHERE trip_members.id = survey_responses.trip_member_id
        AND trips.user_id = auth.uid()
    ));

-- RLS Policies for itineraries
CREATE POLICY "Users can view itineraries for their trips"
    ON itineraries FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM trips WHERE trips.id = itineraries.trip_id AND trips.user_id = auth.uid()
    ));

CREATE POLICY "Users can create itineraries for their trips"
    ON itineraries FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM trips WHERE trips.id = itineraries.trip_id AND trips.user_id = auth.uid()
    ));

CREATE POLICY "Users can update itineraries for their trips"
    ON itineraries FOR UPDATE
    USING (EXISTS (
        SELECT 1 FROM trips WHERE trips.id = itineraries.trip_id AND trips.user_id = auth.uid()
    ));
