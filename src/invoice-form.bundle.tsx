// Main entry point for standalone invoice form component
// This file can be built and distributed as a standalone library

import React from "react";
import { createRoot } from "react-dom/client";
import { StandaloneInvoiceForm } from "./components/StandaloneInvoiceForm";
import type { InvoiceFormData } from "./types/invoice";

// Global interface for browser usage
declare global {
  interface Window {
    InvoiceForm: {
      render: (container: HTMLElement, options?: InvoiceFormOptions) => void;
      unmount: (container: HTMLElement) => void;
    };
  }
}

export interface InvoiceFormOptions {
  onSubmit?: (data: InvoiceFormData) => void;
  className?: string;
}

// Browser API for vanilla JS usage
const InvoiceFormAPI = {
  render: (container: HTMLElement, options: InvoiceFormOptions = {}) => {
    const root = createRoot(container);
    root.render(
      <StandaloneInvoiceForm 
        onSubmit={options.onSubmit}
        className={options.className}
      />
    );
    // Store root instance for cleanup
    (container as any).__invoiceFormRoot = root;
  },
  
  unmount: (container: HTMLElement) => {
    const root = (container as any).__invoiceFormRoot;
    if (root) {
      root.unmount();
      delete (container as any).__invoiceFormRoot;
    }
  }
};

// Make available globally for vanilla JS
if (typeof window !== 'undefined') {
  window.InvoiceForm = InvoiceFormAPI;
}

// ES Module exports for framework usage
export { StandaloneInvoiceForm as default };
export { StandaloneInvoiceForm, InvoiceForm } from "./components/StandaloneInvoiceForm";
export type { InvoiceFormData, TipoDocumento, RegimeFiscale, NaturaIVA } from "./types/invoice";
export type { InvoiceFormOptions as StandaloneInvoiceFormOptions };