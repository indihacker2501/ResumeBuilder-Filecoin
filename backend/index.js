// backend/index.js
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { OpenAI } from "openai";
import dotenv from "dotenv";
import fs from 'fs'
import axios from 'axios';
import PDFDocument from "pdfkit";
import FormData from "form-data";

dotenv.config();

const app = express();
const port = 3000;

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
    //file

    //upload

    //file delete

    const generatedResume = response.choices[0].message.content;

    // Save resume to a PDF file
    const timestamp = Date.now();
    const filePath = `./uploads/resume_${timestamp}.pdf`;
    
    const doc = new PDFDocument();
    const writeStream = fs.createWriteStream(filePath);
    doc.pipe(writeStream);

    doc.fontSize(14).text(generatedResume, { align: 'left' });

    doc.end();

    writeStream.on("finish", async () => {
      // Upload file to Akave
      const uploadedFile = await uploadFileToAkave("Resumes", filePath);

      // Remove local PDF file after upload
      fs.unlinkSync(filePath);

      // Return both resume content & uploaded file URL
      res.json({
        resume: generatedResume,
        fileUrl: uploadedFile,
      });
    });
  } catch (error) {
    console.error("Error generating resume:", error);
    res.status(500).json({ error: "Failed to generate resume" });
  }
});

async function uploadFileToAkave(bucketName, filePath) {
  const form = new FormData();
  form.append("file", fs.createReadStream(filePath));

  try {
    const response = await axios.post(
      `http://localhost:8000/buckets/${bucketName}/files`,
      form,
      {
        headers:form.getHeaders()
      }
    );
    console.log("response from upload akave: ",response.data)
    return response.data; // Return file URL after upload
  } catch (error) {
    console.error("Error uploading file to Akave:", error.message);
  }
}

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
