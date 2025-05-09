
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const blogPosts = [
  {
    title: "Introduction to Deep Learning",
    excerpt: "A high-level overview of deep learning concepts.",
    date: "2024-08-01",
    category: "Deep Learning",
  },
  {
    title: "Natural Language Processing with Transformers",
    excerpt: "Exploring the power of transformer models in NLP.",
    date: "2024-07-15",
    category: "NLP",
  },
  {
    title: "Computer Vision: Object Detection Techniques",
    excerpt: "An overview of modern object detection methods.",
    date: "2024-06-20",
    category: "Computer Vision",
  },
];

export default function BlogPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Blog</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogPosts.map((post, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>
                <Link href={`/blog/${index}`}>{post.title}</Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>{post.excerpt}</p>
              <p className="text-sm text-muted-foreground mt-2">
                {post.date} - {post.category}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
