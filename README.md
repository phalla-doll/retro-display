# Retro Split-Flap Display

A web-based, interactive split-flap display inspired by classic departure boards and the modern Vestaboard. Type your messages and watch them flip into place with satisfying animations and sound effects.

**Live Demo:** [https://retro-board.manthaa.dev/](https://retro-board.manthaa.dev/)

## Features

* **Real-time Split-Flap Animation:** Watch characters flip individually just like a mechanical board.
* **Customizable Themes:** 
  * Choose between Dark Grey, Wood, and Brushed Metal finishes for both the frame and the background.
  * **Animated Backgrounds:** Subtle, slow-moving textures and gradients for the Wood and Metal themes add visual depth (can be toggled on/off).
* **Typography Options:** Select from multiple fonts including Inter, Geist Mono, and Space Mono, with both Regular and Bold variants available.
* **Color Blocks:** Insert vibrant color blocks into your messages using a dedicated color palette row.
* **Sound Effects:** Authentic mechanical flipping sounds (can be muted).
* **Message Playlist & Looping:**
  * Create a playlist of multiple messages.
  * Drag-and-drop to reorder messages intuitively.
  * Enable looping to automatically cycle through your playlist.
  * Customizable loop intervals (5s, 10s, 15s, 30s, 60s).
  * Your playlist and loop settings are automatically saved to your browser's local storage.
* **Responsive Design:** A clean, subtle, and glassmorphism-inspired control panel that looks great on any device.

## Tech Stack

* **Framework:** [Next.js](https://nextjs.org/) (App Router)
* **UI Library:** [React](https://react.dev/)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/)
* **Animations:** [Framer Motion](https://motion.dev/)
* **Icons:** [Lucide React](https://lucide.dev/)

## Getting Started

First, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
