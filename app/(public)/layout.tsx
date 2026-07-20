import { PublicFooter } from "../components/public/shared/footer";
import { PublicNavbar } from "../components/public/shared/navbar";
import ScrollToTopButton from "../components/public/shared/ScrollToTopButton";
import WhatsAppButton from "../components/public/shared/whatsAppButton";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <PublicNavbar />
      <main className="flex-1">
        {children}
        <ScrollToTopButton />
        <WhatsAppButton />
      </main>
      <PublicFooter />
    </div>
  );
}
