import { useState } from "react";

export default function Image(props) {
  const [loaded, setLoaded] = useState(false);
  function onLoad() {
    console.log("loaded");
    setLoaded(true);
  }
  return (
    <>
      <img
        style={{ display: loaded ? "block" : "none" }}
        onLoad={onLoad}
        src={props.src}
        alt={props.alt}
        {...props}
      />
      {!loaded && (
        <div className="animate-pulse" {...props}>
          ff
        </div>
      )}
    </>
  );
}

function Spin() {
  return (
    //     <div
    //       style={{
    //         position: "absolute",
    //         top: "50%",
    //         left: "50%",
    //         transform: "translate(-50%, -50%)",
    //       }}
    //     >
    //       <SpinIndicator />
    //     </div>
    <div className="animate-pulse"></div>
  );
}

function SpinIndicator() {
  return (
    <div className="ant-spin ant-spin-lg ant-spin-spinning ant-spin-show-text">
      <div className="ant-spin-dot ant-spin-dot-spin">
        <i />
        <i />
      </div>
      <div className="ant-spin-text">Loading...</div>
    </div>
  );
}
