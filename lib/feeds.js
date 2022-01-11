import Parser from "rss-parser";

export async function getAllFeeds(...urls) {
  const parser = new Parser();
  const feeds = await Promise.allSettled(
    urls.map(async (url) => await (await parser.parseURL(url)).items)
  );
  // filter out failed feeds and flatten
  return feeds
    .filter((feed) => feed.status === "fulfilled")
    .flatMap((feed) => feed.value);
}
