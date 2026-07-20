import BlogForm from "@/app/components/dashboard/blog/BlogForm";

export const metadata = {
  title: "New Blog Post | Digital Resolution",
};

export default function NewBlogPostPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">New Blog Post</h1>
        <p className="text-muted-foreground">
          Write and publish a new article.
        </p>
      </div>

      <BlogForm mode="create" />
    </div>
  );
}
