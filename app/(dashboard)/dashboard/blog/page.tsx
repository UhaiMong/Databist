import Link from "next/link";
import connectDB from "@/lib/db/connectDB";
import { Blog } from "@/lib/models";
import { Button } from "@/app/components/ui/button";
import { Plus } from "lucide-react";
import BlogTable from "@/app/components/dashboard/blog/BlogTable";

export const metadata = {
  title: "Blog Management | Digital Resolution",
};

async function getPosts() {
  await connectDB();
  const posts = await Blog.find().sort({ createdAt: -1 }).lean();
  return JSON.parse(JSON.stringify(posts));
}

export default async function DashboardBlogPage() {
  const posts = await getPosts();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Blog Management</h1>
          <p className="text-muted-foreground">
            Create, edit, schedule, and publish articles.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/blog/new">
            <Plus className="mr-2 h-4 w-4" /> New Post
          </Link>
        </Button>
      </div>

      <BlogTable initialPosts={posts} />
    </div>
  );
}
