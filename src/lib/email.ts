import { createClient } from '@supabase/supabase-js';
import { toast } from 'react-hot-toast';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const RESEND_API_KEY = import.meta.env.VITE_RESEND_API_KEY;

// Rozšířená validace API klíče
const validateApiKey = (apiKey: string | undefined): boolean => {
  if (!apiKey) return false;
  // Základní kontrola formátu API klíče Resend
  const resendApiKeyPattern = /^re_[a-zA-Z0-9]+$/;
  return resendApiKeyPattern.test(apiKey);
};

// Před inicializací zkontrolujeme API klíče
if (!supabaseUrl || !supabaseAnonKey || !validateApiKey(RESEND_API_KEY)) {
  console.error('Chybějící nebo neplatné API klíče:', {
    supabaseUrl: !!supabaseUrl,
    supabaseAnonKey: !!supabaseAnonKey,
    resendApiKey: validateApiKey(RESEND_API_KEY)
  });
  throw new Error('Chybí požadované platné proměnné prostředí pro odesílání emailů');
}

interface InvoiceEmailParams {
  userEmail: string;
  orderId: string | number;
  totalAmount: number;
  items: Array<{
    id: string;
    title: string;
    price: number;
  }>;
}

interface InvoiceData {
  userEmail: string;
  orderId: string;
  totalAmount: number;
  items: Array<{
    id: string;
    price: number;
  }>;
}

export const sendInvoiceEmail = async ({
  userEmail, 
  orderId, 
  totalAmount, 
  items
}: InvoiceEmailParams) => {
  // Rozšířená validace vstupních parametrů
  if (!userEmail || !userEmail.includes('@')) {
    throw new Error('Neplatná emailová adresa');
  }

  if (totalAmount <= 0) {
    throw new Error('Neplatná částka faktury');
  }

  if (!items || items.length === 0) {
    throw new Error('Žádné položky k fakturaci');
  }

  try {
    console.log('Příprava odeslání emailu:', { 
      userEmail, 
      orderId, 
      totalAmount, 
      itemCount: items.length 
    });

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: 'Herní Obchod <noreply@vasedomena.cz>',
        to: [userEmail],
        subject: `Faktura č. ${orderId} - Nákup her`,
        html: `
          <h1>Faktura č. ${orderId}</h1>
          <p>Děkujeme za váš nákup!</p>
          <table border="1" cellpadding="5" style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background-color: #f2f2f2;">
                <th>Hra</th>
                <th>Cena</th>
              </tr>
            </thead>
            <tbody>
              ${items.map(item => `
                <tr>
                  <td style="text-align: left;">${item.title}</td>
                  <td style="text-align: right;">${item.price.toFixed(2)} Kč</td>
                </tr>
              `).join('')}
              <tr style="font-weight: bold; background-color: #f2f2f2;">
                <td style="text-align: left;">Celkem</td>
                <td style="text-align: right;">${totalAmount.toFixed(2)} Kč</td>
              </tr>
            </tbody>
          </table>
          <p style="margin-top: 20px; font-size: 12px; color: #666;">
            Tento doklad byl vygenerován automaticky. Není určen k daňovým účelům.
          </p>
        `
      })
    });

    // Detailní zpracování odpovědi
    const result = await response.json();

    if (!response.ok) {
      console.error('Chyba API Resend:', {
        status: response.status,
        message: result.message,
        details: result
      });
      throw new Error(result.message || 'Nepodařilo se odeslat email');
    }

    console.log('Email faktury úspěšně odeslán:', result);
    return result;
  } catch (error) {
    console.error('Kritická chyba při odesílání emailu:', error);
    
    // Detailní diagnostika chyby
    if (error instanceof Error) {
      if (error.message.includes('fetch')) {
        toast.error('Problém s připojením k emailové službě');
      } else if (error.message.includes('Authorization')) {
        toast.error('Neplatný API klíč pro odesílání emailů');
      } else {
        toast.error('Nepodařilo se odeslat fakturu');
      }
    }

    throw error;
  }
};

export async function sendFictiveInvoiceEmail(invoiceData: InvoiceData): Promise<boolean> {
  try {
    // Simulace generování faktury
    const invoiceHtml = generateInvoiceHtml(invoiceData);
    
    // Simulace odeslání emailu
    console.log('Odesílání faktury:', {
      to: invoiceData.userEmail,
      subject: `Faktura č. ${invoiceData.orderId}`,
      body: invoiceHtml
    });

    // Simulace úspěšného odeslání
    toast.success('Faktura byla vygenerována a odeslána na váš email.');
    
    return true;
  } catch (error) {
    console.error('Chyba při generování faktury:', error);
    toast.error('Nepodařilo se vygenerovat fakturu.');
    return false;
  }
}

function generateInvoiceHtml(data: InvoiceData): string {
  const formattedDate = new Date().toLocaleDateString('cs-CZ');
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 14);

  const itemsHtml = data.items.map(item => `
    <tr>
      <td style="border: 1px solid #ddd; padding: 8px;">${item.id}</td>
      <td style="border: 1px solid #ddd; padding: 8px;">${item.price.toFixed(2)} Kč</td>
    </tr>
  `).join('');

  return `
    <!DOCTYPE html>
    <html>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1>Faktura č. ${data.orderId}</h1>
      <p>Datum vystavení: ${formattedDate}</p>
      <p>Datum splatnosti: ${dueDate.toLocaleDateString('cs-CZ')}</p>
      
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr>
            <th style="border: 1px solid #ddd; padding: 8px;">ID produktu</th>
            <th style="border: 1px solid #ddd; padding: 8px;">Cena</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>
      
      <h2>Celková částka: ${data.totalAmount.toFixed(2)} Kč</h2>
      
      <p>Děkujeme za váš nákup!</p>
    </body>
    </html>
  `;
}
