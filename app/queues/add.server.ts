import { Queue } from "quirrel/remix";
import superjson from "superjson";

import { emitter } from "~/common/emitter";

export const addQueueEvtName = "addJobQueue";

export default Queue<{ identifier: string }>("queue/add", async (job) => {
  emitter.emit(
    addQueueEvtName,
    superjson.stringify({ identifier: job.identifier })
  );
});
