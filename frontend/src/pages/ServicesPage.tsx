import Navbar from '../components/Navbar';
import Services from '../components/Services';
import Footer from '../components/Footer';

export default function ServicesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-16">
        <Services />
      </main>
      <Footer />
    </div>
  );
}
