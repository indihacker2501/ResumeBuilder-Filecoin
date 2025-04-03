
import { useState,useEffect} from "react";
// import WalletConnect from "./components/WalletConnect";
import WalletConnect from "../components/WalletConnect";
import axios from "axios";

function ResumeOld() {
  const [walletAddress, setWalletAddress] = useState("");
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [resume, setResume] = useState("");
  const [fileName, setFileName] = useState("");
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
    


      useEffect(() => {
        console.log("Wallet Address:", walletAddress);
        console.log("Provider:", provider);
        console.log("Contract:", contract);
      }, [walletAddress, provider, contract]);
 

  const generateResume = async () => {
    if (!walletAddress || !contract) {
      alert("Please connect your wallet first!");
      return;
    }
    
    try {
      // 1. Generate resume via backend
      const response = await axios.post("http://localhost:3000/generate-resume", formData);
      const cid = response.data.fileUrl.data.Name; // Assuming this is the CID from your backend
      
      setFileName(cid);
      setResume(response.data.resume);

      // 2. Upload to smart contract
      const tx = await contract.uploadResume(cid);
      await tx.wait();
      
      console.log("Resume uploaded to blockchain with CID:", cid);
    } catch (error) {
      console.error("Error generating/uploading resume:", error);
    }
  };

  const downloadResume = async () => {
    if (!walletAddress || !contract) {
      alert("Please connect your wallet first!");
      return;
    }

    try {
      // 1. Mark as downloaded in smart contract
      const tx = await contract.downloadResume();
      await tx.wait();

      // 2. Download the file
      const response = await axios.get(
        `http://localhost:8000/buckets/Resumes/files/${fileName}/download`,
        { responseType: 'blob' }
      );

      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName || 'resume.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      console.log(`File downloaded: ${fileName}`);
    } catch (error) {
      console.error("Download error:", error);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "auto", padding: "20px" }}>
      <WalletConnect 
        setWalletAddress={setWalletAddress}
        setProvider={setProvider}
        setContract={setContract}
      />
      {/* Add debug info */}
      {walletAddress && (
        <p style={{ color: "green" }}>
          Wallet Connected: {walletAddress}
        </p>
      )}
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
      <button onClick={generateResume} style={{ marginTop: "10px" }}>
        Generate & Upload Resume
      </button>
      <div>
        <button onClick={downloadResume} style={{ marginTop: "10px" }}>
          🔗 Download Resume
        </button>
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

export default ResumeOld;