
<?php
// HEaderdatei
header("Content-type: text/html; charset=UTF-8");


require_once "klassen/DP.php";
require_once "../allgemein/validierungen.php";
require_once "klassen/class_SqlTabelleBand.php";
require_once "klassen/class_SqlTabelleAdministrator.php";
require_once "klassen/class_SqlTabelleTicketarten.php";
require_once "klassen/class_SqlTabelleKunden.php";
require_once "klassen/class_SqlTabelleTickets.php";
require_once "klassen/class_SqlTabelleWarenkorb.php";


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


function PreFormat($Daten) {
    echo '<pre><code> ';
    var_dump($Daten);
    echo '</code></pre>';
}






/*

$id = array(3,4,5);
$anzahl = array(1,2,2);
$ajaxAuftragsStatus = $ticketarten->TicketsKaufen(2, $id, $anzahl);

PreFormat( $ajaxAuftragsStatus );

*/



/*

$id = array(3,4,5); // tickets
$anzahl = array(1,1,1);
$ajaxAuftragsStatus = $ticketarten->TicketsBlockieren(6, $id, $anzahl);

PreFormat( $ajaxAuftragsStatus );
*/


/*
$test = $ticketarten->warenkorbTicketsFreigeben();

print_r($test);
echo $test;

*/




/*
$test = $ticketarten->TicketsKaufen(2,[2,3], [3,7]);

echo $test;
*/

// $test = $warenkorb->warenkorbErstellen(1, 1);





//
//$kunden->NeuerEintrag('', '', '', 'bruno_churchi@gmx.ch', 'Bruno' ,'Bruno?2', '', '', '', 1, '', false);


// Ticket erstellen
/*
$test = $ticketarten->NeuerEintrag('', "Ticket 2", "dies kann man kaufen", "2017.10.10", "20:00:00", "Pfäffiokn", "das ist hier",
    200, 100, 2, "2017.01.10", "2017.09.20", 1, 1);
*/


$admin->NeuerEintrag('bruno_churchi@gmx.ch', 'Bruno', 'Melide10+', '', 1);

$admin->NeuerEintrag('bruno_churchi@gmx.ch', 'Brun2', 'Melide10+', '', 2);

$admin->NeuerEintrag('bruno_churchi@gmx.ch', 'michael.gyger', 'Melide10+', '', 1);

$admin->NeuerEintrag('bruno_churchi@gmx.ch', 'michael.gyger2', 'Melide10+', '', 2);



/*
$bandList->NeuerEintrag(1, "Eintrag 3", "2017.08.02", "Montag", "Bühne 1", "20:00:00", "Band 2", "assets/images/jpg/Band_Bilder/1.pgn", "assets/images/jpg/Band_Bilder/2.pgn", "assets/images/jpg/Band_Bilder/3.pgn",
                            "https://de-de.facebook.com/EdSheeranMusic/", "https://de-de.facebook.com/EdSheeranMusic/", "https://de-de.facebook.com/EdSheeranMusic/", "https://de-de.facebook.com/EdSheeranMusic/");
*/


/*
$test = $ticketarten->NeuerEintrag('', "Ticket 3", "dies kann man kaufen", "2017.10.10", "20:00:00", "Pfäffiokn", '', 100,
                                    200, 0, "2017.01.10", "2017.09.20", 1, 10);


echo $test;
*/








/*
$spalte = array (1, 2);
$Wert = array (5, 5);

$returnvalue = $ticketarten->TicketsKaufen($spalte, $Wert);



echo '<br>';
echo $returnvalue;
echo '<br>';
echo '<br>';
*/

/*
// Bestätigungslink erstellen
// $bestaetigungsLink = '<a href="' .$_SERVER['DOCUMENT_ROOT'] .'/assets/php/view/bestaetigungslink.php?link=' .$this->bestaetigungsCode .'">Hier Klicken</a>';
// $bestaetigungsLink = "<a href='" .$_SERVER['DOCUMENT_ROOT'] .'/assets/php/view/bestaetigungslink.php?link=' .$passwort ."'>.Hier Klicken</a>\n\n";
// $bestaetigungsLink = '<a href="../../../assets/php/view/bestaetigungslink.php?link=' .$passwort .'">.Hier Klicken</a>';




$bestaetigungsLink = '<a href="https://www.bruno.techfabrik/assets/php/view/bestaetigungslink.php?link=' .$passwort .'">.Hier Klicken</a>';


echo $bestaetigungsLink;
echo '<br>';
echo '<br>';
echo $_SERVER['DOCUMENT_ROOT'];
echo '<br>';
echo '<br>';
echo __DIR__;


// Neues PAsswort geenerieren
// Die Bedingungen welche auf Javascript ür ein neues PAsswort gelten müssen ebenfalls eingehalten werden
$passwort = zufallsPassword();

// Betreff
$betreff = "Neues Passwort für Account bei Underworld Festival";

// Mail Text
$mailText = " Bitte Klicken Sie auf diesen Bestätigungslink,um den Account freizuschalten: " . $bestaetigungsLink;

// Headerdateien
$headers = array();
$headers[] = "MIME-Version: 1.0";
$headers[] = "Content-type: text/html; charset=utf-8";
$headers[] = "From: {bruno.kirchmeier@gmail.com}";
$headers[] = "Reply-To: {bruno.kirchmeier@gmail.com}";
$headers[] = "Subject: {$betreff}";
$headers[] = "X-Mailer: PHP/" . phpversion();


mail('bruno_churchi@gmx.ch', $betreff, $mailText, implode("\r\n", $headers) );






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



echo $admin->NeuerEintrag('bruno_churchi@gmx.ch', 'michael.gyger', 'Melide10+', '', 1);

echo $admin->NeuerEintrag('bruno_churchi@gmx.ch', 'michael.gyger2', 'Melide10+', '', 2);





/*
$bandList->NeuerEintrag(7, "Eintrag 1", "2017.08.02", "Montag", "Bühne 1", "20:00:00", "Band 2", "assets/images/jpg/Band_Bilder/1.pgn", "assets/images/jpg/Band_Bilder/2.pgn", "assets/images/jpg/Band_Bilder/3.pgn",
                            "https://de-de.facebook.com/EdSheeranMusic/", "https://de-de.facebook.com/EdSheeranMusic/", "https://de-de.facebook.com/EdSheeranMusic/", "https://de-de.facebook.com/EdSheeranMusic/");
*/
/*
$test = $ticketarten->NeuerEintrag('', "Erte Tikchet Art", "dies kann man kaufen", "2017.10.10", "20:00:00", "Pfäffiokn", 100,
                                    200, 0, "2017.09.10", "2017.09.20", 1);
*/

// echo $bandList->Lesen();

// var_dump( $bandList->Lesen());



// $bandList->Loeschen("id", 61);

 // $admin->NeuerEintrag("bruno_churchi@gmx.ch.com", "Bruno", "Bruno?2",'078 800 00 00',1);

/*
$test = $ticketarten->NeuerEintrag('', "Erte Tikchet Art", "dies kann man kaufen", "2017.10.10", "20:00:00", "Pfäffiokn", 100,
                                    200, 0, "2017.09.10", "2017.09.20", 1);
*/





/*
$updateSpalte = [ 'bild', 'title', 'beschreibung', 'eventDatum', 'eventZeit', 'eventOrt', 'ticketPreis', 'maximaleAnzahlTickets', 'verkaufteAnzahlTickets', 'startDatumTicketVerkauf',
    'endDatumTicketVerkauf', 'administratoren_id  '];

$updateWert = [ 'ssets/images/svg/Tickets/1Tag_A.svg', 'Tagesticket ganz neu', 'DAs Ticket ist für den ganzen Tag gülig', '2017.12.12', "20:00:00", 'Pfäffikon', 100, 200, 0, "2017.08.20", "2017.09.20", 1];
*/


/*
$updateSpalte = [ 'bild', 'title', 'beschreibung', 'eventDatum', 'eventZeit', 'eventOrt', 'ticketPreis', 'maximaleAnzahlTickets', 'verkaufteAnzahlTickets', 'startDatumTicketVerkauf',
    'endDatumTicketVerkauf', 'administratoren_id'];

$updateWert = [ 'assets/images/svg/Tickets/1Tag_A.svg', 'Tagesticket so guet gel', 'DAs Ticket ist für den ganzen Tag gülig', '2017.12.12', "20:00:00", 'Pfäffikon', 100, 200, 10, "2017.08.20", "2017.09.20", 1];



$test = $ticketarten->Update(-1, $updateSpalte, $updateWert, "id", 4);

echo json_encode( $test );

*/

