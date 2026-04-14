

# Fix: Make All Premium Features Accessible + GitHub Sync

## Problem
On mobile (your current 418px viewport), the sidebar is hidden and the **BottomNav only shows 5 tabs**: Home, Breathe, Sleep, Library, Profile. This means 15+ premium features (Coach, Sound Bath, Body Scan, Challenges, Rituals, Focus Mode, Walking Meditation, Affirmations, Sleep Stories, Gratitude Garden, etc.) are completely unreachable.

## Solution

### 1. Add an "Explore" tab to BottomNav
Replace one of the less critical tabs (or add a 5th "Explore" / "More" tab) that opens a full-screen feature grid showing all premium features organized by category.

**New BottomNav tabs:**
- Home → `/app`
- Breathe → `/app/breathing`  
- Explore → `/app/explore` (NEW — gateway to all features)
- Sleep → `/app/sleep`
- Profile → `/app/profile`

### 2. Create ExplorePage (`/app/explore`)
A beautiful categorized grid of all features, organized into sections:
- **Mindfulness**: Library, Journal, Mood Tracker, Gratitude Garden, Affirmations
- **Movement & Body**: Body Scan, Walking Meditation, Breathing
- **Sleep & Relaxation**: Sleep Stories, Sound Bath, Focus Mode
- **Growth**: Challenges, Daily Rituals, Coach, Achievements, Analytics
- **Tools**: Timer, SOS Relief, Offline Downloads, Resources, Certificate

Each feature shown as a card with icon, label, and a premium badge where applicable.

### 3. Add quick-access feature grid to Dashboard
Add a "Your Tools" section on the Dashboard below the hero, showing 6-8 most-used features as icon cards — so users can discover them without navigating to Explore.

### 4. Add route for ExplorePage
Register `/app/explore` in `App.tsx`.

### 5. GitHub Sync
Lovable automatically syncs to your connected GitHub repository. If your **serene-mindful** repo is connected via Connectors → GitHub, all changes will push automatically. If not connected yet, you'll need to connect it from the Connectors panel.

## Files to create/modify
- **Create** `src/pages/ExplorePage.tsx` — full feature grid page
- **Edit** `src/components/BottomNav.tsx` — replace Library tab with Explore
- **Edit** `src/pages/DashboardPage.tsx` — add quick-access feature cards section
- **Edit** `src/App.tsx` — add `/app/explore` route

