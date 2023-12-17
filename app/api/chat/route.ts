import { NextRequest, NextResponse } from "next/server";
import { Message as VercelChatMessage, StreamingTextResponse } from "ai";

import { ChatOpenAI } from "langchain/chat_models/openai";
import { BytesOutputParser } from "langchain/schema/output_parser";
import { PromptTemplate } from "langchain/prompts";

import { ChatPromptTemplate } from "langchain/prompts";

export const runtime = "edge";

const formatMessage = (message: VercelChatMessage) => {
  return `${message.role}: ${message.content}`;
};

const statement=`My fellow citizens, crime rates have gone down since our administration took office.
This is a direct result of our new tough-on-crime policies.
Those who oppose our methods simply don't care about the safety of our nation.
Remember, before we came into power, the opposition had decades to fix the problem, and they failed.
It's either our proven approach or a return to the chaos of the past.
We must not let the fearmongers and naysayers dictate our future.`

const fallacies=`
- After This, Therefore Because of This: The speaker assumes that because crime rates dropped after the new policies were introduced, the policies must be the cause of the drop. This ignores other possible factors that could have influenced the crime rate.

- Either-Or Fallacy: The speaker presents only two options: their proven approach or a return to the chaos of the past. This simplifies the situation and ignores other potential solutions or approaches to crime reduction.

- Attack on the Person: The speaker attacks the character of the opponents by suggesting that they "simply don't care about the safety of our nation," instead of addressing the actual merits or flaws of their arguments.

- Straw Man Fallacy: The speaker may be misrepresenting the opposition's position by suggesting that they are fearmongers and naysayers, which simplifies and distorts the actual opposing views for the sake of easier refutation.

- Appeal to Fear: The speaker uses fear ("a return to the chaos of the past") to persuade the audience to accept their policies.
`
//You'll be given the statement and the fallacies it has. Point out what fallacies the user have found, and what fallacies the user have not found.
const TEMPLATE = `
A user will be given a statement from a politician which has five logical fallacies. Then the user will find what logical fallacies the statement has. The user have to find all five logical fallacies.
Give feedback to user that what logical fallacies the user found correctly, and explain what logical fallacies the user failed to find.

Here are the statement and logical fallacies it has.

#statement: 
${statement}

#fallacies the statement has:
${fallacies}

#input:
{input}


Current conversation:
{chat_history}

User: {input}
AI:`;

const chat_template = ChatPromptTemplate.fromMessages(
  [
      ("system", `In this conversation, a user will evaluate the statement made by a politician if it has any logical fallacies.
      You will write a feedback on the user's input whether the user found out all the logical fallacies in the statement.
      
      Here are the statement and logical fallacies it has.
      
      #statement: 
      ${statement}
      
      #fallacies the statement has:
      ${fallacies}
      
      
      #Current conversation:
      {chat_history}
      `),
      ("user", "{input}"),
     
  ]
)
/**
 * This handler initializes and calls a simple chain with a prompt,
 * chat model, and output parser. See the docs for more information:
 *
 * https://js.langchain.com/docs/guides/expression_language/cookbook#prompttemplate--llm--outputparser
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const messages = body.messages ?? [];
    const formattedPreviousMessages = messages.slice(0, -1).map(formatMessage);
    const currentMessageContent = messages[messages.length - 1].content;



    const prompt = PromptTemplate.fromTemplate(TEMPLATE);
    /**
     * You can also try e.g.:
     *
     * import { ChatAnthropic } from "langchain/chat_models/anthropic";
     * const model = new ChatAnthropic({});
     *
     * See a full list of supported models at:
     * https://js.langchain.com/docs/modules/model_io/models/
     */
    const model = new ChatOpenAI({
      temperature: 0.8,
    });
    /**
     * Chat models stream message chunks rather than bytes, so this
     * output parser handles serialization and byte-encoding.
     */
    const outputParser = new BytesOutputParser();

    /**
     * Can also initialize as:
     *
     * import { RunnableSequence } from "langchain/schema/runnable";
     * const chain = RunnableSequence.from([prompt, model, outputParser]);
     */
    const chain = prompt.pipe(model).pipe(outputParser);

    const stream = await chain.stream({
      chat_history: formattedPreviousMessages.join("\n"),
      input: currentMessageContent,
    });

    return new StreamingTextResponse(stream);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
