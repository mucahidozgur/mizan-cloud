"use client";

import { useEffect, useState, type FormEvent } from "react";

import { api, type Document } from "@/lib/api";

interface NewDocumentModalProps {
  onClose: () => void;
  onCreated: (doc: Document) => void;
}

export default function NewDocumentModal({ onClose, onCreated }: NewDocumentModalProps) {
  const [mode, setMode] = useState<"text" | "pdf">("text");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const doc =
        mode === "pdf" && file
          ? await api.uploadDocument(file, title.trim() || undefined)
          : await api.createDocument({ title, content });
      onCreated(doc);
    } catch (err) {
      setError((err as Error).message);
      setSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-lg bg-white p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-4 text-xl font-semibold">Yeni Doküman</h2>
        <div className="mb-4 flex rounded-md border border-gray-300 p-1">
          <button
            type="button"
            onClick={() => {
              setMode("text");
              setError(null);
            }}
            className={`flex-1 rounded px-3 py-1 text-sm ${
              mode === "text" ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Metin
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("pdf");
              setError(null);
            }}
            className={`flex-1 rounded px-3 py-1 text-sm ${
              mode === "pdf" ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            PDF Yükle
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "pdf" ? (
            <div>
              <label
                htmlFor="doc-pdf"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                PDF dosyası
              </label>
              <input
                id="doc-pdf"
                type="file"
                accept="application/pdf,.pdf"
                required
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              />
              <p className="mt-1 text-xs text-gray-500">
                Başlık boş bırakılırsa dosya adı kullanılır. Taranmış (görüntü) PDF&apos;lerden
                metin çıkarılamaz.
              </p>
              <input
                id="doc-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Başlık (opsiyonel)"
                className="mt-3 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
          ) : (
            <div>
              <label
                htmlFor="doc-title"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Başlık
              </label>
              <input
                id="doc-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              />
              <div className="mt-4">
                <label
                  htmlFor="doc-content"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  İçerik
                </label>
                <textarea
                  id="doc-content"
                  rows={10}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
          )}
          {error && (
            <p className="rounded-md bg-red-50 p-2 text-sm text-red-600">{error}</p>
          )}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm hover:bg-gray-100 disabled:opacity-50"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {submitting ? "Oluşturuluyor..." : "Oluştur"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
