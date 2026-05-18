"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useI18n } from "@/lib/I18nProvider";

export default function ImageUpload({
  onChange,
  disabled = false,
}: {
  onChange: (f: File | null) => void;
  disabled?: boolean;
}) {
  const { t } = useI18n();
  const [preview, setPreview] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0] ?? null;
      if (file) {
        setPreview((current) => {
          if (current) URL.revokeObjectURL(current);
          return URL.createObjectURL(file);
        });
        onChange(file);
      } else {
        setPreview((current) => {
          if (current) URL.revokeObjectURL(current);
          return null;
        });
        onChange(null);
      }
    },
    [onChange],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxFiles: 1,
    disabled,
  });

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  return (
    <div>
      <div
        {...getRootProps()}
        className={`dropzone cursor-pointer rounded-md border-2 border-dashed p-4 transition active:scale-[0.99] ${isDragActive ? "border-[var(--color-primary)] bg-[var(--color-primary-glow)]" : "border-[var(--color-border)] bg-[var(--color-bg-input)] hover:bg-[var(--color-bg-card)]"} ${disabled ? "pointer-events-none opacity-50" : ""}`}
      >
        <input {...getInputProps()} />
        <p className="text-sm font-medium text-[var(--color-text)]">
          {t("image.uploadTitle")}
        </p>
        <p className="mt-1 text-xs leading-5 text-[var(--color-text-muted)]">
          {t("image.uploadHint")}
        </p>
      </div>
      {preview && (
        <div className="mt-3 flex items-center gap-3 rounded-md border border-[var(--color-border)] bg-[var(--color-bg-card)] p-2">
          <img
            src={preview}
            alt={t("image.previewAlt")}
            className="h-20 w-24 rounded-md object-cover"
          />
          <button
            type="button"
            className="rounded-md px-2 py-1 text-sm font-medium text-[var(--color-primary)] transition hover:bg-[var(--color-primary-glow)] active:scale-[0.98]"
            onClick={() => {
              setPreview((current) => {
                if (current) URL.revokeObjectURL(current);
                return null;
              });
              onChange(null);
            }}
            disabled={disabled}
          >
            {t("image.remove")}
          </button>
        </div>
      )}
    </div>
  );
}
