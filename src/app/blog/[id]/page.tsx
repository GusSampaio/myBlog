
export default function BlogPostPage({ params }: { params: { id: string } }) {
  const postId = params.id;

  // Replace with actual blog post content fetching
  const blogPost = {
    title: `Blog Post ${postId}`,
    content: `This is the content of blog post ${postId}. Replace this with actual content related to machine learning.`,
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">{blogPost.title}</h1>
      <p>{blogPost.content}</p>
    </div>
  );
}
