# SkillGPS Application Workflow

## Overview
SkillGPS is an AI-powered career guidance platform that helps users discover ideal career paths, receive personalized learning recommendations, and track their progress through curated courses.

---

## Complete User Journey

### 1. Welcome & Onboarding

**Entry Point:** User visits the application

**Flow:**
```
Landing Page (/)
    ↓
[New User] → Survey
[Returning User] → Choice: Resume Journey or Start Fresh
```

**Features:**
- Welcome screen with introduction
- Option to continue existing journey or retake survey
- Beautiful gradient design with animations

---

### 2. Career Assessment Survey

**Path:** `/survey`

**Steps:**
1. **Interest Assessment** (Step 1/4)
   - Questions about work preferences
   - Binary choices (Yes/No) for different activities
   - Areas: Numbers, Building, Design, Explaining, Logic

2. **Work Style Preferences** (Step 2/4)
   - Environment preference (Office/Remote/Hybrid)
   - Work structure (Structured/Flexible)
   - Role type (Individual/Team/Leadership)

3. **Career Intent** (Step 3/4)
   - Post-education goals
   - Workplace preferences
   - Work nature (Creative/Analytical/Both)

4. **Confidence Levels** (Step 4/4)
   - Self-assessment sliders (1-10)
   - Math skills
   - Coding abilities
   - Communication skills

**Validation:**
- Each step must be completed before proceeding
- Progress bar shows completion (25%, 50%, 75%, 100%)
- Back/Next navigation available

---

### 3. Career Recommendations

**Path:** `/results`

**What Happens:**
1. **AI Analysis**
   - System analyzes survey responses
   - Matches with 50+ career paths
   - Generates personalized recommendations

2. **Results Display**
   - Top 3-5 career matches shown
   - Each card shows:
     - Career name
     - Match percentage
     - Brief description
     - "Start Learning Path" button
   - Best match highlighted with badge

3. **Resume Upload Section** ⭐ NEW FEATURE
   - Upload resume (.txt format)
   - Drag-and-drop or file picker
   - Automatic skill extraction

4. **Skills Gap Analysis** (if resume uploaded)
   - For each recommended career:
     - Readiness level (Beginner/Intermediate/Advanced)
     - Essential skills match percentage
     - Overall skills match percentage
     - Skills you have (green indicators)
     - Skills you need (red indicators)
     - Course recommendations for missing skills

**User Actions:**
- Select a career path to explore
- Upload resume for skill analysis
- Navigate to Dashboard

---

### 4. Learning Dashboard

**Path:** `/dashboard`

**Main Sections:**

#### A. Header & Progress
- Selected career path displayed prominently
- Overall completion percentage
- Course statistics:
  - Enrolled courses count
  - Completed vs. Total courses
- Actions:
  - Retake Survey button
  - View Enrolled Courses modal

#### B. Essential Skills Gap Alert ⭐ (if resume uploaded)
- Red gradient alert box
- Shows missing essential skills
- Up to 10 priority skills displayed as pills
- Based on resume analysis

#### C. Course Library (Two Columns)

**Left Column: Free Resources**
- Beginner level courses
- Intermediate level courses
- Advanced level courses

**Right Column: Paid Courses**
- Beginner level courses
- Intermediate level courses
- Advanced level courses

**Each Course Card Shows:**
- Course title
- Platform name
- Duration
- Rating (stars)
- Learning outcomes
- Actions:
  - "Start Course" button (opens in new tab)
  - Mark as Complete/Incomplete toggle

**Features:**
- Hover animations
- Visual indicators for completed courses
- Direct links to course platforms

---

### 5. Progress Tracking

**Path:** `/progress`

**Features:**
- Domain-specific progress bars
- Global statistics
- Course completion tracking
- Visual charts and graphs
- Learning milestones

---

### 6. Expert Mentorship

**Path:** `/experts`

**Features:**
- Connect with industry mentors
- Schedule mock interviews
- Career guidance sessions
- Expert profiles with specializations

---

### 7. AI Chatbot Assistant

**Access:** Floating button (bottom-right, available on all pages)

**Capabilities:**

#### A. Interview Practice
1. User requests interview questions
2. Bot shows available career domains
3. User selects domain
4. Bot asks interview question
5. User answers
6. Bot evaluates answer with NLP
   - If correct: Praise + ask for next question
   - If incorrect: Show correct answer + explanation
7. Repeat or return to normal mode

#### B. Career Advice
1. User requests career guidance
2. Bot asks preference (Tech or Design/Strategy)
3. Bot provides recommendations
4. Can transition to interview practice

#### C. Voice Interaction
- Speech-to-text input (microphone button)
- Text-to-speech responses (can be muted)
- Natural conversation flow

#### D. Other Features
- Course recommendations
- Career path guidance
- Learning resource suggestions
- Context-aware responses

---

## Key Features Summary

### 🎯 Personalized Career Matching
- AI-powered survey analysis
- 50+ career path database
- Match percentage scoring

### 📄 Resume Skills Analysis
- Upload and parse resumes
- Extract technical and soft skills
- Match skills with career requirements
- Identify skill gaps
- Recommend specific courses

### 📚 Curated Learning Paths
- 200+ courses across all careers
- Free and paid options
- Beginner to Advanced levels
- Direct platform links

### 📊 Progress Tracking
- Course completion tracking
- Domain-specific progress
- Visual statistics
- localStorage persistence

### 🤖 AI Assistant
- Interview question practice
- NLP-based answer evaluation
- Voice interaction
- Career guidance
- Multi-mode conversation

### 👥 Expert Network
- Industry mentors
- Mock interviews
- Career coaching

---

## Data Persistence

### localStorage Keys:
- `formData` - Survey responses
- `suggestedDomains` - Recommended careers
- `completedCourses` - Completed course list
- `enrolledCourses` - Enrolled course list
- `resumeData` - ⭐ Resume analysis results
- `userId` - User identification

---

## Technical Flow

```
User Input (Survey/Resume)
    ↓
AI Processing (Local + Optional ML API)
    ↓
Career Recommendations + Skills Analysis
    ↓
Personalized Dashboard + Course Suggestions
    ↓
Progress Tracking + Chatbot Support
    ↓
Expert Mentorship (Optional)
```

---

## Navigation Map

```
/ (Welcome)
├── /survey (4-step assessment)
├── /results (Recommendations + Resume Upload)
├── /dashboard (Learning paths + Skills gap)
├── /progress (Statistics)
├── /experts (Mentorship)
└── Chatbot (Global, floating)
```

---

## Resume Analysis Workflow (Detailed)

### Step 1: Upload
1. Navigate to `/results`
2. Scroll to "Upload Your Resume" section
3. Drag-and-drop or click to upload `.txt` file
4. File is parsed immediately

### Step 2: Skill Extraction
- Resume text analyzed with pattern matching
- 70+ skill keywords across 8 categories
- Skills extracted and categorized
- Contact info and sections identified

### Step 3: Skills Matching
- For each recommended career:
  - Compare resume skills with required skills
  - Calculate essential match %
  - Calculate overall match %
  - Identify missing skills

### Step 4: Display Analysis
- Readiness assessment card (color-coded)
- Two-column comparison:
  - Left: Skills you have (green)
  - Right: Skills you need (red)
- Course recommendations section
  - Expandable by skill
  - 1-3 courses per skill
  - Direct course links

### Step 5: Dashboard Integration
- Missing essential skills appear on Dashboard
- Red alert box at top
- Guides learning priorities
- Persists across sessions

---

## Best Practices for Users

1. **Complete the Survey Honestly**
   - Answer all questions truthfully
   - Use sliders carefully for self-assessment
   - Don't rush through steps

2. **Upload Your Resume Early**
   - Upload on Results page
   - Ensure skills are listed clearly
   - Use standard skill names

3. **Start with Free Courses**
   - Begin with beginner level
   - Complete before advancing
   - Mark courses as complete

4. **Use the Chatbot**
   - Practice interview questions
   - Get career advice
   - Ask about courses

5. **Track Your Progress**
   - Visit Progress page regularly
   - Aim for 100% completion
   - Focus on essential skills first

---

## Error Handling

### Survey
- Validation prevents incomplete submissions
- Alert if questions unanswered
- Can go back to fix answers

### Resume Upload
- Only .txt files accepted
- Max 15,000 characters
- Clear error messages
- Files can be replaced

### Courses
- External links may require accounts
- Some platforms need registration
- Course availability may vary

---

## Future Enhancement Ideas

1. PDF/DOCX resume support
2. Skill proficiency levels
3. Learning roadmap visualization
4. Achievement badges
5. LinkedIn integration
6. Collaborative learning
7. Live mentor sessions
8. AI-powered skill assessments

---

## Support & Help

- **AI Chatbot**: Use for quick questions
- **Retake Survey**: Available on Dashboard
- **Reset Progress**: Start fresh anytime
- **Course Links**: Direct to learning platforms
