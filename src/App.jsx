import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <section className="flex flex-col items-center justify-center gap-8">
        <h1 className="text-3xl font-bold">Get started</h1>
        <div>
          <p>
            Edit <code>src/App.jsx</code> and save to test <code>HMR</code>
          </p>
        </div>
        <button
          type="button"
          className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 cursor-pointer"
          onClick={() => setCount((count) => count + 1)}
        >
          Count is {count}
        </button>
      </section>
    </>
  )
}

export default App
