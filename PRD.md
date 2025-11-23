# Product Requirements Document (PRD)

## 1. Product Overview
**Product Name**: Banana Remix
**Vision**: To become the "GitHub for Art," where visual creativity is forked, remixed, and evolved collaboratively using AI.
**Target Audience**: Gen Z, Digital Artists, Casual Creators, and AI Enthusiasts.

## 2. Problem Statement
Social media is currently passive. Users consume content (scroll & like) but rarely interact with it creatively. AI art tools exist but are often solitary experiences, disconnected from a social graph.

## 3. Solution
Banana Remix bridges the gap by embedding powerful generative AI tools directly into a social feed. It lowers the barrier to creation by providing context-aware suggestions and treating every photo as a canvas for collaboration.

## 4. Functional Requirements

### 4.1 Authentication
-   [x] Mock Login/Signup screen.
-   [x] Mock Google Auth button.
-   [x] User session persistence (in-memory for demo).

### 4.2 Feed & Discovery
-   [x] Display posts in a vertical scroll.
-   [x] Show author, timestamp, and like counts.
-   [x] "Remix It" CTA prominent on every post.
-   [x] Visual indicator for threads containing remixes.

### 4.3 Creation (The Remix Engine)
-   [x] **Image-to-Image Generation**: User supplies source + prompt -> AI generates result.
-   [x] **Magic Ideas**: AI analyzes the source image and suggests 3 context-relevant styles.
-   [x] **Surprise Me**: Random style shuffler.
-   [x] **Auto-Save**: Drafts are saved automatically during editing.
-   [x] **Comparison**: Users can revert/compare generated image before posting.

### 4.4 Thread View
-   [x] Display the lineage of an image (Original -> Remixes).
-   [x] **Interactive Comparison**: "Swipe-to-Compare" slider to visualize changes between parent and child images.
-   [x] Metadata transparency: Show the prompt used to create the remix (Tooltip).

### 4.5 Profile & Social
-   [x] User profile with Avatar, Bio, and Stats.
-   [x] Tabs for Posts, Remixes, and Friends.
-   [x] **Drafts Manager**: Restore or delete unfinished work.
-   [x] **Saved Items**: Bookmark interesting remixes.
-   [x] Friend Graph: Add/View friends.

## 5. Non-Functional Requirements
-   **Performance**: AI generation handling must show loading states/skeletons.
-   **UX**: Dark mode aesthetic to make artwork pop.
-   **Accessibility**: AI-generated captions for images.

## 6. Future Roadmap (Post-MVP)
-   **Real Backend**: Integrate Firebase or Supabase for data persistence.
-   **Style Tuner**: Allow users to save their own "Style LoRAs" or presets.
-   **Remix Wars**: Timed challenges where users remix a specific daily image.
-   **Video Remix**: Utilize Gemini's video capabilities to remix static images into short clips.
