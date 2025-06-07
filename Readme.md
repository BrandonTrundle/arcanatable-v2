# ArcanaTable Modules

ArcanaTable is a modular virtual tabletop system designed for TTRPG campaigns. This repository contains three major modules that define the core user experience: **Campaign Management**, **DM Toolkit (Entries)**, and **DM Toolkit (Maps)**. The system emphasizes modularity, component-driven UI, and mock-driven prototyping ready for backend integration.

---

## 📁 Campaign Module

Handles campaign creation, listing, joining, and management. Provides a dashboard for users to interact with their campaigns and includes support for house rules and player assignment.

### Core Components

- **CampaignDashboard.jsx** – Main hub for all campaign activity.
- **CreateCampaign.jsx** – Campaign initialization with metadata and rule assignment.
- **JoinCampaign.jsx** – Invite code entry to join campaigns.
- **CampaignCard.jsx** – Summary card for campaign browsing.
- **EditCampaignOverlay.jsx** – Admin modal for modifying campaign details.

### Features

- Create/join campaigns via form-based UI.
- Display and manage homebrew rules per campaign.
- DM-focused management dashboard for editing players and session metadata.
- Rule assignment and filtering integrated into modals.

---

## 📁 DM Toolkit – Entries

A library system for managing reusable game content: Tokens, Items, Monsters, NPCs, Potions, Rules, Cheat Sheet entries, and Map Assets.

### Modules and Features

Each module includes:

- **Main View** (e.g. `Tokens.jsx`, `Items.jsx`) – Searchable, campaign-aware listings.
- **Form Component** – Controlled forms for content creation.
- **Card Component** – Summary displays with optional Edit/Delete buttons.
- **Detail Modal** – Full stat block or description views.

Supported entry types:

- **Tokens** – Grid-based game markers with HP, initiative, and size.
- **Items** – Magical and mundane equipment with mechanics.
- **Monsters** – Full stat blocks with traits/actions.
- **NPCs** – Social characters with narrative metadata.
- **Potions** – Consumables with effects, duration, and side-effects.
- **Rules** – Campaign-scoped homebrew logic.
- **Cheat Sheet** – Quick-reference notes and rules.
- **Map Assets** – Props and scenery for map layering.

### Notes

- All modules are mock-driven with stubbed submission logic.
- Designed to support campaign filtering and future backend storage.
- Entry creation auto-links entries to the current campaign context.

---

## 📁 DM Toolkit – Maps

Interactive map editor designed for DMs. Provides drag-and-drop, layered rendering, fog of war, notes, and token/asset placement.

### Main Component

- **ToolkitMapEditor.jsx** – Entry point and central state controller for maps.

### Canvas Structure (MapCanvas.jsx)

Rendered using React Konva:

1. **StaticMapLayer** – Background map image and grid.
2. **FogAndBlockerLayer** – Handles dynamic fog and blockers.
3. **MapAssetLayer** – Visual objects like wagons or scenery.
4. **MapTokenLayer** – Interactive token rendering.
5. **Reserved Tool Layer** – Reserved for future drawing tools.

### Panels and Controls

- **ToolkitMapEditorToolbar.jsx** – Controls grid, fog, layers, and tool modes.
- **TokenPanel.jsx** – Token library and drag-drop system.
- **MapSizePanel.jsx** – Resize canvas dynamically.
- **NotesPanel.jsx** – Create and highlight cell-tied notes.

### System Highlights

- Supports fog reveal based on token movement.
- Token and asset drag handling via ghost preview logic.
- Layers are isolated, performant, and hot-swappable.
- Map metadata managed via `Maps.jsx`, `MapCard.jsx`, and `MapForm.jsx`.

---

## 🧪 Mocked, But Ready

All modules currently use mocked data (`MOCK_CAMPAIGNS`, `tokenTemplate`, `mapTemplate`, etc.) and stubbed submit handlers. The architecture is built with future integration in mind, ready for persistent backend storage and socket-driven collaboration.

---

## 🔮 Planned Enhancements

- Real-time socket-based updates (multi-user editing).
- Undo/redo state history.
- Mobile-friendly stat blocks.
- Backend CRUD for all entries.
- Draw tools and advanced map interactions.

---

## 🛠 Tech Stack

- **React** + **React Router**
- **React Konva** for canvas rendering
- **CSS Modules** for scoped styling
- **Mock Data** for all user-generated content
- **Component-based architecture** for separation of concerns

---

## 📌 Dev Notes

- All modals and forms are designed with UX clarity in mind.
- Component names reflect function and file location.
- Local state is maintained via `useState`, updates via lifted state or props.
- Placeholder actions are marked as TODO for integration.

---

## ⚠️ Disclaimer

This is a work-in-progress development environment. Live collaboration, authentication, and data persistence are not yet implemented.

---
