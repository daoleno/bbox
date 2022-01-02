import {
  ArrowNarrowLeftIcon,
  ArrowNarrowRightIcon,
} from "@heroicons/react/solid";
import { useState } from "react";

export default function Pagination({
  searchValue,
  fetchIndex,
  totalSupply,
  setFetchIndex,
}) {
  const [input, setInput] = useState(searchValue);
  const onePageNumber = 8;

  const handleSubmit = (e) => {
    e.preventDefault();
    setFetchIndex(input);
  };

  return (
    // <nav className="border-t border-gray-200 px-4 flex items-center justify-between sm:px-0 mt-10">
    //   <div className="-mt-px w-0 flex-1 flex">
    //     <a
    //       href={`?search=${searchValue}&token_id=${fetchIndex - onePageNumber}`}
    //       className="border-t-2 border-transparent pt-4 pr-1 inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
    //     >
    //       <ArrowNarrowLeftIcon
    //         className="mr-3 h-5 w-5 text-gray-400"
    //         aria-hidden="true"
    //       />
    //       Previous
    //     </a>
    //   </div>
    //   <div className="hidden md:-mt-px md:flex w-40">
    //     <span
    //       href="#"
    //       className="pt-4 px-4 inline-flex justify-around text-center items-center text-sm font-medium text-gray-500"
    //       aria-current="page"
    //     >
    //       <form className="w-1/3 block" onSubmit={handleSubmit}>
    //         <input
    //           type="text"
    //           className="w-full border-0 p-0 text-center focus:ring-0 focus:border-indigo-600 appearance-none"
    //           placeholder={fetchIndex}
    //           onInput={(e) => setInput(+e.target.value)}
    //         />
    //       </form>
    //       <span className="w-1/3">/</span>
    //       <span className="w-1/3 p-0">
    //         {totalSupply || <span className="text-lg">∞</span>}
    //       </span>
    //     </span>
    //   </div>
    //   <div className="-mt-px w-0 flex-1 flex justify-end">
    //     <a
    //       href={`?search=${searchValue}&token_id=${fetchIndex + onePageNumber}`}
    //       className="border-t-2 border-transparent pt-4 pl-1 inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
    //     >
    //       Next
    //       <ArrowNarrowRightIcon
    //         className="ml-3 h-5 w-5 text-gray-400"
    //         aria-hidden="true"
    //       />
    //     </a>
    //   </div>
    // </nav>
    <div class="btn-group flex self-center mt-10">
      <a
        href={`?search=${searchValue}&token_id=${fetchIndex - onePageNumber}`}
        class="btn btn-outline lg:btn-wide"
      >
        <ArrowNarrowLeftIcon
          className="mr-3 h-5 w-5 text-gray-400"
          aria-hidden="true"
        />
        Previous
      </a>
      <a
        href={`?search=${searchValue}&token_id=${fetchIndex + onePageNumber}`}
        class="btn btn-outline lg:btn-wide"
      >
        Next
        <ArrowNarrowRightIcon
          className="ml-3 h-5 w-5 text-gray-400"
          aria-hidden="true"
        />
      </a>
    </div>
  );
}
