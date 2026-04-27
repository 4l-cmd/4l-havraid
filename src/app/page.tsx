import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Actualites from "@/components/Actualites";
import Etapes from "@/components/Etapes";
import Equipage from "@/components/Equipage";
import SuiviGPS from "@/components/SuiviGPS";
import AdopterKm from "@/components/AdopterKm";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Actualites />
        <Etapes />
        <Equipage />
        <SuiviGPS />
        <AdopterKm />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
