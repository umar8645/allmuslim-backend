export async function withRetry(fn, options = {}) {
  const {
    retries = 3,
    delay = 2000,
    factor = 2,
    onFail = () => {}
  } = options;

  let attempt = 0;
  let wait = delay;

  while (attempt < retries) {
    try {
      return await fn();
    } catch (err) {
      attempt++;
      onFail(err, attempt);

      if (attempt >= retries) throw err;

      await new Promise(r => setTimeout(r, wait));
      wait *= factor;
    }
  }
}