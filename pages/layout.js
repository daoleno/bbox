import Footer from "../components/Footer";
import NavBar from "../components/NavBar";
import SEO from "../components/SEO";
import { useEffect } from "react";
import { themeChange } from "theme-change";

export default function Layout({
  children,
  title,
  description,
  image,
  slug,
  article,
}) {
  useEffect(() => {
    themeChange(false);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 flex flex-col h-screen">
      <SEO
        title={title}
        description={description}
        image={image}
        slug={slug}
        article={article}
      />
      <NavBar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}
