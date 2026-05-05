import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import BentoFeatures from "./components/BentoFeatures";
import FeatureDeepDive from "./components/FeatureDeepDive";
import ComparisonTable from "./components/ComparisonTable";
import Pricing from "./components/Pricing";
import FinalCTA from "./components/FinalCTA";
import Footer from "./components/Footer";

export default function App() {
  return (
    <div className="min-h-screen bg-surface selection:bg-primary-container selection:text-on-primary-container">
      <Navbar />
      <main>
        <Hero />
        <BentoFeatures />
        <FeatureDeepDive />
        <ComparisonTable />
        <Pricing />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
