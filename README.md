# AI Lesson Plan Generator 

An intelligent lesson plan generator built with React, TypeScript, and Google's Gemini API that creates comprehensive educational content with assessments, materials, and practical exercises.

## Features

### Dynamic Lesson Plan Generation
- Generates detailed lesson plans based on topic input
- Includes learning objectives, prerequisites, and target audience
- Provides estimated duration for each section
- Creates structured content flow with theory and practical components

### Comprehensive Learning Materials
- Detailed theoretical content with examples
- Hands-on practical exercises that can be performed at home
- Assessment questions and assignments
- Recommended reading materials and resources
- Interactive learning activities

### PDF Export Functionality
- Export lesson plans in professional PDF format
- Well-structured document layout
- Includes table of contents
- Printer-friendly formatting

### User Interface Features
- Clean and intuitive design
- Dark mode toggle for comfortable viewing
- User authentication with secure logout
- Responsive layout for all device sizes

##  Technical Stack

### Frontend
- React 19
- TypeScript
- Tailwind CSS for styling
- React PDF for document generation
- React Icons for UI elements

### API Integration
- Google Gemini API for AI-powered content generation
- Environment variables for secure API key management

### Authentication
- Mock authentication with username = demouser and password = demopass

##  Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/ai-lesson-plan-generator.git
cd ai-lesson-plan-generator
```

2. Install dependencies:
```bash
npm install
```

3. Create a .env file in the root directory and add your Gemini API key:
```bash
VITE_GEMINI_API_KEY=your_api_key_here
```

4. Start the development server:
```bash
npm run dev
```