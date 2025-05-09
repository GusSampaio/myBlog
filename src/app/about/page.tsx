
export default function AboutPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">About Me</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          {/* Replace with your actual profile image */}
          <img
            src="https://picsum.photos/200/300"
            alt="Profile"
            className="rounded-md mb-4"
          />
          <p>Contact: your.email@example.com</p>
          <p>LinkedIn: linkedin.com/in/yourprofile</p>
          <p>GitHub: github.com/yourusername</p>
        </div>
        <div>
          <p>
            {/* Replace with your actual bio */}
            I am a passionate machine learning engineer with a background in
            computer science...
          </p>
          <h2>Education</h2>
          <p>
            {/* Replace with your education details */}
            Master of Science in Machine Learning, University of Example
          </p>
          <h2>Experience</h2>
          <p>
            {/* Replace with your work experience details */}
            Machine Learning Engineer at Tech Company
          </p>
        </div>
        <div>
          <h2>Skills</h2>
          <ul>
            <li>Python</li>
            <li>TensorFlow</li>
            <li>PyTorch</li>
            <li>NLP</li>
            <li>Computer Vision</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

