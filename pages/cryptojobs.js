import Parser from "rss-parser";

import Feeds from "../components/Feeds";

const feedUrls = [
  "https://crypto.jobs/rss",
  // "https://api.cryptojobslist.com/jobs.rss", // too large
  "https://rsshub.app/telegram/channel/cryptojobslist",
  "https://cryptocurrencyjobs.co/index.xml",
  "https://pompcryptojobs.com/rss/",
  "https://www.cryptojobsdaily.com/feed/",
  "https://remoteok.com/remote-crypto-jobs.rss",
  "https://www.cryptojobsdaily.com/?feed=job_feed&sh_atts=job_ad_banners:yes|job_ad_after_list:3|job_ads_group:243433891|job_per_page:15|job_view:view-default|job_excerpt:20|job_order:DESC|job_orderby:date|job_pagination:yes|job_filters:yes|job_filters_loc:yes|job_filters_date:yes|job_filters_type:yes|job_filters_sector:yes|job_custom_fields_switch:no|job_deadline_switch:no|quick_apply_job:no|job_loc_listing:country,city",
];

export async function getStaticProps() {
  const feeds = await getAllFeeds(...feedUrls);
  return { props: { feeds }, revalidate: 60 * 10 };
}

async function getAllFeeds(...urls) {
  const parser = new Parser();
  const feeds = await Promise.all(
    urls.map(async (url) => await (await parser.parseURL(url)).items)
  );
  return feeds.flat();
}

export default function CryptoJobs({ feeds }) {
  return <Feeds feeds={feeds} title="Crypto Jobs" href="/cryptojobs" />;
}
