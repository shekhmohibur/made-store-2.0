"use client";

import { X } from "lucide-react";

export function Drawer({ isOpen, onClose, title, subtitle, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/30 backdrop-blur-xs flex justify-end animate-fadeIn">
      <div className="w-full max-w-md bg-[#FAF9F6] h-full flex flex-col border-l border-stone-200 shadow-2xl">
        <div className="flex items-center justify-between bg-white border-b border-stone-200 px-6 py-4">
          <div>
            <h3 className="font-semibold text-sm tracking-widest uppercase text-stone-900">
              {title}
            </h3>
            {subtitle && <p className="text-xs text-stone-500 mt-0.5">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="flex-1 flex flex-col p-6 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}