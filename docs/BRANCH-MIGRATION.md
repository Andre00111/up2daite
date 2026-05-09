# Branch-Migration: Todo-App wird main

## Übersicht
- `main` (up2daite) → wird zu `archive/up2daite`
- `feature/todo-app` → wird zu neuem `main`

## Schritt 1: Alten main Branch archivieren

```bash
# Zum alten main wechseln
git checkout main

# Umbenennen zu archive/up2daite
git branch -m main archive/up2daite

# Archiv-Branch zu GitLab pushen
git push gitlab archive/up2daite
```

## Schritt 2: Todo-App zum neuen main machen

```bash
# Zum todo-app Branch wechseln
git checkout feature/todo-app

# Umbenennen zu main
git branch -m feature/todo-app main

# Neuen main zu GitLab pushen (force weil Historie anders)
git push gitlab main --force
```

## Schritt 3: Alten main auf GitLab löschen (optional)

```bash
# Remote-Referenz zum alten main löschen
git push gitlab --delete main
```

## Schritt 4: Tracking aktualisieren

```bash
# Lokalen main mit Remote verbinden
git branch --set-upstream-to=gitlab/main main
```

## Ergebnis
- `main` = Todo-App (aktiv)
- `archive/up2daite` = Alte Anwendung (archiviert)

## Zurück zur alten App wechseln (falls nötig)

```bash
git checkout archive/up2daite
```
