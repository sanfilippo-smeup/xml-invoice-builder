import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Plus, Trash2, Building2, User, FileText, Calculator } from "lucide-react";
import { InvoiceFormData, TipoDocumento, RegimeFiscale, NaturaIVA } from "@/types/invoice";
import { toast } from "sonner";

// Validation schema based on Italian XSD requirements
const invoiceSchema = z.object({
  // Transmission data
  progressivoInvio: z.string().min(1, "Progressive number is required"),
  codiceDestinatario: z.string().optional(),
  pecDestinatario: z.string().email().optional(),
  
  // Supplier data
  supplierCountry: z.string().length(2, "Country code must be 2 characters"),
  supplierVatNumber: z.string().min(11, "VAT number must be at least 11 characters"),
  supplierFiscalCode: z.string().optional(),
  supplierCompanyName: z.string().optional(),
  supplierFirstName: z.string().optional(),
  supplierLastName: z.string().optional(),
  supplierRegime: z.enum(["RF01", "RF02", "RF04", "RF05", "RF06", "RF07", "RF08", "RF09", "RF10", "RF11", "RF12", "RF13", "RF14", "RF15", "RF16", "RF17", "RF18", "RF19"]),
  supplierAddress: z.string().min(1, "Address is required"),
  supplierCivicNumber: z.string().optional(),
  supplierPostalCode: z.string().min(5, "Postal code is required"),
  supplierCity: z.string().min(1, "City is required"),
  supplierProvince: z.string().optional(),
  supplierCountryCode: z.string().length(2, "Country code must be 2 characters"),
  
  // Customer data
  customerFiscalCode: z.string().optional(),
  customerCompanyName: z.string().optional(),
  customerFirstName: z.string().optional(),
  customerLastName: z.string().optional(),
  customerAddress: z.string().min(1, "Customer address is required"),
  customerCivicNumber: z.string().optional(),
  customerPostalCode: z.string().min(5, "Postal code is required"),
  customerCity: z.string().min(1, "City is required"),
  customerProvince: z.string().optional(),
  customerCountryCode: z.string().length(2, "Country code must be 2 characters"),
  
  // Document data
  documentType: z.enum(["TD07", "TD08", "TD09"]),
  currency: z.string().default("EUR"),
  documentDate: z.string().min(1, "Document date is required"),
  documentNumber: z.string().min(1, "Document number is required"),
  
  // Line items
  lineItems: z.array(z.object({
    id: z.string(),
    description: z.string().min(1, "Description is required"),
    quantity: z.number().min(0.01, "Quantity must be greater than 0"),
    unitPrice: z.number().min(0, "Unit price must be positive"),
    vatRate: z.number().min(0).max(100, "VAT rate must be between 0 and 100"),
    vatNature: z.enum(["N1", "N2", "N3", "N4", "N5", "N6", "N7"]).optional(),
  })).min(1, "At least one line item is required"),
});

const documentTypes: { value: TipoDocumento; label: string }[] = [
  { value: "TD07", label: "Fattura semplificata" },
  { value: "TD08", label: "Nota di credito semplificata" },
  { value: "TD09", label: "Nota di debito semplificata" },
];

const fiscalRegimes: { value: RegimeFiscale; label: string }[] = [
  { value: "RF01", label: "Regime ordinario" },
  { value: "RF02", label: "Regime contribuenti minimi" },
  { value: "RF04", label: "Agricoltura e attività connesse" },
  { value: "RF19", label: "Regime forfettario" },
  { value: "RF18", label: "Altro" },
];

const vatNatures: { value: NaturaIVA; label: string }[] = [
  { value: "N1", label: "Escluse ex art. 15" },
  { value: "N2", label: "Non soggette" },
  { value: "N3", label: "Non soggette - altri casi" },
  { value: "N4", label: "Non imponibili" },
  { value: "N5", label: "Non imponibili - esportazioni" },
  { value: "N6", label: "Non imponibili - cessioni intracomunitarie" },
  { value: "N7", label: "Esenti" },
];

export function InvoiceForm({ onSubmit: customOnSubmit }: { onSubmit?: (data: InvoiceFormData) => void } = {}) {
  const form = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      progressivoInvio: "",
      supplierCountry: "IT",
      supplierCountryCode: "IT",
      customerCountryCode: "IT",
      documentType: "TD07",
      currency: "EUR",
      documentDate: new Date().toISOString().split('T')[0],
      supplierRegime: "RF01",
      lineItems: [
        {
          id: crypto.randomUUID(),
          description: "",
          quantity: 1,
          unitPrice: 0,
          vatRate: 22,
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "lineItems",
  });

  const watchedLineItems = form.watch("lineItems");

  // Calculate totals
  const totals = React.useMemo(() => {
    return watchedLineItems.reduce(
      (acc, item) => {
        const lineTotal = (item.quantity || 0) * (item.unitPrice || 0);
        const vatAmount = lineTotal * ((item.vatRate || 0) / 100);
        
        acc.subtotal += lineTotal;
        acc.vatTotal += vatAmount;
        acc.total += lineTotal + vatAmount;
        
        return acc;
      },
      { subtotal: 0, vatTotal: 0, total: 0 }
    );
  }, [watchedLineItems]);

  const onSubmit = (data: InvoiceFormData) => {
    console.log("Invoice data:", data);
    if (customOnSubmit) {
      customOnSubmit(data);
    } else {
      toast.success("Fattura generata con successo!");
    }
  };

  const addLineItem = () => {
    append({
      id: crypto.randomUUID(),
      description: "",
      quantity: 1,
      unitPrice: 0,
      vatRate: 22,
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Fattura Elettronica Semplificata</h1>
        <p className="text-muted-foreground">Conforme allo Schema VFSM10 dell'Agenzia delle Entrate</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          
          {/* Transmission Data */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Dati di Trasmissione
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="progressivoInvio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Progressivo Invio *</FormLabel>
                    <FormControl>
                      <Input placeholder="es. 00001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="codiceDestinatario"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Codice Destinatario</FormLabel>
                    <FormControl>
                      <Input placeholder="0000000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="pecDestinatario"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>PEC Destinatario</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="destinatario@pec.it" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Supplier Data */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Cedente / Prestatore
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="supplierVatNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Partita IVA *</FormLabel>
                      <FormControl>
                        <Input placeholder="12345678901" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="supplierFiscalCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Codice Fiscale</FormLabel>
                      <FormControl>
                        <Input placeholder="RSSMRA80A01H501Z" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="supplierRegime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Regime Fiscale *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {fiscalRegimes.map((regime) => (
                            <SelectItem key={regime.value} value={regime.value}>
                              {regime.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="supplierCompanyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Denominazione</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome dell'azienda" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-2">
                  <FormField
                    control={form.control}
                    name="supplierFirstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome</FormLabel>
                        <FormControl>
                          <Input placeholder="Mario" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="supplierLastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cognome</FormLabel>
                        <FormControl>
                          <Input placeholder="Rossi" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <FormField
                    control={form.control}
                    name="supplierAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Indirizzo *</FormLabel>
                        <FormControl>
                          <Input placeholder="Via Roma" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="supplierCivicNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Numero Civico</FormLabel>
                      <FormControl>
                        <Input placeholder="123" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="supplierPostalCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CAP *</FormLabel>
                      <FormControl>
                        <Input placeholder="00100" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="supplierCity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Comune *</FormLabel>
                      <FormControl>
                        <Input placeholder="Roma" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="supplierProvince"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Provincia</FormLabel>
                      <FormControl>
                        <Input placeholder="RM" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="supplierCountryCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nazione *</FormLabel>
                      <FormControl>
                        <Input placeholder="IT" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Customer Data */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Cessionario / Committente
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="customerFiscalCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Codice Fiscale</FormLabel>
                      <FormControl>
                        <Input placeholder="RSSMRA80A01H501Z" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="customerCompanyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Denominazione</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome cliente/azienda" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="customerFirstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input placeholder="Mario" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="customerLastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cognome</FormLabel>
                      <FormControl>
                        <Input placeholder="Bianchi" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <FormField
                    control={form.control}
                    name="customerAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Indirizzo *</FormLabel>
                        <FormControl>
                          <Input placeholder="Via Milano" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="customerCivicNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Numero Civico</FormLabel>
                      <FormControl>
                        <Input placeholder="456" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="customerPostalCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CAP *</FormLabel>
                      <FormControl>
                        <Input placeholder="20100" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="customerCity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Comune *</FormLabel>
                      <FormControl>
                        <Input placeholder="Milano" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="customerProvince"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Provincia</FormLabel>
                      <FormControl>
                        <Input placeholder="MI" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="customerCountryCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nazione *</FormLabel>
                      <FormControl>
                        <Input placeholder="IT" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Document Data */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Dati Generali Documento
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <FormField
                control={form.control}
                name="documentType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo Documento *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {documentTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="documentNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Numero *</FormLabel>
                    <FormControl>
                      <Input placeholder="2024/001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="documentDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data *</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Divisa *</FormLabel>
                    <FormControl>
                      <Input placeholder="EUR" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Line Items */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Dettaglio Linee
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {fields.map((field, index) => (
                <div key={field.id} className="space-y-4 p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Linea {index + 1}</h4>
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => remove(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div className="md:col-span-2">
                      <FormField
                        control={form.control}
                        name={`lineItems.${index}.description`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Descrizione *</FormLabel>
                            <FormControl>
                              <Input placeholder="Descrizione bene/servizio" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name={`lineItems.${index}.quantity`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quantità *</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`lineItems.${index}.unitPrice`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Prezzo Unitario *</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`lineItems.${index}.vatRate`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Aliquota IVA *</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name={`lineItems.${index}.vatNature`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Natura IVA</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleziona natura IVA" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {vatNatures.map((nature) => (
                              <SelectItem key={nature.value} value={nature.value}>
                                {nature.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="text-right text-sm text-muted-foreground">
                    Totale linea: €{((watchedLineItems[index]?.quantity || 0) * (watchedLineItems[index]?.unitPrice || 0)).toFixed(2)}
                  </div>
                </div>
              ))}

              <Button type="button" variant="outline" onClick={addLineItem} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Aggiungi Linea
              </Button>
            </CardContent>
          </Card>

          {/* Totals */}
          <Card>
            <CardHeader>
              <CardTitle>Riepilogo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span>Imponibile:</span>
                <span>€{totals.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>IVA:</span>
                <span>€{totals.vatTotal.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold">
                <span>Totale Documento:</span>
                <span>€{totals.total.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline">
              Anteprima XML
            </Button>
            <Button type="submit">
              Genera Fattura
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}