import "tailwindcss/tailwind.css";
import Layout from "./layout";
import Script from "next/script";

function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <Script
        async
        defer
        data-website-id="c93cfc77-d9e8-46d0-b07e-7061a2602e00"
        src="https://bbox-umami.herokuapp.com/umami.js"
      ></Script>

      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;
