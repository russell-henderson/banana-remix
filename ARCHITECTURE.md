# Architecture Documentation

## Overview

Banana Remix is a **Single Page Application (SPA)** built with React. It utilizes a centralized state management approach within the root component to simulate a backend database for this demo version, while relying on external AI services for core functionality.

## 📁 File Structure

```
/
├── components/          # Reusable UI components
│   ├── AuthScreen.tsx   # Login/Signup logic
│   ├── Button.tsx       # Standardized button component
│   ├── CompareSlider.tsx# UI for comparing Original vs Remix
│   ├── Navbar.tsx       # Bottom navigation
│   └── RemixCreator.tsx # Core feature: AI generation modal
├── services/
│   └── geminiService.ts # Interface with Google Gemini API
├── App.tsx              # Main controller, state container, and router
├── types.ts             # TypeScript interfaces (User, Post, Remix, Draft)
├── index.tsx            # Entry point
└── index.html           # HTML template & Import maps
```

## 🧩 Key Components

### 1. State Management (`App.tsx`)
The `App` component acts as the "Source of Truth". It holds state for:
-   **User Session**: `currentUser`
-   **Data Store**: `users`, `posts`, `drafts` (Mock database)
-   **Navigation**: `navState` (Routing logic)
-   **Remix Context**: `remixTarget` (Data passing between feed and creator)

### 2. AI Integration (`services/geminiService.ts`)
This service acts as the bridge to the Google Gemini API.
-   **`remixImage`**: Takes a base64 source image and a text prompt. Uses `gemini-2.5-flash-image` to generate a modified version.
-   **`getRemixSuggestions`**: Uses `gemini-2.5-flash` to analyze an image (Multimodal capability) and output creative text prompts.
-   **`generateImageCaption`**: Helper for accessibility and content creation.

### 3. Remix Engine (`RemixCreator.tsx`)
A complex modal component that manages the generation lifecycle:
-   Handles user input (Prompt typing or Magic Ideas selection).
-   Manages the "Thinking" state and error handling.
-   Implements an **Auto-save loop** (`setInterval`) to update drafts in `App.tsx` every 3 seconds if changes are detected.

## 🔄 Data Flow

1.  **Read**: `App.tsx` passes data (`posts`, `users`) down to render functions (`renderFeed`, `renderThread`).
2.  **Write**: Child components trigger actions via callbacks (e.g., `onRemixCreated`, `onSaveDraft`).
3.  **Update**: `App.tsx` updates the state, triggering a re-render of the relevant view.

## 🧬 Data Models

### Post & Remix
The relationship between content is hierarchical.
-   **Post**: The root node. Contains the original image.
-   **Remix**: Linked to a `parentId` (either a Post or another Remix). This creates a tree structure visualized in the "Thread" view.

### Drafts
Drafts are polymorphic.
-   `type: 'POST'`: Saves an uploaded image and caption.
-   `type: 'REMIX'`: Saves the source image reference, prompt, and generated result.

## 🎨 Design System

-   **Theme**: Dark Mode default (`#0f0f12`).
-   **Accent**: "Banana Yellow" (`#ffbf0f`).
-   **Framework**: Tailwind CSS configured via CDN for rapid prototyping.
