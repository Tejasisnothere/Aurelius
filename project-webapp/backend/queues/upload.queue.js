const queue = [];
let active = 0;

const MAX_CONCURRENT_JOBS = 3;

export const enqueueUploadJob = (jobFn) => {
  queue.push(jobFn);
  runNext();
};

const runNext = async () => {
  if (active >= MAX_CONCURRENT_JOBS) return;
  if (queue.length === 0) return;

  const job = queue.shift();
  active++;

  try {
    await job();
  } catch (err) {
    console.error("Upload queue job failed:", err);
  } finally {
    active--;
    runNext();
  }
};