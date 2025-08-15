# LYXA Todo App

A modern, responsive Kanban-style task management application designed for productivity and ease of use. Built with React, TypeScript, and Tailwind CSS to provide a seamless experience across all devices.

## Key Features

### Task Organization
- **Three-Stage Workflow**: Organize tasks across New, Ongoing, and Done columns
- **Visual Task Cards**: Clean, readable cards displaying task title, description, and status
- **Task Counter**: See at a glance how many tasks are in each stage

### Intuitive Drag & Drop
- **Cross-Column Movement**: Drag tasks between columns to change their status
- **Within-Column Reordering**: Arrange tasks in your preferred order within each column
- **Mobile-Optimized**: Touch-friendly drag and drop that works perfectly on mobile devices
- **Visual Feedback**: Tasks animate and provide clear visual cues during movement

### Smart Due Date Management
- **Due Date Setting**: Add due dates to ongoing tasks to stay on track
- **Overdue Alerts**: Automatic notifications when tasks pass their due dates
- **Visual Indicators**: Overdue tasks are clearly marked with distinctive styling
- **One-Time Notifications**: Each task alerts only once to avoid notification spam

### Multiple Interaction Methods
- **Drag & Drop**: Primary method for moving tasks around
- **Context Menu**: Right-click any task for quick movement options
- **Mobile-Friendly Buttons**: Tap the menu button on mobile for easy task management

### Responsive Design
- **Desktop Layout**: Three-column side-by-side view for maximum productivity
- **Mobile Layout**: Stacked columns optimized for touch interaction

### Data Persistence
- **Local Storage**: Your tasks are automatically saved and restored between sessions
- **No Account Required**: Start using immediately without creating accounts or logging in

## Getting Started

### What You'll Need
- A modern web browser (Chrome, Firefox, Safari, or Edge)
- Node.js version 20.19.0 or newer if you want to run it locally

### Quick Start
1. **Download or Clone**: Get the project files to your computer
2. **Install Dependencies**: Run the installation command to set up the project
3. **Start the App**: Launch the development server
4. **Open in Browser**: Navigate to the local address to start using LYXA Todo

### Development Commands

Once you have the project set up locally, you can use these commands:

```bash
# Install dependencies
npm install

# Start development server (with hot reload)
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Run ESLint to check code quality
npm run lint

# Fix ESLint issues automatically
npm run lint:fix

# Format code with Prettier
npm run format

# Check if code is properly formatted
npm run format:check
```

**Most Common Commands:**
- `npm run dev` - Start developing (this is what you'll use most)
- `npm run lint` - Check your code before committing
- `npm run build` - Create production build when ready to deploy

## Technical Overview

### Built With Modern Technology
- **React 19**: Latest version for optimal performance and features
- **TypeScript**: Type-safe code for reliability and maintainability
- **Tailwind CSS v4**: Modern styling for beautiful, responsive design
- **DND Kit**: Professional drag-and-drop functionality
- **Vite**: Fast development and optimized builds

### Quality Assurance
- **TypeScript**: Catches errors before they reach users
- **ESLint**: Maintains consistent, high-quality code
- **Responsive Testing**: Verified across different screen sizes and devices
- **Accessibility Testing**: Ensures usability for all users