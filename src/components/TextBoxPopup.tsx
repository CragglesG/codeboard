import { useState } from "react";

export default function TextBoxPopup({
  optionalMessage,
  btnOnClick,
  btnOnClickArgs,
}: {
  optionalMessage?: string;
  btnOnClick: (...args: any) => void;
  btnOnClickArgs?: any[];
}) {
  const [text, setText] = useState("");

  return (
    <div className="textbox-popup">
      {optionalMessage && <p>{optionalMessage}</p>}
      <input
        type="text"
        placeholder="Enter text"
        onChange={(e) => setText(e.target.value)}
      />
      <br />
      <button
        onClick={() => {
          btnOnClick(...btnOnClickArgs, text);
        }}
      >
        Submit
      </button>
    </div>
  );
}
