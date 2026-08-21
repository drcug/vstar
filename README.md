# VaaardStar

Clone di **WordStar 4.0** per browser: schermo 80×25, testo bianco su nero, interfaccia in italiano.

## Demo

Apri `index.html` in un browser moderno oppure installa la PWA.

Live: https://drcug.github.io/vstar/index.html

## Funzionalità

- Editor `.cio` (Unicode) con blocchi, cerca/sostituisci, undo e **^QY redo**
- Disco virtuale in **IndexedDB**, backup/ripristino ZIP, barra uso disco
- **Google Drive** (OAuth per utente) — cartella `VaaardStar`, sync selettivo, timestamp ultima sync
- PWA offline, apertura file `.cio`, condivisione testo verso l'app, prompt installazione
- Tastiera touch (SPAZIO/CTRL in basso, `?` sulla riga Z), zoom portrait, suoni retro, schermo intero
- **SpellStar** interattivo (F7 prossimo errore, A ignora parola), **MailMerge** con anteprima
- Versioni file (10/file) con diff al ripristino, template `LETTERA.CIO` / `INVITO.CIO`
- Menu file paginato, hover, menu contestuale (click destro / long press)
- Temi verde/ambra, CRT on/off, scala font, lingua IT/EN, macro testo (F8 / ^QM)
- Doppio tap per selezionare parola in editor

## Comandi rapidi

| Comando | Azione |
|---------|--------|
| F7 | Prossimo errore SpellStar |
| A (con errori) | Ignora parola corrente |
| ^QY | Redo |
| F8 / ^QM | Esegui macro testo |
| PgSu/PgGiu | Pagina elenco file |

## Google Drive (chi pubblica l'app)

1. [Google Cloud Console](https://console.cloud.google.com/) → progetto → Drive API
2. Credenziali OAuth web → origine autorizzata (es. `https://tuodominio.github.io`)
3. Client ID in `google-config.js`

Gli utenti accedono dal menu **Opzioni (V)** con il proprio account.

## Sviluppo

```bash
# Server locale (opzionale)
python3 -m http.server 8080

# Test unitari vs-lib
node -e "require('./js/vs-lib.js').runTests().forEach(r=>console.log(r.ok?'OK':'FAIL',r.name))"
```

Test libreria: apri `tests/test.html`.

Dopo un deploy, se la PWA mostra una versione vecchia: **Ctrl+F5** o disattiva il service worker (cache `vaaardstar-v6`).

## Struttura

| File | Ruolo |
|------|--------|
| `index.html` | App principale |
| `js/vs-lib.js` | Funzioni pure (spell, merge, test) |
| `js/vs-features.js` | Impostazioni, stampa, versioni |
| `js/vs-ext.js` | Temi, i18n, SpellStar, diff, template, PWA install |
| `manifest.webmanifest` | PWA, share target, scorciatoie |
| `sw.js` | Service worker offline |

## Licenza

Progetto omaggio a MicroPro International (1978–1987).
