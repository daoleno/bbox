import Feeds from "../components/Feeds";
import { getAllFeeds } from "../lib/feeds";

const feedUrls = ["https://academy.stakedao.org/rss/"];

export async function getStaticProps() {
  const feeds = await getAllFeeds(...feedUrls);
  return { props: { feeds }, revalidate: 60 * 10 };
}

export default function CryptoDev({ feeds }) {
  return <Feeds feeds={feeds} title="Crypto Dev" href="/cryptodev" />;
}
