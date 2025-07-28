import React from "react";
import { InvoiceForm } from "./InvoiceForm";
import "../index.css";

// Standalone wrapper component that includes all necessary styles and dependencies
export const StandaloneInvoiceForm: React.FC<{
  onSubmit?: (data: any) => void;
  className?: string;
}> = ({ onSubmit, className }) => {
  return (
    <div className={className}>
      <InvoiceForm onSubmit={onSubmit} />
    </div>
  );
};

// Export for use in other applications
export default StandaloneInvoiceForm;
export { InvoiceForm } from "./InvoiceForm";
export type { InvoiceFormData, TipoDocumento, RegimeFiscale, NaturaIVA } from "../types/invoice";