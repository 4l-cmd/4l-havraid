import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SponsorsContent from "@/components/SponsorsContent";

export const metadata = {
  title: "Devenir Sponsor · 4L HAVRAID",
  description: "Votre logo sur notre Renault 4L du Havre à Marrakech. Packages Bronze, Argent et Or disponibles.",
};

export default function SponsorsPage() {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 80 }}>
        <SponsorsContent />
      </main>
      <Footer />
    </>
  );
}
