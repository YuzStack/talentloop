import HeaderSection from '../components/HeaderSection';
import HeroSection from '../components/HeroSection';
import ClaritySandboxSection from '../components/ClaritySandboxSection';
import RoadmapTrackSection from '../components/RoadmapTrackSection';
import AtsAnalyzerSection from '../components/AtsAnalyzerSection';
import FooterSection from '../components/FooterSection';

export default function LandingPage() {
  return (
    <div className='bg-canvas-default text-brand-dark min-h-screen w-full overflow-x-hidden font-sans transition-colors duration-200'>
      <HeaderSection />
      <HeroSection />
      <ClaritySandboxSection />
      <RoadmapTrackSection />
      <AtsAnalyzerSection />
      <FooterSection />
    </div>
  );
}
