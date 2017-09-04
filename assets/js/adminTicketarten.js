
/*
 Mit dieser Seite werden Funktionen zum Anzeigen und Verändern der Ticketarten für die Administratoren erledigt.
 1. Neues Ticket erstellen: (Daten in Datenbank speichern)
 2. Ticketdaten anpasssen: (Veränderungen auf Datenbank speichern)
 3. Ticketart löschen
 4. Auflisten aller auf der Datenbank vorhandenen Ticketarten


 Die Liste ist im HTML nicht vorhanden - nur der Eintstiegscontainer.
 Der DOM Baum wird mit Javascript erstellt, nachdem mit Ajax die Banddaten vom Servergelesen wurden

 Die Formularfelder sind bereits im HTML programmiert und werden per Display block freigeschaltet

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

 1.  Alle Benutzereingaben
 2.  Serverdaten zu beginn des Seitemloads von allen Ticketdaten auf dem Server
 3.  Die zuletz gelesenen Serverdaten    :    "ajaxDaten"
 4.  Die id des zuletzt geladenen Detail Beitrages : "adminTicketDetailAktuelleID"

 */

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////
/////////////////     INITIALISIERUNGEN         Zuerst werden alle Ticketarten aus der Datenabk als Liste angezeigt
/////////////////                               Zum löschen oder verändern ist administrator Level 1 nötig
/////////////////
/////////////////                               Ist kein Administrator angemeldet, so wird nichts angezeigt
/////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// Variable mit Serverdaten. Diese wird immer neu mit dem Inhalt aus dem Local Storage beschrieben
var ajaxDatenSenden = "";
var ajaxDatenAntwort = "";
// In dieser Variablen werden auf dem Client die zuletzt geladenen Ticketdaten vom Server gespeichert, damit nicht immer neu geladen werden muss
var adminTicketAlle = "";
// In dieser Variablen wird der zuletzt verwendete Index von Client Array mit den Ticket DAten gespeichert. Dies ist notwendig, wenn dierser in einem anderen Event nochmals gebraucht wird
// Die id des Elementes aus diesem Index wird in den local Storage geseichert, da bei öndern der DAten die Position ändern kann
var ServerDatenIndex;
// Hilfsvariablen zum zusammensetzen eines Strings aus verschiedenen Eingabefeldern (Zeit und DAtum)
var eventDatumHilfsvariable;
var zeitHilfsvariable;
var startTicketVerkaufDatumHilfsvariable;
var endeTicketVerkaufDatumHilfsvariable;



// Starten der Funktionen darf erst mglich sein, wenn Dokument geladen ist
$(document).ready(function() {

    // Ticket Daten laden
    // Alle Ticket Einträge aus der Datenbank laden

    // Auf diese Weise wird dem PHP Server die Aufgabe mitgeteilt
    var dataToSend = {
        tabelle         : "ticketarten",
        funktion        : "lesen",
        parameter       : "alle",
        spaltenName     : "",
        spaltenWert     : "",
        idZeile         : -1 ,
        updateSpalte    : [],
        updateWert      : []
    };

    // Start ajay abfrage
    $.ajax({
        url: rootAjax + '../../../assets/php/model/ajaxDatenbank.php',  // rootAjax + 'assets/php/model/ajaxDatenbank.php'
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

        // Speichern der Ticketdaten in Local Storage
        localStorage.setItem("adminTicketAlle", JSON.stringify(data) );

        // Aktuell Administratordaten aus dem Local Storage kontrollieren auf den Zustand
        // Ausgabe der DAten nur, sofern ein Benutzer angemeldet ist
        if (localStorage.getItem("adminLoginUserAktiv") !== undefined && localStorage.getItem("adminLoginUserAktiv") !== "" &&
            localStorage.getItem("adminLoginUserAktiv") !== null) {

            // Alle Daten löschen
            $(".adminTicketList").html('');

            // Ausgabe der Tickets als Liste
            adminTicketList( $(".adminTicketList"), adminLoginUserAktiv[0]["zugriffsberechtigung"], data);

            // Button neuer eintrag anzeigen bei Zugrifslevel 1
            if ( adminLoginUserAktiv[0]["zugriffsberechtigung"] === 1) {
                $(".adminTicketListErstellen__neu").css("display", "inline-block");
            }
            else {
                $(".adminTicketListErstellen__neu").css("display", "none");
            }
        }
        // Meldung anmelden
        else {
            alert("Bitte zuerst anmelden");
        }


    }).fail(function(){
        console.log("Error!");
    });
});




//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////
/////////////////     Benutzerdaten überwachen          Sollten die Benutzerdaten wechseln. wird die Ticketliste neu aufgebaut
/////////////////                                       allfällige Zugriffsbeschränkungen werden aktualisiert
/////////////////
/////////////////
/////////////////
/////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// Starten der Funktionen darf erst mglich sein, wenn Dokument geladen ist
$(document).ready(function() {

    // Mit diesem Event "DOMSubtreeModified" werden Veränderungen im Dom Baum erkannt
    // Veränderte Anmeldedaten werdendadurch erkannt
    $(".adminLoginMenue__userAktiv").on('DOMSubtreeModified', function () {

        // Aktuell Administratordaten aus dem Local Storage kontrollieren auf den Zustand
        if (localStorage.getItem("adminLoginUserAktiv") !== undefined && localStorage.getItem("adminLoginUserAktiv") !== "" &&
            localStorage.getItem("adminLoginUserAktiv") !== null) {

            // Anzeige Ticketliste aktivieren
            $(".adminTicketList").css("display", "block");
            $(".adminTicketList").html('');

            // Aktuelle Benutzerdaten lesen
            // Die Daten aus dem Local Storage sind JSON, da nur Strings und keine Objekte gespeihert werden können
            adminLoginUserAktiv = JSON.parse(localStorage.getItem("adminLoginUserAktiv"));

            // Button neuer eintrag erstellen anzeigen bei Zugrifslevel 1
            if ( adminLoginUserAktiv[0]["zugriffsberechtigung"] === 1) {
                $(".adminTicketListErstellen__neu").css("display", "inline-block");
            }
            else {
                $(".adminTicketListErstellen__neu").css("display", "none");
            }

            // Aktuelle Ticketdaten lesen
            // Die Daten aus dem Local Storage sind JSON, da nur Strings und keine Objekte gespeihert werden können
            adminTicketAlle = JSON.parse(localStorage.getItem("adminTicketAlle"));

            // Ausgabe der Liste Ticketdaten mit aktuellen Benuzerrechten
            adminTicketList( $(".adminTicketList"), adminLoginUserAktiv[0]["zugriffsberechtigung"], adminTicketAlle);
        }
        else {
            // elmente sperren bei inaktivem Login
            $(".adminTicketList").css("display", "none");
            $(".adminTicketDetails").css("display", "none");
        }
    });
});



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////
/////////////////     adminTicketList           Events
/////////////////                               Eintrag löschen (Benutzerlevel 1 erforderlich
/////////////////
/////////////////
/////////////////
/////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// Eintrag löschen
// Starten der Funktionen darf erst mglich sein, wenn Dokument geladen ist
$(document).ready(function() {

    // Element löschen
    // WEnn der Button Löschen geklicht wird, so startet eine Seranfrage um die Daten dort zu löschen. Ist die aktion erfolgreich, wird zugleich der aktuele Stad zurückgelesen
    $("body").on('click', '.adminTicketList__table__zeile__loeschen__button', function () {

        // Die zu löschende Spalte ermitteln bezogen auf das Array im Client mit den geladenen Serverdaten
        // Speichern der id von der Datenbank
        ServerDatenIndex = $(this).parent().parent().index() - 1;
        localStorage.setItem("adminTicketDetailAktuelleID", JSON.stringify(adminTicketAlle[ServerDatenIndex].id) );

        // Aktuelle Ticketdaten lesen
        // Die Daten aus dem Local Storage sind JSON, da nur Strings und keine Objekte gespeichert werden können
        // adminTicketAlle = JSON.parse(localStorage.getItem("adminTicketAlle"));

        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        /////////////////    Ajax Befehl : Eintrag löschen
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        // Die Loschaktion darf nur mit den Benutzerlevel 1 erfolgen
        if (adminLoginUserAktiv[0]["zugriffsberechtigung"] === 1) {

            // Element löschen auf Datenbank
            // Alle Ticket Einträge aus der Datenbank laden
            // Auf diese Weise wird dem PHP Server die Aufgabe mitgeteilt
            var dataToSend = {
                tabelle         : "ticketarten",
                funktion        : "loeschen",
                parameter       : "suchen",
                spaltenName     : "id",
                spaltenWert     : adminTicketAlle[ServerDatenIndex].id,
                idZeile         : -1 ,
                updateSpalte    : [],
                updateWert      : []
            };

            // Start ajay abfrage
            $.ajax({
                url: rootAjax + '../../../assets/php/model/ajaxDatenbank.php',  // rootAjax + 'assets/php/model/ajaxDatenbank.php'
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

                console.log(data);
                //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                /////////////////    Ajax Befehl : NAch efolgreichem löschen den aktuellen Servertand neu laden und Ticketliste neu aufbauen
                //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

                // Nach erfolgreicher Aktion, den aktuellen Stand von Tickets von der Datenbank laden
                // Die Liste neu aufbauen mit den aktuellen Einträgen
                // Auf diese Weise wird dem PHP Server die Aufgabe mitgeteilt
                var dataToSend = {
                    tabelle         : "ticketarten",
                    funktion        : "lesen",
                    parameter       : "alle",
                    spaltenName     : "",
                    spaltenWert     : "",
                    idZeile         : -1 ,
                    updateSpalte    : [],
                    updateWert      : []
                };

                // Start ajay abfrage
                $.ajax({
                    url: rootAjax + '../../../assets/php/model/ajaxDatenbank.php',  // rootAjax + 'assets/php/model/ajaxDatenbank.php'
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

                    // Speichern der Ticketdaten in Local Storage
                    localStorage.setItem("adminTicketAlle", JSON.stringify(data) );

                    // Aktuell Administratordaten aus dem Local Storage kontrollieren auf den Zustand
                    // Ausgabe der Daten nur, sofern ein Benutzer angemeldet ist
                    if (localStorage.getItem("adminLoginUserAktiv") !== undefined && localStorage.getItem("adminLoginUserAktiv") !== "" &&
                        localStorage.getItem("adminLoginUserAktiv") !== null) {

                        // Zuerst alles löschen
                        $(".adminTicketList").html('');

                        // Ausgabe der Tickets als Liste
                        adminTicketList( $(".adminTicketList"), adminLoginUserAktiv[0]["zugriffsberechtigung"], data);
                    }
                    // Meldung anmelden
                    else {
                        alert("Es ist ein unerwarteter Fehler aufgetreten, Bitte Laden Sie die Seite erneut");
                    }

                }).fail(function(){
                    console.log("Error!");
                });


            }).fail(function(){
                console.log("Error!");
            });


        }
        // Keine Berechtigung zum löschen
        else {
            alert("Sie haben keine Berechtigung");
        }
    });
});






//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////
/////////////////     adminTicketList         Events
/////////////////                           Zurück zur Listenansicht
/////////////////                           Details ansehen (Benutzerlevel 2 erforderlich)
/////////////////                           Aenderungen speichern (Benutzerlevel 1 erforderlich)
/////////////////
/////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Detailansicht verlassen
// Starten der Funktionen darf erst mglich sein, wenn Dokument geladen ist
$(document).ready(function() {

    // Zurück zur Listen Ansicht
    $(".adminTicketDetails__zurueck").on('click', function () {

        // Alle Daten löschen
        $(".adminTicketList").html('');

        // Anzeige der Detailansicht verbergen
        $(".adminTicketDetails").css("display", "none");

        // Sofern die Listenansicht noch nicht eingeblendet ist, wieder einblenden
        if ($(".adminTicketList").css("display") !== "block" || $(".adminTicketList").html() === '') {

            $(".adminTicketList").css("display", "block");

            // Aktuelle Benutzerdaten lesen
            // Die Daten aus dem Local Storage sind JSON, da nur Strings und keine Objekte gespeihert werden können
            adminLoginUserAktiv = JSON.parse(localStorage.getItem("adminLoginUserAktiv"));

            // Aktuelle Ticketdaten lesen
            // Die Daten aus dem Local Storage sind JSON, da nur Strings und keine Objekte gespeihert werden können
            adminTicketAlle = JSON.parse(localStorage.getItem("adminTicketAlle"));

            // Ausgabe der Liste Ticketdaten mit aktuellen Benuzerrechten
            adminTicketList( $(".adminTicketList"), adminLoginUserAktiv[0]["zugriffsberechtigung"], adminTicketAlle);
        }

    });


    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////     Detailansicht starten - abfüllen mit detaildaten der entsprechenden Ticketart id
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    $("body").on('click', '.adminTicketList__table__zeile__detail__button', function () {

        // Aktuelle Benutzerdaten lesen
        // Die Daten aus dem Local Storage sind JSON, da nur Strings und keine Objekte gespeihert werden können
        adminLoginUserAktiv = JSON.parse(localStorage.getItem("adminLoginUserAktiv"));

        // Die zu anzeigende Detailansicht  ermitteln
        ServerDatenIndex = $(this).parent().parent().index() - 1;


        // Aktuelle Ticketdaten lesen
        // Die Daten aus dem Local Storage sind JSON, da nur Strings und keine Objekte gespeihert werden können
        adminTicketAlle = JSON.parse(localStorage.getItem("adminTicketAlle"));

        // Aktuelle Daten in Detailansicht einblenden
        if (adminLoginUserAktiv[0]["zugriffsberechtigung"] === 2 || adminLoginUserAktiv[0]["zugriffsberechtigung"] === 1) {

            // Listenansicht verbergen
            $(".adminTicketList").css("display", "none");

            // Anzeige der Detailansicht
            $(".adminTicketDetails").css("display", "block");


            // Abfüllen der aktuellen Daten in die Detailansicht
            // id aktuell
            $(".adminTicketDetails__aktuell.adminTicketDetails__id").html(adminTicketAlle[ServerDatenIndex].id);
            // bild 01 aktuell
            $(".adminTicketDetails__aktuell.adminTicketDetails__bild").html(adminTicketAlle[ServerDatenIndex].bild);
            // Titel aktuell
            $(".adminTicketDetails__aktuell.adminTicketDetails__titel").html(adminTicketAlle[ServerDatenIndex].title);
            // Beschreibung aktuell
            $(".adminTicketDetails__aktuell.adminTicketDetails__beschreibung").html(adminTicketAlle[ServerDatenIndex].beschreibung);
            // Datum aktuell
            $(".adminTicketDetails__aktuell.adminTicketDetails__datum").html(adminTicketAlle[ServerDatenIndex].eventDatum) ;
            // Zeit aktuell
            $(".adminTicketDetails__aktuell.adminTicketDetails__zeit").html(adminTicketAlle[ServerDatenIndex].eventZeit);
            // Event Ort aktuell
            $(".adminTicketDetails__aktuell.adminTicketDetails__ort").html(adminTicketAlle[ServerDatenIndex].eventOrt);
            // Event Ort aktuell
            $(".adminTicketDetails__aktuell.adminTicketDetails__adresse").html(adminTicketAlle[ServerDatenIndex].eventAdresse);
            // ticketpreis aktuell
            $(".adminTicketDetails__aktuell.adminTicketDetails__ticketpreis").html(adminTicketAlle[ServerDatenIndex].ticketPreis);
            // maximaleAnzahlTickets aktuell
            $(".adminTicketDetails__aktuell.adminTicketDetails__maximaleAnzahlTickets").html(adminTicketAlle[ServerDatenIndex].maximaleAnzahlTickets);
            // verkaufteAnzahlTickets aktuell
            $(".adminTicketDetails__aktuell.adminTicketDetails__verkaufteAnzahlTickets").html(adminTicketAlle[ServerDatenIndex].verkaufteAnzahlTickets);
            // startDatumTicketVerkauf aktuell
            $(".adminTicketDetails__aktuell.adminTicketDetails__startDatumTicketVerkauf").html(adminTicketAlle[ServerDatenIndex].startDatumTicketVerkauf);
            // endDatumTicketVerkauf aktuell
            $(".adminTicketDetails__aktuell.adminTicketDetails__endDatumTicketVerkauf").html(adminTicketAlle[ServerDatenIndex].endDatumTicketVerkauf);
            // maxTicketsProKauf aktuell
            $(".adminTicketDetails__aktuell.adminTicketDetails__maxTicketsProKauf").html(adminTicketAlle[ServerDatenIndex].maxTicketsProKauf);
            // createTime aktuell
            $(".adminTicketDetails__aktuell.adminTicketDetails__createTime").html(adminTicketAlle[ServerDatenIndex].createTime);
            // updateTime aktuell
            $(".adminTicketDetails__aktuell.adminTicketDetails__updateTime").html(adminTicketAlle[ServerDatenIndex].updateTime);
            // Administrator letztes update aktuell
            $(".adminTicketDetails__aktuell.adminTicketDetails__administrator").html(adminTicketAlle[ServerDatenIndex].administratoren_id);

            // Ist kein Admin mit Level 1 aktiv, so werden die Eingabefelder audgeblendet
            if (adminLoginUserAktiv[0]["zugriffsberechtigung"] !== 1) {

                // Listenansicht verbergen
                $(".adminTicketDetails__neu").css("display", "none");
            }
        }
        // Ansonsten Meldung
        else {
            alert ("Keine Berechtigung");
        }

    });


    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////
    /////////////////     Detailansicht - Änderungen speichern
    /////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // änderungen in Detailansicht abspeichern auf Datenbank
    // Wenn der Button details geklicht wird, so startet eine Serverabfrage zum updaten der daten
    $("body").on('click', '.adminTicketDetails__speichern', function () {

        // Aktuelle Benutzerdaten lesen
        // Die Daten aus dem Local Storage sind JSON, da nur Strings und keine Objekte gespeihert werden können
        adminLoginUserAktiv = JSON.parse(localStorage.getItem("adminLoginUserAktiv"));

        // Aktuelle Ticketdaten lesen
        // Die Daten aus dem Local Storage sind JSON, da nur Strings und keine Objekte gespeihert werden können
        adminTicketAlle = JSON.parse(localStorage.getItem("adminTicketAlle"));

        // Den Index vom Client Array wieder ausfindig machen durch suchen der ServerDatenbank id des zulet abgespeicherten elementes
        // Letzte gespeicherte ID aus local Storage laden
        var ServerDatenIndexHilfsvariable = localStorage.getItem("adminTicketDetailAktuelleID");

        // CLient Array nach der id durchsuchen und Array Position als Index abspeichern
        for (var i=0; i < adminTicketAlle.length; i++) {

            if ( ServerDatenIndexHilfsvariable === adminTicketAlle[i]["id"]) {
                ServerDatenIndex = i;
            }
        }


        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        /////////////////     Neue Daten aus Input feldern lesen und in Variable abspeichern
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


        // Aktuelle Daten in Detailansicht einblenden
        if (adminLoginUserAktiv[0]["zugriffsberechtigung"] === 2 || adminLoginUserAktiv[0]["zugriffsberechtigung"] === 1) {

            // Speichern der neuen Daten
            // Alle Eingabe Felder, welche nicht leer sind werden als neuer Eintrag betrachtet
            // Bild 1 Neu
            if ( $(".adminTicketDetails__neu.adminTicketDetails__bild").val() !== '') {
                adminTicketAlle[ServerDatenIndex].bild = $(".adminTicketDetails__neu.adminTicketDetails__bild").val();
            }
            // Titel Neu
            if ( $(".adminTicketDetails__neu.adminTicketDetails__titel").val() !== '') {
                adminTicketAlle[ServerDatenIndex].title = $(".adminTicketDetails__neu.adminTicketDetails__titel").val();
            }
            // Beschreibung Neu
            if ( $(".adminTicketDetails__neu.adminTicketDetails__beschreibung").val() !== '') {
                adminTicketAlle[ServerDatenIndex].beschreibung = $(".adminTicketDetails__neu.adminTicketDetails__beschreibung").val();
            }
            // eventDatum Neu
            if ( $(".adminTicketDetails__neu.adminTicketDetails__datum").val() !== '') {
                // Datum aus den drei Einzelfelder zu einem String zusammen setzen mit Trennzeichen Punkt
                adminTicketAlle[ServerDatenIndex].eventDatum =  $(".adminTicketDetails__neu.adminTicketDetails__datum").eq(0).val() + '.' + $(".adminTicketDetails__neu.adminTicketDetails__datum").eq(1).val() + '.' +$(".adminTicketDetails__neu.adminTicketDetails__datum").eq(2).val();
            }
            // eventZeit Neu
            if ( $(".adminTicketDetails__neu.adminTicketDetails__zeit").val() !== '') {
                adminTicketAlle[ServerDatenIndex].eventZeit = $(".adminTicketDetails__neu.adminTicketDetails__zeit").eq(0).val() + ':' + $(".adminTicketDetails__neu.adminTicketDetails__zeit").eq(1).val() + ':00';
            }
            // eventOrt Neu
            if ( $(".adminTicketDetails__neu.adminTicketDetails__ort").val() !== '') {
                adminTicketAlle[ServerDatenIndex].eventOrt = $(".adminTicketDetails__neu.adminTicketDetails__ort").val();
            }
            // eventAdresse Neu
            if ( $(".adminTicketDetails__neu.adminTicketDetails__adresse").val() !== '') {
                adminTicketAlle[ServerDatenIndex].eventAdresse = $(".adminTicketDetails__neu.adminTicketDetails__adresse").val();
            }
            // ticketpreis  Neu
            if ( $(".adminTicketDetails__neu.adminTicketDetails__ticketpreis").val() !== '') {
                adminTicketAlle[ServerDatenIndex].ticketPreis = parseInt( $(".adminTicketDetails__neu.adminTicketDetails__ticketpreis").val() );
            }
            // maximaleAnzahlTickets Neu
            if ( $(".adminTicketDetails__neu.adminTicketDetails__maximaleAnzahlTickets").val() !== '') {
                adminTicketAlle[ServerDatenIndex].maximaleAnzahlTickets = parseInt( $(".adminTicketDetails__neu.adminTicketDetails__maximaleAnzahlTickets").val() );
            }
            // verkaufteAnzahlTickets Neu
            if ( $(".adminTicketDetails__neu.adminTicketDetails__verkaufteAnzahlTickets").val() !== '') {
                adminTicketAlle[ServerDatenIndex].verkaufteAnzahlTickets = parseInt( $(".adminTicketDetails__neu.adminTicketDetails__verkaufteAnzahlTickets").val() );
            }
            // startDatumTicketVerkauf Neu
            if ( $(".adminTicketDetails__neu.adminTicketDetails__startDatumTicketVerkauf").val() !== '') {
                // Datum aus den drei Einzelfelder zu einem String zusammen setzen mit Trennzeichen Punkt
                adminTicketAlle[ServerDatenIndex].startDatumTicketVerkauf = $(".adminTicketDetails__neu.adminTicketDetails__startDatumTicketVerkauf").eq(0).val() + '.' +
                    $(".adminTicketDetails__neu.adminTicketDetails__startDatumTicketVerkauf").eq(1).val() + '.' + $(".adminTicketDetails__neu.adminTicketDetails__startDatumTicketVerkauf").eq(2).val();
            }
            // endDatumTicketVerkauf Neu
            if ( $(".adminTicketDetails__neu.adminTicketDetails__endDatumTicketVerkauf").val() !== '') {
                // Datum aus den drei Einzelfelder zu einem String zusammen setzen mit Trennzeichen Punkt
                adminTicketAlle[ServerDatenIndex].endDatumTicketVerkauf = $(".adminTicketDetails__neu.adminTicketDetails__endDatumTicketVerkauf").eq(0).val() + '.' +
                    $(".adminTicketDetails__neu.adminTicketDetails__endDatumTicketVerkauf").eq(1).val() + '.' + $(".adminTicketDetails__neu.adminTicketDetails__endDatumTicketVerkauf").eq(2).val();
            }
            // maxTicketsProKauf Neu
            if ( $(".adminTicketDetails__neu.adminTicketDetails__maxTicketsProKauf").val() !== '') {
                // maxTicketsProKauf Neu
                adminTicketAlle[ServerDatenIndex].maxTicketsProKauf = parseInt( $(".adminTicketDetails__neu.adminTicketDetails__maxTicketsProKauf").val() );
            }
        }


        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        /////////////////    Ajax Befehl : Neue Daten auf Server speichern
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        // Die Loschaktion darf nur mit den Benutzerlevel 1 erfolgen
        if (adminLoginUserAktiv[0]["zugriffsberechtigung"] === 1) {

            // Element löschen auf Datenbank
            // Alle Ticket Einträge aus der Datenbank laden
            // Auf diese Weise wird dem PHP Server die Aufgabe mitgeteilt
            var dataToSend = {
                tabelle: "ticketarten",
                funktion: "update",
                parameter: "suchen",
                spaltenName: "id",
                spaltenWert: adminTicketAlle[ServerDatenIndex].id,
                idZeile: -1,
                updateSpalte: [ 'bild', 'title', 'beschreibung', 'eventDatum', 'eventZeit', 'eventOrt', 'eventAdresse', 'ticketPreis', 'maximaleAnzahlTickets', 'verkaufteAnzahlTickets', 'startDatumTicketVerkauf',
                    'endDatumTicketVerkauf', 'administratoren_id', 'maxTicketsProKauf'],
                updateWert: [adminTicketAlle[ServerDatenIndex].bild, adminTicketAlle[ServerDatenIndex].title, adminTicketAlle[ServerDatenIndex].beschreibung, adminTicketAlle[ServerDatenIndex].eventDatum,
                    adminTicketAlle[ServerDatenIndex].eventZeit, adminTicketAlle[ServerDatenIndex].eventOrt, adminTicketAlle[ServerDatenIndex].eventAdresse, parseInt(adminTicketAlle[ServerDatenIndex].ticketPreis),
                    parseInt(adminTicketAlle[ServerDatenIndex].maximaleAnzahlTickets), parseInt(adminTicketAlle[ServerDatenIndex].verkaufteAnzahlTickets), adminTicketAlle[ServerDatenIndex].startDatumTicketVerkauf,
                    adminTicketAlle[ServerDatenIndex].endDatumTicketVerkauf, adminLoginUserAktiv[0]["id"], parseInt(adminTicketAlle[ServerDatenIndex].maxTicketsProKauf) ]
            };

            console.log(  dataToSend );

            // Start ajay abfrage
            $.ajax({
                url: rootAjax + '../../../assets/php/model/ajaxDatenbank.php',  // rootAjax + 'assets/php/model/ajaxDatenbank.php'
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
                /////////////////    Ajax Befehl : Nach efolgreichem speichern den aktuellen Servertand neu laden und detailansicht neu aufbauen
                //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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
                    url: rootAjax + '../../../assets/php/model/ajaxDatenbank.php',  // rootAjax + 'assets/php/model/ajaxDatenbank.php'
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

                    // Aktuell Administratordaten aus dem Local Storage kontrollieren auf den Zustand
                    // Ausgabe der Daten nur, sofern ein Benutzer angemeldet ist
                    if (localStorage.getItem("adminLoginUserAktiv") !== undefined && localStorage.getItem("adminLoginUserAktiv") !== "" &&
                        localStorage.getItem("adminLoginUserAktiv") !== null) {

                        // Abfüllen der aktuellen Daten in die Detailansicht
                        // id aktuell
                        $(".adminTicketDetails__aktuell.adminTicketDetails__id").html(adminTicketAlle[ServerDatenIndex].id);
                        // bild 01 aktuell
                        $(".adminTicketDetails__aktuell.adminTicketDetails__bild").html(adminTicketAlle[ServerDatenIndex].bild);
                        // Titel aktuell
                        $(".adminTicketDetails__aktuell.adminTicketDetails__titel").html(adminTicketAlle[ServerDatenIndex].title);
                        // Beschreibung aktuell
                        $(".adminTicketDetails__aktuell.adminTicketDetails__beschreibung").html(adminTicketAlle[ServerDatenIndex].beschreibung);
                        // Datum aktuell
                        $(".adminTicketDetails__aktuell.adminTicketDetails__datum").html(adminTicketAlle[ServerDatenIndex].eventDatum) ;
                        // Zeit aktuell
                        $(".adminTicketDetails__aktuell.adminTicketDetails__zeit").html(adminTicketAlle[ServerDatenIndex].eventZeit);
                        // Event Ort aktuell
                        $(".adminTicketDetails__aktuell.adminTicketDetails__ort").html(adminTicketAlle[ServerDatenIndex].eventOrt);
                        // Event Adresse aktuell
                        $(".adminTicketDetails__aktuell.adminTicketDetails__adresse").html(adminTicketAlle[ServerDatenIndex].eventAdresse);
                        // ticketpreis aktuell
                        $(".adminTicketDetails__aktuell.adminTicketDetails__ticketpreis").html(adminTicketAlle[ServerDatenIndex].ticketPreis);
                        // maximaleAnzahlTickets aktuell
                        $(".adminTicketDetails__aktuell.adminTicketDetails__maximaleAnzahlTickets").html(adminTicketAlle[ServerDatenIndex].maximaleAnzahlTickets);
                        // verkaufteAnzahlTickets aktuell
                        $(".adminTicketDetails__aktuell.adminTicketDetails__verkaufteAnzahlTickets").html(adminTicketAlle[ServerDatenIndex].verkaufteAnzahlTickets);
                        // startDatumTicketVerkauf aktuell
                        $(".adminTicketDetails__aktuell.adminTicketDetails__startDatumTicketVerkauf").html(adminTicketAlle[ServerDatenIndex].startDatumTicketVerkauf);
                        // endDatumTicketVerkauf aktuell
                        $(".adminTicketDetails__aktuell.adminTicketDetails__endDatumTicketVerkauf").html(adminTicketAlle[ServerDatenIndex].endDatumTicketVerkauf);
                        // maxTicketsProKauf aktuell
                        $(".adminTicketDetails__aktuell.adminTicketDetails__maxTicketsProKauf").html(adminTicketAlle[ServerDatenIndex].maxTicketsProKauf);
                        // createTime aktuell
                        $(".adminTicketDetails__aktuell.adminTicketDetails__createTime").html(adminTicketAlle[ServerDatenIndex].createTime);
                        // updateTime aktuell
                        $(".adminTicketDetails__aktuell.adminTicketDetails__updateTime").html(adminTicketAlle[ServerDatenIndex].updateTime);
                        // Administrator letztes update aktuell
                        $(".adminTicketDetails__aktuell.adminTicketDetails__administrator").html(adminTicketAlle[ServerDatenIndex].administratoren_id);

                        // Mitteilung dasss änerungen gespeichert wurden
                        alert("Änderungen wurden gespeichert");
                    }
                    // Meldung anmelden
                    else {
                        alert("Es ist ein unerwarteter Fehler aufgetreten, Bitte LAden Sie Seite erneut");
                    }

                }).fail(function (error) {
                    console.log( error );
                });

            }).fail(function (error) {
                console.log( error );
            });
        }
    });

});






//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////
/////////////////     adminTicketList         Events
/////////////////                           Koplett neuen Eintrag erstellen (Benutzerlevel 1 erforderlich)
/////////////////                           Eingaben erfassen und zwischenspeichern
/////////////////                           Alles auf Datenbank speichern
/////////////////
/////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Neuen Eintrag erstellen - starten der Eingabemaske für die Daten
$("body").on('click', '.adminTicketListErstellen__neu', function () {

    // Aktuelle Benutzerdaten lesen
    // Die Daten aus dem Local Storage sind JSON, da nur Strings und keine Objekte gespeihert werden können
    // adminLoginUserAktiv = JSON.parse(localStorage.getItem("adminLoginUserAktiv"));

    if (localStorage.getItem("adminLoginUserAktiv") !== undefined && localStorage.getItem("adminLoginUserAktiv") !== "" &&
        localStorage.getItem("adminLoginUserAktiv") !== null) {

        // Neuen Eintrag kann nur mit Benutzerberechtigung LEvel 1 erstellt werden
        if ( adminLoginUserAktiv[0]["zugriffsberechtigung"] === 1 ) {

            // Alle Daten löschen
            $(".adminTicketList").html('');

            // Anzeige der Eingabemaske einblenden
            $(".adminTicketListErstellen").css("display", "block");

            // Anzeige des Buttons Zurueck einblenden
            $(".adminTicketListErstellen__zurueck").css("display", "inline-block");

        }
        // Keine Berechtigung
        else {
            alert ("Keine Berechtigung");
        }
    }
    // Kein USer eingeloggt
    else {
        alert ("Sie müssen sich zuerst einloggen");
    }

});









// Neuen Eintrag erstellen - Daten auf Datenbank abspeichern
$("body").on('click', '.adminTicketListErstellen__speichern', function (e) {

    // Seite darf nicht neu geladen werden ansonsten gehen die Benutzereingaben verlohren
    e.preventDefault();

    // Aktuelle Benutzerdaten lesen
    // Die Daten aus dem Local Storage sind JSON, da nur Strings und keine Objekte gespeihert werden können
    adminLoginUserAktiv = JSON.parse(localStorage.getItem("adminLoginUserAktiv"));

    // Neuen Eintrag kann nur mit Benutzerberechtigung LEvel 1 erstellt werden
    if ( adminLoginUserAktiv[0]["zugriffsberechtigung"] === 1 ) {


        // Die beiden Variablen eventDatum und eventZeit müsssen vorgängig aus mehreren Eingabefelder zusammengesetzt werden
        eventDatumHilfsvariable =   $(".adminTicketListErstellen__neu.adminTicketListErstellen__datum").eq(0).val() + '.' + $(".adminTicketListErstellen__neu.adminTicketListErstellen__datum").eq(1).val() +
            '.' + $(".adminTicketListErstellen__neu.adminTicketListErstellen__datum").eq(2).val();

        zeitHilfsvariable =         $(".adminTicketListErstellen__neu.adminTicketListErstellen__zeit").eq(0).val() + ':' + $(".adminTicketListErstellen__neu.adminTicketListErstellen__zeit").eq(1).val() + ':00';


        startTicketVerkaufDatumHilfsvariable  = $(".adminTicketListErstellen__neu.adminTicketListErstellen__startDatumTicketVerkauf").eq(0).val() + '.' +
            $(".adminTicketListErstellen__neu.adminTicketListErstellen__startDatumTicketVerkauf").eq(1).val() +
            '.' + $(".adminTicketListErstellen__neu.adminTicketListErstellen__startDatumTicketVerkauf").eq(2).val();

        endeTicketVerkaufDatumHilfsvariable   = $(".adminTicketListErstellen__neu.adminTicketListErstellen__endDatumTicketVerkauf").eq(0).val() + '.' +
            $(".adminTicketListErstellen__neu.adminTicketListErstellen__endDatumTicketVerkauf").eq(1).val() +
            '.' + $(".adminTicketListErstellen__neu.adminTicketListErstellen__endDatumTicketVerkauf").eq(2).val();



        // Element auf Datenbank abspeichern
        // Danach alle Alle Ticket Einträge aus der Datenbank laden

        // Auf diese Weise wird dem PHP Server die Aufgabe mitgeteilt
        var dataToSend = {
            tabelle         : "ticketarten",
            funktion        : "schreiben",
            parameter       : "",
            spaltenName     : "",
            spaltenWert     : "",
            idZeile         : -1 ,
            updateSpalte    : [],
            updateWert      : [],
            datensatz       : [ $(".adminTicketListErstellen__neu.adminTicketListErstellen__bild").val(), $(".adminTicketListErstellen__neu.adminTicketListErstellen__titel").val(), $(".adminTicketListErstellen__neu.adminTicketListErstellen__beschreibung").val(),
                eventDatumHilfsvariable, zeitHilfsvariable, $(".adminTicketListErstellen__neu.adminTicketListErstellen__ort").val(), $(".adminTicketListErstellen__neu.adminTicketListErstellen__adresse").val(),
                parseInt($(".adminTicketListErstellen__neu.adminTicketListErstellen__ticketPreis").val() ), parseInt($(".adminTicketListErstellen__neu.adminTicketListErstellen__maximaleAnzahlTickets").val() ),
                0, startTicketVerkaufDatumHilfsvariable, endeTicketVerkaufDatumHilfsvariable, adminLoginUserAktiv[0]["id"], parseInt($(".adminTicketListErstellen__neu.adminTicketListErstellen__maxTicketsProKauf").val() ),
                parseInt($(".adminTicketListErstellen__neu.adminTicketListErstellen__verkaufteAnzahlTickets").val() ) ]
        };


        // Start ajay abfrage
        $.ajax({
            url: rootAjax + '../../../assets/php/model/ajaxDatenbank.php',  // rootAjax + 'assets/php/model/ajaxDatenbank.php'
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

            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            /////////////////    Ajax Befehl : Nach efolgreichem Speichern den aktuellen Serverstand neu laden und Ticketliste neu abspeichern
            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

            // Wird vom Server der string "true" zurückgegeben, so ist der Befehl erfolgreich verlaufen
            if ( data === "true") {
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
                    url: rootAjax + '../../../assets/php/model/ajaxDatenbank.php',  // rootAjax + 'assets/php/model/ajaxDatenbank.php'
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
                    // Speichern der Ticketdaten in Local Storage
                    localStorage.setItem("adminTicketAlle", JSON.stringify(data));

                    // Maske schliessen nach speichern
                    $(".adminTicketListErstellen").css("display", "none");

                }).fail(function () {
                    console.log("Error!");
                });
            }
            // Fehler beim Server
            else {
                console.log(data);
                alert(data);
            }

        }).fail(function(){
            console.log("Error!");
        });


    }
    // Keine Berechtigung
    else {
        alert ("Keine Berechtigung");
    }
});




// Neuen Eintrag erstellen - Eingabemaske verlassen
$("body").on('click', '.adminTicketListErstellen__zurueck', function () {

    // Anzeige der Detailansicht verbergen
    $(".adminTicketListErstellen").css("display", "none");

    // Anzeige des Buttons Zurueck verbergen
    $(".adminTicketListErstellen__zurueck").css("display", "none");


    // Sofern die Listenansicht noch nicht eingeblendet ist, wieder einblenden
    if ($(".adminTicketList").css("display") !== "block" || $(".adminTicketList").html() === '') {

        $(".adminTicketList").css("display", "block");

        // Aktuelle Benutzerdaten lesen
        // Die Daten aus dem Local Storage sind JSON, da nur Strings und keine Objekte gespeihert werden können
        adminLoginUserAktiv = JSON.parse(localStorage.getItem("adminLoginUserAktiv"));

        // Aktuelle Ticketdaten lesen
        // Die Daten aus dem Local Storage sind JSON, da nur Strings und keine Objekte gespeihert werden können
        adminTicketAlle = JSON.parse(localStorage.getItem("adminTicketAlle"));

        // Ausgabe der Liste Ticketdaten mit aktuellen Benuzerrechten
        adminTicketList( $(".adminTicketList"), adminLoginUserAktiv[0]["zugriffsberechtigung"], adminTicketAlle);
    }


});






//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////     Funktionsdefinitionen
/////////////////
/////////////////
/////////////////
/////////////////
/////////////////
/////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



// Erzeugen einer Listenansicht mit allen Tickets welche in der Datenbank gespeichert sind
// Es wird der Titel angezeigt, sowie ein Button löschen und ein button detail
// Mit der Variablen integer_adminLevel wird
function adminTicketList(htmlKlasse, integer_adminLevel, arrayOfObject_serverDaten) {

    // DOM Selektoren
    var containerClassName = htmlKlasse.attr('class');

    // Table Element erzeugen und im Dom an Parent Element anbinden
    var table = $("<table></table>").appendTo(htmlKlasse);
    table.attr('class', containerClassName + '__table');


    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////     Table Header aufbauen
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // Table Header erzeugen
    var tableHeader = $("<tr></tr>").appendTo(table);
    tableHeader.attr('class', containerClassName + '__table__header');

    // Table Header -   Spalte titel   -   erzeugen
    var tableHeaderTitel = $("<th>Titel</th>").appendTo(tableHeader);
    tableHeaderTitel.attr('class', containerClassName + '__table__header__titel');

    // Table Header -   Spalte Detail   -   erzeugen
    var tableHeaderDetail = $("<th></th>").appendTo(tableHeader);
    tableHeaderDetail.attr('class', containerClassName + '__table__header__detail');

    // Table Header -   Spalte Löschen   -   erzeugen
    var tableHeaderLoeschen = $("<th></th>").appendTo(tableHeader);
    tableHeaderLoeschen.attr('class', containerClassName + '__table__header__loeschen');


    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////     Liste aufbauen
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // Liste aufbauen
    for (var i=0; i < arrayOfObject_serverDaten.length; i++) {
        // Table Neue Zeile erzeugen
        var tableZeile = $("<tr></tr>").appendTo(table);
        tableZeile.attr('class', containerClassName + '__table__zeile-' +i);

        // Table spalte Titel erzeugen
        var tableTitel = $("<td></td>").appendTo(tableZeile);
        tableTitel.attr('class', containerClassName + '__table__zeile__titel-' +i);
        tableTitel.html( arrayOfObject_serverDaten[i].title);


        // Table spalte Detail erzeugen
        var tableDetail = $("<td></td>").appendTo(tableZeile);
        tableDetail.attr('class', containerClassName + '__table__zeile__detail-' +i);
        // Button nur bei Zugrifflevel korrekt anzeigen
        if ( integer_adminLevel === 1 || integer_adminLevel === 2) {
            // Table spalte Detail   -  Button   -   erzeugen
            var tableDetailButton = $("<button>Details</button>").appendTo(tableDetail);
            tableDetailButton.attr('class', containerClassName + '__table__zeile__detail__button');
        }
        // Table spalte Löschen erzeugen
        var tableLoeschen = $("<td></td>").appendTo(tableZeile);
        tableLoeschen.attr('class', containerClassName + '__table__zeile__loeschen-' +i);
        // Button nur bei Zugrifflevel korrekt anzeigen
        if ( integer_adminLevel === 1 || integer_adminLevel === 2) {
            // Table spalte Löschen   -  Button   -   erzeugen
            var tableLoeschenButton = $("<button>Löschen</button>").appendTo(tableLoeschen);
            tableLoeschenButton.attr('class', containerClassName + '__table__zeile__loeschen__button');
        }
    }
}



