# 📘 Japanese Kana Recognition: REST API Integration Guide

This guide describes how to connect your custom frontend applications (such as a Next.js web application) to the local Japanese Hiragana/Katakana AI Recognition API running on `http://localhost:5000`.

---

## 🔌 API Base URL
When running locally, the server is hosted at:
```http
http://localhost:5000
```

---

## 📡 API Endpoints

### 1. Predict Hiragana (`POST /predict/hiragana`)
Runs inference on the MobileNetV2 Hiragana model.

### 2. Predict Katakana (`POST /predict/katakana`)
Runs inference on the MobileNetV2 Katakana model.

### 3. Service Health Check (`GET /health`)
Verifies backend status and model load states.

---

## 📥 Request Formats
The API supports **two request methods** for uploading handwriting drawings:

### Method A: JSON Base64 Payload (Recommended for Canvas Drawing Pads)
Send a POST request with JSON payload containing a base64 encoded image string (e.g. from canvas `.toDataURL()`).

*   **Headers**: `Content-Type: application/json`
*   **Body**:
    ```json
    {
      "image": "data:image/png;base64,iVBORw0KGgoAAAANS..." 
    }
    ```
    *(Note: The API accepts standard base64 data URLs starting with `data:image/...;base64,` or raw base64 data strings).*

### Method B: Multipart Form Upload (Recommended for File Uploaders)
Send a POST request as standard `multipart/form-data` containing the image file.

*   **Body Parameter**: `image` or `file` containing the binary image file.

---

## 📤 Response Schema
On successful inference, the API returns a structured JSON payload:

```json
{
  "success": true,
  "prediction": "あ",
  "romaji": "a",
  "confidence": 0.98452,
  "confidence_percentage": "98.45%",
  "top_predictions": [
    {
      "character": "あ",
      "romaji": "a",
      "confidence": 0.98452,
      "confidence_percentage": "98.45%"
    },
    {
      "character": "お",
      "romaji": "o",
      "confidence": 0.00841,
      "confidence_percentage": "0.84%"
    },
    {
      "character": "め",
      "romaji": "me",
      "confidence": 0.00312,
      "confidence_percentage": "0.31%"
    },
    {
      "character": "ぬ",
      "romaji": "nu",
      "confidence": 0.00198,
      "confidence_percentage": "0.20%"
    },
    {
      "character": "ね",
      "romaji": "ne",
      "confidence": 0.00085,
      "confidence_percentage": "0.09%"
    }
  ]
}
```

---

## 💻 Integration Code Examples

### 1. Next.js / React (Canvas Drawing Integration)

This example shows how to take drawing strokes from a canvas pad, draw it onto a high-contrast white-on-black buffer, and send it to the API:

```typescript
import { useRef, useState } from 'react';

export default function KanaPractice() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [prediction, setPrediction] = useState<string | null>(null);
  const [confidence, setConfidence] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const getPrediction = async (modelType: 'hiragana' | 'katakana') => {
    const drawingCanvas = canvasRef.current;
    if (!drawingCanvas) return;

    setIsLoading(true);

    // 1. Create a 224x224 high-contrast preprocessing canvas
    const preprocessCanvas = document.createElement("canvas");
    preprocessCanvas.width = 224;
    preprocessCanvas.height = 224;
    const pctx = preprocessCanvas.getContext("2d");

    if (pctx) {
      // Fill background black & draw original canvas contents centered
      pctx.fillStyle = "#000000";
      pctx.fillRect(0, 0, 224, 224);
      pctx.drawImage(drawingCanvas, 0, 0, 224, 224);
    }

    // 2. Extract base64 image data URL
    const base64Data = preprocessCanvas.toDataURL("image/png");

    // 3. Post to the local backend API running on port 5000
    try {
      const response = await fetch(`http://localhost:5000/predict/${modelType}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ image: base64Data })
      });

      const data = await response.json();
      if (data.success) {
        setPrediction(data.prediction);
        setConfidence(data.confidence_percentage);
      } else {
        console.error("Prediction Error:", data.error);
      }
    } catch (err) {
      console.error("Failed to connect to local AI API:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <canvas ref={canvasRef} width={400} height={400} className="border" />
      <button onClick={() => getPrediction('hiragana')} disabled={isLoading}>
        {isLoading ? 'Analyzing...' : 'Predict Hiragana'}
      </button>
      {prediction && <p>Result: {prediction} ({confidence})</p>}
    </div>
  );
}
```

---

### 2. Quick Test via cURL

You can quickly query the API from your terminal using cURL:

#### Post a local PNG image:
```bash
curl -X POST \
  -F "image=@/path/to/my_handwritten_char.png" \
  http://localhost:5000/predict/hiragana
```

#### Post a JSON base64 string:
```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"image": "data:image/png;base64,iVBORw0KGgoAAAANSU..."}' \
  http://localhost:5000/predict/katakana
```

---

### 3. Test via Python script

A simple Python snippet to query the server using the `requests` library:

```python
import requests
import base64

url = "http://localhost:5000/predict/hiragana"

# Send via JSON base64
with open("my_drawing.png", "rb") as img_file:
    base64_str = base64.b64encode(img_file.read()).decode('utf-8')
    payload = {"image": f"data:image/png;base64,{base64_str}"}
    
    response = requests.post(url, json=payload)
    print("Response JSON:", response.json())

# Send via Multipart form-data
with open("my_drawing.png", "rb") as img_file:
    files = {"image": img_file}
    
    response = requests.post(url, files=files)
    print("Response JSON:", response.json())
```

---

## ⚙️ Model Input Preprocessing Internals

To guarantee maximum prediction accuracy matching the original `Proyek_viskom_revisi.ipynb` training pipeline:
1. **Size Conversion**: The API automatically downsamples your input image to **224 × 224 pixels** with RGB color depth.
2. **MobileNetV2 Pixel Scaling**: The raw pixel values `[0, 255]` are automatically scaled to the range **`[-1.0, 1.0]`** using the native Keras `preprocess_input` function:
   $$\text{scaled\_pixel} = \frac{\text{pixel}}{127.5} - 1.0$$
3. **Inference**: High-speed, natively-loaded Keras graph predictions.
