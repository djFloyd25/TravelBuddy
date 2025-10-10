# TravelBuddy Dashboard - Setup Guide

## Overview

The TravelBuddy dashboard is now fully set up with comprehensive trip planning features including:

- Trip creation and management
- Group member management via phone numbers
- Customizable survey system with SMS support
- AI-powered itinerary generation
- Active/past trip organization

## Database Setup

### 1. Run the Supabase Migration

You need to run the database migration to create all necessary tables:

**Option A: Using Supabase CLI**
```bash
# Initialize Supabase (if not already done)
supabase init

# Link to your project
supabase link --project-ref your-project-ref

# Run the migration
supabase db push
```

**Option B: Using Supabase Dashboard**
1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Open the file `/supabase/migrations/001_create_trips_schema.sql`
4. Copy and paste the entire SQL content
5. Click "Run" to execute the migration

### 2. Database Schema

The migration creates the following tables:

- **trips**: Stores trip information (name, destination, dates, status)
- **trip_members**: Stores group members with phone numbers
- **survey_questions**: Stores survey questions (default + custom)
- **survey_responses**: Stores member responses to surveys
- **itineraries**: Stores AI-generated itineraries

All tables include Row Level Security (RLS) policies for secure data access.

## Features

### 1. Dashboard Home (`/dashboard`)

- **Create New Trip**: Click "New Trip" button
  - Add trip name
  - Add group members with phone numbers
  - Default survey questions are automatically created

- **View Trips**: Separated into "Active Trips" and "Past Trips"
- **Trip Cards** show:
  - Trip name, destination, dates
  - Number of members
  - Survey completion progress

### 2. Trip Details (`/dashboard/trips/[id]`)

#### Details Tab
- Edit trip information (name, destination, dates, status)
- Update trip status (Planning → Active → Completed)
- Delete trip (with confirmation)

#### Members Tab
- View all trip members
- Add new members with phone numbers
- Remove members
- See survey completion status per member
- Track overall survey progress

#### Surveys Tab
- View default survey questions (7 pre-configured questions):
  1. Accommodation preferences
  2. Budget range
  3. Activity interests
  4. Dietary restrictions
  5. Group vs. free time preference
  6. Local food interest
  7. Travel pace preference

- **Add Custom Questions**: Create your own questions with types:
  - Text (open-ended)
  - Multiple choice
  - Yes/No
  - Rating (1-5)
  - Budget range

- **Send Surveys**: Trigger SMS surveys to all members (requires backend SMS integration)

#### Itinerary Tab
- Generate AI-powered itinerary based on survey responses
- View day-by-day breakdown with:
  - Activities with times and locations
  - Meal suggestions
  - Accommodation details
  - Cost estimates
- See recommendations and total budget
- Regenerate itinerary as needed

### 3. Sidebar Navigation

- **Dashboard/My Trips**: Go to main dashboard
- **Settings**: User settings (placeholder)
- Collapsible sidebar with mobile support

## Default Survey Questions

The system automatically creates these questions for each new trip:

1. **Accommodation Style** (Multiple Choice)
   - Hotel, Airbnb, Hostel, Camping, No Preference

2. **Budget Range** (Budget Range)
   - Under $500, $500-$1000, $1000-$2000, $2000-$5000, Over $5000

3. **Activity Interests** (Multiple Choice)
   - Adventure, Cultural, Beach, Food, Shopping, Nightlife, Nature

4. **Dietary Restrictions** (Text)
   - Open-ended response

5. **Group Activities vs Free Time** (Rating)
   - 1-5 scale

6. **Local Street Food** (Yes/No)
   - Yes or No

7. **Travel Pace** (Multiple Choice)
   - Relaxed, Moderate, Fast-paced

## Next Steps for SMS Integration

To enable SMS survey functionality, you'll need to:

1. **Set up an SMS service** (Twilio, AWS SNS, etc.)
2. **Create backend API endpoint** to handle SMS sending
3. **Update the "Send Surveys" button** in the Surveys tab to call your API
4. **Create SMS response webhook** to receive and store survey responses

Example SMS flow:
```
1. User clicks "Send Surveys"
2. Backend API sends SMS to each member's phone number
3. SMS contains survey link or interactive questions
4. Members respond via SMS
5. Responses are stored in survey_responses table
6. Trip creator can view responses and generate itinerary
```

## File Structure

```
frontend/
├── app/
│   └── dashboard/
│       ├── page.tsx                    # Main dashboard
│       ├── layout.tsx                  # Dashboard layout with sidebar
│       └── trips/
│           └── [id]/
│               └── page.tsx            # Trip details page
├── components/
│   ├── app-sidebar.tsx                 # Sidebar navigation
│   ├── create-trip-modal.tsx           # Trip creation modal
│   ├── trip-card.tsx                   # Trip display card
│   ├── trip-details/
│   │   ├── trip-details-tab.tsx        # Trip info editing
│   │   ├── trip-members-tab.tsx        # Member management
│   │   ├── trip-surveys-tab.tsx        # Survey management
│   │   └── trip-itinerary-tab.tsx      # AI itinerary display
│   └── ui/                             # UI components
├── lib/
│   ├── trips-api.ts                    # Supabase API functions
│   └── supabase-client.ts              # Supabase client
├── types/
│   └── trip.ts                         # TypeScript types
└── supabase/
    └── migrations/
        └── 001_create_trips_schema.sql # Database schema

```

## Running the Application

1. **Install dependencies** (if not already done):
```bash
cd frontend
npm install
```

2. **Set up environment variables** (`.env.local`):
```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

3. **Run the development server**:
```bash
npm run dev
```

4. **Access the dashboard**:
   - Navigate to `http://localhost:3000/dashboard`
   - You must be logged in to access the dashboard

## Notes

- The AI itinerary generation currently uses mock data
- SMS sending requires backend integration
- Survey responses from members need webhook handling
- Consider adding authentication checks for protected routes
- Add error handling and toast notifications for better UX

## Future Enhancements

- [ ] Integrate real SMS service (Twilio/AWS SNS)
- [ ] Add AI itinerary generation (OpenAI/Anthropic)
- [ ] Implement survey response collection via SMS webhook
- [ ] Add budget tracking and expense splitting
- [ ] Create shareable trip links
- [ ] Add photo uploads for trips
- [ ] Implement real-time collaboration features
- [ ] Add trip templates
- [ ] Create analytics dashboard for survey insights
