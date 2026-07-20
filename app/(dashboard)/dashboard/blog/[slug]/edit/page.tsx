import { notFound } from "next/navigation";
import connectDB from "@/lib/db/connectDB";
import { Blog } from "@/lib/models";
import BlogForm from "@/app/components/dashboard/blog/BlogForm";

export const metadata = {
  title: "Edit Blog Post | Digital Resolution",
};

interface EditBlogPageProps {
  params: Promise<{ slug: string }>;
}

async function getPost(slug: string) {
  await connectDB();
  const post = await Blog.findOne({ slug }).lean();
  return post ? JSON.parse(JSON.stringify(post)) : null;
}

export default async function EditBlogPostPage({ params }: EditBlogPageProps) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Edit Blog Post</h1>
        <p className="text-muted-foreground">
          Update article content and status.
        </p>
      </div>

      <BlogForm mode="edit" initialData={post} />
    </div>
  );
}
