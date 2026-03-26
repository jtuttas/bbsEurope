# Network BBS Europe — Product Requirements Document (PRD)

**Version:** 1.0  
**Datum:** 25. März 2026  
**Autor:** Jörg (TU), MMBBS Hannover  

---

## 1  Zusammenfassung

**Network BBS Europe** ist eine webbasierte Anwendung zur Vernetzung europäischer Berufsschulen. Netzwerkschulen können Partnerschulen recherchieren, nach Fachrichtungen oder Zielländern filtern und neue Schulen in die Datenbank eintragen. Die Anwendung unterstützt die Planung von Erasmus+-Mobilitäten, Schulpartnerschaften und grenzüberschreitenden Ausbildungsprojekten.

## 2  Ziele und Motivation

Berufsschulen, die internationale Kooperationen aufbauen möchten, stehen vor dem Problem, geeignete Partnerschulen in Europa zu finden, die zum eigenen Fachprofil passen. Bestehende Plattformen (z. B. eTwinning / School Education Gateway) sind oft unübersichtlich oder nicht auf berufliche Bildung zugeschnitten.

Network BBS Europe löst dieses Problem durch eine schlanke, fokussierte Anwendung mit folgenden Zielen:

- Sichtbarkeit herstellen — Partnerschulen können sich mit Profil und Ort präsentieren.
- Passende Partner finden — Filterung nach Fachrichtung, Land und Unterrichtssprache ermöglicht gezieltes Matching.
- Niedrige Einstiegshürde — Für die Anwendung ist das Login einer Netzwerkschule erforderlich. Ein Administrator pflegt die Datenbank, um Qualität und Aktualität sicherzustellen.

## 3  Zielgruppe

Hauptzielgruppe sind europäische Berufsschulen, die an internationalen Kooperationen interessiert sind. Sekundäre Zielgruppen sind Bildungsträger, Erasmus+-Koordinatoren und potenzielle Partner aus Wirtschaft und öffentlicher Hand.

## 4  Datenmodell

Jede Schule wird als Datensatz mit folgenden Attributen erfasst:

| Feld          | Typ      | Pflicht  | Beschreibung                                 |
| ------------- | -------- | -------- | -------------------------------------------- |
| `id`          | String   | auto     | Eindeutige Kennung (automatisch generiert)   |
| `name`        | String   | ja       | Offizieller Name der Schule                  |
| `city`        | String   | ja       | Standort (Stadt)                             |
| `country`     | Enum     | ja       | Land (Auswahl aus 32 europäischen Ländern)   |
| `website`     | String   | nein     | URL der Schulwebsite                         |
| `fields`      | String[] | ja (≥ 1) | Berufliche Fachrichtungen                    |
| `languages`   | String[] | nein     | Unterrichtssprachen                          |
| `description` | String   | nein     | Freitextbeschreibung, Erasmus-Erfahrung etc. |
| `createdAt`   | Date     | auto     | Datum der Eintragung                         |
| `createdBy`   | String     | auto     | Name der Netzwerkschule                        |

### 4.1  Wertelisten

**Länder** (32): Belgien, Bulgarien, Dänemark, Deutschland, Estland, Finnland, Frankreich, Griechenland, Irland, Island, Italien, Kroatien, Lettland, Litauen, Luxemburg, Malta, Niederlande, Norwegen, Österreich, Polen, Portugal, Rumänien, Schweden, Schweiz, Slowakei, Slowenien, Spanien, Tschechien, Türkei, Ungarn, Vereinigtes Königreich, Zypern.

**Fachrichtungen** (9): Elektrotechnik, Gastronomie, Gesundheit, Informatik, Kaufmännisch, Mechatronik, Mediengestaltung, Metalltechnik, Wirtschaft.

**Sprachen** (18): Dänisch, Deutsch, Englisch, Finnisch, Französisch, Griechisch, Italienisch, Kroatisch, Niederländisch, Norwegisch, Polnisch, Portugiesisch, Rumänisch, Schwedisch, Slowakisch, Spanisch, Tschechisch, Türkisch, Ungarisch.

## 5  Funktionale Anforderungen

Alle Credentials oder Parameter werden in einer .env Datei gespeichert, um die Konfiguration zu erleichtern. Die Anwendung besteht aus folgenden Hauptkomponenten:

### 5.1  Schulübersicht (Startseite)

| ID | Anforderung |
|---|---|
| F-01 | Die Startseite zeigt die letzten 6 registrierten Schulen als Karten-Grid an. |
| F-02 | Jede Karte zeigt: Länderflagge (Emoji), Schulname, Stadt/Land, Fachrichtungen (Tags), bis zu 2 Sprachen (Tags) |
| F-03 | Klick auf eine Karte öffnet die Detailansicht. |
| F-04 | Die Anzeige „X von Y Schulen" informiert über den aktuellen Filterstand. |

### 5.2  Suche und Filter

| ID | Anforderung |
|---|---|
| F-10 | Freitextsuche über Schulname, Stadt und Land (live / fuzzy, ohne Submit). |
| F-11 | Dropdown-Filter nach Land (nur Länder mit eingetragenen Schulen). |
| F-12 | Dropdown-Filter nach Fachrichtung (vollständige Liste). |
| F-13 | Dropdown-Filter nach Unterrichtssprache (vollständige Liste). |
| F-14 | Alle Filter sind kombinierbar (UND-Verknüpfung). |
| F-15 | Button „Filter zurücksetzen" setzt alle Filter und die Suche zurück. |

### 5.3  Detailansicht

| ID   | Anforderung                                                                                                                                                           |
| ---- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| F-20 | Overlay/Modal mit vollständigen Schulinformationen.                                                                                                                   |
| F-21 | Anzeige: Länderflagge, Schulname, Stadt/Land, Fachrichtungen, Sprachen, Beschreibung, Eintragungsdatum, Name der Netzwerkschule die den Eintrag durchgeführt hat      |
| F-23 | Button „Bearbeiten" öffnet das Formular mit vorausgefüllten Daten. Dabei können nur Schulen von Netzwerkschulen bearbeitet werden, die den Eintrag durchgeführt haben |
| F-24 | Button „Löschen" entfernt die Schule nach Bestätigung (confirm-Dialog). Dabei können n                                                                                |
| F-25 | Schließen durch ✕-Button oder Klick auf den Overlay-Hintergrund.                                                                                                     |

### 5.4  Schule eintragen / bearbeiten

| ID | Anforderung |
|---|---|
| F-30 | Formular als Overlay/Modal, erreichbar über Header-Button „+ Schule eintragen". |
| F-31 | Pflichtfelder: Schulname, Stadt, Land, mind. 1 Fachrichtung |
| F-32 | Fachrichtungen und Sprachen als Toggle-Chips (Mehrfachauswahl). |
| F-33 | Land als Dropdown mit Flaggen-Emojis. |
| F-34 | Client-seitige Validierung mit Fehlermeldungen unter den jeweiligen Feldern. |
| F-36 | Im Bearbeitungsmodus sind alle Felder mit bestehenden Daten vorausgefüllt. |
| F-37 | Nach Speichern erscheint eine Toast-Benachrichtigung („Neue Schule eingetragen ✓" / „Schule aktualisiert ✓"). |



### 5.6  Datenverwaltung

| ID   | Anforderung                                                                                  |
| ---- | -------------------------------------------------------------------------------------------- |
| F-40 | Daten werden persistent in einer Postgres Datenbank gespeichert.      |


### 5.7 Authentifizierung und Berechtigungen

Die Benutzerverwaltung ist einfach gehalten: Jede Netzwerkschule erhält einen eindeutigen Benutzernamen und Kennwort. Es gibt keine Rollen oder Berechtigungsstufen. Jeder eingeloggte Nutzer kann Schulen eintragen, bearbeiten und löschen. Es findet keine Prüfung statt, ob die Schule tatsächlich existiert oder ob der Nutzer zur angegebenen Netzwerkschule gehört.

Die Vergabe der Kennworte und die Verwaltung der Nutzerkonten erfolgt manuell durch den Administrator. Es gibt keine Selbstregistrierung oder Passwort-Wiederherstellung. Die Authentifizierung erfolgt über ein einfaches Login-Formular, das den Benutzernamen und das Kennwort abfragt. Nach erfolgreichem Login wird der Nutzer auf die Startseite weitergeleitet, wo er Zugriff auf alle Funktionen hat.

Der Administrator loggt sich über den Benutzername „admin" mit einem sicheren Kennwort ein, das in der .env Datei gespeichert ist. Der Administrator hat die Möglichkeit, alle Einträge zu bearbeiten und zu löschen, unabhängig davon, welche Netzwerkschule sie erstellt hat. Es gibt keine Einschränkungen oder Berechtigungsstufen für den Administrator.Er kann Netzwerkschulen hinzufügen, bearbeiten und löschen, um die Datenbank aktuell und relevant zu halten. Die Kennworte für die Netzwerkschulen werden vom Administrator festgelegt und in der Postgres Datenbank gespeichert. Die Benutzer (Netzwerkschulen) können ihre Kennworte über eine Wiederherstellungsfunktion zurücksetzen, die eine E-Mail mit einem Link zum Zurücksetzen des Kennworts sendet. Es gibt keine automatischen Benachrichtigungen oder Erinnerungen für die Nutzer, wenn ihre Einträge bearbeitet oder gelöscht werden.

## 6  Nicht-funktionale Anforderungen

| ID | Anforderung |
|---|---|
| NF-01 | **Responsive Design** — Die Anwendung ist auf Desktop, Tablet und Smartphone nutzbar. Auf kleinen Bildschirmen wechselt das Grid auf eine einspaltige Darstellung, Filter werden vertikal gestapelt. |
| NF-02 | **Performance** — Filterung und Suche arbeiten client-seitig in Echtzeit ohne Latenzen. |
| NF-03 | **Barrierefreiheit** — Formulare verwenden semantische Labels, Fokus-Styles sind sichtbar. |
| NF-04 | **Offline-Fähigkeit** — Die Anwendung funktioniert ohne Serveranbindung; alle Daten liegen lokal. |
| NF-05 | **Sprache** — Die gesamte Benutzeroberfläche ist in deutscher Sprache gehalten. |

## 7  Technologie

Als Technologiestack soll die Anwendung als Python Flask Web-App mit einer Postgres-Datenbank in der Cloud als Backend implementiert werden. Die notwendigen Credentials für den Zugriff auf die Datenbank werden in der .env Datei gespeichert. Das Frontend wird mit React und Tailwind CSS gestaltet, um ein modernes und responsives UI zu gewährleisten. Die Authentifizierung erfolgt über einfache Sessions, und die Daten werden über REST-API-Endpunkte zwischen Frontend und Backend ausgetauscht.

## 9  UI-Designkonzept

**Ästhetische Richtung:** Editorial / Kartografisch — professionell, warm, europäisch.

**Farbschema:**

- Primär: Dunkelgrau (#364152)
- Sekundär: Hellgrau (#637689)
- Akzent: Orange (#f7b800)

**Interaktionen:** Hover-Effekte auf Karten (Schatten, Anhebung, farbige Oberkante), animierte Overlays (Fade-In, Slide-Up), Toast-Benachrichtigungen unten rechts.

## 10 Mehrsprachigkeit

Die Anwendung sollte die Sprachen Deutsch, Englisch, Französisch und Spanisch unterstützen. Alle statischen Texte, Fehlermeldungen und Benachrichtigungen müssen in diesen Sprachen verfügbar sein. Die Sprache kann über ein Dropdown-Menü im Header ausgewählt werden, und die Auswahl wird in einem Cookie gespeichert, um die Präferenz bei zukünftigen Besuchen beizubehalten. Alle dynamischen Inhalte (z. B. Schulbeschreibungen) werden in der Sprache angezeigt, in der sie eingegeben wurden. Es gibt keine automatische Übersetzung von Inhalten, daher sollten Nutzer ermutigt werden, ihre Einträge in einer der unterstützten Sprachen zu verfassen, um die Zugänglichkeit für andere Nutzer zu erhöhen. Die Mehrsprachigkeit trägt dazu bei, die Anwendung für ein breiteres Publikum in Europa zugänglich zu machen und die internationale Zusammenarbeit zwischen Berufsschulen zu fördern.

