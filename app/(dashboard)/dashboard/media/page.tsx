import MediaLibrary from "@/app/components/dashboard/media/MediaLibrary";

export const metadata = {
  title: "Media Library | Databist",
};

export default function DashboardMediaPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Media Library</h1>
        <p className="text-muted-foreground">
          Central place for uploaded images. Use Choose / Upload on forms to pick
          from here.
        </p>
      </div>

      <MediaLibrary />
    </div>
  );
}
