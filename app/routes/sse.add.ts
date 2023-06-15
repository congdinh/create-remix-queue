import type { LoaderFunction } from "@remix-run/node";
import { eventStream } from "remix-utils";

import { emitter } from "~/common/emitter";
import { addQueueEvtName } from "~/queues/add.server";

export const loader: LoaderFunction = ({ request }) => {
  // event stream setup
  return eventStream(request.signal, (send) => {
    // listener handler
    const listener = (data: string) => {
      // data should be serialized
      send({ data });
    };

    // event listener itself
    emitter.on(addQueueEvtName, listener);

    // cleanup
    return () => {
      emitter.off(addQueueEvtName, listener);
    };
  });
};
