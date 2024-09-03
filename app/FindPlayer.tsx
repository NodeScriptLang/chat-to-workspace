import { makeAssistantToolUI } from "@assistant-ui/react";
 
const FindPlayer = makeAssistantToolUI<any, any>({
  toolName: "findplayer",
  render: ({ part, status }) => {
    return <p>findplayer({JSON.stringify(part.args)})</p>;
  },
});

export default FindPlayer;