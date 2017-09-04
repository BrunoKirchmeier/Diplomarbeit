<?php

// Ich habe den Zeichensatz auf der Datenbank von utf8_general_ci auf utf8_unicode_ci umgestellt
// Bei ersterem werden bei gewissen Funktionen (z.B. LIKE oder UPDATE) Umlaut gleichbedeuten behandelt wie die Normalen Buchstaben. Zum Beispiel ü=u , etc...
// DAs ergibt mir Probleme bei Suchen besthender DAten - Zum BEispiel ob ein USername bereits verwendet wird oider nicht
// https://www.php.de/forum/webentwicklung/datenbanken/22652-like-unterscheidet-keine-umlaute

// Durch die HEaderinformationen kann der Client FEhlerauswertungen machen, wenn die JSON DAten nicht korrekt sind
header("Content-type:application/json; charset=UTF-8");


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////    Include Files php          Es werden zugelcih Objekte mit Klassen generiert
/////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

require_once "klassen/DP.php";
require_once "../allgemein/validierungen.php";
require_once "klassen/class_SqlTabelleBand.php";
require_once "klassen/class_SqlTabelleAdministrator.php";
require_once "klassen/class_SqlTabelleTicketarten.php";
require_once "klassen/class_SqlTabelleKunden.php";
require_once "klassen/class_SqlTabelleTickets.php";
require_once "klassen/class_SqlTabelleWarenkorb.php";
require_once "klassen/class_SqlTabelleTicketarten_Warenkorb.php";


// Objekt Bands instanzieren
$bandList = new class_SqlTabelleBand();
// Objekt Administrator instanzieren
$admin = new class_SqlTabelleAdministrator();
// Objekt Ticktarten instanzieren
$ticketarten = new class_SqlTabelleTicketarten();
// Objekt Ticktarten instanzieren
$kunden = new class_SqlTabelleKunden();
// Objekt Ticktarten instanzieren
$tickets = new class_SqlTabelleTickets();
// Objekt Ticktarten instanzieren
$warenkorb = new class_SqlTabelleWarenkorb();
// Objekt Ticktarten instanzieren
$ticketarten_Warenkorb = new class_SqlTabelleTicketarten_Warenkorb();



// Variable für Rückmeldung Client - Ausser bei lesenden Aufgaben werden direkt die Daten ausgegeben
$ajaxAuftragsStatus = false;


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////     Authentifizierung für Ajax Zugriff        Damit nicht jeder ohne weiteres auf diese Daten zugreifen kann
/////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// Sofern Felder belegt sind und die Richtigen Werte beinhalten,  werden die Header Dateien   NICHT ausgegeben und der Zugriff auf die Daten erlaubt
// Der HEader wird nur gesendet, wenn die php Seite direkt aufegrufen wird. Bei einem Ajax Call werden einfach keine DAten mitgeliefert
if (! (isset($_SERVER['PHP_AUTH_USER'], $_SERVER['PHP_AUTH_PW'])
    && $_SERVER['PHP_AUTH_USER'] == 'admin'
    && $_SERVER['PHP_AUTH_PW'] == 'diplomarbeit')

// Headerdateien an Client bei Ajax CALL
// Falsche Anmmeldeinformation weil "if Bedingung" nicht erfüllt, Anmelde HEader wird an Client versendet
) {
    header('WWW-Authenticate: Basic realm="Restricted area"');
    header('HTTP/1.1 401 Unauthorized');
    exit;
}




////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////     AJAX Daten empfangen von Client       Die Daten können bei Übertragung mittels JSON nicht mit den Superglobalen Variablen $_POST und $_GET empfangen werden
/////////////////                                           Sie müssen als Rohdaten aus dem folgenden Stream gelesen werden
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Lesen der DAten aus dem Stream
$jsonClientDatenRoh =  file_get_contents("php://input");

// Der JSON String wird nun in ein PHP Multi Assoziatives Array umgewandelt, damit die einzelnen Argumente gelesen werden können
// Das Array kann nun für if vergleiche folgendermassen ausgelesen werden :    $jsonClientDaten['parameter'] === 'suchen'
$jsonClientDaten = json_decode($jsonClientDatenRoh, true);  // true







////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////     SQL DATENBANK TABELLENBLATT BAND ANSPRECHEN
/////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

if ($jsonClientDaten['tabelle'] === "band") {

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////     Neuer Einzelner Eintrag in Datenbank geenerieren
    /////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // Einzelner Eintrag schreiben
    if ($jsonClientDaten['funktion'] === "schreiben") {

        $ajaxAuftragsStatus = $bandList->NeuerEintrag($jsonClientDaten['datensatz'][0], $jsonClientDaten['datensatz'][1], $jsonClientDaten['datensatz'][2], $jsonClientDaten['datensatz'][3], $jsonClientDaten['datensatz'][4],
                                $jsonClientDaten['datensatz'][5], $jsonClientDaten['datensatz'][6], $jsonClientDaten['datensatz'][7], $jsonClientDaten['datensatz'][8], $jsonClientDaten['datensatz'][9],
                                $jsonClientDaten['datensatz'][10], $jsonClientDaten['datensatz'][11], $jsonClientDaten['datensatz'][12], $jsonClientDaten['datensatz'][13]);
        // Meldung an Client : Auftragsstatus : Auftrag erfolgreich erledigt
        if ( $ajaxAuftragsStatus === "true" ){
            echo json_encode("true" , JSON_NUMERIC_CHECK);
        }
        // Meldung an Client : Auftragsstatus : Auftrag nicht erledigt - Text Rückmeldung der Fehlerquelle
        else {
            echo json_encode( $ajaxAuftragsStatus, JSON_NUMERIC_CHECK );
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////     Einträge aus Datenbank löschen
    /////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // Beiträge loeschen
    if ($jsonClientDaten['funktion'] === "loeschen") {
        // Alle Beiträge löschen
        if ($jsonClientDaten['parameter'] === "alle") {
            $ajaxAuftragsStatus = $bandList->Loeschen();
            // Meldung an Client : Auftragsstatus : Auftrag erfolgreich erledigt
            if ( $ajaxAuftragsStatus === "true" ){
                echo json_encode("true" );
            }
            // Meldung an Client : Auftragsstatus : Auftrag nicht erledigt - Text Rückmeldung der Fehlerquelle
            else {
                echo json_encode( $ajaxAuftragsStatus );
            }
        }
        // Alle Beiträge nach Spaltenname mit bestimmten Spaltenwert löschen
        if ($jsonClientDaten['parameter'] === "suchen") {
            $ajaxAuftragsStatus = $bandList->Loeschen($jsonClientDaten["spaltenName"], $jsonClientDaten["spaltenWert"]);
            // Meldung an Client : Auftragsstatus : Auftrag erfolgreich erledigt
            if ( $ajaxAuftragsStatus === "true" ){
                echo json_encode("true" );
            }
            // Meldung an Client : Auftragsstatus : Auftrag nicht erledigt - Text Rückmeldung der Fehlerquelle
            else {
                echo json_encode( $ajaxAuftragsStatus );
            }
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////     Einträge aus Datenbank updaten
    /////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // Beiträge verändert (updaten
    if ($jsonClientDaten['funktion'] === "update") {
        // In allen Beiträgen die Spalte x den neuen Wert y schreiben
        if ($jsonClientDaten['parameter'] === "alle") {
            $ajaxAuftragsStatus = $bandList->Update();
            // Meldung an Client : Auftragsstatus : Auftrag erfolgreich erledigt
            if ( $ajaxAuftragsStatus === "true" ){
                echo json_encode("true" );
            }
            // Meldung an Client : Auftragsstatus : Auftrag nicht erledigt - Text Rückmeldung der Fehlerquelle
            else {
                echo json_encode( $ajaxAuftragsStatus );
            }
        }
        // In der Zeile mit der id x alle Spalten welche im Arrray mitgegeben werden verändern
        if ($jsonClientDaten['parameter'] === "id") {
            $ajaxAuftragsStatus = $bandList->Update($jsonClientDaten["idZeile"], $jsonClientDaten["updateSpalte"], $jsonClientDaten["updateWert"]);
            // Meldung an Client : Auftragsstatus : Auftrag erfolgreich erledigt
            if ( $ajaxAuftragsStatus === "true" ){
                echo json_encode("true" );
            }
            // Meldung an Client : Auftragsstatus : Auftrag nicht erledigt - Text Rückmeldung der Fehlerquelle
            else {
                echo json_encode( $ajaxAuftragsStatus );
            }
        }
        // Alle Beiträge nach Spaltenname mit bestimmten Spaltenwert durchsuchen. In allen treffern alle Spalten welche mit dem Array mitgegeben werden verändern
        if ($jsonClientDaten['parameter'] === "suchen") {
            $ajaxAuftragsStatus = $bandList->Update(-1, $jsonClientDaten["updateSpalte"], $jsonClientDaten["updateWert"], $jsonClientDaten["spaltenName"], $jsonClientDaten["spaltenWert"]);
            // Meldung an Client : Auftragsstatus : Auftrag erfolgreich erledigt
            if ( $ajaxAuftragsStatus === "true" ){
                echo json_encode("true" );
            }
            // Meldung an Client : Auftragsstatus : Auftrag nicht erledigt - Text Rückmeldung der Fehlerquelle
            else {
                echo json_encode( $ajaxAuftragsStatus );
            }
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////     Einträge aus Datenbank Lesen
    /////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // Beiträge Lesen
    if ($jsonClientDaten['funktion'] === "lesen") {
        // Alle Beiträge lesen
        if ($jsonClientDaten['parameter'] === "alle") {
            echo json_encode($bandList->Lesen(), JSON_NUMERIC_CHECK );
        }
        // Alle Beiträge nach Spaltenname mit bestimmten Spaltenwert durchsuchen. Alle Elemente mit Spalteninhalt ausgeben
        if ($jsonClientDaten['parameter'] === "suchen") {
            echo json_encode($bandList->Lesen($jsonClientDaten["spaltenName"], $jsonClientDaten["spaltenWert"]), JSON_NUMERIC_CHECK );
        }
    }
}






////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////     SQL DATENBANK TABELLENBLATT ADMINISTRATOR ANSPRECHEN
/////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

if ($jsonClientDaten['tabelle'] === "admin") {

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////     Neuer Einzelner Eintrag in Datenbank geenerieren
    /////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // Einzelner Eintrag schreiben
    if ($jsonClientDaten['funktion'] === "schreiben") {

        $ajaxAuftragsStatus = $admin->NeuerEintrag($jsonClientDaten['datensatz'][0], $jsonClientDaten['datensatz'][1], $jsonClientDaten['datensatz'][2], $jsonClientDaten['datensatz'][3], $jsonClientDaten['datensatz'][4] );
        // Meldung an Client : Auftragsstatus : Auftrag erfolgreich erledigt
        if ( $ajaxAuftragsStatus === "true" ){
            echo json_encode("true" );
        }
        // Meldung an Client : Auftragsstatus : Auftrag nicht erledigt - Text Rückmeldung der Fehlerquelle
        else {
            echo json_encode( $ajaxAuftragsStatus );
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////     Einträge aus Datenbank löschen
    /////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // Beiträge loeschen
    if ($jsonClientDaten['funktion'] === "loeschen") {
        // Alle Beiträge löschen
        if ($jsonClientDaten['parameter'] === "alle") {
            $ajaxAuftragsStatus = $admin->Loeschen();
            // Meldung an Client : Auftragsstatus : Auftrag erfolgreich erledigt
            if ( $ajaxAuftragsStatus === "true" ){
                echo json_encode("true" );
            }
            // Meldung an Client : Auftragsstatus : Auftrag nicht erledigt - Text Rückmeldung der Fehlerquelle
            else {
                echo json_encode( $ajaxAuftragsStatus );
            }
        }
        // Alle Beiträge nach Spaltenname mit bestimmten Spaltenwert löschen
        if ($jsonClientDaten['parameter'] === "suchen") {
            $ajaxAuftragsStatus = $admin->Loeschen($jsonClientDaten["spaltenName"], $jsonClientDaten["spaltenWert"]);
            // Meldung an Client : Auftragsstatus : Auftrag erfolgreich erledigt
            if ( $ajaxAuftragsStatus === "true" ){
                echo json_encode("true" );
            }
            // Meldung an Client : Auftragsstatus : Auftrag nicht erledigt - Text Rückmeldung der Fehlerquelle
            else {
                echo json_encode( $ajaxAuftragsStatus );
            }
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////     Einträge aus Datenbank updaten
    /////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // Beiträge verändert (updaten
    if ($jsonClientDaten['funktion'] === "update") {
        // In allen Beiträgen die Spalte x den neuen Wert y schreiben
        if ($jsonClientDaten['parameter'] === "alle") {
            $ajaxAuftragsStatus = $admin->Update();
            // Meldung an Client : Auftragsstatus : Auftrag erfolgreich erledigt
            if ( $ajaxAuftragsStatus === "true" ){
                echo json_encode("true" );
            }
            // Meldung an Client : Auftragsstatus : Auftrag nicht erledigt - Text Rückmeldung der Fehlerquelle
            else {
                echo json_encode( $ajaxAuftragsStatus );
            }
        }
        // In der Zeile mit der id x alle Spalten welche im Arrray mitgegeben werden verändern
        if ($jsonClientDaten['parameter'] === "id") {
            $ajaxAuftragsStatus = $admin->Update($jsonClientDaten["idZeile"], $jsonClientDaten["updateSpalte"], $jsonClientDaten["updateWert"]);
            // Meldung an Client : Auftragsstatus : Auftrag erfolgreich erledigt
            if ( $ajaxAuftragsStatus === "true" ){
                echo json_encode("true" );
            }
            // Meldung an Client : Auftragsstatus : Auftrag nicht erledigt - Text Rückmeldung der Fehlerquelle
            else {
                echo json_encode( $ajaxAuftragsStatus );
            }
        }
        // Alle Beiträge nach Spaltenname mit bestimmten Spaltenwert durchsuchen. In allen treffern alle Spalten welche mit dem Array mitgegeben werden verändern
        if ($jsonClientDaten['parameter'] === "suchen") {
            $ajaxAuftragsStatus = $admin->Update(-1, $jsonClientDaten["updateSpalte"], $jsonClientDaten["updateWert"], $jsonClientDaten["spaltenName"], $jsonClientDaten["spaltenWert"]);
            // Meldung an Client : Auftragsstatus : Auftrag erfolgreich erledigt
            if ( $ajaxAuftragsStatus === "true" ){
                echo json_encode("true" );
            }
            // Meldung an Client : Auftragsstatus : Auftrag nicht erledigt - Text Rückmeldung der Fehlerquelle
            else {
                echo json_encode( $ajaxAuftragsStatus );
            }
        }
    }



    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////     Einträge aus Datenbank Lesen
    /////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // Beiträge Lesen
    if ($jsonClientDaten['funktion'] === "lesen") {
        // Alle Beiträge lesen
        if ($jsonClientDaten['parameter'] === "alle") {
            echo json_encode($admin->Lesen(), JSON_NUMERIC_CHECK );
        }
        // Alle Beiträge nach Spaltenname mit bestimmten Spaltenwert durchsuchen. Alle Elemente mit Spalteninhalt ausgeben
        if ($jsonClientDaten['parameter'] === "suchen") {
            echo json_encode($admin->Lesen($jsonClientDaten["spaltenName"], $jsonClientDaten["spaltenWert"]), JSON_NUMERIC_CHECK );
        }

    }
}













////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////     SQL DATENBANK TABELLENBLATT TICKETARTEN ANSPRECHEN
/////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

if ($jsonClientDaten['tabelle'] === "ticketarten") {

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////     Neuer Einzelner Eintrag in Datenbank geenerieren
    /////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // Einzelner Eintrag schreiben
    if ($jsonClientDaten['funktion'] === "schreiben") {

        $ajaxAuftragsStatus = $ticketarten->NeuerEintrag(   $jsonClientDaten['datensatz'][0], $jsonClientDaten['datensatz'][1], $jsonClientDaten['datensatz'][2], $jsonClientDaten['datensatz'][3],
                                                            $jsonClientDaten['datensatz'][4], $jsonClientDaten['datensatz'][5], $jsonClientDaten['datensatz'][6], $jsonClientDaten['datensatz'][7],
                                                            $jsonClientDaten['datensatz'][8], $jsonClientDaten['datensatz'][9], $jsonClientDaten['datensatz'][10], $jsonClientDaten['datensatz'][11],
                                                            $jsonClientDaten['datensatz'][12], $jsonClientDaten['datensatz'][13], $jsonClientDaten['datensatz'][14],
                                                            $jsonClientDaten['datensatz'][15], $jsonClientDaten['datensatz'][16] );
        // Meldung an Client : Auftragsstatus : Auftrag erfolgreich erledigt
        if ( $ajaxAuftragsStatus === "true" ){
            echo json_encode("true" );
        }
        // Meldung an Client : Auftragsstatus : Auftrag nicht erledigt - Text Rückmeldung der Fehlerquelle
        else {
            echo json_encode( $ajaxAuftragsStatus );
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////     Einträge aus Datenbank löschen
    /////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // Beiträge loeschen
    if ($jsonClientDaten['funktion'] === "loeschen") {
        // Alle Beiträge löschen
        if ($jsonClientDaten['parameter'] === "alle") {
            $ajaxAuftragsStatus = $ticketarten->Loeschen();
            // Meldung an Client : Auftragsstatus : Auftrag erfolgreich erledigt
            if ( $ajaxAuftragsStatus === "true" ){
                echo json_encode("true" );
            }
            // Meldung an Client : Auftragsstatus : Auftrag nicht erledigt - Text Rückmeldung der Fehlerquelle
            else {
                echo json_encode( $ajaxAuftragsStatus );
            }
        }
        // Alle Beiträge nach Spaltenname mit bestimmten Spaltenwert löschen
        if ($jsonClientDaten['parameter'] === "suchen") {
            $ajaxAuftragsStatus = $ticketarten->Loeschen($jsonClientDaten["spaltenName"], $jsonClientDaten["spaltenWert"]);
            // Meldung an Client : Auftragsstatus : Auftrag erfolgreich erledigt
            if ( $ajaxAuftragsStatus === "true" ){
                echo json_encode("true" );
            }
            // Meldung an Client : Auftragsstatus : Auftrag nicht erledigt - Text Rückmeldung der Fehlerquelle
            else {
                echo json_encode( $ajaxAuftragsStatus );
            }
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////     Einträge aus Datenbank updaten
    /////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // Beiträge verändert (updaten
    if ($jsonClientDaten['funktion'] === "update") {
        // In allen Beiträgen die Spalte x den neuen Wert y schreiben
        if ($jsonClientDaten['parameter'] === "alle") {
            $ajaxAuftragsStatus = $ticketarten->Update();
            // Meldung an Client : Auftragsstatus : Auftrag erfolgreich erledigt
            if ( $ajaxAuftragsStatus === "true" ){
                echo json_encode("true" );
            }
            // Meldung an Client : Auftragsstatus : Auftrag nicht erledigt - Text Rückmeldung der Fehlerquelle
            else {
                echo json_encode( $ajaxAuftragsStatus );
            }
        }
        // In der Zeile mit der id x alle Spalten welche im Arrray mitgegeben werden verändern
        if ($jsonClientDaten['parameter'] === "id") {
            $ajaxAuftragsStatus = $ticketarten->Update($jsonClientDaten["idZeile"], $jsonClientDaten["updateSpalte"], $jsonClientDaten["updateWert"]);
            // Meldung an Client : Auftragsstatus : Auftrag erfolgreich erledigt
            if ( $ajaxAuftragsStatus === "true" ){
                echo json_encode("true" );
            }
            // Meldung an Client : Auftragsstatus : Auftrag nicht erledigt - Text Rückmeldung der Fehlerquelle
            else {
                echo json_encode( $ajaxAuftragsStatus );
            }
        }
        // Alle Beiträge nach Spaltenname mit bestimmten Spaltenwert durchsuchen. In allen treffern alle Spalten welche mit dem Array mitgegeben werden verändern
        if ($jsonClientDaten['parameter'] === "suchen") {
            $ajaxAuftragsStatus = $ticketarten->Update(-1, $jsonClientDaten["updateSpalte"], $jsonClientDaten["updateWert"], $jsonClientDaten["spaltenName"], $jsonClientDaten["spaltenWert"]);
            // Meldung an Client : Auftragsstatus : Auftrag erfolgreich erledigt
            if ( $ajaxAuftragsStatus === "true" ){
                echo json_encode("true" );
            }
            // Meldung an Client : Auftragsstatus : Auftrag nicht erledigt - Text Rückmeldung der Fehlerquelle
            else {
                echo json_encode( $ajaxAuftragsStatus );
            }
        }
    }



    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////     Einträge aus Datenbank Lesen
    /////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // Beiträge Lesen
    if ($jsonClientDaten['funktion'] === "lesen") {
        // Alle Beiträge lesen
        if ($jsonClientDaten['parameter'] === "alle") {
            echo json_encode($ticketarten->Lesen(), JSON_NUMERIC_CHECK );
        }
        // Alle Beiträge nach Spaltenname mit bestimmten Spaltenwert durchsuchen. Alle Elemente mit Spalteninhalt ausgeben
        if ($jsonClientDaten['parameter'] === "suchen") {
            echo json_encode($ticketarten->Lesen($jsonClientDaten["spaltenName"], $jsonClientDaten["spaltenWert"]), JSON_NUMERIC_CHECK );
        }

    }




    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////     Tickets aus Datenbank abbuchen            Hier werden die Tabellen miteinander kombiniert um eine saubere abbucjung der Tickets zu gewährleisten
    /////////////////
    /////////////////     FOLGENDE FUNKTIONEN SIND VORHANDEN:
    /////////////////
    /////////////////
    /////////////////           1. warenkorbTicketsFreigeben:       Mit dieser Funktion wird nach ablauf von einer Zeit von 10 Minuten seit dem timestamp updateTime, blockierte Tickets
    /////////////////                                               wieder freigegeben. Die blockierten Tickets aus der n:n Tabelle von "ticketarten" und "warenkorb" werden gelöscht und
    /////////////////                                               in der tabell "tickearten" wird die Variable blockierteTickets angepasst
    /////////////////
    /////////////////           2. TicketsBlockieren:               Mit dieser Funktion werden neue Einträge genneriert oder upgadatet um tickets für 10 Minuten zu blockieren. Diese Einträge
    /////////////////                                               werden in der n:n Tabelle von "ticketarten" und "warenkorb" geschrieben. Zugleich wird in der tabelle
    /////////////////                                               "tickearten"  die Variable blockierteTickets angepasst
    /////////////////
    /////////////////           3. TicketsKaufen:                   Mit dieser Funktion werden aus blockierten Tickets, defeinitive verkaufte Tickets erstellt.
    /////////////////                                               Die erstellen Tickets werden in  der tabelle "tickets" eingetragen. Zugleich wird die
    /////////////////                                               n:n Tabelle von "ticketarten" und "warenkorb" "tickearten" angepasst und auch die Variable
    /////////////////                                               blockierteTickets aus der tabelle "tickearten" sowie die Variabel verkaufte Tickets
    /////////////////
    /////////////////
    /////////////////
    /////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // TicketsBlockieren
    if ($jsonClientDaten['funktion'] === "TicketsBlockieren") {

        // Zuerst wird die Funktion gestartet, welche blockierte Tickets,welche länger als 10 Minuten im Warenkorb unkegauft herumliegen herauslöscht und diese
        // wieder zum Verkauf bereit stellen (blockierteAnzahlTickets reduzieren)
        $ticketarten->warenkorbTicketsFreigeben( $jsonClientDaten['updateSpalte'] );  // $jsonClientDaten['updateWert']

        $arrayStatus = $ticketarten->TicketsBlockieren($jsonClientDaten['idZeile'], $jsonClientDaten['updateSpalte'], $jsonClientDaten['updateWert'] );
        echo json_encode($arrayStatus);
    }


    // TicketsKaufen
    if ($jsonClientDaten['funktion'] === "TicketsKaufen") {

        $ajaxAuftragsStatus = $ticketarten->TicketsKaufen($jsonClientDaten['datensatz'][0], $jsonClientDaten['datensatz'][1], $jsonClientDaten['datensatz'][2]);
        // Meldung an Client : Auftragsstatus : Auftrag erfolgreich erledigt
        echo json_encode('true');
    }


}













////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////     SQL DATENBANK TABELLENBLATT KUNDEN ANSPRECHEN
/////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

if ($jsonClientDaten['tabelle'] === "kunden") {

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////     Neuer Einzelner Eintrag in Datenbank geenerieren
    /////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // Einzelner Eintrag schreiben
    if ($jsonClientDaten['funktion'] === "schreiben") {

        $ajaxAuftragsStatus = $kunden->NeuerEintrag($jsonClientDaten['datensatz'][0], $jsonClientDaten['datensatz'][1], $jsonClientDaten['datensatz'][2], $jsonClientDaten['datensatz'][3],
            $jsonClientDaten['datensatz'][4], $jsonClientDaten['datensatz'][5], $jsonClientDaten['datensatz'][6], $jsonClientDaten['datensatz'][7],
            $jsonClientDaten['datensatz'][8], $jsonClientDaten['datensatz'][9], $jsonClientDaten['datensatz'][10], $jsonClientDaten['datensatz'][11]);
        // Meldung an Client : Auftragsstatus : Auftrag erfolgreich erledigt
        if ($ajaxAuftragsStatus === "true") {
            echo json_encode("true");
        } // Meldung an Client : Auftragsstatus : Auftrag nicht erledigt - Text Rückmeldung der Fehlerquelle
        else {
            echo json_encode($ajaxAuftragsStatus);
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////     Einträge aus Datenbank löschen
    /////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // Beiträge loeschen
    if ($jsonClientDaten['funktion'] === "loeschen") {
        // Alle Beiträge löschen
        if ($jsonClientDaten['parameter'] === "alle") {
            $ajaxAuftragsStatus = $kunden->Loeschen();
            // Meldung an Client : Auftragsstatus : Auftrag erfolgreich erledigt
            if ($ajaxAuftragsStatus === "true") {
                echo json_encode("true");
            } // Meldung an Client : Auftragsstatus : Auftrag nicht erledigt - Text Rückmeldung der Fehlerquelle
            else {
                echo json_encode($ajaxAuftragsStatus);
            }
        }
        // Alle Beiträge nach Spaltenname mit bestimmten Spaltenwert löschen
        if ($jsonClientDaten['parameter'] === "suchen") {
            $ajaxAuftragsStatus = $kunden->Loeschen($jsonClientDaten["spaltenName"], $jsonClientDaten["spaltenWert"]);
            // Meldung an Client : Auftragsstatus : Auftrag erfolgreich erledigt
            if ($ajaxAuftragsStatus === "true") {
                echo json_encode("true");
            } // Meldung an Client : Auftragsstatus : Auftrag nicht erledigt - Text Rückmeldung der Fehlerquelle
            else {
                echo json_encode($ajaxAuftragsStatus);
            }
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////     Einträge aus Datenbank updaten
    /////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // Beiträge verändert (updaten
    if ($jsonClientDaten['funktion'] === "update") {
        // In allen Beiträgen die Spalte x den neuen Wert y schreiben
        if ($jsonClientDaten['parameter'] === "alle") {
            $ajaxAuftragsStatus = $kunden->Update();
            // Meldung an Client : Auftragsstatus : Auftrag erfolgreich erledigt
            if ($ajaxAuftragsStatus === "true") {
                echo json_encode("true");
            } // Meldung an Client : Auftragsstatus : Auftrag nicht erledigt - Text Rückmeldung der Fehlerquelle
            else {
                echo json_encode($ajaxAuftragsStatus);
            }
        }
        // In der Zeile mit der id x alle Spalten welche im Arrray mitgegeben werden verändern
        if ($jsonClientDaten['parameter'] === "id") {
            $ajaxAuftragsStatus = $kunden->Update($jsonClientDaten["idZeile"], $jsonClientDaten["updateSpalte"], $jsonClientDaten["updateWert"]);
            // Meldung an Client : Auftragsstatus : Auftrag erfolgreich erledigt
            if ($ajaxAuftragsStatus === "true") {
                echo json_encode("true");
            } // Meldung an Client : Auftragsstatus : Auftrag nicht erledigt - Text Rückmeldung der Fehlerquelle
            else {
                echo json_encode($ajaxAuftragsStatus);
            }
        }
        // Alle Beiträge nach Spaltenname mit bestimmten Spaltenwert durchsuchen. In allen treffern alle Spalten welche mit dem Array mitgegeben werden verändern
        if ($jsonClientDaten['parameter'] === "suchen") {
            $ajaxAuftragsStatus = $kunden->Update(-1, $jsonClientDaten["updateSpalte"], $jsonClientDaten["updateWert"], $jsonClientDaten["spaltenName"], $jsonClientDaten["spaltenWert"]);
            // Meldung an Client : Auftragsstatus : Auftrag erfolgreich erledigt
            if ($ajaxAuftragsStatus === "true") {
                echo json_encode("true");
            } // Meldung an Client : Auftragsstatus : Auftrag nicht erledigt - Text Rückmeldung der Fehlerquelle
            else {
                echo json_encode($ajaxAuftragsStatus);
            }
        }
    }


    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////     Einträge aus Datenbank Lesen
    /////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // Beiträge Lesen
    if ($jsonClientDaten['funktion'] === "lesen") {

        // Alle Beiträge lesen
        if ($jsonClientDaten['parameter'] === "alle") {
            // Daten ausgeben
            echo json_encode($kunden->Lesen(), JSON_NUMERIC_CHECK);
        }

        // Alle Beiträge nach Spaltenname mit bestimmten Spaltenwert durchsuchen. Alle Elemente mit Spalteninhalt ausgeben
        if ($jsonClientDaten['parameter'] === "suchen") {
            // Daten ausgeben
            echo json_encode($kunden->Lesen($jsonClientDaten["spaltenName"], $jsonClientDaten["spaltenWert"]), JSON_NUMERIC_CHECK);

        }
    }
}







////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////     SQL DATENBANK TABELLENBLATT TICKETS ANSPRECHEN
/////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

if ($jsonClientDaten['tabelle'] === "tickets") {

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////     Neuer Einzelner Eintrag in Datenbank geenerieren
    /////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // Einzelner Eintrag schreiben
    if ($jsonClientDaten['funktion'] === "schreiben") {

        $ajaxAuftragsStatus = $tickets->NeuerEintrag( $jsonClientDaten['datensatz'][0], $jsonClientDaten['datensatz'][1], $jsonClientDaten['datensatz'][2] );
        // Meldung an Client : Auftragsstatus : Auftrag erfolgreich erledigt
        if ( $ajaxAuftragsStatus === "true" ){
            echo json_encode("true" );
        }
        // Meldung an Client : Auftragsstatus : Auftrag nicht erledigt - Text Rückmeldung der Fehlerquelle
        else {
            echo json_encode( $ajaxAuftragsStatus );
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////     Einträge aus Datenbank löschen
    /////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // Beiträge loeschen
    if ($jsonClientDaten['funktion'] === "loeschen") {
        // Alle Beiträge löschen
        if ($jsonClientDaten['parameter'] === "alle") {
            $ajaxAuftragsStatus = $tickets->Loeschen();
            // Meldung an Client : Auftragsstatus : Auftrag erfolgreich erledigt
            if ( $ajaxAuftragsStatus === "true" ){
                echo json_encode("true" );
            }
            // Meldung an Client : Auftragsstatus : Auftrag nicht erledigt - Text Rückmeldung der Fehlerquelle
            else {
                echo json_encode( $ajaxAuftragsStatus );
            }
        }
        // Alle Beiträge nach Spaltenname mit bestimmten Spaltenwert löschen
        if ($jsonClientDaten['parameter'] === "suchen") {
            $ajaxAuftragsStatus = $tickets->Loeschen($jsonClientDaten["spaltenName"], $jsonClientDaten["spaltenWert"]);
            // Meldung an Client : Auftragsstatus : Auftrag erfolgreich erledigt
            if ( $ajaxAuftragsStatus === "true" ){
                echo json_encode("true" );
            }
            // Meldung an Client : Auftragsstatus : Auftrag nicht erledigt - Text Rückmeldung der Fehlerquelle
            else {
                echo json_encode( $ajaxAuftragsStatus );
            }
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////     Einträge aus Datenbank updaten
    /////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // Beiträge verändert (updaten
    if ($jsonClientDaten['funktion'] === "update") {
        // In allen Beiträgen die Spalte x den neuen Wert y schreiben
        if ($jsonClientDaten['parameter'] === "alle") {
            $ajaxAuftragsStatus = $tickets->Update();
            // Meldung an Client : Auftragsstatus : Auftrag erfolgreich erledigt
            if ( $ajaxAuftragsStatus === "true" ){
                echo json_encode("true" );
            }
            // Meldung an Client : Auftragsstatus : Auftrag nicht erledigt - Text Rückmeldung der Fehlerquelle
            else {
                echo json_encode( $ajaxAuftragsStatus );
            }
        }
        // In der Zeile mit der id x alle Spalten welche im Arrray mitgegeben werden verändern
        if ($jsonClientDaten['parameter'] === "id") {
            $ajaxAuftragsStatus = $tickets->Update($jsonClientDaten["idZeile"], $jsonClientDaten["updateSpalte"], $jsonClientDaten["updateWert"]);
            // Meldung an Client : Auftragsstatus : Auftrag erfolgreich erledigt
            if ( $ajaxAuftragsStatus === "true" ){
                echo json_encode("true" );
            }
            // Meldung an Client : Auftragsstatus : Auftrag nicht erledigt - Text Rückmeldung der Fehlerquelle
            else {
                echo json_encode( $ajaxAuftragsStatus );
            }
        }
        // Alle Beiträge nach Spaltenname mit bestimmten Spaltenwert durchsuchen. In allen treffern alle Spalten welche mit dem Array mitgegeben werden verändern
        if ($jsonClientDaten['parameter'] === "suchen") {
            $ajaxAuftragsStatus = $tickets->Update(-1, $jsonClientDaten["updateSpalte"], $jsonClientDaten["updateWert"], $jsonClientDaten["spaltenName"], $jsonClientDaten["spaltenWert"]);
            // Meldung an Client : Auftragsstatus : Auftrag erfolgreich erledigt
            if ( $ajaxAuftragsStatus === "true" ){
                echo json_encode("true" );
            }
            // Meldung an Client : Auftragsstatus : Auftrag nicht erledigt - Text Rückmeldung der Fehlerquelle
            else {
                echo json_encode( $ajaxAuftragsStatus );
            }
        }
    }



    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////     Einträge aus Datenbank Lesen
    /////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // Beiträge Lesen
    if ($jsonClientDaten['funktion'] === "lesen") {
        // Alle Beiträge lesen
        if ($jsonClientDaten['parameter'] === "alle") {
            echo json_encode($tickets->Lesen(), JSON_NUMERIC_CHECK );
        }
        // Alle Beiträge nach Spaltenname mit bestimmten Spaltenwert durchsuchen. Alle Elemente mit Spalteninhalt ausgeben
        if ($jsonClientDaten['parameter'] === "suchen") {
            echo json_encode($tickets->Lesen($jsonClientDaten["spaltenName"], $jsonClientDaten["spaltenWert"]), JSON_NUMERIC_CHECK );
        }

    }


    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////     Einträge aus Datenbank Lesen
    /////////////////
    /////////////////
    /////////////////
    /////////////////
    /////////////////
    /////////////////
    /////////////////
    /////////////////
    /////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // Beiträge Lesen
    if ($jsonClientDaten['funktion'] === "ticketsJoinTicketarten") {
        // Alle Beiträge lesen
        if ($jsonClientDaten['parameter'] === "alle") {
            echo json_encode($tickets->LesenTickets_Join_Ticketarten(), JSON_NUMERIC_CHECK );
        }
        // Alle Beiträge nach Spaltenname mit bestimmten Spaltenwert durchsuchen. Alle Elemente mit Spalteninhalt ausgeben
        if ($jsonClientDaten['parameter'] === "suchen") {
            echo json_encode($tickets->LesenTickets_Join_Ticketarten($jsonClientDaten["spaltenName"], $jsonClientDaten["spaltenWert"]), JSON_NUMERIC_CHECK );
        }

    }

}











////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////     SQL DATENBANK TABELLENBLATT WARENKORB ANSPRECHEN
/////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

if ($jsonClientDaten['tabelle'] === "warenkorb") {

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////     Neuer Einzelner Eintrag in Datenbank geenerieren
    /////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // Einzelner Eintrag schreiben
    if ($jsonClientDaten['funktion'] === "schreiben") {

        $ajaxAuftragsStatus = $warenkorb->NeuerEintrag($jsonClientDaten['datensatz'][0] );
        // Meldung an Client : Auftragsstatus : Auftrag erfolgreich erledigt
        if ( $ajaxAuftragsStatus === "true" ){
            echo json_encode("true" , JSON_NUMERIC_CHECK);
        }
        // Meldung an Client : Auftragsstatus : Auftrag nicht erledigt - Text Rückmeldung der Fehlerquelle
        else {
            echo json_encode( $ajaxAuftragsStatus, JSON_NUMERIC_CHECK );
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////     Einträge aus Datenbank löschen
    /////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // Beiträge loeschen
    if ($jsonClientDaten['funktion'] === "loeschen") {
        // Alle Beiträge löschen
        if ($jsonClientDaten['parameter'] === "alle") {
            $ajaxAuftragsStatus = $warenkorb->Loeschen();
            // Meldung an Client : Auftragsstatus : Auftrag erfolgreich erledigt
            if ( $ajaxAuftragsStatus === "true" ){
                echo json_encode("true" );
            }
            // Meldung an Client : Auftragsstatus : Auftrag nicht erledigt - Text Rückmeldung der Fehlerquelle
            else {
                echo json_encode( $ajaxAuftragsStatus );
            }
        }
        // Alle Beiträge nach Spaltenname mit bestimmten Spaltenwert löschen
        if ($jsonClientDaten['parameter'] === "suchen") {
            $ajaxAuftragsStatus = $warenkorb->Loeschen($jsonClientDaten["spaltenName"], $jsonClientDaten["spaltenWert"]);
            // Meldung an Client : Auftragsstatus : Auftrag erfolgreich erledigt
            if ( $ajaxAuftragsStatus === "true" ){
                echo json_encode("true" );
            }
            // Meldung an Client : Auftragsstatus : Auftrag nicht erledigt - Text Rückmeldung der Fehlerquelle
            else {
                echo json_encode( $ajaxAuftragsStatus );
            }
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////     Einträge aus Datenbank updaten
    /////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // Beiträge verändert (updaten
    if ($jsonClientDaten['funktion'] === "update") {
        // In allen Beiträgen die Spalte x den neuen Wert y schreiben
        if ($jsonClientDaten['parameter'] === "alle") {
            $ajaxAuftragsStatus = $warenkorb->Update();
            // Meldung an Client : Auftragsstatus : Auftrag erfolgreich erledigt
            if ( $ajaxAuftragsStatus === "true" ){
                echo json_encode("true" );
            }
            // Meldung an Client : Auftragsstatus : Auftrag nicht erledigt - Text Rückmeldung der Fehlerquelle
            else {
                echo json_encode( $ajaxAuftragsStatus );
            }
        }
        // In der Zeile mit der id x alle Spalten welche im Arrray mitgegeben werden verändern
        if ($jsonClientDaten['parameter'] === "id") {
            $ajaxAuftragsStatus = $warenkorb->Update($jsonClientDaten["idZeile"], $jsonClientDaten["updateSpalte"], $jsonClientDaten["updateWert"]);
            // Meldung an Client : Auftragsstatus : Auftrag erfolgreich erledigt
            if ( $ajaxAuftragsStatus === "true" ){
                echo json_encode("true" );
            }
            // Meldung an Client : Auftragsstatus : Auftrag nicht erledigt - Text Rückmeldung der Fehlerquelle
            else {
                echo json_encode( $ajaxAuftragsStatus );
            }
        }
        // Alle Beiträge nach Spaltenname mit bestimmten Spaltenwert durchsuchen. In allen treffern alle Spalten welche mit dem Array mitgegeben werden verändern
        if ($jsonClientDaten['parameter'] === "suchen") {
            $ajaxAuftragsStatus = $warenkorb->Update(-1, $jsonClientDaten["updateSpalte"], $jsonClientDaten["updateWert"], $jsonClientDaten["spaltenName"], $jsonClientDaten["spaltenWert"]);
            // Meldung an Client : Auftragsstatus : Auftrag erfolgreich erledigt
            if ( $ajaxAuftragsStatus === "true" ){
                echo json_encode("true" );
            }
            // Meldung an Client : Auftragsstatus : Auftrag nicht erledigt - Text Rückmeldung der Fehlerquelle
            else {
                echo json_encode( $ajaxAuftragsStatus );
            }
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////     Einträge aus Datenbank Lesen
    /////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // Beiträge Lesen
    if ($jsonClientDaten['funktion'] === "lesen") {
        // Alle Beiträge lesen
        if ($jsonClientDaten['parameter'] === "alle") {
            echo json_encode($warenkorb->Lesen(), JSON_NUMERIC_CHECK );
        }
        // Alle Beiträge nach Spaltenname mit bestimmten Spaltenwert durchsuchen. Alle Elemente mit Spalteninhalt ausgeben
        if ($jsonClientDaten['parameter'] === "suchen") {
            echo json_encode($warenkorb->Lesen($jsonClientDaten["spaltenName"], $jsonClientDaten["spaltenWert"]), JSON_NUMERIC_CHECK );
        }
    }
}







////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////     SQL DATENBANK TABELLENBLATT TICHTARTEN_HAS_WARENBORB (N:N) ANSPRECHEN
/////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

if ($jsonClientDaten['tabelle'] === "Ticketarten_Warenkorb") {

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////     Einträge aus Datenbank Lesen
    /////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // Beiträge Lesen
    if ($jsonClientDaten['funktion'] === "lesen") {
        // Alle Beiträge lesen
        if ($jsonClientDaten['parameter'] === "alle") {
            echo json_encode($ticketarten_Warenkorb->Lesen(), JSON_NUMERIC_CHECK );
        }
        // Alle Beiträge nach Spaltenname mit bestimmten Spaltenwert durchsuchen. Alle Elemente mit Spalteninhalt ausgeben
        if ($jsonClientDaten['parameter'] === "suchen") {
            echo json_encode($ticketarten_Warenkorb->Lesen($jsonClientDaten["spaltenName"], $jsonClientDaten["spaltenWert"]), JSON_NUMERIC_CHECK );
        }
    }

}





?>





