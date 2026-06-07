import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Services from '../components/Services';
import About from '../components/About';
import Gallery from '../components/Gallery';
import BookingForm from '../components/BookingForm';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <Services />
      <About />
      <Gallery homeOnly />
      <BookingForm />
      <Footer />
    </div>
  );
}
