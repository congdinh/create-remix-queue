import type { V2_MetaFunction } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { useEffect, useState } from "react";
import { useEventSource } from "remix-utils";
import cuid from "cuid";
import superjson from "superjson";
import dayjs from "dayjs";

import addQueue from "~/queues/add.server";

export const meta: V2_MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export const action = async () => {
  const currentTime = dayjs();
  const newTime = currentTime.add(5, "second");

  await addQueue.enqueue({ identifier: `Hello at ${cuid()}` }, { runAt: newTime.toDate() });

  return null;
};

export default function Index() {
  const [messages, setMessages] = useState<{ identifier: string }[]>([]);
  const lastMessage = useEventSource("/sse/add");

  useEffect(() => {
    setMessages((datums) => {
      if (lastMessage !== null) {
        return datums.concat(superjson.parse(lastMessage));
      }
      return datums;
    });
  }, [lastMessage]);

  return (
    <div>
      <h2>Server-sent events and Quirrel</h2>

      <ul>
        {messages.map((message, messageIdx) => (
          <li key={messageIdx}>{message.identifier}</li>
        ))}
      </ul>

      <Form method="POST">
        <button type="submit">Add New Job</button>
      </Form>
    </div>
  );
}