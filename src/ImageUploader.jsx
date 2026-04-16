import { useEffect, useState } from "react";

// update to handle converting other image file types to png
// update to have option to remove background
// what about trick to handle preserving transparency when converting heif to png? (my trick involves hypic)

export default function ImageUploader() {
  const [images, setImages] = useState([]);

  // --- CLEANUP ALL OBJECT URLS ---
  useEffect(() => {
    return () => {
      images.forEach((img) => {
        if (img.original) URL.revokeObjectURL(img.original);
        if (img.processed) URL.revokeObjectURL(img.processed);
      });
    };
  }, [images]);

  // --- HANDLE MULTIPLE FILES ---
  async function handleChange(e) {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const newImages = await Promise.all(
      files.map(async (file) => {
        const originalUrl = URL.createObjectURL(file);

        const img = new Image();
        img.src = originalUrl;

        await new Promise((resolve) => (img.onload = resolve));

        const blob = await trimAndSquareImageToBlob(img);
        const processedUrl = blob ? URL.createObjectURL(blob) : null;

        return {
          processed: processedUrl,
          original: originalUrl,
          name: file.name,
        };
      }),
    );

    setImages((prev) => [...prev, ...newImages]);
  }

  // --- DOWNLOAD ONE ---
  function downloadImage(url, name) {
    const a = document.createElement("a");
    a.href = url;
    a.download = `processed-${name || "image"}.png`;
    a.click();
  }

  const imageInput = (
    <input
      accept="image/png, image/jpeg"
      className="form-control"
      onChange={handleChange}
      type="file"
      multiple
    />
  );

  const maxWidth = 200;

  const renderedImgClassName = "d-flex flex-column align-items-center gap-2";

  const renderOriginal = (img) => (
    <div className={renderedImgClassName}>
      <h4>Original</h4>
      <img style={{ maxWidth }} src={img.original} alt="original" />
    </div>
  );

  const renderProcessed = (img) => (
    <div className={renderedImgClassName}>
      <h4>Processed</h4>
      {img.processed ? (
        <>
          <img style={{ maxWidth }} src={img.processed} alt="processed" />
          <div>
            <button
              onClick={() => downloadImage(img.processed, img.name)}
              className="btn btn-success"
              type="button"
            >
              Download
            </button>
          </div>
        </>
      ) : (
        <p>Empty image</p>
      )}
    </div>
  );

  return (
    <div className="d-flex gap-3 flex-column">
      {/* <h2>Remove empty space around & square your PNGs</h2> */}
      {imageInput}
      {images.map((img, i) => (
        <div className="p-3 border rounded" key={i}>
          <div className="d-flex flex-wrap gap-3 justify-content-around">
            {renderOriginal(img)}
            {renderProcessed(img)}
          </div>
        </div>
      ))}
    </div>
  );
}

// --- SAME PROCESSING FUNCTION ---
async function trimAndSquareImageToBlob(img) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = img.width;
  canvas.height = img.height;
  ctx.drawImage(img, 0, 0);

  const { height, width, data } = ctx.getImageData(
    0,
    0,
    canvas.width,
    canvas.height,
  );

  let bottom = null,
    right = null,
    left = null,
    top = null;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const alpha = data[(y * width + x) * 4 + 3];

      if (alpha !== 0) {
        if (top === null) top = y;
        if (left === null || x < left) left = x;
        if (right === null || x > right) right = x;
        if (bottom === null || y > bottom) bottom = y;
      }
    }
  }

  if (top === null) return null;

  const trimmedWidth = right - left + 1;
  const trimmedHeight = bottom - top + 1;

  const size = Math.max(trimmedWidth, trimmedHeight);

  const squareCanvas = document.createElement("canvas");
  const squareCtx = squareCanvas.getContext("2d");

  squareCanvas.width = size;
  squareCanvas.height = size;

  const offsetX = Math.floor((size - trimmedWidth) / 2);
  const offsetY = Math.floor((size - trimmedHeight) / 2);

  squareCtx.drawImage(
    canvas,
    left,
    top,
    trimmedWidth,
    trimmedHeight,
    offsetX,
    offsetY,
    trimmedWidth,
    trimmedHeight,
  );

  return new Promise((resolve) => {
    squareCanvas.toBlob((blob) => resolve(blob), "image/png");
  });
}
