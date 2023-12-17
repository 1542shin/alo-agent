import { ChatWindow } from "@/components/ChatWindow";

export default function Home() {
  const InfoCard = (
    <div className="p-4 md:p-8 rounded bg-[#25252d] w-full max-h-[85%] ">
      <h1 className="text-3xl md:text-4xl mb-4">
      ❗ Do you trust your judgement? ❗
      </h1>
      <ul>
      <li className=" text-l md:block">
      ►
          <span className="ml-2">
          Try evaluating the hypothetical statement from a politician.
          </span>
        </li>

        <li className=" text-l md:block">
      ►
          <span className="ml-2">
          Find out how sharp your reasoning really is!          </span>
        </li>
      
        <p className="p-4 md:p-8 rounded bg-[#000000]">My fellow citizens, crime rates have gone down since our administration took office. <br/>This is a direct result of our new tough-on-crime policies. <br/>Those who oppose our methods simply do not care about the safety of our nation.<br/> Remember, before we came into power, the opposition had decades to fix the problem, and they failed. <br/>It is either our proven approach or a return to the chaos of the past. <br/>We must not let the fearmongers and naysayers dictate our future.
</p>

       
        <li className=" text-l md:block">
        👇
          <span className="ml-2">
          Type in the logical fallacies you found in the text box below!           </span>
        </li>

      </ul>
    </div>
  );
  return (
    <div>
      {InfoCard}
      <br/>
    <ChatWindow
      endpoint="api/chat"
      emoji="🏴‍☠️"
      titleText="Patchy the Chatty Pirate"
      placeholder="Type here!"
      emptyStateComponent={InfoCard}
    ></ChatWindow>
    </div>
  );
}
