# Note.lat - AI-Powered Note Taking Platform

Note.lat is an intelligent note-taking platform that leverages cutting-edge AI technologies to transform audio lectures into organized, searchable notes with automated summaries and smart tagging.

## Features

### Audio Recording & Transcription
- Real-time audio recording of lectures and conversations
- High-accuracy speech-to-text conversion powered by OpenAI Whisper
- Support for multiple audio formats and languages

### AI-Powered Note Processing
- Automatic note summarization using LLaMA
- Intelligent title generation
- Smart tag extraction and categorization- Real-time processing and streaming responses

### User Management
- Secure user authentication and authorization
- University/institution-based organization
- Personal notebook management
- Course-specific note organization

### Data Storage & Management
- Neo4j graph database for efficient note organization
- Complex relationship mapping between notes, courses, and tags
- Fast search and retrieval capabilities
- Scalable data architecture

## Screenshots
### Home
![Home](./screenshots/home.png)

#### Mobile Home
<img src="./screenshots/home-mobile.png" width="50%" align="center">

#### User Logged In
![User Logged In](./screenshots/home-logged.png)

### Demo
![Demo](./screenshots/demo.png)

### Recording Interface
#### Recording Page without Login
![Recording Page](./screenshots/recording-page.png)
#### Recording Page Idle
![Recording Page](./screenshots/recording-page-idle.png)
#### Recording In Progress
![Recording](./screenshots/recording.png)
#### Recording finished
![Recording Finished](./screenshots/recorded.png)

### Note Summary
![Note Summary](./screenshots/summary.png)

### Login
![Login](./screenshots/login.png)

#### Mobile Login
<img src="./screenshots/login-mobile.png" width="50%" align="center">

### Register
![Register](./screenshots/register.png)

#### Mobile Register
<img src="./screenshots/register-mobile.png" width="50%" align="center">

#### University Selection
![University Selection](./screenshots/university.png)

### Dashboard
![Dashboard](./screenshots/dashboard.png)

#### Mobile Dashboard
<img src="./screenshots/dashboard-mobile.png" width="50%" align="center">

#### Collapsable Sidebar
<img src="./screenshots/mobile-sidebar.png" width="50%" align="center">

### Note Management
![Note Management](./screenshots/note-management.png)

#### Tagging Notes
![Tagging Notes](./screenshots/tagging.png)

#### Search Notes
![Search Notes](./screenshots/search.png)

#### Note Details
![Note Details](./screenshots/note.png)

### Note Recommendation
![Note Recommendation](./screenshots/recommendation.png)

#### Navigate to Recommended Notes
![Navigate to Recommended Notes](./screenshots/recommended-notes.png)

### Settings
![Settings](./screenshots/settings.png)

### Logout
![Logout](./screenshots/logout.png)

### Not logged in
![Not logged in](./screenshots/not-login.png)

### Already Registered
![Already Registered](./screenshots/registered.png)

## Technical Architecture

### Frontend
- Next.js for server-side rendering
- React for dynamic UI components
- Tailwind CSS for styling
- Real-time audio processing

### Backend
- Neo4j database for graph-based data storage
- OpenAI Whisper API integration
- LLaMA model integration
- RESTful API endpoints

### Key Features Implementation
- Streaming response handling for real-time transcription
- WebSocket integration for live updates
- Efficient blob handling for audio processing
- Secure user session management

## Getting Started

1. Clone the repository```
git clone https://github.com/365cent/note-app```

2. Install dependencies
```
npm install
```

3. Configure environment variables 

(not required)

4. Set up Neo4j database

Visit [neo4j-backend](https://github.com/MSomnia/neo4j-backend) for more information.

5. Run development server
```
npm run dev
```

## Credit
This project is built with the help of the following resources:
- [Neo4j](https://neo4j.com/)
- [OpenAI Whisper](https://github.com/openai/whisper)
- [LLaMA](https://github.com/facebookresearch/llama)
- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React](https://reactjs.org/)
- [Cloudflare](https://www.cloudflare.com/)
- [Vercel](https://vercel.com/)

Special thanks to:
- [MSomnia](https://github.com/MSomnia) for developing the Neo4j backend
- [Cloudflare Workers AI](https://developers.cloudflare.com/workers-ai/) for providing free credits for AI transcription and text generation


