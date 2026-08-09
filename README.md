# 🚀 DigiPlus Smart Leads

### AI-Powered OOH Advertising Inventory Intelligence Platform

DigiPlus Smart Leads is a SaaS platform that helps outdoor advertising companies proactively manage billboard inventory, predict upcoming vacancies, identify revenue risks, and automatically match advertisers to vacant sites using AI-driven recommendations.

By combining geospatial intelligence, predictive vacancy analysis, lead scoring, and AI-generated sales pitches, the platform transforms billboard management from a reactive process into a proactive revenue optimization system.

---

##  Problem Statement

Advertising companies managing hundreds of hoardings often rely on spreadsheets and manual tracking to monitor inventory and find advertisers.

This results in:

- Vacant billboards remaining unbooked for weeks
- Revenue loss due to delayed sales action
- Poor visibility into upcoming vacancies
- Inefficient lead targeting and outreach

DigiPlus Smart Leads solves this by predicting vacancies before they occur and recommending the most suitable advertisers automatically.

---

## ✨ Key Features

###  Mumbai GIS Heat Map

Visualize billboard inventory across Mumbai using an interactive map.

- Real-time site locations
- Vacancy risk visualization
- Traffic-based insights
- Interactive site details

#### Status Classification

- 🟢 Occupied
- 🟡 Vacant within 30 Days
- 🔴 Revenue Risk / Vacant

---

###  Vacancy Prediction Engine

Automatically detects sites becoming vacant within the next 90 days.

**Features**

- Contract expiry monitoring
- Vacancy alerts
- Occupancy gap tracking
- Revenue risk estimation

---

###  AI Lead Recommendation Engine

Identifies the best advertisers for each vacant site.

**Scoring Factors**

- Budget Compatibility
- Industry Relevance
- Historical Booking Patterns
- Relationship Strength
- Location Preference

**Output Example**

```text
Prime Autos      → 92%
Nova Bikes       → 88%
UrbanTrack       → 81%
```

---

###  Explainable AI

Provides transparent reasoning behind recommendations.

**Example**

```text
Prime Autos Recommended Because:

✓ Similar Budget Profile
✓ Previous Campaign Nearby
✓ Industry Match
✓ High Historical Conversion
```

---

###  AI Pitch Generation

Automatically generates personalized sales proposals.

**Inputs**

- Site Information
- Traffic Score
- Customer Profile
- Location Data

**Output**

Ready-to-send sales pitch emails.

---

###  Analytics Cockpit

Executive dashboard with real-time KPIs.

**Metrics**

- Total Inventory
- Occupancy Rate
- Upcoming Vacancies
- Revenue At Risk
- AI Opportunities Generated

---

###  Inventory Management

Manage billboard assets through a centralized interface.

**Features**

- Add New Hoardings
- Auto Geocoding
- Search Inventory
- Delete Sites
- Real-Time Updates

---

##  System Architecture

```text
                    ┌─────────────────┐
                    │   React Frontend │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ Node.js Backend │
                    └────────┬────────┘
                             │
        ┌────────────────────┼────────────────────┐
        ▼                    ▼                    ▼
 ┌─────────────┐    ┌────────────────┐   ┌─────────────┐
 │ Vacancy     │    │ Lead Scoring   │   │ AI Pitch    │
 │ Pipeline    │    │ Engine         │   │ Generator   │
 └─────────────┘    └────────────────┘   └─────────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ Supabase DB     │
                    └─────────────────┘
```

---

##  End-to-End Workflow

```text
Inventory Data
      +
Customer Data
        ↓
Vacancy Detection
        ↓
GIS Visualization
        ↓
Revenue Risk Analysis
        ↓
AI Lead Matching
        ↓
Lead Ranking
        ↓
Explainable AI
        ↓
AI Pitch Generation
        ↓
Sales Outreach
        ↓
Higher Occupancy
        ↓
Increased Revenue
```

---

##  Core Algorithms

### Vacancy Pipeline

Classifies hoardings into:

```text
occupied_long
occupied_medium
vacant_soon
vacant
```

Based on contract expiry dates and occupancy status.

---

### Lead Scoring Algorithm

Weighted Recommendation Model:

```text
Match Score =
40% Location Match
30% Budget Match
20% Industry Match
10% Relationship Score
```

Advertisers are ranked and the Top 3 recommendations are displayed.

---

### Revenue Risk Analysis

```text
Revenue Risk =
Monthly Rate × Vacancy Duration
```

Helps prioritize high-value inventory.

---

##  Tech Stack

### Frontend

- React 18
- Vite
- Leaflet
- React-Leaflet
- Axios
- Lucide React

### Backend

- Node.js
- Express.js
- JWT Authentication
- REST APIs

### Database

- Supabase
- PostgreSQL

### AI Components

- Lead Scoring Engine
- Explainable AI Layer
- AI Pitch Generator

---

##  Project Structure

```bash
Digiplus
├── backend
│   ├── routes
│   ├── services
│   ├── leadScorer.js
│   ├── aiPitch.js
│   └── server.js
│
├── frontend
│   ├── src
│   │   ├── components
│   │   ├── api
│   │   └── App.jsx
│
└── README.md
```

---

##  Future Enhancements

- K-Means GIS Clustering
- Vacancy Forecasting using Machine Learning
- Customer Churn Prediction
- Dynamic Pricing Engine
- Automated CRM Integration
- WhatsApp Outreach Automation
- Multi-City Expansion

---

##  Business Impact

### Before DigiPlus

```text
Manual Tracking
      ↓
Late Vacancy Detection
      ↓
Lost Revenue
```

### After DigiPlus

```text
AI Vacancy Prediction
      ↓
Smart Lead Matching
      ↓
Automated Outreach
      ↓
Higher Occupancy
      ↓
Revenue Growth
```

---

## 👨‍💻 Team DigiPlus

### Smart Leads Agent for Hoardings

Transforming billboard inventory into actionable revenue intelligence through AI, GIS, and predictive analytics.

---

⭐ If you like this project, consider giving it a star on GitHub!
