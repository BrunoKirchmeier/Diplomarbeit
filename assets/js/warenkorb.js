
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

 1.  A

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
// Die Daten aus dem Local Storage sind JSON, da nur Strings und keine Objekte gespeihert werden können
var adminTicketAlle = JSON.parse(localStorage.getItem("adminTicketAlle"));





//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////     WARENKORB         TICKETS KAUFEN
/////////////////
/////////////////
/////////////////
/////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// Tickets kaufen
// Starten der Funktionen darf erst mglich sein, wenn Dokument geladen ist
$(document).ready(function() {

    // Button Tickets kaufen geklickt - bedingung, dass der USer eongelogt ist
    $(".warenkorbUebersicht__buttonKaufen").on('click', function () {


        // Wenn eingeloggt, dann startet Funktion zur Anzeige der HTML Formualrfelder zum anpassen/anschauen der Informationen
        // Ist ein User eingeloggt, so ist das feld mit einem String belegt und nicht leer
        if (localStorage.getItem("kundenLoginUserAktiv") !== undefined && localStorage.getItem("kundenLoginUserAktiv") !== "" &&
            localStorage.getItem("kundenLoginUserAktiv") !== null) {


            // Die Daten aus dem Local Storage sind JSON, da nur Strings und keine Objekte gespeihert werden können
            kundenLoginUserAktiv = JSON.parse(localStorage.getItem("kundenLoginUserAktiv"));

            // Die Daten aus dem Local Storage sind JSON, da nur Strings und keine Objekte gespeihert werden können
            aktuellerWarenkorb = JSON.parse(localStorage.getItem("aktuellerWarenkorb"));

            // Die Daten aus dem Local Storage sind JSON, da nur Strings und keine Objekte gespeihert werden können
            kundeWarenkorb = JSON.parse(localStorage.getItem("kundeWarenkorb"));

            console.log(kundeWarenkorb);

            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            /////////////////    Ajax Befehl : LEsen des aktuellen Ticket Standes vom Server
            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

            // Hilfsvaribalen zur Serverkommunikation
            var ticket_ID = [];
            var ticket_anzahl = [];

            // Schlaufe
            for (var y=0; y < kundeWarenkorb.length; y++) {

                ticket_ID.push( kundeWarenkorb[y]['ticketarten_id'] );
                ticket_anzahl.push( kundeWarenkorb[y]['reservierteAnzahlTickets'] );
            }


            // Nach erfolgreicher Aktion, den aktuellen Stand von Tickets von der Datenbank laden
            // Die Liste neu aufbauen mit den aktuellen Einträgen
            // Auf diese Weise wird dem PHP Server die Aufgabe mitgeteilt
            var dataToSend = {
                tabelle: "ticketarten",
                funktion: "TicketsKaufen",
                parameter: "",
                spaltenName: "",
                spaltenWert: "",
                idZeile: "",
                updateSpalte: [],
                updateWert: [],
                datensatz: [ aktuellerWarenkorb[0]['id'], ticket_ID, ticket_anzahl]
            };

            console.log( dataToSend );

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

            }).done(function (data) {
                console.log(data);


                //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                /////////////////    Ajax Befehl : Tickets wurden gekauft - Es wird eine Email verschickt mit der Benachrichtigung, dass die Tickets nun reserviert und abholberiets sind
                //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

                // Nach erfolgreicher Aktion, den aktuellen Stand von Tickets von der Datenbank laden
                // Die Liste neu aufbauen mit den aktuellen Einträgen
                // Auf diese Weise wird dem PHP Server die Aufgabe mitgeteilt
                var dataToSend = {
                    tabelle: "",
                    funktion: "email_ticketBestellung",
                    parameter: "",
                    spaltenName: "",
                    spaltenWert: "",
                    idZeile: "",
                    updateSpalte: [],
                    updateWert: [],
                    datensatz: [kundenLoginUserAktiv[0]['username'], '', kundenLoginUserAktiv[0]['email']]
                };

                console.log( dataToSend );

                // Start ajay abfrage
                $.ajax({
                    url: rootAjax + 'assets/php/model/ajaxEmail.php',  // rootAjax + 'assets/php/model/ajaxDatenbank.php'
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

                }).done(function (data) {
                    console.log(data);
                    alert("Die Bestellung ist abgeschlossen. Sie erhalten in Kürze ein Email mit den Detail Informationen")


                }).fail(function (error) {
                    console.log("Error!");
                    console.log( error );
                });


            }).fail(function (error) {
                console.log("Error!");
                console.log( error );
            });


        }
        // Der Warenkorb ist nur freigegeben, sofern ein User eingeloggt ist. ANsonsten könenn keine Tickets gekauft werden
        // und die Hystorie DAten sicnd ebenfalls nicht ersichtlich
        else {
            alert("Sie müssen sich zuerst anmelden");
        }



    });

});




//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////     WARENKORB         ZUSAMMENFASSUNG der BESTELLUNG ANZEIGEN
/////////////////
/////////////////
/////////////////
/////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// sortieren der Argumente für die Funktion. Die Ticketart ID muss  bei beiden Arrays auf dem gleichen Index liegen
bestellungAnzeige( $(".warenkorb__bestelluebersicht__border"), adminTicketAlle, kundeWarenkorb );









//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////     FUNKTIONSDEFINTIONEN          bestellungAnzeige:          Tickets welche gekauft werden können auflisten auf Anzeige
/////////////////
/////////////////                                   WICHTIG!!!  Die beiden Argumente Array of Objekte müssen vorsortiert sein
/////////////////                                               Die Ticket ID muss in gleicher Reihenfolge sein, damit mit dem [Index] keine falschen referenzen vorhanden sind
/////////////////                                               => Das array "arrayOfObject_ticketart" muss dem anderen OBjekt angepasst werden
/////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function bestellungAnzeige (htmlKlasse, arrayOfObject_ticketart, arrayOfObject_ticketartenHasWarenkorb) {  // integer_indexDaten

    // Objekt arrayOfObject_ticketart sortieren
    var arrayOfObject_ticketartSortiert = [];


    for (var i=0; i < arrayOfObject_ticketartenHasWarenkorb.length; i++) {
        // Lesen der ersten Id welche gesucht ist
        for (var y=0; y < arrayOfObject_ticketart.length; y++) {

            // Ticketart ID gefunden welche mit dem Objekt arrayOfObject_ticketartenHasWarenkorb übereinstimmt
            if (arrayOfObject_ticketartenHasWarenkorb[i].ticketarten_id === arrayOfObject_ticketart[y].id ) {
                arrayOfObject_ticketartSortiert.push(arrayOfObject_ticketart[y]);
            }
        }
    }

    // DOM Selektoren
    var bandListHtml = htmlKlasse;
    var containerClassName = htmlKlasse.attr('class');
    var preissummeTotal = 0;

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //
    //     DOM BAUM aufbauen, sofern noch nicht vorhanden und Neuberechnungen der PReissumme
    //
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    // Schlaufe mit allen Tickets, welche der Reihe nach aausgegeben werden
    for (i = 0; i < arrayOfObject_ticketartenHasWarenkorb.length; i++) {

        // Nur Tickets anzeigen mit Wert ungleich 0
        if( arrayOfObject_ticketartenHasWarenkorb[i].reservierteAnzahlTickets > 0 ) {

            // Container Element pro Ticketeintrag
            var containerElement = $("<div></div>").appendTo(bandListHtml);
            containerElement.attr('class', containerClassName + '__container row index' + i);


            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            //     TICKET Informationen - Linke Spalte
            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

            // Linke Spalte Container
            var spalteLinks = $("<div></div>").appendTo(containerElement);
            spalteLinks.attr('class', containerClassName + '__container__links col-xs-7 index' + i);

            // Linke Spalte - Zeile 1 - Adresse
            var spalteLinksAdresse = $("<div></div>").appendTo(spalteLinks);
            spalteLinksAdresse.attr('class', containerClassName + '__container__links__adresse index' + i);
            spalteLinksAdresse.html(arrayOfObject_ticketartSortiert[i].eventAdresse);

            // Linke Spalte - Zeile 2 - Titel
            var spalteLinksTitel = $("<div></div>").appendTo(spalteLinks);
            spalteLinksTitel.attr('class', containerClassName + '__container__links__titel index' + i);
            spalteLinksTitel.html(arrayOfObject_ticketartSortiert[i].title);

            // Linke Spalte - Zeile 3 - Preis
            var spalteLinksPreis = $("<div></div>").appendTo(spalteLinks);
            spalteLinksPreis.attr('class', containerClassName + '__container__links__preis index' + i);
            spalteLinksPreis.html(arrayOfObject_ticketartSortiert[i].ticketPreis + ".- CHF pro Person");


            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            //     TICKET Preis
            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

            // Rechte Spalte Container
            var spalteRechts = $("<div></div>").appendTo(containerElement);
            spalteRechts.attr('class', containerClassName + '__container__rechts col-xs-4 index' + i);

            // Rechte Spalte - Zeile 1 - Anzahl Tickets
            var spalteRechtsAnzPersonen = $("<div></div>").appendTo(spalteRechts);
            spalteRechtsAnzPersonen.attr('class', containerClassName + '__container__rechts__anzTickets index' + i);
            spalteRechtsAnzPersonen.html(arrayOfObject_ticketartenHasWarenkorb[i].reservierteAnzahlTickets + ' Tickets');

            // Rechte Spalte - Zeile 2 - Preis total pro Ticketart
            var spalteRechtsPreisTotalproTicketart = $("<div></div>").appendTo(spalteRechts);
            spalteRechtsPreisTotalproTicketart.attr('class', containerClassName + '__container__rechts__preis index' + i);
            // Preisberechnung
            var preis = arrayOfObject_ticketartenHasWarenkorb[i].reservierteAnzahlTickets * arrayOfObject_ticketartSortiert[i].ticketPreis;
            spalteRechtsPreisTotalproTicketart.html('Preis: ' + preis + '.- CHF');

            // Rechte Spalte - Zeile 3 - infos
            var spalteRechtsInfos = $("<div></div>").appendTo(spalteRechts);
            spalteRechtsInfos.attr('class', containerClassName + '__container__rechts__infos index' + i);
            spalteRechtsInfos.html('Endpreis zzg. Versandkosten');

            // Preissumme total
            preissummeTotal = preissummeTotal + preis;
        }
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //     Leiste Preis Total
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // Leiste Total Container
    var leisteTotalContainer = $("<div></div>").appendTo(bandListHtml);
    leisteTotalContainer.attr('class', containerClassName + '__container__leisteTotal row');

    // Leiste Total Spalte Links
    var leisteTotalLinks = $("<div>Total</div>").appendTo(leisteTotalContainer);
    leisteTotalLinks.attr('class', containerClassName + '__container__leisteTotal__links col-xs-7');

    // Leiste Total Spalte Rechts
    var leisteTotalRechts = $("<div></div>").appendTo(leisteTotalContainer);
    leisteTotalRechts.attr('class', containerClassName + '__container__leisteTotal__rechts col-xs-4');
    leisteTotalRechts.html('Preis: ' + preissummeTotal + '.- CHF');
}


