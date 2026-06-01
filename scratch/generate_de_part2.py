import json
import os

data = {
  "de": {
    "combine-single-page": {
      "title": "Zu einer Einzelseite zusammenfügen",
      "metaDescription": "Verbinden Sie PDF-Seiten zu einer einzigen, kontinuierlichen Seite. Erstellen Sie scrollbare Einzelseiten-Dokumente.",
      "keywords": [
        "Seiten zusammenfügen",
        "Einzelseiten-PDF",
        "Seiten verbinden",
        "kontinuierliches Scrollen"
      ],
      "description": "\n      <p>„Zu einer Einzelseite zusammenfügen“ verbindet alle PDF-Seiten zu einer einzigen, kontinuierlichen Seite. Erstellen Sie scrollbare Dokumente, die sich perfekt für die Web-Anzeige oder das kontinuierliche Lesen eignen.</p>\n      <p>Die Seiten werden vertikal mit anpassbarem Abstand zusammengefügt. Das Ergebnis ist eine einzige, lange Seite, die den gesamten Inhalt enthält.</p>\n      <p>Die gesamte Verarbeitung erfolgt lokal in Ihrem Browser, wodurch die Vertraulichkeit Ihrer Dokumente gewährleistet bleibt.</p>\n    ",
      "howToUse": [
        {
          "step": 1,
          "title": "PDF hochladen",
          "description": "Ziehen Sie Ihre PDF-Datei per Drag-and-Drop hierher oder klicken Sie, um sie auszuwählen."
        },
        {
          "step": 2,
          "title": "Abstand festlegen",
          "description": "Wählen Sie den Abstand zwischen den zusammenzufügenden Seiten."
        },
        {
          "step": 3,
          "title": "Zusammenfügen und herunterladen",
          "description": "Klicken Sie auf „Zusammenfügen“, um die einseitige PDF zu erstellen."
        }
      ],
      "useCases": [
        {
          "title": "Web-Dokumente",
          "description": "Erstellen Sie scrollbare PDFs zur Einbettung in Websites.",
          "icon": "globe"
        },
        {
          "title": "Kontinuierliches Lesen",
          "description": "Konvertieren Sie paginierte Dokumente in ein kontinuierliches Scrollformat.",
          "icon": "scroll"
        },
        {
          "title": "Langformatige Inhalte",
          "description": "Verbinden Sie Seiten für ein nahtloses Lesen von langen Inhalten.",
          "icon": "file-text"
        }
      ],
      "faq": [
        {
          "question": "Gibt es ein Seitenlimit?",
          "answer": "Sehr lange Dokumente können durch den Arbeitsspeicher des Browsers begrenzt sein."
        },
        {
          "question": "Kann ich Trennlinien zwischen den Seiten hinzufügen?",
          "answer": "Ja, Sie können Abstände oder Linien zwischen den Originalseiten hinzufügen."
        },
        {
          "question": "Ist dies für den Druck geeignet?",
          "answer": "Das Ergebnis ist optimal für die Bildschirmanzeige; verwenden Sie für Drucklayouts die N-Up-Funktion (Mehrseitendruck)."
        }
      ]
    },
    "view-metadata": {
      "title": "Metadaten anzeigen",
      "metaDescription": "Zeigen Sie die PDF-Dokumenteigenschaften an. Sehen Sie Autor, Titel, Daten und andere Metadaten.",
      "keywords": [
        "PDF-Metadaten",
        "Dokumenteigenschaften",
        "PDF-Informationen",
        "PDF-Details anzeigen"
      ],
      "description": "\n      <p>„Metadaten anzeigen“ stellt alle Dokumenteigenschaften und Metadaten Ihrer PDF-Dateien dar. Sehen Sie Autor, Titel, Thema, Schlüsselwörter, Erstellungsdatum, Änderungsdatum und mehr.</p>\n      <p>Nützlich für die Überprüfung von Dokumenten, das Überprüfen von Dateiinformationen oder das Verifizieren der Echtheit von Dokumenten.</p>\n      <p>Die gesamte Anzeige erfolgt in Ihrem Browser, sodass Ihre Dokumente privat bleiben.</p>\n    ",
      "howToUse": [
        {
          "step": 1,
          "title": "PDF hochladen",
          "description": "Ziehen Sie Ihre PDF-Datei per Drag-and-Drop hierher oder klicken Sie, um sie auszuwählen."
        },
        {
          "step": 2,
          "title": "Eigenschaften anzeigen",
          "description": "Sehen Sie alle Metadaten in einem übersichtlichen Format dargestellt."
        },
        {
          "step": 3,
          "title": "Bei Bedarf exportieren",
          "description": "Exportieren Sie Metadaten optional als JSON."
        }
      ],
      "useCases": [
        {
          "title": "Dokumentenprüfung",
          "description": "Überprüfen Sie Dokumenteigenschaften auf Compliance (Richtlinienkonformität).",
          "icon": "clipboard-check"
        },
        {
          "title": "Echtheit verifizieren",
          "description": "Überprüfen Sie Erstellungsdaten und Autoreninformationen.",
          "icon": "shield"
        },
        {
          "title": "Dateiinformationen",
          "description": "Erhalten Sie detaillierte Informationen über PDF-Dateien.",
          "icon": "info"
        }
      ],
      "faq": [
        {
          "question": "Welche Metadaten werden angezeigt?",
          "answer": "Titel, Autor, Thema, Schlüsselwörter, Ersteller, PDF-Erstellungsprogramm, Daten und PDF-Version."
        },
        {
          "question": "Kann ich Metadaten hier bearbeiten?",
          "answer": "Verwenden Sie das Werkzeug „Metadaten bearbeiten“, um Dokumenteigenschaften zu ändern."
        },
        {
          "question": "Sind XMP-Metadaten enthalten?",
          "answer": "Ja, es werden sowohl Standard- als auch XMP-Metadaten angezeigt."
        }
      ]
    },
    "pdf-to-zip": {
      "title": "PDFs in ZIP packen",
      "metaDescription": "Packen Sie mehrere PDFs in ein ZIP-Archiv. PDF-Dateien komprimieren und bündeln.",
      "keywords": [
        "PDF in ZIP",
        "PDFs komprimieren",
        "PDFs bündeln",
        "PDFs archivieren"
      ],
      "description": "\n      <p>„PDFs in ZIP“ packt mehrere PDF-Dateien in ein einziges ZIP-Archiv. Komprimieren und bündeln Sie Ihre PDFs für eine einfachere Weitergabe, Speicherung oder Sicherung.</p>\n      <p>Das Tool erstellt ein komprimiertes Archiv, das alle Ihre PDF-Dateien enthält, was die Gesamtgröße reduziert und die Dateiverwaltung vereinfacht.</p>\n      <p>Die gesamte Verarbeitung erfolgt in Ihrem Browser, wodurch Ihre Dateien privat bleiben.</p>\n    ",
      "howToUse": [
        {
          "step": 1,
          "title": "PDFs hochladen",
          "description": "Ziehen mehrere PDF-Dateien per Drag-and-Drop hierher oder klicken Sie, um sie auszuwählen."
        },
        {
          "step": 2,
          "title": "Archiv konfigurieren",
          "description": "Legen Sie optional den Archivnamen und die Komprimierungsstufe fest."
        },
        {
          "step": 3,
          "title": "Erstellen und herunterladen",
          "description": "Klicken Sie auf „Erstellen“, um das ZIP-Archiv zu generieren."
        }
      ],
      "useCases": [
        {
          "title": "Dateifreigabe",
          "description": "Bündeln Sie mehrere PDFs für eine einfachere Freigabe.",
          "icon": "share-2"
        },
        {
          "title": "Backup-Erstellung",
          "description": "Erstellen Sie komprimierte Backups von PDF-Sammlungen.",
          "icon": "archive"
        },
        {
          "title": "E-Mail-Anhänge",
          "description": "Kombinieren Sie PDFs zu einem einzigen Anhang für E-Mails.",
          "icon": "mail"
        }
      ],
      "faq": [
        {
          "question": "Wie stark wird komprimiert?",
          "answer": "Die ZIP-Komprimierung reduziert die Gesamtgröße in der Regel um 10–30 %."
        },
        {
          "question": "Gibt es ein Dateilimit?",
          "answer": "Sie können bis zu 100 PDFs in ein einziges Archiv aufnehmen."
        },
        {
          "question": "Kann ich ein Passwort festlegen?",
          "answer": "Das Erstellen von passwortgeschützten ZIP-Dateien wird derzeit nicht unterstützt."
        }
      ]
    },
    "posterize-pdf": {
      "title": "PDF als Poster aufteilen",
      "metaDescription": "Teilen Sie große PDF-Seiten in druckbare Kacheln auf. Erstellen Sie Poster aus PDF-Seiten.",
      "keywords": [
        "PDF kacheln",
        "PDF als Poster",
        "Großformatdruck",
        "PDF-Kachelung"
      ],
      "description": "\n      <p>„PDF als Poster aufteilen“ unterteilt große PDF-Seiten in kleinere Kacheln, die auf Standardpapier gedruckt und zu Postern zusammengesetzt werden können. Perfekt für den Druck von großen Diagrammen, Karten oder Kunstwerken.</p>\n      <p>Konfigurieren Sie die Rastergröße und die Überlappung für eine einfache Montage. Das Tool berechnet automatisch die Kachelabmessungen für Ihre Ziel-Ausgabegröße.</p>\n      <p>Die gesamte Verarbeitung erfolgt in Ihrem Browser, wodurch Ihre Dokumente privat bleiben.</p>\n    ",
      "howToUse": [
        {
          "step": 1,
          "title": "PDF hochladen",
          "description": "Ziehen Sie Ihr Großformat-PDF per Drag-and-Drop hierher oder klicken Sie, um es auszuwählen."
        },
        {
          "step": 2,
          "title": "Kacheln konfigurieren",
          "description": "Stellen Sie Rastergröße, Überlappung und Ausgabepapierformat ein."
        },
        {
          "step": 3,
          "title": "Erstellen und herunterladen",
          "description": "Klicken Sie auf „Erstellen“, um druckbare Kacheln zu generieren."
        }
      ],
      "useCases": [
        {
          "title": "Posterdruck",
          "description": "Drucken Sie große Poster auf Standardpapier.",
          "icon": "maximize-2"
        },
        {
          "title": "Kartendruck",
          "description": "Drucken Sie große Karten in Abschnitten für die spätere Montage.",
          "icon": "map"
        },
        {
          "title": "Reproduktion von Kunstwerken",
          "description": "Erstellen Sie Großdrucke aus PDF-Kunstwerken.",
          "icon": "image"
        }
      ],
      "faq": [
        {
          "question": "Welche Überlappung sollte ich verwenden?",
          "answer": "Eine Überlappung von 10–20 mm wird empfohlen, um die Ausrichtung beim Zusammenfügen zu erleichtern."
        },
        {
          "question": "Kann ich Schnittmarken hinzufügen?",
          "answer": "Ja, Schnittmarken können hinzugefügt werden, um das Schneiden und Ausrichten zu erleichtern."
        },
        {
          "question": "Welche Papierformate werden unterstützt?",
          "answer": "Unterstützt werden A4, Letter, A3 und benutzerdefinierte Formate."
        }
      ]
    },
    "page-dimensions": {
      "title": "Seitenabmessungen",
      "metaDescription": "Analysieren Sie PDF-Seitengrößen. Zeigen Sie die Abmessungen aller Seiten in Ihrem Dokument an.",
      "keywords": [
        "PDF-Seitengröße",
        "Seitenabmessungen",
        "PDF-Maße",
        "Dokumentgröße"
      ],
      "description": "\n      <p>„Seitenabmessungen“ analysiert und zeigt die Größe jeder einzelnen Seite in Ihrem PDF-Dokument an. Zeigen Sie Abmessungen in verschiedenen Einheiten (Zoll, mm, Punkte) an und identifizieren Sie Seiten mit Nicht-Standardgrößen.</p>\n      <p>Nützlich für die Druckvorbereitung, Dokumentenanalyse oder das Aufspüren uneinheitlicher Seitenformate.</p>\n      <p>Die gesamte Analyse erfolgt in Ihrem Browser, sodass Ihre Dokumente privat bleiben.</p>\n    ",
      "howToUse": [
        {
          "step": 1,
          "title": "PDF hochladen",
          "description": "Ziehen Sie Ihre PDF-Datei per Drag-and-Drop hierher oder klicken Sie, um sie auszuwählen."
        },
        {
          "step": 2,
          "title": "Abmessungen anzeigen",
          "description": "Sehen Sie die Seitenformate für alle Seiten angezeigt."
        },
        {
          "step": 3,
          "title": "Bericht exportieren",
          "description": "Exportieren Sie die Abmessungen optional als JSON."
        }
      ],
      "useCases": [
        {
          "title": "Druckplanung",
          "description": "Überprüfen Sie die Seitenformate vor dem Drucken.",
          "icon": "printer"
        },
        {
          "title": "Dokumentenanalyse",
          "description": "Identifizieren Sie Seiten mit ungewöhnlichen Abmessungen.",
          "icon": "search"
        },
        {
          "title": "Qualitätskontrolle",
          "description": "Stellen Sie sicher, dass die Seitenformate den Spezifikationen entsprechen.",
          "icon": "check-circle"
        }
      ],
      "faq": [
        {
          "question": "Welche Einheiten sind verfügbar?",
          "answer": "Zoll, Millimeter, Zentimeter und Punkte."
        },
        {
          "question": "Wird die Ausrichtung angezeigt?",
          "answer": "Ja, Hoch- oder Querformat wird angegeben."
        },
        {
          "question": "Kann ich uneinheitliche Größen korrigieren?",
          "answer": "Verwenden Sie das Werkzeug „Seitenformat anpassen“, um die Abmessungen zu vereinheitlichen."
        }
      ]
    },
    "remove-restrictions": {
      "title": "Einschränkungen aufheben",
      "metaDescription": "Heben Sie PDF-Einschränkungen auf. Schalten Sie Druck-, Kopier- und Bearbeitungsberechtigungen frei.",
      "keywords": [
        "PDF-Einschränkungen aufheben",
        "PDF entsperren",
        "PDF-Berechtigungen",
        "PDF-Sperre aufheben"
      ],
      "description": "\n      <p>„Einschränkungen aufheben“ entsperrt PDFs, die über Berechtigungseinschränkungen verfügen, die das Drucken, Kopieren oder Bearbeiten verhindern. Dieses Tool entfernt die Einschränkungen durch das Berechtigungspasswort (Besitzerpasswort), während der Dokumenteninhalt erhalten bleibt.</p>\n      <p>Hinweis: Dieses Tool kann keine Benutzerpasswörter (Öffnen-Passwörter) entfernen, die das Öffnen des Dokuments verhindern. Verwenden Sie für passwortgeschützte Dateien „PDF entschlüsseln“.</p>\n      <p>Die gesamte Verarbeitung erfolgt in Ihrem Browser, wodurch Ihre Dokumente privat bleiben.</p>\n    ",
      "howToUse": [
        {
          "step": 1,
          "title": "Eingeschränktes PDF hochladen",
          "description": "Ziehen Sie Ihr eingeschränktes PDF per Drag-and-Drop hierher oder klicken Sie, um es auszuwählen."
        },
        {
          "step": 2,
          "title": "Einschränkungen aufheben",
          "description": "Klicken Sie auf „Aufheben“, um das Dokument freizugeben."
        },
        {
          "step": 3,
          "title": "Herunterladen",
          "description": "Laden Sie das uneingeschränkte PDF herunter."
        }
      ],
      "useCases": [
        {
          "title": "Drucken aktivieren",
          "description": "Geben Sie PDFs frei, bei denen das Drucken gesperrt ist.",
          "icon": "printer"
        },
        {
          "title": "Kopieren aktivieren",
          "description": "Erlauben Sie die Textauswahl und das Kopieren.",
          "icon": "copy"
        },
        {
          "title": "Bearbeitung aktivieren",
          "description": "Entfernen Sie Einschränkungen bei der Dokumentbearbeitung.",
          "icon": "edit"
        }
      ],
      "faq": [
        {
          "question": "Ist das legal?",
          "answer": "Das Entfernen von Einschränkungen aus Dokumenten, die Sie besitzen oder für die Sie Rechte besitzen, ist im Allgemeinen legal."
        },
        {
          "question": "Kann es das Kennwort zum Öffnen entfernen?",
          "answer": "Nein, verwenden Sie „PDF entschlüsseln“ für Dokumente mit einem Öffnen-Passwort."
        },
        {
          "question": "Wird der Inhalt beeinträchtigt?",
          "answer": "Nein, es werden nur die Einschränkungen entfernt; der Inhalt bleibt unverändert."
        }
      ]
    },
    "sanitize-pdf": {
      "title": "PDF bereinigen",
      "metaDescription": "Entfernen Sie versteckte Daten aus PDFs. Bereinigen Sie Metadaten, Skripte und sensible Informationen.",
      "keywords": [
        "PDF bereinigen",
        "PDF säubern",
        "versteckte Daten entfernen",
        "PDF-Datenschutz"
      ],
      "description": "\n      <p>„PDF bereinigen“ entfernt versteckte Daten und potenziell sensible Informationen aus Ihren Dokumenten. Bereinigen Sie Metadaten, eingebettete Skripte, Anhänge, Kommentare und andere versteckte Inhalte.</p>\n      <p>Unerlässlich für die Vorbereitung von Dokumenten zur öffentlichen Weitergabe oder wenn Datenschutz eine Rolle spielt.</p>\n      <p>Die gesamte Bereinigung erfolgt in Ihrem Browser, sodass Ihre Dokumente privat bleiben.</p>\n    ",
      "howToUse": [
        {
          "step": 1,
          "title": "PDF hochladen",
          "description": "Ziehen Sie Ihre PDF-Datei per Drag-and-Drop hierher oder klicken Sie, um sie auszuwählen."
        },
        {
          "step": 2,
          "title": "Auswählen, was entfernt werden soll",
          "description": "Wählen Sie aus, welche Arten von versteckten Daten entfernt werden sollen."
        },
        {
          "step": 3,
          "title": "Bereinigen und herunterladen",
          "description": "Klicken Sie auf „Bereinigen“, um das PDF zu säubern und herunterzuladen."
        }
      ],
      "useCases": [
        {
          "title": "Öffentliche Freigabe",
          "description": "Bereiten Sie Dokumente für die öffentliche Weitergabe vor.",
          "icon": "globe"
        },
        {
          "title": "Datenschutz",
          "description": "Entfernen Sie persönliche Daten vor der Weitergabe.",
          "icon": "shield"
        },
        {
          "title": "Sicherheits-Compliance",
          "description": "Erfüllen Sie Sicherheitsanforderungen bei der Handhabung von Dokumenten.",
          "icon": "check-circle"
        }
      ],
      "faq": [
        {
          "question": "Welche versteckten Daten werden entfernt?",
          "answer": "Metadaten, Skripte, Anhänge, Kommentare, Formulardaten und ausgeblendete Ebenen."
        },
        {
          "question": "Wird der sichtbare Inhalt beeinträchtigt?",
          "answer": "Nein, es werden nur die versteckten Daten entfernt; der sichtbare Inhalt bleibt erhalten."
        },
        {
          "question": "Ist dies umkehrbar?",
          "answer": "Nein, entfernte Daten können nicht wiederhergestellt werden. Behalten Sie eine Sicherungskopie des Originals."
        }
      ]
    },
    "find-and-redact": {
      "title": "Suchen und schwärzen",
      "metaDescription": "Suchen und schwärzen Sie Text über alle Seiten einer PDF hinweg. Schwärzen Sie sensible Informationen wie Kontonummern, Namen und mehr im Stapelverfahren.",
      "keywords": [
        "PDF schwärzen",
        "suchen und schwärzen",
        "Stapelweise schwärzen",
        "Text entfernen",
        "PDF-Zensur",
        "sensible Daten verbergen"
      ],
      "description": "\n      <p>Mit „Suchen und schwärzen“ können Sie nach bestimmtem Text, Nummern oder Mustern auf allen Seiten Ihrer PDF suchen und alle übereinstimmenden Vorkommen auf einmal schwärzen. Perfekt zum Entfernen sensibler Informationen wie Kontonummern, Namen, Adressen oder anderen vertraulichen Daten.</p>\n      <p>Überprüfen Sie alle Übereinstimmungen in der Vorschau, bevor Sie die Schwärzungen anwenden, und wählen Sie gezielt aus, welche Vorkommen geschwärzt werden sollen. Unterstützt die Suche mit Beachtung der Groß-/Kleinschreibung, Ganzwortsuche und reguläre Ausdrücke (Regex) für erweiterte Mustersuchen.</p>\n      <p>Die gesamte Verarbeitung erfolgt in Ihrem Browser, wodurch Ihre Dokumente privat und sicher bleiben.</p>\n    ",
      "howToUse": [
        {
          "step": 1,
          "title": "PDF hochladen",
          "description": "Ziehen Sie Ihre PDF-Datei per Drag-and-Drop hierher oder klicken Sie, um sie auszuwählen."
        },
        {
          "step": 2,
          "title": "Nach Text suchen",
          "description": "Geben Sie den Text, die Nummer oder das Regex-Muster ein, das Sie suchen und schwärzen möchten."
        },
        {
          "step": 3,
          "title": "Prüfen und auswählen",
          "description": "Prüfen Sie alle Übereinstimmungen in der Vorschau und wählen Sie die zu schwärzenden Vorkommen aus."
        },
        {
          "step": 4,
          "title": "Schwärzung anwenden",
          "description": "Passen Sie das Erscheinungsbild der Schwärzung an und wenden Sie sie auf die ausgewählten Übereinstimmungen an."
        }
      ],
      "useCases": [
        {
          "title": "Datenschutz-Compliance",
          "description": "Schwärzen Sie personenbezogene Daten zur Einhaltung der DSGVO (GDPR), HIPAA oder anderer Vorschriften.",
          "icon": "shield"
        },
        {
          "title": "Rechtsdokumente",
          "description": "Entfernen Sie vertrauliche Daten aus juristischen Dokumenten, bevor Sie diese teilen.",
          "icon": "scale"
        },
        {
          "title": "Finanzunterlagen",
          "description": "Schwärzen Sie Kontonummern, Sozialversicherungsnummern oder Finanzdaten auf Abrechnungen.",
          "icon": "credit-card"
        }
      ],
      "faq": [
        {
          "question": "Ist die Schwärzung dauerhaft?",
          "answer": "Ja, die Schwärzung löscht den darunter liegenden Text unwiderruflich. Der ursprüngliche Inhalt kann nicht wiederhergestellt werden. Behalten Sie immer eine Sicherungskopie der Originaldatei."
        },
        {
          "question": "Kann ich Bilder oder gescannten Text schwärzen?",
          "answer": "Dieses Werkzeug ist für textbasierte PDFs konzipiert. Für gescannte Dokumente müssen Sie die manuelle, bereichsbasierte Schwärzung verwenden."
        },
        {
          "question": "Kann ich das Erscheinungsbild der Schwärzung anpassen?",
          "answer": "Ja, Sie können die Schwärzungsfarbe festlegen, Rahmen hinzufügen und optional einen Platzhaltertext wie „[GESCHWÄRZT]“ einfügen."
        },
        {
          "question": "Wie funktioniert die Suche mit regulären Ausdrücken?",
          "answer": "Aktivieren Sie „Regulären Ausdruck verwenden“, um mit Regex-Mustern zu suchen. Beispielsweise sucht \\d{4}-\\d{4}-\\d{4}-\\d{4} nach Kreditkartennummern."
        }
      ]
    },
    "flatten-pdf": {
      "title": "PDF reduzieren",
      "metaDescription": "Reduzieren Sie PDF-Formulare und -Kommentare. Machen Sie Inhalte uneditierbar.",
      "keywords": [
        "PDF reduzieren",
        "Formulare reduzieren",
        "Kommentare reduzieren",
        "nicht editierbares PDF"
      ],
      "description": "\n      <p>„PDF reduzieren“ konvertiert interaktive Elemente wie Formularfelder und Kommentare in statische Inhalte. Das reduzierte PDF sieht optisch identisch aus, kann jedoch nicht mehr ausgefüllt oder bearbeitet werden.</p>\n      <p>Perfekt zum Finalisieren ausgefüllter Formulare, zum dauerhaften Verankern von Kommentaren oder zum Erstellen nicht editierbarer Dokumentversionen.</p>\n      <p>Die gesamte Verarbeitung erfolgt in Ihrem Browser, wodurch Ihre Dokumente privat bleiben.</p>\n    ",
      "howToUse": [
        {
          "step": 1,
          "title": "PDF hochladen",
          "description": "Ziehen Sie Ihr PDF mit Formularen oder Kommentaren per Drag-and-Drop hierher."
        },
        {
          "step": 2,
          "title": "Auswählen, was reduziert werden soll",
          "description": "Wählen Sie aus, ob Formulare, Kommentare oder beides reduziert werden sollen."
        },
        {
          "step": 3,
          "title": "Reduzieren und herunterladen",
          "description": "Klicken Sie auf „Reduzieren“, um das statische PDF zu erstellen."
        }
      ],
      "useCases": [
        {
          "title": "Formulare finalisieren",
          "description": "Sperren Sie ausgefüllte Formulardaten, um Änderungen zu verhindern.",
          "icon": "lock"
        },
        {
          "title": "Kommentare verankern",
          "description": "Machen Sie Kommentare im Dokument dauerhaft (statisch).",
          "icon": "check-circle"
        },
        {
          "title": "Dokumente archivieren",
          "description": "Erstellen Sie nicht editierbare Versionen zur Archivierung.",
          "icon": "archive"
        }
      ],
      "faq": [
        {
          "question": "Ist das Reduzieren umkehrbar?",
          "answer": "Nein, das Reduzieren ist dauerhaft. Behalten Sie eine Sicherungskopie des Originals."
        },
        {
          "question": "Ändert sich das Erscheinungsbild?",
          "answer": "Nein, das Dokument sieht genauso aus, ist aber nicht mehr interaktiv."
        },
        {
          "question": "Reduziert es die Dateigröße?",
          "answer": "Manchmal, da interaktive Elemente in einfachere statische Inhalte umgewandelt werden."
        }
      ]
    },
    "remove-metadata": {
      "title": "Metadaten entfernen",
      "metaDescription": "Metadaten aus PDF-Dateien entfernen. Löschen Sie Autor, Daten und Dokumenteigenschaften.",
      "keywords": [
        "PDF-Metadaten entfernen",
        "Metadaten bereinigen",
        "PDF-Datenschutz",
        "anonymes PDF"
      ],
      "description": "\n      <p>„Metadaten entfernen“ bereinigt alle Dokumenteigenschaften und Metadaten aus Ihren PDF-Dateien. Entfernen Sie Autorennamen, Erstellungsdaten, Software-Informationen und andere identifizierende Daten.</p>\n      <p>Unerlässlich für den Datenschutz beim Teilen von Dokumenten oder wenn Metadaten sensible Informationen offenlegen könnten.</p>\n      <p>Die gesamte Verarbeitung erfolgt in Ihrem Browser, wodurch Ihre Dokumente privat bleiben.</p>\n    ",
      "howToUse": [
        {
          "step": 1,
          "title": "PDF hochladen",
          "description": "Ziehen Sie Ihre PDF-Datei per Drag-and-Drop hierher oder klicken Sie, um sie auszuwählen."
        },
        {
          "step": 2,
          "title": "Metadaten entfernen",
          "description": "Klicken Sie auf „Entfernen“, um alle Metadaten zu bereinigen."
        },
        {
          "step": 3,
          "title": "Herunterladen",
          "description": "Laden Sie das metadatenfreie PDF herunter."
        }
      ],
      "useCases": [
        {
          "title": "Datenschutz",
          "description": "Entfernen Sie persönliche Daten vor dem Teilen.",
          "icon": "shield"
        },
        {
          "title": "Anonyme Dokumente",
          "description": "Erstellen Sie Dokumente ohne Angabe des Autors.",
          "icon": "user-x"
        },
        {
          "title": "Bereinigte Verteilung",
          "description": "Verteilen Sie Dokumente ohne interne Metadaten.",
          "icon": "send"
        }
      ],
      "faq": [
        {
          "question": "Welche Metadaten werden entfernt?",
          "answer": "Autor, Titel, Thema, Schlüsselwörter, Datumsangaben, Ersteller- und Herstellerinformationen."
        },
        {
          "question": "Werden XMP-Metadaten entfernt?",
          "answer": "Ja, es werden sowohl Standard- als auch XMP-Metadaten bereinigt."
        },
        {
          "question": "Wird der Inhalt beeinträchtigt?",
          "answer": "Nein, es werden nur Metadaten entfernt; der Dokumenteninhalt bleibt unverändert."
        }
      ]
    },
    "change-permissions": {
      "title": "Berechtigungen ändern",
      "metaDescription": "Ändern Sie PDF-Berechtigungen. Steuern Sie den Zugriff auf Drucken, Kopieren und Bearbeiten.",
      "keywords": [
        "PDF-Berechtigungen",
        "PDF-Zugriff ändern",
        "PDF einschränken",
        "PDF-Sicherheit"
      ],
      "description": "\n      <p>„Berechtigungen ändern“ modifiziert die Zugriffskontrollen für Ihre PDF-Dokumente. Aktivieren oder deaktivieren Sie Berechtigungen für Drucken, Kopieren, Bearbeiten und Kommentieren.</p>\n      <p>Legen Sie ein Besitzerpasswort (Berechtigungspasswort) fest, um diese Einschränkungen durchzusetzen. Empfänger können das Dokument anzeigen, sind jedoch in ihren Aktionen eingeschränkt.</p>\n      <p>Die gesamte Verarbeitung erfolgt in Ihrem Browser, wodurch Ihre Dokumente privat bleiben.</p>\n    ",
      "howToUse": [
        {
          "step": 1,
          "title": "PDF hochladen",
          "description": "Ziehen Sie Ihre PDF-Datei per Drag-and-Drop hierher oder klicken Sie, um sie auszuwählen."
        },
        {
          "step": 2,
          "title": "Berechtigungen festlegen",
          "description": "Aktivieren oder deaktivieren Sie Drucken, Kopieren, Bearbeiten und Kommentieren."
        },
        {
          "step": 3,
          "title": "Anwenden und herunterladen",
          "description": "Legen Sie das Besitzerpasswort fest und laden Sie das eingeschränkte PDF herunter."
        }
      ],
      "useCases": [
        {
          "title": "Kopieren verhindern",
          "description": "Deaktivieren Sie das Kopieren von Text, um Ihre Inhalte zu schützen.",
          "icon": "copy"
        },
        {
          "title": "Drucken kontrollieren",
          "description": "Einschränken oder Erlauben des Dokumentendrucks.",
          "icon": "printer"
        },
        {
          "title": "Bearbeitung einschränken",
          "description": "Verhindern Sie Änderungen am Dokument.",
          "icon": "edit-3"
        }
      ],
      "faq": [
        {
          "question": "Benötige ich ein Passwort?",
          "answer": "Ein Besitzerpasswort ist erforderlich, um die Berechtigungen durchzusetzen."
        },
        {
          "question": "Können Berechtigungen wieder entfernt werden?",
          "answer": "Ja, mit dem Besitzerpasswort oder über das Werkzeug „Einschränkungen aufheben“."
        },
        {
          "question": "Sind all PDF-Reader kompatibel?",
          "answer": "Die meisten PDF-Reader respektieren Berechtigungen, aber einige setzen sie möglicherweise nicht durch."
        }
      ]
    },
    "pdf-to-markdown": {
      "title": "PDF in Markdown",
      "metaDescription": "Konvertieren Sie PDF in das Markdown-Format. Extrahieren Sie Text und erhalten Sie Formatierungen wie Überschriften und Listen.",
      "keywords": [
        "PDF in Markdown",
        "PDF in MD konvertieren",
        "PDF-Textextraktion",
        "Markdown-Konverter",
        "PDF in Text"
      ],
      "description": "\n      <p>„PDF in Markdown“ konvertiert Ihre PDF-Dokumente in saubere, gut strukturierte Markdown-Dateien. Das Tool extrahiert intelligent Textinhalte und versucht, Formatierungen wie Überschriften, Listen und Absätze beizubehalten.</p>\n      <p>Perfekt für die Konvertierung von PDF-Dokumenten in editierbare Formate für Dokumentationen, Notizen oder Content-Management-Systeme, die Markdown unterstützen.</p>\n      <p>Die gesamte Konvertierung erfolgt lokal in Ihrem Browser, wodurch Ihre Dokumente privat und sicher bleiben.</p>\n    ",
      "howToUse": [
        {
          "step": 1,
          "title": "PDF hochladen",
          "description": "Ziehen Sie Ihre PDF-Datei per Drag-and-Drop hierher oder klicken Sie, um sie auszuwählen."
        },
        {
          "step": 2,
          "title": "Optionen konfigurieren",
          "description": "Legen den Seitenbereich fest, wählen Sie aus, ob Seitenzahlen einbezogen werden sollen, und passen Sie die Zeilenumbruch-Einstellungen an."
        },
        {
          "step": 3,
          "title": "Konvertieren und herunterladen",
          "description": "Klicken Sie auf „Konvertieren“, um Ihre Markdown-Datei zu generieren und herunterzuladen."
        }
      ],
      "useCases": [
        {
          "title": "Dokumentation",
          "description": "Konvertieren Sie PDF-Handbücher und -Anleitungen in Markdown für eine versionierte Dokumentation.",
          "icon": "file-text"
        },
        {
          "title": "Notizerstellung",
          "description": "Extrahieren Sie Inhalte aus PDF-Artikeln und -Büchern für Ihr Notizensystem.",
          "icon": "edit-3"
        },
        {
          "title": "Inhaltsmigration",
          "description": "Migrieren Sie PDF-Inhalte auf CMS-Plattformen, die Markdown unterstützen.",
          "icon": "copy"
        }
      ],
      "faq": [
        {
          "question": "Bleibt die Formatierung erhalten?",
          "answer": "Das Tool versucht, Überschriften anhand der Schriftgröße sowie Aufzählungen/nummerierte Listen zu erkennen. Komplexe Layouts erfordern möglicherweise manuelle Anpassungen."
        },
        {
          "question": "Kann ich bestimmte Seiten konvertieren?",
          "answer": "Ja, Sie können einen Seitenbereich wie „1-3, 5, 7“ angeben, um nur diese Seiten zu konvertieren."
        },
        {
          "question": "Funktioniert es mit gescannten PDFs?",
          "answer": "Gescannte PDFs enthalten Bilder und keinen Text. Verwenden Sie zuerst unser OCR-Werkzeug, um den Text zu extrahieren, bevor Sie ihn in Markdown konvertieren."
        }
      ]
    },
    "ocg-manager": {
      "title": "PDF-Ebenen-Manager (OCG)",
      "metaDescription": "Verwalten Sie PDF-Ebenen (Optional Content Groups). Anzeigen, Ein-/Ausblenden, Hinzufügen, Löschen und Umbenennen von Ebenen in Ihren PDF-Dokumenten.",
      "keywords": [
        "PDF-Ebenen",
        "OCG-Manager",
        "Optional Content Groups",
        "Sichtbarkeit von PDF-Ebenen",
        "PDF-Ebenen verwalten"
      ],
      "description": "\n      <p>Der „PDF-Ebenen-Manager“ ermöglicht Ihnen das Anzeigen und Verwalten von Optional Content Groups (OCG) in Ihren PDF-Dokumenten. OCG-Ebenen werden in technischen Zeichnungen, Karten und komplexen Dokumenten verwendet, um Inhalte in ein- und ausblendbare Ebenen zu organisieren.</p>\n      <p>Zeigen Sie alle Ebenen in Ihrer PDF an, schalten Sie deren Sichtbarkeit um, fügen Sie neue Ebenen hinzu, löschen Sie unerwünschte oder benennen Sie vorhandene Ebenen um. Dieses Werkzeug ist unverzichtbar für die Arbeit mit geschichteten PDFs wie Bauplänen, CAD-Exporten und druckfertigen Dokumenten.</p>\n      <p>Die gesamte Verarbeitung erfolgt lokal in Ihrem Browser, wodurch Ihre Dokumente privat und sicher bleiben.</p>\n    ",
      "howToUse": [
        {
          "step": 1,
          "title": "PDF hochladen",
          "description": "Laden Sie eine PDF-Datei hoch, die Ebenen (OCGs) enthält oder der Sie Ebenen hinzufügen möchten."
        },
        {
          "step": 2,
          "title": "Ebenen anzeigen",
          "description": "Das Werkzeug listet automatisch alle im Dokument gefundenen Ebenen mit ihrem Sichtbarkeitsstatus auf."
        },
        {
          "step": 3,
          "title": "Ebenen verwalten",
          "description": "Schalten Sie die Sichtbarkeit von Ebenen um, benennen Sie Ebenen um, fügen Sie neue hinzu oder löschen Sie unerwünschte Ebenen."
        },
        {
          "step": 4,
          "title": "Speichern und herunterladen",
          "description": "Laden Sie Ihr geändertes PDF mit den angewendeten Ebenenänderungen herunter."
        }
      ],
      "useCases": [
        {
          "title": "Technische Zeichnungen",
          "description": "Verwalten Sie Ebenen in CAD-Exporten, um Bemaßungen, Anmerkungen oder verschiedene Ansichten ein- oder auszublenden.",
          "icon": "ruler"
        },
        {
          "title": "Kartenbearbeitung",
          "description": "Schalten Sie verschiedene Kartenebenen wie Topografie, Straßen und Beschriftungen für benutzerdefinierte Kartendrucke um.",
          "icon": "map"
        },
        {
          "title": "Druckvorbereitung",
          "description": "Bereiten Sie geschichtete PDFs für den Druck vor, indem Sie die entsprechenden Ebenen für verschiedene Versionen ein- oder ausblenden.",
          "icon": "printer"
        }
      ],
      "faq": [
        {
          "question": "Was sind PDF-Ebenen (OCG)?",
          "answer": "Optional Content Groups (OCG) sind Ebenen in einem PDF, die ein- oder ausgeblendet werden können. Sie werden häufig in CAD-Zeichnungen, Karten und komplexen Dokumenten verwendet."
        },
        {
          "question": "Warum zeigt mein PDF keine Ebenen an?",
          "answer": "Nicht alle PDFs enthalten Ebenen. Ebenen werden normalerweise während der PDF-Erstellung aus Design-Software oder CAD-Anwendungen hinzugefügt."
        },
        {
          "question": "Wirken sich Ebenenänderungen auf den ursprünglichen Inhalt aus?",
          "answer": "Änderungen der Ebenensichtbarkeit wirken sich nur darauf aus, was angezeigt oder gedruckt wird. Der tatsächliche Inhalt verbleibt im Dokument."
        }
      ]
    },
    "pdf-reader": {
      "title": "PDF-Reader",
      "metaDescription": "Kostenloser Online-PDF-Reader. Zeigen Sie PDF-Dokumente an, navigieren Sie darin, zoomen, rotieren und drucken Sie diese direkt in Ihrem Browser.",
      "keywords": [
        "PDF-Reader",
        "PDF-Viewer",
        "PDF online ansehen",
        "PDF lesen",
        "PDF-Browser-Viewer"
      ],
      "description": "\n      <p>PDF-Reader ist ein voll funktionsfähiger PDF-Viewer, mit dem Sie PDF-Dokumente direkt in Ihrem Browser lesen und darin navigieren können. Keine Softwareinstallation erforderlich – laden Sie einfach Ihr PDF hoch und beginnen Sie zu lesen.</p>\n      <p>Navigieren Sie zwischen den Seiten, zoomen Sie hinein und heraus, drehen Sie die Ansicht und nutzen Sie den Vollbildmodus für ablenkungsfreies Lesen. Sie können Dokumente auch drucken oder für den Offline-Zugriff herunterladen.</p>\n      <p>Die gesamte Anzeige erfolgt lokal in Ihrem Browser. Ihre Dokumente werden niemals auf einen Server hochgeladen, was absolute Vertraulichkeit garantiert.</p>\n    ",
      "howToUse": [
        {
          "step": 1,
          "title": "PDF öffnen",
          "description": "Klicken Sie zum Hochladen oder ziehen Sie eine PDF-Datei per Drag-and-Drop, um sie im Reader zu öffnen."
        },
        {
          "step": 2,
          "title": "Seiten navigieren",
          "description": "Verwenden Sie die Seitensteuerung, um zur vorherigen oder nächsten Seite zu gelangen oder zu einer bestimmten Seitennummer zu springen."
        },
        {
          "step": 3,
          "title": "Ansicht anpassen",
          "description": "Zoomen Sie hinein oder heraus, drehen Sie die Ansicht oder wechseln Sie in den Vollbildmodus für ein angenehmes Lesen."
        },
        {
          "step": 4,
          "title": "Drucken oder Herunterladen",
          "description": "Drucken Sie das Dokument aus oder laden Sie es bei Bedarf für den Offline-Zugriff herunter."
        }
      ],
      "useCases": [
        {
          "title": "Dokumentenprüfung",
          "description": "Überprüfen Sie PDF-Dokumente schnell, ohne Software installieren zu müssen.",
          "icon": "book-open"
        },
        {
          "title": "Mobiles Lesen",
          "description": "Lesen Sie PDF-Dokumente auf jedem Gerät mit einem Webbrowser.",
          "icon": "smartphone"
        },
        {
          "title": "Schnellvorschau",
          "description": "Zeigen Sie eine Vorschau von PDFs an, bevor Sie sich entscheiden, sie herunterzuladen oder zu drucken.",
          "icon": "eye"
        }
      ],
      "faq": [
        {
          "question": "Ist mein Dokument sicher?",
          "answer": "Ja, Ihr Dokument wird vollständig in Ihrem Browser verarbeitet und niemals auf einen Server hochgeladen."
        },
        {
          "question": "Kann ich das PDF kommentieren oder bearbeiten?",
          "answer": "Dieses Tool dient nur zur Anzeige. Verwenden Sie unsere Werkzeuge „PDF unterschreiben“ oder „PDF kommentieren“ zur Bearbeitung."
        },
        {
          "question": "Funktioniert es auf Mobilgeräten?",
          "answer": "Ja, der PDF-Reader funktioniert auf allen Geräten mit einem modernen Webbrowser."
        }
      ]
    }
  }
}

target_file = r"d:\NextProject\pdfcraft\scratch\translated-tool-contents-de-part2.json"
os.makedirs(os.path.dirname(target_file), exist_ok=True)
with open(target_file, "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"Successfully generated German translation for {len(data['de'])} tools in {target_file}")
