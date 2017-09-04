
/*

Mit dieser Seite werden Funktionen zum Login für die Kunden erledigt.
    1. Login: (Daten mit Datenbank vergelichen und Loogin Freigeben)
    2. Logout
    3. Kundenprofil anpassen: Kundeangaben ändern und an Datenbank senden
    4. Neuer Kunde erfassen:  (Datenvalidierung und dann daten an Datenbank senden zum speichern


Das HTML ist grösstenteils bereits statisch definiert, aber mit CSS Display : none verborgen
Mit Javascript wird das aktuell benötigte HTML eingeblendet.

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

In der local Storage werden folgende Daten gespeichert:

    1.  Alle Benutzereingaben
    2.  Status Login / Logout   : wen "adminLoginErfolgreich" == true, dann ist erfeolgreich eingeloggt, ansonsten nicht
    3.  Serverdaten des eingeloggtem Users  :    "adminLoginUserAktiv : Diese werden gleich innerhalb der Funktion ajaxCall gespeichert, da diese asynchron ist
    4.  Die zuletz gelesenen Serverdaten    :    "ajaxDaten"

 */

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////
/////////////////     INITIALISIERUNGEN
/////////////////
/////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Test, ob local Storage nterstütz wird
// Im Moment ist noch kein fallback Lösung geplant
if (typeof(Storage) !== "undefined") {
    // Code for localStorage/sessionStorage.
} else {
    // Sorry! No Web Storage support..
    console.log("Sorry! No Web Storage support..");
}


// Rootverzeichnisse ür Serverzugriffe
// PHP Server root Verzeichnis
var rootAjax = '';  // 'http://localhost/Web_Professional/_DIPLOMARBEIT/Testprojekt/'    // http://localhost:3000/Web_Professional/_DIPLOMARBEIT/Testprojekt
var rootBilder = '';  // Web_Professional/DIPLOMARBEIT/Testprojekt/


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

// Variable mit Serverdaten von Ajax CAll. Speichern der Antwort oder der Sendedaten bei Bedarf
var ajaxDatenSenden = "";
var ajaxDatenAntwort = "";
var adminLoginUserAktiv = "";



// Sofern noch immer ein Administrator eingeloggt ist, wird das Anmeldefeld mit dessen usernamen beschrieben
if (localStorage.getItem("adminLoginUserAktiv") !== undefined && localStorage.getItem("adminLoginUserAktiv") !== "" &&
    localStorage.getItem("adminLoginUserAktiv") !== null) {

    // Die Daten aus dem Local Storage sind JSON, da nur Strings und keine Objekte gespeihert werden können
    adminLoginUserAktiv = JSON.parse(localStorage.getItem("adminLoginUserAktiv"));

    // Speichern der Werte in eine zwischenvariablen
    $(".adminLoginMenue__userAktiv").html("Hallo " + adminLoginUserAktiv[0]["username"]);
}
// Ist kein User angemeldet, so soll Test Anmelden angezeigt werden
else {
    $(".adminLoginMenue__userAktiv").html("Login");
}







//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////     HAUPTMENUE                Hauptnavigation in Mobile First Variante für Seite: admin
/////////////////                               HTML Page : header.php
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Hauptmenue
// Starten der Funktionen darf erst mglich sein, wenn Dokument geladen ist
$(document).ready(function() {

    // Offnen oder schliessen des HAuptnaviagtions Menues im Mobile First Flyout Menue
    $(".adminHeader__nav").on('click', function () {
        MenueEinAus( $(".adminMenue") );
    });

});



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////     LOGIN  MENU AKTIONSWAHL            Durch klicken auf das Feld Login wird das Submenu gestartet, wo die genaue Aktion gewählt werden kann (profil / Login oder Logout)
/////////////////                                        Mit CSS wird das geklickte klassenelement auf Display block gestellt
/////////////////
/////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// MENUE LOGIN
// Starten der Funktionen darf erst mglich sein, wenn Dokument geladen ist
$(document).ready(function() {

    // SUB MENUE  -  HTML ELEMENTE AUF DISPLAY BLOCK SETZEN
    // Offnen oder schliessen des Sub Menues Login - wo nun zwischen drei Aktionen gewählt werden kann
    $(".adminHeader__LoginContainer").on('click', function () {
        MenueEinAus( $(".adminLoginMenue") );
    });


    // SUB MENUE  -  AKTIONSWAHL
    // Sämtlich Subelemente sind im HTML bereits vorhanden aber in CSS auf Display Block. Je nach Programmablauf werden mit Display block
    // einzelne Elemente Sichtbar gemacht. Da dadurch noch keine sensiblen Daten sichtbar  sind, kann hier mit display block gearbeitet werden
    $(".adminLoginMenue").children().on('click', function () {

        // Zuerst alle geöffneten Submenues von Loginfeld schliessen
        $(".adminAccount").children().css("display", "none") ;

        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        /////////////////     AKTION             PROFIL BEARBEITEN (NUR MOEGLICH WENN AKTIV EINGELOGGT. DIE LOGINDATEN DES AKTIVEN ADMINISTRATOE SIND IM LOCAL STORAGE GESPEICHERT
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        // Starten der Funktion Profil bearbeiten - Dies ist aber nur möglich, sofern ein Erfolgreiches Login aktiv ist
        if ( $(".adminLoginMenue__profil").is( $(this) ) ) {

            // Die Daten aus dem Local Storage sind JSON, da nur Strings und keine Objekte gespeichert werden können
            // var adminLoginUserAktiv = JSON.parse(localStorage.getItem("adminLoginUserAktiv"));

            // Wenn eingeloggt, dann startet Funktion zur Anzeige der HTML Formualarfelder zum anpassen/anschauen der Informationen
            // Ist ein User eingeloggt, so ist das Feld mit einem String belegt und nicht leer
            if (localStorage.getItem("adminLoginUserAktiv") !== undefined && localStorage.getItem("adminLoginUserAktiv") !== "" &&
                localStorage.getItem("adminLoginUserAktiv") !== null) {

                // HTML sichtbar machen
                $(".adminProfil").css("display", "block") ;

                // Aktuelle adminDaten in Javascript Objekt speichern, damit darauf Zugegriffen werden kann
                adminLoginUserAktiv = JSON.parse(localStorage.getItem("adminLoginUserAktiv"));

                // Felder mit den aktuellen Daten abfüllen
                // Email
                $(".adminProfil__form__email").attr("value", adminLoginUserAktiv[0]["email"]);
                // Username
                $(".adminProfil__form__username").attr("value", adminLoginUserAktiv[0]["username"]);
                // Telefonnummer
                $(".adminProfil__form__telefon").attr("value", adminLoginUserAktiv[0]["telefonnummer"]);
                // Passwort - soll unbelegt sein
                $(".adminProfil__form__password").attr("value", '');
                // Passwortbestätigung - soll unbelegt sein
                $(".adminProfil__form__passwordBestaetigen").attr("value", '');

                // Dem Zahlennwert einen Textwert zuweisen für Zugriffsberechtigung
                // Keine default bei else, da in diesem Fall keine berechtigung vorliegen darf um in dieses Menue zu kommen
                if ( adminLoginUserAktiv[0]["zugriffsberechtigung"] === 1)
                    // Zugroffsberechtigung
                    $(".adminProfil__form__level").attr("value", "Super Administrator");
                else if ( adminLoginUserAktiv[0]["zugriffsberechtigung"] === 2) {
                    // Zugroffsberechtigung
                    $(".adminProfil__form__level").attr("value", "Administrator");
                }
            }
            // Wenn nicht eingeloggt, dann eine Alert Meldung
            else {
                alert ("Sie müssen für diese Aktion mit einem gültigen Administrator eingeloggt sein")
            }


            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            /////////////////     AJAX CALL : Laden aller Daten von allen usern und speichern in den local Storage - Diese Daten werden gebraucht um zu schauen ob der username bereits vergeben wurde
            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

            // Steuerungvariable API PHP Server beschreiben für Ajax Call
            dataToSend = {
                tabelle: "admin",
                funktion: "lesen",
                parameter: "alle",
                spaltenName: "",
                spaltenWert: "",
                idZeile: -1,
                updateSpalte: [],
                updateWert: []
            };

            // Start Ajax Call
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
            })
            // Aufgabe war erfolgreich
                .done(function(data) {
                    // Speichern in local Storage
                    // Alle Admindaten vom Server laden und abspeichern, damit geschaut werden kann, ob der username bereits vergeben ist
                    localStorage.setItem("ajaxDatenAntwort", JSON.stringify(data) );
                })
                // Aufgabe war nicht erfolgreich
                .fail(function(){
                    alert("Bitte versuchen Sie es erneut");
                });
        }



        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        /////////////////     AKTION             Einloggen - Es wird ein HTML Formuar aufgebaut mit den Benutzereingaben. Diese werden dann mit der DAtenbank verglichen
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        // Starten Loginfenster
        else if ( $(".adminLoginMenue__login").is( $(this) ) ) {
            // Eingabe einblenden
            // HTML für Loginmaske sichtbar machen - Eingabe des Username und passwortes
            $(".adminLogin").css("display", "block") ;

            // PAsswort wird anfangs immer leer gelassen
            $(".adminLogin__form__password").val('');
        }

        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        /////////////////     AKTION             Auslogen - Es wird gas gesamte aktuelle HTML gelöscht, die local storage Variablen werden ebenfalls gelöscht und es erscheint ein alert
        /////////////////                        Logout erfolgreicht
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        // Starten Logout fenster
        else if ( $(".adminLoginMenue__logout").is( $(this) ) ) {
            // $(".???").css("display", "none") ;
            localStorage.setItem("adminLoginUserAktiv", "");
            // Im Menue Account den Usernamen löschen
            $(".adminLoginMenue__userAktiv").html("Login");
        }

        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        /////////////////     AKTION             Neuer Administrator hinzufügen - Dies kann nur von einem eingeloggten Administrator mit der Benutzerebene 1 gemacht werden. Wenn keiner eingeloggt ist
        /////////////////                        so erschient ein Alert, Bitte mit nötiger Berechtigung einloggen
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        // Starten Neuer Administrator setzen
        else if ( $(".adminLoginMenue__newAdmin").is( $(this) ) ) {
            // Wenn eingeloggt, dann startet Funktion zur Anzeige der HTML Formualrfelder zum anpassen/anschauen der Informationen
            if (localStorage.getItem("adminLoginErfolgreich") === "true" ) {
                $(".adminNewAdmin").css("display", "block") ;
            }
            // Wenn nicht eingeloggt, dann eine Alert Meldung
            else {
                alert ("Sie müssen für diese Aktion mit einem gültigen Administrator eingeloggt sein")
            }
        }
    });
});





//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////     EVENTS : adminProfil               Steuerung der Funktion Administrator Profil ändern, nachdem das HTML nun auf Display : block gestellt wurde und die aktuellen
/////////////////                                        Daten bereits abgefüllt wurden
/////////////////
/////////////////
/////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Starten der Funktionen darf erst möglich sein, wenn Dokument geladen ist
$(document).ready(function() {

    // Event : Daten verarbeitung starten durch drücken des Buttons Senden
    $(".adminProfil__form__speichern").on('click', function (e) {

        // Das neu laden der Seite verhindern, damit HTML nicht verändert wird, bevor die Anfrage verarbeitet wurde
        e.preventDefault();

        // Aktuelle adminDaten in Javascript Objekt speichern, damit darauf Zugegriffen werden kann
        adminLoginUserAktiv = JSON.parse(localStorage.getItem("adminLoginUserAktiv"));

        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        /////////////////     Kontrolle ob Passwort neu geschrieben werden muss
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        // Diese wird anfangs mit dem Server Wert initialisert, und allenfalls nachfolgen überschrieben, befor Sie der Steuerungsvariablen übergeben wird
        var passwortNeu = adminLoginUserAktiv[0]["passwort"];

        // Passwort wird nur neu geschrieben, sofern im Feld Passwort ein Eintrag ist und dieser genau mit dem
        // Passwort im Bestätigunsfeld übereinstimmt
        if ( $(".adminProfil__form__password").val() !== '' &&
            $(".adminProfil__form__password").val() !== null  &&
            $(".adminProfil__form__password").val() !== undefined  ) {

            // Passwort vergleich der beiden Feldern
            if ( $(".adminProfil__form__password").val() === $(".adminProfil__form__passwordBestaetigen").val() ) {
                // Variable passwortNeu mit neuem Wert überschreiben
                passwortNeu = $(".adminProfil__form__password").val();
            }
            // Alertausgabe Eingabe ungleich
            else {
                alert ("Die Eingabe der beiden Passwortfeldern ist ungleich")
            }
        }

        // Passwort kontrollieren - Daten von User und Server vergleichen
        // Die Daten aus dem Local Storage sind JSON, da nur Strings und keine Objekte gespeichert werden können
        ajaxDatenAntwort = JSON.parse(localStorage.getItem("ajaxDatenAntwort"));

        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        /////////////////     sofern der neue username verändert wurde - Kontrolle ob Username bereits vergeben ist
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        // Hilfsvariable zum erkennen ob Username bereits vergeben ist
        var usernameGesperrt = false;
        // Hilfsvariable zum  speichern des username - entweder bestehender Wert oder er wird mit dem neuen überschrieben
        var usernameNeu = adminLoginUserAktiv[0]["username"];

        // Username wurde geändert - üerprüfung nötig ob bereits vergeben
        if ( adminLoginUserAktiv[0]["username"] !== $(".adminProfil__form__username").val() ) {

            for (var i=0; i<ajaxDatenAntwort.length; i++) {
                // Sobald eine übereinstimm gefunden wird, wird die Schlaufe beendet und eine Variable herausgegeben
                if ( ajaxDatenAntwort[i]["username"] === $(".adminProfil__form__username").val() ) {
                    usernameGesperrt = true;
                    alert("Der Benutzername ist bereits vergeben");
                    break;
                }
            }
            // Username mit dem neuen Wert speichern
            if (usernameGesperrt === false) {
                usernameNeu = $(".adminProfil__form__username").val();
            }
        }

        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        /////////////////     Sofern der Username Frei ist, werden die veränderten Daten gespeichert. Wegen asynchroner Ajax Funktionsweise sind diese sonst verlohren
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        // Zu sendende daten in objekt speichern
        var daten = [ { email: $(".adminProfil__form__email").val(), username : usernameNeu, passwort : passwortNeu, telefonnummer : $(".adminProfil__form__telefon").val() } ];
        // Objekt in Local Storage speichern
        localStorage.setItem("ajaxDatenSenden", JSON.stringify(daten));

        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        /////////////////     AJAX CALL : speichern der neuen Daten. Wenn es erfolgreich war, ebenso im local Storage aktualisieren
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        // Steuerungvariable API PHP Server beschreiben für Ajax Call
        dataToSend = {
            tabelle: "admin",
            funktion: "update",
            parameter: "suchen",
            spaltenName: "username",
            spaltenWert: adminLoginUserAktiv[0]["username"],
            idZeile: -1,
            updateSpalte: ['email', 'username', 'passwort', 'telefonnummer'],
            updateWert: [$(".adminProfil__form__email").val(), usernameNeu, passwortNeu,  $(".adminProfil__form__telefon").val()]
        };

        // Start Ajax Call
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
        })
        // Aufgabe war erfolgreich
            .done(function() {

                // Neue Daten laden
                var neueAdminDaten = JSON.parse(localStorage.getItem("ajaxDatenSenden"));

                // Alte Daten laden
                adminLoginUserAktiv = JSON.parse(localStorage.getItem("adminLoginUserAktiv"));

                // Dann die neuen speichern in Uservariable
                adminLoginUserAktiv[0]["email"] = neueAdminDaten[0]["email"];
                adminLoginUserAktiv[0]["username"] = neueAdminDaten[0]["username"];
                adminLoginUserAktiv[0]["passwort"] = neueAdminDaten[0]["passwort"];
                adminLoginUserAktiv[0]["telefonnummer"] = neueAdminDaten[0]["telefonnummer"];

                // Neue Daten wieder in local Storage speichern
                localStorage.setItem("adminLoginUserAktiv", JSON.stringify(adminLoginUserAktiv) );

                // Im Menue Account den neuen username eintragen
                $(".adminLoginMenue__userAktiv").html("Hallo " + adminLoginUserAktiv[0]["username"]);

                // DAs Menue Profil schliesssen
                $(".adminProfil").css("display", "none") ;
            })
            // Aufgabe war nicht erfolgreich
            .fail(function(){
                alert("Bitte versuchen Sie es erneut");
            });
    });

});




//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////     EVENTS : adminProfil               Formulareingabe schliessen
/////////////////
/////////////////
/////////////////
/////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// Button schliessen Eingabeformular Kundendaten - Eingaben alle löschen
$(".adminProfil__form__exit").on('click', function () {
    // Das Eingabeformular wird geschlossen
    $(".adminLogin").html() ;
    $(".adminLogin").css("display", "none");
});



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////     EVENTS : adminLogin               Steuerung der Funktion Administrator einloggen, nachdem das HTML nun auf Display : block gestellt wurde
/////////////////
/////////////////
/////////////////
/////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Starten der Funktionen darf erst mglich sein, wenn Dokument geladen ist
$(document).ready(function() {

  // Event : Daten verarbeitung starten durch drücken des Buttons Senden
    $(".adminLogin__form__submit").on('click', function (e) {

        // Das neuladen der Seite verhindern, damit HTML nicht verändert wird, bevor die Anfrage verarbitet wurde
        e.preventDefault();

        // Steuerungvariable API PHP Server beschreiben für Ajax Call
        dataToSend = {
            tabelle: "admin",
            funktion: "lesen",
            parameter: "suchen",
            spaltenName: "username",
            spaltenWert: $(".adminLogin__form__username").val(),
            idZeile: -1,
            updateSpalte: [],
            updateWert: []
        };


        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        /////////////////     AJAX CALL : Laden aller Daten von allen Usern und speichern in den local Storage - Diese Daten werden gebraucht um zu schauen ob der username bereits vergeben wurde
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        // Start Ajax Call
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
        })
        // Aufgabe war erfolgreich
            .done(function(data) {

                // Speichern in local Storage
                // Die anmeldung ist korrekt - Anmeldedaten mit Serverdaten vergleichen
                if (data [0]["passwort"] === $(".adminLogin__form__password").val() ) {

                    // Die Daten des aktuellen Users in den Local Storage speichern
                    localStorage.setItem("adminLoginUserAktiv", JSON.stringify(data) );

                    // Im Headerfeld im HTML den Usernamen des angemeldeten Users einblenden
                    // In der Initialisierungs Sequenz zu Programmstart wird der Name ebenfalls nochmals in dieses Feld geschrieben
                    $(".adminLoginMenue__userAktiv").html("Hallo " + data [0]["username"]);
                    // DAs Fenster Login wird wieder versteckt
                    $(".adminLogin").css("display", "none") ;
                }
                // Die Anmeldung ist fehlgeschlagen
                else {
                    console.log(data);
                    alert("Anmeldung fehlgeschlagen");
                }
            })
            // Aufgabe war nicht erfolgreich
            .fail(function(error){
                console.log(error);
                alert("Bitte versuchen Sie es erneut");
            });
    });

});




//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////     EVENTS : adminLogin               Formulareingabe FEld schliessen
/////////////////
/////////////////
/////////////////
/////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// Button schliessen Eingabeformular Kundendaten - Eingaben alle löschen
$(".adminLogin__form__exit").on('click', function () {
    // Das Eingabeformular wird geschlossen
    $(".adminLogin").html() ;
    $(".adminLogin").css("display", "none");
});











//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////     FUNKTIONS - DEFINITIONEN
/////////////////
/////////////////
/////////////////
/////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

