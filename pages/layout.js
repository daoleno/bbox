import NavBar from "../components/NavBar";

export default function Layout({ children }) {
  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
      <NavBar />
      <main>{children}</main>
    </div>
  );
}
