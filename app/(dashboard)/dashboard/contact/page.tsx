import ContactListTable from "@/app/components/dashboard/contact/ContactListTable";
import connectDB from "@/lib/db/connectDB";
import { Contact, Subscriber } from "@/lib/models";

export const metadata = {
  title: "Contact List | Digital Resolution",
};

async function getContactList() {
  await connectDB();
  const contactList = await Contact.find().sort({ createdAt: -1 }).lean();
  return JSON.parse(JSON.stringify(contactList));
}

export default async function ContactListPage() {
  const contactList = await getContactList();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Contact List</h1>
        <p className="text-muted-foreground">
          Everyone who has contacted via contact form.
        </p>
      </div>

      <ContactListTable initialContactLists={contactList} />
    </div>
  );
}
