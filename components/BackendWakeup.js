"use client";

export default function BackendWakeup({ onRetry }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-sm text-center shadow-lg">
        <h2 className="text-lg font-semibold mb-2">
          Waking up backend…
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          This project uses free-tier hosting.
          Please wait a moment and retry.
        </p>
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-black text-white rounded"
        >
          Retry
        </button>
      </div>
    </div>
  );
}
