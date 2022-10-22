import { useEffect, useRef, useState } from "react";
import { ReactComponent as ArrowOpen } from "../assets/icons/arrow=open.svg";
import { ReactComponent as ArrowClose } from "../assets/icons/arrow=close.svg";
import { supabase, useAppContext } from "../context/appContext";
import {
  fetchProfiles,
  fetchRoomChats,
  insertChat,
  updateRoomEmoji,
} from "../database/supabase";
import { Chats, Profiles } from "../database/interfaces";
import { isEmpty, find, uniqBy } from "lodash";
import { useQuery } from "@tanstack/react-query";
import { RealtimeChannel } from "@supabase/supabase-js";
import { ReactionBarSelector } from "@charkour/react-reactions";
import useWindowDimensions from "../helpers/useWindowDimensions";

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

  const { currentSession, users, setUsers } = useAppContext();

  const { width } = useWindowDimensions();

  const chatContainerEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatContainerEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats]);

  useEffect(() => {
    if (width < 1024 && collapse) {
      setCollapse(false);
    }
  }, [width, collapse]);

  useEffect(() => {
    fetchRoomChats(roomID).then((data) => {
      if (data) {
        setChats(data);

        setUsers(uniqBy(data, "profileID").map((value) => value.profileID!));

        profilesQuery.refetch();
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomID]);

  const profilesQuery = useQuery<Profiles[]>(["profiles"], () =>
    fetchProfiles(users)
  );

  useEffect(() => {
    let subscription: RealtimeChannel;
    if (roomID) {
      subscription = supabase
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
            if ((payload.new as Chats).profileID) {
              if (users.indexOf((payload.new as Chats).profileID!) === -1) {
                setUsers([...users, (payload.new as Chats).profileID!]);
              }
            }
            setNewChat(payload.new as Chats);
          }
        )
        .subscribe();
    }

    return () => {
      subscription?.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomID]);

  useEffect(() => {
    newChat && setChats([...chats, newChat]);

    if (collapse) {
      newChat && setUnReadMessages([...unReadMessages, newChat]);
    }
    setNewChat(null);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newChat]);

  async function setEmoji(label: string) {
    let emoji: string = "";
    switch (label) {
      case "haha":
        emoji = "😂";
        break;
      case "love":
        emoji = "😍";
        break;
      case "fire":
        emoji = "🔥";
        break;
      case "wow":
        emoji = "😲";
        break;
      case "sad":
        emoji = "😭";
        break;
      case "angry":
        emoji = "😡";
        break;
    }

    // TODO: update room emoji
    await updateRoomEmoji(emoji, roomID);
  }

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
      className={`w-full h-full max-h-80 lg:max-h-max lg:h-[95%] flex flex-col rounded-xl duration-200 lg:w-96  ${
        collapse && "!w-20"
      }`}
    >
      <div
        className={` lg:h-[95%] w-full h-full max-h-80 lg:max-h-max lg:fixed left-6 lg:left-auto right-6 flex flex-col p-4 bg-slate-200 rounded-xl duration-200 lg:w-96  ${
          collapse && "!w-20"
        }`}
      >
        <div
          className={`min-w-fit mx-auto block lg:hidden ${
            collapse && "hidden"
          }`}
        >
          <ReactionBarSelector
            style={{ paddingRight: "14px" }}
            reactions={[
              {
                label: "haha",
                node: <div>😂</div>,
                key: "haha",
              },
              {
                label: "love",
                node: <div>😍</div>,
                key: "love",
              },
              {
                label: "sad",
                node: <div>😭</div>,
                key: "sad",
              },
              {
                label: "angry",
                node: <div>😡</div>,
                key: "angry",
              },
              {
                label: "fire",
                node: <div>🔥</div>,
                key: "fire",
              },
              {
                label: "wow",
                node: <div>😲</div>,
                key: "wow",
              },
            ]}
            onSelect={setEmoji}
          ></ReactionBarSelector>
        </div>
        <div className="flex-col hidden lg:flex">
          <div
            className={`flex justify-between items-center ${
              collapse && "!justify-center"
            }`}
          >
            <div
              onClick={() => {
                setCollapse(!collapse);
                !collapse && setUnReadMessages([]);
              }}
              className=""
            >
              {collapse ? (
                <ArrowClose className="mx-auto cursor-pointer" />
              ) : (
                <ArrowOpen className="mx-auto cursor-pointer" />
              )}
            </div>
            <div className={`min-w-fit mx-auto ${collapse && "hidden"}`}>
              <ReactionBarSelector
                style={{ paddingRight: "14px" }}
                reactions={[
                  {
                    label: "haha",
                    node: <div>😂</div>,
                    key: "haha",
                  },
                  {
                    label: "love",
                    node: <div>😍</div>,
                    key: "love",
                  },
                  {
                    label: "sad",
                    node: <div>😭</div>,
                    key: "sad",
                  },
                  {
                    label: "angry",
                    node: <div>😡</div>,
                    key: "angry",
                  },
                  {
                    label: "fire",
                    node: <div>🔥</div>,
                    key: "fire",
                  },
                  {
                    label: "wow",
                    node: <div>😲</div>,
                    key: "wow",
                  },
                ]}
                onSelect={setEmoji}
              ></ReactionBarSelector>
            </div>
          </div>
          {!isEmpty(unReadMessages) && collapse && (
            <h2 className="flex items-center justify-center p-1 mt-3 rounded-full aspect-square bg-accent">
              {unReadMessages.length}
            </h2>
          )}

          {collapse && (
            <div className="mt-4 rotate-90">
              <ReactionBarSelector
                style={{ paddingRight: "14px" }}
                reactions={[
                  {
                    label: "haha",
                    node: <div>😂</div>,
                    key: "haha",
                  },
                  {
                    label: "love",
                    node: <div>😍</div>,
                    key: "love",
                  },
                  {
                    label: "sad",
                    node: <div>😭</div>,
                    key: "sad",
                  },
                  {
                    label: "angry",
                    node: <div>😡</div>,
                    key: "angry",
                  },
                  {
                    label: "fire",
                    node: <div>🔥</div>,
                    key: "fire",
                  },
                  {
                    label: "wow",
                    node: <div>😲</div>,
                    key: "wow",
                  },
                ]}
                onSelect={setEmoji}
              ></ReactionBarSelector>
            </div>
          )}
        </div>

        {
          <div
            className={`w-full grow max-w-full overflow-hidden prose mt-4 flex flex-col ${
              collapse && "hidden"
            }`}
          >
            <h1 className={"hidden lg:block"}>Chat</h1>
            <div
              className={
                "w-full grow overflow-y-scroll bg-slate-100 min-h-[100px] rounded-lg p-3 space-y-2 flex flex-col"
              }
            >
              {chats.map((chat) => (
                <div
                  key={chat.id}
                  className={`max-w-[80%]  flex-col px-2 py-1 self-start bg-slate-300 rounded-md flex  ${
                    chat.profileID === currentSession?.user.id &&
                    "!self-end !bg-blue-500 !text-white"
                  }`}
                >
                  <p
                    className={`m-0 text-2xs text-slate-400 ${
                      chat.profileID === currentSession?.user.id &&
                      " !text-white/50"
                    }`}
                  >
                    {find(
                      profilesQuery.data,
                      (value) => value.id === chat.profileID
                    )?.displayname ?? "unknown"}
                  </p>
                  <p className={"m-0"}>{chat.message}</p>
                </div>
              ))}
              <div ref={chatContainerEndRef}></div>
            </div>
            {/* Text field */}
            <form
              onSubmit={handleSubmit}
              className="flex w-full mt-4 space-x-3 min-h-fit"
            >
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
