
/*
 Mit dieser Seite werden Funktionen zum Anzeigen und Verändern der Banddaten für die Administratoren erledigt.
    1. Neue Band erstellen: (Daten in Datenbank speichern)
    2. Banddaten anpasssen: (Veränderungen auf Datenbank speichern)
    3. Band löschen
    4. Auflisten aller auf der Datenbank vorhandenen Bands


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
 2.  Serverdaten zu beginn des Seitemloads von allen Banddaten auf dem Server
 3.  Die zuletz gelesenen Serverdaten    :    "ajaxDaten"
 4.  Die id des zuletzt geladenen Detail Beitrages : "adminBandDetailAktuelleID"

 */

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////
/////////////////     INITIALISIERUNGEN         Zuerst wird direkt die Bandliste mit allen Einträgen aus der Datenbank angezeigt
/////////////////                               Die Liste kann angeschaut , aber nicht verändert oder gelöscht werden
/////////////////                               Zum Löschen oder Verändern ist ein Administrator Level 1 nötig
/////////////////
/////////////////                               Ist gar kein USer angemeldet, so ist gar nichts angezeigt
/////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// Variable mit Serverdaten. Diese wird immer neu mit dem Inhalt aus dem Local Storage beschrieben
var ajaxDatenSenden = "";
var ajaxDatenAntwort = "";
// In dieser Variablen werden auf dem Client die zuletzt geladenen Banddaten vom Server gespeichert, damit nicht immer neu geladen werden muss
var adminBandAlle = "";
// In dieser Variablen wird der zuletzt verwendete Index von Client Array mit den BAnd DAten gespeichert. Dies ist notwendig, wenn dierser in einem anderen Event nochmals gebraucht wird
// Die id des Elementes aus diesem Index wird in den local Storage geseichert, da bei öndern der DAten die Position ändern kann
var ServerDatenIndex;
// Hilfsvariablen zum zusammensetzen eines Strings aus verschiedenen Eingabefeldern (Zeit und DAtum)
var datumHilfsvariable;
var zeitHilfsvariable;




// Starten der Funktionen darf erst mglich sein, wenn Dokument geladen ist
$(document).ready(function() {

    // BANDDATEN LADEN UND DATN ABFUELLEN
    // Alle Band Einträge aus der Datenbank laden
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

        // Speichern der Banddaten in Local Storage
        localStorage.setItem("adminBandAlle", JSON.stringify(data) );

        // Aktuell Administratordaten aus dem Local Storage kontrollieren auf den Zustand
        // Ausgabe der DAten nur, sofern ein Benutzer angemeldet ist
        if (localStorage.getItem("adminLoginUserAktiv") !== undefined && localStorage.getItem("adminLoginUserAktiv") !== "" &&
            localStorage.getItem("adminLoginUserAktiv") !== null) {

            // Alle Daten löschen
            $(".adminBandList").html('');

            // Ausgabe der Bands als Liste
            adminBandList( $(".adminBandList"), adminLoginUserAktiv[0]["zugriffsberechtigung"], data);

            // Button neuer eintrag anzeigen bei Zugrifslevel 1
            if ( adminLoginUserAktiv[0]["zugriffsberechtigung"] === 1) {
                $(".adminBandListErstellen__neu").css("display", "inline-block");
            }
            else {
                $(".adminBandListErstellen__neu").css("display", "none");
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
/////////////////     Benutzerdaten überwachen         Sollten die Benutzerdaten wechseln
/////////////////
/////////////////
/////////////////
/////////////////
/////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// Starten der Funktionen darf erst mglich sein, wenn Dokument geladen ist
$(document).ready(function() {

    // LOGINDATEN UEBERPRUEFEN UND BANDLIST NEU AUFBAUEN
    // Mit diesem Event "DOMSubtreeModified" werden Veränderungen im Dom Baum erkannt
    // Der Zustand des Logins wird dadurch bei Login Änderug erfasst
    $(".adminLoginMenue__userAktiv").on('DOMSubtreeModified', function () {

        // Aktuell Administratordaten aus dem Local Storage kontrollieren auf den Zustand
        if (localStorage.getItem("adminLoginUserAktiv") !== undefined && localStorage.getItem("adminLoginUserAktiv") !== "" &&
            localStorage.getItem("adminLoginUserAktiv") !== null) {

            // Anzeige Bandliste aktivieren
            $(".adminBandList").css("display", "block");
            $(".adminBandList").html('');

            // Aktuelle Benutzerdaten lesen
            // Die Daten aus dem Local Storage sind JSON, da nur Strings und keine Objekte gespeihert werden können
            adminLoginUserAktiv = JSON.parse(localStorage.getItem("adminLoginUserAktiv"));

            // Button neuer eintrag erstellen anzeigen bei Zugrifslevel 1
            if ( adminLoginUserAktiv[0]["zugriffsberechtigung"] === 1) {
                $(".adminBandListErstellen__neu").css("display", "inline-block");
            }
            else {
                $(".adminBandListErstellen__neu").css("display", "none");
            }

            // Aktuelle Banddaten lesen
            // Die Daten aus dem Local Storage sind JSON, da nur Strings und keine Objekte gespeihert werden können
            adminBandAlle = JSON.parse(localStorage.getItem("adminBandAlle"));

            // Ausgabe der Liste Banddaten mit aktuellen Benuzerrechten
            adminBandList( $(".adminBandList"), adminLoginUserAktiv[0]["zugriffsberechtigung"], adminBandAlle);
        }
        else {
            // elmente sperren bei inaktivem Login
            $(".adminBandList").css("display", "none");
            $(".adminBandDetails").css("display", "none");
        }
    });
});



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////
/////////////////     adminBandList         Events
/////////////////                           Eintrag löschen (Benutzerlevel 1 erforderlich
/////////////////
/////////////////
/////////////////
/////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// Eintrag löschen
// Starten der Funktionen darf erst möglich sein, wenn Dokument geladen ist
$(document).ready(function() {

    // Element löschen
    // Wenn der Button Löschen geklicht wird, so startet eine Serveranfrage um die Daten dort zu löschen. Ist die Aktion erfolgreich, wird zugleich der aktuelle Stand zurückgelesen
    $("body").on('click', '.adminBandList__table__zeile__loeschen__button', function () {

        // Die zu löschende Spalte ermitteln bezogen auf das Array im Client mit den geladenen Serverdaten
        // Speichern der id von der Datenbank
        ServerDatenIndex = $(this).parent().parent().index() - 1;
        localStorage.setItem("adminBandDetailAktuelleID", JSON.stringify(adminBandAlle[ServerDatenIndex].id) );

        // Aktuelle Banddaten lesen
        // Die Daten aus dem Local Storage sind JSON, da nur Strings und keine Objekte gespeichert werden können
        // adminBandAlle = JSON.parse(localStorage.getItem("adminBandAlle"));

        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        /////////////////    Ajax Befehl : Eintrag löschen
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        // Die Loschaktion darf nur mit den Benutzerlevel 1 erfolgen
        if (adminLoginUserAktiv[0]["zugriffsberechtigung"] === 1) {

            // Element löschen auf Datenbank
            // Alle Band Einträge aus der Datenbank laden
            // Auf diese Weise wird dem PHP Server die Aufgabe mitgeteilt
            var dataToSend = {
                tabelle         : "band",
                funktion        : "loeschen",
                parameter       : "suchen",
                spaltenName     : "id",
                spaltenWert     : adminBandAlle[ServerDatenIndex].id,
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
                // Nach erfolgreicher Aktion, den aktuellen Stand von Bands von der Datenbank laden
                // Die Liste neu aufbauen mit den aktuellen Einträgen

                console.log(data);
                //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                /////////////////    Ajax Befehl : NAch efolgreichem löschen den aktuellen Servertand neu laden und Bandliste neu aufbauen
                //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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

                    // Speichern der Banddaten in Local Storage
                    localStorage.setItem("adminBandAlle", JSON.stringify(data) );

                    // Aktuell Administratordaten aus dem Local Storage kontrollieren auf den Zustand
                    // Ausgabe der DAten nur, sofern ein Benutzer angemeldet ist
                    if (localStorage.getItem("adminLoginUserAktiv") !== undefined && localStorage.getItem("adminLoginUserAktiv") !== "" &&
                        localStorage.getItem("adminLoginUserAktiv") !== null) {

                        // Zuerst alles löschen
                        $(".adminBandList").html('');

                        // Ausgabe der Bands als Liste
                        adminBandList( $(".adminBandList"), adminLoginUserAktiv[0]["zugriffsberechtigung"], data);
                    }
                    // Meldung anmelden
                    else {
                        alert("Es ist ein unerwarteter Fehler aufgetreten, Bitte laden Sie die Seite erneut");
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
/////////////////     adminBandList         Events
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
    $(".adminBandDetails__zurueck").on('click', function () {

        // Alle Daten löschen
        $(".adminBandList").html('');

        // Anzeige der Detailansicht verbergen
        $(".adminBandDetails").css("display", "none");

        // Sofern die Listenansicht noch nicht eingeblendet ist, wieder einblenden
        if ($(".adminBandList").css("display") !== "block" || $(".adminBandList").html() === '') {

            $(".adminBandList").css("display", "block");

            // Aktuelle Benutzerdaten lesen
            // Die Daten aus dem Local Storage sind JSON, da nur Strings und keine Objekte gespeichert werden können
            adminLoginUserAktiv = JSON.parse(localStorage.getItem("adminLoginUserAktiv"));

            // Aktuelle Banddaten lesen
            // Die Daten aus dem Local Storage sind JSON, da nur Strings und keine Objekte gespeichert werden können
            adminBandAlle = JSON.parse(localStorage.getItem("adminBandAlle"));

            // Ausgabe der Liste Banddaten mit aktuellen Benuzerrechten
            adminBandList( $(".adminBandList"), adminLoginUserAktiv[0]["zugriffsberechtigung"], adminBandAlle);
        }

    });


    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////     Detailansicht starten
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // Wenn der Button details geklicht wird, so startet eine Serveranfrage um die Daten dort zu löschen. Ist die aktion erfolgreich, wird zugleich der aktuele Stad zurückgelesen
    $("body").on('click', '.adminBandList__table__zeile__detail__button', function () {

        // Aktuelle Benutzerdaten lesen
        // Die Daten aus dem Local Storage sind JSON, da nur Strings und keine Objekte gespeichert werden können
        adminLoginUserAktiv = JSON.parse(localStorage.getItem("adminLoginUserAktiv"));

        // Die zu anzeigende Detailansicht  ermitteln
        ServerDatenIndex = $(this).parent().parent().index() - 1;


        // Aktuelle Banddaten lesen
        // Die Daten aus dem Local Storage sind JSON, da nur Strings und keine Objekte gespeihert werden können
        adminBandAlle = JSON.parse(localStorage.getItem("adminBandAlle"));

        // Aktuelle Daten in Detailansicht einblenden
        if (adminLoginUserAktiv[0]["zugriffsberechtigung"] === 2 || adminLoginUserAktiv[0]["zugriffsberechtigung"] === 1) {

            // Listenansicht verbergen
            $(".adminBandList").css("display", "none");

            // Anzeige der Detailansicht
            $(".adminBandDetails").css("display", "block");

            // Abfüllen der aktuellen Daten in die Detailansicht
            // id aktuell
            $(".adminBandDetails__aktuell.adminBandDetails__id").html(adminBandAlle[ServerDatenIndex].id);
            // bild 01 aktuell
            $(".adminBandDetails__aktuell.adminBandDetails__bild01").html(adminBandAlle[ServerDatenIndex].bild_1);
            // bild 02 aktuell
            $(".adminBandDetails__aktuell.adminBandDetails__bild02").html(adminBandAlle[ServerDatenIndex].bild_2);
            // bild 03 aktuell
            $(".adminBandDetails__aktuell.adminBandDetails__bild03").html(adminBandAlle[ServerDatenIndex].bild_3);
            // Titel aktuell
            $(".adminBandDetails__aktuell.adminBandDetails__titel").html(adminBandAlle[ServerDatenIndex].title);
            // Beschreibung aktuell
            $(".adminBandDetails__aktuell.adminBandDetails__beschreibung").html(adminBandAlle[ServerDatenIndex].beschreibung);
            // Datum aktuell
            $(".adminBandDetails__aktuell.adminBandDetails__datum").html(adminBandAlle[ServerDatenIndex].eventDatum) ;
            // Zeit aktuell
            $(".adminBandDetails__aktuell.adminBandDetails__zeit").html(adminBandAlle[ServerDatenIndex].eventZeit);
            // Event Ort aktuell
            $(".adminBandDetails__aktuell.adminBandDetails__ort").html(adminBandAlle[ServerDatenIndex].eventOrt);
            // Event Tag aktuell
            $(".adminBandDetails__aktuell.adminBandDetails__tag").html(adminBandAlle[ServerDatenIndex].eventTag);
            // Link Facebook aktuell
            $(".adminBandDetails__aktuell.adminBandDetails__linkFacebook").html(adminBandAlle[ServerDatenIndex].linkFacebook);
            // Link Youtoube aktuell
            $(".adminBandDetails__aktuell.adminBandDetails__linkYoutoube").html(adminBandAlle[ServerDatenIndex].linkYoutoube);
            // Link Instagramm aktuell
            $(".adminBandDetails__aktuell.adminBandDetails__linkInstagramm").html(adminBandAlle[ServerDatenIndex].linkInstagramm);
            // Link Twitter aktuell
            $(".adminBandDetails__aktuell.adminBandDetails__linkTwitter").html(adminBandAlle[ServerDatenIndex].linkTwitter);
            // createTime aktuell
            $(".adminBandDetails__aktuell.adminBandDetails__createTime").html(adminBandAlle[ServerDatenIndex].createTime);
            // updateTime aktuell
            $(".adminBandDetails__aktuell.adminBandDetails__updateTime").html(adminBandAlle[ServerDatenIndex].updateTime);
            // Administrator letztes update aktuell
            $(".adminBandDetails__aktuell.adminBandDetails__administrator").html(adminBandAlle[ServerDatenIndex].administratoren_id);

            // Ist kein Admin mit LEvel 1 aktiv, so werden die eingabefelder audgeblendet
            if (adminLoginUserAktiv[0]["zugriffsberechtigung"] !== 1) {

                // Listenansicht verbergen
                $(".adminBandDetails__neu").css("display", "none");
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

    // Änderungen in Detailansicht abspeichern auf Datenbank
    // Wenn der Button details geklicht wird, so startet eine Serverabfrage zum updaten der Daten
    $("body").on('click', '.adminBandDetails__speichern', function () {

        // Aktuelle Benutzerdaten lesen
        // Die Daten aus dem Local Storage sind JSON, da nur Strings und keine Objekte gespeihert werden können
        adminLoginUserAktiv = JSON.parse(localStorage.getItem("adminLoginUserAktiv"));

        // Aktuelle Banddaten lesen
        // Die Daten aus dem Local Storage sind JSON, da nur Strings und keine Objekte gespeihert werden können
        adminBandAlle = JSON.parse(localStorage.getItem("adminBandAlle"));

        // Den Index vom Client Array wieder ausfindig machen durch suchen der ServerDatenbank id des zulet abgespeicherten elementes
        // Letzte gespeicherte ID aus local Storage laden
        var ServerDatenIndexHilfsvariable = localStorage.getItem("adminBandDetailAktuelleID");

        // CLient Array nach der id durchsuchen und Array Position als Index abspeichern
        for (var i=0; i < adminBandAlle.length; i++) {

            if ( ServerDatenIndexHilfsvariable === adminBandAlle[i]["id"]) {
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
            if ( $(".adminBandDetails__neu.adminBandDetails__bild01").val() !== '') {
                adminBandAlle[ServerDatenIndex].bild_1 = $(".adminBandDetails__neu.adminBandDetails__bild01").val();
            }
            // Bild 2 Neu
            if ( $(".adminBandDetails__neu.adminBandDetails__bild02").val() !== '') {
                adminBandAlle[ServerDatenIndex].bild_2 = $(".adminBandDetails__neu.adminBandDetails__bild02").val();
            }
            // Bild 3 Neu
            if ( $(".adminBandDetails__neu__bild03").val() !== '') {
                adminBandAlle[ServerDatenIndex].bild_3 = $(".adminBandDetails__neu.adminBandDetails__bild03").val();
            }
            // Titel Neu
            if ( $(".adminBandDetails__neu.adminBandDetails__titel").val() !== '') {
                adminBandAlle[ServerDatenIndex].title = $(".adminBandDetails__neu.adminBandDetails__titel").val();
            }
            // Beschreibung Neu
            if ( $(".adminBandDetails__neu.adminBandDetails__beschreibung").val() !== '') {
                adminBandAlle[ServerDatenIndex].beschreibung = $(".adminBandDetails__neu.adminBandDetails__beschreibung").val();
            }
            // eventDatum Neu
            if ( $(".adminBandDetails__neu.adminBandDetails__datum").val() !== '') {
                // Datum aus den drei Einzelfelder zu einem String zusammen setzen mit Trennzeichen Punkt
                adminBandAlle[ServerDatenIndex].eventDatum =  $(".adminBandDetails__neu.adminBandDetails__datum").eq(0).val() + '.' + $(".adminBandDetails__neu.adminBandDetails__datum").eq(1).val() + '.' +$(".adminBandDetails__neu.adminBandDetails__datum").eq(2).val();
            }
            // eventZeit Neu
            if ( $(".adminBandDetails__neu.adminBandDetails__zeit").val() !== '') {
                adminBandAlle[ServerDatenIndex].eventZeit = $(".adminBandDetails__neu.adminBandDetails__zeit").eq(0).val() + ':' + $(".adminBandDetails__neu.adminBandDetails__zeit").eq(1).val() + ':00';
            }
            // eventOrt Neu
            if ( $(".adminBandDetails__neu.adminBandDetails__ort").val() !== '') {
                adminBandAlle[ServerDatenIndex].eventOrt = $(".adminBandDetails__neu.adminBandDetails__ort").val();
            }
            // eventTag Neu
            if ( $(".adminBandDetails__neu.adminBandDetails__tag").val() !== '') {
                adminBandAlle[ServerDatenIndex].eventTag = $(".adminBandDetails__neu.adminBandDetails__tag").val();
            }
            // linkFacebook Neu
            if ( $(".adminBandDetails__neu.adminBandDetails__linkFacebook").val() !== '') {
                adminBandAlle[ServerDatenIndex].linkFacebook = $(".adminBandDetails__neu.adminBandDetails__linkFacebook").val();
            }
            // linkYoutoube Neu
            if ( $(".adminBandDetails__neu.adminBandDetails__linkYoutoube").val() !== '') {
                adminBandAlle[ServerDatenIndex].linkYoutoube = $(".adminBandDetails__neu.adminBandDetails__linkYoutoube").val();
            }
            // linkInstagramm Neu
            if ( $(".adminBandDetails__neu.adminBandDetails__linkInstagramm").val() !== '') {
                adminBandAlle[ServerDatenIndex].linkInstagramm = $(".adminBandDetails__neu.adminBandDetails__linkInstagramm").val();
            }
            // linkTwitter Neu
            if ( $(".adminBandDetails__neu.adminBandDetails__linkTwitter").val() !== '') {
                adminBandAlle[ServerDatenIndex].linkTwitter = $(".adminBandDetails__neu.adminBandDetails__linkTwitter").val();
            }

        }

        // Element löschen auf Datenbank
        // Alle Band Einträge aus der Datenbank laden

        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        /////////////////    Ajax Befehl : Neue Daten auf Server speichern
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        // Die Loschaktion darf nur mit den Benutzerlevel 1 erfolgen
        if (adminLoginUserAktiv[0]["zugriffsberechtigung"] === 1) {

            // Auf diese Weise wird dem PHP Server die Aufgabe mitgeteilt
            var dataToSend = {
                tabelle: "band",
                funktion: "update",
                parameter: "suchen",
                spaltenName: "id",
                spaltenWert: adminBandAlle[ServerDatenIndex].id,
                idZeile: -1,
                updateSpalte: ['beschreibung', 'eventZeit', 'eventDatum', 'eventTag', 'eventOrt', 'title', 'bild_1', 'bild_2', 'bild_3', 'linkFacebook', 'linkYoutoube', 'linkInstagramm', 'linkTwitter', 'administratoren_id'],
                updateWert: [adminBandAlle[ServerDatenIndex].beschreibung, adminBandAlle[ServerDatenIndex].eventZeit, adminBandAlle[ServerDatenIndex].eventDatum, adminBandAlle[ServerDatenIndex].eventTag,
                            adminBandAlle[ServerDatenIndex].eventOrt, adminBandAlle[ServerDatenIndex].title, adminBandAlle[ServerDatenIndex].bild_1, adminBandAlle[ServerDatenIndex].bild_2, adminBandAlle[ServerDatenIndex].bild_3,
                            adminBandAlle[ServerDatenIndex].linkFacebook, adminBandAlle[ServerDatenIndex].linkYoutoube, adminBandAlle[ServerDatenIndex].linkInstagramm, adminBandAlle[ServerDatenIndex].linkTwitter, adminLoginUserAktiv[0]["id"]]
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

            }).done(function () {

                //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                /////////////////    Ajax Befehl : Nach efolgreichem speichern den aktuellen Servertand neu laden und detailansicht neu aufbauen
                //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

                // Nach erfolgreicher Aktion, den aktuellen Stand von Bands von der Datenbank laden
                // Die Liste neu aufbauen mit den aktuellen Einträgen
                // Auf diese Weise wird dem PHP Server die Aufgabe mitgeteilt
                var dataToSend = {
                    tabelle: "band",
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

                    // Speichern der Banddaten in Local Storage
                    localStorage.setItem("adminBandAlle", JSON.stringify(data));

                    // Aktuell Administratordaten aus dem Local Storage kontrollieren auf den Zustand
                    // Ausgabe der DAten nur, sofern ein Benutzer angemeldet ist
                    if (localStorage.getItem("adminLoginUserAktiv") !== undefined && localStorage.getItem("adminLoginUserAktiv") !== "" &&
                        localStorage.getItem("adminLoginUserAktiv") !== null) {

                        // Abfüllen der aktuellen Daten in die Detailansicht
                        // id aktuell
                        $(".adminBandDetails__aktuell.adminBandDetails__id").html(adminBandAlle[ServerDatenIndex].id);
                        // bild 01 aktuell
                        $(".adminBandDetails__aktuell.adminBandDetails__bild01").html(adminBandAlle[ServerDatenIndex].bild_1);
                        // bild 02 aktuell
                        $(".adminBandDetails__aktuell.adminBandDetails__bild02").html(adminBandAlle[ServerDatenIndex].bild_2);
                        // bild 03 aktuell
                        $(".adminBandDetails__aktuell.adminBandDetails__bild03").html(adminBandAlle[ServerDatenIndex].bild_3);
                        // Titel aktuell
                        $(".adminBandDetails__aktuell.adminBandDetails__titel").html(adminBandAlle[ServerDatenIndex].title);
                        // Beschreibung aktuell
                        $(".adminBandDetails__aktuell.adminBandDetails__beschreibung").html(adminBandAlle[ServerDatenIndex].beschreibung);
                        // Datum aktuell
                        $(".adminBandDetails__aktuell.adminBandDetails__datum").html(adminBandAlle[ServerDatenIndex].eventDatum);
                        // Zeit aktuell
                        $(".adminBandDetails__aktuell.adminBandDetails__zeit").html(adminBandAlle[ServerDatenIndex].eventZeit);
                        // Event Ort aktuell
                        $(".adminBandDetails__aktuell.adminBandDetails__ort").html(adminBandAlle[ServerDatenIndex].eventOrt);
                        // Event Tag aktuell
                        $(".adminBandDetails__aktuell.adminBandDetails__tag").html(adminBandAlle[ServerDatenIndex].eventTag);
                        // Link Facebook aktuell
                        $(".adminBandDetails__aktuell.adminBandDetails__linkFacebook").html(adminBandAlle[ServerDatenIndex].linkFacebook);
                        // Link Youtoube aktuell
                        $(".adminBandDetails__aktuell.adminBandDetails__linkYoutoube").html(adminBandAlle[ServerDatenIndex].linkYoutoube);
                        // Link Instagramm aktuell
                        $(".adminBandDetails__aktuell.adminBandDetails__linkInstagramm").html(adminBandAlle[ServerDatenIndex].linkInstagramm);
                        // Link Twitter aktuell
                        $(".adminBandDetails__aktuell.adminBandDetails__linkTwitter").html(adminBandAlle[ServerDatenIndex].linkTwitter);
                        // createTime aktuell
                        $(".adminBandDetails__aktuell.adminBandDetails__createTime").html(adminBandAlle[ServerDatenIndex].createTime);
                        // updateTime aktuell
                        $(".adminBandDetails__aktuell.adminBandDetails__updateTime").html(adminBandAlle[ServerDatenIndex].updateTime);
                        // Administrator letztes update aktuell
                        $(".adminBandDetails__aktuell.adminBandDetails__administrator").html(adminBandAlle[ServerDatenIndex].administratoren_id);

                        // Mitteilung dasss änerungen gespeichert wurden
                        alert("Änderungen wurden gespeichert");
                    }
                    // Meldung anmelden
                    else {
                        alert("Es ist ein unerwarteter Fehler aufgetreten, Bitte Laden Sie die Seite erneut");
                    }

                }).fail(function () {
                    console.log("Error!");
                });

            }).fail(function () {
                console.log("Error!");
            });
        }
    });

});






//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////
/////////////////     adminBandList         Events
/////////////////                           Koplett neuen Eintrag erstellen (Benutzerlevel 1 erforderlich)
/////////////////                           Eingaben erfassen und zwischenspeichern
/////////////////                           Alles auf Datenbank speichern
/////////////////
/////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Neuen Eintrag erstellen - starten der Eingabemaske für die Daten
$("body").on('click', '.adminBandListErstellen__neu', function () {

    // Aktuelle Benutzerdaten lesen
    // Die Daten aus dem Local Storage sind JSON, da nur Strings und keine Objekte gespeichert werden können
    // adminLoginUserAktiv = JSON.parse(localStorage.getItem("adminLoginUserAktiv"));

    // Neuen Eintrag kann nur mit Benutzerberechtigung LEvel 1 erstellt werden
    if ( adminLoginUserAktiv[0]["zugriffsberechtigung"] === 1 ) {

        // Alle Daten löschen
        $(".adminBandList").html('');

        // Anzeige der Eingabemaske einblenden
        $(".adminBandListErstellen").css("display", "block");

        // Anzeige des Buttons Zurueck einblenden
        $(".adminBandListErstellen__zurueck").css("display", "inline-block");

    }
    // Keine Berechtigung
    else {
        alert ("Keine Berechtigung");
    }
});





// Neuen Eintrag erstellen - Daten auf Datenbank abspeichern
$("body").on('click', '.adminBandListErstellen__speichern', function (e) {

    // Seite darf nicht neu geladen werden ansonsten gehen die Benutzereingaben verlohren
    e.preventDefault();

    // Aktuelle Benutzerdaten lesen
    // Die Daten aus dem Local Storage sind JSON, da nur Strings und keine Objekte gespeihert werden können
    adminLoginUserAktiv = JSON.parse(localStorage.getItem("adminLoginUserAktiv"));

    // Neuen Eintrag kann nur mit Benutzerberechtigung Level 1 erstellt werden
    if ( adminLoginUserAktiv[0]["zugriffsberechtigung"] === 1 ) {


        // Die beiden Variablen eventDatum und eventZeit müsssen vorgängig aus mehreren Eingabefelder zusammengesetzt werden
        datumHilfsvariable =    $(".adminBandListErstellen__neu.adminBandListErstellen__datum").eq(0).val() + '.' + $(".adminBandListErstellen__neu.adminBandListErstellen__datum").eq(1).val() +
            '.' + $(".adminBandListErstellen__neu.adminBandListErstellen__datum").eq(2).val();
        zeitHilfsvariable =    $(".adminBandListErstellen__neu.adminBandListErstellen__zeit").eq(0).val() + ':' + $(".adminBandListErstellen__neu.adminBandListErstellen__zeit").eq(1).val() + ':00';


        // Element auf Datenbank abspeichern
        // Danach alle Band Einträge aus der Datenbank laden

        // Auf diese Weise wird dem PHP Server die Aufgabe mitgeteilt
        var dataToSend = {
            tabelle         : "band",
            funktion        : "schreiben",
            parameter       : "",
            spaltenName     : "",
            spaltenWert     : "",
            idZeile         : -1 ,
            updateSpalte    : [],
            updateWert      : [],
            datensatz       : [ adminLoginUserAktiv[0]["id"], $(".adminBandListErstellen__neu.adminBandListErstellen__beschreibung").val(), datumHilfsvariable, $(".adminBandListErstellen__neu.adminBandListErstellen__tag").val(),
                            $(".adminBandListErstellen__neu.adminBandListErstellen__ort").val(), zeitHilfsvariable, $(".adminBandListErstellen__neu.adminBandListErstellen__titel").val(), $(".adminBandListErstellen__neu.adminBandListErstellen__bild01").val(),
                            $(".adminBandListErstellen__neu.adminBandListErstellen__bild02").val(), $(".adminBandListErstellen__neu.adminBandListErstellen__bild03").val(), $(".adminBandListErstellen__neu.adminBandListErstellen__linkFacebook").val(),
                            $(".adminBandListErstellen__neu.adminBandListErstellen__linkYoutoube").val(), $(".adminBandListErstellen__neu.adminBandListErstellen__linkInstagramm").val(), $(".adminBandListErstellen__neu.adminBandListErstellen__linkTwitter").val() ]
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
            // Nach erfolgreicher Aktion, den aktuellen Stand von Bands von der Datenbank laden
            // Die Liste neu aufbauen mit den aktuellen Einträgen

            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            /////////////////    Ajax Befehl : Nach efolgreichem speichern den aktuellen Servertand neu laden und Bandliste neu abspeichern
            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

            // Wird vom Server der string "true" zurückgegeben, so ist der Befehl erfolgreich verlaufen
            if ( data === "true") {
                // Auf diese Weise wird dem PHP Server die Aufgabe mitgeteilt
                var dataToSend = {
                    tabelle: "band",
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

                    // Speichern der Banddaten in Local Storage
                    localStorage.setItem("adminBandAlle", JSON.stringify(data));

                    // Maske wieder schliessen nach speichern
                    $(".adminBandListErstellen").css("display", "none");


                }).fail(function () {
                    console.log("Error!");
                });
            }
            // Fehler beim Server
            else {
                console.log(data);
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
$("body").on('click', '.adminBandListErstellen__zurueck', function () {

    // Anzeige der Detailansicht verbergen
    $(".adminBandListErstellen").css("display", "none");

    // Anzeige des Buttons Zurueck verbergen
    $(".adminBandListErstellen__zurueck").css("display", "none");


    // Sofern die Listenansicht noch nicht eingeblendet ist, wieder einblenden
    if ($(".adminBandList").css("display") !== "block" || $(".adminBandList").html() === '') {

        $(".adminBandList").css("display", "block");

        // Aktuelle Benutzerdaten lesen
        // Die Daten aus dem Local Storage sind JSON, da nur Strings und keine Objekte gespeihert werden können
        adminLoginUserAktiv = JSON.parse(localStorage.getItem("adminLoginUserAktiv"));

        // Aktuelle Banddaten lesen
        // Die Daten aus dem Local Storage sind JSON, da nur Strings und keine Objekte gespeihert werden können
        adminBandAlle = JSON.parse(localStorage.getItem("adminBandAlle"));

        // Ausgabe der Liste BAnddaten mit aktuellen Benuzerrechten
        adminBandList( $(".adminBandList"), adminLoginUserAktiv[0]["zugriffsberechtigung"], adminBandAlle);
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



// Erzeugen einer Listenansicht mit allen Band welche in der Datenbank gespeichert sind
// Es wird der Titel angezeigt, sowie ein Button löschen und ein button detail
// Mit der Variablen integer_adminLevel wird
function adminBandList(htmlKlasse, integer_adminLevel, arrayOfObject_serverDaten) {

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



