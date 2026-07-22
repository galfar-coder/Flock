# Flock

Flock is a modern, lightweight, and customizable web client built for [Spacebar](https://spacebar.chat) (formerly Fosscord).
Designed as an alternative to official chat clients.

Built from the ground up with Next.js and React, Flock focuses on speed, an intuitive user interface, and zero-dependency custom parsers.

## Features

* **Real-Time Communication:** Fully integrates with the Spacebar WebSocket Gateway for instant message delivery, typing indicators, and presence updates.
* **Optimistic UI Updates:** Messages render instantly on the client side while waiting for server validation, ensuring a fluid typing experience.
* **Custom Markdown Engine:** Features a zero-dependency, highly optimized markdown and element parser supporting:
    * Nested formatting (bold, italics, strikethrough)
    * Code blocks and inline code
    * Custom server emojis (static and animated)
    * User, role, and channel mentions
* **Lazy Loaded Profiles:** Optimizes bandwidth by requesting full user profiles (bios, pronouns, banners) only when a user is interacted with.
* **Role-Based Member Lists:** Accurately groups users by their highest server role, complete with real-time online/offline status indicators.
* **Unread State Tracking:** Syncs directly with the server's read state to track unread messages and mention counts across channels and direct messages.
* **And more!**

## Tech Stack

* **Framework:** Next.js (App Router)
* **Library:** React
* **Styling:** Tailwind CSS & Custom CSS
* **Components:** shadcn/ui *(modified)*

## Getting Started (For Users)
**At the moment, the app is not complete, and not available to the public *yet***

## Getting Started (For Developers)

### Prerequisites

Ensure you have the following installed on your machine:
* Node.js (v18 or higher)
* npm, yarn, or pnpm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/galfar-coder/flock.git
cd flock
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Configure your instance:
   By default, Flock may point to a specific Spacebar instance. Check the `lib/constants.ts` or `.env` file to set your preferred API, CDN, and Gateway URLs.

4. Start the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

5. Open your browser and navigate to `http://localhost:3000`.

## Configuration

Flock is designed to connect to any Spacebar-compatible backend. You will need to ensure your target instance supports the standard Discord(Spacebar) API v9 specification.

If you are encountering CORS issues during development, ensure your `next.config.ts` is set up to rewrite API requests to your target instance backend.

## Project Structure

* `/app` - Next.js App Router pages and layouts.
* `/components` - Reusable custom UI components (buttons, dialogs, popovers).
* `/components/ui` - Modified shadcn components for UI
* `/components/app` - Core chat components (message bubbles, sidebars, member lists).
* `/components/websocket` - Gateway connection management and real-time state.
* `/lib/parsers` - Custom Markdown and token parsing logic.
* `/types` or `/lib` - Extended API interfaces and custom data models.

## Contact
In case any contact should be made,
the options to the individuals that hold the copyright to this app and repository are listed below.

* galfar.exe
    * Discord [galfar.exe](https://discord.com/users/921808259688583258)
    * Email [galfar69420@gmail.com](mailto:galfar69420@gmail.com)
* Topeeez
    * Discord [Topeeez](https://discord.com/users/759471793995644969)

## License

This project is licensed under the GNU General Public License v3.0.
See the [LICENSE](LICENSE) file for details.

Copyright (C) 2026 galfar.exe and Topeeez