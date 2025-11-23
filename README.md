# Banana Remix 🍌

**Banana Remix** is a next-generation social creativity platform that creates a collaborative art experience. Instead of just "liking" a photo, users are invited to **remix** it—using generative AI to transform their friends' photos into new artistic interpretations while maintaining the original composition.

## ✨ Key Features

-   **AI-Powered Remixing**: Transform any photo using the Gemini 2.5 Flash Image model.
-   **Magic Ideas**: Context-aware AI suggestions that analyze your image and propose unique remix styles.
-   **Remix Threads**: Visual lineage tracking that shows how an image evolves from the original through various remixes.
-   **Swipe-to-Compare**: Interactive slider to visually compare the remix against its source material.
-   **Smart Drafts**: Auto-saving functionality ensures you never lose a creative spark.
-   **Social Feed**: Browse, like, comment, and save your favorite remixes.
-   **AI Captioning**: Automatically generates creative captions for your uploads.

## 🚀 Getting Started

### Prerequisites

-   Node.js and npm/yarn
-   A valid **Google Gemini API Key** (Paid tier required for certain models/features if applicable, or free tier for development).

### Environment Setup

This application relies on the Google GenAI SDK. You must provide your API Key via an environment variable.

1.  Create a `.env` file in the root directory.
2.  Add your key:
    ```env
    API_KEY=your_google_api_key_here
    ```

### Installation

```bash
npm install
npm start
```

## 🛠 Tech Stack

-   **Frontend**: React 19, TypeScript
-   **Styling**: Tailwind CSS
-   **AI**: Google GenAI SDK (`@google/genai`)
    -   *Vision Model*: `gemini-2.5-flash-image` (Remixing)
    -   *Text Model*: `gemini-2.5-flash` (Captioning & Idea Generation)
-   **Icons**: Lucide React

## 🎮 Usage

1.  **Feed**: Scroll through the timeline to see what your friends are creating.
2.  **Create**: Upload a photo. The AI will suggest a caption. You can post it as an "Original".
3.  **Remix**: Click "Remix It" on any post.
    -   Type a prompt or use **"Magic Ideas"** to get AI suggestions based on the image content.
    -   Hit generate and watch the transformation.
    -   Post it to the thread!
4.  **Profile**: View your portfolio, saved posts, and manage your drafts.

## 📄 License

MIT
