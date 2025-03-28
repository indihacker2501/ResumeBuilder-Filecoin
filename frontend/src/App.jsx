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
      console.log("Response fileurl: ", response);
      setFileName(response.data.fileUrl.data.Name)
      setResume(response.data.resume);
      // setResumeUrl(response.data.fileUrl);
    } catch (error) {
      console.error("Error generating resume:", error);
    }
  };

  // async function downloadFile(bucketName, fileName, outputDir) {
  //   try {
  //     const response = await axios.get(`http://localhost:8000/buckets/${bucketName}/files/${fileName}/download`, {
  //       responseType: 'blob',
  //     });
  //     console.log(`File downloaded: ${fileName}`);
  //     // fs.writeFileSync(`./${outputDir}/${fileName}`, response.data);
  //   } catch (error) {
  //     console.error(error.response ? error.response.data : error.message);
  //   }
  // }

  async function downloadFile(bucketName, fileName) {
    try {
      const response = await axios.get(
        `http://localhost:8000/buckets/${bucketName}/files/${fileName}/download`,
        {
          responseType: 'blob', // Important for handling binary data
        }
      );

      // Create a blob URL from the response data
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);

      // Create a temporary link element for downloading
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName || 'resume.pdf'; // Fallback filename if fileName is empty
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      console.log(`File downloaded: ${fileName}`);
    } catch (error) {
      console.error("Download error:", error.response ? error.response.data : error.message);
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