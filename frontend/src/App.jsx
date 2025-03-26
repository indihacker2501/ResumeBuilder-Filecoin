// import { useState } from "react";
// import axios from "axios";
// import jsPDF from "jspdf";

// function App() {
//   const [name, setName] = useState("");
//   const [phone, setPhone] = useState("");
//   const [email, setEmail] = useState("");
//   const [education, setEducation] = useState("");
//   const [experience, setExperience] = useState("");
//   const [github, setGithub] = useState("");
//   const [linkedin, setLinkedin] = useState("");
//   const [skills, setSkills] = useState("");
//   const [jobDescription, setJobDescription] = useState("");
//   const [resume, setResume] = useState("");

//   const generateResume = async () => {
//     try {
//       const response = await axios.post("http://localhost:8000/generate-resume", {
//         name,
//         phone,
//         email,
//         education,
//         experience,
//         github,
//         linkedin,
//         skills,
//         jobDescription,
//       });
//       setResume(response.data.resume);
//     } catch (error) {
//       console.error("Error generating resume:", error);
//     }
//   };

//   const downloadResume = () => {
//     const pdf = new jsPDF({
//       orientation: "p",
//       unit: "mm",
//       format: "a4",
//     });

//     const pageWidth = pdf.internal.pageSize.getWidth();
//     const pageHeight = pdf.internal.pageSize.getHeight();
//     const margin = 15;
//     let y = 20;

//     pdf.setFont("helvetica", "bold");
//     pdf.setFontSize(18);
//     pdf.text("Resume", pageWidth / 2, y, { align: "center" });
//     y += 10;

//     pdf.setFont("helvetica", "normal");
//     pdf.setFontSize(12);
//     pdf.text(`Name: ${name}`, margin, y);
//     y += 7;
//     pdf.text(`Phone: ${phone}`, margin, y);
//     y += 7;
//     pdf.text(`Email: ${email}`, margin, y);
//     y += 7;
//     pdf.text(`LinkedIn: ${linkedin}`, margin, y);
//     y += 7;
//     pdf.text(`GitHub: ${github}`, margin, y);
//     y += 7;
//     pdf.text(`Education: ${education}`, margin, y);
//     y += 7;
//     pdf.text(`Experience: ${experience}`, margin, y);
//     y += 7;
//     pdf.text(`Skills: ${skills}`, margin, y);
//     y += 10;

//     pdf.setFont("helvetica", "bold");
//     pdf.text("Generated Resume:", margin, y);
//     pdf.setFont("helvetica", "normal");
//     y += 7;

//     const maxWidth = pageWidth - 2 * margin;
//     const lines = pdf.splitTextToSize(resume, maxWidth);
//     const lineHeight = 7;

//     lines.forEach((line) => {
//       if (y + lineHeight > pageHeight - 10) {
//         pdf.addPage();
//         y = 20;
//       }
//       pdf.text(line, margin, y);
//       y += lineHeight;
//     });

//     pdf.save(`${name}_resume.pdf`);
//   };

//   return (
//     <div style={{ maxWidth: "600px", margin: "auto", padding: "20px" }}>
//       <h2>AI Resume Generator</h2>
//       <input type="text" placeholder="Enter Your Name" value={name} onChange={(e) => setName(e.target.value)} />
//       <input type="text" placeholder="Enter Your Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
//       <input type="email" placeholder="Enter Your Email" value={email} onChange={(e) => setEmail(e.target.value)} />
//       <input type="text" placeholder="LinkedIn Profile" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} />
//       <input type="text" placeholder="GitHub Profile" value={github} onChange={(e) => setGithub(e.target.value)} />
//       <textarea placeholder="Education" value={education} onChange={(e) => setEducation(e.target.value)} />
//       <textarea placeholder="Experience" value={experience} onChange={(e) => setExperience(e.target.value)} />
//       <input type="text" placeholder="Skills" value={skills} onChange={(e) => setSkills(e.target.value)} />
//       <textarea placeholder="Paste Job Description Here" value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} />
//       <button onClick={generateResume}>Generate Resume</button>
//       {resume && (
//         <div>
//           <div id="resume-output">
//             <pre>{resume}</pre>
//           </div>
//           <button onClick={downloadResume}>Download as PDF</button>
//         </div>
//       )}
//     </div>
//   );
// }

// export default App;


import { useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";

function App() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    education: "",
    educationDuration: "",
    experience: "",
    experienceDuration: "",
    github: "",
    linkedin: "",
    skills: "",
    jobDescription: "",
    role: "",
    company: "",
    certifications: "",
    certificationDate: "",
    portfolio: "",
    projects: "",
  });
  
  const [resume, setResume] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const generateResume = async () => {
    try {
      const response = await axios.post("http://localhost:8000/generate-resume", formData);
      setResume(response.data.resume);
    } catch (error) {
      console.error("Error generating resume:", error);
    }
  };

  const downloadResume = () => {
    const pdf = new jsPDF();
    pdf.setFont("helvetica");
    pdf.setFontSize(18);
    pdf.text("Resume", 105, 20, { align: "center" });
    pdf.setFontSize(12);
    
    let y = 30;
    for (const [key, value] of Object.entries(formData)) {
      if (value) {
        pdf.text(`${key.replace(/([A-Z])/g, " $1").toUpperCase()}: ${value}`, 10, y);
        y += 7;
      }
    }

    pdf.text("Generated Resume:", 10, y);
    y += 7;
    const lines = pdf.splitTextToSize(resume, 180);
    pdf.text(lines, 10, y);
    pdf.save(`${formData.name}_resume.pdf`);
  };

  return (
    <div style={{ maxWidth: "600px", margin: "auto", padding: "20px" }}>
      <h2>AI Resume Generator</h2>
      {Object.keys(formData).map((key) => (
        <input
          key={key}
          type={key.includes("email") ? "email" : "text"}
          placeholder={key.replace(/([A-Z])/g, " $1").toUpperCase()}
          name={key}
          value={formData[key]}
          onChange={handleChange}
        />
      ))}
      <button onClick={generateResume}>Generate Resume</button>
      {resume && (
        <div>
          <pre>{resume}</pre>
          <button onClick={downloadResume}>Download as PDF</button>
        </div>
      )}
    </div>
  );
}

export default App;
