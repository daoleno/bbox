import Stats from "../components/Stats";

export default function GasNow() {
  return (
    <div className="flex flex-col justify-center mx-6">
      <Stats chain="eth" />
      <Stats chain="polygon" />
      <Stats chain="bsc" />
    </div>
  );
}
