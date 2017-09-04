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
class class_SqlTabelleTickets
{

    // Definition von Privaten Variablen - Für Variablen die möglicherweise in verschiedenen Funktionen gebraucht werden oder in übergeortneten Blöcken  {}

    // Funktion NeuerEintrag
    // Funktionsargmente wurden beim Validieren eventuell bewusst verändert. Dies sind nun die gefilterten und Validierten Argumente
    private $ticketNummer_Gefiltert = "";


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

    private $bool_Validiert = false ;

    // Variable Strings für Funktionsargumente Tabelle nach Spalte durchsuchen werden zentral in einem string definiert
    private $funktionGueltigeSpaltennamen = array( 'id', 'ticketNummer', 'createTime', 'updateTime', 'ticketarten_id', 'warenkorb_id');


    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////     Methode          Neuer Eintrag
    /////////////////                      Mit dieser Funktion kann ein neuer Eintrag auf der Datenbank in die Tabelle Band gemacht werden
    /////////////////                      Der Parameter Administrator ist zwingend nötig. Ist auf der SQL Datenbank kein Admininistrator erfasst, so gibt es einen Fehler,
    /////////////////                      weil eine zwingende Relation vorhanden ist
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    public function NeuerEintrag($ticketNummer = "", $ticketarten_id = Null, $warenkorb_id = Null)
    {

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        /////////////////     Datenvalidierung          Schutz vor Cross Site Scripting
        /////////////////                               Dadurch wird das Risiko minimiert, dass fremdcode in das Script eingebunden werden kann, da nur erlaubte Zichen zugelassen werden
        /////////////////                               Zudem werden FEhler bei DAtanbank zugriff vermindert, da die DAten konsistenz mit der Datenbak sind
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


        // Formatierung von Eingaben - Validierung zur Sicherheit sowie zur korrekten weiterverarbeitung
        // Mit dieser Funktion werden alle nicht html Zeichen entfernt. Somit wird das einschliessen von Schadfoftware durch Javascript vermindert
        // Diese werden beim lesen wieder decodiert mit der Funktion :   html_entity_decode()
        $this->ticketNummer_Gefiltert = textValidieren($ticketNummer);

        // Validierung von Eingaben, welche nicht verarbeitet werden können - Funktionsabbruch
        // Zahlen werden getestet ob sie auch wirklich Zahlen sind
        if (!is_numeric($ticketarten_id)) {
            return "tickets_id muss vom Typ Integer sein. Er ist vom Typ: " . gettype($ticketarten_id);
        }
        // Zahlen werden getestet ob sie auch wirklich Zahlen sind
        if (!is_numeric($warenkorb_id)) {
            return "Kunden_id muss vom Typ Integer sein. Er ist vom Typ: " . gettype($warenkorb_id);
        }


        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        /////////////////     PREPARED STATMEND                     SCHUTZ VOR  SQL-Injections
        /////////////////     DEFINITION UND VARIABLEN              Diese dienen der Sicherheit bei der Abfrage auf die Datenbank. Die Anfragen an die Datenbank werden zuerts ausgewertet
        /////////////////     BINNDEN                               und erst dann werden die Variablen gebunden
        /////////////////
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


        //////////////////////////////// Statment definieren  und Variablen binden     /////////////////////////////////////////////////////////////////////////////////////////////////////

        // Statment definieren
        $statement = DB::get()->prepare(" INSERT INTO tickets( ticketNummer, createTime, updateTime, Ticketarten_id, Kunden_id)
                                                VALUES      ( :ticketNummer_Gefiltert, CURRENT_TIMESTAMP , CURRENT_TIMESTAMP, :ticketarten_id, :warenkorb_id)");

        // Statment Variablen binden
        // Variablen werden mit Prepared Statment gebunden. Das Array wird danach der ausführenden Funktion übergeben
        $statementBinding = array(
            ':ticketNummer_Gefiltert' => $this->ticketNummer_Gefiltert,
            ':ticketarten_id' => $ticketarten_id,
            ':warenkorb_id' => $warenkorb_id
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
            return("Error: " . htmlspecialchars($e->getMessage()));
        }

        // Sofern kein Fehler auftauchte und die Funktion im catch gefangen ist, wird die Funktion regulär mit einem Returnwert beendet
        if ( $auftragErledigt) {
            return "true";
        }
        // Auftrag nicht erledigt
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
            $this->statement = DB::get()->prepare("SELECT * FROM tickets");
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
                $this->statement = DB::get()->prepare("SELECT * FROM tickets WHERE id = :string_ZeilenWertInSpalteValidiert ");
                // Statment Variablen binden
                $this->statementBinding = array(':string_ZeilenWertInSpalteValidiert' => $this->string_ZeilenWertInSpalteValidiert);
            } // ticketNummer
            else if ($string_SpaltenBeschriftung === $this->funktionGueltigeSpaltennamen[1]) {
                // Statment definieren entsprechend dem String Argument
                $this->statement = DB::get()->prepare("SELECT * FROM tickets  WHERE ticketNummer = :string_ZeilenWertInSpalteValidiert ");
                // Statment Variablen binden
                $this->statementBinding = array(':string_ZeilenWertInSpalteValidiert' => $this->string_ZeilenWertInSpalteValidiert);
            } // createTime
            else if ($string_SpaltenBeschriftung === $this->funktionGueltigeSpaltennamen[2]) {
                // Statment definieren entsprechend dem String Argument
                $this->statement = DB::get()->prepare("SELECT * FROM tickets WHERE createTime = :string_ZeilenWertInSpalteValidiert ");
                // Statment Variablen binden
                $this->statementBinding = array(':string_ZeilenWertInSpalteValidiert' => $this->string_ZeilenWertInSpalteValidiert);
            } // updateTime
            else if ($string_SpaltenBeschriftung === $this->funktionGueltigeSpaltennamen[3]) {
                // Statment definieren entsprechend dem String Argument
                $this->statement = DB::get()->prepare("SELECT * FROM tickets WHERE updateTime = :string_ZeilenWertInSpalteValidiert ");
                // Statment Variablen binden
                // Statment Variablen binden
                $this->statementBinding = array(':string_ZeilenWertInSpalteValidiert' => $this->string_ZeilenWertInSpalteValidiert);
            } // Ticketarten_id
            else if ($string_SpaltenBeschriftung === $this->funktionGueltigeSpaltennamen[4]) {
                // Statment definieren entsprechend dem String Argument
                $this->statement = DB::get()->prepare("SELECT * FROM tickets WHERE ticketarten_id  = :string_ZeilenWertInSpalteValidiert ");
                // Statment Variablen binden
                $this->statementBinding = array(':string_ZeilenWertInSpalteValidiert' => $this->string_ZeilenWertInSpalteValidiert);
            } // Kunden_id
            else if ($string_SpaltenBeschriftung === $this->funktionGueltigeSpaltennamen[5]) {
                // Statment definieren entsprechend dem String Argument
                $this->statement = DB::get()->prepare("SELECT * FROM tickets WHERE warenkorb_id = :string_ZeilenWertInSpalteValidiert ");
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
            return("Error: " . htmlspecialchars($e->getMessage()));
        }
    }




    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////     Methode                       LesenTickets_Joint_Ticketarten  -  ALLE oder EINZELBEITRAG
    /////////////////                                   Mit dieser Funktion wird ein Join aus den beiden Tabellen Tickets und Ticketarten gemacht zu einer Tabelle
    /////////////////
    /////////////////
    /////////////////     ALLE                      :   Wird kein Parameter der Funktion mitgegeben, so werden alle Daten asu der ganzen Tabelle gelesen
    /////////////////
    /////////////////
    /////////////////     EINZEL NACH SPALTE        :   Werden alle Parameter belegt, so wird die gesamte Tabelle in der eingegebenen Spalte auf den ebenfalls eingegebenen
    /////////////////     MIT SPALTENWERTE              Wert durchsucgt. Alle diese werden zurückgegeben
    /////////////////                                   Dies ist nur mit Strings gedacht. Allfällige falsche unkonvertierungen werden nicht berücksischtigt
    /////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    public function LesenTickets_Join_Ticketarten($string_SpaltenBeschriftung = "", $string_ZeilenWertInSpalte = "")
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
            $this->statement = DB::get()->prepare("  SELECT t.id, t.ticketNummer, t.createTime , t.ticketarten_id, t.warenkorb_id,
                                                        art.bild, art.title, art.beschreibung, art.eventDatum, art.eventZeit, art.eventOrt, art.eventAdresse, art.ticketPreis       
                                                     FROM tickets t 
                                                     LEFT JOIN ticketarten art ON t.ticketarten_id = art.id");
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
            if ($string_SpaltenBeschriftung === 'id') {
                // Statment definieren entsprechend dem String Argument
                $this->statement = DB::get()->prepare("SELECT t.id, t.ticketNummer, t.createTime , t.ticketarten_id, t.warenkorb_id,
                                                        art.bild, art.title, art.beschreibung, art.eventDatum, art.eventZeit, art.eventOrt, art.eventAdresse, art.ticketPreis       
                                                       FROM tickets t 
                                                       LEFT JOIN ticketarten art ON t.ticketarten_id = art.id 
                                                       WHERE id = :string_ZeilenWertInSpalteValidiert ");
                // Statment Variablen binden
                $this->statementBinding = array(':string_ZeilenWertInSpalteValidiert' => $this->string_ZeilenWertInSpalteValidiert);
            }
            // ticketNummer
            else if ($string_SpaltenBeschriftung === 'ticketNummer' ) {
                // Statment definieren entsprechend dem String Argument
                $this->statement = DB::get()->prepare("SELECT t.id, t.ticketNummer, t.createTime , t.ticketarten_id, t.warenkorb_id,
                                                        art.bild, art.title, art.beschreibung, art.eventDatum, art.eventZeit, art.eventOrt, art.eventAdresse, art.ticketPreis       
                                                       FROM tickets t 
                                                       LEFT JOIN ticketarten art ON t.ticketarten_id = art.id 
                                                       WHERE ticketNummer = :string_ZeilenWertInSpalteValidiert ");
                // Statment Variablen binden
                $this->statementBinding = array(':string_ZeilenWertInSpalteValidiert' => $this->string_ZeilenWertInSpalteValidiert);
            }
            // createTime
            else if ($string_SpaltenBeschriftung === 'createTime' ) {
                // Statment definieren entsprechend dem String Argument
                $this->statement = DB::get()->prepare("SELECT t.id, t.ticketNummer, t.createTime , t.ticketarten_id, t.warenkorb_id,
                                                        art.bild, art.title, art.beschreibung, art.eventDatum, art.eventZeit, art.eventOrt, art.eventAdresse, art.ticketPreis       
                                                       FROM tickets t 
                                                       LEFT JOIN ticketarten art ON t.ticketarten_id = art.id 
                                                       WHERE createTime = :string_ZeilenWertInSpalteValidiert ");
                // Statment Variablen binden
                $this->statementBinding = array(':string_ZeilenWertInSpalteValidiert' => $this->string_ZeilenWertInSpalteValidiert);
            }
            // ticketarten_id
            else if ($string_SpaltenBeschriftung === 'ticketarten_id' ) {
                // Statment definieren entsprechend dem String Argument
                $this->statement = DB::get()->prepare("SELECT t.id, t.ticketNummer, t.createTime , t.ticketarten_id, t.warenkorb_id,
                                                        art.bild, art.title, art.beschreibung, art.eventDatum, art.eventZeit, art.eventOrt, art.eventAdresse, art.ticketPreis       
                                                       FROM tickets t 
                                                       LEFT JOIN ticketarten art ON t.ticketarten_id = art.id 
                                                       WHERE ticketarten_id = :string_ZeilenWertInSpalteValidiert ");
                // Statment Variablen binden
                $this->statementBinding = array(':string_ZeilenWertInSpalteValidiert' => $this->string_ZeilenWertInSpalteValidiert);
            }
            // warenkorb_id
            else if ($string_SpaltenBeschriftung === 'warenkorb_id' ) {
                // Statment definieren entsprechend dem String Argument
                $this->statement = DB::get()->prepare("SELECT t.id, t.ticketNummer, t.createTime , t.ticketarten_id, t.warenkorb_id,
                                                        art.bild, art.title, art.beschreibung, art.eventDatum, art.eventZeit, art.eventOrt, art.eventAdresse, art.ticketPreis       
                                                       FROM tickets t 
                                                       LEFT JOIN ticketarten art ON t.ticketarten_id = art.id 
                                                       WHERE warenkorb_id = :string_ZeilenWertInSpalteValidiert ");
                // Statment Variablen binden
                $this->statementBinding = array(':string_ZeilenWertInSpalteValidiert' => $this->string_ZeilenWertInSpalteValidiert);
            }
            // bild
            else if ($string_SpaltenBeschriftung === 'bild' ) {
                // Statment definieren entsprechend dem String Argument
                $this->statement = DB::get()->prepare("SELECT t.id, t.ticketNummer, t.createTime , t.ticketarten_id, t.warenkorb_id,
                                                        art.bild, art.title, art.beschreibung, art.eventDatum, art.eventZeit, art.eventOrt, art.eventAdresse, art.ticketPreis       
                                                       FROM tickets t 
                                                       LEFT JOIN ticketarten art ON t.ticketarten_id = art.id 
                                                       WHERE bild = :string_ZeilenWertInSpalteValidiert ");
                // Statment Variablen binden
                $this->statementBinding = array(':string_ZeilenWertInSpalteValidiert' => $this->string_ZeilenWertInSpalteValidiert);
            }
            // title
            else if ($string_SpaltenBeschriftung === 'title' ) {
                // Statment definieren entsprechend dem String Argument
                $this->statement = DB::get()->prepare("SELECT t.id, t.ticketNummer, t.createTime , t.ticketarten_id, t.warenkorb_id,
                                                        art.bild, art.title, art.beschreibung, art.eventDatum, art.eventZeit, art.eventOrt, art.eventAdresse, art.ticketPreis       
                                                       FROM tickets t 
                                                       LEFT JOIN ticketarten art ON t.ticketarten_id = art.id 
                                                       WHERE title = :string_ZeilenWertInSpalteValidiert ");
                // Statment Variablen binden
                $this->statementBinding = array(':string_ZeilenWertInSpalteValidiert' => $this->string_ZeilenWertInSpalteValidiert);
            }
            // beschreibung
            else if ($string_SpaltenBeschriftung === 'beschreibung' ) {
                // Statment definieren entsprechend dem String Argument
                $this->statement = DB::get()->prepare("SELECT t.id, t.ticketNummer, t.createTime , t.ticketarten_id, t.warenkorb_id,
                                                        art.bild, art.title, art.beschreibung, art.eventDatum, art.eventZeit, art.eventOrt, art.eventAdresse, art.ticketPreis       
                                                       FROM tickets t 
                                                       LEFT JOIN ticketarten art ON t.ticketarten_id = art.id 
                                                       WHERE beschreibung = :string_ZeilenWertInSpalteValidiert ");
                // Statment Variablen binden
                $this->statementBinding = array(':string_ZeilenWertInSpalteValidiert' => $this->string_ZeilenWertInSpalteValidiert);
            }
            // eventDatum
            else if ($string_SpaltenBeschriftung === 'eventDatum' ) {
                // Statment definieren entsprechend dem String Argument
                $this->statement = DB::get()->prepare("SELECT t.id, t.ticketNummer, t.createTime , t.ticketarten_id, t.warenkorb_id,
                                                        art.bild, art.title, art.beschreibung, art.eventDatum, art.eventZeit, art.eventOrt, art.eventAdresse, art.ticketPreis       
                                                       FROM tickets t 
                                                       LEFT JOIN ticketarten art ON t.ticketarten_id = art.id 
                                                       WHERE eventDatum = :string_ZeilenWertInSpalteValidiert ");
                // Statment Variablen binden
                $this->statementBinding = array(':string_ZeilenWertInSpalteValidiert' => $this->string_ZeilenWertInSpalteValidiert);
            }
            // eventZeit
            else if ($string_SpaltenBeschriftung === 'eventZeit' ) {
                // Statment definieren entsprechend dem String Argument
                $this->statement = DB::get()->prepare("SELECT t.id, t.ticketNummer, t.createTime , t.ticketarten_id, t.warenkorb_id,
                                                        art.bild, art.title, art.beschreibung, art.eventDatum, art.eventZeit, art.eventOrt, art.eventAdresse, art.ticketPreis       
                                                       FROM tickets t 
                                                       LEFT JOIN ticketarten art ON t.ticketarten_id = art.id 
                                                       WHERE eventZeit = :string_ZeilenWertInSpalteValidiert ");
                // Statment Variablen binden
                $this->statementBinding = array(':string_ZeilenWertInSpalteValidiert' => $this->string_ZeilenWertInSpalteValidiert);
            }
            // eventOrt
            else if ($string_SpaltenBeschriftung === 'eventOrt' ) {
                // Statment definieren entsprechend dem String Argument
                $this->statement = DB::get()->prepare("SELECT t.id, t.ticketNummer, t.createTime , t.ticketarten_id, t.warenkorb_id,
                                                        art.bild, art.title, art.beschreibung, art.eventDatum, art.eventZeit, art.eventOrt, art.eventAdresse, art.ticketPreis       
                                                       FROM tickets t 
                                                       LEFT JOIN ticketarten art ON t.ticketarten_id = art.id 
                                                       WHERE eventOrt = :string_ZeilenWertInSpalteValidiert ");
                // Statment Variablen binden
                $this->statementBinding = array(':string_ZeilenWertInSpalteValidiert' => $this->string_ZeilenWertInSpalteValidiert);
            }
            // eventAdresse
            else if ($string_SpaltenBeschriftung === 'eventAdresse' ) {
                // Statment definieren entsprechend dem String Argument
                $this->statement = DB::get()->prepare("SELECT t.id, t.ticketNummer, t.createTime , t.ticketarten_id, t.warenkorb_id,
                                                        art.bild, art.title, art.beschreibung, art.eventDatum, art.eventZeit, art.eventOrt, art.eventAdresse, art.ticketPreis       
                                                       FROM tickets t 
                                                       LEFT JOIN ticketarten art ON t.ticketarten_id = art.id 
                                                       WHERE eventAdresse = :string_ZeilenWertInSpalteValidiert ");
                // Statment Variablen binden
                $this->statementBinding = array(':string_ZeilenWertInSpalteValidiert' => $this->string_ZeilenWertInSpalteValidiert);
            }
            // ticketPreis
            else if ($string_SpaltenBeschriftung === 'ticketPreis' ) {
                // Statment definieren entsprechend dem String Argument
                $this->statement = DB::get()->prepare("SELECT t.id, t.ticketNummer, t.createTime , t.ticketarten_id, t.warenkorb_id,
                                                        art.bild, art.title, art.beschreibung, art.eventDatum, art.eventZeit, art.eventOrt, art.eventAdresse, art.ticketPreis       
                                                       FROM tickets t 
                                                       LEFT JOIN ticketarten art ON t.ticketarten_id = art.id 
                                                       WHERE ticketPreis = :string_ZeilenWertInSpalteValidiert ");
                // Statment Variablen binden
                $this->statementBinding = array(':string_ZeilenWertInSpalteValidiert' => $this->string_ZeilenWertInSpalteValidiert);
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
            return("Error: " . htmlspecialchars($e->getMessage()));
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
            $this->statement = DB::get()->prepare("DELETE FROM tickets");
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
                $this->statement = DB::get()->prepare("DELETE FROM tickets WHERE id = :string_ZeilenWertInSpalteValidiert ");
                // Statment Variablen binden
                $this->statementBinding = array(':string_ZeilenWertInSpalteValidiert' => $this->string_ZeilenWertInSpalteValidiert);
            } // ticketNummer
            else if ($string_SpaltenBeschriftung === $this->funktionGueltigeSpaltennamen[1]) {
                // Statment definieren entsprechend dem String Argument
                $this->statement = DB::get()->prepare("DELETE FROM tickets  WHERE ticketNummer = :string_ZeilenWertInSpalteValidiert ");
                // Statment Variablen binden
                $this->statementBinding = array(':string_ZeilenWertInSpalteValidiert' => $this->string_ZeilenWertInSpalteValidiert);
            } // createTime
            else if ($string_SpaltenBeschriftung === $this->funktionGueltigeSpaltennamen[2]) {
                // Statment definieren entsprechend dem String Argument
                $this->statement = DB::get()->prepare("DELETE FROM tickets WHERE createTime = :string_ZeilenWertInSpalteValidiert ");
                // Statment Variablen binden
                $this->statementBinding = array(':string_ZeilenWertInSpalteValidiert' => $this->string_ZeilenWertInSpalteValidiert);
            } // updateTime
            else if ($string_SpaltenBeschriftung === $this->funktionGueltigeSpaltennamen[3]) {
                // Statment definieren entsprechend dem String Argument
                $this->statement = DB::get()->prepare("DELETE FROM tickets WHERE updateTime = :string_ZeilenWertInSpalteValidiert ");
                // Statment Variablen binden
                $this->statementBinding = array(':string_ZeilenWertInSpalteValidiert' => $this->string_ZeilenWertInSpalteValidiert);
            } // Ticketarten_id
            else if ($string_SpaltenBeschriftung === $this->funktionGueltigeSpaltennamen[4]) {
                // Statment definieren entsprechend dem String Argument
                $this->statement = DB::get()->prepare("DELETE FROM tickets WHERE ticketarten_id  = :string_ZeilenWertInSpalteValidiert ");
                // Statment Variablen binden
                // Statment Variablen binden
                $this->statementBinding = array(':string_ZeilenWertInSpalteValidiert' => $this->string_ZeilenWertInSpalteValidiert);
            } // Kunden_id
            else if ($string_SpaltenBeschriftung === $this->funktionGueltigeSpaltennamen[5]) {
                // Statment definieren entsprechend dem String Argument
                $this->statementLesen = DB::get()->prepare("DELETE FROM tickets WHERE warenkorb_id = :string_ZeilenWertInSpalteValidiert ");
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
            return("Error: " . htmlspecialchars($e->getMessage()));
        }

        // Sofern kein Fehler auftauchte und die Funktion im catch gefangen ist, wird die Funktion regulär mit einem Returnwert beendet
        if ( $auftragErledigt) {
            return "true";
        }
        // Auftrag nicht erledigt
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
                if ( (sizeof($array_updateSpalte) - $i) == 1) {
                    $ausdruck .= $this->array_updateSpalteValidiert[$i] . " = :" . $this->array_updateSpalteValidiert[$i] .", updateTime = CURRENT_TIMESTAMP";
                } // Kein Komma Seperator setzen, weil es ist der letzte Ausdruck
                else {
                    $ausdruck .= $this->array_updateSpalteValidiert[$i] . " = :" . $this->array_updateSpalteValidiert[$i] . ", ";
                }

                // Zusammen gesetzte Strings aus Variablen und Sonderzeichen für Array Eintrag erstellen
                $platzhalterSpalte = ":" . $this->array_updateSpalteValidiert[$i];
                $platzhalterSpaltenwert =  $this->array_updateWertValidiert[$i] ;

                // multidimensionales Array für Statment Binding erstellen
                // Einzeleintrag pro LOOP speichern
                $this->statementBinding[$platzhalterSpalte] = $platzhalterSpaltenwert;
            }

            // Statment definieren
            $this->statement = DB::get()->prepare("UPDATE tickets SET $ausdruck");
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
                if ( (sizeof($array_updateSpalte) - $i) == 1) {
                    $ausdruck .= $this->array_updateSpalteValidiert[$i] . " = :" . $this->array_updateSpalteValidiert[$i] .", updateTime = CURRENT_TIMESTAMP";
                } // Kein Komma Seperator setzen, weil es ist der letzte Ausdruck
                else {
                    $ausdruck .= $this->array_updateSpalteValidiert[$i] . " = :" . $this->array_updateSpalteValidiert[$i] . ", ";
                }

                // Zusammen gesetzte Strings aus Variablen und Sonderzeichen für Array Eintrag erstellen
                $platzhalterSpalte = ":" . $this->array_updateSpalteValidiert[$i];
                $platzhalterSpaltenwert =  $this->array_updateWertValidiert[$i] ;

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
            $this->statement = DB::get()->prepare("UPDATE tickets SET $ausdruck WHERE  $where ");
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
            return("Error: " . htmlspecialchars($e->getMessage()));
        }

        // Sofern kein Fehler auftauchte und die Funktion im catch gefangen ist, wird die Funktion regulär mit einem Returnwert beendet
        if ( $auftragErledigt) {
            return "true";
        }
        // Auftrag nicht erledigt
        else {
            return "false";
        }
    }

}





?>