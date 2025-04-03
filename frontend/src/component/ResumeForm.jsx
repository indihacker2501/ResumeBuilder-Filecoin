// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { ChevronLeft, ChevronRight, FileCheck } from 'lucide-react';

// const ResumeForm = () => {
//   const navigate = useNavigate();
//   const [currentStep, setCurrentStep] = useState(1);
//   const [formData, setFormData] = useState({
//     name: '',
//     phone: '',
//     email: '',
//     linkedin: '',
//     github: '',
//     portfolio: '',
//     education: '',
//     university: '',
//     graduationYear: '',
//     educationDuration: '',
//     experience: '',
//     companyName: '',
//     role: '',
//     experienceDuration: '',
//     skills: '',
//     certifications: '',
//     certificationDate: '',
//     achievements: '',
//     awards: '',
//     languages: '',
//     jobDescription: '',
//     projects: [{ name: '', techStack: '', liveLink: '', description: '' }]
//   });

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleProjectChange = (index, field, value) => {
//     const updatedProjects = [...formData.projects];
//     updatedProjects[index] = { ...updatedProjects[index], [field]: value };
//     setFormData((prev) => ({ ...prev, projects: updatedProjects }));
//   };

//   const addProject = () => {
//     setFormData((prev) => ({
//       ...prev,
//       projects: [...prev.projects, { name: '', techStack: '', liveLink: '', description: '' }]
//     }));
//   };

//   const handleSubmit = () => {
//     console.log('Form submitted:', formData);
//     navigate('/preview');
//   };

//   return (
//     <div className="container mx-auto px-4 py-8 max-w-2xl">
//       <div className="mb-8">
//         <div className="flex justify-between items-center mb-4">
//           {[1, 2, 3, 4].map((step) => (
//             <div
//               key={step}
//               className={`w-1/4 h-2 rounded ${step <= currentStep ? 'bg-indigo-600' : 'bg-gray-200'}`}
//             />
//           ))}
//         </div>
//         <div className="text-center text-gray-600">Step {currentStep} of 4</div>
//       </div>

//       <form className="bg-white p-6 rounded-lg shadow-lg">
//         {/* Render dynamic form steps here */}
//         <div className="flex justify-between mt-8">
//           {currentStep > 1 && (
//             <button
//               type="button"
//               onClick={() => setCurrentStep(currentStep - 1)}
//               className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded hover:bg-gray-200"
//             >
//               <ChevronLeft size={20} />
//               Previous
//             </button>
//           )}
//           {currentStep < 4 ? (
//             <button
//               type="button"
//               onClick={() => setCurrentStep(currentStep + 1)}
//               className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 ml-auto"
//             >
//               Next
//               <ChevronRight size={20} />
//             </button>
//           ) : (
//             <button
//               type="button"
//               onClick={handleSubmit}
//               className="flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 ml-auto"
//             >
//               Generate Resume
//               <FileCheck size={20} />
//             </button>
//           )}
//         </div>
//       </form>
//     </div>
//   );
// };

// export default ResumeForm;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, FileCheck } from 'lucide-react';

const ResumeForm = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
    const [resume, setResume] = useState("");
  const [fileName, setFileName] = useState("");
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    linkedin: '',
    github: '',
    portfolio: '',
    education: '',
    university: '',
    graduationYear: '',
    educationDuration: '',
    experience: '',
    companyName: '',
    role: '',
    experienceDuration: '',
    skills: '',
    certifications: '',
    certificationDate: '',
    achievements: '',
    awards: '',
    languages: '',
    jobDescription: '',
    projects: [
      { name: '', techStack: '', liveLink: '', description: '' }
    ]
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleProjectChange = (index, field, value) => {
    const updatedProjects = [...formData.projects];
    updatedProjects[index] = { ...updatedProjects[index], [field]: value };
    setFormData(prev => ({ ...prev, projects: updatedProjects }));
  };

  const addProject = () => {
    setFormData(prev => ({
      ...prev,
      projects: [...prev.projects, { name: '', techStack: '', liveLink: '', description: '' }]
    }));
  };

  
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

  const handleSubmit = () => {
    // Here you'll call your API to generate the resume
    generateResume();
    console.log('Form submitted:', formData);
    navigate('/preview');
  };

  const renderFormStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-6">Personal Information</h2>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
            <input
              type="url"
              name="linkedin"
              placeholder="LinkedIn URL"
              value={formData.linkedin}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              name="github"
              placeholder="GitHub Username"
              value={formData.github}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
            <input
              type="url"
              name="portfolio"
              placeholder="Portfolio Website"
              value={formData.portfolio}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-6">Education & Experience</h2>
            <input
              type="text"
              name="education"
              placeholder="Degree"
              value={formData.education}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              name="university"
              placeholder="University"
              value={formData.university}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              name="graduationYear"
              placeholder="Graduation Year"
              value={formData.graduationYear}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              name="educationDuration"
              placeholder="Duration (in years)"
              value={formData.educationDuration}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              name="experience"
              placeholder="Experience Title"
              value={formData.experience}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              name="companyName"
              placeholder="Company Name"
              value={formData.companyName}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              name="role"
              placeholder="Role"
              value={formData.role}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              name="experienceDuration"
              placeholder="Experience Duration (in years)"
              value={formData.experienceDuration}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-6">Skills & Achievements</h2>
            <input
              type="text"
              name="skills"
              placeholder="Skills (comma separated)"
              value={formData.skills}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              name="certifications"
              placeholder="Certifications"
              value={formData.certifications}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              name="certificationDate"
              placeholder="Certification Date"
              value={formData.certificationDate}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              name="achievements"
              placeholder="Achievements"
              value={formData.achievements}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              name="awards"
              placeholder="Awards"
              value={formData.awards}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              name="languages"
              placeholder="Languages"
              value={formData.languages}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>
        );
      case 4:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-6">Projects & Job Description</h2>
            <textarea
              name="jobDescription"
              placeholder="Job Description"
              value={formData.jobDescription}
              onChange={handleInputChange}
              className="w-full p-2 border rounded h-32"
            />
            <div className="space-y-6">
              <h3 className="text-xl font-semibold">Projects</h3>
              {formData.projects.map((project, index) => (
                <div key={index} className="space-y-2">
                  <input
                    type="text"
                    placeholder="Project Name"
                    value={project.name}
                    onChange={(e) => handleProjectChange(index, 'name', e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                  <input
                    type="text"
                    placeholder="Tech Stack"
                    value={project.techStack}
                    onChange={(e) => handleProjectChange(index, 'techStack', e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                  <input
                    type="url"
                    placeholder="Live Link"
                    value={project.liveLink}
                    onChange={(e) => handleProjectChange(index, 'liveLink', e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                  <textarea
                    placeholder="Project Description"
                    value={project.description}
                    onChange={(e) => handleProjectChange(index, 'description', e.target.value)}
                    className="w-full p-2 border rounded h-24"
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={addProject}
                className="bg-indigo-100 text-indigo-600 px-4 py-2 rounded hover:bg-indigo-200"
              >
                Add Another Project
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          {[1, 2, 3, 4].map((step) => (
            <div
              key={step}
              className={`w-1/4 h-2 rounded ${
                step <= currentStep ? 'bg-indigo-600' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
        <div className="text-center text-gray-600">
          Step {currentStep} of 4
        </div>
      </div>

      <form className="bg-white p-6 rounded-lg shadow-lg">
        {renderFormStep()}

        <div className="flex justify-between mt-8">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={() => setCurrentStep(currentStep - 1)}
              className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded hover:bg-gray-200"
            >
              <ChevronLeft size={20} />
              Previous
            </button>
          )}
          {currentStep < 4 ? (
            <button
              type="button"
              onClick={() => setCurrentStep(currentStep + 1)}
              className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 ml-auto"
            >
              Next
              <ChevronRight size={20} />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              className="flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 ml-auto"
            >
              Generate Resume
              <FileCheck size={20} />
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ResumeForm;