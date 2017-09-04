
/*

 Mit dieser Seite wird der gesamte Warernkorb angezeigt, und Tickets bestellt


 Zum zwischenspeichern von Eingaben  wird mit Local Storgae gearbeitet. Eine alternative bei nicht unterstützung ist im Moment noch nicht vorgesehen

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

 1.  kundenTickets : Alle Tickets die der aktibe Kunde jemals gekauft hat
 2. ticketsJoinTicketarten : join aus ticketarten und tickets für anzeige der  aktuellen und historischen Tickets

 */

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////     INITIALISIERUNGEN
/////////////////
/////////////////
/////////////////
/////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// Rootverzeichnise
var rootAjax = "../../../";
var rootBilderPfadeUser = "../../../";


// Test, ob local Storage nterstütz wird, ansonsten muss mit cookies oder Session php gearbeitet werden
// Im Moment ist noch kein fallback Lösung geplant
if (typeof(Storage) !== "undefined") {
    // Code for localStorage/sessionStorage.
} else {
    // Sorry! No Web Storage support..
    console.log("Sorry! No Web Storage support..");
}


// Steuervariable für Aufgabenstellung an den PHP Server
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

// Variable mit Serverdaten. iese wird immer nei einem Reload mit dem Inhalt aus dem Local Storage beschrieben
var ajaxDatenSenden = "";
var ajaxDatenAntwort = "";


// Aktuelle blockierte Tickets im Warenkorb (n:n tabelle ticketarten_has_warenkorb)
var kundeWarenkorb = JSON.parse(localStorage.getItem("kundeWarenkorb"));
// tabellenblatt "warenkorb" hier sind die Kundendaten hinterlegt -
var aktuellerWarenkorb = JSON.parse(localStorage.getItem("aktuellerWarenkorb"));
// Die Daten aus dem Local Storage sind JSON, da nur Strings und keine Objekte gespeihert werden können
var kundenLoginUserAktiv = JSON.parse(localStorage.getItem("kundenLoginUserAktiv"));
// absoluten PFad lesen für Bildreferenzen
var rootPfad = JSON.parse(localStorage.getItem("rootPfad"));







//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////     WARENKORB         ANZEIGE AKTUELLE TICKETS
/////////////////
/////////////////
/////////////////
/////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////     WARENKORB         ANZEIGE HYSTORISCHE TICKETS
/////////////////
/////////////////
/////////////////
/////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////




// Aktuelle Tickets auflisten - Veranstallung noch fällig
$(document).ready(function() {


    // Wenn eingeloggt, dann startet Funktion zur Anzeige der HTML Formualrfelder zum anpassen/anschauen der Informationen
    // Ist ein User eingeloggt, so ist das feld mit einem String belegt und nicht leer
    if (localStorage.getItem("kundenLoginUserAktiv") !== undefined && localStorage.getItem("kundenLoginUserAktiv") !== "" &&
        localStorage.getItem("kundenLoginUserAktiv") !== null) {

        // Die Daten aus dem Local Storage sind JSON, da nur Strings und keine Objekte gespeihert werden können
        kundenLoginUserAktiv = JSON.parse(localStorage.getItem("kundenLoginUserAktiv"));

        // Die Daten aus dem Local Storage sind JSON, da nur Strings und keine Objekte gespeihert werden können
        aktuellerWarenkorb = JSON.parse(localStorage.getItem("aktuellerWarenkorb"));


        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        /////////////////    Ajax Befehl : Lesen aller verschiedenen Ticketarten
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        // Auf diese Weise wird dem PHP Server die Aufgabe mitgeteilt
        var dataToSend = {
            tabelle: "tickets",
            funktion: "ticketsJoinTicketarten",
            parameter: "suchen",
            spaltenName: "warenkorb_id",
            spaltenWert: aktuellerWarenkorb[0].id,
            idZeile: -1,
            updateSpalte: [],
            updateWert: []
        };

        // Start ajay abfrage
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
            headers: {
                'Authorization': 'Basic ' + btoa('admin:diplomarbeit')
            }

            // Alle abgebuchten Tickets in der n:n Tabelle Ticketarten zu Warenkorb
        }).done(function (data) {
            console.log(data);


            // Speichern der Ticketdaten in Local Storage
            localStorage.setItem("ticketsJoinTicketarten", JSON.stringify(data));

            // Auflisten der aktuellen Tickets des angemeldeten Kunden
            kundenTicketsAktuell( $(".gekaufteTickets__ticketsAktuell"),data, rootPfad );

            // Auflisten der historischen Tickets des angemeldeten Kunden
            kundenTicketsHistorisch( $(".gekaufteTickets__ticketVerlauf"),data, rootPfad  );

            }).fail(function (error) {
                console.log( error );
            });






    }
    // Der Warenkorb ist nur freigegeben, sofern ein User eingeloggt ist. ANsonsten könenn keine Tickets gekauft werden
    // und die Hystorie DAten sicnd ebenfalls nicht ersichtlich
    else {
        alert("Sie müssen sich zuerst anmelden");
    }





});








//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////     FUNKTIONSDEFINTIONEN          kundenTicketsAktuell:          Alle gekauften Tickets des eingeloggten Kunden, welche noch nicht vorbei sind anzeigen
/////////////////
/////////////////
/////////////////
/////////////////
/////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function kundenTicketsAktuell (htmlKlasse, arrayOfObject_tickets_join_ticketart, string_rootPath) {

    // Zuerst alles aus dem HTML Container leerren
    htmlKlasse.html();

    // Klasse aus übercontainer auslesen
    var klasse = htmlKlasse.attr('class');

    // Header Element erzeugen
    var header = $("<div>Aktuelle Tickets</div>").appendTo(htmlKlasse);
    header.attr('class', klasse + '__header');

    $("<br>").appendTo(htmlKlasse);


    for (var i=0; i < arrayOfObject_tickets_join_ticketart.length; i++ ) {

        // Hilfsvariablen
        var ticketIstAktuell = false;

        // Aktuelle Uhrzeit
        var timestamp = new Date();

        // Zuerst müssen anhand der Daten analysiert werden, welche Tickets überhaupt noch aktuell sind
        // Dies geschieht anhand des aktuellen Timestamps und des Event Datums des Auftrittes. Anhand der Ticketdaten einen Timestamp gennereiren für den Auftrittszeitpunkt
        // Die Uhrzeit wid aus performance gründen nicht berückichtigt

        // Jahr ist kleiner oder gleich
        if ( arrayOfObject_tickets_join_ticketart[i].eventDatum.substring(0, 4) >= timestamp.getFullYear() ) {
            // Monat ist kleiner oder gleich - Monat Januar beginnt mit 0, daher eine addition um 1
            if ( arrayOfObject_tickets_join_ticketart[i].eventDatum.substring(5, 7) >= timestamp.getMonth() + 1 ) {
                // Tag ist kleiner oder gleich - Hilfsvariable auf true setzen
                if ( arrayOfObject_tickets_join_ticketart[i].eventDatum.substring(8, 10) > timestamp.getDate() ) {
                    ticketIstAktuell = true;
                }
            }
        }

        // Ticket ist noch aktuell und wird daher angezeigt
        if ( ticketIstAktuell ) {

            // HTML pro Element erzeugen - Container
            var elementContainer = $("<div></div>").appendTo(htmlKlasse);
            elementContainer.attr('class', klasse + '__element__container row');



            // HTML pro Element erzeugen - Feld links mit Bild
            var elementContainerLinks = $("<div></div>").appendTo(elementContainer);
            elementContainerLinks.attr('class', klasse + '__element__links__container col-xs-2');
            // HTML pro Element erzeugen - Feld links mit Bild
            var elementBild = $("<img></img>").appendTo(elementContainerLinks);
            elementBild.attr('class', klasse + '__element__links__bild');
            elementBild.attr('src', string_rootPath + arrayOfObject_tickets_join_ticketart[i].bild );
            elementBild.attr('alt', 'Kein Bild vorhanden' );


            // HTML pro Element erzeugen - Feld mitte mit Titel
            var elementContainerMitte = $("<div></div>").appendTo(elementContainer);
            elementContainerMitte.attr('class', klasse + '__element__mitte__container col-xs-8');
            // HTML pro Element erzeugen - Feld mitte mit Titel
            var elementMitteText = $("<div></div>").appendTo(elementContainerMitte);
            elementMitteText.attr('class', klasse + '__element__mitte__text');
            elementMitteText.html( arrayOfObject_tickets_join_ticketart[i].title );

            // HTML pro Element erzeugen - Feld mitte mit Titel
            var elementContainerRechts = $("<div></div>").appendTo(elementContainer);
            elementContainerRechts.attr('class', klasse + '__element__rechts__container col-xs-2');
            // HTML pro Element erzeugen - Feld mitte mit Titel
            var elementRechtsText = $("<div></div>").appendTo(elementContainerRechts);
            elementRechtsText.attr('class', klasse + '__element__rechts__text');
            elementRechtsText.html( arrayOfObject_tickets_join_ticketart[i].ticketPreis + '.- CHF');

            $("<br>").appendTo(htmlKlasse);
        }
    }
}








//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////     FUNKTIONSDEFINTIONEN          kundenTicketsHistorisch:          Alle gekauften Tickets des eingeloggten Kunden, welche bereits vorüber sind anzeigen
/////////////////
/////////////////
/////////////////
/////////////////
/////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function kundenTicketsHistorisch (htmlKlasse, arrayOfObject_tickets_join_ticketart, string_rootPath) {

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////       Zuerst wird das Array nach Datum und Zeit geortnet.
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // sortieren des Arrays "arrayOfObject_ticketart" nach DAtum und Uhrzeit
    arrayOfObject_tickets_join_ticketart.sort(function(b, a) {
        // Datum vergleichen
        // Vergleich durchführen - Zuerst das das JAhr
        if (a.eventDatum.substring(0, 4) - b.eventDatum.substring(0, 4) !== 0) {
            return a.eventDatum.substring(0, 4) - b.eventDatum.substring(0, 4);
        }
        // Vergleich durchführen - dann den Monat
        else if (a.eventDatum.substring(5, 7) - b.eventDatum.substring(5, 7) !== 0) {
            return a.eventDatum.substring(5, 7) - b.eventDatum.substring(5, 7);
        }
        // Vergleich durchführen - dann den Tag
        else if (a.eventDatum.substring(8, 10) - b.eventDatum.substring(8, 10) !== 0) {
            return a.eventDatum.substring(8, 10) - b.eventDatum.substring(8, 10);
        }

        // Uhrzeit vergleichen
        // Vergleich durchführen - Zuerst Stunde
        else if (a.eventZeit.substring(0, 2) - b.eventZeit.substring(0, 2) !== 0) {
            return a.eventZeit.substring(0, 2) - b.eventZeit.substring(0, 2);
        }
        // Vergleich durchführen - Zuerst Minute
        else if (a.eventZeit.substring(4, 6) - b.eventZeit.substring(4, 6) !== 0) {
            return a.eventZeit.substring(4, 6) - b.eventZeit.substring(4, 6);
        }
    });


    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////       Initialisierungen und HEader
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // Zuerst alles aus dem HTML Container leerren
    htmlKlasse.html();

    // Elementdaten werden jeweils por Schlaufe in diese Variable geschrieben
    var ticketArt_Daten = [];

    // aktuelles Jahr des letzten Elementes
    var elementJahr = '';

    // Klasse aus übercontainer auslesen
    var klasse = htmlKlasse.attr('class');

    // Header Element erzeugen
    var header = $("<div>Ticketverlauf</div>").appendTo(htmlKlasse);
    header.attr('class', klasse + '__header');

    $("<br>").appendTo(htmlKlasse);


    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////       Ausgabe aller Elemente
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    for (var i=0; i < arrayOfObject_tickets_join_ticketart.length; i++ ) {

        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        /////////////////       Schauen ob das Ticket aaktuell oder historisch ist
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        // Hilfsvariablen
        var ticketIstAktuell = true; // Ticket wird ausgegeben

        // Aktuelle Uhrzeit
        var timestamp = new Date();


        // Zuerst müssen anhand der Daten analysiert werden, welche Tickets überhaupt noch aktuell sind
        // Dies geschieht anhand des aktuellen Timestamps und des Event Datums des Auftrittes. Anhand der Ticketdaten einen Timestamp gennereiren für den Auftrittszeitpunkt
        // Die Uhrzeit wid aus performance gründen nicht berückichtigt

        // Jahr ist kleiner oder gleich
        if ( arrayOfObject_tickets_join_ticketart[i].eventDatum.substring(0, 4) >= timestamp.getFullYear() ) {
            // Monat ist kleiner oder gleich - Monat Januar beginnt mit 0, daher eine addition um 1
            if ( arrayOfObject_tickets_join_ticketart[i].eventDatum.substring(5, 7) >= timestamp.getMonth() + 1 ) {
                // Tag ist kleiner oder gleich - Hilfsvariable auf true setzen
                if ( arrayOfObject_tickets_join_ticketart[i].eventDatum.substring(8, 10) > timestamp.getDate() ) {
                    ticketIstAktuell = false;
                }
            }
        }


        // Ticket ist noch aktuell und wird daher angezeigt
        if ( ticketIstAktuell ) {

            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            /////////////////       Jeweils für jedes neue Jahr wir ein neuer Header ausgegeben mit der JAhreszahl
            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            if( elementJahr !== arrayOfObject_tickets_join_ticketart[i].eventDatum.substring(0, 4) ) {

                // Neues Jahr abspeichern
                elementJahr = arrayOfObject_tickets_join_ticketart[i].eventDatum.substring(0, 4);

                // HTML pro Element erzeugen - Jahreszahl als Header ausgeben
                var elementHeaderJahr = $("<div></div>").appendTo(htmlKlasse);
                elementHeaderJahr.attr('class', klasse + '__jahr');
                elementHeaderJahr.html( elementJahr );

                $("<br>").appendTo(htmlKlasse);
            }

            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            /////////////////       Element Container
            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

            // HTML pro Element erzeugen - Container
            var elementContainer = $("<div></div>").appendTo(htmlKlasse);
            elementContainer.attr('class', klasse + '__element__container row');


            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            /////////////////       Element links - Bild
            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

            // HTML pro Element erzeugen - Feld links mit Bild
            var elementContainerLinks = $("<div></div>").appendTo(elementContainer);
            elementContainerLinks.attr('class', klasse + '__element__links__container col-xs-2');
            // HTML pro Element erzeugen - Feld links mit Bild
            var elementBild = $("<img></img>").appendTo(elementContainerLinks);
            elementBild.attr('class', klasse + '__element__links__bild');
            elementBild.attr('src', string_rootPath + arrayOfObject_tickets_join_ticketart[i].bild );
            elementBild.attr('alt', 'Kein Bild vorhanden' );


            // HTML pro Element erzeugen - Feld mitte mit Titel
            var elementContainerMitte = $("<div></div>").appendTo(elementContainer);
            elementContainerMitte.attr('class', klasse + '__element__mitte__container col-xs-8');
            // HTML pro Element erzeugen - Feld mitte mit Titel
            var elementMitteText = $("<div></div>").appendTo(elementContainerMitte);
            elementMitteText.attr('class', klasse + '__element__mitte__text');
            elementMitteText.html( arrayOfObject_tickets_join_ticketart[i].title );

            // HTML pro Element erzeugen - Feld mitte mit Titel
            var elementContainerRechts = $("<div></div>").appendTo(elementContainer);
            elementContainerRechts.attr('class', klasse + '__element__rechts__container col-xs-2');
            // HTML pro Element erzeugen - Feld mitte mit Titel
            var elementRechtsText = $("<div></div>").appendTo(elementContainerRechts);
            elementRechtsText.attr('class', klasse + '__element__rechts__text');
            elementRechtsText.html( arrayOfObject_tickets_join_ticketart[i].ticketPreis + '.- CHF');

            $("<br>").appendTo(htmlKlasse);
        }
    }


}
