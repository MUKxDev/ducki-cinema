import { useEffect, useState } from "react";
import { ReactComponent as ArrowOpen } from "../assets/icons/arrow=open.svg";
import { ReactComponent as ArrowClose } from "../assets/icons/arrow=close.svg";
import { supabase, useAppContext } from "../context/appContext";
import { insertChat } from "../database/supabase";
import { Chats } from "../database/interfaces";
import { isEmpty } from "lodash";

interface Props {
  roomID: string;
}

export default function Chat({ roomID }: Props) {
  const [collapse, setCollapse] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [chats, setChats] = useState<Chats[]>([]);
  const [unReadMessages, setUnReadMessages] = useState<Chats[]>([]);
  const [newChat, setNewChat] = useState<Chats | null>(null);

  const { currentSession } = useAppContext();

  useEffect(() => {
    let subscription = supabase
      .channel("public:chats")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "chats",
          filter: `roomID=eq.${roomID}`,
        },
        (payload) => {
          console.log("chat");
          setNewChat(payload.new as Chats);
        }
      )
      .subscribe();
    console.log("new subscription created");

    return () => {
      subscription.unsubscribe();
    };
  }, [roomID]);

  useEffect(() => {
    newChat && setChats([...chats, newChat]);

    if (collapse) {
      newChat && setUnReadMessages([...unReadMessages, newChat]);
    }
    setNewChat(null);
    return () => {};
  }, [newChat]);

  async function handleSubmit(e: any) {
    e.preventDefault();
    setLoading(true);
    if (message && currentSession) {
      try {
        let id: number = await insertChat(
          message,
          currentSession.user.id,
          roomID
        ).then((data) => data.id);
        setMessage(null);
        let textField: any = document.getElementById("chat-text-field");
        textField.value = null;

        console.log("New message id", id);
      } catch (error) {
        console.log("Error sending a chat", error);
      }
    }
    setLoading(false);
  }

  return (
    <div
      className={`w-full h-[95%] flex flex-col rounded-xl duration-200 lg:w-96  ${
        collapse && "!w-20"
      }`}
    >
      <div
        className={`w-full h-[95%] fixed right-6 flex flex-col p-4 bg-slate-200 rounded-xl duration-200 lg:w-96  ${
          collapse && "!w-20"
        }`}
      >
        <div>
          <div
            onClick={() => {
              setCollapse(!collapse);
              !collapse && setUnReadMessages([]);
            }}
            className=""
          >
            {collapse ? <ArrowClose className="mx-auto" /> : <ArrowOpen />}
          </div>
          {!isEmpty(unReadMessages) && collapse && (
            <h2 className="p-1 mt-3 rounded-full aspect-square flex justify-center items-center bg-accent">
              {unReadMessages.length}
            </h2>
          )}
        </div>
        {
          <div
            className={`w-full grow prose mt-4 flex flex-col ${
              collapse && "hidden"
            }`}
          >
            <h1>Chat</h1>
            <div
              className={
                "w-full h-full relative bg-slate-100 rounded-lg p-3 space-y-2 flex flex-col"
              }
            >
              {chats.map((chat) => (
                <div
                  key={chat.id}
                  className={`max-w-[80%] px-2 py-1 self-start bg-slate-300 rounded-md flex  ${
                    chat.profileID === currentSession?.user.id &&
                    "!self-end !bg-blue-500 !text-white"
                  }`}
                >
                  <p className={"m-0"}>{chat.message}</p>
                </div>
              ))}
            </div>
            {/* Text field */}
            <form onSubmit={handleSubmit} className="mt-4 flex space-x-3">
              <input
                id="chat-text-field"
                type="text"
                placeholder="Message..."
                title="Message"
                onChange={(e) => setMessage(e.target.value)}
                onSubmit={() => !loading && handleSubmit}
                className="input grow"
              />
              <button
                type="submit"
                value="Send"
                placeholder="Send"
                className={`btn ${loading && "loading"}`}
              >
                {!loading && "send"}
              </button>
            </form>
          </div>
        }
      </div>
    </div>
  );
}