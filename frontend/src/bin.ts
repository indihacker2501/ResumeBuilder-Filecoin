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
      // const uploadedFile = await uploadFileToAkave("Resume", filePath);

      // Remove local PDF file after upload
      fs.unlinkSync(filePath);

      // Return both resume content & uploaded file URL
      res.json({
        resume: generatedResume,
        // fileUrl: uploadedFile ? uploadedFile.url : null,
      });
    });
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







app.
// frontend/App.jsx
import { useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";

function App() {
  const [resume, setResume] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");
  const [fileName,setFileName]=useState("")
  const [formData, setFormData] = useState({
    name: "Rakesh",
    phone: "23424324",
    email: "rakesh89@gmail.com",
    linkedin: "213434",
    github: "rakesh99",
    portfolio: "portfolio link",
    education: "Btech",
    university: "XYZ University",
    graduationYear: "2020",
    educationDuration: "4",
    experience: "MERN Stack Developer",
    companyName: "Tata",
    role: "MERN Stack Developer",
    experienceDuration: "4",
    skills: "Java, PHP, AWS, React, Node.js",
    certifications: "Accenture",
    certificationDate: "12 March",
    achievements: "Awarded Best Developer of the Year",
    awards: "Employee Excellence Award",
    // references: "Available upon request",
    languages: "English, Hindi, Spanish",
    jobDescription: "About the job EducationDegree, Post graduate in Computer Science or related field (or equivalent industry experience)ExperienceMinimum 5 years of coding experience in ReactJS (TypeScript), HTML, CSS-Pre-processors, or CSS-in-JS in creating Enterprise Applications with high performance for Responsive Web Applications.Minimum 5 years of coding experience in NodeJS, JavaScript & TypeScript and NoSQL Databases.Developing and implementing highly responsive user interface components using React concepts. (self-contained, reusable, and testable modules and components)Architecting and automating the build process for production, using task runners or scriptsKnowledge of Data Structures for TypeScript.Monitoring and improving front-end performance.Banking or Retail domains knowledge is good to have.Hands on experience in performance tuning, debugging, monitoring.Technical SkillsExcellent knowledge developing scalable and highly available Restful APIs using NodeJS technologiesWell versed with CI/CD principles, and actively involved in solving, troubleshooting issues in distributed services ecosystem Understanding of containerization, experienced in Dockers, Kubernetes. Exposed to API gateway integrations like 3Scale.Understanding of Single-Sign-on or token-based authentication (Rest, JWT, OAuth)Possess expert knowledge of task/message queues include but not limited to: AWS, Microsoft Azure, Pushpin and Kafka.Practical experience with GraphQL is good to have.Writing tested, idiomatic, and documented JavaScript, HTML and CSSExperiencing in Developing responsive web-based UIHave experience on Styled Components, Tailwind CSS, Material UI and other CSS-in-JS techniquesThorough understanding of the responsibilities of the platform, database, API, caching layer, proxies, and other web services used in the system Able to influence multiple teams on technical considerations, increasing their productivity and effectiveness, by sharing deep knowledge and experience.Self motivator and self-starter, Ability to own and drive things without supervision and works collaboratively with the teams across the organization.Have excellent soft skills and interpersonal skills to interact and present the ideas to Senior and Executive management.",
    projects: [
      { name: "Project 1", techStack: "React, Node.js", liveLink: "http://project1.com", description: "Built a full-stack app." },
      { name: "Project 2", techStack: "Python, Django", liveLink: "http://project2.com", description: "Developed an AI chatbot." }
    ],
  });

  const generateResume = async () => {
    try {
      const response = await axios.post("http://localhost:3000/generate-resume", formData);
      console.log("Response fileurl: ", response.data);
  
      // Assuming response contains a generated file URL or file path
      // const resumeFilePath = response.data.filePath; // Adjust as needed
      setResume(response.data.resume);
      // setResumeUrl(response.data.fileUrl);
      
  
      // Upload the generated resume to Akave
      // if (resumeFilePath) {
        const uploadResponse = await uploadFileToAkave("Resume", "./uploads");
        console.log("Upload response:", uploadResponse);
      // }
    } catch (error) {
      console.error("Error generating resume:", error);
    }
  };
  
  // Upload function (moved outside generateResume)
  const uploadFileToAkave = async (bucketName, filePath) => {
    try {
      const form = new FormData();
      form.append("file", filePath); // Directly append the file, assuming it's a Blob or File
  
      const response = await axios.post(
        `http://localhost:8000/buckets/${bucketName}/files`,
        form,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setFileName(response.data.Name);
  
      console.log("Response from Akave upload:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error uploading file to Akave:", error);
    }
  };
  

  async function downloadFile(bucketName, fileName, outputDir) {
    try {
      const response = await axios.get(`http://localhost:8000/buckets/${bucketName}/files/${fileName}/download`, {
        responseType: 'blob',
      });
      console.log(`File downloaded: ${fileName}`);
      fs.writeFileSync(`./${outputDir}/${fileName}`, response.data);
    } catch (error) {
      console.error(error.response ? error.response.data : error.message);
    }
  }

  return (
    <div style={{ maxWidth: "600px", margin: "auto", padding: "20px" }}>
      <h2>AI Resume Generator</h2>
      {Object.keys(formData).map((key) => (
        <input
          key={key}
          type="text"
          placeholder={key.replace(/([A-Z])/g, " $1").toUpperCase()}
          name={key}
          value={formData[key]}
          onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
          style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
        />
      ))}
      <button onClick={generateResume} style={{ marginTop: "10px" }}>Generate Resume</button>

        <div>
          <p>🔗 <a href={resumeUrl} target="_blank" rel="noopener noreferrer">Download Resume from Akave</a></p>
          <button onClick={()=>downloadFile("Resume",fileName,"./downloadedFiles")} style={{ marginTop: "10px" }}>Download Resume</button>
        </div>

      {resume && (
        <div style={{
          background: "#f4f4f4",
          padding: "10px",
          color: "black",
          whiteSpace: "pre-wrap",
          wordWrap: "break-word",
          overflowWrap: "break-word",
          maxWidth: "100%",
        }}>
          {resume}
        </div>
      )}
    </div>
  );
}

export default App;