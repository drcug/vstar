/* Configura Google Drive per VaaardStar
 *
 * Chi pubblica l'app configura UNA VOLTA il Client ID OAuth.
 * Ogni utente poi accede con il PROPRIO account Google dal menu
 * Opzioni (V) → "Accedi con Google".
 *
 * 1. Apri https://console.cloud.google.com/
 * 2. Crea un progetto e abilita "Google Drive API"
 * 3. Credenziali → ID client OAuth 2.0 → Applicazione web
 * 4. Origini JavaScript autorizzate: URL della tua app (es. https://drcug.github.io)
 * 5. Incolla il Client ID qui sotto
 */
window.VAAARDSTAR_GOOGLE = {
  clientId: ''
};
