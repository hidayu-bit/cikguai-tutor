# CikguAI Tutor 🎓✏️

An AI-powered interactive whiteboard tutoring web app built for Malaysian primary and secondary students. CikguAI writes step-by-step explanations in natural handwriting on an infinite canvas, highlights key exam clues, supports two-way voice interaction, and notifies parents via n8n if their child is inactive for 3 days.

## ✨ Core Features
- **Infinite Interactive Whiteboard (`tldraw`):** Real-time AI handwriting, yellow highlights, colored underlines, and auto-follow camera tracking.
- **3 Learning Modes:**
  - **Topic Mode:** Structured concept notes and comprehension checks aligned with Malaysian syllabus (KSSR/KSSM).
  - **Exam Prep Mode:** Interactive UASA/SPM-style drills with visual clue underlining.
  - **Homework Mode:** Upload worksheet photos or paste links for step-by-step Socratic guidance.
- **AI Tutor Personas:** Choose between **Marcel** (warm & friendly) or **Ruby** (energetic & fun) in Bahasa Melayu or English.
- **Automated Parent Inactivity Alerts:** Scheduled n8n + MySQL workflow that emails parents a gentle progress update after 3 days of student inactivity.

## 🛠️ Tech Stack
- **Frontend:** React (Vite), `tldraw`, Web Speech API (STT & TTS)
- **AI Engine:** Google Gemini (`gemini-3.5-flash-lite`) with OpenRouter (`openrouter/free`) automatic fallback
- **Backend & Database:** Node.js/Express, MySQL
- **Automation:** n8n

## 🚀 Local Setup
1. Clone the repository:
   ```bash
   git clone [https://github.com/hidayu-bit/cikguai-tutor.git](https://github.com/hidayu-bit/cikguai-tutor.git)
   cd cikguai-tutor