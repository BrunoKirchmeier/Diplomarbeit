
<?php

// Durch die HEaderinformationen kann der Client FEhlerauswertungen machen, wenn die JSON DAten nicht korrekt sind
header("Content-type:application/json; charset=UTF-8");


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////    Include Files php          Es werden zugelcih Objekte mit Klassen generiert
/////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

require_once "klassen/DP.php";
require_once "../allgemein/validierungen.php";;
require_once "klassen/class_SqlTabelleKunden.php";


// Objekt Ticktarten instanzieren
$kunden = new class_SqlTabelleKunden();



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
/////////////////     EMAIL SCHREIBEN       Email versand an Kunden für Newsletter oder Passwort oder Accountbestätiigungen
/////////////////                           Die Funktion muss mit dem Parameter : " ['email_accountBestaetigen'] belegt
/////////////////                           Folgende Argumente werden vom client mitgegeben
/////////////////
/////////////////     $jsonClientDaten['datensatz'][0]: aktuell eingeloggter Kunde oder admin
/////////////////     $jsonClientDaten['datensatz'][1]: Passworteingabe zum validierern ob mit Kundendazen übereinsimmen
/////////////////     $jsonClientDaten['datensatz'][2]: Liste aller Mail empfänger - Ein einzelner String, Empfänger mit Komma getrennt
/////////////////     $jsonClientDaten['datensatz'][3]: Betreff
/////////////////     $jsonClientDaten['datensatz'][4]: Textinhalt
/////////////////     $jsonClientDaten['datensatz'][5]: Neues Passwort zum abspeichern in der Datenbank
/////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////





////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////     ACCOUNT BESTAETIGEN       Mit dieser Funktion wird die Accountbestätigung ausgelöst - Es wird ein Email geschickt mit dem BEstätigungsling
/////////////////
/////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// Email versenden
if ($jsonClientDaten['funktion'] === "email_accountBestaetigen") {

    // Zuerst alle Kundendaten laden
    $serverDaten = $kunden->Lesen('username', $jsonClientDaten['datensatz'][0]);


    // Passwortvergleich vom Server DAten und Ajax Anfrage vergeleichen
    if ($serverDaten[0]["passwort"] === md5($jsonClientDaten['datensatz'][1])) {

        // Betreff
        $betreff = "Bestätigungsmail für Account bei Underworld Festval";

        // Der Code beim geenerieren des DAtenbankeintrages dort eingetragen
        $bestaetigungsCode = $serverDaten[0]['bestaetigungsCode'];


        // Mail Text
        $mailText =     " Bitte klicken Sie auf diesen Bestätigungslink, um den Account freizuschalten. Sollte es nicht funktionieren, kopieren Sie den Link in den Browser: "
                        . '<br><br>'
                        ."www.bruno.techfabrik.com/assets/php/view/bestaetigungslink.php?link=" .$bestaetigungsCode;


        // Headerdateien
        $headers = array();
        $headers[] = "MIME-Version: 1.0";
        $headers[] = "Content-type: text/html; charset=utf-8";
        $headers[] = "From: {bruno.kirchmeier@gmail.com}";
        $headers[] = "Reply-To: {bruno.kirchmeier@gmail.com}";
        $headers[] = "Subject: {$betreff}";
        $headers[] = "X-Mailer: PHP/" . phpversion();

        // Mail versenden - Sofern erfolgreich, Funktion normal beenden
        if ( mail($jsonClientDaten['datensatz'][2], $betreff, $mailText, implode("\r\n", $headers) ) ) {
            echo json_encode("true");
        }
        // Mail konnte nicht versendet werden
        else {
            echo json_encode( "Mail mit Bestätigungslink konnte nicht gesendet werden. Empfängeradresse: " .$jsonClientDaten['datensatz'][2]);
        }

    } // Passwort ist falsch - keine weitere Aktionen
    else {
        echo json_encode("Das Eingegebene PAsswort ist nicht mit jenem auf der DAtenbank übereinstimmend" );
    }
}




////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////     Neues Passwort setzen         Mit dieser Funktion wird auf der DAtenbank ein neues zufäälig geeneriertes Passwort gesetzt und eine Email
/////////////////                                   an den Kunden geschickt mit dem neuen PAsswort
/////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// Email versenden
if ($jsonClientDaten['funktion'] === "email_passwortVergessen") {

    // Zuerst alle Kundendaten laden
    $serverDaten = $kunden->Lesen('username', $jsonClientDaten['datensatz'][0]);

    // Emailadresse vom Server DAten und Ajax Anfrage vergeleichen
    if ($serverDaten[0]["email"] === $jsonClientDaten['datensatz'][2]) {

        // Neues PAsswort geenerieren
        // Die Bedingungen welche auf Javascript ür ein neues PAsswort gelten müssen ebenfalls eingehalten werden
        $passwort = zufallsPassword();

        // Betreff
        $betreff = "Neues Passwort für Account bei Underworld Festival";

        // Mail Text
        $mailText = " Das PAsswort wurde durch ein automatisch generierten Code ersetzt. Sie können diesen in ihrem Profil wieder ändern. Das Passwort lautet:  " . $passwort;

        // Headerdateien
        $headers = array();
        $headers[] = "MIME-Version: 1.0";
        $headers[] = "Content-type: text/html; charset=utf-8";
        $headers[] = "From: {bruno.kirchmeier@gmail.com}";
        $headers[] = "Reply-To: {bruno.kirchmeier@gmail.com}";
        $headers[] = "Subject: {$betreff}";
        $headers[] = "X-Mailer: PHP/" . phpversion();

        // Mail versenden
        if ( mail($jsonClientDaten['datensatz'][2], $betreff, $mailText, implode("\r\n", $headers) ) ) {

            $antwort = $kunden->Update(-1, ['passwort'], [$passwort], 'username', $jsonClientDaten['datensatz'][0]);


            // Das neue Passwort auf der Datenabnk abspeichern sofern Mail erfolgreich versendet wurde
            if ($antwort === 'true') {
                echo json_encode("true");
            }
            // Datenbank fehler
            else {
                echo json_encode("Das Mail wurde versendet aber es ist ein Fehler auf der DAtenbank passiert" );
            }
        }
        // Mail konnte nicht versendet werden
        else {
            echo json_encode( "Mail konnte nicht gesendet werden. Empfängeradresse: " .$jsonClientDaten['datensatz'][2]);
        }

    } // Passwort ist falsch - keine weitere Aktionen
    else {
        echo json_encode("Die Eingegebene Emailadresse ist nicht mit jener auf der Datenbank übereinstimmend");
    }
}





////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////     ACCOUNT BESTAETIGEN       Mit dieser Funktion wird die Accountbestätigung ausgelöst - Es wird ein Email geschickt mit dem BEstätigungsling
/////////////////
/////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// Email versenden
if ($jsonClientDaten['funktion'] === "email_ticketBestellung") {

    // Zuerst alle Kundendaten laden
    $serverDaten = $kunden->Lesen('username', $jsonClientDaten['datensatz'][0]);

    // Emailadresse vom Server DAten und Ajax Anfrage vergeleichen
    if ($serverDaten[0]["email"] === $jsonClientDaten['datensatz'][2]) {

        // Betreff
        $betreff = "Ticket Bestellung bei Underworld Festival";

        // Mail Text
        $mailText = "   Sie haben bei uns Tickets für das Festival Bestellt. Sie können die Bilette bis zu 15 Minuten vor Konzertbeginn an einem unseren Schalter abholen <br>
                        Andernfalls werden die Tickets weitergegeben <br><br> Die Tickets können Sie Vorot bezahlen";

        // Headerdateien
        $headers = array();
        $headers[] = "MIME-Version: 1.0";
        $headers[] = "Content-type: text/html; charset=utf-8";
        $headers[] = "From: {bruno.kirchmeier@gmail.com}";
        $headers[] = "Reply-To: {bruno.kirchmeier@gmail.com}";
        $headers[] = "Subject: {$betreff}";
        $headers[] = "X-Mailer: PHP/" . phpversion();

        // Mail versenden
        if ( mail($jsonClientDaten['datensatz'][2], $betreff, $mailText, implode("\r\n", $headers) ) ) {
            echo json_encode("true");
        }
        // Mail konnte nicht versendet werden
        else {
            echo json_encode( "Mail konnte nicht gesendet werden. Empfängeradresse: " .$jsonClientDaten['datensatz'][2]);
        }

    } // Passwort ist falsch - keine weitere Aktionen
    else {
        echo json_encode("Die Eingegebene Emailadresse ist nicht mit jener auf der Datenbank übereinstimmend");
    }
}









//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////     FUNKTIONSDEFINITIONEN
/////////////////
/////////////////
/////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// PAsswort generator
// Es wird ein zufällig generieterer Sting zurückgegeben - die bedingunen an anzahl Zeichen und minidest vorkommen von Zeichengruppen ist in Funktion definiert
function zufallsPassword() {

    // Variablendefinitionen
    $passwort = '';
    $minAnzahlBuchstabeKlein   = 8;
    $minAnzahlBuchstabeGross   = 2;
    $minAnzahlZahlen           = 2;
    $minAnzahlSonderzeichen    = 1;

    // Zeichendefinitionen
    $buchstabeKlein = "abcdefghijklmnopqrstuvwxyz";
    $buchstabeGross = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    $zahlen = "0123456789";
    $sonderzeichen = "!@#$%^&*()_-=+;:,.?";


    // Kleinbuchstaben setzen
    for($i=0; $i < $minAnzahlBuchstabeKlein; $i++) {
        $passwort .= substr($buchstabeKlein, rand(0, strlen ($buchstabeKlein)), 1 );
    }
    // Grossbuchstaben setzen
    for($i=0; $i < $minAnzahlBuchstabeGross; $i++) {
        $passwort .= substr($buchstabeGross, rand(0, strlen ($buchstabeGross)), 1 );
    }
    // Zahlen setzen
    for($i=0; $i < $minAnzahlZahlen; $i++) {
        $passwort .= substr($zahlen, rand(0, strlen ($zahlen)), 1 );
    }
    // Sonderzeichen setzen
    for($i=0; $i < $minAnzahlSonderzeichen; $i++) {
        $passwort .= substr($sonderzeichen, rand(0, strlen ($sonderzeichen)), 1 );
    }

    // Die Gesezten Zeichen noch vermischen und dann zurückgeben
    return str_shuffle($passwort);
}