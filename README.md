# VaaardStar

Clone di **WordStar 4.0** per browser: schermo 80×25, testo bianco su nero, interfaccia in italiano.

## Demo

Apri `index.html` in un browser moderno oppure installa la PWA.

## Funzionalità

- Editor `.cio` (Unicode) con blocchi, cerca/sostituisci, undo
- Disco virtuale in **IndexedDB**, backup/ripristino ZIP
- **Google Drive** (OAuth per utente) — cartella `VaaardStar`
- PWA offline, apertura file `.cio`, condivisione testo verso l'app
- Tastiera touch, zoom portrait, suoni retro, schermo intero
- **SpellStar** (ortografia base), **MailMerge** (modello + CSV)
- Versioni file, sync Drive selettivo, stampa anteprima

## Google Drive (chi pubblica l'app)

1. [Google Cloud Console](https://console.cloud.google.com/) → progetto → Drive API
2. Credenziali OAuth web → origine autorizzata (es. `https://tuodominio.github.io`)
3. Client ID in `google-config.js`

Gli utenti accedono dal menu **Opzioni (V)** con il proprio account.

## Sviluppo

```bash
# Server locale (opzionale)
python3 -m http.server 8080
```

Test libreria: apri `tests/test.html`.

## Struttura

| File | Ruolo |
|------|--------|
| `index.html` | App principale |
| `js/vs-lib.js` | Funzioni pure (spell, merge, test) |
| `js/vs-features.js` | Impostazioni, stampa, versioni |
| `manifest.webmanifest` | PWA, share target, scorciatoie |
| `sw.js` | Service worker |

## Licenza

Progetto omaggio a MicroPro International (1978–1987).
