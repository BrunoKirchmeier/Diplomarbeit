# Diplomarbeit Basisdisposition #
----------

### Projektbeschreibung ###
Ich werde das Vorgabeprojekt von Web Professionals nehmen und als Web Application Developer ausführen

### Technologiewahl ###

1. **Versionierung**  
Dies werde ich mittels Git machen. Der Grund dafür ist, dass dies das einzige Tool ist, welches ich bis anhin auch selbst angewendet habe  

2. **CSS Präprozessor**  
Ich werde dafür SASS verwenden. Ebenfalls mit der Begründung, dass dies das einzige Tool ist, welches ich bis anhin angewendet habe

3. **Dependency Manager**  
Ich werde dafür npm verwenden (Node package Manager). Ebenfalls mit dem Grund, dass ich bereits damit gearbeitet habe und dies auch bereits funktionsfähig auf meinem Rechner installiert ist. Folgende Quellen werden in den Manager aufgenommen:     
***Bootstrap 3, jquery, gulp-sass mit autoprefixer und sourcemaps, browser-sync***

4. **Task Runner**
Ich werde dafür Gulp verwenden, Ebenfalls mit dem Grund, dass ich bereits damit gearbeitet habe und dies auch bereits funktionsfähig auf meinem Rechner installiert ist. Folgende Tools werden installiert:    
***Sass, autoprefixer und sourcemaps, browser-sync***

5. **Variablenbeschriftung**  
a. ***Im HTML Code***  
Ich werde mich an die BEM Methode halten. In einem Kleineren Projekt wie diesen denke ich ist es die übersichtlichste Variante.  
b. ***Im PHP, Javascript Code***  
Ich werde in der UpperCamelCase Variante programmieren  
https://de.wikibooks.org/wiki/Java_Standard:_Variablen_und_Bezeichner  

6. **Framework*** 
Ich werde Bootstrap einsetzen, damit ich das Frontend möglichst schnell gestalten kann, da mein Fokus im Backend liegt. Ich werde sowohl Elemente wie Orgeln, aber auch das Grid verwenden. Ich beginne die Seite mit Mobile First und werde das Responsiv Design für das Tablet und den Desktop aus Zeitgründen weglassen.
Ich habe mich für Bootstrap Version 3 entschieden aufgrund Browser Kompatibilität.

7. **Externe Bibliotheken***  
a. ***Jquery***  
Da mein Fokus im Backend liegt, brauche ich eine schnelle Variante für die DOM Manipulation. Aufgrund erster Anwendungen habe ich das Gefühl mit jquery Zeit sparen zu können, mit dem Risiko, dass bei einer schlechten Internetverbindung viel Daten geladen werden müssen.  
b. ***Slick Slider***  
Gemäss Aufgabendefinition soll die Slick Slider Bibliothek eingebunden werden (installieren per npm lokal). Zudem soll gemäss Aufgabendefinition mittels verfügbarer JSON Funktionen die API der Slick Slider Bibliothek genutzt werden.  

8. **Rest API**  
Grundsätzlich erfolgt der Daten Transfer auf einen Server mit PHP und einer MySQL Datenbank. Mit der API kann aber einer- oder alle Einträge der SQL Liste geladen werden im JSON Format.

9. **Google Maps API**  
 - Benutzer kann Route (Start ab Adresseingabe / Ziel: Ohne Back-End Bearbeitung) berechnen.
 - Karte laden und mit eigenen Markierungen versehen (Ohne Back-End Bearbeitung) 

10. **Slider API**  
Diese Bibliothek wird im Projekt eingebunden um im Detailbild eine Slideshow von drei Bildern einzufügen. Die Bilder werden per JSON vom PHP Server über ein JSON Funktion dynamisch bereitgestellt.

11. **Backendpflege für Kunde**  
Der Kunde kann folgende Einstellungen selbständig mit seinem Administrator Passwort vornehmen:  
a. Tickets erstellen  
b. Neue Events hinzufügen / löschen
 - Bild der Band in vorgegebener Grösse von Bild muss selbständig erstellt werden (3 Stück Bilder für Slidershow)  
 - Beschreibung des Events  
 - Auftrittsdaten mit Zeit und Bühne – verlinkt mit Ticketkauf  
 - Start und Ende Ticketverkauf  
  
12. **Social Media**  
Aufgrund Zeitmangel habe ich mich entschlossen keine Social Medias einzubinden. Ich habe mir anfangs folgende API angeschaut:
https://github.com/BoyCook/TwitterJSClient

13. **Terminplan**  

![Terminplan](pdf/2_Terminplan.pdf)
