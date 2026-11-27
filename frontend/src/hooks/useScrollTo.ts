import { useEffect } from 'react'

/** Scroll to the element with this id (from a deep link), or to the top when there is none. */
export function useScrollTo(id?: string) {
  useEffect(() => {
    if (id) document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    else window.scrollTo({ top: 0 })
  }, [id])
}
