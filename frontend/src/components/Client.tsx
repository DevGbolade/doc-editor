import Avatar from "react-avatar";

const Client = ({
  username = "User",
  isCurrentUser = false,
}: {
  username?: string;
  isCurrentUser?: boolean;
}) => {
  return (
    <div className="client flex flex-col">
      <Avatar name={username} size={"30"} round="100%" />
      <span className="userName">{isCurrentUser && "Me"}</span>
    </div>
  );
};

export default Client;
