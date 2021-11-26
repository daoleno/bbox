// import { useDropzone } from "react-dropzone";
import { Fragment, useState } from "react";
import { uploadToNFTStorage } from "../lib/web3";
import Notify from "../components/Notify";
import { getErrorMessage } from "../lib/web3";
import Dropzone, { useDropzone } from "react-dropzone";

export default function NFTStorage() {
  const { isDragActive, getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    onDrop: (acceptedFiles) => {
      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
    },
  });
  const [files, setFiles] = useState([]);

  const [values, setValues] = useState({
    name: "",
    description: "",
  });

  const [error, setError] = useState();
  const [metadataURL, setMetadataURL] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };

  async function handleUpload() {
    if (files.length > 0) {
      setUploading(true);
      try {
        const metadataURL = await uploadToNFTStorage({ ...values }, files[0]);
        setUploading(false);
        setMetadataURL(metadataURL);
      } catch (error) {
        setUploading(false);
        setError(error);
      }
    }
  }

  return (
    <>
      {error && (
        <Notify key={new Date().getTime()} error={getErrorMessage(error)} />
      )}

      <div className="flex flex-wrap justify-center sm:mt-20">
        <div className="flex flex-col px-3 mb-6 md:mb-0 justify-center">
          <div className="px-3 mb-6 md:mb-0">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="name"
            >
              Name
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="grid-memo"
              type="text"
              name="name"
              placeholder="name"
              onChange={handleChange}
            />
          </div>
          <div className="px-3 mb-6 md:mb-0">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
              Description
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="grid-description"
              type="text"
              name="description"
              placeholder="description"
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="self-center" {...getRootProps()}>
          <button
            type="button"
            className="border-2 border-gray-300 border-dashed rounded-lg p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {files.length > 0 ? (
              <Fragment>
                <div className="flex justify-center">
                  <img
                    className="w-32 h-32 rounded-full"
                    src={files[0].preview}
                    alt="preview"
                  />
                </div>
                <div className="flex justify-center">
                  <p className="text-gray-600 text-xs">{files[0].name}</p>
                </div>
              </Fragment>
            ) : (
              <Fragment>
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
                  {isDragActive ? "Dropping" : "Drop image here"}
                </span>
              </Fragment>
            )}
          </button>
          <input type="file" accept="image/*" {...getInputProps()} />
        </div>
      </div>
      <button
        type="button"
        className="relative block mx-auto mt-5 disabled:opacity-50 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        onClick={handleUpload}
      >
        {uploading ? "Uploading" : "Upload"}
      </button>

      {metadataURL && (
        <div className="flex justify-center mx-auto">
          <div className="bg-whiterounded px-8 pt-6 pb-8 mb-4">
            <div className="flex flex-wrap -mx-3 mb-6">
              <div className="w-full px-3 mb-6 md:mb-0">
                <label
                  className="block uppercase text-gray-700 text-center font-bold mb-4"
                  htmlFor="name"
                >
                  Metadata URL
                </label>
                <input
                  className="appearance-none bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  value={metadataURL}
                  readOnly
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
