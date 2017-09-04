<?php

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////   FUNKTIONSEFINITIONEN
/////////////////
/////////////////   datumValidieren             Mit dieser Funktion kann ein DAtum auf das Format yyyy.mm.dd überprüft werden. Zuerst wird ide Eingabe son allen Zeichen geflitert
/////////////////                               Mit Ausnahme  von ZAhlen und Punkt. Dnach erfolg die überprüfung auf das Format. Ist das Format koreelt, so wird der gefilterte Wert heraus
/////////////////                               gegeben, ansonsten folgt ein false.   Diese Funktio wird in den klassen für DAtenbank Zugriff benötigt
/////////////////   zeitValidieren              Mit dieser Funktion kann eine Zeit auf das Format xx:xx  überprüft werden. Zuerst wird die Eingabe von allen Zeichen geflitert
/////////////////                               Mit Ausnahme von Zahlen und Doppelpunkten. Dnach erfolg die überprüfung auf das Format. Ist das Format koreelt, so wird der gefilterte Wert heraus
/////////////////                               gegeben, ansonsten folgt ein false.   Diese Funktio wird in den klassen für DAtenbank Zugriff benötigt
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



// Funktionen Validiert ein Datum. Das Funktiomsargument wird zuerst von unnötugen Zeichen gefiltert. DAnn wird der gefliterte Wert mit dem Vorgabe Musterformat verglichen
// Ist dieses korrekt, so wird der gefilterte Wert ausgegeben, ansonsten ein false
// Das geforderte Format für Datum ist :     yyyy.mm.dd
function datumValidieren($string_datum)
    {
    // Zuerst werden alle Zeichen entfernt, die nicht erlaubt sind. Dies sind alle ausser Zahlen und Punkte
    $regexEntfernen = '/[^0-9\.]/';
    $datumGeflitert = preg_replace($regexEntfernen, '', $string_datum);

    // Prüfen ob es ein Reales Datum sein Kann vom Syntax her
    // Das erste Argument ist ein reguläre Ausdruck, welcher als MAske mit der Eingabe, dem zweiten Argument verglichen wird. Ist das Suchmuster identisch
    // vom Muster her, so gibt die Funktion true zurück
    $regexValide = '/^\d{4}\.\d{2}\.\d{2}$/';
    $datumValide = preg_match_all($regexValide, $datumGeflitert);

    // DEm Returnwert wird das korrekte gefilterte Datum mitgegeben. Sollte das geflilterte DAtum nachwievor kein korrektes Datum sein, wird fals retour gegeben
    if ( $datumValide ) {
        return $datumGeflitert;
    }
    else {
        return false;
    }

}



// Funktionen Validiert eine Zeit. Das Funktiomsargument wird zuerst von unnötugen Zeichen gefiltert. DAnn wird der gefliterte Wert mit dem Vorgabe Musterformat verglichen
// Ist dieses korrekt, so wird der gefilterte Wert ausgegeben, ansonsten ein false
// Das geforderte Format für Zeit ist :     hh:mm:ss
function zeitValidieren($string_zeit)
{
    // Zuerst werden alle Zeichen entfernt, die nicht erlaubt sind. Dies sind alle ausser Zahlen und Punkte
    $regexEntfernen = '/[^0-9\:]/';
    $zeitGeflitert = preg_replace($regexEntfernen, '', $string_zeit);

    // echo "zeit gefliter : ".$zeitGeflitert;
    // Prüfen ob es ein Reales Datum sein Kann vom Syntax her
    // Das erste Argument ist ein reguläre Ausdruck, welcher als MAske mit der Eingabe, dem zweiten Argument verglichen wird. Ist das Suchmuster identisch
    // vom Muster her, so gibt die Funktion true zurück
    $regexValide = '/^([0-2]{1})([0-9]{1}):([0-5]{1})([0-9]{1}):([0-5]{1})([0-9]{1})$/';
    $zeitValide = preg_match_all($regexValide, $zeitGeflitert);

    // Dem Returnwert wird das korrekte gefilterte Datum mitgegeben. Sollte das geflilterte DAtum nachwievor kein korrektes Datum sein, wird fals retour gegeben
    if ( $zeitValide ) {
        return $zeitGeflitert;
    }
    else {
        return false;
    }

}



// Funktionen Validiert einen Pfad. Das Funktiomsargument wird zuerst von unnötugen Zeichen gefiltert, damit Hackerangriffe minimiert werden können.
// Folgende Zeichen sind erlaubt :  Buchstaben (gross und klein), Zahlen, Punkte, Doppelpunkte, Undelines, Backslach und Forwardslash.
// Alle Andren Zeichen werden herausgefilert
// Als Rückgabewert wird der gefliterte pfad zurückgegeben
function pfadeValidieren($string_pfad)
{
    // Zuerst werden alle Zeichen entfernt, die nicht erlaubt sind. Dies sind alle ausser Zahlen und Punkte
    $regexEntfernen = '/[^a-z0-9\\\\\/.:_-]/i';  // das i am ende steht für gross und kleinschreibung
    $pfadGeflitert = preg_replace($regexEntfernen, '', $string_pfad );

    // Das Prüfen des Pfades auf mögliche nicht korrekte Muster wird in der Funktion aussgelassen. Dafür kann dies ausserhalb mit
    // bereits geschriebenen Funktionen gemacht werden

    // Dem Returnwert wird das korrekte gefilterte Datum mitgegeben. Das vorhandensein des Pfades wird nicht innerhalb dieser Funktion getestet,
    // da dieser enevntuell noch gar nicht exisiert. Dies muss ausserhalb geprüft werden z.B. mit Funktion:   file_exists
    return $pfadGeflitert;
}



// Funktionen Validiert ein Url. Das Funktiomsargument wird zuerst von unnötugen Zeichen gefiltert, damit Hackerangriffe minimiert werden können.
// Die folgende Funktion ist mir im Internet aufgefallen mit bereits allen möglichen Filtern :    http://php.net/manual/bg/filter.filters.sanitize.php
// Als Rückgabewert wird der gefliterte pfad zurückgegeben
function urlValidieren($string_url) {

    // Url Validation
    // Mit der Funktion filter werden zuerst alle Illegalen Zeichen entfernt. Ist die Êingabe gültig, so wird das Resultat ausgegeben
    if (filter_var($string_url, FILTER_VALIDATE_URL)) {
        // Wenn alles korrekt ist, dann wird die gefilterte url ausgegeben
        return filter_var($string_url, FILTER_SANITIZE_URL);
        // Ansonsten wird false retou gegeben
    } else {
        return false;
    }
}


// Funktionen Validiert ein Url. Das Funktiomsargument wird zuerst von unnötugen Zeichen gefiltert, damit Hackerangriffe minimiert werden können.
// Die folgende Funktion ist mir im Internet aufgefallen mit bereits allen möglichen Filtern :    http://php.net/manual/bg/filter.filters.sanitize.php
// Als Rückgabewert wird der gefliterte pfad zurückgegeben
function emailValidieren($string_email) {

    // Email Validation
    // Mit der Funktion filter werden zuerst alle Illegalen Zeichen entfernt. Ist die Êingabe gültig, so wird das Resultat ausgegeben
    if (filter_var($string_email, FILTER_VALIDATE_EMAIL)) {
        // Wenn alles korrekt ist, dann wird die gefilterte url ausgegeben
        return filter_var($string_email, FILTER_VALIDATE_EMAIL);
        // Ansonsten wird false retou gegeben
    } else {
        return false;
    }
}



// Das Funktiomsargument wird zuerst von unnötugen Zeichen gefiltert, damit Hackerangriffe minimiert werden können.
// Alle nicht Zahlen werden herausgefiltert
function phoneValidieren($string_phone) {

    // Zuerst werden alle Zeichen entfernt, die nicht erlaubt sind. Dies sind alle ausser Zahlen und Punkte
    // $regexEntfernen = '/[^0-9-]/'
    $regexEntfernen = '/[^0-9]/';
    $phoneGeflitert = preg_replace($regexEntfernen, '', $string_phone );

    // Prüfen ob die Eingabe gemäss Vorgabe korrekt ist
    // Das erste Argument ist ein reguläre Ausdruck, welcher als MAske mit der Eingabe, dem zweiten Argument verglichen wird. Ist das Suchmuster identisch
    // vom Muster her, so gibt die Funktion true zurück
    // $regexValide = '/^([0-9]{4}-{1}[0-9]{3}-{1}[0-9]{3}-{1}[0-9]{2}-{1}[0-9]{2})$/';  // FORMAT EINGABE :       Handy: 0041-079-800-80-80  oder Festnetz schweiz: 0041-044-788-80-80
    $regexValide = '/[0-9]$/';  // {9, 16}
    $phoneValide = preg_match_all($regexValide, $phoneGeflitert);

    // Dem Returnwert wird das korrekte gefilterte Datum mitgegeben. Sollte das geflilterte DAtum nachwievor kein korrektes Datum sein, wird fals retour gegeben
    if ( $phoneValide ) {
        return $phoneGeflitert;
    }
    else {
        return false;
    }



}


// Mit dieser Funktion wird eingegebener Text von HTML Tags gefiltert. Es brauht keine HTML Tag  in den Ihalten
// Ursprünglich arbeitete ich mit htmlspecialchars, aber dann müsste bei dejer abfrage wieder eine Schlazfe gemacht werden über alle Resultate. Zudem
// Könnte schädlicher Code ausgeliefert werden. Mit entfernen dieser Zeichen kann nichst passiewren
// ICh habe den REgulären Ausdruch von folgener Internetseite kopiert :
// https://www.tutorials.de/threads/regex-html-tags-inhalt-entfernen.363093/

function textValidieren($string_text) {

    // Zuerst werden alle Zeichen entfernt, die nicht erlaubt sind. Dies sind alle ausser Zahlen und Punkte
    // $regexEntfernen = '/[^0-9-]/'
    $regexEntfernen = "@<(\S+)([^>]*/>|.*</\1\s*>)@is";  // "@<(\S+)([^>]*/>|.*</\1\s*>)@is";

    // Ausgabe des Textes mit den heruasgefilterten Zeichen
    return preg_replace($regexEntfernen, '', $string_text );
}

