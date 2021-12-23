import Parser from "rss-parser";

import Feeds from "../components/Feeds";

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
  // "https://rsshub.app/telegram/channel/wublockchainenglish",
  // "https://rsshub.app/telegram/channel/DelphiDigitalAlerts",
];

export async function getServerSideProps() {
  const feeds = await getAllFeeds(...feedUrls);
  return { props: { feeds } };
}

async function getAllFeeds(...urls) {
  const parser = new Parser();
  const feeds = await Promise.all(
    urls.map(async (url) => await (await parser.parseURL(url)).items)
  );
  return feeds.flat();
}

export default function CryptoNews({ feeds }) {
  return <Feeds feeds={feeds} title="Crypto News" href="/cryptonews" />;
}
