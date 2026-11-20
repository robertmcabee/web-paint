import { useRef, useState } from 'react'

const colors = [
  '#20252a', '#686e75', '#babfc4', '#ffffff', '#823a42', '#d84545',
  '#e9873e', '#efcb4e', '#387954', '#6bb861', '#36928e', '#56b9cf',
  '#28558d', '#5977d1', '#784f9c', '#d788b2',
]

// Drawing resolution in pixels. CSS controls the canvas size on screen.
const width = 960
const height = 560

function App() {
  const canvasRef = useRef(null)
  const strokeRef = useRef(null)
  // Store the selected tool, color, and pencil size so React can update the controls.
  const [tool, setTool] = useState('pencil')
  const [color, setColor] = useState(colors[0])
  const [pencilSize, setPencilSize] = useState(3)

  function paint(event, stroke, point) {
    const context = event.currentTarget.getContext('2d')
    // Erasing removes pixels and reveals the white canvas background.
    context.globalCompositeOperation = stroke.tool === 'eraser' ? 'destination-out' : 'source-over'
    // Use the slider value for the pencil
    context.lineWidth = stroke.tool === 'eraser' ? 20 : stroke.pencilSize
    context.lineCap = 'round'
    context.strokeStyle = stroke.color
    context.fillStyle = stroke.color
    context.beginPath()

    // This is how you drag and draw a line
    if (stroke.point && (stroke.point.x !== point.x || stroke.point.y !== point.y)) {
      context.moveTo(stroke.point.x, stroke.point.y)
      context.lineTo(point.x, point.y)
      context.stroke()
    } else {
      context.arc(point.x, point.y, context.lineWidth / 2, 0, Math.PI * 2)
      context.fill()
    }

    stroke.point = point
  }

  function getPoint(event) {
    const canvas = canvasRef.current
    const bounds = canvas.getBoundingClientRect()
    return {
      x: (event.clientX - bounds.left) * canvas.width / bounds.width,
      y: (event.clientY - bounds.top) * canvas.height / bounds.height,
    }
  }

  function startStroke(event) {
    if (event.button !== 0 || strokeRef.current) return
    // Keep tracking the stroke even if we leave the canvas
    event.currentTarget.setPointerCapture(event.pointerId)
    const stroke = { pointerId: event.pointerId, tool, color, pencilSize, point: null }
    strokeRef.current = stroke
    paint(event, stroke, getPoint(event))
  }

  function moveStroke(event) {
    // Add a segment only when the pointer that started the stroke moves.
    const stroke = strokeRef.current
    if (stroke?.pointerId === event.pointerId) {
      paint(event, stroke, getPoint(event))
    }
  }

  function endStroke(event) {
    // Clear the stroke on release
    if (strokeRef.current?.pointerId === event.pointerId) {
      strokeRef.current = null
    }
  }

  return (
    <main>
      <h1>Web Paint</h1>

      <div className="editor">
        <div className="tools">
          <button type="button" className={tool === 'pencil' ? 'selected' : ''} onClick={() => setTool('pencil')}>
            <span className="pencil-icon" aria-hidden="true" />
            Pencil
          </button>
          <button type="button" className={tool === 'eraser' ? 'selected' : ''} onClick={() => setTool('eraser')}>
            <span className="eraser-icon" aria-hidden="true" />
            Eraser
          </button>
        </div>

        <div className="workspace">
          <canvas
            ref={canvasRef}
            className={tool}
            width={width}
            height={height}
            onPointerDown={startStroke}
            onPointerMove={moveStroke}
            onPointerUp={(event) => {
              moveStroke(event)
              endStroke(event)
            }}
            onPointerCancel={endStroke}
            onLostPointerCapture={endStroke}
          />
        </div>
      </div>

      <div className="color-bar">
        <label className="color-picker">
          <input type="color" value={color} onChange={(event) => setColor(event.target.value)} />
          Color
        </label>
        <div className="palette" role="group" aria-label="Preset colors">
          {colors.map((swatch) => (
            <button
              key={swatch}
              type="button"
              style={{ backgroundColor: swatch }}
              aria-label={swatch}
              className={color === swatch ? 'selected' : ''}
              onClick={() => setColor(swatch)}
            />
          ))}
        </div>
        <label>
          Pencil size
          <input
            type="range"
            min="1"
            max="30"
            value={pencilSize}
            onChange={(event) => setPencilSize(event.target.valueAsNumber)}
          />
          <span>{pencilSize} px</span>
        </label>
      </div>
    </main>
  )
}

export default App
