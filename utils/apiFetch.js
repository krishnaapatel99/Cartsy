export async function apiFetch(url, options = {}, retry = true) {
  try {
    const res = await fetch(url, {
      ...options,
      cache: "no-store", // important for App Router
    });

    if (!res.ok) throw new Error("Backend unavailable");

    return res.json();
  } catch (err) {
    // retry once (cold start / paused backend)
    if (retry) {
      await new Promise((r) => setTimeout(r, 2000));
      return apiFetch(url, options, false);
    }
    throw err;
  }
}
