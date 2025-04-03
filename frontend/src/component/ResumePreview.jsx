import React, { useRef } from 'react';
import { FileDown, Mail, Phone, Globe, Github, Linkedin } from 'lucide-react';
import html2pdf from 'html2pdf.js';

const ResumePreview = () => {
  const resumeRef = useRef(null);

  const dummyData = {
    name: "Rakesh Kumar",
    phone: "+91 98765 43210",
    email: "rakesh.kumar@email.com",
    linkedin: "linkedin.com/in/rakesh-kumar",
    github: "github.com/rakesh-dev",
    portfolio: "rakesh-portfolio.dev",
    education: "B.Tech in Computer Science",
    university: "XYZ Institute of Technology",
    graduationYear: "2020",
    educationDuration: "4 years",
    experience: "Senior Full Stack Developer",
    companyName: "Tech Solutions Inc.",
    role: "MERN Stack Lead",
    experienceDuration: "4 years",
    skills: "JavaScript, React, Node.js, MongoDB, TypeScript, AWS, Docker, GraphQL",
    certifications: "AWS Certified Developer",
    certificationDate: "March 2023",
    achievements: "Led a team of 5 developers to deliver a high-scale fintech platform",
    awards: "Best Innovation Award 2023",
    languages: "English, Hindi",
    projects: [
      {
        name: "E-Commerce Platform",
        techStack: "React, Node.js, MongoDB",
        liveLink: "https://ecommerce.example.com",
        description: "Built a scalable e-commerce platform handling 10k+ daily transactions"
      },
      {
        name: "AI Chat Application",
        techStack: "Python, TensorFlow, React",
        liveLink: "https://aichat.example.com",
        description: "Developed an AI-powered chat application with natural language processing"
      }
    ]
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


  const downloadPDF = () => {
    const element = resumeRef.current;
    const opt = {
      margin: 1,
      filename: 'resume.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-end mb-4">
          <button 
            onClick={downloadResume}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            <FileDown size={20} />
            Download PDF
          </button>
        </div>

       {/* //yha pr tha code  */}
      </div>
    </div>
  );
};

export default ResumePreview;


//  <div ref={resumeRef} className="bg-white shadow-lg rounded-lg overflow-hidden">
//           {/* Header Section */}
//           <div className="bg-indigo-600 text-white p-8">
//             <h1 className="text-3xl font-bold mb-2">{dummyData.name}</h1>
//             <h2 className="text-xl mb-4">{dummyData.role}</h2>
//             <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
//               <div className="flex items-center gap-2">
//                 <Mail size={16} />
//                 {dummyData.email}
//               </div>
//               <div className="flex items-center gap-2">
//                 <Phone size={16} />
//                 {dummyData.phone}
//               </div>
//               <div className="flex items-center gap-2">
//                 <Globe size={16} />
//                 {dummyData.portfolio}
//               </div>
//               <div className="flex items-center gap-2">
//                 <Github size={16} />
//                 {dummyData.github}
//               </div>
//               <div className="flex items-center gap-2">
//                 <Linkedin size={16} />
//                 {dummyData.linkedin}
//               </div>
//             </div>
//           </div>

//           <div className="p-8">
//             {/* Skills Section */}
//             <section className="mb-6">
//               <h3 className="text-xl font-bold text-indigo-600 mb-3">Skills</h3>
//               <div className="flex flex-wrap gap-2">
//                 {dummyData.skills.split(',').map((skill, index) => (
//                   <span 
//                     key={index}
//                     className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-sm"
//                   >
//                     {skill.trim()}
//                   </span>
//                 ))}
//               </div>
//             </section>

//             {/* Experience Section */}
//             <section className="mb-6">
//               <h3 className="text-xl font-bold text-indigo-600 mb-3">Experience</h3>
//               <div className="mb-4">
//                 <div className="flex justify-between items-start">
//                   <div>
//                     <h4 className="text-lg font-semibold">{dummyData.companyName}</h4>
//                     <p className="text-gray-600">{dummyData.role}</p>
//                   </div>
//                   <span className="text-gray-500">{dummyData.experienceDuration}</span>
//                 </div>
//               </div>
//             </section>

//             {/* Education Section */}
//             <section className="mb-6">
//               <h3 className="text-xl font-bold text-indigo-600 mb-3">Education</h3>
//               <div className="mb-4">
//                 <div className="flex justify-between items-start">
//                   <div>
//                     <h4 className="text-lg font-semibold">{dummyData.university}</h4>
//                     <p className="text-gray-600">{dummyData.education}</p>
//                   </div>
//                   <span className="text-gray-500">{dummyData.graduationYear}</span>
//                 </div>
//               </div>
//             </section>

//             {/* Projects Section */}
//             <section className="mb-6">
//               <h3 className="text-xl font-bold text-indigo-600 mb-3">Projects</h3>
//               {dummyData.projects.map((project, index) => (
//                 <div key={index} className="mb-4">
//                   <h4 className="text-lg font-semibold">{project.name}</h4>
//                   <p className="text-gray-600 mb-2">{project.description}</p>
//                   <div className="flex gap-2">
//                     <span className="text-sm text-indigo-600">Tech Stack:</span>
//                     <span className="text-sm text-gray-600">{project.techStack}</span>
//                   </div>
//                   <a 
//                     href={project.liveLink}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="text-sm text-indigo-600 hover:underline"
//                   >
//                     View Project →
//                   </a>
//                 </div>
//               ))}
//             </section>

//             {/* Certifications & Awards Section */}
//             <section className="mb-6">
//               <h3 className="text-xl font-bold text-indigo-600 mb-3">Certifications & Awards</h3>
//               <div className="mb-2">
//                 <p className="font-semibold">{dummyData.certifications}</p>
//                 <p className="text-gray-600">{dummyData.certificationDate}</p>
//               </div>
//               <div>
//                 <p className="font-semibold">Awards</p>
//                 <p className="text-gray-600">{dummyData.awards}</p>
//               </div>
//             </section>

//             {/* Languages Section */}
//             <section>
//               <h3 className="text-xl font-bold text-indigo-600 mb-3">Languages</h3>
//               <p className="text-gray-600">{dummyData.languages}</p>
//             </section>
//           </div>
//         </div>