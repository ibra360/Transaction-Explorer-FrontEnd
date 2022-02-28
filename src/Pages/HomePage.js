import React, { useState } from "react";
import { Button } from "reactstrap";
import CustomDropdown from "./CustomDropdown";

export default function HomePage() {
  const [txHash, setTxHash] = useState("");

  return (
    <div className="w-75 center">
      <h1 className="mt-4 mb-5 " style={{ fontWeight: "700", color: "#053C5E" }}>
        EthTx Transaction Decoder
      </h1>
      <div className="mb-3" style={{ fontSize: "22px", fontWeight: "500" }}>
        Network
      </div>
      <CustomDropdown />
      <div
        className="mt-4 mb-3"
        style={{ fontSize: "22px", fontWeight: "500" }}
      >
        Tx Hash
      </div>
      <input
        style={{
          width: "400px",
          border: "1px solid grey",
          borderRadius: "6px",
          width: "100%",
          height: "45px",
          paddingLeft: "10px",
        }}
        onChange={(e) => setTxHash(e.target.value)}
        placeholder=" Paste transaction hash here"
      />
      <Button color="secondary" className="mt-4 px-5">
        Decode Now
      </Button>
    </div>
  );
}
