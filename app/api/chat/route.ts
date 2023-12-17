import { NextRequest, NextResponse } from "next/server";
import { Message as VercelChatMessage, StreamingTextResponse } from "ai";

import { ChatOpenAI } from "langchain/chat_models/openai";
import { BytesOutputParser } from "langchain/schema/output_parser";
import { PromptTemplate } from "langchain/prompts";

export const runtime = "edge";

const formatMessage = (message: VercelChatMessage) => {
  return `${message.role}: ${message.content}`;
};

const statement="My fellow citizens, crime rates have gone down since our administration took office. This is a direct result of our new tough-on-crime policies. Those who oppose our methods simply don't care about the safety of our nation. Remember, before we came into power, the opposition had decades to fix the problem, and they failed. It's either our proven approach or a return to the chaos of the past. We must not let the fearmongers and naysayers dictate our future. It's time to stay the course for a safer tomorrow."

const fallacies=`1.The politician claims that the decrease in crime rates is a direct result of their policies, assuming a cause-and-effect relationship without providing concrete evidence that their policies are the cause of the decrease in crime.

2. The statement presents the situation as having only two alternatives: the politician's approach or a return to chaos. This ignores other possible alternatives.

3. The politician attacks the character of the opponents by suggesting they don't care about the safety of the nation, rather than addressing the opponents' arguments or policies.

4. The politician uses fearmongering by suggesting that not following their policies would lead to chaos, playing on the audience's fears to win support.

5. The politician may be misrepresenting the opposition's position by suggesting they had "decades to fix the problem" and did nothing, which may not accurately reflect the opposition's efforts or policies.

6. Implicit in the statement is the idea that because their administration's policies are currently in place and crime has gone down, the policies must be correct and should be continued. This suggests that the popularity of the policy is an indicator of its correctness.
`

const TEMPLATE = `
A user will be given a statement below from a politician. The statement has multiple logical fallacies. The user will evaluate if the statement is valid or not. Then you will evaluate if the user have found logical fallicies from the statement.

#Here's the statement: 
${statement}

#The statement has following logical fallacies:
${fallacies}

Current conversation:
{chat_history}

User: {input}
AI:`;

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
