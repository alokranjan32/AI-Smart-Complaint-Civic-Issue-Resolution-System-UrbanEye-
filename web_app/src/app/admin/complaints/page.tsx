import Navbar from "../../../components/Navbar";
import ComplaintCard from "../../../components/Complaintcard";
import { demoComplaints } from "../../../lib/demoData";

export default function AdminComplaintsPage() {
  return (
    <div className="pb-12">
      <Navbar />
      <main className="mx-auto max-w-6xl px-6 md:px-10">
        <section className="grid gap-5 md:grid-cols-2">
          {demoComplaints.map((complaint) => (
            <ComplaintCard key={complaint.id} complaint={complaint} />
          ))}
        </section>
      </main>
    </div>
  );
}
