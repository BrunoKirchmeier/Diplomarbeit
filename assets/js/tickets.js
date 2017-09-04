

/*

 Mit dieser Seite wird der Warenkorb aufgebaut

 Zum zwischenspeichern von Eingaben des USers wird mit Local Storgae gearbeitet. Eine alternative bei nicht unterstützung ist im Moment noch nicht vorgesehen

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
 datensatz       : []
 };

 In der local Storage werden folgende DAten gespeichert:

 1.  Alle Benutzereingaben
 2.  Serverdaten zu beginn des Seitemloads von allen Ticketdaten auf dem Server
 3.  Die zuletz gelesenen Serverdaten    :    "ajaxDaten"

 */

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////
/////////////////     INITIALISIERUNGEN         Zuerst wird direkt die Badliste mit allen Einträgen aus der Datenabk angezeigt
/////////////////                               Die Liste kann angeschaut werden, aber nicht kann verändert oder gelöscht werden
/////////////////                               Zum löschen oder verändern ist administrator LEvel 1 nötig
/////////////////
/////////////////                               Ist gar kein USer angemeldet, so ist gar nihts sichtbar
/////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// Rootverzeichnise
var rootAjax = "../../../";
var rootBilderPfadeUser = "../../../";


// Variable mit Serverdaten. Diese wird immer neu mit dem Inhalt aus dem Local Storage beschrieben
var ajaxDatenSenden = "";
var ajaxDatenAntwort = "";
var blockierteTicketsAusWarenokorb = [];


// Die Daten aus dem Local Storage sind JSON, da nur Strings und keine Objekte gespeihert werden können
var kundenLoginUserAktiv = JSON.parse(localStorage.getItem("kundenLoginUserAktiv"));

// Die Daten aus dem Local Storage sind JSON, da nur Strings und keine Objekte gespeihert werden können
var aktuellerWarenkorb = JSON.parse(localStorage.getItem("aktuellerWarenkorb"));

// Aktuelle blockierte Tickets im Warenkorb (n:n tabelle ticketarten_has_warenkorb)
var kundeWarenkorb = JSON.parse(localStorage.getItem("kundeWarenkorb"));


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////     Laden aller Ticketdaten und Warenkorb informationen für Bestellprozess
/////////////////
/////////////////
/////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// Starten der Funktionen darf erst mglich sein, wenn Dokument geladen ist
$(document).ready(function() {


    // Nach erfolgreicher Aktion, den aktuellen Stand von Tickets von der Datenbank laden
    // Die Liste neu aufbauen mit den aktuellen Einträgen
    // Auf diese Weise wird dem PHP Server die Aufgabe mitgeteilt
    var dataToSend = {
        tabelle: "ticketarten",
        funktion: "lesen",
        parameter: "alle",
        spaltenName: "",
        spaltenWert: "",
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

    }).done(function (data) {
        console.log(data);

        // Speichern der Ticketdaten in Local Storage
        localStorage.setItem("adminTicketAlle", JSON.stringify(data));

        // Erstmaliges aufbauen des HTML mit allen Tickets
        TicketsDetailAnzeige( $(".ticketsListe"), data);


        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        /////////////////    Ajax Befehl : LEsen der aktuell verbuchten Tickets des angemeldeten users
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        // Nach erfolgreicher Aktion, den aktuellen Stand von Tickets von der Datenbank laden
        // Die Liste neu aufbauen mit den aktuellen Einträgen
        // Auf diese Weise wird dem PHP Server die Aufgabe mitgeteilt

         var dataToSend = {
         tabelle: "Ticketarten_Warenkorb",
         funktion: "lesen",
         parameter: "suchen",
         spaltenName: "warenkorb_id",
         spaltenWert: aktuellerWarenkorb[0]['id'],  // aktuellerWarenkorb[0]['id']
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

            // Die Daten aus dem Local Storage sind JSON, da nur Strings und keine Objekte gespeihert werden können
            adminTicketAlle = JSON.parse(localStorage.getItem("adminTicketAlle"));


            // Einzeleinträge zusammenfassen - alle Einträge des angemeldeten User pro Tickettyp addieren
            // Eine Schlaufe machen und die blockierten Tickets afüllen in den Inputfeldern
            for ( var i=0; i < data.length; i++) {

                // Alle Tickets des gleichen Typs addieren zu einer gesamt summe
                for (var j = 0; j < adminTicketAlle.length; j++) {
                    if (adminTicketAlle[j]['id'] === data[i]['ticketarten_id']) {

                        // Array mit allen reservierten Tickets des aktuellen USers aller Tickettypen
                        blockierteTicketsAusWarenokorb[j] =+ data[i]['reservierteAnzahlTickets'];
                    }
                }
            }

            // Die Inputfelder mit den Resultaten befüllen
            // Jedoch nur sofern auch ein HTML vorhanden ist - Dies ist der Fall sofern keine Element selectiert wurde
            for ( i=0; i < blockierteTicketsAusWarenokorb.length; i++) {

                // Prüfen ob HTML vorhandenist
                if ( $('.ticketDetail.index' + i).length > 0 && !isNaN(blockierteTicketsAusWarenokorb[i]) ) {
                    $('.ticketPreis__container__ticketwahl__inputfeld.index' + i).val( blockierteTicketsAusWarenokorb[i] );
                }
            }


            // Liste aller zur verkauf stehehender Tickets mit Auswahl Kunde darstellen
            // Der Rückgabewert ist der Gesamtpreis aller Tickets die ausgewählt wurden
            var PreissummeTotal = TicketsDetailAnzeige( $(".ticketsListe"), adminTicketAlle );

            // Ausgabe der Preissumme Total
            if(PreissummeTotal > 0 && ! isNaN(PreissummeTotal) ) {
                // Tickets wurden ausgewählt
                $(".ticketsTotal__containerRechts").html("Preis: " + PreissummeTotal + ".- CHF" + '<br>' + "Endpreis zzgl Versand");
            }
            else {
                // Keine Tickets wurden ausgewählt
                $(".ticketsTotal__containerRechts").html("Preis:  0.- CHF" + '<br>' + "Endpreis zzgl Versand");
            }

        }).fail(function (error) {
            console.log("Error!");
            console.log( error );
        });



    }).fail(function (error) {
        console.log("Error!");
        console.log( error );
    });





});







//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////     Die Listenansicht der Tickets muss bei einer Veränderung der Anzahl Tickets neu berechent werden - Die gesamtpreissumme wird angepasst
/////////////////     Ebenso die Berechnung der gesamtsumme aller Tickets
/////////////////
/////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// Starten der Funktionen darf erst mglich sein, wenn Dokument geladen ist
$(document).ready(function() {

    // Event : Das HTML wurdeb ereits aufgebaut, aber der Ticketpreis muss permanent neu berechnez werden
    $("body").on('change', '.ticketsListe', function (e) {

        // Das neuladen der Seite verhindern, damit HTML nicht verändert wird, bevor die Anfrage verarbitet wurde
        e.preventDefault();

        // Die Daten aus dem Local Storage sind JSON, da nur Strings und keine Objekte gespeihert werden können
        adminTicketAlle = JSON.parse(localStorage.getItem("adminTicketAlle"));

        // Liste aller zur verkauf stehehender Tickets mit Auswahl Kunde darstellen
        // Der Rückgabewert ist der Gesamtpreis aller Tickets die ausgewählt wurden
        var PreissummeTotal = TicketsDetailAnzeige( $(".ticketsListe"), adminTicketAlle );

        // Ausgabe der PReissumme Total
        if(PreissummeTotal > 0 && ! isNaN(PreissummeTotal) ) {
            // Tickets wurden ausgewählt
            $(".ticketsTotal__containerRechts").html("Preis: " + PreissummeTotal + ".- CHF" + '<br>' + "Endpreis zzgl Versand");
        }
        else {
            // Keine Tickets wurden ausgewählt
            $(".ticketsTotal__containerRechts").html("Preis:  0.- CHF" + '<br>' + "Endpreis zzgl Versand");
        }

    });

});





//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////     Button __inWarenkorb      1. Es wird geprüft, ob der User bereits angemeldet ist, wenn nicht muss er zuerst sich anmelden
/////////////////                               2. Die gewünschte nBilette werden versucht aauf der DAtenbank zu reservieren. Es erfolgt eine ensprechende Rückmeldung an den USer
/////////////////                                  Bilette werden nicht verbucht und Menge bleibt die gleihe
/////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// Starten der Funktionen darf erst mglich sein, wenn Dokument geladen ist
$(document).ready(function() {

    // Event : Tickets auf Datenbank verbuchen
    $(".tickets__button__inWarenkorb").on('click', function (e) {

        // Das neuladen der Seite verhindern, damit HTML nicht verändert wird, bevor die Anfrage verarbitet wurde
        e.preventDefault();


        // Der Vorgang kann aber nur ausgeführt werden, wenn sich ein Kunde erfolgreich eingelogt hat
        // Ist ein User eingeloggt, so ist das feld mit einem String belegt und nicht leer
        if (localStorage.getItem("kundenLoginUserAktiv") !== undefined && localStorage.getItem("kundenLoginUserAktiv") !== "" &&
            localStorage.getItem("kundenLoginUserAktiv") !== null) {

            // Die Daten aus dem Local Storage sind JSON, da nur Strings und keine Objekte gespeihert werden können
            kundenLoginUserAktiv = JSON.parse(localStorage.getItem("kundenLoginUserAktiv"));

            // Die Daten aus dem Local Storage sind JSON, da nur Strings und keine Objekte gespeihert werden können
            aktuellerWarenkorb = JSON.parse(localStorage.getItem("aktuellerWarenkorb"));

            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            /////////////////     Daten für Ajax Befehl vorbereiten
            /////////////////
            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

            // Variablendefinitionen
            var ajaxSendenSpalte = [];
            var ajaxSendenWert = [];

            // Daten für Ajax aufruf vorbereiten
            for (var i=0; i < adminTicketAlle.length; i++) {

                // Variable für Server Ajay CAll vorbereiten
                // Bereits reservierte Tickets bleiben gespeichert
                if ( ! isNaN( $('.ticketPreis__container__ticketwahl__inputfeld.index' + i).val()) ) {
                    // Werte in Sendevariable schreiben
                    ajaxSendenSpalte.push( adminTicketAlle[i]['id']);
                    ajaxSendenWert.push( $('.ticketPreis__container__ticketwahl__inputfeld.index' + i).val() );
                }
            }

            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            /////////////////    Ajax Befehl : Tickets abbuchen
            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

            // Auf diese Weise wird dem PHP Server die Aufgabe mitgeteilt
            var dataToSend = {
                tabelle: "ticketarten",
                funktion: "TicketsBlockieren",
                parameter: "",
                spaltenName: "",
                spaltenWert: "",
                idZeile: aktuellerWarenkorb[0]['id'],
                updateSpalte: ajaxSendenSpalte, // Tickettyp für n:n Tabelle
                updateWert: ajaxSendenWert, // Anzahl Tickets für n:N Tabelle
                datensatz: []
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

            }).done(function (data) {
                console.log(data);

                // Rückgabewert ist ein Array of Objekte mit den attributten "id" und "zusatand"
                // Der Zustant hat die Werte: "true" oder "false" - Sind alle Indexe auf true, so wurden alle Tickets Reserviert. Ansonsten nicht
                for (var i=0; i < data.length; i++) {

                    // Ein Ticket welches nicht reserviert werden konnte
                    if ( data[i]['zustand'] === "false") {
                        // Die Ticketarten mittels id nach dem title der Ticketart durchsuchen und den Benutzer mitteilen
                        for (var y=0; y < adminTicketAlle.length; y++) {
                            // Berrechnung Anzahl Tickets zum Kauf
                            var ticketsZumVerkauf = adminTicketAlle[y].maximaleAnzahlTickets - adminTicketAlle[y].verkaufteAnzahlTickets - adminTicketAlle[y].blockierteAnzahlTickets;
                            // passende id wurde gefunden
                            if(adminTicketAlle[y]['id'] === data[i]['ticketart_id'] ) {
                                alert("Vom Tickettyp mit dem Titel: " + adminTicketAlle[y].title + " sind nur noch: " + ticketsZumVerkauf + " zum Verkauf vorhanden" +
                                    " Machen Sie einen Browser Refresh und geben reduzieren Sie Ihre Menge");
                            }
                        }
                    }
                }

                //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                /////////////////    Ajax Befehl : Lesen des aktuellen Warenkorbes
                //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

                // Nach erfolgreicher Aktion, den aktuellen Stand von Tickets von der Datenbank laden
                // Die Liste neu aufbauen mit den aktuellen Einträgen
                // Auf diese Weise wird dem PHP Server die Aufgabe mitgeteilt
                var dataToSend = {
                    tabelle: "Ticketarten_Warenkorb",
                    funktion: "lesen",
                    parameter: "suchen",
                    spaltenName: "warenkorb_id",
                    spaltenWert: aktuellerWarenkorb[0]['id'],
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
                    localStorage.setItem("kundeWarenkorb", JSON.stringify(data));

                    // Ticket aktualisieren
                    TicketsDetailAnzeige( $(".ticketsListe"), data);


                }).fail(function (error) {
                    console.log("Error!");
                    console.log( error );
                });

            }).fail(function (error) {
                console.log("Error!");
                console.log(error);
                // alert("Es ist ein Fehler aufgetreten")
            });


        }
        // Wenn kein USer eingeloggt, dann Meldung an den User - zuerst einlogen
        else {
            alert("Sie müssen sich zuerst einloggen")
        }

    });


});


















//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////     FUNKTIONSDEFINTIONEN          Tickets welche gekauft werden können auflisten auf Anzeige
/////////////////                                   RETURNWERT: Gesamtsumme Preis aktuell aller Tickets
/////////////////
/////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function TicketsDetailAnzeige (htmlKlasse, arrayOfObject_serverDaten) {  // integer_indexDaten
    //  WICHTIG!!!!!  DATENTYP IST :    Array of Objekten für Serverdaten
    //  WICHTIG!!!!!! DOM Selektro mittels JQUERY


    // DOM Selektoren
    var bandListHtml = htmlKlasse;
    var containerClassName = htmlKlasse.attr('class');

    // VAriablendefinitionen
    var anzahlTicketartenZumVerkauf = 0;
    // Variable zum ausgeben des Geasmten Preises aaller Tickets
    var totalPreis = 0;
    var anzTicketsZuKaufen = 0;

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //
    //     DOM BAUM aufbauen, sofern noch nicht vorhanden und NEuberechnungen der PReissumme
    //
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    // Schlaufe mit allen Tickets, welche der Reihe nach aausgegeben werden
    for (var i = 0; i < arrayOfObject_serverDaten.length; i++) {

        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //
        //     Es werden nur jene Tickets ausgegeben, welche innerhalb der Start und Endverkaufszeit stehen
        //
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        // Aktuelle Zeit/Datum
        var jetzt = new Date();
        // Startzeit in Date Datentyp konvertieren
        var start = new Date(arrayOfObject_serverDaten[i].startDatumTicketVerkauf);
        // Endzeit in Date Datentyp konvertieren
        var ende = new Date(arrayOfObject_serverDaten[i].endDatumTicketVerkauf);

        // Es werden nur jene Tickets ausgegeben, welche innerhalb der Start und Endverkaufszeit stehen
        if (start < jetzt && ende > jetzt) {


            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            //     Der Dom Baum wird nur aufgebaut, sofern noch kein Element mit der gleichen Klasse exisitert
            //     Somti wird eine mehrfachausgabe bei erneuter Funktionsaufruf vermieden. Dies ist nöötig zur neuberechnung des PReises
            //
            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

            if ( $('.ticketDetail.index' + i).length === 0 ) {

                //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                //     TICKET Detail Informationen - Bild und kurzinfos
                //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

                // Linke Spalte
                var ticketDetail = $("<div></div>").appendTo(bandListHtml);
                ticketDetail.attr('class', 'ticketDetail col-xs-7 index' + i);

                // Linke Spalte - Kurzinfos
                var Kurzinfos = $("<div></div>").appendTo(ticketDetail);
                Kurzinfos.attr('class', 'ticketDetail__kurzinfos row index' + i);


                // Linke Spalte - Kurzinfos - Bild
                var KurzinfosBild = $("<div></div>").appendTo(Kurzinfos);
                KurzinfosBild.attr('class', 'ticketDetail__kurzinfos__bild col-xs-2 index' + i);
                // Linke Spalte - Kurzinfos - Bild - <IMG>
                var KurzinfosBild_img = $("<img>").appendTo(KurzinfosBild);
                KurzinfosBild_img.attr('src', rootBilderPfadeUser + arrayOfObject_serverDaten[i].bild);


                // Linke Spalte - Kurzinfos - Text
                var KurzinfosContainerText = $("<div></div>").appendTo(Kurzinfos);
                KurzinfosContainerText.attr('class', 'ticketDetail__kurzinfos__text col-xs-10 index' + i);
                // Linke Spalte - Kurzinfos - Text - Adresse
                var KurzinfosContainerText__adresse = $("<div></div>").appendTo(KurzinfosContainerText);
                KurzinfosContainerText__adresse.attr('class', 'ticketDetail__kurzinfos__text__adresse index' + i);
                KurzinfosContainerText__adresse.html(arrayOfObject_serverDaten[i].eventAdresse);
                // Linke Spalte - Kurzinfos - Text - Titel
                var KurzinfosContainerText__titel = $("<div></div>").appendTo(KurzinfosContainerText);
                KurzinfosContainerText__titel.attr('class', 'ticketDetail__kurzinfos__text__titel index' + i);
                KurzinfosContainerText__titel.html(arrayOfObject_serverDaten[i].title);
                // Linke Spalte - Kurzinfos - Text - Preis pro Ticket
                var KurzinfosContainerText__preis = $("<div></div>").appendTo(KurzinfosContainerText);
                KurzinfosContainerText__preis.attr('class', 'ticketDetail__kurzinfos__text__preis index' + i);
                KurzinfosContainerText__preis.html(arrayOfObject_serverDaten[i].ticketPreis + ".- CHF pro Person");


                //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                //     TICKET Detail Informationen - Beschreibung
                //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

                // Linke Spalte - Kurzinfos - Beschreibung - Container
                var ticketBeschreibung = $("<div></div>").appendTo(ticketDetail);
                ticketBeschreibung.attr('class', 'ticketDetail__beschreibung index' + i);


                // Linke Spalte - Kurzinfos - Beschreibung - Leiste mehr oder weniger anzeigen - Container
                var beschreibungEventLeiste = $("<div></div>").appendTo(ticketBeschreibung);
                beschreibungEventLeiste.attr('class', 'ticketDetail__beschreibung__eventLeiste row index' + i);

                // Linke Spalte - Kurzinfos - Beschreibung - Leiste mehr oder weniger anzeigen - text
                var beschreibungEventLeisteLinks = $("<div>Mehr anzeigen</div>").appendTo(beschreibungEventLeiste);
                beschreibungEventLeisteLinks.attr('class', 'ticketDetail__beschreibung__eventLeiste__links col-xs-10 index' + i);

                // Linke Spalte - Kurzinfos - Beschreibung - Leiste mehr oder weniger anzeigen - "+" Zeichen
                var beschreibungEventLeisteRechts = $("<div>+</div>").appendTo(beschreibungEventLeiste);
                beschreibungEventLeisteRechts.attr('class', 'ticketDetail__beschreibung__eventLeiste__rechts col-xs-2 index' + i);


                // Linke Spalte - Kurzinfos - Beschreibung - abstand
                var abstand = $("<br>").appendTo(ticketBeschreibung);


                // Linke Spalte - Kurzinfos - Beschreibung - Inhalt - Container
                var beschreibungText = $("<div></div>").appendTo(ticketBeschreibung);
                beschreibungText.attr('class', 'ticketDetail__beschreibung__text index' + i);

                // Linke Spalte - Kurzinfos - Beschreibung - Inhalt - Titel
                var beschreibungTextUeberschrift = $("<h4>Veranstaltungsinformationen</h4>").appendTo(beschreibungText);
                beschreibungTextUeberschrift.attr('class', 'ticketDetail__beschreibung__text__hx index' + i);

                // Linke Spalte - Kurzinfos - Beschreibung - Inhalt - Daten aus Datenbank
                var beschreibungTextInhalt = $("<div></div>").appendTo(beschreibungText);
                beschreibungTextInhalt.attr('class', 'ticketDetail__beschreibung__text__inhalt index' + i);
                beschreibungTextInhalt.html(arrayOfObject_serverDaten[i].beschreibung);


                //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                //     TICKET Preis - rechte Seite mit inputfeld für Anazhl tickets und anzeige PReissumme pro ticketart
                //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

                // Rechte Spalte - TicketPreis - Container rechte Spalte
                var ticketPreis = $("<div></div>").appendTo(bandListHtml);
                ticketPreis.attr('class', 'ticketPreis col-xs-4 index' + i);


                // Rechte Spalte - TicketPreis - Container - Container für Inhaltsbox weiss
                var ticketPreisContainer = $("<div></div>").appendTo(ticketPreis);
                ticketPreisContainer.attr('class', 'ticketPreis__container index' + i);


                // Rechte Spalte - TicketPreis - Auswahl Anzahl Tickets - Container
                var ticketPreisContainerTicketwahl = $("<div></div>").appendTo(ticketPreisContainer);
                ticketPreisContainerTicketwahl.attr('class', 'ticketPreis__container__ticketwahl row index' + i);

                // Rechte Spalte - TicketPreis - Auswahl Anzahl Tickets - Inputfeld
                var ticketPreisContainerTicketwahlInputfeld = $("<input type='number'>").appendTo(ticketPreisContainerTicketwahl);
                ticketPreisContainerTicketwahlInputfeld.attr('class', 'ticketPreis__container__ticketwahl__inputfeld col-xs-3 index' + i);


                // Rechte Spalte - TicketPreis - Auswahl Anzahl Tickets - Text "Anzahl Personen"
                var ticketPreisContainerTicketwahlPreis = $('<div></div>').appendTo(ticketPreisContainerTicketwahl);
                ticketPreisContainerTicketwahlPreis.attr('class', 'ticketPreis__container__ticketwahl__text col-xs-9 index' + i);


                // Rechte Spalte - TicketPreis - Preisumme total pro Ticketart
                var ticketPreisContainerPreis = $("<div></div>").appendTo(ticketPreis);
                ticketPreisContainerPreis.attr('class', 'ticketPreis__container__preis index' + i);

                // Wenn im derzeitigen Moment alle Tickets ausverkauft sind, entsprechende Anpassungen im HTML
                // Tickets sind sichtbar aber nicht anwählbar
                if (arrayOfObject_serverDaten[i].verkaufteAnzahlTickets >= arrayOfObject_serverDaten[i].maximaleAnzahlTickets ) {
                    // Zusatzklasse vergeben bei Ausverkauft
                    $('.ticketDetail.index' + i).attr('class', 'ticketDetail col-xs-7 index' + i + ' ticketsAusverkauft');
                    $('.ticketPreis.index' + i).attr('class', 'ticketPreis col-xs-4 index' + i + ' ticketsAusverkauft');
                    $('.ticketPreis.index' + i).html('<h3>Ticket im Moment ausverkauft - Probieren Sie es später nochmals</h3>');
                }
                // Tickets können noch gekauft werden
                // Preissumme berechnen
                else {
                    var preissumme = ticketPreisContainerTicketwahlInputfeld.val() * arrayOfObject_serverDaten[i].ticketPreis;
                    ticketPreisContainerPreis.html('<h3>Preis: ' + preissumme + '.- CHF </h3>' + 'Endpreis zzgl Versand' + '<br><br>' + 'Haben Sie noch Fragen?' + '<br><h6>info@underworld-festival.ch</h6>');
                    // Klasse Ausverkauft enfernen
                    $('.ticketDetail.index' + i).attr('class', 'ticketDetail col-xs-7 index' + i);
                    $('.ticketPreis.index' + i).attr('class', 'ticketPreis col-xs-4 index' + i);
                }
            }
        }

        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //
        //     Neunerechnungen von Daten
        //
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        // Berechnung wieviele Tickets noch zum verkauf stehen. Das synchronisieren auf andere Kunden wird hier nicht berücksichtig
        // Beim definitven KAuf wird nochmals der affektive zur Verkauf stehnder Tickets abgefragt und allenfalls muss korriegerit werden durch den Kunden
        anzTicketsZuKaufen = arrayOfObject_serverDaten[i].maximaleAnzahlTickets - arrayOfObject_serverDaten[i].verkaufteAnzahlTickets;


        // Wenn die Auswahl Tickets durch den Kunden grösser ist, als noch zum verkauf stehen, so wird auf die Eingabe auf das Maximum beschränkt
        // Es erfolgt Eine Meldung an den Kunden.
        if( $('.ticketPreis__container__ticketwahl__inputfeld.index' + i).val() > anzTicketsZuKaufen) {
            $('.ticketPreis__container__ticketwahl__inputfeld.index' + i).val(anzTicketsZuKaufen);
            alert("Im dezeitigen Moment stehen noch Maximal " + anzTicketsZuKaufen + " zum Verkauf zur Verfügung" )
        }

        // Ebenso dürfen maximal eine definierte Anzahl Tickets pro Ticketart pro Kauf bestellt werden. Somit kann nicht jemand alles leerkaufen
        // Es erfolgt Eine Meldung an den Kunden.
        // Die Berechnung darf nur durchgeführt werden, sofern die VAriable "maxTicketsProKauf" auch eine definierte ZAhl ist
        // Sofern der Datenbankwert "maxTicketsProKauf" gesetzt und grösser als 0 ist, wird die maximale Anzahl Tickets pro Kauf beschränkt
        if ( ! isNaN(arrayOfObject_serverDaten[i].maxTicketsProKauf) && arrayOfObject_serverDaten[i].maxTicketsProKauf > 0) {

            // Sofern die Maximale Anzahl überschritten wird, so wird der eingegebene Wert damit überschrieben
            if( $('.ticketPreis__container__ticketwahl__inputfeld.index' + i).val() > arrayOfObject_serverDaten[i].maxTicketsProKauf) {
                $('.ticketPreis__container__ticketwahl__inputfeld.index' + i).val( arrayOfObject_serverDaten[i].maxTicketsProKauf);
                alert("Es dürfen maximal  " + arrayOfObject_serverDaten[i].maxTicketsProKauf + " Tickets dieses Ticketstyps pro Kauf erworben werden" )
            }
            // Ausgabe HTML Text
            $('.ticketPreis__container__ticketwahl__text.index' + i).html( 'Anzahl Personen (Maximal ' + arrayOfObject_serverDaten[i].maxTicketsProKauf + ' pro Kauf)' );
        }
        // Anderenfalls gitbs es keine beschränkung
        else {
            $('.ticketPreis__container__ticketwahl__text.index' + i).html( 'Anzahl Personen' );
        }




        // Preissumme pro Ticketart berechnen
        var preissumme2 = $('.ticketPreis__container__ticketwahl__inputfeld.index' + i).val() * arrayOfObject_serverDaten[i].ticketPreis;
        $('.ticketPreis__container__preis.index' + i).html('<h3>Preis: ' + preissumme2 + '.- CHF </h3>' + 'Endpreis zzgl Versand' + '<br><br>' + 'Haben Sie noch Fragen?' + '<br><h6>info@underworld-festival.ch</h6>');


        // Preissumme total aller Tickets berechnen
        // Es dürfen nur Felder mit Zahlen mitberücksichtigt werden, ein undefined zerstört den Wert
        if( ! isNaN(preissumme2)  ) {
            totalPreis += preissumme2;
        }



    }
    // Ausgabe PReis Total
    return totalPreis;
}


