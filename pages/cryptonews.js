import Feeds from "../components/Feeds";
import { getAllFeeds } from "../lib/feeds";

const feedUrls = [
  "https://rekt.news/rss/feed.xml",
  "https://future.a16z.com/feed",
  "https://blog.ethereum.org/feed.xml",
  "https://newsletter.banklesshq.com/feed",
  "https://www.theblockcrypto.com/rss.xml",
  "https://www.coindesk.com/arc/outboundfeeds/rss/?outputType=xml",
  "https://decrypt.co/feed",
  "https://vitalik.ca//./feed.xml",
  "http://feeds.feedburner.com/ConsenSys/posts?format=xml",
  "https://rsshub.app/telegram/channel/thedailyape",
  "https://medium.com/feed/@ambergroup",
  "https://medium.com/feed/@polynya",
  // "https://rsshub.app/telegram/channel/wublockchainenglish",
  // "https://rsshub.app/telegram/channel/DelphiDigitalAlerts",
];

export async function getStaticProps() {
  const feeds = await getAllFeeds(...feedUrls);
  return { props: { feeds }, revalidate: 60 * 10 };
}

export default function CryptoNews({ feeds }) {
  return <Feeds feeds={feeds} title="Crypto News" href="/cryptonews" />;
}
