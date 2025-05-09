
export default function ProjectPage({ params }: { params: { id: string } }) {
  const projectId = params.id;

  // Replace with actual project content fetching
  const project = {
    title: `Project ${projectId}`,
    overview: `Overview of project ${projectId}.`,
    technologies: ['Python', 'TensorFlow', 'Other'],
    results: 'Key results and findings of the project.',
  };

  const projectSpecificContent = {
    0: {
      title: "AI-Powered Image Recognition System",
      overview: "An AI-powered system designed to identify objects within images using deep learning techniques.",
      technologies: ['Python', 'TensorFlow', 'Keras', 'OpenCV'],
      results: 'Achieved 95% accuracy in object detection on a diverse dataset of 10,000 images.',
    },
    1: {
      title: "Sentiment Analysis of Social Media Data",
      overview: "A project focused on analyzing sentiments expressed on social media platforms to understand public opinion.",
      technologies: ['Python', 'NLTK', 'Scikit-learn', 'Tweepy'],
      results: 'Successfully classified sentiments from Twitter data with 80% accuracy, providing insights into brand perception.',
    },
    2: {
      title: "Predictive Maintenance for Industrial Equipment",
      overview: "Utilizing machine learning algorithms to predict potential failures in industrial equipment and optimize maintenance schedules.",
      technologies: ['Python', 'Pandas', 'Scikit-learn', 'Azure ML'],
      results: 'Reduced equipment downtime by 15% through proactive maintenance alerts and optimized scheduling.',
    },
  };

  const selectedProject = projectSpecificContent[projectId as keyof typeof projectSpecificContent] || project;

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">{selectedProject.title}</h1>
      <section className="mb-4">
        <h2 className="text-2xl font-semibold">Overview</h2>
        <p>{selectedProject.overview}</p>
      </section>
      <section className="mb-4">
        <h2 className="text-2xl font-semibold">Technologies Used</h2>
        <ul>
          {selectedProject.technologies.map((tech, index) => (
            <li key={index}>{tech}</li>
          ))}
        </ul>
      </section>
      <section className="mb-4">
        <h2 className="text-2xl font-semibold">Key Results</h2>
        <p>{selectedProject.results}</p>
      </section>
    </div>
  );
}
