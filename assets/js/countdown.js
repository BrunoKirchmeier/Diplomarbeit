

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////     COUNTDOWN             Ausgabe Timer auf Startseite bis beginn des ventes - diese DAtum ist im Moment statisch und kann später noch im BAckeend verändert werden
/////////////////                           HHTML Page : header.php
/////////////////
/////////////////     FUNKTIONS - AUFRUFE
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


//    Funktionen ohne event ausführen - Zyklisch
setInterval(function() {

    // Countdown erzeugen
    var countdown = zeitDifferenz(2017, 12, 20, 17,10);

    KreisZeichnen(".countdown__tage__kreis", countdown[0]);
    KreisZeichnen(".countdown__stunden__kreis", countdown[1]);
    KreisZeichnen(".countdown__minuten__kreis", countdown[2]);
    KreisZeichnen(".countdown__sekunden__kreis", countdown[3]);

}, 1000);




//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////     FUNKTIONS - DEFINITIONEN
/////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// Kreis für Anzeige Countdown zeichnen und  Wert als Text speichern
function KreisZeichnen(htmlKlasse, string_wert) {

    // HTML Referenz per Klasse mit  Dommanipulation laden
    var domElementCanvas = $(htmlKlasse);
    if (domElementCanvas.get(0).getContext) {

        // Zeichenfläche für Canvas Elemente erstellen, sofern nicht bereits vorhanden
        var kreis = domElementCanvas.get(0).getContext("2d");

        // Kreis efinieren mit Sytles
        // arc(x, y, radius, startWinkel, endWinkel)
        var x = domElementCanvas.width()/2;
        var y = domElementCanvas.height()/2;
        kreis.arc(x, y, domElementCanvas.width()/2 -2, 0, 2*Math.PI);
        kreis.strokeStyle = '#00a6e2';
        kreis.fillStyle = "rgba(240, 240, 245, 0.8)"; // "rgba(240, 240, 245, 0.1)"

        // Damit Text schön zentriert wird
        kreis.textBaseline = 'middle';
        kreis.textAlign = 'center';
        kreis.font = "15px Arial";

        // Kreis und gestaltung darstellen
        kreis.stroke();
        kreis.fill();

        // Text innerhalb von Kreis schreiben
        kreis.strokeText(string_wert, x, y);
    }
}



// Ausgabewert der Zeitdifferenz als Array      / Eingabewert: Startdatum und Uhrzeit
// ARRAY [0] = Anzahl Tage  /   ARRAY [1] = Anzahl Sunden     ARRAY [2] = Anzahl Minuten     ARRAY [3] = Anzahl Sekunden     EINGABEFORMAT:  JJJJ-MM-DD-HH-SS
function zeitDifferenz(integer_Jahr, integer_Monat, integer_Tag, integer_Stunden, integer_Minuten) {

    var start = new Date (Date.now() );
    var ende = new Date (integer_Jahr, integer_Monat, integer_Tag, integer_Stunden, integer_Minuten, 0);

    // Anzahl Sekunden  - Um Millisekunden zu vermeiden wird das Rsultat durch 100 Dividiert
    var sekundenTotal = (ende - start) / 1000;



    //////////////////////  Berrechnung anzahl Tage, Stunden, Minuten und Sekunden ////////////////////////////////////////////////////////
    // Mit Math.floor abgerundet auf ganze Zahlen
    // Ein Tag hat 86400 Sekunden
    var tageDifferenz = Math.floor(sekundenTotal / 86400 );

    // Eine Stunde hat 3600 Sekunden - Der resten eines Tages (Modulo) wird durch 3600 geteilt
    var stundenDifferenz = Math.floor ((sekundenTotal / 86400) / 3600 );

    // Eine Minute hat 60 Sekunden - Der resten einer Stunde (Modulo) wird durch 60 geteilt
    var minutenDifferenz = Math.floor (( (sekundenTotal % 86400) % 3600) / 60 );

    // Der gesamte Moduloresten sind die verbeibenden sekunden
    var sekundenDifferenz = Math.floor (( (sekundenTotal % 86400) % 3600) % 60);


    //////////////////////  Ausgabe des Resultates in einem ARRAY ////////////////////////////////////////////////////////
    var resultat = [];
    resultat[0] = tageDifferenz;
    resultat[1] = stundenDifferenz;
    resultat[2] = minutenDifferenz;
    resultat[3] = sekundenDifferenz;

    return resultat;
}