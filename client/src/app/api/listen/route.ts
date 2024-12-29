import { NextRequest, NextResponse } from "next/server";
import { listenToQueue } from "../rabbitmq";

export async function GET(request: NextRequest) {
  const username = request.nextUrl.searchParams.get("username");

  if (!username) {
    return new NextResponse("Username is required", { status: 400 });
  }

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const channel = await listenToQueue(username);
        channel.consume(username, (msg) => {
          if (msg !== null) {
            const content = msg.content.toString();
            controller.enqueue(`data: ${JSON.stringify(content)}\n\n`);
            channel.ack(msg);
          }
        });
      } catch (error) {
        console.error("Error in listen route:", error);
        controller.error(error);
      }
    },
    cancel() {
      console.log("Client closed the connection");
    },
  });

  return new NextResponse(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
