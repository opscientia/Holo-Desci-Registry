import React from "react";

export default function MessageScreen(props) {
  return (
    <div className="bg-img x-section wf-section" style={{ width: "100vw" }}>
      <div className="x-container w-container" style={{ marginTop: "200px" }}>
        <h3>{props.msg}</h3>
      </div>
    </div>
  );
}
