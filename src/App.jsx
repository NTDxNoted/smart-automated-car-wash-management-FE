import Navbar     from "./components/Navbar";
import Hero       from "./components/Hero";
import Services   from "./components/Services";
import Booking    from "./components/Booking";
import Membership from "./components/Membership";
import Footer     from "./components/Footer";
import "./App.css";

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Services />
        <Booking />
        <Membership />
      </main>
      <Footer />
    </>
  );
}
