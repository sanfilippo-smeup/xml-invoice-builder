# Italian Invoice Form Component

A standalone React component for creating Italian government-compliant electronic invoices based on the Schema_VFSM10.xsd specification.

## Features

- ✅ Full compliance with Italian VFSM10 XSD schema
- ✅ Complete form validation using Zod
- ✅ Dynamic line items with automatic calculations
- ✅ Professional government-portal inspired design
- ✅ Responsive layout for all devices
- ✅ TypeScript support
- ✅ Framework agnostic (React, Vue, Angular, Vanilla JS)

## Usage

### React/Framework Integration

```jsx
import { StandaloneInvoiceForm } from './invoice-form.bundle';

function App() {
  const handleSubmit = (invoiceData) => {
    console.log('Invoice submitted:', invoiceData);
    // Process the invoice data
  };

  return (
    <StandaloneInvoiceForm 
      onSubmit={handleSubmit}
      className="custom-styling"
    />
  );
}
```

### Vanilla JavaScript

```html
<!DOCTYPE html>
<html>
<head>
  <script src="./invoice-form.bundle.js"></script>
</head>
<body>
  <div id="invoice-container"></div>
  
  <script>
    const container = document.getElementById('invoice-container');
    
    window.InvoiceForm.render(container, {
      onSubmit: (data) => {
        console.log('Invoice data:', data);
        // Send to your backend
      },
      className: 'my-custom-class'
    });
  </script>
</body>
</html>
```

### Vue.js Integration

```vue
<template>
  <div ref="invoiceContainer"></div>
</template>

<script>
export default {
  mounted() {
    window.InvoiceForm.render(this.$refs.invoiceContainer, {
      onSubmit: this.handleInvoiceSubmit
    });
  },
  beforeUnmount() {
    window.InvoiceForm.unmount(this.$refs.invoiceContainer);
  },
  methods: {
    handleInvoiceSubmit(data) {
      // Handle invoice submission
    }
  }
}
</script>
```

### Angular Integration

```typescript
import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-invoice',
  template: '<div #invoiceContainer></div>'
})
export class InvoiceComponent implements AfterViewInit, OnDestroy {
  @ViewChild('invoiceContainer', { static: true }) container!: ElementRef;

  ngAfterViewInit() {
    (window as any).InvoiceForm.render(this.container.nativeElement, {
      onSubmit: (data: any) => {
        console.log('Invoice submitted:', data);
      }
    });
  }

  ngOnDestroy() {
    (window as any).InvoiceForm.unmount(this.container.nativeElement);
  }
}
```

## Data Structure

The component returns data structured according to the Italian VFSM10 schema:

```typescript
interface InvoiceFormData {
  // Transmission data
  progressivoInvio: string;
  codiceDestinatario?: string;
  pecDestinatario?: string;
  
  // Supplier data (Cedente/Prestatore)
  supplierVatNumber: string;
  supplierFiscalCode?: string;
  supplierCompanyName?: string;
  supplierFirstName?: string;
  supplierLastName?: string;
  supplierRegime: RegimeFiscale;
  supplierAddress: string;
  supplierCity: string;
  supplierPostalCode: string;
  supplierCountryCode: string;
  
  // Customer data (Cessionario/Committente)
  customerAddress: string;
  customerCity: string;
  customerPostalCode: string;
  customerCountryCode: string;
  
  // Document data
  documentType: TipoDocumento; // "TD07" | "TD08" | "TD09"
  currency: string;
  documentDate: string;
  documentNumber: string;
  
  // Line items
  lineItems: Array<{
    id: string;
    description: string;
    quantity: number;
    unitPrice: number;
    vatRate: number;
    vatNature?: NaturaIVA;
  }>;
}
```

## Building for Distribution

To build this component for distribution:

1. Install dependencies:
   ```bash
   npm install
   ```

2. Build the bundle:
   ```bash
   npm run build
   ```

3. The built files will be in the `dist/` directory

## Compliance

This component is fully compliant with:
- Schema_VFSM10.xsd (Italian simplified electronic invoice format)
- Agenzia delle Entrate specifications
- Italian fiscal regulations for electronic invoicing

## License

[Your License Here]