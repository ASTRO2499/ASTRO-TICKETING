import { useEffect } from 'react'

export default function Verify() {
  useEffect(()=>{
    // @ts-ignore global injected by _document
    const Html5Qrcode = (globalThis as any).Html5Qrcode
    if (!Html5Qrcode) return
    const html5QrCode = new Html5Qrcode("reader")
    Html5Qrcode.getCameras().then((cameras: any[])=>{
      if (cameras && cameras.length) {
        const cameraId = cameras[0].id
        html5QrCode.start(cameraId, { fps: 10, qrbox: 250 }, async (decodedText: string)=>{
          const res = await fetch('/api/verify-ticket', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ data: decodedText }) })
          const j = await res.json()
          alert(JSON.stringify(j))
          await html5QrCode.stop()
        })
      }
    }).catch((e: any)=>console.error(e))
    return ()=>{ try { html5QrCode.stop() } catch(e) {} }
  }, [])

  return (
    <div className="max-w-3xl mx-auto">
      <div className="card p-6">
        <h1 className="text-2xl font-medium text-white">Verify Ticket</h1>
  <p className="text-strong">Open camera and scan the ticket QR code below — the API will mark it used.</p>
        <div id="reader" style={{ width: '100%', maxWidth: 640, height: 480 }} className="mt-4 rounded-lg overflow-hidden" />
      </div>
    </div>
  )
}
