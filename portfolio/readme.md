# Portfolio David Kukic

Statische Website (HTML, CSS, JavaScript), automatisch geprüft und veröffentlicht mit GitHub Actions.

## Was die Pipeline macht (`.github/workflows/ci-cd.yml`)

1. **test:** HTML-Validierung, Dateinamen (klein, ohne Leerzeichen und Umlaute), alle Links und Bilder vorhanden
2. **lighthouse:** Bericht zu Barrierefreiheit, SEO, Best Practices und Performance (blockiert nichts)
3. **deploy:** Veröffentlichung auf GitHub Pages, nur bei Änderungen auf `main`

## Einrichten

1. Repository auf GitHub anlegen und den Inhalt dieses Ordners hochladen (inklusive des versteckten Ordners `.github`).
2. Auf GitHub: Settings, Pages, bei "Source" den Eintrag **GitHub Actions** wählen.
3. Ab dem nächsten Push auf `main` läuft die Pipeline. Die Adresse steht danach im Tab "Actions" beim Schritt deploy.

## Lokal prüfen

    npm install
    npm test
    npm run serve
