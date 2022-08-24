import * as React from 'react'

export function Footer() {
  return (
    <footer className="flex flex-col items-center justify-between gap-2 text-sm md:gap-4 md:flex-row text-secondary">
      <div className="inline-flex items-center gap-1 text-sm">
        <span>EarlyDAO</span>
      </div>
      <span>2022</span>
    </footer>
  )
}
