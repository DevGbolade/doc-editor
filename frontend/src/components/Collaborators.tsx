import useBearStore from "@/store/state";
import Client from "./Client";

export default function Collaborators() {
  const { clients } = useBearStore();
  return (
    <>
      <div className="flex -space-x-1 overflow-hidden">
        {clients.map((user: string) => (
          <Client username={user} />
        ))}
      </div>
    </>
  );
}
