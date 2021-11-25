import { useDropzone } from "react-dropzone";
import { NFTStorage, File } from "nft.storage";

export default function NFT() {
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone();
  const files = acceptedFiles.map((file) => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));

  async function handleUpload() {
    // upload file to nft.storage
    const apiKey = "YOUR_API_KEY";
    const client = new NFTStorage({ token: apiKey });

    const metadata = await client.store({
      name: "Pinpie",
      description: "Pin is not delicious beef!",
      image: acceptedFiles[0],
    });
    console.log(metadata.url);
  }

  return (
    <>
      <div {...getRootProps()}>
        <button
          type="button"
          className="relative block w-1/4 border-2 mx-auto sm:mt-20 border-gray-300 border-dashed rounded-lg p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {files.length > 0 ? (
            <ul>{files}</ul>
          ) : (
            <div>
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  vectorEffect="non-scaling-stroke"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              <span className="mt-2 block text-sm font-medium text-gray-900">
                Drop file here
              </span>
            </div>
          )}
          <input {...getInputProps()} />
        </button>
      </div>

      <button
        type="button"
        className="relative block mx-auto mt-5 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        onClick={handleUpload}
      >
        Upload
      </button>
    </>
  );
}
