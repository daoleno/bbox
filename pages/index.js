import NavBar from "../components/NavBar";
import CardList from "../components/CardList";

export default function Home() {
  return (
    <>
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:divide-y lg:divide-gray-200 lg:px-8">
        <NavBar />
        <div className="mt-8">
          <CardList />
        </div>
      </div>
    </>
  );
}
