import { useState } from "react";
import { ReactComponent as ArrowOpen } from "../assets/icons/arrow=open.svg";
import { ReactComponent as ArrowClose } from "../assets/icons/arrow=close.svg";

export default function Chat() {
  const [collapse, setCollapse] = useState(false);

  return (
    <div
      className={`w-full h-full flex flex-col p-4 bg-slate-200 rounded-xl duration-200 lg:w-96  ${
        collapse && "!w-20"
      }`}
    >
      <div>
        <h3
          onClick={() => {
            setCollapse(!collapse);
          }}
          className=""
        >
          {collapse ? <ArrowClose className="mx-auto" /> : <ArrowOpen />}
        </h3>
      </div>
      {!collapse && (
        <div className={"w-full grow prose mt-4 flex flex-col"}>
          <h1>Chat</h1>
          <div
            className={
              "w-full h-full bg-slate-100 rounded-lg p-3 flex flex-col justify-center items-center"
            }
          >
            <p className={""}>Coming soon!</p>
          </div>
        </div>
      )}
    </div>
  );
}
