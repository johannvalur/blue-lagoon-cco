export async function readNdjsonStream(
  res: Response,
  onEvent: (event: unknown) => void,
): Promise<void> {
  if (!res.body) throw new Error("Response has no body");
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";
    for (const line of lines) {
      if (!line.trim()) continue;
      try {
        onEvent(JSON.parse(line));
      } catch {
        // ignore malformed line
      }
    }
  }

  if (buffer.trim()) {
    try {
      onEvent(JSON.parse(buffer));
    } catch {
      // ignore
    }
  }
}
