# NextWave - Herní E-shop

Webová aplikace pro prodej her s uživatelskými účty a systémem odměn.

## Nastavení databáze

Pro správné fungování aplikace je potřeba nastavit Supabase databázi:

1. Přihlaste se do Supabase dashboardu: https://app.supabase.com
2. Vyberte svůj projekt
3. Přejděte do sekce "SQL Editor"
4. Spusťte následující SQL skripty v tomto pořadí:
   - `database/exec_sql_function.sql` - Vytvoří funkci pro spouštění SQL příkazů
   - `database/create_tables.sql` - Vytvoří tabulky profilů a objednávek
   - `database/functions.sql` - Vytvoří funkce pro výpočet úrovně uživatele

## Funkce aplikace

- **Registrace a přihlášení uživatelů**
  - Uživatelé se mohou registrovat pomocí emailu a hesla
  - Při registraci se automaticky vytvoří profil uživatele

- **Uživatelský profil**
  - Zobrazení a úprava osobních údajů
  - Sledování úrovně uživatele
  - Přehled objednávek

- **Systém úrovní**
  - Uživatelé získávají úrovně na základě celkové útraty
  - Každých 1000 Kč = nová úroveň
  - Postup k další úrovni je zobrazen v profilu

- **Objednávky**
  - Objednávky jsou ukládány k příslušnému uživateli
  - Historie objednávek je dostupná v profilu

## Technologie

- React
- TypeScript
- Tailwind CSS
- Supabase (autentizace a databáze)
- Framer Motion (animace)

## Vývojové prostředí

1. Nainstalujte závislosti:
   ```
   npm install
   ```

2. Vytvořte soubor `.env` s následujícím obsahem:
   ```
   VITE_SUPABASE_URL=https://obmyfevuxwslywptvyiw.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ibXlmZXZ1eHdzbHl3cHR2eWl3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYyNDUxNTgsImV4cCI6MjA1MTgyMTE1OH0.oVj7DsoORyVBfcg_NZFStO_S-2p1nCuktPVTYslwGoI
   ```

3. Spusťte vývojový server:
   ```
   npm run dev
   ```

4. Otevřete prohlížeč na adrese: http://localhost:5173
