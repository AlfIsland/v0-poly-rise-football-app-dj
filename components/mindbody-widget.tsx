"use client"

import { useEffect } from "react"

export function MindBodyWidget() {
  useEffect(() => {
    // Load Healcode script if not already loaded
    if (!document.querySelector('script[src*="healcode.js"]')) {
      const script = document.createElement("script")
      script.src = "https://widgets.mindbodyonline.com/javascripts/healcode.js"
      script.type = "text/javascript"
      script.async = true
      document.body.appendChild(script)
    }
  }, [])

  return (
    <div className="mindbody-widget-container">
      {/* @ts-expect-error - Healcode custom element */}
      <healcode-widget
        data-type="enrollments"
        data-widget-partner="object"
        data-widget-id="42113230a30c"
        data-widget-version="0"
      />
    </div>
  )
}
