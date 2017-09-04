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
class class_SqlTabelleTicketarten_Warenkorb
{

    // Definition von Privaten Variablen - Für Variablen die möglicherweise in verschiedenen Funktionen gebraucht werden oder in übergeortneten Blöcken  {}

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

    // Variable Strings für Funktionsargumente Tabelle nach Spalte durchsuchen werden zentral in einem string definiert
    private $funktionGueltigeSpaltennamen = array('id','ticketarten_id', 'warenkorb_id', 'reservierteAnzahlTickets', 'createTime', 'updateTime');







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
            $this->statement = DB::get()->prepare("SELECT * FROM ticketarten_has_warenkorb");
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
                $this->statement = DB::get()->prepare("SELECT * FROM ticketarten_has_warenkorb WHERE id = :string_ZeilenWertInSpalteValidiert");
                // Statment Variablen binden
                $this->statementBinding = array(':string_ZeilenWertInSpalteValidiert' => $this->string_ZeilenWertInSpalteValidiert);
            } // ticketarten_id
            else if ($string_SpaltenBeschriftung === $this->funktionGueltigeSpaltennamen[1]) {
                // Statment definieren entsprechend dem String Argument
                $this->statement = DB::get()->prepare("SELECT * FROM ticketarten_has_warenkorb  WHERE ticketarten_id = :string_ZeilenWertInSpalteValidiert ");
                // Statment Variablen binden
                $this->statementBinding = array(':string_ZeilenWertInSpalteValidiert' => $this->string_ZeilenWertInSpalteValidiert);
            } // warenkorb_id
            else if ($string_SpaltenBeschriftung === $this->funktionGueltigeSpaltennamen[2]) {
                // Statment definieren entsprechend dem String Argument
                $this->statement = DB::get()->prepare("SELECT * FROM ticketarten_has_warenkorb  WHERE warenkorb_id = :string_ZeilenWertInSpalteValidiert ");
                // Statment Variablen binden
                $this->statementBinding = array(':string_ZeilenWertInSpalteValidiert' => $this->string_ZeilenWertInSpalteValidiert);
            } // createTime
            else if ($string_SpaltenBeschriftung === $this->funktionGueltigeSpaltennamen[3]) {
                // Statment definieren entsprechend dem String Argument
                $this->statement = DB::get()->prepare("SELECT * FROM ticketarten_has_warenkorb WHERE reservierteAnzahlTickets = :string_ZeilenWertInSpalteValidiert ");
                // Statment Variablen binden
                $this->statementBinding = array(':string_ZeilenWertInSpalteValidiert' => $this->string_ZeilenWertInSpalteValidiert);
            } // updateTime
            else if ($string_SpaltenBeschriftung === $this->funktionGueltigeSpaltennamen[4]) {
                // Statment definieren entsprechend dem String Argument
                $this->statement = DB::get()->prepare("SELECT * FROM ticketarten_has_warenkorb WHERE createTime = :string_ZeilenWertInSpalteValidiert ");
                // Statment Variablen binden
                $this->statementBinding = array(':string_ZeilenWertInSpalteValidiert' => $this->string_ZeilenWertInSpalteValidiert);
            } // Der Eingabestring ist ungültig. Es geschieht kein Zugriff auf die DAtenbank
            else if ($string_SpaltenBeschriftung === $this->funktionGueltigeSpaltennamen[5]) {
                // Statment definieren entsprechend dem String Argument
                $this->statement = DB::get()->prepare("SELECT * FROM ticketarten_has_warenkorb WHERE updateTime = :string_ZeilenWertInSpalteValidiert ");
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

}


?>