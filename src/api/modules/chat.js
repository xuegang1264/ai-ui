export async function askStream(data, onChunk) {
  const token = localStorage.getItem('token')
  const res = await fetch('/ai/ask/stream', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({
      query: data.question,
      current_layout: data.current_layout || '[]',
    }),
  })

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`)
  }

  const reader = res.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n')
    buffer = lines.pop() || ''

    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed) continue

      // SSE 格式: data: {...} 或 data: [DONE]
      if (trimmed.startsWith('data:')) {
        const payload = trimmed.slice(5).trim()
        if (payload === '[DONE]') continue
        try {
          const parsed = JSON.parse(payload)
          // 后端返回格式: { type: 'reasoning'|'message', delta: '...' }
          // 过滤掉 thinking，只保留正式回答
          if (parsed.type === 'reasoning') {
            continue
          }
          const text = parsed.delta || parsed.result || parsed.content || parsed.data || ''
          onChunk(text)
        } catch {
          // 不是 JSON，当作纯文本
          onChunk(payload)
        }
      } else {
        // 纯文本流，直接输出
        onChunk({ type: 'content', text: trimmed })
      }
    }
  }

  if (buffer.trim()) {
    onChunk(buffer.trim())
  }
}
