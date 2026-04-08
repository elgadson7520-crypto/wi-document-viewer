"use client";

import { useEffect, useState, useCallback } from "react";
import {
  X,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Download,
} from "lucide-react";
import { DriveFileInfo } from "@/lib/google-drive";

interface DocumentViewerProps {
  file: DriveFileInfo | null;
  onClose: () => void;
}

export default function DocumentViewer({ file, onClose }: DocumentViewerProps) {
  const [zoom, setZoom] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (file) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [file, handleKeyDown]);

  if (!file) return null;

  const fileUrl = `/api/drive/file/${file.id}`;
  const isPdf =
    file.mimeType.includes("pdf") ||
    file.mimeType.includes("document") ||
    file.mimeType.includes("presentation") ||
    file.mimeType.includes("drawing");
  const isImage = file.mimeType.startsWith("image/");

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      document.documentElement.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`relative bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden ${
          isFullscreen ? "w-screen h-screen rounded-none" : "w-[90vw] h-[90vh]"
        }`}
      >
        {/* Toolbar */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-packers-green text-white flex-shrink-0">
          <h3 className="text-sm font-medium truncate max-w-md">
            {file.name}
          </h3>

          <div className="flex items-center gap-2">
            {isImage && (
              <>
                <button
                  onClick={() => setZoom(Math.max(25, zoom - 25))}
                  className="p-1.5 hover:bg-packers-green-light rounded transition-colors"
                  title="Zoom out"
                >
                  <ZoomOut size={16} />
                </button>
                <span className="text-xs min-w-[3rem] text-center">
                  {zoom}%
                </span>
                <button
                  onClick={() => setZoom(Math.min(300, zoom + 25))}
                  className="p-1.5 hover:bg-packers-green-light rounded transition-colors"
                  title="Zoom in"
                >
                  <ZoomIn size={16} />
                </button>
              </>
            )}

            <button
              onClick={toggleFullscreen}
              className="p-1.5 hover:bg-packers-green-light rounded transition-colors"
              title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
            >
              {isFullscreen ? (
                <Minimize2 size={16} />
              ) : (
                <Maximize2 size={16} />
              )}
            </button>

            <a
              href={fileUrl}
              download={file.name}
              className="p-1.5 hover:bg-packers-green-light rounded transition-colors"
              title="Download"
            >
              <Download size={16} />
            </a>

            <button
              onClick={onClose}
              className="p-1.5 hover:bg-red-500 rounded transition-colors ml-1"
              title="Close (Esc)"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto bg-gray-100 flex items-center justify-center">
          {isPdf ? (
            <iframe
              src={fileUrl}
              className="pdf-viewer-container w-full h-full"
              title={file.name}
            />
          ) : isImage ? (
            <div className="p-4 overflow-auto w-full h-full flex items-center justify-center">
              <img
                src={fileUrl}
                alt={file.name}
                className="max-w-full transition-transform duration-200"
                style={{
                  transform: `scale(${zoom / 100})`,
                  objectFit: "contain",
                }}
              />
            </div>
          ) : (
            <div className="text-center p-8">
              <p className="text-gray-500 mb-4">
                This file type cannot be previewed directly.
              </p>
              <a
                href={fileUrl}
                download={file.name}
                className="inline-flex items-center gap-2 px-6 py-3 bg-packers-green text-white rounded-lg hover:bg-packers-green-light transition-colors"
              >
                <Download size={18} />
                Download File
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
