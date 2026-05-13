import Navbar from "../../components/Navbar";
import MapComplaint from "../../components/MapComplaint";

export default function MapPage() {
  return (
    <div className="pb-12">
      <Navbar />
      <main className="mx-auto max-w-6xl px-6 md:px-10">
        <MapComplaint />
      </main>
    </div>
  );
}
