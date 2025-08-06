ATOMITY AI
An ultra-intelligent AI assistant designed for advanced reasoning, geospatial analysis, and multi-modal data processing to solve complex cases.

🚀 Overview
ATOMITY is a sophisticated AI chatbot built to assist in complex investigations and analytical tasks. Leveraging the power of Google's Gemini-2.5-Flash model, ATOMITY acts as a brilliant analytical partner, capable of processing textual queries, analyzing images, summarizing documents, and plotting critical geospatial data on an interactive map.
The application is framed with a specific persona: an AI entity providing precise, evidence-based deductions for official use within India, making its responses contextually aware and highly specialized. It's a demonstration of how powerful language models can be harnessed for specialized, high-stakes applications.
✨ Key Features
Advanced AI Reasoning: Powered by Google Gemini, providing nuanced and logical analysis for complex problems.
Multi-Modal Capabilities:
Image Analysis: Upload images for detailed examination of objects, faces, and landmarks.
Document Processing: Attach PDF or text files for summarization and key entity extraction.
Text Queries: Engage in a natural language conversation for in-depth problem-solving.
Dynamic Geospatial Mapping: The AI can generate and display interactive maps with locations and routes relevant to a case, directly within the chat interface, by sending a structured JSON payload.
Real-time Streaming: Experience fluid interactions as the AI streams its analysis live, providing immediate feedback.
Specialized AI Persona: A carefully crafted system instruction guides the AI to behave as a formal, precise, and analytical investigator, ensuring high-quality, structured outputs.
Modern & Responsive UI: A sleek, dark-themed interface built with React, TypeScript, and Tailwind CSS, ensuring a professional and focused user experience across all devices.
🛠️ Technology Stack
Frontend: React, TypeScript, Tailwind CSS
AI Engine: Google Gemini API (@google/genai)
Mapping: Leaflet & React-Leaflet
Client-Side File Processing: pdf.js for efficient in-browser PDF text extraction.
⚙️ How It Works
Interact: The user poses a query or attaches a file (image, PDF, .txt).
Process: The frontend intelligently processes the input. Text is sent directly, while files are converted appropriately (Base64 for images, text extraction for documents) to enrich the prompt sent to the AI.
Analyze: A request is sent to the Gemini API, which operates under a detailed system instruction to ensure its responses are structured, logical, and context-aware.
Respond & Visualize: The AI's response is streamed back to the user. If the analysis includes geospatial data, a special [MAP_DATA] block in the response is parsed and used to render an interactive map, seamlessly integrating visual data with the textual analysis.
# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
