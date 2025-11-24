import React, { useEffect } from 'react'

const ELFSIGHT_SCRIPT_SRC = 'https://elfsightcdn.com/platform.js'

const ElfsightInstagram = () => {
  useEffect(() => {
    let script = document.querySelector(`script[src="${ELFSIGHT_SCRIPT_SRC}"]`)

    if (!script) {
      script = document.createElement('script')
      script.src = ELFSIGHT_SCRIPT_SRC
      script.async = true
      document.body.appendChild(script)
    }

    return () => {
      // Keep the script loaded if other parts of the app rely on it.
    }
  }, [])

  return (
    <section className="elfsight-instagram-section">
      <div className="elfsight-instagram-inner">
        <div className="elfsight-instagram-title">
          <h2>Follow Simukitaa on Instagram</h2>
          <p>@simukitaa_</p>
        </div>
        {/* Elfsight Instagram Feed | Untitled Instagram Feed */}
        <div
          className="elfsight-app-e77f1613-a9cc-404b-90ca-2fc8e9171925"
          data-elfsight-app-lazy
        ></div>
      </div>
    </section>
  )
}

export default ElfsightInstagram

