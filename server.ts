import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "15mb" }));

// Lazy-loaded Gemini client
let aiInstance: GoogleGenAI | null = null;

// Health check endpoint
app.get("/api/health", (req, res) => {
  const client = getGeminiClient();
  res.json({
    status: "ok",
    geminiActive: client !== null,
  });
});

function getGeminiClient(): GoogleGenAI | null {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.trim() === "") {
      return null;
    }
    try {
      aiInstance = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    } catch (e) {
      console.error("Failed to initialize Gemini Client", e);
      return null;
    }
  }
  return aiInstance;
}

// 1. API: AI Chat Companion
app.post("/api/gemini/chat", async (req, res) => {
  const { message, history } = req.body;
  const client = getGeminiClient();

  if (!client) {
    // Elegant fallback simulation
    setTimeout(() => {
      let responseText = `This is a simulated AI response. (Configure your GEMINI_API_KEY in Settings > Secrets to enable live Gemini integration).\n\nHere is a tutoring guide for your question: "${message}":\n- **Core Concept:** Understanding the foundational steps is crucial in ${message.substring(0, 15)}...\n- **Quick Tip:** Practice solving at least 3-5 similar practice problems every day.\n- Feel free to ask more, or toggle Mock Roles to explore Tutor and Admin dashboards!`;
      
      if (message.toLowerCase().includes("derivative") || message.toLowerCase().includes("x^2")) {
        responseText = `To find the derivative of \\( x^2 \\), you apply the **Power Rule** in calculus:\n\n\\[ \\frac{d}{dx}[x^n] = n \\cdot x^{n-1} \\]\n\nSetting \\( n = 2 \\):\n\n\\[ \\frac{d}{dx}[x^2] = 2x^{2-1} = 2x \\]\n\n**Example Application:** At \\( x = 3 \\), the slope of the tangent line to \\( y = x^2 \\) is \\( 2(3) = 6 \\).`;
      } else if (message.toLowerCase().includes("ielts") || message.toLowerCase().includes("english")) {
        responseText = `For IELTS Academic Writing Task 1, focus on:\n1. **Introduction:** Paraphrase the prompt (1-2 sentences).\n2. **Overview:** Highlight 2-3 main trends or key features without mentioning specific numbers yet (crucial for Band 7+).\n3. **Detail Paragraphs:** Present detailed data comparisons with accurate statistics.\n\n*Pro-tip:* Use varied cohesive devices and academic vocabulary like "fluctuated wildly," "peaked at," or "remained relatively stable."`;
      } else if (message.toLowerCase().includes("limit") || message.toLowerCase().includes("infinity")) {
        responseText = `As \\( x \\) approaches infinity, the term \\( \\frac{1}{x} \\) becomes smaller and smaller (e.g., \\( \\frac{1}{1000} = 0.001 \\)). Therefore:\n\n\\[ \\lim_{{x \\to \\infty}} \\frac{1}{x} = 0 \\]\n\nThis represents a horizontal asymptote along the x-axis \\( y = 0 \\).`;
      }

      res.json({
        text: responseText,
        isSimulated: true,
      });
    }, 1000);
    return;
  }

  try {
    const contents = [];
    
    // Convert history format to content part structure
    if (history && Array.isArray(history)) {
      for (const turn of history) {
        contents.push({
          role: turn.sender === "user" ? "user" : "model",
          parts: [{ text: turn.message }],
        });
      }
    }
    
    contents.push({
      role: "user",
      parts: [{ text: message }],
    });

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction: "You are an encouraging, expert academic AI Study Companion on the TutorVerse AI platform. Help the student with their homework, questions, or revision using clean, professional markdown with beautiful math notation or bullet points. Keep it clear, friendly, and structured.",
      },
    });

    res.json({
      text: response.text || "I was unable to formulate an answer. Let's try rephrasing your question!",
      isSimulated: false,
    });
  } catch (err: any) {
    console.error("Gemini API Chat Error:", err);
    res.status(500).json({ error: err.message || "Gemini API error" });
  }
});

// 2. API: AI Pre-test Generation
app.post("/api/gemini/quiz", async (req, res) => {
  const { subject } = req.body;
  const client = getGeminiClient();

  if (!client) {
    // Return high-quality, relevant static quizzes as a fallback
    setTimeout(() => {
      let simulatedQuiz = [
        {
          id: "q_sim_1",
          question: `What is the derivative of f(x) = 3x^2 + 5x - 7?`,
          options: ["6x + 5", "3x + 5", "6x^2 + 5", "6x"],
          correctAnswerIndex: 0,
          explanation: "Apply the Power Rule: d/dx(3x^2) = 6x, and d/dx(5x) = 5. The derivative of a constant (-7) is 0. So, we get 6x + 5.",
        },
        {
          id: "q_sim_2",
          question: `Evaluate the limit as x approaches 0 of sin(x)/x.`,
          options: ["0", "1", "Infinity", "Undefined"],
          correctAnswerIndex: 1,
          explanation: "Using L'Hopital's Rule or standard trigonometric limits, the limit of sin(x)/x as x approaches 0 is exactly 1.",
        },
        {
          id: "q_sim_3",
          question: `What is the area under the curve y = 2x from x = 0 to x = 3?`,
          options: ["6", "9", "12", "3"],
          correctAnswerIndex: 1,
          explanation: "The integral of 2x dx is x^2. Evaluating from 0 to 3 gives 3^2 - 0^2 = 9. (This is also a triangle with base 3 and height 6, area = 1/2 * 3 * 6 = 9).",
        },
      ];

      if (subject && subject.toLowerCase().includes("english")) {
        simulatedQuiz = [
          {
            id: "q_eng_1",
            question: "Which of the following transitions is best suited for showing a contrast in an IELTS essay?",
            options: ["Furthermore", "Consequently", "On the other hand", "In addition"],
            correctAnswerIndex: 2,
            explanation: "'On the other hand' introduces a contrasting perspective or argument, which is essential for cohesive text structures.",
          },
          {
            id: "q_eng_2",
            question: "Choose the correct sentence structure for a hypothetical condition in the past (Third Conditional).",
            options: [
              "If I would have studied, I will pass the exam.",
              "If I had studied, I would have passed the exam.",
              "If I studied, I would pass the exam.",
              "If I study, I would have passed the exam.",
            ],
            correctAnswerIndex: 1,
            explanation: "The Third Conditional structure is: If + past perfect, would + have + past participle.",
          },
        ];
      } else if (subject && subject.toLowerCase().includes("physics")) {
        simulatedQuiz = [
          {
            id: "q_phy_1",
            question: "What is the acceleration of an object in free fall near the Earth's surface (ignoring air resistance)?",
            options: ["4.9 m/s^2", "9.8 m/s^2", "15 m/s^2", "1.6 m/s^2"],
            correctAnswerIndex: 1,
            explanation: "The acceleration due to gravity on Earth is approximately 9.8 m/s^2 directed downwards.",
          },
          {
            id: "q_phy_2",
            question: "According to Newton's Second Law of Motion, what is the relationship between Force (F), Mass (m), and Acceleration (a)?",
            options: ["F = m + a", "F = m / a", "F = m * a", "F = a / m"],
            correctAnswerIndex: 2,
            explanation: "Newton's Second Law states that Force is the product of mass and acceleration (F = ma).",
          },
        ];
      }

      res.json({
        quiz: simulatedQuiz,
        isSimulated: true,
      });
    }, 1200);
    return;
  }

  try {
    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Generate a diagnostic multiple-choice pre-test quiz with exactly 3 to 4 challenging questions on the subject of "${subject}".
Make the questions academic, engaging, and suitable for checking core competence.`,
      config: {
        systemInstruction: "You are an elite syllabus designer. You must return multiple-choice questions in strict JSON format matching the requested schema.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING, description: "Unique ID like q_1, q_2" },
              question: { type: Type.STRING, description: "The full question text, can use Markdown math notation like $x^2$" },
              options: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Exactly 4 options"
              },
              correctAnswerIndex: { type: Type.INTEGER, description: "0-indexed integer of the correct option" },
              explanation: { type: Type.STRING, description: "Brief explanation of why this answer is correct" }
            },
            required: ["id", "question", "options", "correctAnswerIndex", "explanation"]
          }
        }
      }
    });

    const text = response.text || "[]";
    const quiz = JSON.parse(text);
    res.json({ quiz, isSimulated: false });
  } catch (err: any) {
    console.error("Gemini Pre-test Generation Error:", err);
    res.status(500).json({ error: err.message || "Gemini Pre-test error" });
  }
});

// 3. API: AI Evaluation of Pre-test Answers
app.post("/api/gemini/evaluate-quiz", async (req, res) => {
  const { subject, quiz, selectedAnswers } = req.body;
  const client = getGeminiClient();

  if (!client) {
    // Fallback simulation
    setTimeout(() => {
      // Calculate basic correct count
      let correct = 0;
      quiz.forEach((q: any, i: number) => {
        if (selectedAnswers[i] === q.correctAnswerIndex) {
          correct++;
        }
      });
      const ratio = correct / quiz.length;
      
      const skillScore = Math.round(ratio * 50) + 40; // between 40 and 90

      res.json({
        evaluation: {
          overallScore: Math.round(ratio * 100),
          feedback: `You answered ${correct} out of ${quiz.length} questions correctly. ${
            ratio >= 0.7 
              ? "Excellent work! You possess a very solid foundation in this subject. Let's focus on advanced topics and fine-tuning your problem-solving."
              : "Good effort! There are some clear conceptual gaps. We recommend reviewing foundational lectures with a tutor to secure basic formulaic applications."
          }`,
          strengths: [
            "Analytical Thinking",
            ratio >= 0.5 ? "Good Core Formula Application" : "Eagerness to Learn",
            "Familiarity with Terms"
          ],
          weaknesses: [
            ratio >= 0.7 ? "Edge-case Scenarios" : "Foundational Axiom Memorization",
            "Time Constraint Management"
          ],
          skills: {
            conceptUnderstanding: skillScore,
            problemSolving: Math.max(35, Math.round(skillScore * 0.95)),
            quickThinking: Math.min(95, Math.round(skillScore * 1.1)),
            application: Math.max(40, Math.round(skillScore * 0.85)),
            memory: Math.round(skillScore * 1.05)
          }
        },
        isSimulated: true,
      });
    }, 1500);
    return;
  }

  try {
    const prompt = `Review the following student's diagnostic pre-test results on "${subject}":
Questions and Correct Answers:
${JSON.stringify(quiz, null, 2)}

Student selected answers indices:
${JSON.stringify(selectedAnswers, null, 2)}

Generate a custom academic skill assessment of the student. Assign score percentages from 0 to 100 for each of the five metrics: conceptUnderstanding, problemSolving, quickThinking, application, and memory. Provide highly custom feedback, specific strengths, and specific weaknesses based on their answers.`;

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an advanced academic evaluator. You must analyze the quiz results carefully and return a structured JSON report matching the requested schema.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallScore: { type: Type.INTEGER, description: "Score out of 100 calculated from correct answers" },
            feedback: { type: Type.STRING, description: "Personalized advice, warm but objective academic appraisal" },
            strengths: { type: Type.ARRAY, items: { type: Type.STRING }, description: "2-3 precise academic strengths discovered" },
            weaknesses: { type: Type.ARRAY, items: { type: Type.STRING }, description: "2-3 precise areas that need work" },
            skills: {
              type: Type.OBJECT,
              properties: {
                conceptUnderstanding: { type: Type.INTEGER },
                problemSolving: { type: Type.INTEGER },
                quickThinking: { type: Type.INTEGER },
                application: { type: Type.INTEGER },
                memory: { type: Type.INTEGER }
              },
              required: ["conceptUnderstanding", "problemSolving", "quickThinking", "application", "memory"]
            }
          },
          required: ["overallScore", "feedback", "strengths", "weaknesses", "skills"]
        }
      }
    });

    const text = response.text || "{}";
    res.json({ evaluation: JSON.parse(text), isSimulated: false });
  } catch (err: any) {
    console.error("Gemini Pre-test Evaluation Error:", err);
    res.status(500).json({ error: err.message || "Evaluation error" });
  }
});

// 4. API: AI Study Material Summarizer
app.post("/api/gemini/summarize", async (req, res) => {
  const { title, content } = req.body;
  const client = getGeminiClient();

  if (!client) {
    // Fallback simulation
    setTimeout(() => {
      res.json({
        summary: {
          title: title || "Lecture Note Summary",
          overview: `This study material covers foundational and advanced aspects of ${title || "the uploaded material"}. It outlines key methodologies and practical exercises for students to reinforce core concepts.`,
          keyTakeaways: [
            "Axiomatic foundations require constant problem-solving repetition.",
            "Visualizing graphs or drawing contextual mapping helps structural retention.",
            "Mistakes are important parameters for learning; document incorrect answers immediately."
          ],
          detailedBulletPoints: [
            "Structured Analysis: Always decompose complex tasks into smaller, manageable operations.",
            "Application Cycles: Take notes, summarize in 3 key points, then immediately attempt a quiz question.",
            "Active Retrieval: Review this AI summary 24 hours later to maximize memory indexing.",
            "Tutor Alignment: Highlight parts you found difficult and bring them directly to your booked live class."
          ],
          difficultyLevel: "Intermediate",
          estimatedStudyTimeMinutes: 25
        },
        isSimulated: true,
      });
    }, 1500);
    return;
  }

  try {
    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Please read and summarize this lecture document titled "${title}":
---
Content:
${content}
---
Extract an overview, difficulty level, estimated study time, key takeaways (3 items), and detailed bullet points (3-5 items).`,
      config: {
        systemInstruction: "You are an expert tutor notes summarizer. Condense lecture files into clear, easy-to-read, high-impact review sheets in structured JSON.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            overview: { type: Type.STRING },
            keyTakeaways: { type: Type.ARRAY, items: { type: Type.STRING } },
            detailedBulletPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
            difficultyLevel: { type: Type.STRING },
            estimatedStudyTimeMinutes: { type: Type.INTEGER }
          },
          required: ["title", "overview", "keyTakeaways", "detailedBulletPoints", "difficultyLevel", "estimatedStudyTimeMinutes"]
        }
      }
    });

    const text = response.text || "{}";
    res.json({ summary: JSON.parse(text), isSimulated: false });
  } catch (err: any) {
    console.error("Gemini Summarizer Error:", err);
    res.status(500).json({ error: err.message || "Summarizer error" });
  }
});

// Serve static build in production, otherwise Vite dev middleware in development
async function startServer() {
  const isProd = process.env.NODE_ENV === "production";

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[TutorVerse AI] Express server running on http://localhost:${PORT}`);
  });
}

startServer();
