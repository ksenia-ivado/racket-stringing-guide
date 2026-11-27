import { useEffect, useState } from 'react'
import { getHealth } from '../api/client'

type Status = 'checking' | 'online' | 'offline'

/** Small indicator showing whether the Python backend is reachable. */
export function ApiStatus() {
  const [status, setStatus] = useState<Status>('checking')

  useEffect(() => {
    const controller = new AbortController()
    getHealth(controller.signal)
      .then(() => setStatus('online'))
      .catch((err) => {
        if (!controller.signal.aborted) {
          console.warn(err)
          setStatus('offline')
        }
      })
    return () => controller.abort()
  }, [])

  return (
    <span className={`api-status api-status--${status}`}>
      <span className="api-status__dot" aria-hidden="true" />
      API {status}
    </span>
  )
}
