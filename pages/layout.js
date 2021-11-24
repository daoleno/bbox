import Footer from "../components/Footer";
import NavBar from "../components/NavBar";

export default function Layout({ children }) {
  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 flex flex-col h-screen">
      <NavBar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}
