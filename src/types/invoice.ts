// Italian Government Electronic Invoice Types (Schema_VFSM10.xsd)

export interface DatiTrasmissione {
  IdTrasmittente: {
    IdPaese: string; // IT
    IdCodice: string; // VAT number or fiscal code
  };
  ProgressivoInvio: string;
  FormatoTrasmissione: "FSM10"; // Fixed format for simplified invoices
  CodiceDestinatario?: string;
  PECDestinatario?: string;
}

export interface CedentePrestatore {
  DatiAnagrafici: {
    IdFiscaleIVA: {
      IdPaese: string;
      IdCodice: string; // VAT number
    };
    CodiceFiscale?: string;
    Anagrafica: {
      Denominazione?: string;
      Nome?: string;
      Cognome?: string;
    };
    RegimeFiscale: RegimeFiscale;
  };
  Sede: {
    Indirizzo: string;
    NumeroCivico?: string;
    CAP: string;
    Comune: string;
    Provincia?: string;
    Nazione: string;
  };
}

export interface CessionarioCommittente {
  DatiAnagrafici?: {
    CodiceFiscale?: string;
    Anagrafica: {
      Denominazione?: string;
      Nome?: string;
      Cognome?: string;
    };
  };
  Sede?: {
    Indirizzo: string;
    NumeroCivico?: string;
    CAP: string;
    Comune: string;
    Provincia?: string;
    Nazione: string;
  };
}

export interface DatiGenerali {
  DatiGeneraliDocumento: {
    TipoDocumento: TipoDocumento;
    Divisa: string; // EUR
    Data: string; // YYYY-MM-DD
    Numero: string;
    ImportoTotaleDocumento: number;
  };
}

export interface DettaglioLinee {
  NumeroLinea: number;
  Descrizione: string;
  Quantita?: number;
  PrezzoUnitario?: number;
  PrezzoTotale: number;
  AliquotaIVA: number;
  Natura?: NaturaIVA;
}

export interface DatiRiepilogo {
  AliquotaIVA: number;
  Natura?: NaturaIVA;
  ImponibileImporto: number;
  Imposta: number;
}

export interface FatturaElettronicaHeader {
  DatiTrasmissione: DatiTrasmissione;
  CedentePrestatore: CedentePrestatore;
  CessionarioCommittente?: CessionarioCommittente;
}

export interface FatturaElettronicaBody {
  DatiGenerali: DatiGenerali;
  DatiBeniServizi: {
    DettaglioLinee: DettaglioLinee[];
    DatiRiepilogo: DatiRiepilogo[];
  };
}

export interface FatturaElettronicaSemplificata {
  FatturaElettronicaHeader: FatturaElettronicaHeader;
  FatturaElettronicaBody: FatturaElettronicaBody;
}

// Enums based on XSD
export type TipoDocumento = "TD07" | "TD08" | "TD09"; // Fattura semplificata | Nota credito | Nota debito

export type RegimeFiscale = 
  | "RF01" // Regime ordinario
  | "RF02" // Regime contribuenti minimi
  | "RF04" // Agricoltura e attività connesse
  | "RF05" // Vendita sali e tabacchi
  | "RF06" // Commercio fiammiferi
  | "RF07" // Editoria
  | "RF08" // Gestione servizi telefonia pubblica
  | "RF09" // Rivendita documenti trasporto pubblico
  | "RF10" // Intrattenimenti, giochi
  | "RF11" // Agenzie viaggi e turismo
  | "RF12" // Agriturismo
  | "RF13" // Vendite a domicilio
  | "RF14" // Rivendita beni usati
  | "RF15" // Agenzie vendite all'asta
  | "RF16" // IVA per cassa P.A.
  | "RF17" // IVA per cassa
  | "RF19" // Regime forfettario
  | "RF18"; // Altro

export type NaturaIVA =
  | "N1"  // Escluse ex art. 15
  | "N2"  // Non soggette
  | "N3"  // Non soggette - altri casi
  | "N4"  // Non imponibili
  | "N5"  // Non imponibili - esportazioni
  | "N6"  // Non imponibili - cessioni intracomunitarie
  | "N7"  // Esenti;

// Form state interface
export interface InvoiceFormData {
  // Transmission data
  progressivoInvio: string;
  codiceDestinatario: string;
  pecDestinatario: string;
  
  // Supplier data (Cedente/Prestatore)
  supplierCountry: string;
  supplierVatNumber: string;
  supplierFiscalCode: string;
  supplierCompanyName: string;
  supplierFirstName: string;
  supplierLastName: string;
  supplierRegime: RegimeFiscale;
  supplierAddress: string;
  supplierCivicNumber: string;
  supplierPostalCode: string;
  supplierCity: string;
  supplierProvince: string;
  supplierCountryCode: string;
  
  // Customer data (Cessionario/Committente)
  customerFiscalCode: string;
  customerCompanyName: string;
  customerFirstName: string;
  customerLastName: string;
  customerAddress: string;
  customerCivicNumber: string;
  customerPostalCode: string;
  customerCity: string;
  customerProvince: string;
  customerCountryCode: string;
  
  // Document data
  documentType: TipoDocumento;
  currency: string;
  documentDate: string;
  documentNumber: string;
  
  // Line items
  lineItems: {
    id: string;
    description: string;
    quantity: number;
    unitPrice: number;
    vatRate: number;
    vatNature?: NaturaIVA;
  }[];
}