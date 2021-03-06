# Technische Dokumentation #
----------

## Kommunikation  ##

#### Aufteilung Server/Client #####
Es besteht eine klare Abstraktion zwischen dem Server und dem Client. Anstatt die Inhalte mit PHP beim Laden dynamisch zu erstellen, wird möglichst viel mit Javascript auf dem Client programmiert.  
Sämtliche Abfragen von Daten nach erstmaligem Laden einer Seite erfolgen mittels Ajax Befehlen.  

<span style="color:blue">Nachteile</span>.  
- lange Ladezeiten für mobile Geräte  

<span style="color:blue">Vorteile</span>.  
- kleinere Serverbelastung  
- weniger Serverabhängigkeit sobald File einmalig geladen wurde

Bei einem Ajax Befehl an den Server wird mittels einer Steuervariable dem Server mitgeteilt, welche Aufgabe auf dem Server zu erledigen ist. Pro Tabellenblatt der Datenbank habe ich eine Klasse erstellt. Jede Klasse hat die Grundfunktionen : schreiben, lesen, löschen, update. 
Zudem gibt es bei der Klasse "class_SqlTabelleTicketarten.php" einige spezielle Funktionen, welche Tabellen übergreifend sind. Die Klasse "class_SqlTabelleTickets" hat noch eine zusätzliche spezielle Lesefunktion. Die Klasse greift mittel eines join auf zwei tabellenbläter zu.
Die Steuervariable der Ajaxanfrage hat die folgende Struktur:

   
        var dataToSend = {
            tabelle         : "",  	// Tabelle der Datenbank auf welche zugegriffen wird
            funktion        : "", 	// schreiben, lesen, löschen, update, spezialfunktionen
            parameter       : "",	// genaue Methode - alles, suchen
            spaltenName     : "",	// Argumente für Methoden "suchen"
            spaltenWert     : "",	// Argumente für Methoden "suchen"
            idZeile         : -1 ,	// Rerserve
            updateSpalte    : [],	// Array mit allen Spalten, welche upgedatet werden sollen 
            updateWert      : [],	// Array mit allen Werten zu den update Spalten 
            datensatz       : []	// Argumente für Funktion schreiben oder Spezailfunktionen
        };

Sämtliche Objektinstanzen der Klassen werden in den beiden PHP Files "ajaxDatenbank.php" und "ajaxEmail.php" aufgerufen. Für den Ajax Zugriff ist eine Authentifizierung notwendig. Die Zugangsdaten können ebenfalls per Mail an bruno.kirchmeier@gmail.com angefordert werden.

#### REST-API  #####
Durch die oben erwähnte Struktur it die REST-API eigentlich gegeben. Nun können problemlos alle Funktionen freigegeben werden, sofern die URL und Benutzeranmeldedaten bekannt gegeben werden. Natürlich kann auch der Inhalt auf eine neue PHP Seite kopiert werden, mit neuen Anmeldedaten und nur vereinzelten Funktionen, welche freigegeben werden sollen, wie zum Beispiel nur lese Funktionen.

#### JSON Protokoll   ####
Als Kommunikationsprotokoll zwischen Server Client wird mit JSON gearbeitet. Empfangene Daten und auch Echo Ausgaben auf dem PHP Server müssen im JSON Format erfolgen. Ansonsten wird dem Client mittels Header ein Fehler mittgeteilt.


## Ordner Struktur  ##

#### HTML/PHP Frontend #####
Zur vermeiden von Code Wiederholungen werden keine statischen HTML Seiten programmiert. Das HTML wird mittels PHP dynamschisch zusammengebaut.

Zuerst wird das index.php File geladen. Die gesamte Bandliste inklusive Detailansicht erfolgt über Javascript auf der gleichen URL. Mittel des fixierten Menues am oberen Bildrand, bei Klick auf das Hamburgerzeichen, kann auf eine andere HTML Seite gewechselt werden.
Sämtliche weiteren PHP Files, welche für das Frontend gebraucht werden, sind im Ordner "assets\php\view" abgelegt.

Im Moment sind noch keine sauberen dynamischen Pfade im Projekt integriert. Bei Elementen, welche an verschiedenen Orten eingebunden werden, wie zum Beispiel dem Header, müssen im Moment für jede neue PHP Seite die Pfade seperat angepasst werden. Jeweils am Anfang einer Seite werden mit den folgenden Variablen der relative Bezug für die aktuelle Situation definiert.
    
    <!-- Pfad Konfigurationen -->
    <?php
    // Rootverzeichnisse für relative Pfade, damit bei Include der PFad immer korrekt ist
    $pathRoot_index = './';
    $pathRoot_phpView = './assets/php/view/';
    $pathRoot_img = './assets/images/';
    $pathRoot_js = './assets/js/';
    $pathRoot_npm = '../';
    $pathRoot_css = './assets/css/';
    // phpinfo();
    ?>


Innerhalb des dynamisch aufgerufenen Teils wird jeweils für alle Pfad Elemente diese Variablen als Prefix verwendet. Der gesamte Pfad ist immer als relativer Pfad aufgebaut

    <li><a href="<?php echo $pathRoot_index .""; ?>">LINE UP</a></li>


#### Bilder #####

Sämtliche Bilder im Projekt sind derzeit in der gleichen Ordnerstruktur abgelegt. Sowohl jene welche statisch hinterlegt sind, als auch jene, die durch den Administrator in den Content geladen werden.

Auf der Datenbank abgelegte Bilder werden in einer Filestruktur auf dem Server gespeichert. Auf der Datenbank wird nur der relative Pfad angegeben, wo die Bilder gespeichert sein sollten. Der Administrator muss selbst dafür besorgt sein, dass die Bilder auch an jenem Pfad abgespeichert sind, welcher auf der Datenbank hinterlegt ist. Dazu wird der Zugriff auf den Server mittels FDP benötigt.
Ob die Bilder mittels BLOB in die Datenbank direkt gespeichert werden, oder ob nur eine Referenz des Speicherpfades hinterlegt wird, ergibt verschiedene Vor und Nachteile:

<span style="color:blue">Nachteile Bilder als Pfadreferenz speichern</span>.  
- Wird an den Ordnern mit den Bildinhalten etwas verändert, oder auf einen anderen Server gewechselt, so besteht eine grosse Gefahr, dass die abgespeicherten Referenzen in der Datenbank nicht mehr korrekt sind. Der Fehler wird nicht erkannt.  
- Nebst dem Datenbankbefehl muss zusätzlich dafür gesorgt werden, dass die Bilder an der entsprechenden Stelle abgespeichert werden.

<span style="color:blue">Vorteile Bilder als Pfadreferenz speichern</span>.  
- kürzere Verarbeitungszeit für die Datenbank
- viel weniger Speicherbedarf nötig
- Bilder können auch ohne Datenbankbefehl einfach kopiert werden



## Datenspeicherung  ##

#### Kurzdatenspeicher #####
Ich habe mich für die Variante mit "local Storage" entschieden. Der Hauptgrund dafür ist, dass einfache Handling.
Es ist keine Fallback Lösung integriert, sollte locale Storage nicht unterstütz werden

<span style="color:blue">Nachteile</span>.  
- Da der local Storage zugriff auf die Festplatte hat, ist die Gefahr eines Angriffs grösser.    
- Die Daten werden erst gelöscht, wenn der Speicher voll ist, oder expliziet durch einen Befehl. Die Daten könnten somit für immer auf dem PC bleiben  
- Die Daten werden auf dem PC unverschlüsselt gespeichert.

<span style="color:blue">Vorteile</span>.  
- grosse Speichermenge  
- einfaches Handling  
- Daten werden nur lokal auf dem Client gespeichert. Es ist kein Internet nötig. Daten könnnen nicht über das Transverprotokoll abgefangen werden.

#### Datenbank #####
Das Datenbankmodel wurde mittels MySQL Workbench erstellt und auch auf den Liveserver gepielt. Es werden möglichs viele Berrechnungen und Plausibilitätsprüfungen direkt beim Datenbank Zugriff gemacht, da sich die Daten während der Zeitdifferenz vom einem SQL QUERY Befehl zum nächsten breits völlig verändert können. Auch seitens des Clients können unkontrollierte Zustände eintreffen, wie zum Beispiel, dass der Browser im falschen Moment geschlossen wird oder die Internet Verbingung unterbrochen wird.
![Datenbank_Model](https://github.com/WebProfessionals/dipl1617-bruno-kirchmeier/tree/master/readme/Bilder/Datenbank.svg)

## PHP Funktionen   ##
Für jedes tabellenblatt der Datenbank habe ich eine eigene Klasse erstellt. Dies werden nachfolgende beschrieben.
Sämtliche Objektinstanzen werden wie oben beschrieben in den beiden PHP Files "ajaxDatenbank.php" und "ajaxEmail.php" aufgerufen.

#### Beschreibung der Allgemeinen Einzelmethoden der Klassen   ####
**1. NeuerEintrag:**   
 Ein komplett neuer Datensatz wird erstellt. Sämtliche Argumente werden mittels der Variablen "datensatz" dem Server mitgeteilt. Die Varaiable "datensatz" ist ein Array

**2. Loeschen: (ohne Argumente)**   
 Bei einem leeren String für die Steuervariablen "spaltenName" und "spaltenWert", werden alle Datensätze der betreffenden Tabelle der Klasse gelöscht.

**3. Loeschen: (Mit Argumenten)**   
 Sind die Steuervariablen "spaltenName" und "spaltenWert" belegt, werden nur jene Datensätze gelöscht, für welche die folgende Aussage zutrifft. Alle Zeilen welche in der Spalte ("spaltenName") den Wert ("spaltenWert") aufweisen werden gelöscht

**4. Lesen:**   
 Gleich wie Funktion Loeschen, aber für Aktion Lesen

**5. update: (ohne Argumente)**   
 Auf jede Zeile wird ein update angewendet. Mit dem Argumenten "updateSpalte" und "updateWert" wird entschieden, welche Felder pro Zeile verändert werden und mit welchen Werten. Die beiden Variablen sind Arrays. Für jeweils den Index von "updateSpalte" wird der Wert vom gleichen Index der Variablen "updateWert" verwendet.

**6. update: (Mit einem Argument)**   
 Dieses Argument ist veraltet und wird nicht mehr benötigt. Aufgrund Zeitmangels konnte ich dies noch nicht anpassen, aber dieses Argument wird nicht mehr benötigt und kann herausgelöscht werden, da diese Funktionalität mit der folgenden Funktion ebenfalls erfüllt werden kann.

**7. update: (Mit drei Argumenten)**   
 Sind die Steuervariablen "spaltenName" und "spaltenWert" belegt, werden nur jene Datensätze upgedatet, für welche die folgende Aussgae zutrifft.  Alle Zeilen welche in der Spalte ("spaltenName") den Wert ("spaltenWert") aufweisen werden verändert.

 Mit dem Argumenten "updateSpalte" und "updateWert" wird entschieden, welche Felder pro Zeile verändert werden und mit welchen Werten. Die beiden Variablen sind Arrays. Für jeweils den Index von "updateSpalte" wird der Wert vom gleichen Index der Variablen "updateWert" verwendet.


#### Beschreibung von Spezialmethoden in der Klasse: "class_SqlTabelleTicketarten"   ####
**1. TicketsBlockieren:**   
 Mit dieser Methode werden Tickets für eine maximale zeitliche Begrenzung von 10 Minuten blockiert. Während dieses Zeitraums können die Tickets von keinem anderen Kunden gekauft werden. Die zeitliche Begrenzung gilt jeweils ab dem Timestamp der Variablen "updateTime". Wird vom Benutzer die Bestellung geändert, so wird durch die reguläre update Methode der Timestamp aktualisiert und die Zeit von 10 Minuten beginnt von vorne. Die abgebuchten Tickets werden in eine neue n:n Tabelle ("ticketarten_has_warenkorb") eingefügt. Wenn sie wieder freigegeben oder gekauft werden, werden sie dort wieder herausgelöscht.

 Mittels mehreren SQL Querys wird der oben beschriebene Vorgang realisiert.

> QUERY : IST Zustand Warenkorb erfassen.  
*Differenz von Bestellanpassung zu bereits in Warenkorb liegenden Tickets berechnen*

    SELECT * FROM ticketarten_has_warenkorb WHERE warenkorb_id = :integer_warenkorb_ID AND ticketarten_id = :ticketarten_id


> QUERY : Zu blockierende Ticktes in n:n Tabelle einfügen  
*Tickets bleiben dort für minimal 10 Minuten ab updateTime erhalten*

    INSERT INTO ticketarten_has_warenkorb( warenkorb_id, ticketarten_id, reservierteAnzahlTickets, createTime, updateTime)
    VALUES ( :warenkorb_id, :ticketarten_id, :reservierteAnzahlTickets, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)


> QUERY : Zu blockierende Ticktes in n:n Tabelle anpassen, sofern bereits vorhanden. Jenach Differenz von Buchungsanzahl und bereits blockierten Tickets, muss entweder eine Addition der eine Subtraktion erfolgen.

	*Bestellung wird durch Kunden erweitert - inklusive Kontrolle, dass maximale Ticketzahl nicht überschritten wird*
    UPDATE ticketarten_has_warenkorb SET reservierteAnzahlTickets =  reservierteAnzahlTickets + :anzahlTickets, updateTime = CURRENT_TIMESTAMP 
    WHERE warenkorb_id = :warenkorb_id AND ticketarten_id = :ticketarten_id
    
    ODER:

    *Bestellung wird durch Kunden verringert*
    UPDATE ticketarten_has_warenkorb SET reservierteAnzahlTickets =  reservierteAnzahlTickets - :anzahlTickets, updateTime = CURRENT_TIMESTAMP 
    WHERE warenkorb_id = :warenkorb_id AND ticketarten_id = :ticketarten_id


> QUERY : In tabellenblatt Ticketarten verfügbarkeit anpassen  
*blockierteAnzahlTickets + verkaufteAnzahlTickets = maximaleAnzahlTickets*

	*Bestellung wird durch Kunden erweitert - inklusive Kontrolle, dass maximale Ticketzahl nicht überschritten wird*
    UPDATE ticketarten SET blockierteAnzahlTickets = blockierteAnzahlTickets + :anzahlTickets, updateTime = CURRENT_TIMESTAMP
    WHERE id = :ticketarten_id AND :anzahlTickets <= maximaleAnzahlTickets - verkaufteAnzahlTickets - blockierteAnzahlTickets");
    
    ODER:

    *Bestellung wird durch Kunden verringert*
    UPDATE ticketarten SET blockierteAnzahlTickets = blockierteAnzahlTickets - :anzahlTickets, updateTime = CURRENT_TIMESTAMP WHERE id = :ticketarten_id

> QUERY : Im tabellenblatt ticketarten ergibt sich bei der Berechnung der Variablen "maximaleAnzahlTickets" ein Fehler. Die bereits gebuchten Tickets in das blatt "ticketarten_has_warenkorb" wird rückgängig gemacht und es wird wieder die anzahl der im ertsen Query gelesenen Werte reingeschrieben.

       UPDATE ticketarten_has_warenkorb SET reservierteAnzahlTickets = :reservierteAnzahlTickets, updateTime = CURRENT_TIMESTAMP 
       WHERE warenkorb_id = :warenkorb_id AND ticketarten_id = :ticketarten_id

**2. warenkorbTicketsFreigeben:**   
 Mit dieser Methode werden die in der obrigen Methode ("TicketsBlockieren") wieder Freigegeben, sofern die Zeit von 10 Minuten noch nicht abgelaufen ist.

 Mittels mehreren SQL Querys wird der oben beschriebene Vorgang realisiert.

> QUERY : Lesen aller Einträge aus ticketarten_has_warenkorb, welche die aktuelle warenkorb id besitzen und die Zeit von 10 Minuten abgelaufen ist

    SELECT * FROM ticketarten_has_warenkorb WHERE TIMESTAMPDIFF(SECOND, updateTime, CURRENT_TIMESTAMP ) > 600 AND ticketarten_id = :ticketarten_id


> QUERY : Löschen aller oben gelesenen Einträge 
*dynamische erstellung von Query und Binding - Beispiel*

    DELETE FROM ticketarten_has_warenkorb WHERE id in (value0 = 1, value0 = 6,.....)

> QUERY : Im Tabellenblatt "ticketarten" müssen die freigewordenen Tickets wieder zum Verkauf freigegeben werden
> 
    UPDATE ticketarten SET blockierteAnzahlTickets = blockierteAnzahlTickets - :anzahlTickets, updateTime = CURRENT_TIMESTAMP WHERE id = :ticketarten_id

**3. TicketsKaufen:**   
 Mit dieser Methode werden Tickets definitiv und unwiederruflich verkauft. Dabei werden im tabellenblatt "tickets" für jedes einzelne Ticket ein Eintrag erstellt. Im Moment sind noch keine speziellen Daten hinterlegt, wie zumn Beispiel eine Ticketnummer oder Lieferadresse, etc. Zugleich müssen die Tabellen "ticketarten_has_warenkorb" und "ticketarten" angepastt werden.

 Mittels mehreren SQL Querys wird der oben beschriebene Vorgang realisiert.

> QUERY : Löschen der Einträge aus der tabelle "ticketarten_has_warenkorb"

    DELETE FROM ticketarten_has_warenkorb WHERE warenkorb_id = :warenkorb_id AND ticketarten_id = :ticketarten_id

> QUERY : Anpassen der aktuellen Verfügbarkeit im tabellenbaltt "ticketarten"

    UPDATE ticketarten SET verkaufteAnzahlTickets := verkaufteAnzahlTickets + :anzahlTickets, 
    blockierteAnzahlTickets := blockierteAnzahlTickets - :anzahlTickets WHERE id = :ticketarten_id 

> QUERY : Für jedes Ticket einen einzelnen Eintrag im tabellenblatt "tickets" erstellen

    INSERT INTO tickets( ticketNummer, createTime, updateTime, ticketarten_id, warenkorb_id )
    VALUES ( :ticketNummer, CURRENT_TIMESTAMP , CURRENT_TIMESTAMP, :ticketarten_id, :warenkorb_id) 


#### Beschreibung von Spezialmethoden in der Klasse: "class_SqlTabelleTickets.php"   ####

**1. LesenTickets_Join_Ticketarten:**   
Mit dieser Funktion werden beim Lesen die Daten von den beiden Tabellenblättern "class_SqlTabelleTickets.php" und "class_SqlTabelleTicketarten.php" zusammengefasst.
Um keine doppelten Spaltennamen zu bekommen, werden nicht alle DAten, sndern nur die relavanten aus beidnen Tabellen gelesen.

> QUERY : IST Zustand Warenkorb erfassen.  

    SELECT t.id, t.ticketNummer, t.createTime , t.ticketarten_id, t.warenkorb_id,
        art.bild, art.title, art.beschreibung, art.eventDatum, art.eventZeit, art.eventOrt, art.eventAdresse, art.ticketPreis       
    FROM tickets t 
    LEFT JOIN ticketarten art ON t.ticketarten_id = art.id




## Frontend Bemerkungen   ##

#### Filterung Banddaten   ####
Die Filter für die Banddaten sind derzeit statisch definiert. Für eine dynamische Anbindung im Backend fehlte mir die Zeit. Über das Hamburgermenue unterhalb des Countdowns können die Banddtane geflitert werden. Das MEnue ist als Orgel aufgebaut. Mit Klickt auf den Titel wird die Sparte (z.B Uhrzeit) geschlossen und beim nächsten Klick wieder geöffnet.
Mit Klickt auf den Text "Alle" gleich links des Hamburgermenues, werden sämtliche Filter gelöscht. 


#### Login   ####
Die gesamte Accountverwaltung für den Kunden wird über das fixe Menu oben mit Klick auf den Text "LOGIN" gemacht. Mit Klickt auf den Text erscheinen die Account Funktionen. Mit einem weiteren Klick verschwinden diese wieder.


**Kunden Account erstellen:**  
Der Benutzername muss einzigartig sein. Gross und Kleinschrift wird gleich berücksichtigt.
Für das Passwort sind folgende Anforderungen vorhanden:  
- Minimal 6 Zeichen  
- Mindestens ein Sonderzeichen  
- Mindestens eine Zahl  
- Mindestens ein Grossbuchstabe  
- Mindesten ein Kleinbuchstabe  
- Keine Umlaute und Leerzeichen 

Nach erfolgreichem Erstellen eines Accountes, wird ein Bestätigungsmail an die hinterlegte Emailadresse geschickt, um den Account freizuschalten. Derzeit sind die Daten gespeichert, aber es kann noch keine Aktion ausgeführt werden.
In die URL eingebetet ist der gleiche Bestätigungscode, welcher bei Erstellung des Profiles auf der Datenbank abgespeichert wurde. Ebeso ist der Benutzername in der URL hinterlegt.
Dadurch können die Daten as der URL mit jenen des Bentuzers aus der Datenbank verglichen werden. Sind die Daten korrekt, so wird das Flag "loginFreigabe" auf true gesetzt und der Account ist aktiv.

Ist das Bestätigungsmail verloren gegangen, kann dieses beim Login Fenster nochmals erneut angefordert werden. Der Button  "Bestätigungslink anfordern" erscheint aber nur, wenn der Account noch nicht aktiviert und das Passwort korrekt eingegeben wurde.

Ebenso kann im Login Fenster ein neues Passwort angefordert werden, sollte dies vergesen gegangen sein. Nach Klicken auf den Button "Passwort vergessen" erscheint ein Eingabefeld für eine Emailadresse. Das Passwort wird nur gesendet, sofern in diesem Feld die gleiche Emailadresse eingegeben wird, wie jene die bei der Accounteröffnung eingegeben wurde.


**Administrator Account erstellen:**  
Dieses Login ist im Gegensatz zum Kundenlogin nur sehr vereinfacht. Es gibt keine Anforderungen und weniger Plausibilitätsprüfungen. Es fehlt mir die Zeit dieses dem Kunden Login anzugleichen.
Für Sämtliche Aktionen im Backend und für die Sichtbarkeit der Daten, muss der Administrator eingeloggt sein.


#### Tickets   ####
Es gibt eine Seite mit der Ansicht der Tickets des angemeldeten Kunden. Sowohl Tickets aktuell als auch bereits eingelöste. Auf diese Seite gelangt man über das fixe Menue am oberen Bildschirmrand, durch klicken auf das Bild mit dem Ticketsymbol. Damit aber DAten angezeigt werden, muss ein BEutzer angemeldet sein.

Will man aber die verfügbaren Tickets sehen und auch gleich welche kaufen, so muss man ebenfalls über das fixe Menue am oberen Bildschirmrand navigieren, aber durch klicken auf das Hamburgerbild und dan auf Tickets.

