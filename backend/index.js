// backend/index.js
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { OpenAI } from "openai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = 8000;

app.use(cors());
app.use(bodyParser.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/generate-resume", async (req, res) => {
  try {
    const { 
      name, phone, email, linkedin, github, portfolio,
      education, educationDuration, university, graduationYear,
      experience, experienceDuration, companyName, role,
      jobDescription, skills, certifications, certificationDate,
      achievements, awards, languages,
      projects 
    } = req.body;

    const formattedProjects = Array.isArray(projects) && projects.every(p => typeof p === 'object') ? projects : [];

    const projectSummaries = await Promise.all(
      formattedProjects.map(async (project) => {
        if (project.description) {
          const summary = await generateProjectSummary(project.description);
          return `- ${project.name} (${project.techStack}) | [Live](${project.liveLink})\n  Summary: ${summary}`;
        } else {
          return `- ${project.name} (${project.techStack}) | [Live](${project.liveLink})\n  Summary: No description provided.`;
        }
      })
    );

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert resume writer.",
        },
        {
          role: "user",
          content: `
          Write a tailored resume for a ${role} role at ${companyName} according to the ${jobDescription}. (Reminder: Don't add any skills keep the skills as entered by user you just format it)

          **Personal Details:**
          - Name: ${name}
          - Phone: ${phone}
          - Email: ${email}
          - LinkedIn: ${linkedin}
          - GitHub: ${github}
          - Portfolio: ${portfolio}

          **Education:**
          - ${education}, ${university} (${educationDuration} years, Graduated: ${graduationYear})

          **Experience:**
          - ${experience} (${experienceDuration} years) at ${companyName}

          **Skills:**
          - ${skills}

          **Certifications:**
          - ${certifications} (${certificationDate})

          **Projects:**
          ${projectSummaries.length > 0 ? projectSummaries.join("\n") : "No projects listed."}

          **Achievements & Awards:**
          - ${achievements || "Not provided"}
          - ${awards || "Not provided"}

          **Languages:**
          - ${languages || "Not provided"}
          `,
        },
      ],
    });

    res.json({ resume: response.choices[0].message.content });
  } catch (error) {
    console.error("Error generating resume:", error);
    res.status(500).json({ error: "Failed to generate resume" });
  }
});

async function generateProjectSummary(description) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "Summarize the following project description in under 30 words:",
        },
        {
          role: "user",
          content: description,
        },
      ],
    });
    return response.choices[0].message.content;
  } catch (error) {
    console.error("Error generating project summary:", error);
    return "Summary unavailable";
  }
}

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
