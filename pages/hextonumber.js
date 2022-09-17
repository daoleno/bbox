import { useEffect, useState } from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { docco } from "react-syntax-highlighter/dist/cjs/styles/hljs";

const defaultAreaValue = `{
    "jsonrpc": "2.0",
    "id": 1,
    "result": {
      "currentBlock": "0xed57da",
      "healedBytecodeBytes": "0xfe423d",
      "healedBytecodes": "0x7e8",
      "healedTrienodeBytes": "0x1400f6148",
      "healedTrienodes": "0x139734b",
      "healingBytecode": "0x0",
      "healingTrienodes": "0xa84",
      "highestBlock": "0xed5864",
      "startingBlock": "0xed3b8c",
      "syncedAccountBytes": "0x9ce7a751b",
      "syncedAccounts": "0xa5c2fa4",
      "syncedBytecodeBytes": "0xcaadf3dd",
      "syncedBytecodes": "0x84f94",
      "syncedStorage": "0x277f6923",
      "syncedStorageBytes": "0x2103898dd3"
    }
  }
  `;

export default function HexToNumber() {
  // We have two text areas, one for the hex value and one for the decimal value
  const [hex, setHex] = useState(defaultAreaValue);
  const [dec, setDec] = useState("");
  useEffect(() => {
    // If the hex value is empty, set the decimal value to empty
    if (hex === "") {
      setDec("");
    } else {
      // Otherwise, find any hex numbers in the string and convert them to decimal
      setDec(
        hex.replace(/0x[0-9a-fA-F]+/g, (match) => {
          return parseInt(match, 16);
        })
      );
    }
  }, [hex]);

  return (
    <>
      <div className="flex flex-col items-center justify-center w-full max-w-md px-4 py-6 space-y-4 bg-white rounded-md mx-auto mt-10">
        <div className="flex flex-col items-center justify-center space-y-2">
          <h1 className="text-2xl font-bold text-gray-700">Hex to Number</h1>
          <p className="text-sm text-gray-500">
            Convert any hex numbers in text to decimal
          </p>
        </div>
      </div>
      <div className="flex flex-1 h-2/3 overflow-hidden select-text flex-row mx-10 mt-5">
        <textarea
          className="mx-auto w-1/2 h-full border border-gray-300 rounded-md focus:outline-none focus:bg-white focus:border-gray-500 text-gray-700"
          onChange={(e) => setHex(e.target.value)}
          value={hex}
        />
        <div className="w-0.5 h-full bg-black"></div>
        <div
          className="mx-auto w-1/2 h-full border border-gray-300 rounded-md focus:outline-none focus:bg-white focus:border-gray-500"
          value={dec}
        >
          {
            <SyntaxHighlighter language="" style={docco}>
              {dec}
            </SyntaxHighlighter>
          }
        </div>
      </div>
    </>
  );
}
