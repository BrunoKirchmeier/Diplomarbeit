<?php

// Mit dieser Klasse wird der Verbindungsaufbau mit der Datenbak hergesstellt.

// Die unterklasse für den Verbingungsaufbau wird includiert
// require_once "DP.php";

// Mit dieser Klasse werden die Eingabevalidierungen gemacht
// require_once "../../allgemein/validierungen.php";




////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////    KLASSE            class_SqlTabelleBand
/////////////////                      Dient zum erstellen, bearbeiten, löschen oder ausgeben von DAten aus dem Tabellenbaltt Band von der Datenbank
/////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
class class_SqlTabelleTicketarten
{

    // Definition von Privaten Variablen - Für Variablen die möglicherweise in verschiedenen Funktionen gebraucht werden oder in übergeortneten Blöcken  {}

    // Funktion NeuerEintrag
    // Funktionsargmente wurden beim Validieren eventuell bewusst verändert. Dies sind nun die gefilterten und Validierten Argumente
    private $bild_Gefiltert = ""; // seperate Funktion - Wert nur gefiltert nicht Validiert.
    private $titleValidiert = ""; // textValidieren()
    private $beschreibungValidiert = ""; // textValidieren()
    private $eventDatumValidiert = ""; // seperate Funktion
    private $eventZeitValidiert = ""; // seperate Funktion
    private $eventOrtValidiert = ""; // textValidieren()
    private $eventAdresseValidiert = ""; // textValidieren()
    private $startDatumTicketVerkaufValidiert = ""; // seperate Funktion
    private $endDatumTicketVerkaufValidiert = ""; // seperate Funktion


    // Funktion Lesen
    // Funktionsargmente wurden beim Validieren eventuell bewusst verändert. Dies sind nun die gefilterten und Validierten Argumente
    private $string_SpaltenBeschriftungValidiert = ""; // textValidieren() und alles kleingeschrieben
    private $string_ZeilenWertInSpalteValidiert = ""; // textValidieren()

    // Funktion Lesen
    // Ausgelesene Daten mit dem letz ausgeführten Prepared Statment
    private $funktionLesenDaten;


    // Funktion Update
    // Ausgelesene Daten mit dem letz ausgeführten Prepared Statment
    private $array_updateSpalteValidiert;
    private $array_updateWertValidiert;


    // Funktion Lesen / Löschen und Update
    // Diese Variablen werden in übergeortneten Blöcken vewendet
    private $statement = "";
    private $statementBinding = [];

    private $bool_Validiert = false;


    // Funktion TicketKaufen
    // Diese Variablen werden in übergeortneten Blöcken vewendet
    private $anzahlTicketsKaufen = 0;
    private $anzahlTicketsLoeschen = 0;
    private $array_effektiveAbbuchungen = [];         // Variable für Returnwert - bei welchen Ticket es geklappt hat
    private $freigabeQuery = false;

    // Funktion warenkorbTicketsFreigeben
    // Diese Variablen werden in übergeortneten Blöcken vewendet
    private $totalFreigewordeneTickets = 0;
    private $array_funktionLesenDatenProTicketId;


    // Variable Strings für Funktionsargumente Tabelle nach Spalte durchsuchen werden zentral in einem string definiert
    private $funktionGueltigeSpaltennamen = array('id', 'bild', 'title', 'beschreibung', 'eventDatum', 'eventZeit', 'eventOrt', 'eventAdresse', 'ticketPreis', ' maximaleAnzahlTickets',
        'blockierteAnzahlTickets', 'startDatumTicketVerkauf', 'endDatumTicketVerkauf', 'maxTicketsProKauf', 'createTime', 'updateTime', 'administratoren_id', 'verkaufteAnzahlTickets');


    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////     Methode          Neuer Eintrag
    /////////////////                      Mit dieser Funktion kann ein neuer Eintrag auf der Datenbank in die Tabelle Band gemacht werden
    /////////////////                      Der Parameter Administrator ist zwingend nötig. Ist auf der SQL Datenbank kein Admininistrator erfasst, so gibt es einen Fehler,
    /////////////////                      weil eine zwingende Relation vorhanden ist
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    public function NeuerEintrag($bild = "", $title = "", $beschreibung = "", $eventDatum = "2000.01.01", $eventZeit = "00:00:00", $eventOrt = "", $eventAdresse = '', $ticketPreis = 0, $maximaleAnzahlTickets = 0,
                                 $blockierteAnzahlTickets = 0, $startDatumTicketVerkauf = "2000.01.01", $endDatumTicketVerkauf = "2000.01.01", $administratoren_id = 0, $maxTicketsProKauf = 0, $verkaufteAnzahlTickets = 0)
    {

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        /////////////////     Datenvalidierung          Schutz vor Cross Site Scripting
        /////////////////                               Dadurch wird das Risiko minimiert, dass fremdcode in das Script eingebunden werden kann, da nur erlaubte Zichen zugelassen werden
        /////////////////                               Zudem werden FEhler bei DAtanbank zugriff vermindert, da die DAten konsistenz mit der Datenbak sind
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


        // Formatierung von Eingaben - Validierung zur Sicherheit sowie zur korrekten weiterverarbeitung
        // Mit dieser Funktion werden alle nicht html Zeichen entfernt. Somit wird das einschliessen von Schadfoftware durch Javascript vermindert
        // Diese werden beim lesen wieder decodiert mit der Funktion :   html_entity_decode()
        $this->titleValidiert = textValidieren($title);
        $this->beschreibungValidiert = textValidieren($beschreibung);
        $this->eventOrtValidiert = textValidieren($eventOrt);
        $this->eventAdresseValidiert = textValidieren($eventAdresse);

        // Pfad angaben für Bilder Filtern. Eine Validierung erfolgt nicht, da es ja möglich sein kann, dass der Pfad noch nicht exisiert
        $this->bild_Gefiltert = pfadeValidieren($bild);

        // Validierung von Eingaben, welche nicht verarbeitet werden können - Funktionsabbruch
        // Zahlen werden getestet ob sie auch wirklich Zahlen sind
        if (!is_numeric($administratoren_id)) {
            return "Administrator_id muss vom Typ Integer sein. Er ist vom Typ: " . gettype($administratoren_id);
        }
        // Zahlen werden getestet ob sie auch wirklich Zahlen sind
        if (!is_numeric($ticketPreis)) {
            return "ticketPreis muss vom Typ Integer sein. Er ist vom Typ: " . gettype($ticketPreis);
        }
        // Zahlen werden getestet ob sie auch wirklich Zahlen sind
        if (!is_numeric($maximaleAnzahlTickets)) {
            return "maximaleAnzahlTickets muss vom Typ Integer sein. Er ist vom Typ: " . gettype($maximaleAnzahlTickets);
        }
        // Zahlen werden getestet ob sie auch wirklich Zahlen sind
        if (!is_numeric($blockierteAnzahlTickets)) {
            return "blockierteAnzahlTickets muss vom Typ Integer sein. Er ist vom Typ: " . gettype($blockierteAnzahlTickets);
        }
        // Zahlen werden getestet ob sie auch wirklich Zahlen sind
        if (!is_numeric($maxTicketsProKauf)) {
            return "maxTicketsProKauf muss vom Typ Integer sein. Er ist vom Typ: " . gettype($maxTicketsProKauf);
        }
        // Zahlen werden getestet ob sie auch wirklich Zahlen sind
        if (!is_numeric($verkaufteAnzahlTickets)) {
            return "verkaufteAnzahlTickets muss vom Typ Integer sein. Er ist vom Typ: " . gettype($verkaufteAnzahlTickets);
        }


        // Validierung von Eingaben, welche nicht verarbeitet werden können - Funktionsabbruch
        // Datum werden von unötigen Zeichen entfernt und danach getest ob sie der Formatierung entsprechen
        if (datumValidieren($eventDatum) === false && $eventDatum !== '') {
            return "eventDatum ist nicht im Format :  yyyy.mm.dd  - Funktion wird nicht ausgeführt   Eingegebenes Datum in die Funktion : " . $eventDatum;
        } else {
            $this->eventDatumValidiert = (datumValidieren($eventDatum));
        }

        // Validierung von Eingaben, welche nicht verarbeitet werden können - Funktionsabbruch
        // Datum werden von unötigen Zeichen entfernt und danach getest ob sie der Formatierung entsprechen
        if (datumValidieren($startDatumTicketVerkauf) === false && $startDatumTicketVerkauf !== '') {
            return "eventDatum ist nicht im Format :  yyyy.mm.dd  - Funktion wird nicht ausgeführt   Eingegebenes Datum in die Funktion : " . $startDatumTicketVerkauf;
        } else {
            $this->startDatumTicketVerkaufValidiert = (datumValidieren($startDatumTicketVerkauf));
        }

        // Validierung von Eingaben, welche nicht verarbeitet werden können - Funktionsabbruch
        // Datum werden von unötigen Zeichen entfernt und danach getest ob sie der Formatierung entsprechen
        if (datumValidieren($endDatumTicketVerkauf) === false && $endDatumTicketVerkauf !== '') {
            return "eventDatum ist nicht im Format :  yyyy.mm.dd  - Funktion wird nicht ausgeführt   Eingegebenes Datum in die Funktion : " . $endDatumTicketVerkauf;
        } else {
            $this->endDatumTicketVerkaufValidiert = (datumValidieren($endDatumTicketVerkauf));
        }

        // Validierung von Eingaben, welche nicht verarbeitet werden können - Funktionsabbruch
        // Zeit werden von unötigen Zeichen entfernt und danach getest ob sie der Formatierung entsprechen
        if (zeitValidieren($eventZeit) === false && $eventZeit !== '') {
            return "eventZeit ist nicht im Format :  hh:mm:ss   - Funktion wird nicht ausgeführt    Eingegebene Zeit in die Funktion : " . $eventZeit;
        } else {
            $this->eventZeitValidiert = (zeitValidieren($eventZeit));
        }


        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        /////////////////     PREPARED STATMEND                     SCHUTZ VOR  SQL-Injections
        /////////////////     DEFINITION UND VARIABLEN              Diese dienen der Sicherheit bei der Abfrage auf die Datenbank. Die Anfragen an die Datenbank werden zuerts ausgewertet
        /////////////////     BINNDEN                               und erst dann werden die Variablen gebunden
        /////////////////
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


        //////////////////////////////// Statment definieren  und Variablen binden     /////////////////////////////////////////////////////////////////////////////////////////////////////

        // Statment definieren
        $statement = DB::get()->prepare(" INSERT INTO ticketarten( bild, title, beschreibung, eventDatum, eventZeit, eventOrt, eventAdresse, ticketPreis, maximaleAnzahlTickets, blockierteAnzahlTickets,
                                                              startDatumTicketVerkauf, endDatumTicketVerkauf, maxTicketsProKauf, createTime, updateTime, administratoren_id, verkaufteAnzahlTickets )
                                                VALUES      ( :bild_Gefiltert, :titleValidiert, :beschreibungValidiert, :eventDatumValidiert, :eventZeitValidiert, :eventOrtValidiert, :eventAdresseValidiert, 
                                                              :ticketPreis, :maximaleAnzahlTickets, :verkaufteAnzahlTicket, :startDatumTicketVerkaufValidiert ,:endDatumTicketVerkaufValidiert, 
                                                               :maxTicketsProKauf, CURRENT_TIMESTAMP , CURRENT_TIMESTAMP, :administratoren_id, :verkaufteAnzahlTickets)");

        // Statment Variablen binden
        // Variablen werden mit Prepared Statment gebunden. Das Array wird danach der ausführenden Funktion übergeben
        $statementBinding = array(
            ':bild_Gefiltert' => $this->bild_Gefiltert,
            ':titleValidiert' => $this->titleValidiert,
            ':beschreibungValidiert' => $this->beschreibungValidiert,
            ':eventDatumValidiert' => $this->eventDatumValidiert,
            ':eventZeitValidiert' => $this->eventZeitValidiert,
            ':eventOrtValidiert' => $this->eventOrtValidiert,
            ':eventAdresseValidiert' => $this->eventAdresseValidiert,
            ':ticketPreis' => $ticketPreis,
            ':maximaleAnzahlTickets' => $maximaleAnzahlTickets,
            ':verkaufteAnzahlTicket' => $blockierteAnzahlTickets,
            ':startDatumTicketVerkaufValidiert' => $this->startDatumTicketVerkaufValidiert,
            ':endDatumTicketVerkaufValidiert' => $this->endDatumTicketVerkaufValidiert,
            ':administratoren_id' => $administratoren_id,
            ':maxTicketsProKauf' => $maxTicketsProKauf,
            ':verkaufteAnzahlTickets' => $verkaufteAnzahlTickets,
        );


        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        /////////////////     PREPARED STATMEND AUFRUFEN
        /////////////////     ERROR HANDLING MIT TRY / CATCH        Das Error Handling wird über TRY und CATCH variante aufgefangen.
        /////////////////                                           Als Problemlösung ist in Catch im Moment nur die Ausgabe des Fehlers vorgesehen
        /////////////////                                           - das Problem muss im Moment manuell behoben werden und die Seite neu geladen werden
        /////////////////                                           Mit diesem Error Handling könnte der Programm absturz kontrolliert oder sogar behoben werden
        /////////////////
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        // Das Error Handling wird über TRY und CATCH variante aufgefangen.
        // Als Problemlösung ist in Catch im Moment nur die Ausgabe des FEhlers vorgesehen - das Problem muss im Moment manuell behoben werden und die Seite neu geladen werden
        // überwachte Funktion mit TRY starten
        try {

            //////////////////////////////// Statment ausführen     /////////////////////////////////////////////////////////////////////////////////////////////////////
            // Laden mit Fetchmode    -   FETCH_ASSOC (Standartvorgabe - Es werden die Werte als ssoziatives Arras zurückgegeben)
            $auftragErledigt = $statement->execute($statementBinding);

        } // überwachte Funktion im Fehlerfall mit CATCH abfangen
        catch (PDOException $e) {
            return ("Error: " . htmlspecialchars($e->getMessage()));
        }

        // Sofern kein Fehler auftauchte und die Funktion im catch gefangen ist, wird die Funktion regulär mit einem Returnwert beendet
        if ($auftragErledigt) {
            return "true";
        } // Auftrag nicht erledigt
        else {
            return "false";
        }

    }


    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////     Methode                       Eintrage LESEN  -  ALLE oder EINZELBEITRAG
    /////////////////
    /////////////////     ALLE                      :   Wird kein Parameter der Funktion mitgegeben, so werden alle Daten asu der ganzen Tabelle gelesen
    /////////////////
    /////////////////
    /////////////////     EINZEL NACH SPALTE        :   Werden alle Parameter belegt, so wird die gesamte Tabelle in der eingegebenen Spalte auf den ebenfalls eingegebenen
    /////////////////     MIT SPALTENWERTE              Wert durchsucgt. Alle diese werden zurückgegeben
    /////////////////                                   Dies ist nur mit Strings gedacht. Allfällige falsche unkonvertierungen werden nicht berücksischtigt
    /////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    public function Lesen($string_SpaltenBeschriftung = "", $string_ZeilenWertInSpalte = "")
    {
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        /////////////////     Datenvalidierung          Schutz vor Cross Site Scripting
        /////////////////                               Dadurch wird das Risiko minimiert, dass fremdcode in das Script eingebunden werden kann, da nur erlaubte Zichen zugelassen werden
        /////////////////                               Zudem werden FEhler bei DAtanbank zugriff vermindert, da die DAten konsistenz mit der Datenbak sind
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        // Formatierung von Eingaben - Validierung zur Sicherheit sowie zur korrekten weiterverarbeitung
        // Mit dieser Funktion werden alle nicht html Zeichen entfernt. Somit wird das einschliessen von Schadfoftware durch Javascript vermindert
        // Diese werden beim lesen wieder decodiert mit der Funktion :   html_entity_decode()
        $this->string_ZeilenWertInSpalteValidiert = textValidieren($string_ZeilenWertInSpalte);
        $this->string_SpaltenBeschriftungValidiert = textValidieren($string_SpaltenBeschriftung);


        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        /////////////////     PREPARED STATMEND                     SCHUTZ VOR  SQL-Injections
        /////////////////     DEFINITION UND VARIABLEN              Diese dienen der Sicherheit bei der Abfrage auf die Datenbank. Die Anfragen an die Datenbank werden zuerts ausgewertet
        /////////////////     BINNDEN                               und erst dann werden die Variablen gebunden
        /////////////////
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


        //////////////////////////////// Statment definieren  und Variablen binden   /////////////////////////////////////////////////////////////////////////////////////////////////////

        // Statment Lesen:   alle  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // Ist der FAll, wenn alle Funktionsargumente gemäss Standart Initialiserung sind
        if ($string_SpaltenBeschriftung === "" && $string_ZeilenWertInSpalte === "") {

            // Statment definieren
            $this->statement = DB::get()->prepare("SELECT * FROM ticketarten");
        }


        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // Statment Lesen:    alle mit:           spalte xx mit Inhalt yy
        // Ist der FAll, wenn Funktionsargumente 3 != "" ist
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        else if ($string_SpaltenBeschriftung !== "") {

            // Das Statment muss entsprechend des Tabellenaufbaues auf  gültigen Spaltennamen definiert werden. Die gültigen vergleichswerte für die Funktion sind
            // ganz am angang der Klasse definiert. DAs Array sieht folgendermasen aus :
            // ( 'administratoren_id', 'beschreibung', 'createTime', 'eventZeit', 'eventDatum', 'eventOrt', 'eventTime', 'id', 'title', 'updateTime', 'bild_1', 'bild_2', 'bild_3')

            // id
            if ($string_SpaltenBeschriftung === $this->funktionGueltigeSpaltennamen[0]) {
                // Statment definieren entsprechend dem String Argument
                $this->statement = DB::get()->prepare("SELECT * FROM ticketarten WHERE id = :string_ZeilenWertInSpalteValidiert ");
                // Statment Variablen binden
                $this->statementBinding = array(':string_ZeilenWertInSpalteValidiert' => $this->string_ZeilenWertInSpalteValidiert);
            } // bild
            else if ($string_SpaltenBeschriftung === $this->funktionGueltigeSpaltennamen[1]) {
                // Statment definieren entsprechend dem String Argument
                $this->statement = DB::get()->prepare("SELECT * FROM ticketarten  WHERE bild = :string_ZeilenWertInSpalteValidiert ");
                // Statment Variablen binden
                $this->statementBinding = array(':string_ZeilenWertInSpalteValidiert' => $this->string_ZeilenWertInSpalteValidiert);
            } // title
            else if ($string_SpaltenBeschriftung === $this->funktionGueltigeSpaltennamen[2]) {
                // Statment definieren entsprechend dem String Argument
                $this->statement = DB::get()->prepare("SELECT * FROM ticketarten WHERE title = :string_ZeilenWertInSpalteValidiert ");
                // Statment Variablen binden
                // Statment Variablen binden
                $this->statementBinding = array(':string_ZeilenWertInSpalteValidiert' => $this->string_ZeilenWertInSpalteValidiert);
            } // beschreibung
            else if ($string_SpaltenBeschriftung === $this->funktionGueltigeSpaltennamen[3]) {
                // Statment definieren entsprechend dem String Argument
                $this->statement = DB::get()->prepare("SELECT * FROM ticketarten WHERE beschreibung = :string_ZeilenWertInSpalteValidiert ");
                // Statment Variablen binden
                $this->statementBinding = array(':string_ZeilenWertInSpalteValidiert' => $this->string_ZeilenWertInSpalteValidiert);
            } // eventDatum
            else if ($string_SpaltenBeschriftung === $this->funktionGueltigeSpaltennamen[4]) {
                // Statment definieren entsprechend dem String Argument
                $this->statement = DB::get()->prepare("SELECT * FROM ticketarten WHERE eventDatum = :string_ZeilenWertInSpalteValidiert ");
                // Statment Variablen binden
                // Statment Variablen binden
                $this->statementBinding = array(':string_ZeilenWertInSpalteValidiert' => $this->string_ZeilenWertInSpalteValidiert);
            } // eventZeit
            else if ($string_SpaltenBeschriftung === $this->funktionGueltigeSpaltennamen[5]) {
                // Statment definieren entsprechend dem String Argument
                $this->statement = DB::get()->prepare("SELECT * FROM ticketarten WHERE eventZeit  = :string_ZeilenWertInSpalteValidiert ");
                // Statment Variablen binden
                $this->statementBinding = array(':string_ZeilenWertInSpalteValidiert' => $this->string_ZeilenWertInSpalteValidiert);
            } // eventOrt
            else if ($string_SpaltenBeschriftung === $this->funktionGueltigeSpaltennamen[6]) {
                // Statment definieren entsprechend dem String Argument
                $this->statement = DB::get()->prepare("SELECT * FROM ticketarten WHERE eventOrt = :string_ZeilenWertInSpalteValidiert ");
                // Statment Variablen binden
                $this->statementBinding = array(':string_ZeilenWertInSpalteValidiert' => $this->string_ZeilenWertInSpalteValidiert);
            } // eventAdresse
            else if ($string_SpaltenBeschriftung === $this->funktionGueltigeSpaltennamen[7]) {
                // Statment definieren entsprechend dem String Argument
                $this->statement = DB::get()->prepare("SELECT * FROM ticketarten WHERE eventAdresse = :string_ZeilenWertInSpalteValidiert ");
                // Statment Variablen binden
                $this->statementBinding = array(':string_ZeilenWertInSpalteValidiert' => $this->string_ZeilenWertInSpalteValidiert);
            } // ticketPreis
            else if ($string_SpaltenBeschriftung === $this->funktionGueltigeSpaltennamen[8]) {
                // Statment definieren entsprechend dem String Argument
                $this->statement = DB::get()->prepare("SELECT * FROM ticketarten WHERE ticketPreis = :string_ZeilenWertInSpalteValidiert ");
                // Statment Variablen binden
                $this->statementBinding = array(':string_ZeilenWertInSpalteValidiert' => $this->string_ZeilenWertInSpalteValidiert);
            } // maximaleAnzahlTickets
            else if ($string_SpaltenBeschriftung === $this->funktionGueltigeSpaltennamen[9]) {
                // Statment definieren entsprechend dem String Argument
                $this->statement = DB::get()->prepare("SELECT * FROM ticketarten WHERE  maximaleAnzahlTickets = :string_ZeilenWertInSpalteValidiert ");
                // Statment Variablen binden
                $this->statementBinding = array(':string_ZeilenWertInSpalteValidiert' => $this->string_ZeilenWertInSpalteValidiert);
            } // blockierteAnzahlTickets
            else if ($string_SpaltenBeschriftung === $this->funktionGueltigeSpaltennamen[10]) {
                // Statment definieren entsprechend dem String Argument
                $this->statement = DB::get()->prepare("SELECT * FROM ticketarten WHERE blockierteAnzahlTickets  = :string_ZeilenWertInSpalteValidiert ");
                // Statment Variablen binden
                $this->statementBinding = array(':string_ZeilenWertInSpalteValidiert' => $this->string_ZeilenWertInSpalteValidiert);
            } // startDatumTicketVerkauf
            else if ($string_SpaltenBeschriftung === $this->funktionGueltigeSpaltennamen[11]) {
                // Statment definieren entsprechend dem String Argument
                $this->statement = DB::get()->prepare("SELECT * FROM ticketarten WHERE startDatumTicketVerkauf = :string_ZeilenWertInSpalteValidiert ");
                // Statment Variablen binden
                $this->statementBinding = array(':string_ZeilenWertInSpalteValidiert' => $this->string_ZeilenWertInSpalteValidiert);
            } // endDatumTicketVerkauf
            else if ($string_SpaltenBeschriftung === $this->funktionGueltigeSpaltennamen[12]) {
                // Statment definieren entsprechend dem String Argument
                $this->statement = DB::get()->prepare("SELECT * FROM ticketarten WHERE endDatumTicketVerkauf = :string_ZeilenWertInSpalteValidiert ");
                // Statment Variablen binden
                $this->statementBinding = array(':string_ZeilenWertInSpalteValidiert' => $this->string_ZeilenWertInSpalteValidiert);
            } // maxTicketsProKauf
            else if ($string_SpaltenBeschriftung === $this->funktionGueltigeSpaltennamen[13]) {
                // Statment definieren entsprechend dem String Argument
                $this->statement = DB::get()->prepare("SELECT * FROM ticketarten WHERE maxTicketsProKauf = :string_ZeilenWertInSpalteValidiert ");
                // Statment Variablen binden
                $this->statementBinding = array(':string_ZeilenWertInSpalteValidiert' => $this->string_ZeilenWertInSpalteValidiert);
            } // createTime
            else if ($string_SpaltenBeschriftung === $this->funktionGueltigeSpaltennamen[14]) {
                // Statment definieren entsprechend dem String Argument
                $this->statement = DB::get()->prepare("SELECT * FROM ticketarten WHERE createTime = :string_ZeilenWertInSpalteValidiert ");
                // Statment Variablen binden
                $this->statementBinding = array(':string_ZeilenWertInSpalteValidiert' => $this->string_ZeilenWertInSpalteValidiert);
            } // updateTime
            else if ($string_SpaltenBeschriftung === $this->funktionGueltigeSpaltennamen[15]) {
                // Statment definieren entsprechend dem String Argument
                $this->statement = DB::get()->prepare("SELECT * FROM ticketarten WHERE updateTime = :string_ZeilenWertInSpalteValidiert ");
                // Statment Variablen binden
                $this->statementBinding = array(':string_ZeilenWertInSpalteValidiert' => $this->string_ZeilenWertInSpalteValidiert);
            } // administratoren_id
            else if ($string_SpaltenBeschriftung === $this->funktionGueltigeSpaltennamen[16]) {
                // Statment definieren entsprechend dem String Argument
                $this->statement = DB::get()->prepare("SELECT * FROM ticketarten WHERE administratoren_id = :string_ZeilenWertInSpalteValidiert ");
                // Statment Variablen binden
                $this->statementBinding = array(':string_ZeilenWertInSpalteValidiert' => $this->string_ZeilenWertInSpalteValidiert);
            } // administratoren_id
            else if ($string_SpaltenBeschriftung === $this->funktionGueltigeSpaltennamen[17]) {
                // Statment definieren entsprechend dem String Argument
                $this->statement = DB::get()->prepare("SELECT * FROM ticketarten WHERE verkaufteAnzahlTickets = :string_ZeilenWertInSpalteValidiert ");
                // Statment Variablen binden
                $this->statementBinding = array(':string_ZeilenWertInSpalteValidiert' => $this->string_ZeilenWertInSpalteValidiert);
            } // Der Eingabestring ist ungültig. Es geschieht kein Zugriff auf die DAtenbank
            else {
                return "Falscher Eingabestring für Spaltenabfrage . Folgender String ist nach interner Filterung entstanden: " . $this->string_SpaltenBeschriftungValidiert;
            }
        }


        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        /////////////////     PREPARED STATMEND AUFRUFEN
        /////////////////     ERROR HANDLING MIT TRY / CATCH        Das Error Handling wird über TRY und CATCH variante aufgefangen.
        /////////////////                                           Als Problemlösung ist in Catch im Moment nur die Ausgabe des Fehlers vorgesehen
        /////////////////                                           - das Problem muss im Moment manuell behoben werden und die Seite neu geladen werden
        /////////////////                                           Mit diesem Error Handling könnte der Programm absturz kontrolliert oder sogar behoben werden
        /////////////////
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        // Das oben definierte Statment wird nun ausgeführt
        try {
            //////////////////////////////// Statment ausführen     /////////////////////////////////////////////////////////////////////////////////////////////////////
            // Laden mit Fetchmode    -   FETCH_ASSOC (Standartvorgabe - Es werden die Werte als ssoziatives Arras zurückgegeben)
            // In die Hilfsvariable am anfamg der Zeile wird die Anzahl der geänderten Zeilen geschrieben.

            $this->statement->execute($this->statementBinding); // $this->statementLesenBinding

            // Ausgabe der Daten, sofern kein Fehler auftauchte und die Funktion im catch gefangen ist
            // Laden mit Fetchmode    -   FETCH_ASSOC
            $this->funktionLesenDaten = $this->statement->fetchAll(PDO::FETCH_ASSOC);

            // Der Returnwert beinhaltet die gelesenen Daten. Die Variable Zeit wird aber ohne Sekunden als returnwert gegeben
            return $this->funktionLesenDaten;

        } // überwachte Funktion im Fehlerfall mit CATCH abfangen
        catch (PDOException $e) {
            return ("Error: " . htmlspecialchars($e->getMessage()));
        }
    }







    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////     Methode                       Eintrage löschen  -  ALLE oder EINZELBEITRAG
    /////////////////
    /////////////////     ALLE                      :   Wird kein Parameter der Funktion mitgegeben, so werden alle Daten asu der ganzen Tabelle gelesen
    /////////////////
    /////////////////     EINZEL NACH ZEILE nach id :   Werden die ersten zwei Parameter belegt, so werden alle Zeilen von Startindex bis Endindex gelesen
    /////////////////     MIT START und ENDE
    /////////////////
    /////////////////     EINZEL NACH SPALTE        :   Werden alle Parameter belegt, so wird die gesamte Tabelle in der eingegebenen Spalte auf den ebenfalls eingegebenen
    /////////////////     MIT SPALTENWERTE              Wert durchsucgt. Alle diese werden zurückgegeben
    /////////////////                                   Dies ist nur mit Strings gedacht. Allfällige falsche unkonvertierungen werden nicht berücksischtigt
    /////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    public function Loeschen($string_SpaltenBeschriftung = "", $string_ZeilenWertInSpalte = "")
    {
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        /////////////////     Datenvalidierung          Schutz vor Cross Site Scripting
        /////////////////                               Dadurch wird das Risiko minimiert, dass fremdcode in das Script eingebunden werden kann, da nur erlaubte Zichen zugelassen werden
        /////////////////                               Zudem werden FEhler bei DAtanbank zugriff vermindert, da die DAten konsistenz mit der Datenbak sind
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        // Formatierung von Eingaben - Validierung zur Sicherheit sowie zur korrekten weiterverarbeitung
        // Mit dieser Funktion werden alle nicht html Zeichen entfernt. Somit wird das einschliessen von Schadfoftware durch Javascript vermindert
        // Diese werden beim lesen wieder decodiert mit der Funktion :   html_entity_decode()
        $this->string_ZeilenWertInSpalteValidiert = textValidieren($string_ZeilenWertInSpalte);
        $this->string_SpaltenBeschriftungValidiert = textValidieren($string_SpaltenBeschriftung);


        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        /////////////////     PREPARED STATMEND                     SCHUTZ VOR  SQL-Injections
        /////////////////     DEFINITION UND VARIABLEN              Diese dienen der Sicherheit bei der Abfrage auf die Datenbank. Die Anfragen an die Datenbank werden zuerts ausgewertet
        /////////////////     BINNDEN                               und erst dann werden die Variablen gebunden
        /////////////////
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


        //////////////////////////////// Statment definieren  und Variablen binden   /////////////////////////////////////////////////////////////////////////////////////////////////////

        // Statment Löschen:   alle  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // Ist der FAll, wenn alle Funktionsargumente gemäss Standart Initialiserung sind
        if ($string_SpaltenBeschriftung === "" && $string_ZeilenWertInSpalte === "") {

            // Statment definieren
            $this->statement = DB::get()->prepare("DELETE FROM ticketarten");
        }


        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // Statment Löschen:    alle mit:           spalte xx mit Inhalt yy
        // Ist der FAll, wenn Funktionsargumente 3 != "" ist
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        else if ($string_SpaltenBeschriftung !== "") {

            // Das Statment muss entsprechend des Tabellenaufbaues auf  gültigen Spaltennamen definiert werden. Die gültigen vergleichswerte für die Funktion sind
            // ganz am angang der Klasse definiert. DAs Array sieht folgendermasen aus :
            // ( 'administratoren_id', 'beschreibung', 'createTime', 'eventZeit', 'eventDatum', 'eventOrt', 'eventTime', 'id', 'title', 'updateTime', 'bild_1', 'bild_2', 'bild_3')

            // id
            if ($string_SpaltenBeschriftung === $this->funktionGueltigeSpaltennamen[0]) {
                // Statment definieren entsprechend dem String Argument
                $this->statement = DB::get()->prepare("DELETE FROM ticketarten WHERE id = :string_ZeilenWertInSpalteValidiert ");
                // Statment Variablen binden
                $this->statementBinding = array(':string_ZeilenWertInSpalteValidiert' => $this->string_ZeilenWertInSpalteValidiert);
            } // bild
            else if ($string_SpaltenBeschriftung === $this->funktionGueltigeSpaltennamen[1]) {
                // Statment definieren entsprechend dem String Argument
                $this->statement = DB::get()->prepare("DELETE FROM ticketarten  WHERE bild = :string_ZeilenWertInSpalteValidiert ");
                // Statment Variablen binden
                $this->statementBinding = array(':string_ZeilenWertInSpalteValidiert' => $this->string_ZeilenWertInSpalteValidiert);
            } // title
            else if ($string_SpaltenBeschriftung === $this->funktionGueltigeSpaltennamen[2]) {
                // Statment definieren entsprechend dem String Argument
                $this->statement = DB::get()->prepare("DELETE FROM ticketarten WHERE title = :string_ZeilenWertInSpalteValidiert ");
                // Statment Variablen binden
                // Statment Variablen binden
                $this->statementBinding = array(':string_ZeilenWertInSpalteValidiert' => $this->string_ZeilenWertInSpalteValidiert);
            } // beschreibung
            else if ($string_SpaltenBeschriftung === $this->funktionGueltigeSpaltennamen[3]) {
                // Statment definieren entsprechend dem String Argument
                $this->statement = DB::get()->prepare("DELETE FROM ticketarten WHERE beschreibung = :string_ZeilenWertInSpalteValidiert ");
                // Statment Variablen binden
                $this->statementBinding = array(':string_ZeilenWertInSpalteValidiert' => $this->string_ZeilenWertInSpalteValidiert);
            } // eventDatum
            else if ($string_SpaltenBeschriftung === $this->funktionGueltigeSpaltennamen[4]) {
                // Statment definieren entsprechend dem String Argument
                $this->statement = DB::get()->prepare("DELETE FROM ticketarten WHERE eventDatum = :string_ZeilenWertInSpalteValidiert ");
                // Statment Variablen binden
                $this->statementBinding = array(':string_ZeilenWertInSpalteValidiert' => $this->string_ZeilenWertInSpalteValidiert);
            } // eventZeit
            else if ($string_SpaltenBeschriftung === $this->funktionGueltigeSpaltennamen[5]) {
                // Statment definieren entsprechend dem String Argument
                $this->statement = DB::get()->prepare("DELETE FROM ticketarten WHERE eventZeit  = :string_ZeilenWertInSpalteValidiert ");
                // Statment Variablen binden
                // Statment Variablen binden
                $this->statementBinding = array(':string_ZeilenWertInSpalteValidiert' => $this->string_ZeilenWertInSpalteValidiert);
            } // eventOrt
            else if ($string_SpaltenBeschriftung === $this->funktionGueltigeSpaltennamen[6]) {
                // Statment definieren entsprechend dem String Argument
                $this->statementLesen = DB::get()->prepare("DELETE FROM ticketarten WHERE eventOrt = :string_ZeilenWertInSpalteValidiert ");
                // Statment Variablen binden
                $this->statementBinding = array(':string_ZeilenWertInSpalteValidiert' => $this->string_ZeilenWertInSpalteValidiert);
            } // eventAdresse
            else if ($string_SpaltenBeschriftung === $this->funktionGueltigeSpaltennamen[7]) {
                // Statment definieren entsprechend dem String Argument
                $this->statementLesen = DB::get()->prepare("DELETE FROM ticketarten WHERE eventAdresse = :string_ZeilenWertInSpalteValidiert ");
                // Statment Variablen binden
                $this->statementBinding = array(':string_ZeilenWertInSpalteValidiert' => $this->string_ZeilenWertInSpalteValidiert);
            } // ticketPreis
            else if ($string_SpaltenBeschriftung === $this->funktionGueltigeSpaltennamen[8]) {
                // Statment definieren entsprechend dem String Argument
                $this->statement = DB::get()->prepare("DELETE FROM ticketarten WHERE ticketPreis = :string_ZeilenWertInSpalteValidiert ");
                // Statment Variablen binden
                $this->statementBinding = array(':string_ZeilenWertInSpalteValidiert' => $this->string_ZeilenWertInSpalteValidiert);
            } // maximaleAnzahlTickets
            else if ($string_SpaltenBeschriftung === $this->funktionGueltigeSpaltennamen[9]) {
                // Statment definieren entsprechend dem String Argument
                $this->statement = DB::get()->prepare("DELETE FROM ticketarten WHERE  maximaleAnzahlTickets = :string_ZeilenWertInSpalteValidiert ");
                // Statment Variablen binden
                $this->statementBinding = array(':string_ZeilenWertInSpalteValidiert' => $this->string_ZeilenWertInSpalteValidiert);
            } // blockierteAnzahlTickets
            else if ($string_SpaltenBeschriftung === $this->funktionGueltigeSpaltennamen[10]) {
                // Statment definieren entsprechend dem String Argument
                $this->statement = DB::get()->prepare("DELETE FROM ticketarten WHERE blockierteAnzahlTickets     = :string_ZeilenWertInSpalteValidiert ");
                // Statment Variablen binden
                $this->statementBinding = array(':string_ZeilenWertInSpalteValidiert' => $this->string_ZeilenWertInSpalteValidiert);
            } // startDatumTicketVerkauf
            else if ($string_SpaltenBeschriftung === $this->funktionGueltigeSpaltennamen[11]) {
                // Statment definieren entsprechend dem String Argument
                $this->statement = DB::get()->prepare("DELETE FROM ticketarten WHERE startDatumTicketVerkauf = :string_ZeilenWertInSpalteValidiert ");
                // Statment Variablen binden
                $this->statementBinding = array(':string_ZeilenWertInSpalteValidiert' => $this->string_ZeilenWertInSpalteValidiert);
            } // endDatumTicketVerkauf
            else if ($string_SpaltenBeschriftung === $this->funktionGueltigeSpaltennamen[12]) {
                // Statment definieren entsprechend dem String Argument
                $this->statement = DB::get()->prepare("DELETE FROM ticketarten WHERE endDatumTicketVerkauf = :string_ZeilenWertInSpalteValidiert ");
                // Statment Variablen binden
                $this->statementBinding = array(':string_ZeilenWertInSpalteValidiert' => $this->string_ZeilenWertInSpalteValidiert);
            } // maxTicketsProKauf
            else if ($string_SpaltenBeschriftung === $this->funktionGueltigeSpaltennamen[13]) {
                // Statment definieren entsprechend dem String Argument
                $this->statement = DB::get()->prepare("DELETE FROM ticketarten WHERE maxTicketsProKauf = :string_ZeilenWertInSpalteValidiert ");
                // Statment Variablen binden
                $this->statementBinding = array(':string_ZeilenWertInSpalteValidiert' => $this->string_ZeilenWertInSpalteValidiert);
            } // createTime
            else if ($string_SpaltenBeschriftung === $this->funktionGueltigeSpaltennamen[14]) {
                // Statment definieren entsprechend dem String Argument
                $this->statement = DB::get()->prepare("DELETE FROM ticketarten WHERE createTime = :string_ZeilenWertInSpalteValidiert ");
                // Statment Variablen binden
                $this->statementBinding = array(':string_ZeilenWertInSpalteValidiert' => $this->string_ZeilenWertInSpalteValidiert);
            } // updateTime
            else if ($string_SpaltenBeschriftung === $this->funktionGueltigeSpaltennamen[15]) {
                // Statment definieren entsprechend dem String Argument
                $this->statement = DB::get()->prepare("DELETE FROM ticketarten WHERE updateTime = :string_ZeilenWertInSpalteValidiert ");
                // Statment Variablen binden
                $this->statementBinding = array(':string_ZeilenWertInSpalteValidiert' => $this->string_ZeilenWertInSpalteValidiert);
            } // administratoren_id
            else if ($string_SpaltenBeschriftung === $this->funktionGueltigeSpaltennamen[16]) {
                // Statment definieren entsprechend dem String Argument
                $this->statement = DB::get()->prepare("DELETE FROM ticketarten WHERE administratoren_id   = :string_ZeilenWertInSpalteValidiert ");
                // Statment Variablen binden
                $this->statementBinding = array(':string_ZeilenWertInSpalteValidiert' => $this->string_ZeilenWertInSpalteValidiert);
            } // administratoren_id
            else if ($string_SpaltenBeschriftung === $this->funktionGueltigeSpaltennamen[17]) {
                // Statment definieren entsprechend dem String Argument
                $this->statement = DB::get()->prepare("DELETE FROM ticketarten WHERE verkaufteAnzahlTickets   = :string_ZeilenWertInSpalteValidiert ");
                // Statment Variablen binden
                $this->statementBinding = array(':string_ZeilenWertInSpalteValidiert' => $this->string_ZeilenWertInSpalteValidiert);
            } // Der Eingabestring ist ungültig. Es geschieht kein Zugriff auf die DAtenbank
            else {
                return "Falscher Eingabestring für Spaltenabfrage . Folgender String ist nach interner Filterung entstanden: " . $this->string_SpaltenBeschriftungValidiert;
            }
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        /////////////////     PREPARED STATMEND AUFRUFEN
        /////////////////     ERROR HANDLING MIT TRY / CATCH        Das Error Handling wird über TRY und CATCH variante aufgefangen.
        /////////////////                                           Als Problemlösung ist in Catch im Moment nur die Ausgabe des Fehlers vorgesehen
        /////////////////                                           - das Problem muss im Moment manuell behoben werden und die Seite neu geladen werden
        /////////////////                                           Mit diesem Error Handling könnte der Programm absturz kontrolliert oder sogar behoben werden
        /////////////////
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        // Das oben definierte Statment wird nun ausgeführt
        try {
            //////////////////////////////// Statment ausführen     /////////////////////////////////////////////////////////////////////////////////////////////////////
            // Laden mit Fetchmode    -   FETCH_ASSOC (Standartvorgabe - Es werden die Werte als ssoziatives Arras zurückgegeben)

            $auftragErledigt = $this->statement->execute($this->statementBinding); // $this->statementLesenBinding


        } // überwachte Funktion im Fehlerfall mit CATCH abfangen
        catch (PDOException $e) {
            return ("Error: " . htmlspecialchars($e->getMessage()));
        }

        // Sofern kein Fehler auftauchte und die Funktion im catch gefangen ist, wird die Funktion regulär mit einem Returnwert beendet
        if ($auftragErledigt) {
            return "true";
        } // Auftrag nicht erledigt
        else {
            return "false";
        }
    }






    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////     Methode                           Eintrage updaten  -  EINZELBEITRAG
    /////////////////
    /////////////////
    /////////////////     EINE ZEILE NACH ID            :   In diesem Fall wird auf der Zeile der angegeben id eine oder mehrere Spalten neu angepasst. Dies ist abhängig von der anzahl
    /////////////////     MEHREREN SPALTEN                  Prameter, welche dem Array mitgegeben werden
    /////////////////
    /////////////////
    /////////////////     ALLE SPALTEN, WELCHE           :   In diesem Fall werden alle Spalten mit dem neuen Wert initialisiert, bei welchen die Spalte den aktuellen Wert
    /////////////////     EINEN GEWISSEN WERT                Gemäss der Eingegeben Variablen haben.
    /////////////////     BEINHALTEN                         Es können auch mehrere Spalten angegeben werden, welche in dieem Fall verändert werden sollen
    /////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    public function Update($integer_id = -1, $array_updateSpalte = [], $array_updateWert = [], $string_SpaltenBeschriftung = "", $string_ZeilenWertInSpalte = "")
    {
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        /////////////////     Datenvalidierung          Schutz vor Cross Site Scripting
        /////////////////                               Dadurch wird das Risiko minimiert, dass fremdcode in das Script eingebunden werden kann, da nur erlaubte Zichen zugelassen werden
        /////////////////                               Zudem werden FEhler bei DAtanbank zugriff vermindert, da die DAten konsistenz mit der Datenbak sind
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


        // Sonderzeichen werden in codierter VErsion dargestellt
        $this->string_ZeilenWertInSpalteValidiert = textValidieren($string_ZeilenWertInSpalte);


        // Validierung von Eingaben, welche nicht verarbeitet werden können - Funktionsabbruch
        // Die Arrays mit den Spaltenbezeichnungen und deren Werte werden in einem LOOP gefiltert
        // Gleichzeitig wird geschaut, ob die eingabe gültig ist. Alle Datenbank Variablen sind in einem Array abgelegt und werden damit verglichen
        if ($array_updateSpalte !== []) {

            for ($i = 0; $i < sizeof($array_updateSpalte); $i++) {
                // Zuerst wird die Eingabe gefiltert von unzulässigen Zeichen
                $this->array_updateSpalteValidiert[$i] = textValidieren($array_updateSpalte[$i]);
                // Zuletzt wird geprüft, ob die eingegeben Spaltenwerte überhaupt vorhanden sind, ansonsten gibt es einen Fehler
                // Die gültigen Stringeingaben sin in dieser Klasse in einem Array gespeichert
                for ($y = 0; $y < sizeof($this->funktionGueltigeSpaltennamen); $y++) {
                    // Eingabe ist korrekt
                    if ($this->array_updateSpalteValidiert[$i] === $this->funktionGueltigeSpaltennamen[$y]) {
                        // Die Variable wird auf TRUE gesetzt, sobald eine übereinstimmung gefunden wird
                        $this->bool_Validiert = true;
                    }
                }
                // Eingabe ist falsch
                if (!$this->bool_Validiert) {
                    return "Eingabe Spaltenname gefiltert auf Datenbank nicht vorhanden: " . $this->array_updateWertValidiert[$i];
                }
            }
        }


        // Validierung von Eingaben, welche nicht verarbeitet werden können - Funktionsabbruch
        // Die Arrays mit den Spaltenbezeichnungen und deren Werte werden in einem LOOP gefiltert
        // Gleichzeitig wird geschaut, ob die eingabe gültig ist. Alle Datenbank Variablen sind in einem Array abgelegt und werden damit verglichen
        if ($array_updateWert !== []) {
            for ($i = 0; $i < sizeof($array_updateWert); $i++) {
                $this->array_updateWertValidiert[$i] = textValidieren($array_updateWert[$i]);
            }
        }


        // Validierung von Eingaben, welche nicht verarbeitet werden können - Funktionsabbruch
        // Die Arrays mit den Spaltenbezeichnungen und deren Werte werden in einem LOOP gefiltert
        // Gleichzeitig wird geschaut, ob die eingabe gültig ist. Alle Datenbank Variablen sind in einem Array abgelegt und werden damit verglichen
        if ($string_SpaltenBeschriftung !== "") {

            // Zuerst wird die Eingabe gefiltert von unzulässigen Zeichen
            $this->string_SpaltenBeschriftungValidiert = textValidieren($string_SpaltenBeschriftung);
            // Zuletzt wird geprüft, ob die eingegeben Spaltenwerte überhaupt vorhanden sind, ansonsten gibt es einen Fehler
            // Die gültigen Stringeingaben sin in dieser Klasse in einem Array gespeichert
            for ($y = 0; $y < sizeof($this->funktionGueltigeSpaltennamen); $y++) {
                // Eingabe ist korrekt
                if ($this->string_SpaltenBeschriftungValidiert === $this->funktionGueltigeSpaltennamen[$y]) {
                    // Die Variable wird auf TRUE gesetzt, sobald eine übereinstimmung gefunden wird
                    $this->bool_Validiert = true;
                }
            }
            // Eingabe ist falsch
            if (!$this->bool_Validiert) {
                return "Eingabe Spaltenname gefiltert auf Datenbank nicht vorhanden: " . $this->string_SpaltenBeschriftungValidiert;
            }
        }


        // Die beiden Array müssen die gleiche Anzahl argumente aufweisen
        if (sizeof($array_updateWert) !== sizeof($array_updateSpalte)) {
            return "Die beiden Array haben nicht die gleiche Anzahl Argumente";
        }

        // Validierung von Eingaben, welche nicht verarbeitet werden können - Funktionsabbruch
        // Zahlen werden getestet ob sie auch wirklich Zahlen sind
        if (!is_numeric($integer_id)) {
            return "Administrator_id muss vom Typ Integer sein. Er ist vom Typ: " . gettype($integer_id);
        }


        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        /////////////////     PREPARED STATMEND                     SCHUTZ VOR  SQL-Injections
        /////////////////     DEFINITION UND VARIABLEN              Diese dienen der Sicherheit bei der Abfrage auf die Datenbank. Die Anfragen an die Datenbank werden zuerts ausgewertet
        /////////////////     BINNDEN                               und erst dann werden die Variablen gebunden
        /////////////////
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


        //////////////////////////////// Statment definieren  und Variablen binden   /////////////////////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////// EINE ZEILE NACH ID  und MEHREREN SPALTEN  /////////////////////////////////////////////////////////////////////////////////////////////////////

        // Statment Update:   In einereinzigen Zeile mit der id xx werden alle spalten, welche im array gespeichert sind aktualisiert  ////////////////////////////////////////
        // Ist der FAll, wenn eine id gesetzt wurde und jeweils die Arrays spalte und wert genau ein Element beinhalten und die Variablen suche nach Spalte mit Wert nicht gesetzt sind


        // Variablen definitionen
        $ausdruck = "";


        // Dazu ist eine SChleife nötig
        if ($integer_id != -1 && $string_SpaltenBeschriftung === "" && $string_ZeilenWertInSpalte === "") {

            // Ausdruck für Prepared Statment zusammen setzen
            for ($i = 0; $i < sizeof($array_updateSpalte); $i++) {

                // Ausdruck Statmend erstellen  - bei allen folge Elemente muss eine Koma Seperator am Schluss hinzugfügt werden, ausser beim letzten
                if ((sizeof($array_updateSpalte) - $i) == 1) {
                    $ausdruck .= $this->array_updateSpalteValidiert[$i] . " = :" . $this->array_updateSpalteValidiert[$i] . ", updateTime = CURRENT_TIMESTAMP";
                } // Kein Komma Seperator setzen, weil es ist der letzte Ausdruck
                else {
                    $ausdruck .= $this->array_updateSpalteValidiert[$i] . " = :" . $this->array_updateSpalteValidiert[$i] . ", ";
                }

                // Zusammen gesetzte Strings aus Variablen und Sonderzeichen für Array Eintrag erstellen
                $platzhalterSpalte = ":" . $this->array_updateSpalteValidiert[$i];
                $platzhalterSpaltenwert = $this->array_updateWertValidiert[$i];

                // multidimensionales Array für Statment Binding erstellen
                // Einzeleintrag pro LOOP speichern
                $this->statementBinding[$platzhalterSpalte] = $platzhalterSpaltenwert;
            }

            // Statment definieren
            $this->statement = DB::get()->prepare("UPDATE ticketarten SET $ausdruck");
        }




        //////////////////////////////// Statment definieren  und Variablen binden   /////////////////////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////// ALLE ZEILE MITWERT x IN SPALTEN  - eine oder mehrere Spalten können verändert werden  /////////////////////////////////////////////////////////////////////////////////////////////////////


        else if ($string_SpaltenBeschriftung !== "") {

            // Das Statment muss entsprechend des Tabellenaufbaues auf  gültigen Spaltennamen definiert werden. Die gültigen vergleichswerte für die Funktion sind
            // ganz am angang der Klasse definiert. DAs Array sieht folgendermasen aus :


            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            // Erster Teil von Statment  -  welche Spalten sollen verändert werden     ////////////////////////////////////////////////////////


            // Ausdruck für Prepared Statment zusammen setzen
            for ($i = 0; $i < sizeof($array_updateSpalte); $i++) {

                // Ausdruck Statmend erstellen  - bei allen folge Elemente muss eine Koma Seperator am Schluss hinzugfügt werden, ausser beim letzten
                if ((sizeof($array_updateSpalte) - $i) == 1) {
                    $ausdruck .= $this->array_updateSpalteValidiert[$i] . " = :" . $this->array_updateSpalteValidiert[$i] . ", updateTime = CURRENT_TIMESTAMP";
                } // Kein Komma Seperator setzen, weil es ist der letzte Ausdruck
                else {
                    $ausdruck .= $this->array_updateSpalteValidiert[$i] . " = :" . $this->array_updateSpalteValidiert[$i] . ", ";
                }

                // Zusammen gesetzte Strings aus Variablen und Sonderzeichen für Array Eintrag erstellen
                $platzhalterSpalte = ":" . $this->array_updateSpalteValidiert[$i];
                $platzhalterSpaltenwert = $this->array_updateWertValidiert[$i];

                // multidimensionales Array für Statment Binding erstellen
                // Einzeleintrag pro LOOP speichern
                $this->statementBinding[$platzhalterSpalte] = $platzhalterSpaltenwert;
            }

            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            // weiter Teil von Statment  -  WHERE AUSDRUCK  - welche Zeilen sollen verändert werden     ////////////////////////////////////////////////////////

            // Zusammen gesetzte Strings aus Variablen und Sonderzeichen zum zusammenbauen des Statments
            $platzhalterWhere = ":" . $this->string_SpaltenBeschriftungValidiert;
            $where = $this->string_SpaltenBeschriftungValidiert . " = :string_ZeilenWertInSpalteValidiert";

            // multidimensionales Array für Statment Binding erstellen
            $this->statementBinding[':string_ZeilenWertInSpalteValidiert'] = $this->string_ZeilenWertInSpalteValidiert;


            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            // Dritter Teil von Statment  -  Ausdruck zusammen setzen     ////////////////////////////////////////////////////////

            // Statment definieren
            $this->statement = DB::get()->prepare("UPDATE ticketarten SET $ausdruck WHERE  $where ");
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        /////////////////     PREPARED STATMEND AUFRUFEN
        /////////////////     ERROR HANDLING MIT TRY / CATCH        Das Error Handling wird über TRY und CATCH variante aufgefangen.
        /////////////////                                           Als Problemlösung ist in Catch im Moment nur die Ausgabe des Fehlers vorgesehen
        /////////////////                                           - das Problem muss im Moment manuell behoben werden und die Seite neu geladen werden
        /////////////////                                           Mit diesem Error Handling könnte der Programm absturz kontrolliert oder sogar behoben werden
        /////////////////
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // return $this->statement;

        // Das oben definierte Statment wird nun ausgeführt
        try {
            //////////////////////////////// Statment ausführen     /////////////////////////////////////////////////////////////////////////////////////////////////////
            // Laden mit Fetchmode    -   FETCH_ASSOC (Standartvorgabe - Es werden die Werte als ssoziatives Arras zurückgegeben)
            $auftragErledigt = $this->statement->execute($this->statementBinding); // $this->statementLesenBinding


        } // überwachte Funktion im Fehlerfall mit CATCH abfangen
        catch (PDOException $e) {
            return ("Error: " . htmlspecialchars($e->getMessage()));
        }

        // Sofern kein Fehler auftauchte und die Funktion im catch gefangen ist, wird die Funktion regulär mit einem Returnwert beendet
        if ($auftragErledigt) {
            return "true";
        } // Auftrag nicht erledigt
        else {
            return "false";
        }
    }




    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////     Methode                           TicketsBlockieren
    /////////////////
    /////////////////                                       Mit dieser Funktion wird auf der Datenbank bei einer Ticketbestellung  Tickets von der Gesamtferfügbarkeit abgebucht.
    /////////////////                                       Diese Abbuchung ist aber nicht definitiv, sondern die Tickets werden nur zeitlick für 10 Minuten blockiert. Die Startzeit
    /////////////////                                       gilt ab dem Timestamp der Variablen "updateTime"
    /////////////////                                       Die abgebuchten Tickets werden in einer n:n Tabelle "ticketarten_has_warenkorb" umgebucht. Um die Tickets wieder in den Verkauf
    /////////////////                                       zurück zu Buchen folgt eine weitere MEthode
    /////////////////
    /////////////////                                       RETURN VALUE:   ARRAY OF OBJEKTEN
    /////////////////                                                       Ein Objekt besteht aus den folgenden zwie Elementen:
    /////////////////
    /////////////////                                                       ["zustand"]         : kann false oder true sein. Bei false wurden keine Tickets umgebucht, da nicht mehr soviele vorhanden
    /////////////////                                                                             sind. Der Benutzer muss den Vorhang wiederholen.
    /////////////////                                                       ["ticketart_id"]    : Die id des Tickettyps, von welchem Tickets umgebucht werden wollten
    /////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    public function TicketsBlockieren($integer_warenkorb_ID = 0, $array_ticketart_ID = [], $array_anzahl = [])
    {
        // Die beiden Array müssen die gleiche Anzahl argumente aufweisen
        if (sizeof($array_anzahl) !== sizeof($array_ticketart_ID)) {
            return "Die beiden Array haben nicht die gleiche Anzahl Argumente";
        }

        // Zahlen werden getestet ob sie auch wirklich Zahlen sind
        if (!is_numeric($integer_warenkorb_ID)) {
            return "integer_warenkorb muss vom Typ Integer sein. Er ist vom Typ: " . gettype($integer_warenkorb_ID);
        }


        // Es werden pro Ticketart die gekauft werden soll ein seperater Durchgang mit aufbau des Statment und dessen ausführung sowie das lesen der veränderten DAten
        // ein ein einzelner Datenbank Zugriff gemacht
        // Die DAten werden über die updateSpalten unUpdateWerte Variablen eingelseen
        for ($i = 0; $i < sizeof($array_ticketart_ID); $i++) {

            // Variable für Query anzahl Tickets einbuchen bei Ticketarten anzahl verkauft
            $this->anzahlTicketsKaufen = 0;
            $this->anzahlTicketsLoeschen = 0;


            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            /////////////////     Datenvalidierung          Schutz vor Cross Site Scripting
            /////////////////                               Dadurch wird das Risiko minimiert, dass fremdcode in das Script eingebunden werden kann, da nur erlaubte Zichen zugelassen werden
            /////////////////                               Zudem werden FEhler bei DAtanbank zugriff vermindert, da die DAten konsistenz mit der Datenbak sind
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

            // Zahlen werden getestet ob sie auch wirklich Zahlen sind
            if (!is_numeric($array_ticketart_ID[$i])) {
                return "array_ticketart_ID muss vom Typ Integer sein. Er ist vom Typ: " . gettype($array_ticketart_ID[$i]);
            }

            // Zahlen werden getestet ob sie auch wirklich Zahlen sind
            if (!is_numeric($array_anzahl[$i])) {
                // return "array_anzahl muss vom Typ Integer sein. Er ist vom Typ: " . gettype($array_anzahl[$i]);
                $array_anzahl[$i] = 0;
            }


            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            /////////////////     ERSTER SQL QUERY                      Es muss geschaut werden, ob in diesem Warenkorb nereits solche Tickets reserviert wurden und nur ein update gemacht werden muss
            /////////////////                                           oder ob es ein neuer Eintrag ist
            /////////////////
            /////////////////
            /////////////////
            /////////////////
            /////////////////
            /////////////////
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


            //////////////////////////////// Statment definieren  und Variablen binden   /////////////////////////////////////////////////////////////////////////////////////////////////////

            // Statment definieren
            $this->statement = DB::get()->prepare("SELECT * FROM ticketarten_has_warenkorb WHERE warenkorb_id = :integer_warenkorb_ID AND ticketarten_id = :ticketarten_id");

            // Statment Variablen binden
            // Variablen werden mit Prepared Statment gebunden. Das Array wird danach der ausführenden Funktion übergeben
            $this->statementBinding = array(
                ':integer_warenkorb_ID' => $integer_warenkorb_ID,
                ':ticketarten_id' => $array_ticketart_ID[$i]
            );

            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            /////////////////     PREPARED STATMEND AUFRUFEN
            /////////////////     ERROR HANDLING MIT TRY / CATCH        Das Error Handling wird über TRY und CATCH variante aufgefangen.
            /////////////////                                           Als Problemlösung ist in Catch im Moment nur die Ausgabe des Fehlers vorgesehen
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

            // Das oben definierte Statment wird nun ausgeführt
            try {
                //////////////////////////////// Statment ausführen     /////////////////////////////////////////////////////////////////////////////////////////////////////
                // Laden mit Fetchmode    -   FETCH_ASSOC (Standartvorgabe - Es werden die Werte als ssoziatives Arras zurückgegeben)
                // In die Hilfsvariable am anfamg der Zeile wird die Anzahl der geänderten Zeilen geschrieben.

                $this->statement->execute($this->statementBinding); // $this->statementLesenBinding

                // Ausgabe der Daten, sofern kein Fehler auftauchte und die Funktion im catch gefangen ist
                // Laden mit Fetchmode    -   FETCH_ASSOC
                $this->funktionLesenDaten = $this->statement->fetchAll(PDO::FETCH_ASSOC);


            } // überwachte Funktion im Fehlerfall mit CATCH abfangen
            catch (PDOException $e) {
                return ("Error: " . htmlspecialchars($e->getMessage()));
            }


            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            /////////////////     Es wird berechnet anhand der DAtenbank einträge und der neuen Vorgabe, ob Tickets addiert oder subtrahiert werden müssen
            /////////////////
            /////////////////
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

            // Wert im Warenkorb ist kleiner - die Differenz wird im Warenkorb addiert und bei Tickearten abgebucht
            if ($this->funktionLesenDaten[0]['reservierteAnzahlTickets'] < $array_anzahl[$i]) {
                // Variablen für Query am Schluss für Ticketarten
                $this->anzahlTicketsKaufen = $array_anzahl[$i] - $this->funktionLesenDaten[0]['reservierteAnzahlTickets'];
            } // Wert im Warenkorb ist grösser - die Differenz wird im Warenkorb subtrahiert und bei Tickearten wieder freigegeben
            else {
                // Variablen für Query am Schluss für Ticketarten
                $this->anzahlTicketsKaufen = 0;
                $this->anzahlTicketsLoeschen = $this->funktionLesenDaten[0]['reservierteAnzahlTickets'] - $array_anzahl[$i];
            }


            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            /////////////////     Zweiter SQL QUERY                     Die geladenen Daten werde nausgewertet
            /////////////////                                           Ist noch gar kein Eintrag vorhanden, so wird ein neuer Datensatz angelegt. Ansosnten wird die allfällige Differenz zu den Tickets dazu
            /////////////////                                           oder Weggebucht bei Tickatarten Verkaufte Tickets
            /////////////////
            /////////////////
            /////////////////
            /////////////////
            /////////////////
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

            // Es ist noch gar kein Eintrag gefunden worden - Einen neuen Eintrag anlegen
            if ($this->funktionLesenDaten === []) {

                // Variablen für Query am Schluss für Ticketarten
                $this->anzahlTicketsKaufen = $array_anzahl[$i];

                //////////////////////////////// Statment definieren  und Variablen binden     /////////////////////////////////////////////////////////////////////////////////////////////////////

                // Statment definieren
                $this->statement = DB::get()->prepare(" INSERT INTO ticketarten_has_warenkorb( warenkorb_id, ticketarten_id, reservierteAnzahlTickets, createTime, updateTime)
                                                        VALUES      ( :warenkorb_id, :ticketarten_id, :reservierteAnzahlTickets, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)");

                // Statment Variablen binden
                // Variablen werden mit Prepared Statment gebunden. Das Array wird danach der ausführenden Funktion übergeben
                $this->statementBinding = array(
                    ':warenkorb_id' => $integer_warenkorb_ID,
                    ':ticketarten_id' => $array_ticketart_ID[$i],
                    ':reservierteAnzahlTickets' => $array_anzahl[$i]
                );

                ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                /////////////////     PREPARED STATMEND AUFRUFEN
                /////////////////     ERROR HANDLING MIT TRY / CATCH        Das Error Handling wird über TRY und CATCH variante aufgefangen.
                /////////////////                                           Als Problemlösung ist in Catch im Moment nur die Ausgabe des Fehlers vorgesehen
                ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

                // Das Error Handling wird über TRY und CATCH variante aufgefangen.
                // Als Problemlösung ist in Catch im Moment nur die Ausgabe des FEhlers vorgesehen - das Problem muss im Moment manuell behoben werden und die Seite neu geladen werden
                // überwachte Funktion mit TRY starten

                try {
                    //////////////////////////////// Statment ausführen     /////////////////////////////////////////////////////////////////////////////////////////////////////
                    $this->statement->execute($this->statementBinding);

                } // überwachte Funktion im Fehlerfall mit CATCH abfangen
                catch (PDOException $e) {
                    return ("Error: " . htmlspecialchars($e->getMessage()));
                }


            } // Ansonsten wenn bereits existent, dann wird der Wert gelesen
            else {

                // Tickets auf Datenbank addieren - es wurden Tickets im Warenkorb zeitabhängig blockiert/reserviert
                // Es können aber nicht mehr tickets reserviert werden als maximal zu verkauf - bereits verkaufte unnb anzüglich den aktuell blockierten Tickets in den WArenkörben
                if ($this->anzahlTicketsKaufen > 0) {
                    // Statment definieren
                    $this->statement = DB::get()->prepare("UPDATE ticketarten_has_warenkorb SET reservierteAnzahlTickets =  reservierteAnzahlTickets + :anzahlTickets, updateTime = CURRENT_TIMESTAMP 
                                                          WHERE warenkorb_id = :warenkorb_id AND ticketarten_id = :ticketarten_id");

                    // Statment Variablen binden
                    // Variablen werden mit Prepared Statment gebunden. Das Array wird danach der ausführenden Funktion übergeben
                    $this->statementBinding = array(
                        ':ticketarten_id' => $array_ticketart_ID[$i],
                        ':warenkorb_id' => $integer_warenkorb_ID,
                        ':anzahlTickets' => $this->anzahlTicketsKaufen
                    );
                } // Tickets aus DAtenbank löschen - es werden Tickets freigegeben
                else if ($this->anzahlTicketsLoeschen > 0) {
                    // Statment definieren
                    $this->statement = DB::get()->prepare("UPDATE ticketarten_has_warenkorb SET reservierteAnzahlTickets =  reservierteAnzahlTickets - :anzahlTickets, updateTime = CURRENT_TIMESTAMP 
                                                          WHERE warenkorb_id = :warenkorb_id AND ticketarten_id = :ticketarten_id");

                    // Statment Variablen binden
                    // Variablen werden mit Prepared Statment gebunden. Das Array wird danach der ausführenden Funktion übergeben
                    $this->statementBinding = array(
                        ':ticketarten_id' => $array_ticketart_ID[$i],
                        ':warenkorb_id' => $integer_warenkorb_ID,
                        ':anzahlTickets' => $this->anzahlTicketsLoeschen
                    );
                }

























                ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                /////////////////     PREPARED STATMEND AUFRUFEN
                /////////////////     ERROR HANDLING MIT TRY / CATCH        Das Error Handling wird über TRY und CATCH variante aufgefangen.
                /////////////////                                           Als Problemlösung ist in Catch im Moment nur die Ausgabe des Fehlers vorgesehen
                ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

                // Das Error Handling wird über TRY und CATCH variante aufgefangen.
                // Als Problemlösung ist in Catch im Moment nur die Ausgabe des FEhlers vorgesehen - das Problem muss im Moment manuell behoben werden und die Seite neu geladen werden
                // überwachte Funktion mit TRY starten
                try {

                    //////////////////////////////// Statment ausführen     /////////////////////////////////////////////////////////////////////////////////////////////////////
                    $this->statement->execute($this->statementBinding);

                } // überwachte Funktion im Fehlerfall mit CATCH abfangen
                catch (PDOException $e) {
                    return ("Error: " . htmlspecialchars($e->getMessage()));
                }
            }


            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            /////////////////     Dritter SQL QUERY                     Beim Tabellenblatt Tickearten wird die Variable AnzahlVerkaufteTickets angepasst
            /////////////////
            /////////////////
            /////////////////
            /////////////////
            /////////////////
            /////////////////
            /////////////////
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////













            // Tickets auf Datenbank addieren - es wurden Tickets im Warenkorb zeitabhängig blockiert/reserviert
            // Es können aber nicht mehr tickets reserviert werden als maximal zu verkauf - bereits verkaufte unnb anzüglich den aktuell blockierten Tickets in den WArenkörben
            if ($this->anzahlTicketsKaufen > 0) {
                // Statment definieren
                $this->statement = DB::get()->prepare("UPDATE ticketarten SET blockierteAnzahlTickets = blockierteAnzahlTickets + :anzahlTickets, updateTime = CURRENT_TIMESTAMP
                                              WHERE id = :ticketarten_id AND :anzahlTickets <= maximaleAnzahlTickets - verkaufteAnzahlTickets - blockierteAnzahlTickets");

                // Statment Variablen binden
                // Variablen werden mit Prepared Statment gebunden. Das Array wird danach der ausführenden Funktion übergeben
                $this->statementBinding = array(
                    ':ticketarten_id' => $array_ticketart_ID[$i],
                    ':anzahlTickets' => $this->anzahlTicketsKaufen
                );
            } // Tickets aus DAtenbank löschen - es werden Tickets freigegeben
            else if ($this->anzahlTicketsLoeschen > 0) {
                // Statment definieren
                $this->statement = DB::get()->prepare("UPDATE ticketarten SET blockierteAnzahlTickets = blockierteAnzahlTickets - :anzahlTickets, updateTime = CURRENT_TIMESTAMP WHERE id = :ticketarten_id");

                // Statment Variablen binden
                // Variablen werden mit Prepared Statment gebunden. Das Array wird danach der ausführenden Funktion übergeben
                $this->statementBinding = array(
                    ':ticketarten_id' => $array_ticketart_ID[$i],
                    ':anzahlTickets' => $this->anzahlTicketsLoeschen
                );
            }









            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            /////////////////     PREPARED STATMEND AUFRUFEN
            /////////////////     ERROR HANDLING MIT TRY / CATCH        Das Error Handling wird über TRY und CATCH variante aufgefangen.
            /////////////////                                           Als Problemlösung ist in Catch im Moment nur die Ausgabe des Fehlers vorgesehen
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

            // Statment wird nur ausgeführt, wenn es etwas zum verbuchen gibt
            if ( $this->anzahlTicketsKaufen > 0 || $this->anzahlTicketsLoeschen  > 0 ) {

                // Das Error Handling wird über TRY und CATCH variante aufgefangen.
                // Als Problemlösung ist in Catch im Moment nur die Ausgabe des FEhlers vorgesehen - das Problem muss im Moment manuell behoben werden und die Seite neu geladen werden
                // überwachte Funktion mit TRY starten
                try {

                    //////////////////////////////// Statment ausführen     /////////////////////////////////////////////////////////////////////////////////////////////////////
                    $auftragErledigt = $this->statement->execute($this->statementBinding);

                    // Sofern kein Fehler auftauchte und die Funktion im catch gefangen ist, und eine Spalte auch effektiv verändert wurde
                    // so wird in das Array ein "true geschrieben. Andernfals ein "false"
                    if ($auftragErledigt && $this->statement->rowCount() > 0) {

                        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                        /////////////////     Die Rückmedung besagt nur, dass der Query ausgeführt wurde. Es ist aber noch nicht definiert, ob die DAten verändert wurden
                        /////////////////     Wenn Alle Tickets verkauft waren beim execute, so wird trotzdem ein "true" zurückkommen. DAfür ist die funktion: rowCount()
                        /////////////////     Wenn nicht alle Bestellten Tickets gebucht werden können, so werden gar keine gebucht
                        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                        $this->array_effektiveAbbuchungen[$i]['zustand'] = 'true';
                        $this->array_effektiveAbbuchungen[$i]['ticketart_id'] = $array_ticketart_ID[$i];

                    }
                    // Auftrag wurde nicht ausgeführt weil keine Veränderung gemacht wurde oder zuwenig Tickets zum verkauf vorhanden sind
                    else {
                        $this->array_effektiveAbbuchungen[$i]['zustand'] = 'false';
                        $this->array_effektiveAbbuchungen[$i]['ticketart_id'] = $array_ticketart_ID[$i];

                        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                        /////////////////     Vierter SQL QUERY                     Sofern dir Tickets nicht verbucht werden konnten, so werden Sie in der Tabelle
                        /////////////////                                           ticketarten_has_warenkorb zurückgebucht
                        /////////////////
                        /////////////////
                        /////////////////
                        /////////////////
                        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

                        $this->statement = DB::get()->prepare("UPDATE ticketarten_has_warenkorb SET reservierteAnzahlTickets = :reservierteAnzahlTickets, updateTime = CURRENT_TIMESTAMP 
                                                              WHERE warenkorb_id = :warenkorb_id AND ticketarten_id = :ticketarten_id  ");

                        // Statment Variablen binden
                        // Variablen werden mit Prepared Statment gebunden. Das Array wird danach der ausführenden Funktion übergeben
                        $this->statementBinding = array(
                            ':warenkorb_id' => $integer_warenkorb_ID,
                            ':ticketarten_id' => $array_ticketart_ID[$i],
                            ':reservierteAnzahlTickets' => $this->funktionLesenDaten[0]['reservierteAnzahlTickets']
                        );

                        // Das Error Handling wird über TRY und CATCH variante aufgefangen.
                        // Als Problemlösung ist in Catch im Moment nur die Ausgabe des FEhlers vorgesehen - das Problem muss im Moment manuell behoben werden und die Seite neu geladen werden
                        // überwachte Funktion mit TRY starten
                        try {

                            //////////////////////////////// Statment ausführen     /////////////////////////////////////////////////////////////////////////////////////////////////////
                            $this->statement->execute($this->statementBinding);

                        } // überwachte Funktion im Fehlerfall mit CATCH abfangen
                        catch (PDOException $e) {
                            return ("Error: " . htmlspecialchars($e->getMessage()));
                        }
                    }

                } // überwachte Funktion im Fehlerfall mit CATCH abfangen
                catch (PDOException $e) {
                    return ("Error: " . htmlspecialchars($e->getMessage()));
                }
            }

        }
        // FOR SCHLAUFE IST BEENDET
        // Rückgabe des Return Value
        return $this->array_effektiveAbbuchungen;
    }







    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////     Methode                           warenkorbTicketsFreigeben
    /////////////////
    /////////////////                                       Mit dieser Funktion werden alle Warenkörbe auf reservierte Tickets kontrolliert, wwelche länger als 10Min blockiert sind
    /////////////////                                       Diese Tickets werden aus dem WArenkorb gelöscht und beim Blatt Ticketarten bei der Spalte blockierteAnzahlTickets wieder abgezogen
    /////////////////                                       Simit werden wieder blockierte Tickets zum Verkauf freigegeben
    /////////////////
    /////////////////                                       RETURN VALUE: Array of Objekte -> folgende Objekt Elemente:
    /////////////////                                       ['id'] : id der Ticketart des indexes
    /////////////////                                       ['FreieTickets'] : total der freigewordenen Tickets pro Tiketart
    /////////////////
    /////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    public function warenkorbTicketsFreigeben($array_ticketart_ID)
    {
        for ($i=0; $i < sizeof( $array_ticketart_ID ); $i++) {

            // Variablen initialisieren
            $this->totalFreigewordeneTickets = 0;

            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            /////////////////     ERSTER SQL QUERY                      Alle Warenkörbe nach abgelaufener blockierten Tickets durchsuchen
            /////////////////                                           Tickets dürfen maximal für 10 Minuten blockiert werden
            /////////////////
            /////////////////
            /////////////////
            /////////////////
            /////////////////
            /////////////////
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


            //////////////////////////////// Statment definieren  und Variablen binden   /////////////////////////////////////////////////////////////////////////////////////////////////////

            // Statment definieren
            $this->statement = DB::get()->prepare("SELECT * FROM ticketarten_has_warenkorb WHERE TIMESTAMPDIFF(SECOND, updateTime, CURRENT_TIMESTAMP ) > 600 AND ticketarten_id = :ticketarten_id");

            // Statment Variablen binden
            // Variablen werden mit Prepared Statment gebunden. Das Array wird danach der ausführenden Funktion übergeben
            $this->statementBinding = array(
                ':ticketarten_id' => $array_ticketart_ID[$i]
            );


            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            /////////////////     PREPARED STATMEND AUFRUFEN
            /////////////////     ERROR HANDLING MIT TRY / CATCH        Das Error Handling wird über TRY und CATCH variante aufgefangen.
            /////////////////                                           Als Problemlösung ist in Catch im Moment nur die Ausgabe des Fehlers vorgesehen
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

            // Das oben definierte Statment wird nun ausgeführt
            try {
                //////////////////////////////// Statment ausführen     /////////////////////////////////////////////////////////////////////////////////////////////////////
                // Laden mit Fetchmode    -   FETCH_ASSOC (Standartvorgabe - Es werden die Werte als ssoziatives Arras zurückgegeben)
                // In die Hilfsvariable am anfamg der Zeile wird die Anzahl der geänderten Zeilen geschrieben.

                $this->statement->execute($this->statementBinding); // $this->statementLesenBinding

                // Ausgabe der Daten, sofern kein Fehler auftauchte und die Funktion im catch gefangen ist
                // Laden mit Fetchmode    -   FETCH_ASSOC
                $this->funktionLesenDaten = $this->statement->fetchAll(PDO::FETCH_ASSOC);

                // Nun  werden aus allen gefundenen Warenkörben die total Anzahl freigewordenen Tickets zusammengezählt, damit diese
                // Vom Blatt Ticketarten abgebucht und werden können
                for ($y = 0; $y < sizeof($this->funktionLesenDaten); $y++) {

                    // Gesamtzahl zu dieser Variable aaddierren
                    $this->totalFreigewordeneTickets = $this->totalFreigewordeneTickets + $this->funktionLesenDaten[$y]['reservierteAnzahlTickets'];
                }


            } // überwachte Funktion im Fehlerfall mit CATCH abfangen
            catch (PDOException $e) {
                return ("Error: " . htmlspecialchars($e->getMessage()));
            }

            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            /////////////////     Zweiter SQL QUERY                     Alle Warenkorbeinträge welche zuvor mittels select gelesen wurden löschen von der DAtenbank
            /////////////////                                           Es werden alle mittels WHERE auf die vorhandenen id angesprochen
            /////////////////
            /////////////////
            /////////////////                                                   Wid nur ausgwführt, sofern bei DAten LEsen in Query Einträge gefunden wurde
            /////////////////
            /////////////////
            /////////////////
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

            // Wir nur ausgeführt, wenn auch DAten gefunden wurden in Query 1
            if( isset( $this->funktionLesenDaten ) && $this->funktionLesenDaten !== [] ) {

                //////////////////////////////// Statment definieren  und Variablen binden   /////////////////////////////////////////////////////////////////////////////////////////////////////

                // Variablen initialisieren
                $this->statementBinding = [];

                // Starteil von Query
                $ausdruck = 'DELETE FROM ticketarten_has_warenkorb WHERE id in (';

                // Mittlerer und Endteil des Querys anfügen
                for ($y = 0; $y < sizeof($this->funktionLesenDaten); $y++) {

                    // Am Ende des Statments folgt noch der Abschlussteil
                    if ((sizeof($this->funktionLesenDaten) - $y) == 1) {
                        $ausdruck = $ausdruck .':value' . $y . ')';
                    } // Repetetiever mittelteil des Querys
                    else {
                        $ausdruck = $ausdruck .':value' . $y . ', ';
                    }


                    // multidimensionales Array für Statment Binding erstellen
                    // Einzeleintrag pro LOOP speichern
                    $this->statementBinding[':value' . $y] = $this->funktionLesenDaten[$y]['id'];

                }

                // Kompletes Statment definieren
                $this->statement = DB::get()->prepare($ausdruck);


                ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                /////////////////     PREPARED STATMEND AUFRUFEN
                /////////////////     ERROR HANDLING MIT TRY / CATCH
                ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


                // Das oben definierte Statment wird nun ausgeführt
                try {
                    //////////////////////////////// Statment ausführen     /////////////////////////////////////////////////////////////////////////////////////////////////////
                    $this->statement->execute($this->statementBinding); // $this->statementLesenBinding

                } // überwachte Funktion im Fehlerfall mit CATCH abfangen
                catch (PDOException $e) {
                    return ("Error: " . htmlspecialchars($e->getMessage()));
                }


                ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                /////////////////     VIERTES SQL QUERY                     Im Tabellenblatt Ticketarten die Anzahl total fereigewordene Tickets wieder freigeben
                /////////////////                                           Retour Buchen der Variablen
                /////////////////
                /////////////////
                /////////////////
                /////////////////
                /////////////////
                /////////////////
                ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

                //////////////////////////////// Statment definieren  und Variablen binden   /////////////////////////////////////////////////////////////////////////////////////////////////////

                // Statment definieren
                $this->statement = DB::get()->prepare("UPDATE ticketarten SET blockierteAnzahlTickets = blockierteAnzahlTickets - :anzahlTickets, updateTime = CURRENT_TIMESTAMP WHERE id = :ticketarten_id");

                // Statment Variablen binden
                // Variablen werden mit Prepared Statment gebunden. Das Array wird danach der ausführenden Funktion übergeben
                $this->statementBinding = array(
                    ':ticketarten_id' => $array_ticketart_ID[$i],
                    ':anzahlTickets' => $this->totalFreigewordeneTickets
                );


                ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                /////////////////     PREPARED STATMEND AUFRUFEN
                /////////////////     ERROR HANDLING MIT TRY / CATCH
                ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


                // Das oben definierte Statment wird nun ausgeführt
                try {
                    //////////////////////////////// Statment ausführen     /////////////////////////////////////////////////////////////////////////////////////////////////////
                    $this->statement->execute($this->statementBinding); // $this->statementLesenBinding

                    // DAten speichern für Return Value
                    // $this->array_funktionLesenDatenProTicketId[$i]['Daten'] = $this->funktionLesenDaten;
                    $this->array_funktionLesenDatenProTicketId[$i]['id'] = $array_ticketart_ID[$i];
                    $this->array_funktionLesenDatenProTicketId[$i]['FreieTickets'] = $this->totalFreigewordeneTickets;



                } // überwachte Funktion im Fehlerfall mit CATCH abfangen
                catch (PDOException $e) {
                    return ("Error: " . htmlspecialchars($e->getMessage()));
                }
            }

        }
        // For Schlaufe beendet Es weerden die gelöschten Einträge als Array zurückgegeben
        return $this->array_funktionLesenDatenProTicketId;

    }






    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////     Methode                           TicketsKaufen
    /////////////////
    /////////////////                                       Die Tickets werden aus dem blockierten in den Verkauften Zustand gewechselt
    /////////////////                                       Es werden alle Tickets erzeugt
    /////////////////
    /////////////////
    /////////////////
    /////////////////
    /////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    public function TicketsKaufen($integer_warenkorbID, $array_ticketart_ID, $array_anzahlTickets)
    {
        for ($i = 0; $i < sizeof($array_ticketart_ID); $i++) {

            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            /////////////////     ERSTER SQL QUERY                      verkaufte Tickets aus Warenkorb löschen (tabelle ticketarten_has_warenkorb)
            /////////////////
            /////////////////
            /////////////////
            /////////////////
            /////////////////
            /////////////////
            /////////////////
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


            //////////////////////////////// Statment definieren  und Variablen binden   /////////////////////////////////////////////////////////////////////////////////////////////////////

            // Starteil von Query
            $this->statement = DB::get()->prepare("DELETE FROM ticketarten_has_warenkorb WHERE warenkorb_id = :warenkorb_id AND ticketarten_id = :ticketarten_id ");

            // Statment Variablen binden
            // Variablen werden mit Prepared Statment gebunden. Das Array wird danach der ausführenden Funktion übergeben
            $this->statementBinding = array(
                ':ticketarten_id' => $array_ticketart_ID[$i],
                ':warenkorb_id' => $integer_warenkorbID
            );

            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            /////////////////     PREPARED STATMEND AUFRUFEN
            /////////////////     ERROR HANDLING MIT TRY / CATCH        Das Error Handling wird über TRY und CATCH variante aufgefangen.
            /////////////////                                           Als Problemlösung ist in Catch im Moment nur die Ausgabe des Fehlers vorgesehen
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

            // Das oben definierte Statment wird nun ausgeführt
            try {
                //////////////////////////////// Statment ausführen     /////////////////////////////////////////////////////////////////////////////////////////////////////
                $this->freigabeQuery = $this->statement->execute($this->statementBinding); // $this->statementLesenBinding


            } // überwachte Funktion im Fehlerfall mit CATCH abfangen
            catch (PDOException $e) {
                return ("Error: " . htmlspecialchars($e->getMessage()));
            }

            // Die folgenden Zwei Querys dürfen nur abgearbeitet werden, sofern der erste erfolgreich war
            if ( $this->statement->rowCount() > 0) {

                ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                /////////////////     ZWEITER SQL QUERY                      Tickets bei Tabelle Tickketarten als verkauft abbuchen
                /////////////////
                /////////////////
                /////////////////
                /////////////////
                /////////////////
                /////////////////
                /////////////////
                ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


                //////////////////////////////// Statment definieren  und Variablen binden   /////////////////////////////////////////////////////////////////////////////////////////////////////

                // Statment definieren
                $this->statement = DB::get()->prepare("UPDATE ticketarten SET verkaufteAnzahlTickets := verkaufteAnzahlTickets + :anzahlTickets, 
                                                    blockierteAnzahlTickets := blockierteAnzahlTickets - :anzahlTickets WHERE id = :ticketarten_id");

                // Statment Variablen binden
                // Variablen werden mit Prepared Statment gebunden. Das Array wird danach der ausführenden Funktion übergeben
                $this->statementBinding = array(
                    ':ticketarten_id' => $array_ticketart_ID[$i],
                    ':anzahlTickets' => $array_anzahlTickets[$i]
                );


                ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                /////////////////     PREPARED STATMEND AUFRUFEN
                /////////////////     ERROR HANDLING MIT TRY / CATCH        Das Error Handling wird über TRY und CATCH variante aufgefangen.
                /////////////////                                           Als Problemlösung ist in Catch im Moment nur die Ausgabe des Fehlers vorgesehen
                ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

                // Das oben definierte Statment wird nun ausgeführt
                try {
                    //////////////////////////////// Statment ausführen     /////////////////////////////////////////////////////////////////////////////////////////////////////
                    $this->statement->execute($this->statementBinding); // $this->statementLesenBinding


                } // überwachte Funktion im Fehlerfall mit CATCH abfangen
                catch (PDOException $e) {
                    return ("Error: " . htmlspecialchars($e->getMessage()));
                }


                ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                /////////////////     ZWEITER SQL QUERY                      Tickets erstellen
                /////////////////
                /////////////////
                /////////////////
                /////////////////
                /////////////////
                /////////////////
                /////////////////
                ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

                // Pro Ticket eine Schlaufe
                for ($y = 0; $y < $array_anzahlTickets[$i]; $y++) {

                    // Statment definieren
                    $this->statement = DB::get()->prepare(" INSERT INTO tickets( ticketNummer, createTime, updateTime, ticketarten_id, warenkorb_id )
                                                VALUES      ( :ticketNummer, CURRENT_TIMESTAMP , CURRENT_TIMESTAMP, :ticketarten_id, :warenkorb_id)");

                    // Statment Variablen binden
                    // Variablen werden mit Prepared Statment gebunden. Das Array wird danach der ausführenden Funktion übergeben
                    $this->statementBinding = array(
                        ':ticketNummer' => 1,
                        ':ticketarten_id' => $array_ticketart_ID[$i],
                        ':warenkorb_id' => $integer_warenkorbID
                    );


                    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                    /////////////////     PREPARED STATMEND AUFRUFEN
                    /////////////////     ERROR HANDLING MIT TRY / CATCH        Das Error Handling wird über TRY und CATCH variante aufgefangen.
                    /////////////////                                           Als Problemlösung ist in Catch im Moment nur die Ausgabe des Fehlers vorgesehen
                    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

                    // Das oben definierte Statment wird nun ausgeführt
                    try {
                        //////////////////////////////// Statment ausführen     /////////////////////////////////////////////////////////////////////////////////////////////////////
                        $this->statement->execute($this->statementBinding); // $this->statementLesenBinding


                    } // überwachte Funktion im Fehlerfall mit CATCH abfangen
                    catch (PDOException $e) {
                        return ("Error: " . htmlspecialchars($e->getMessage()));
                    }
                }
                // Ende Schlaufe Tickets erstellen
            }

        }
        // Ende Schlaufe Funktionsduchgang
    }
}


















?>