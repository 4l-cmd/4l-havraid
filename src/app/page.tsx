import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import APropos from "@/components/APropos";
import Equipe from "@/components/Equipe";
import GPS from "@/components/GPS";
import Etapes from "@/components/Etapes";
import AdopterKm from "@/components/AdopterKm";
import Supporters from "@/components/Supporters";
import Sponsors from "@/components/Sponsors";
import Galerie from "@/components/Galerie";
import InstagramSection from "@/components/Instagram";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <APropos />
        <Equipe />
        <GPS />
        <Etapes />
        <AdopterKm />
        <Supporters />
        <Sponsors />
        <Galerie />
        <InstagramSection />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
