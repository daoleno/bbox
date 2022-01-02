import { timeSince } from "../lib/web3";
import { useState } from "react";

export default function Feeds({ feeds, title, href }) {
  const [pageNumber, setPageNumber] = useState(1);

  if (!feeds) {
    return <div>Loading...</div>;
  }

  // filter data by title
  const items = feeds.filter((item) => {
    const title = item.title.toLowerCase();
    return !title.includes("sponsor");
  });

  // sort items by pubDate
  items.sort((a, b) => {
    const aDate = new Date(a.pubDate);
    const bDate = new Date(b.pubDate);
    return bDate - aDate;
  });

  return (
    <section>
      <div className="text-xl font-bold ml-6 mb-4 flex mt-3">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
          />
        </svg>
        <a href={href}>
          <span className="ml-1">{title}</span>
        </a>
      </div>
      <NewsPage items={items} pageno={pageNumber} />
      <button
        className="font-semibold ml-12 mr-4 mt-3"
        onClick={() => setPageNumber(pageNumber + 1)}
      >
        More
      </button>
    </section>
  );
}

export function NewsPage({ items, pageno }) {
  const pageLimit = 30;
  const start = (pageno - 1) * pageLimit;
  const end = start + pageLimit;
  const news = items.slice(start, end);
  return (
    <div>
      <ol className="text-sm ml-5 mr-4 mt-6">
        {news &&
          news.map((item, i) => (
            <li className="my-1 flex" key={i}>
              <span className="mr-2 ">{start + i + 1}.</span>
              <div>
                <div>
                  <a href={item.link} target="_blank" className="font-bold">
                    {item.title}
                  </a>
                  <span className="text-xs">
                    (
                    <a
                      href={item.link}
                      target="_blank"
                      className="hover:underline"
                    >
                      {new URL(item.link).hostname}
                    </a>
                    )
                  </span>
                </div>
                <div className="text-xs">
                  <span>{timeSince(new Date(item.pubDate))} ago</span>
                </div>
              </div>
            </li>
          ))}
      </ol>
    </div>
  );
}
