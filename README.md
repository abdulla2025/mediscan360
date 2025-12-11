# 🏥 MediScan360

<div align="center">
  <img src="MediScan.png" alt="MediScan360 Logo" width="200"/>
  
  ### AI-Powered Health Triage Assistant
  
  *Analyze symptoms, medical reports, and prescriptions instantly with advanced AI*

  [![React](https://img.shields.io/badge/React-19.2.1-61DAFB?logo=react&logoColor=white)](https://react.dev/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![Vite](https://img.shields.io/badge/Vite-6.2.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
  [![Google Gemini](https://img.shields.io/badge/Gemini-3.0%20Pro-4285F4?logo=google&logoColor=white)](https://ai.google.dev/)
  
</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Screenshots](#-screenshots)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Usage](#-usage)
- [Project Structure](#-project-structure)
- [API Configuration](#-api-configuration)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

**MediScan360** is an intelligent health triage assistant powered by Google's Gemini 3.0 Pro AI. It provides instant medical analysis by processing text symptoms, images of medical reports, prescriptions, and even voice descriptions. The application offers risk assessment, actionable recommendations, and maintains a comprehensive history for multiple user profiles.

### 🎯 Key Capabilities

- 🔍 **Multi-Modal Analysis** - Text, images, PDFs, and voice inputs
- 🎨 **Intelligent Triage** - Risk-based categorization (Low/Medium/High/Critical)
- 👥 **Multi-Profile Support** - Track health for family members
- 🔊 **Voice Input** - Describe symptoms hands-free
- 📚 **Health Knowledge Base** - Integrated medical information
- 📊 **History Tracking** - Complete medical analysis logs
- ♿ **Accessibility** - Elder-friendly mode with larger text

---

## ✨ Features

### 🩺 Health Triage System
- **Symptom Analysis**: Describe symptoms in natural language
- **Medical Document Scanning**: Upload lab reports, X-rays, prescriptions
- **Voice Recording**: Record symptom descriptions via microphone
- **Risk Assessment**: Automatic severity classification
- **Actionable Recommendations**: Step-by-step guidance

### 👨‍👩‍👧‍👦 Profile Management
- **Multiple User Profiles**: Track health for Me, Mom, Dad, Child
- **Color-Coded Profiles**: Easy visual identification
- **Profile-Specific History**: Separate medical records per person

### 📖 Knowledge Base
- Search medical conditions, symptoms, and treatments
- Comprehensive health information database
- Quick reference guide

### 📝 History & Tracking
- Complete analysis history with timestamps
- Risk level indicators
- Profile filtering
- Export capabilities

### ♿ Accessibility Features
- **Elder Mode**: Larger fonts and simplified interface
- **Voice Input**: For users with mobility challenges
- **High Contrast**: Enhanced readability

---

## 📸 Screenshots

<div align="center">
  <img src="1. Font.png" alt="Main Interface" width="45%"/>
  <img src="2. Log.png" alt="Analysis Result" width="45%"/>
  <img src="3. Knowledge.png" alt="Knowledge Base" width="45%"/>
  <img src="4. Result 1.png" alt="History Tracking" width="45%"/>
</div>

---

## 🛠 Tech Stack

### Frontend
- **React 19.2.1** - UI framework
- **TypeScript 5.8.2** - Type safety
- **Vite 6.2.0** - Build tool & dev server
- **Lucide React** - Icon library

### AI & Backend
- **Google Gemini 3.0 Pro** - Multimodal AI model
- **@google/genai** - Official Gemini SDK

### Storage
- **LocalStorage** - Client-side data persistence

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Google AI API Key** ([Get one here](https://ai.google.dev/))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/abdulla2025/mediscan360.git
   cd mediscan360
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   API_KEY=your_google_gemini_api_key_here
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

---

## 💡 Usage

### 1️⃣ Select Profile
Click the profile dropdown to choose who you're analyzing health data for (Me, Mom, Dad, Child).

### 2️⃣ Input Symptoms
Choose your preferred input method:
- **Text**: Type symptoms in the text area
- **Voice**: Click the microphone icon and speak
- **Images**: Upload medical reports, prescriptions, or photos
- **Combination**: Use multiple input types together

### 3️⃣ Analyze
Click the "Analyze Health Data" button to receive:
- Risk level assessment
- Detailed analysis
- Actionable recommendations
- Related conditions information

### 4️⃣ Review History
Switch to the History tab to:
- View past analyses
- Filter by profile
- Track health trends over time

### 5️⃣ Access Knowledge Base
Use the Knowledge Base tab to:
- Search medical information
- Learn about conditions and treatments
- Get health education resources

---

## 📁 Project Structure

```
mediscan360/
├── components/
│   ├── AnalysisResult.tsx    # Results display component
│   ├── VoiceInput.tsx         # Voice recording component
│   ├── KnowledgeBase.tsx      # Medical info component
│   └── History.tsx            # Analysis history component
├── services/
│   └── geminiService.ts       # Gemini AI integration
├── App.tsx                    # Main application component
├── types.ts                   # TypeScript type definitions
├── constants.ts               # Configuration constants
├── index.tsx                  # Application entry point
├── index.html                 # HTML template
├── package.json               # Dependencies
├── tsconfig.json              # TypeScript config
├── vite.config.ts             # Vite configuration
└── README.md                  # Documentation
```

---

## 🔑 API Configuration

### Google Gemini API Setup

1. Visit [Google AI Studio](https://ai.google.dev/)
2. Create a new project or select existing
3. Generate an API key
4. Add the key to your `.env` file:
   ```env
   API_KEY=your_api_key_here
   ```

### Model Configuration

The app uses **Gemini 3.0 Pro** with structured output:
- Temperature: 0.7
- Response format: JSON
- Context window: Large multimodal context

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/AmazingFeature
   ```
5. **Open a Pull Request**

### Development Guidelines
- Follow TypeScript best practices
- Maintain existing code style
- Add comments for complex logic
- Test thoroughly before submitting

---

## ⚠️ Disclaimer

**MediScan360 is NOT a substitute for professional medical advice, diagnosis, or treatment.** Always consult qualified healthcare providers for medical concerns. This tool is designed to provide preliminary information and should not be used for emergency medical situations.

### Important Notes:
- 🚨 In case of emergency, call your local emergency services
- 👨‍⚕️ Always verify AI suggestions with healthcare professionals
- 📊 This tool is for informational purposes only
- 🔒 Keep your medical data secure and private

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Abdulla**

- GitHub: [@abdulla2025](https://github.com/abdulla2025)
- Repository: [mediscan360](https://github.com/abdulla2025/mediscan360)

---

## 🙏 Acknowledgments

- Google Gemini team for the powerful AI model
- React and Vite communities for excellent tooling
- Lucide for beautiful icons
- All contributors and users of MediScan360

---

<div align="center">
  
  ### ⭐ Star this repo if you find it helpful!
  
  Made with ❤️
  
</div>
