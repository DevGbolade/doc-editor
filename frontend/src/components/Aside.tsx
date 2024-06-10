/* eslint-disable @typescript-eslint/no-explicit-any */
import useBearStore from "@/store/state";
import Client from "./Client";

const Aside = ({ username, copyRoomId, leaveRoom }: any) => {
  const { clients } = useBearStore();

  return (
    <div className="aside">
      <div className="asideInner">
        <div className="logo">
          <img className="logoImage" src="/code-sync_1.png" alt="logo" />
        </div>
        <h3>Connected</h3>
        <div className="clientsList">
          {clients.map((client: any, index: any) => (
            <Client
              key={index}
              username={client}
              isCurrentUser={client === username}
            />
          ))}
        </div>
      </div>
      <button className="btn copyBtn" onClick={copyRoomId}>
        Copy ROOM ID
      </button>
      <button className="btn leaveBtn" onClick={leaveRoom}>
        Leave
      </button>
    </div>
  );
};

export default Aside;
