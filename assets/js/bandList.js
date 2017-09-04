/*
 Mit dieser Seite werden Funktionen zum Anzeigen einer gesamtliste und einer Detailliste aller BAnddaten erlegigt
 1. Bandliste anzeigen mit allen Bands
 2. Detailansicht einer einzelnen Band


 Die Liste ist im HTML nicht vorhanden - nur der Eintstiegscontainer.
 Der DOM Baum wird mit Javascript erstellt, nachdem mit Ajax die Banddaten vom Servergelesen wurden


 Zum Zwischenspeichern von Eingaben des Users wird mit Local Storgae gearbeitet. Eine alternative, sollte dieser nicht untersützt werden, ist im Moment noch nicht vorgesehen

 Der Ajax Aufruf wird mittels Funktionsauruf mit Parameter gemacht. Die Steuerung der Aufgabe geschieht mittels einer Steuervariablen mit folgender Struktur:

 var dataToSend = {
 tabelle         : "",
 funktion        : "",
 parameter       : "",
 spaltenName     : "",
 spaltenWert     : "",
 idZeile         : -1 ,
 updateSpalte    : [],
 updateWert      : []
 };

 In der local Storage werden folgende DAten gespeichert:

 1.  Serverdaten mit Bandlist


 */


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////     FUNKTONSAUFRUFE OHNE EVENTS, AUSSER SEITE GELADEN
/////////////////
/////////////////     INITIALISIERUNGEN
/////////////////
/////////////////
/////////////////
/////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// Rootverzeichnisse ür Serverzugriffe
// PHP Server root Verzeichnis
var rootAjax = '';  // 'http://localhost/Web_Professional/_DIPLOMARBEIT/Testprojekt/'    // http://localhost:3000/Web_Professional/_DIPLOMARBEIT/Testprojekt
var rootBilder = '';  // Web_Professional/DIPLOMARBEIT/Testprojekt/


// Bandlist + MENUE FILTERKRITERIEN
// Variablendefinitionr
var objektAktivesFilterKriterium;
var aktivesFilterKriterium;
var wertFilterKriterium;


// AJAX
// Variable mit Serverdaten
var bandDatenVonServer = undefined;


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////     AJAX CALL             Kommunikationsobjekte - Schnittstellen zu PHP Server ( Ajax call muss auf gleicher Seite sein, wie daten gebraucht werden. Ansonsten müsste mit gloablen
/////////////////                           Variablen  oder mit Session / Cookies oder lokalem Web Storage gearbeitet werden
/////////////////     Bandlist              Ausgabe der Bands auf der Hauptseite. Beim erstmaligen Laden der Seite werden alle Bands ungeflitert angezeigt
/////////////////                           HHTML Page : header.php
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////




// AJAX + Bandlist
// Datenabfrage einmalig, sobald Dokument geladen ist
$(document).ready(function () {

    // Einmalig Banddaten von Server laden

    // Mit den Daten werden dem Server die Aufgaben Mittgeteilt. folgende Funktionsbefehl mit ensprechenden Argumenten sind möglich:

    // 1.  "tabelle' : band"                    Hier wird gefiniert, welche Tabelle nagesprochen werden soll
    //               : admin
    //
    //
    //
    // 2.  "funktion' : schreiben"              Es wird ein neuer Datensatz erstellt.
    //
    //      a.   "datensatz' : []"              Es müssen alle Felder befüllt sein. Der Parameter besteht aus einen Array mit Werten. Die Werte werden gemäss folgender Reihenfolge abgefüllt
    //
    //
    //      [0]   administratoren_id"           Integer (Es muss aber zwingend einegültige id mitgeschrieben werden)
    //      [1]   beschreibung"                 Text
    //      [2]   eventDatum"                   Format : jjjj.mm.dd
    //      [3]   eventTag"                     Text
    //      [4]   eventOrt"                     Text
    //      [5]   eventZeit"                    Format : hh:mm:ss
    //      [6]   title"                        Text
    //      [7]   bild_1"                       Eine pfadangabe auf dem gleichen Server, wo das Bild abgelegt ist.
    //      [8]   bild_2"                       Eine pfadangabe auf dem gleichen Server, wo das Bild abgelegt ist.
    //      [9]   bild_3"                       Eine pfadangabe auf dem gleichen Server, wo das Bild abgelegt ist.
    //      [10]  linkFacebook"                 Link  -  Es wird eine url Validierung vorgenommen -also auf synatx achten
    //      [11]  linkYoutoube"                 Link  -  Es wird eine url Validierung vorgenommen -also auf synatx achten
    //      [12]  linkInstagramm"               Link  -  Es wird eine url Validierung vorgenommen -also auf synatx achten
    //      [13]  linkTwitter"                  Link  -  Es wird eine url Validierung vorgenommen -also auf synatx achten
    //
    //
    // .   "funktion' : lesen"                  Es werden Daten gelesen   - im Feld Parameter muss zusäzlich angegeben werden, welche DAten gelesen werden sollen
    //      a.   "parameter' : alle"            Es werden alle Daten gelesen
    //
    //      c.   "parameter' : suchen"          Es werden alle Daten gelesen, welche in der Spalte einen gewissen Wert aufweisen. Die gesuchte Spaltenbezeichnung und dessen Wert werden in den folgenden Parametern definiert
    //          I.    "spaltenName' : x"        Eingabe String welche Spalte auf der Datenbank nach dem Wert durhsucht werden soll
    //          II.   "spaltenWert' : x"        Eingabe String welchen Wert die oben genannte Spalteaufweissen soll
    //
    // 4.   "funktion' : loeschen"              Es werden Daten gelöscht   - im Feld Parameter muss zusäzlich angegeben werden, welche DAten gelesen werden sollen
    //      a.   "parameter' : alle"            Es werden alle Daten gelesen
    //
    //      c.   "parameter' : suchen"          Es werden alle Daten gelesen, welche in der Spalte einen gewissen Wert aufweisen. Die gesuchte Spaltenbezeichnung und dessen Wert werden in den folgenden Parametern definiert
    //          I.    "spaltenName' : x"        Eingabe String welche Spalte auf der Datenbank nach dem Wert durhsucht werden soll
    //          II.   "spaltenWert' : x"        Eingabe String welchen Wert die oben genannte Spalteaufweissen soll
    //
    // 5.   "funktion' : update"                DAten auf dem Server werden überschrieben.
    //      a.   "parameter' : alle"            Es wird in allen Zeilen die betrefende Spalte mmit den vorgegebenen Wert überschrieben
    //
    //      b.   "parameter' : id"              Nur eine bestimmte Zeile mit id wird verändert
    //          I.    "idZeile'         : x"    Hier wird die id eingetragen
    //          I.    "updateSpalte'    : x"    Ein Array aus einem oder mehreren Strings. Alle Spalten welche überschrieben werden sollen werden hier eingetragen
    //          II.   "updateWert'      : x"    Ein Array aus einem oder mehreren Werten. Hier werden die Werte in gleicher Reihenfolge wie oben die Spalten eingetragen
    //
    //      c.   "parameter' : suchen"          Nur DAten mit einem gewissen Spaltenwert in einer gesuchten Spalte werden verändert
    //          I.    "spaltenName'     : x"    Eingabe String welche Spalte auf der Datenbank nach dem Wert durhsucht werden soll
    //          II.   "spaltenWert'     : x"    Eingabe String welchen Wert die oben genannte Spalteaufweissen soll
    //          III.  "updateSpalte'    : x"    Ein Array aus einem oder mehreren Strings. Alle Spalten welche überschrieben werden sollen werden hier eingetragen.
    //                                          Es werden nur jene Zeilen verändert, auf welche das Kriterium der suche enstspricht
    //                                          EINGABE ALS :  [' ']
    //          IV.   "updateWert'      : x"    Ein Array aus einem oder mehreren Werten. Hier werden die Werte in gleicher Reihenfolge wie oben die Spalten eingetragen
    //


    /*
     var administratoren_id = 7;
     var beschreibung = '';
     var eventDatum  = '2017.01.02';
     var eventTag = '';
     var eventOrt = '';
     var eventZeit = '20:00:00';
     var title = '';
     var bild_1 = '';
     var bild_2 = '';
     var bild_3 = '';
     var linkFacebook = 'https://www.facebook.com/EdSheeranMusic';
     var linkYoutoube = 'https://www.youtube.com/user/EdSheeran';
     var linkInstagramm = 'https://www.instagram.com/teddysphotos';
     var linkTwitter = 'https://twitter.com/edsheeran';

     var dataToSend = {
     tabelle: "band",
     funktion: "schreiben",
     parameter: "suchen",
     spaltenName: "eventTag",
     spaltenWert: "Sonntag",
     idZeile: -1,
     updateSpalte: ['eventZeit', 'title'],
     updateWert: ['21:55:00', 'ahha'],
     datensatz: [administratoren_id, beschreibung, eventDatum, eventTag, eventOrt, eventZeit, title, bild_1, bild_2, bild_3, linkFacebook, linkYoutoube, linkInstagramm, linkTwitter]
     };

     */




    // Diese Variable wird anhand der gewünschten Ajax Funktion zur Laufzeit dynamisch beschrieben
    // Auf diese Weise wird dem PHP Server die Aufgabe mitgeteilt
    var dataToSend = {
        tabelle         : "band",
        funktion        : "lesen",
        parameter       : "alle",
        spaltenName     : "",
        spaltenWert     : "",
        idZeile         : -1 ,
        updateSpalte    : [],
        updateWert      : []
    };

    $.ajax({
        url: rootAjax + 'assets/php/model/ajaxDatenbank.php',  // rootAjax + 'assets/php/model/ajaxDatenbank.php'
        type: 'POST',
        cache: false,
        dataType: 'json', // json
        data: JSON.stringify(dataToSend),
        xhrFields: {
            withCredentials: true
        },
        // Anmeldedaten, damit ein Zugriff uaf den PHP Server erlaubt ist
        headers: {'Authorization': 'Basic ' + btoa('admin:diplomarbeit')
        }

    }).done(function(data) {
        // Daten Ausgeben in index.php.
        // console.log(data);
        bandDatenVonServer = data;
        bandListAnzeige( $(".contentBandListDaten"), "", "", bandDatenVonServer);

    }).fail(function(){
        console.log("Error!");
    });





});




//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////     FUNKTONSAUFRUFE UEBER EVENTS
/////////////////
/////////////////
/////////////////
/////////////////
/////////////////
/////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////     DOM Selektoren
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// Bandlist + MENUE FILTERKRITERIEN
// Html Dom Selektor
var menueFilterkriterien = $(".contentBandListFilterDropdown__kat"); // // Parent Klasse mit eigentlichem Inhalt von Filterkriterium Menue
var filterWertLesen = $(".contentBandListFilterDropdown__element");

// MENUE FILTERKRITERIEN
// Filterkriterien Menue Dropdown - Filter löschen durch Klick auf alle
var menueFilterkriterienKeine = $(".contentBandListFilter__links"); // // Filter Kriterien löschen

// Bandlist Detailanzeige
// Beim Klicken auf ein Bandelement, soll die detailanzeige angezeigt werden
var bandlistDetailanzeige = $(".contentBandListDaten__element");






//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////     AUCH DIE EVENT GESTEUERTEN FUNKTIONEN WERDEN ERST GELADEN WENN AS DOKUMENT BEREIT IST
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
$(document).ready(function() {


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////     EVENT :   Bandlist gefiltert anzeigen und Filter auch wieder löschen, wenn der Button alle gedrückt wird
/////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    // Offnen oder schliessen des Hauptnaviagtions Menues im Mobile First Flyout Menue
    filterWertLesen.on('click', function () {

        // Lesen des aktiven Filterkriteriums
        objektAktivesFilterKriterium =  $(".contentBandListFilterDropdown [data-filteractive='true']");
        aktivesFilterKriterium = objektAktivesFilterKriterium.parent().parent().attr("data-filterKriterium");

        // Lesen des aktuellen Wertes im aktiven Filterkriterium
        wertFilterKriterium = objektAktivesFilterKriterium.attr("data-filterwert");

        // Daten Ausgeben in index.php.
        bandListAnzeige( $(".contentBandListDaten"),aktivesFilterKriterium ,wertFilterKriterium , bandDatenVonServer);
    });


    // Ebenso werden alle Filter gelöscht, wenn der Button ALLe auf index.php Seite gedrückt wird
    menueFilterkriterienKeine.on('click', function () {
        menueFilterkriterienElemente.attr('data-FilterActive', 'false') ;
        menueFilterkriterienElemente.css("color", "white");

        // Daten Ausgeben in index.php.
        bandListAnzeige( $(".contentBandListDaten"), "", "", bandDatenVonServer);
    });




//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////     EVENT :   Bandlist Detailanzeige einer einzelnen Band anzeigen
/////////////////               Mit dem zweiten event wird wieder zur Listenansicht gewechselt
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    // Bei diesem event muss nach dem 'click' noch ein weiterer Parameter belegt werden. Dieser representiert diejenige Klasse, auf welche der event scshlussentlich greifen wird.
    // Da die Elemente aber erst mit Javascript per Dom aufgebaut werden, muss dieser sogenannte delegate funktion genommen werden, damit der event später an die noch enstehende Klasse gebunden
    // werden kann
    $('.contentBandListDaten').on('click', '.contentBandListDaten__element', function () {

        // Das geklickte Element wird anhand des selbst erstellen Atributtes data-loop-index ermittelt.
        // Die detailansicht für das geklickte Bandelement wird angezeigt mit dem entsprechenden Index

        bandDetailAnzeige( $(".contentBandDetail"), $(this).attr('data-loop-index') , bandDatenVonServer );


        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        /////////////////     FUNKTION Slick Slider für Band Detailansicht starten
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

         $('.contentBandDetail__slider').slick({
         dots: true,
         // infinite: false,
         //speed: 300,
         autoplay:true,
         autoplaySpeed:3000,
         slidesToShow: 1
         });

    });


    // Bei diesem event muss nach dem 'click' noch ein weiterer Parameter belegt werden. Dieser representiert diejenige Klasse, auf welche der event scshlussentlich greifen wird.
    // Da die Elemente aber erst mit Javascript per Dom aufgebaut werden, muss dieser sogenannte delegate funktion genommen werden, damit der event später an die noch enstehende Klasse gebunden
    // werden kann
    // Die Listenansicht wird bei drücken des Buttons, welcher mit der Funktion bandDetailAnzeige erstellt wird verlasssen. Es wird wieder die gefilterte BandList angezeigt
    $('.contentBandDetail').on('click', '.contentBandDetail__divButton__back', function () {

        $('.contentBandDetail').children().remove();


        // Sofern noch kein Filter aktiviert wurde, sollen die Daten ausgegeben werden. Dazu müssen die Parameter Filterkriterium und Filterwert mit   "" belegt werden
        if (aktivesFilterKriterium !== undefined && wertFilterKriterium !== undefined) {
            bandListAnzeige( $(".contentBandListDaten"),aktivesFilterKriterium , wertFilterKriterium, bandDatenVonServer);
        }
        // Es sind Filterkriterien vorhanden, die Daten werden geflitert ausgegeben
        else {
            bandListAnzeige( $(".contentBandListDaten"),"" ,"" , bandDatenVonServer);
        }

    });


});




//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////     FUNKTIONS - DEFINITIONEN
/////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////     FUNKTION bandListAnzeige      Mit dieser Funktion wird das HTML mittels Javascript und DOM Manipulation aufgebaut. Ensprechend den Filterkriterien werden nur
/////////////////                                   jeweils die korrekten Bands aufgelistet. Die Filterkriterien sind (im moment) statisch bestimmt in Form von Strings.
/////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function bandListAnzeige (htmlKlasse, string_Filterkriterium, string_filterwert, arrayOfObject_serverDaten) {
    // "aktivesFilterkriterium" = 1 => Filtern nach Ort   |   "aktivesFilterkriterium" = 2 => Filter nach Datum
    //  WICHTIG!!!!!  DATENTYP IST :    Array of Objekten für Serverdaten
    //  WICHTIG!!!!!! DOM Selektro mittels JQUERY


    // Variablendefinitionen - Die Daten werden erst noch sortiert, da es aber mittels Pointer geschieht und auf die Adresse reagiert wollte ich dies in eine neue Variable kapseln
    var ServerDatenSortiert = arrayOfObject_serverDaten;
    var i = 0;

    // DOM Selektoren
    var bandListHtml = htmlKlasse;
    var containerClassName = htmlKlasse.attr('class');


    // Mit dieser Hilfsvariablen wird am Ende der Funktion geschaut, ob bei der IF abfrage für den Vergleich vom Filterwert mit dem Wert des Elementes der Fall auftritt,
    // das es bei keinem Loop eine übereinstimmung gibt. In diesem Fall wird am Ende der Funktion eine Meldung auf den Bildschirm ausgegeben
    var hilfsVariableZaehlerStand = 0;


    // Zuerst muss die aktuelle Ausgabe gelöscht werden, damit der DOM Baum neu aufgebaut weerden kann
    // Ebenso den Alternativ Text löschen
    htmlKlasse.children().remove();
    bandListHtml.html("");


    // Server Daten sortieren nach Datum und Uhrzeit
    // Die DAten sollen sortiert nach DAtum und Uhrzeit ausgegeben werden, dazu werden zuerst die Daten sortiert in ein neues Array abgelegt, damit dieses Array nachher aufsteigen ausgegeben werden kann
    // Dazu wird die sortierfunktion von Javascript verwendet, welche als Standartmethode eines Array gegeben ist.

    ServerDatenSortiert.sort(function(a, b)
    {
    // Der Funktion sortieren werden die Returnwerte  1- ( oder kleiner ), 0 oder 1 (oder grösser ) zugewiesen. So entscheidet, ob ein Wert grösser, kleiner oder gleich ist. DA zwei Werte gleichzeitig sortiert weden müssen
    // DAtum und Uhrzeit, so reicht ein einfacher Vergleich nicht aus. Es folgt ein zweiter block, welcher ebenso das Datum vergleicht.
    // Mit einer

        // Datum
        // Erster Vergleich, ob das Datum dass gleiche ist
        // Ist dies nicht der Fall, so wird kein returnwert gegeben, und es kann nach dem zweiten Kriterium weitersortiewrt werden
        // Mit einer Sibtraktion wird gleich festgestellt ob der Wert kleiner, gleich oder grösser ist
        {
            if (a.eventDatum - b.eventDatum !== 0)
                return a.eventDatum - b.eventDatum;
        }
        // Uhrzeit
        // Zweiter Vergleich, ob die Zeit die gleiche ist. Dieser Vergleich wird erst durchgeführt, wenn der erste Vergleich das Resultat 0 ergibt
        // Mit einer Sibtraktion wird gleich festgestellt ob der Wert kleiner, gleich oder grösser ist
        {
            return a.eventZeit  - b.eventZeit ;
        }
    });







    // Hilfsfunktion für DomElemente erzeugen. Mit dieser Funktion wird ein ganzes Html Band Element ausgegeben inklusive klassen und DAten
    // Diese Funktion wird unten in einem LOOP  in einer if Abfrage aufgerufen, sofern das Filterkriterium koreekt ist
    function domElementErzeugen() {

        // Container des  Elementes erzeugen und im Dom an PArent Element anbinden
        // var element = bandListHtml.append("<div></div>");
        var element = $("<div></div>").appendTo(bandListHtml);
        element.attr('class', containerClassName + '__element');
        // In diesem selbst erzeugten Attributt wird die id des Datenbamk Eintrages gespeichert
        // Mit dem zweiten Attributt wird der LOOP Index gespeichert, welcher für die Ansicht der Detailansicht wichtig ist
        if ( arrayOfObject_serverDaten !== undefined) {
            element.attr('data-datenbank-id', ServerDatenSortiert[i].id);
            element.attr('data-loop-index', i);
        }


        //Inhaltscontainer DIV für Bild  erzeugen
        var elementBildContainer = $("<div></div>").appendTo(element);
        elementBildContainer.attr('class', containerClassName + '__element__bild');

        //  img Tag für Bild  erzeugen und mit Inhalt abffülllen
        var elementBild = $("<img>").appendTo(elementBildContainer);
        elementBild.attr('class', containerClassName + '__element__bild__01');
        // Ausgabe der Daten von der Datenbank
        // Jedoch werden nur Daten ausgegeben, wenn bereits welche vorhanden sind
        if ( arrayOfObject_serverDaten !== undefined) {
            elementBild.attr('src', rootBilder + ServerDatenSortiert[i].bild_1);
        }
        elementBild.attr('alt', "Es ist Leider kein Bild vorhanden");

        //Inhaltscontainer ür alle restlichen Daten
        var elementDaten = $("<div></div>").appendTo(element);
        elementDaten.attr('class', containerClassName + '__element__daten row');

        // Content von DIV Daten :    title  - Element erstellen, an Dom aninden und mit Content abffüllen
        var elementDatenTitle = $("<div></div>").appendTo(elementDaten);
        elementDatenTitle.attr('class', containerClassName + '__element__daten__titel col-xs-12');
        // Ausgabe der Daten von der Datenbank
        // Jedoch werden nur Daten ausgegeben, wenn bereits welche vorhanden sind
        if ( arrayOfObject_serverDaten !== undefined) {
            elementDatenTitle.html(ServerDatenSortiert[i].title);
        }

        // Content von DIV Daten :    Tag  - Element erstellen, an Dom aninden und mit Content abffüllen
        var elementDatenTag = $("<div></div>").appendTo(elementDaten);
        elementDatenTag.attr('class', containerClassName + '__element__daten__tag col-xs-1');
        // Ausgabe der Daten von der Datenbank
        // Jedoch werden nur Daten ausgegeben, wenn bereits welche vorhanden sind
        if ( arrayOfObject_serverDaten !== undefined) {
            elementDatenTag.html(ServerDatenSortiert[i].eventTag.substring(0, 2));
        }

        // Content von DIV Daten :    Zeit  - Element erstellen, an Dom aninden und mit Content abffüllen
        var elementDatenZeit = $("<div></div>").appendTo(elementDaten);
        elementDatenZeit.attr('class', containerClassName + '__element__daten__zeit col-xs-4');
        // Ausgabe der Daten von der Datenbank
        // Jedoch werden nur Daten ausgegeben, wenn bereits welche vorhanden sind
        if ( arrayOfObject_serverDaten !== undefined) {
            elementDatenZeit.html(ServerDatenSortiert[i].eventZeit.substring(0, 5) + " Uhr");
        }

       // Content von DIV Daten :    Trennbalken  - Element erstellen, an Dom aninden
        var elementDatenTrennbalken = $("<div>|</div>").appendTo(elementDaten);
        elementDatenTrennbalken.attr('class', containerClassName + '__element__daten__trennbalken col-xs-1');

        // Content von DIV Daten :    Ort  - Element erstellen, an Dom aninden und mit Content abffüllen
        var elementDatenOrt = $("<div></div>").appendTo(elementDaten);
        elementDatenOrt.attr('class', containerClassName + '__element__daten__ort col-xs-4');
        // Ausgabe der Daten von der Datenbank
        // Jedoch werden nur Daten ausgegeben, wenn bereits welche vorhanden sind
        if ( arrayOfObject_serverDaten !== undefined) {
            elementDatenOrt.html(ServerDatenSortiert[i].eventOrt);
        }

    }



    // Filterkriterium kontrollieren, um zu schauen, was alles ausgegeben werden soll
    // WERT 0 = FILTERN NACH ORT
    if (string_Filterkriterium === "ort"  && ServerDatenSortiert !== undefined ) {
        // LOOP mit Vergleich
        for (i; i < ServerDatenSortiert.length; i++) {

            if (string_filterwert === ServerDatenSortiert[i].eventOrt) {
                domElementErzeugen();
            }
            else {
                // Mit einem Zähler wird geschaut, ob ein Fall eintrifft, dass kein Eintrag auf das Filterkriterium zutrifft.
                // In diesem Falle wird auf dem Bildschirm eine Meldung ausgegeben. Die Ausgabe erfolgt erst am Ende der Funktion nchdem der Loop beendet wurde
                hilfsVariableZaehlerStand += 1;
            }
        }
    }

    // WERT 1 = FILTERN NACH DATUM
    else if (string_Filterkriterium === "datum"  && ServerDatenSortiert !== undefined ) {
        // LOOP mit Vergleich
        for (i; i < ServerDatenSortiert.length; i++) {

            if (string_filterwert === ServerDatenSortiert[i].eventDatum) {
                domElementErzeugen();
            }
            else {
                // Mit einem Zähler wird geschaut, ob ein Fall eintrifft, dass kein Eintrag auf das Filterkriterium zutrifft.
                // In diesem Falle wird auf dem Bildschirm eine Meldung ausgegeben. Die Ausgabe erfolgt erst am Ende der Funktion nchdem der Loop beendet wurde
                hilfsVariableZaehlerStand += 1;
            }
        }
    }

    // WERT 1 = FILTERN NACH TAG
    else if (string_Filterkriterium === "tag"  && ServerDatenSortiert !== undefined ) {
        // LOOP mit Vergleich
        for (i; i < ServerDatenSortiert.length; i++) {

            if (string_filterwert === ServerDatenSortiert[i].eventTag) {
                domElementErzeugen();
            }
            else {
                // Mit einem Zähler wird geschaut, ob ein Fall eintrifft, dass kein Eintrag auf das Filterkriterium zutrifft.
                // In diesem Falle wird auf dem Bildschirm eine Meldung ausgegeben. Die Ausgabe erfolgt erst am Ende der Funktion nchdem der Loop beendet wurde
                hilfsVariableZaehlerStand += 1;
            }
        }
    }

    // WERT 1 = FILTERN NACH DATUM
    else if (string_Filterkriterium === "zeit"  && ServerDatenSortiert !== undefined ) {
        // LOOP mit Vergleich
        for (i; i < ServerDatenSortiert.length; i++) {

            if (string_filterwert === ServerDatenSortiert[i].eventZeit) {
                domElementErzeugen();

            }
            else {
                // Mit einem Zähler wird geschaut, ob ein Fall eintrifft, dass kein Eintrag auf das Filterkriterium zutrifft.
                // In diesem Falle wird auf dem Bildschirm eine Meldung ausgegeben. Die Ausgabe erfolgt erst am Ende der Funktion nchdem der Loop beendet wurde
                hilfsVariableZaehlerStand += 1;
            }
        }
    }

    // DEFAULT - EBENFALLS KEIN FILTER GESETZ - ALLE AUSGEBEN
    else if ( (string_Filterkriterium !== undefined || null || "") &&  ServerDatenSortiert !== undefined ) {
        for (i; i < ServerDatenSortiert.length; i++) {
            domElementErzeugen();
        }
    }

    else {
        // Keinen Fllback Funktio nötig
    }


    // Mit einem Zähler wird geschaut, ob ein Fall eintrifft, dass kein Eintrag auf das Filterkriterium zutrifft.
    // In diesem Falle wird auf dem Bildschirm eine Meldung ausgegeben. Hier erfolgt die Ausgabe der MEldung
    if (ServerDatenSortiert === undefined ) {
        bandListHtml.html(" Daten sind am Laden");
    }
    else if ( ((hilfsVariableZaehlerStand === ServerDatenSortiert.length) && (hilfsVariableZaehlerStand !== 0)) ) {
        bandListHtml.html(" Für diesen Filter gibt es keine Resultate");
    }

}

// string_Filterkriterium, string_filterwert,


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////     FUNKTION bandDetailAnzeige    Mit dieser Funktion wird das HTML mittels Javascript und DOM Manipulation aufgebaut.
/////////////////                                   jeweils die korrekten Bands aufgelistet. Es wird die Band detailansicht gezeigt.
/////////////////                                   Die Funktiono banListAnzeige darf nicht erschenen und dessen DOM Baum muss gelöscht werden
/////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function bandDetailAnzeige (htmlKlasse, integer_indexDaten, arrayOfObject_serverDaten ) {  // integer_indexDaten
    //  WICHTIG!!!!!  DATENTYP IST :    Array of Objekten für Serverdaten
    //  WICHTIG!!!!!! DOM Selektro mittels JQUERY



    // DOM Selektoren
    var bandListHtml = htmlKlasse;
    var containerClassName = htmlKlasse.attr('class');


    // Zuerst muss die aktuelle Ausgabe gelöscht werden, damit der DOM Baum neu aufgebaut weerden kann
    // Ebenso den Alternativ Text löschen
    // htmlKlasse.children().remove();
    $(".contentBandListDaten").children().remove();
    bandListHtml.html("");


    // Dann wird aus dem Htmlbaum aus dem selbst erstellen Attributt "data-datenbank-id" der Wert ausgelesen
    // Dieses Attributt beinhaltet die id, auf welcher die Werte in diesem Element auf der Datenbak gespeichert sind
    var indexDaten = integer_indexDaten;



    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //     CONTAINER FUER SLIDER - BILDER
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // Container des  Elementes erzeugen und im Dom an Parent Element anbinden
    var Slider = $("<div></div>").appendTo(bandListHtml);
    Slider.attr('class', containerClassName + '__slider' + ' ');


    // Div für Slide 1
    var SliderBild_01 = $("<div></div>").appendTo(Slider);
    SliderBild_01.attr('class', containerClassName + '__slider__bild-01');
    ////////////////////////////////////////////////////////////////////////////////////
    // IMG Tag für Slide 1
    var SliderBild_01_img = $("<IMG>").appendTo(SliderBild_01);
    SliderBild_01_img.attr('src', arrayOfObject_serverDaten[indexDaten].bild_1);
    SliderBild_01_img.attr('class', containerClassName + '__slider__bild-01__img');
    SliderBild_01_img.attr('alt', "Es ist Leider kein Bild vorhanden");


    // Div für Slide 2
    var SliderBild_02 = $("<div></div>").appendTo(Slider);
    SliderBild_02.attr('class', containerClassName + '__slider__bild-02');
    ////////////////////////////////////////////////////////////////////////////////////
    // IMG Tag für Slide 2
    var SliderBild_02_img = $("<IMG>").appendTo(SliderBild_02);
    SliderBild_02_img.attr('src', arrayOfObject_serverDaten[indexDaten].bild_2);
    SliderBild_02_img.attr('class', containerClassName + '__slider__bild-02__img');
    SliderBild_02_img.attr('alt', "Es ist Leider kein Bild vorhanden");


    // Div für Slide 3
    var SliderBild_03 = $("<div></div>").appendTo(Slider);
    SliderBild_03.attr('class', containerClassName + '__slider__bild-03');
    ////////////////////////////////////////////////////////////////////////////////////
    // IMG Tag für Slide 3
    var SliderBild_03_img = $("<IMG>").appendTo(SliderBild_03);
    SliderBild_03_img.attr('src', arrayOfObject_serverDaten[indexDaten].bild_3);
    SliderBild_03_img.attr('class', containerClassName + '__slider__bild-03__img');
    SliderBild_03_img.attr('alt', "Es ist Leider kein Bild vorhanden");


    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //     Titel
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // Elementes erzeugen und im Dom an Parent Element anbinden
    var elementTitel = $("<div></div>").appendTo(bandListHtml);
    elementTitel.attr('class', containerClassName + '__titel');


    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //     CONTAINER FUER Block Infos   -  Kurzinformationen wie bei Filteransicht, ohne titel
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // Container des  Elementes erzeugen und im Dom an Parent Element anbinden
    var kurzinfoContainer = $("<div></div>").appendTo(bandListHtml);
    kurzinfoContainer.attr('class', containerClassName + '__info row');

    // Content von DIV Daten :    Tag  - Element erstellen, an Dom aninden und mit Content abffüllen
    var kurzinfoTag = $("<div></div>").appendTo(kurzinfoContainer);
    kurzinfoTag.attr('class', containerClassName + '__info__tag col-xs-1');
    kurzinfoTag.html(arrayOfObject_serverDaten[indexDaten].eventTag.substring(0, 2) );

    // Content von DIV Daten :    Zeit  - Element erstellen, an Dom aninden und mit Content abffüllen
    var kurzinfoZeit = $("<div></div>").appendTo(kurzinfoContainer);
    kurzinfoZeit.attr('class', containerClassName + '__info__zeit col-xs-4');
    kurzinfoZeit.html(arrayOfObject_serverDaten[indexDaten].eventZeit.substring(0, 5) );

    // Content von DIV Daten :    Trennbalken  - Element erstellen, an Dom aninden
    var kurzinfoTrennbalken = $("<div>|</div>").appendTo(kurzinfoContainer);
    kurzinfoTrennbalken.attr('class', containerClassName + '__info__trennbalken col-xs-1');

    // Content von DIV Daten :    Ort  - Element erstellen, an Dom aninden und mit Content abffüllen
    var kurzinfoOrt = $("<div></div>").appendTo(kurzinfoContainer);
    kurzinfoOrt.attr('class', containerClassName + '__info__ort col-xs-4');
    kurzinfoOrt.html(arrayOfObject_serverDaten[indexDaten].eventOrt);


    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //     CONTAINER FUER DATENBLOCK 2   -  Anzeige Anzahl Shares
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // Container des  Elementes erzeugen und im Dom an Parent Element anbinden
    var AnzSharesContainer = $("<div></div>").appendTo(bandListHtml);
    AnzSharesContainer.attr('class', containerClassName + '__share row');

    // Div für feld links - Facebook Shares
    var AnzSharesFacebookDiv = $("<div></div>").appendTo(AnzSharesContainer);
    AnzSharesFacebookDiv.attr('class', containerClassName + '__share__div1 col-xs-3');
    // Bild Facebook Tag
    var AnzSharesFacebookImg = $("<img>").appendTo(AnzSharesFacebookDiv);
    AnzSharesFacebookImg.attr('class', containerClassName + '__share__div1__facebook');
    AnzSharesFacebookImg.attr('src', "assets/images/svg/Icons/Social_Media/Facebook_Icon.svg");

    // Div für feld mitte - leer zum einmitten
    var AnzSharesMitteDiv = $("<div></div>").appendTo(AnzSharesContainer);
    AnzSharesMitteDiv.attr('class', containerClassName + '__share__div2 col-xs-2');


    // Div für feld rechts - twitter Shares
    var AnzSharesTwitterDiv = $("<div></div>").appendTo(AnzSharesContainer);
    AnzSharesTwitterDiv.attr('class', containerClassName + '__share__div3 col-xs-3');
    // Bild twitter Tag
    var AnzSharesTwitterImg = $("<img>").appendTo(AnzSharesTwitterDiv);
    AnzSharesTwitterImg.attr('class', containerClassName + '__share__div3__twitter');
    AnzSharesTwitterImg.attr('src', "assets/images/svg/Icons/Social_Media/Twitter_Icon.svg");


    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //     CONTAINER FUER BESCHREIBUNG
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // Elementes erzeugen und im Dom an Parent Element anbinden
    var beschreibung = $("<div></div>").appendTo(bandListHtml);
    beschreibung.attr('class', containerClassName + '__beschreibung');
    beschreibung.html(arrayOfObject_serverDaten[indexDaten].beschreibung);


    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //     CONTAINER FUER LINKS   -  SPRUENGE AUF SEITEN SOCIAL MEDIA UND YOUTOUBE
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // Container des  Elementes erzeugen und im Dom an Parent Element anbinden
    var linkContainer = $("<div></div>").appendTo(bandListHtml);
    linkContainer.attr('class', containerClassName + '__link row');


    //  Twitter  Link
    // Div für feld Div 1 (links) - Twitter Link
    var linkTwitterDiv = $("<div></div>").appendTo(linkContainer);
    linkTwitterDiv.attr('class', containerClassName + '__link__div1 col-xs-2');
    // Link Twitter Tag
    var linkTwitterAnker = $("<a></a>").appendTo(linkTwitterDiv);
    linkTwitterAnker.attr('href', arrayOfObject_serverDaten[indexDaten].linkTwitter );
    linkTwitterAnker.attr('target', "_blank");
    // Bild Twitter Tag
    var linkTwitterImg = $("<img>").appendTo(linkTwitterAnker);
    linkTwitterImg.attr('class', containerClassName + '__link__div1__twitter');
    linkTwitterImg.attr('src', "assets/images/svg/Icons/Social_Media/Twitter_Icon.svg");

    //  Facebook  Link
    // Div für feld Div 2 (links mitte) - Facebook Link
    var linkFacebookDiv = $("<div></div>").appendTo(linkContainer);
    linkFacebookDiv.attr('class', containerClassName + '__link__div2 col-xs-2');
    // Link Facebook Tag
    var linkFacebookAnker = $("<a></a>").appendTo(linkFacebookDiv);
    linkFacebookAnker.attr('target', "_blank");
    linkFacebookAnker.attr('href', arrayOfObject_serverDaten[indexDaten].linkFacebook );
    // Bild Facebook Tag
    var linkFacebookImg = $("<img>").appendTo(linkFacebookAnker);
    linkFacebookImg.attr('class', containerClassName + '__link__div2__facebook');
    linkFacebookImg.attr('src', "assets/images/svg/Icons/Social_Media/Facebook_Icon.svg");

    //  Youtoube  Link
    // Div für feld Div 3 (links rechts) - Youtoube Link
    var linkYoutoubeDiv = $("<div></div>").appendTo(linkContainer);
    linkYoutoubeDiv.attr('class', containerClassName + '__link__div3 col-xs-2');
    // Link Youtoube Tag
    var linkYoutoubeAnker = $("<a></a>").appendTo(linkYoutoubeDiv);
    linkYoutoubeAnker.attr('href', arrayOfObject_serverDaten[indexDaten].linkYoutoube );
    linkYoutoubeAnker.attr('target', "_blank");
    // Bild Youtoube Tag
    var linkYoutoubeImg = $("<img>").appendTo(linkYoutoubeAnker);
    linkYoutoubeImg.attr('class', containerClassName + '__link__div3__youtoube');
    linkYoutoubeImg.attr('src', "assets/images/svg/Icons/Social_Media/YouTube_Icon.svg");

    //  Instagramm  Link
    // Div für feld Div 4 (rechts) - Instagramm Link
    var linkInstagrammDiv = $("<div></div>").appendTo(linkContainer);
    linkInstagrammDiv.attr('class', containerClassName + '__link__div4 col-xs-2');
    // Link Instagramm Tag
    var linkInstagrammAnker = $("<a></a>").appendTo(linkInstagrammDiv);
    linkInstagrammAnker.attr('href', arrayOfObject_serverDaten[indexDaten].linkInstagramm );
    linkInstagrammAnker.attr('target', "_blank");
    // Bild Instagramm Tag
    var linkInstagrammImg = $("<img>").appendTo(linkInstagrammAnker);
    linkInstagrammImg.attr('class', containerClassName + '__link__div4__instagramm');
    linkInstagrammImg.attr('src', "assets/images/svg/Icons/Social_Media/Insta_Icon.svg");


    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //     CONTAINER FUER Button zurück zu Listenanzeige   -  SPRUENGE AUF SEITEN SOCIAL MEDIA UND YOUTOUBE
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // Container des  Elementes erzeugen und im Dom an Parent Element anbinden
    var ContainerButton = $("<div></div>").appendTo(bandListHtml);
    linkContainer.attr('class', containerClassName + '__divButton col-xs-12');
    // Mit diesem Button gelangt man wieder zurück zur Listenansicht. Das heisst die Elemente Detailansicht werden gelöscht und die Funktion Listenasicht wierd gestartet
    // Der Event wird aber ausserhalb definiert
    var buttonBack = $("<button>Zurück</button>").appendTo(ContainerButton);
    buttonBack.attr('class', containerClassName + '__divButton__back');


}
