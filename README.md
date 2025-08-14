# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

# LYXA Todo

A responsive Kanban-style Todo application built with React, TypeScript, and Tailwind CSS.

## Features

- **Three-Column Kanban Board**: New, Ongoing, and Done columns
- **Task Management**: Create, move, and organize tasks
- **Drag & Drop**: Drag tasks between columns and reorder within columns
- **Due Dates & Overdue Alerts**: Set due dates for ongoing tasks with automatic overdue notifications
- **Right-Click Context Menu**: Quick task movement between columns
- **Responsive Design**: Desktop (3 columns) and mobile (stacked) layouts
- **Local Storage Persistence**: Tasks are automatically saved and restored
- **Accessibility**: Full keyboard navigation and screen reader support

## Tech Stack

- **Frontend**: React 19 + TypeScript
- **Styling**: Tailwind CSS v4
- **Drag & Drop**: @dnd-kit/core + @dnd-kit/sortable
- **Build Tool**: Vite
- **Code Quality**: ESLint + Prettier

## Getting Started

### Prerequisites

- Node.js (v20.19.0 or higher recommended)
- npm

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd lyxa-todo-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

## Usage

### Creating Tasks
1. Use the form in the "New" column to create tasks
2. Enter a title (required) and optional description
3. Click "Add Task" to create

### Moving Tasks
- **Drag & Drop**: Click and drag tasks between columns or within the same column to reorder
- **Right-click** on any task to open the context menu
- **Click the ⋯ button** on any task for keyboard/mouse access
- Select the destination column to move the task

### Due Dates
- Tasks in the "Ongoing" column can have due dates
- Use the datetime input to set or modify due dates
- Overdue tasks are marked with a red border and "Overdue" badge
- Automatic alerts notify you when tasks become overdue

### Responsive Design
- **Desktop**: Three columns side by side
- **Mobile**: Columns stack vertically with clear section headers

### Drag & Drop Behavior
- **Cross-Column**: Drag a task over another column to move it and update its status
- **Within Column**: Drag tasks vertically to reorder them within the same column
- **Ordering Rules**: 
  - New tasks are created at the top of the "New" column
  - Moving between columns appends to the bottom by default
  - Manual reordering via drag & drop overrides automatic positioning
- **Visual Feedback**: Tasks become semi-transparent and slightly rotated while dragging

## Overdue Logic

The app checks for overdue tasks every 30 seconds:
1. Tasks in "Ongoing" status with `dueAt < current time` trigger alerts
2. Each task shows an alert only once (`overdueNotified` flag)
3. Updating the due date to a future time resets the overdue status
4. Visual indicators (red border + "Overdue" badge) mark overdue tasks

## Local Storage

Tasks are automatically saved to localStorage and restored on page load. No external database required.

## Project Structure

```
src/
├── components/
│   ├── Column/
│   ├── ContextMenu/
│   ├── NewTaskForm/
│   └── TaskCard/
├── lib/
│   ├── storage.ts     # localStorage utilities
│   └── time.ts        # date/time utilities
├── state/
│   ├── initialState.ts
│   ├── reducer.ts     # task state management
│   └── types.ts
├── types/
│   └── index.ts       # TypeScript interfaces
├── App.tsx
├── main.tsx
└── index.css
```

## License

MIT License

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
