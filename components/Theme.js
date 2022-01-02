import { useEffect } from "react";
import { themeChange } from "theme-change";

useEffect(() => {
  themeChange(false);
  // 👆 false parameter is required for react project
}, []);
