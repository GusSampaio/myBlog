
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const projects = [
  {
    title: "AI-Powered Image Recognition System",
    summary: "A system that identifies objects in images using deep learning.",
  },
  {
    title: "Sentiment Analysis of Social Media Data",
    summary: "Analyzing public sentiment towards various topics using NLP.",
  },
  {
    title: "Predictive Maintenance for Industrial Equipment",
    summary: "Using machine learning to predict equipment failures.",
  },
];

export default function ProjectsPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Projects</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>
                <Link href={`/projects/${index}`}>{project.title}</Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>{project.summary}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
