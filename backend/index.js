import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { OpenAI } from "openai";
import dotenv from "dotenv"

dotenv.config();

const app = express();
const port = 8000;

app.use(cors());
app.use(bodyParser.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Add your OpenAI API key in the .env file
});

app.post("/generate-resume", async (req, res) => {
  const { name, phone, email, education, educationDuration, experience, experienceDuration, github, linkedin, skills, jobDescription, role, company, certifications, certificationDate, portfolio, projects } = req.body;

  try {
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
          Write a tailored resume for a ${role} role at ${company}. 
          Include a professional summary that highlights key skills and achievements relevant to the ${jobDescription}.
          
          Personal Details:
          - Name: ${name}
          - Phone: ${phone}
          - Email: ${email}
          - LinkedIn: ${linkedin}
          - GitHub: ${github}
          - Portfolio: ${portfolio}

          Education:
          ${education} (${educationDuration})

          Experience:
          ${experience} ${experienceDuration ? `(${experienceDuration})` : ""}

          Skills:
          ${skills}

          ${certifications ? `Certifications:
          ${certifications} (${certificationDate})` : ""}

          Projects:
          ${projects ? projects.map(project => `- ${project.name}: ${project.techStack} | [Live](${project.liveLink})
  Summary:
  - ${generateProjectSummary(project.description)}`).join('\n') : ""}

          Tailor the experience section with 3-5 bullet points per role, showcasing impact using metrics where possible. 
          If applicable, incorporate internships, projects, or coursework for freshers. 
          Ensure the most relevant keywords from the job description are integrated throughout. 
          Do not include an objective statement or references.
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
          content: "Summarize the following project description in under 30 words in bullet points:",
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
  console.log(`Server running on http://localhost:${port}`);
});
