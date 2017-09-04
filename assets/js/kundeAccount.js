
/*

 DAs HTML ist bereits statisch definiert, aber grösstenteils mit CSSDisplay : none verborgen
 Mit Javascript wird das aktuelll benötigte HTML eingebelndet.

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
 };

 In der local Storage werden folgende DAten gespeichert:

 1.  Alle Benutzereingaben
 2.  Status Login / Logout   : wen "kundenLoginErfolgreich" == true, dann ist erfeolgreich eingeloggt, ansonsten nicht
 3.  Serverdaten des eingeloggtem Users  :    "kundenLoginUserAktiv : Diese werden gleich innerhalb der Funktion ajaxCall gespeichert, da diese asynchron ist
 4.  Die zuletz gelesenen Serverdaten    :    "ajaxDaten"
 5.  Vereinzelte DAten, welche beim Senden AJax festgehalten werden müssen und bei der asynchonen Antort nochmals gebraucht werden. Zum Beispiel beim Login:
 "kundenLoginUsername" und "kundenLoginPasswort"

 */

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////
/////////////////     INITIALISIERUNGEN
/////////////////
/////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Test, ob local Storage nterstütz wird, ansonsten muss mit cookies oder Session php gearbeitet werden
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

// Variable mit Serverdaten. iese wird immer nei einem Reload mit dem Inhalt aus dem Local Storage beschrieben
var ajaxDatenSenden = "";
var ajaxDatenAntwort = "";
var kundenLoginUserAktiv = "";
var aktuellerWarenkorb = "";



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////     Feld kundendaten - Radio Button bei change im HTML ändern - DEm Radiobutton mit true wird der Wert : "checked" in das Attributtt "checked" geschrieben
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Event : Daten verarbeitung starten durch drücken des Buttons Senden
$(".kundendaten__form__newsletter").children().on('click', function () {
    ( $(".kundendaten__form__newsletter").children().attr("checked", false) );
    ( $(this).attr("checked", true) );
});



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////     LOGIN  MENU AKTIONSWAHL            Durch klicken auf das Feld Login wird das Submenu gestartet, wo die genau Aktion gewählt werden kann (profil / Login oder Logout)
/////////////////                                        Mit CSS wird das geklickte klassenelement auf Display block gestellt
/////////////////
/////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// MENUE LOGIN
// Starten der Funktionen darf erst mglich sein, wenn Dokument geladen ist
$(document).ready(function() {

    // SUB MENUE  -  HTML ELEMENTE AUF DISPLAY BLOCK SETZEN
    // Offnen oder schliessen des Sub Menues Login - wo nun zwischen drei aktionen gewählt werden kann
    $(".menue__iconLine__rechts__login").on('click', function () {
        MenueEinAus( $(".kundenLoginMenue") );
    });



    // SUB MENUE  -  AKTIONSWAHL
    // Sämtlich Subelemente sin im HTML bereits vorhanden aber in CSS auf Display Block. Je nach Programmablauf wird mit Display block
    // einzelne Elemente Sichtabr gemacht. Da keine gefährlichen DAtenbank zugriffe möglich sind deswegen, kann dies so gemacht werden
    $(".kundenLoginMenue").children().on('click', function () {

        // Zuerst alle geöffneten Submenues von Loginfeld schliessen
        $(".kundenAccount").children().css("display", "none") ;

        // Diverse Elemente ausblenden
        // Button bestätigungsmail
        $(".kundenLogin__form__bestaetigungsMail").css("display", "none");
        $(".kundenLogin__form__bestaetigungsMail").val("");
        // h6 bestätigungsmail
        $(".kundenLogin__form__bestaetigungsMail__h6").css("display", "none");
        // inputfeld Email bestätigungsmail
        $(".kundenLogin__form__bestaetigungsMail__email").css("display", "none");
        $(".kundenLogin__form__bestaetigungsMail__email").val("");


        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        /////////////////     AKTION             PROFIL BEARBEITEN (NUR MOEGLICH WENN AKTIV EINGELOGGT. DIE LOGINDATEN DES AKTIVEN kundenISTRATOE SIND IM LOCAL STORAGE GESPEICHERT
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        // Starten der Funktion Profil bearbeiten - Dies ist aber nur möglich, sofern ein erfolgreiches Login aktiv ist
        if ( $(".kundenLoginMenue__profil").is( $(this) ) ) {

            // Wenn eingeloggt, dann startet Funktion zur Anzeige der HTML Formualrfelder zum anpassen/anschauen der Informationen
            // Ist ein User eingeloggt, so ist das feld mit einem String belegt und nicht leer
            if (localStorage.getItem("kundenLoginUserAktiv") !== undefined && localStorage.getItem("kundenLoginUserAktiv") !== "" &&
                localStorage.getItem("kundenLoginUserAktiv") !== null) {

                // HTML sichtbar machen
                $(".kundendaten").css("display", "block") ;
                $(".kundendaten__form__speichern").css("display", "inline-block");
                $(".kundendaten__form__neu").css("display", "none") ;

                // HTML Menue ausblenden
                $(".kundenLoginMenue").css("display", "none") ;
                $(".kundendaten__form__neu").css("display", "none") ; // Wird bei Funktion nuer Kunde gebraucht für Event auszulösen

                // Die Daten aus dem Local Storage sind JSON, da nur Strings und keine Objekte gespeihert werden können
                kundenLoginUserAktiv = JSON.parse(localStorage.getItem("kundenLoginUserAktiv"));


                //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                /////////////////     aktuelle Daten vom Server in die Felder befüllen
                //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

                ( $(".kundendaten__form__newsletter").children().attr("checked", false) );
                ( $(this).attr("checked", true) );

                // anrede
                $(".kundendaten__form__anrede").val( kundenLoginUserAktiv[0]["anrede"] );
                // vorname
                $(".kundendaten__form__vorname").val(kundenLoginUserAktiv[0]["vorname"] );
                // nachname
                $(".kundendaten__form__nachname").val(kundenLoginUserAktiv[0]["nachname"] );
                // email
                $(".kundendaten__form__email").val(kundenLoginUserAktiv[0]["email"] );
                // username
                $(".kundendaten__form__username").val(kundenLoginUserAktiv[0]["username"] );
                // password
                $(".kundendaten__form__password").val("");
                // passwordBestaetigen
                $(".kundendaten__form__passwordBestaetigen").val("");
                // telefon
                $(".kundendaten__form__telefon").val( kundenLoginUserAktiv[0]["telefonnummer"] );
                // strasse
                $(".kundendaten__form__strasse").val(kundenLoginUserAktiv[0]["strasse"] );
                // zusatz
                $(".kundendaten__form__zusatz").val(kundenLoginUserAktiv[0]["zusatz"] );
                // platz
                $(".kundendaten__form__platz").val( kundenLoginUserAktiv[0]["platz"] );
                // ort
                $(".kundendaten__form__ort").val(kundenLoginUserAktiv[0]["ort"] );
                // newsletter
                if ( kundenLoginUserAktiv[0]["newsletterSenden"] === 0) {
                    $(".kundendaten__form__newsletter__ja").attr("checked", false);
                    $(".kundendaten__form__newsletter__nein").attr("checked", true);
                }
                else {
                    $(".kundendaten__form__newsletter__ja").attr("checked", true);
                    $(".kundendaten__form__newsletter__nein").attr("checked", false);
                }

            }
            // Wenn nicht eingeloggt, dann eine Alert Meldung
            else {
                alert ("Sie müssen für diese Aktion mit einem gültigen Kunden Account eingeloggt sein")
            }

        }

        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        /////////////////     AKTION             Einloggen - Es wird ein HTML Formuar aufgebaut mit den BEnutzereingaben. Diese werden dann mit der DAtenbank geprüft
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        // Starten Loginfenster
        else if ( $(".kundenLoginMenue__login").is( $(this) ) ) {
            // Eingabe einblenden
            // HTML für Loginmaske sichtbar machen - Eingabe des Username und passwortes
            // Die letzten Eingaben werden gelöscht
            $(".kundenLogin").css("display", "block") ;


            // Passwort und User werden immer zuerst gelöscht und müssen neu eingegeben werden aus SChutz
            $(".kundenLogin__form__username").val("");
            $(".kundenLogin__form__password").val("");

            // HTML Menue ausblenden
            $(".kundenLoginMenue").css("display", "none") ;
        }

        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        /////////////////     AKTION             Ausslogen - Es wird gas gesamte aktuelle HTML gelöscht, die local storage Variablen werden ebenfalls gelöscht und es erscheint ein alert
        /////////////////                        Logout erfolgreicht
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        // Starten Logout fenster
        else if ( $(".kundenLoginMenue__logout").is( $(this) ) ) {

            // DAten des aktiven USers aus dem LocalStorage Löschen
            localStorage.setItem("kundenLoginUserAktiv", "");

            // DAten des aktiven Warenkorbes aus dem LocalStorage Löschen
            localStorage.setItem("aktuellerWarenkorb", "");

            // HTML Menue ausblenden
            $(".kundenLoginMenue").css("display", "none") ;
        }

        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        /////////////////     AKTION             Neuer kunden Account erfassen : Die kundendaten werden in der DAtenbank gespeihert
        /////////////////
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        // Starten Neuer kundenistrator setzen
        else if ( $(".kundenLoginMenue__accountErstellen").is( $(this) ) ) {

            // Ein neues Anmeldeprofil erstellen
            // HTML sichtbar machen
            $(".kundendaten").css("display", "block") ;
            $(".kundendaten__form__neu").css("display", "inline-block") ;

            // Passwortfelder müssen immer leer sein bei Starten der MAske, damit niemand missbrauch machen kan
            // password
            $(".kundendaten__form__password").val("");
            // passwordBestaetigen
            $(".kundendaten__form__passwordBestaetigen").val("");

            // HTML Menue ausblenden
            $(".kundenLoginMenue").css("display", "none") ;
            $(".kundendaten__form__speichern").css("display", "none");
        }
    });
});





//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////     EVENTS : Profildaten anpassen       Kunde muss eingeloggt sein - er kann hier sein profil modfozieren - die erneute PAssswort eingabe ist erforderlich
/////////////////
/////////////////
/////////////////
/////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Starten der Funktionen darf erst mglich sein, wenn Dokument geladen ist
$(document).ready(function() {

    // Event : Daten verarbeitung starten durch drücken des Buttons Senden
    $(".kundendaten__form__speichern").on('click', function (e) {

        // Das neuladen der Seite verhindern, damit HTML nicht verändert wird, bevor die Anfrage verarbitet wurde
        e.preventDefault();

        // Variablendefinitionen
        var passwort = '';
        var username = '';

        // Die Daten aus dem Local Storage sind JSON, da nur Strings und keine Objekte gespeihert werden können
        kundenLoginUserAktiv = JSON.parse(localStorage.getItem("kundenLoginUserAktiv"));

        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        /////////////////     AJAX CALL :   Abfrage an den Server, aller Userdaten
        /////////////////                   Die geladenenen DAten werden in der Ajax Antwort "done" auf ein Valides PAsswort ausgewertet. Dort wird entschieden ob das Login korrekt ist oder nicht
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        // Steuerungvariable API PHP Server beschreiben für Ajax Call
        dataToSend = {
            tabelle: "kunden",
            funktion: "lesen",
            parameter: "alle",
            spaltenName: "",
            spaltenWert: "",
            idZeile: -1,
            updateSpalte: "",
            updateWert: []
        };

        // Start Ajax Call
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
        })
        // Aufgabe war erfolgreich - die aktuellen DAten wurden geladen
        // Nun kann dieEingabevalideiung statfinden
            .done(function(data) {

                //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                /////////////////     Eingabe Validierungen
                //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

                // Hilfsvariablen
                var passwortGut = false;
                var usernameGut = false;
                var emailGut = false;
                var NameGut = false;
                var adresseGut = false;
                var newsletterJaNein = false;

                // Diese Arrays werden dem Ajay Sendeazftrag miteliefert mit den neuen DAten
                var arrayUpdateSpalte = [];
                var arrayUpdateWert = [];


                //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                /////////////////     PASSWORT :    Wird nur neu abgepeichert, sofern im Passwortfeld und im Passwort bestätigungsfeld ein Wert gespeichert ist
                /////////////////                   Für die Freigabe zum abspeichern der änderungen im ganzen Formular muss aber als Sicherheit trozdem das normale PAsswort eingegeben werden
                /////////////////                   Wird ein neues PAsswort gespeichert, so gelten folgende BEdingngen:
                /////////////////                   minimal 6 Zeichen und mindestens ein Sonderzeichen und ein Grossbuchstabe
                /////////////////
                //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

                // Passworteingabe aus Formualar - alle Leerzeilen werden entfernt
                passwort = $(".kundendaten__form__password").val().replace(/\s/g,'');

                // Mit dieser Zeile wird einerseits ein Objekt regExp erstellt und anderseits wird dies gleich mit einem Regulärem Ausdruck initialisierten
                // \W = alles ausser Zahl, kleinbuschstaben oder Brossbuchstaben          {1,} = minimal ein Vorkommen nötig        [A-Z] = grossbichstaben
                // Es können nicht beide Zeichen in einen Ausgruck genommen werden, sonst ist die Reihenfolge definiert, welches ZEichen zuers kommen muss
                // Folgende BEdingungen werden an das PAsswort gestellt: 1. minimal 6 Zeichen, mindesten ein kleinbuchstabe, mindestens ein Grossbuchstabe, mindesten eine Zahl
                // und es darf keine Umlaute enhtalten -> gibt sonst Probleme auf der Datenbank, da wegen des Zeichensatzes nicht unterschieden wird beim lesen von DAtensätzen
                var regulaerAusdruck_1 = /\W{1,}/;
                var regulaerAusdruck_2 = /[A-Z]{1,}/;
                var regulaerAusdruck_3 = /[a-z]{1,}/;
                var regulaerAusdruck_4 = /[0-9]{1,}/;
                var regulaerAusdruck_5 = /[äÄöÖüÜß]/; // Muss in if negiert werden

                // Damit kein Fehler auftaucht, sofern das Element noch gar nicht exisiert
                if ( passwort !== '' && passwort !== null  && passwort !== undefined  ) {

                    // überprüfen der minimalen Wortlänge
                    // überprüfen der mnimalen Passwortlänge
                    if (passwort.length > 5 && regulaerAusdruck_1.test(passwort) && regulaerAusdruck_2.test(passwort) && regulaerAusdruck_3.test(passwort) &&
                        regulaerAusdruck_4.test(passwort) && !regulaerAusdruck_5.test(passwort)  ) {

                        // Passworteingabe ist korrekt - nun wird noch überprüft, ob das PAsswort neu gespeichert wird
                        // Enweder muss BEstätigungsfeld ller sein oder
                        // beide Passwortfelder müssen die gleiche Eingabe haben
                        if ( passwort === $(".kundendaten__form__passwordBestaetigen").val()  ||
                            $(".kundendaten__form__passwordBestaetigen").val() === ''){
                            // Beide Regulärer Ausdrücke sind erfüllt
                            passwortGut = true;

                            // Das Passwort hat sich geändert und muss neu abgespeichert und demnach validiert werden
                            if ( $(".kundendaten__form__password").val() !== kundenLoginUserAktiv[0]['passwort'] ) {
                                // Diese Arrays werden dem Ajay Sendeazftrag miteliefert mit den neuen DAten
                                arrayUpdateSpalte.push('passwort');
                                arrayUpdateWert.push(passwort);
                            }
                        }
                        // PAsswort und Feld PAsswortbestätigung stimmen nicht überein
                        else {
                            alert("Die beiden Felder Passwort und PAsswortbestätigung sind nicht gleich - Achten sie auf Leerzeilen")
                        }
                    }
                    // Passwort ist nicht nach den vorgegebenen Regeln eingegeben worden
                    else {
                        alert("Das eingegebene Passwort ist nicht gültig")
                    }
                }
                // Passwortfeld wird nicht verändert, sofern das FEld leer bleibt
                else {
                    passwortGut = true;
                }

                //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                /////////////////     Kontrolle ob Username bereits vergeben ist - Gross und Kleinschrift wird nicht berücksichtig - in diesem Falle gilt das name ebenfalls als besetzt
                //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

                // Username aus Formular
                username = $(".kundendaten__form__username").val().replace(/\s/g,'');


                // Damit kein Fehler auftaucht, sofern das Element noch gar nicht exisiert
                if ( username !== '' && username !== null  && username !== undefined  ) {

                    // Der Username hat sich geändert und muss neu abgespeichert und demnach validiert werden
                    if ( username.toLowerCase() !== kundenLoginUserAktiv[0]["username"].toLowerCase()  ) {

                        // Username wurde geändert - üerprüfung nötig ob bereits vergeben
                        for (var i = 0; i < data.length; i++) {

                            // Sobald eine übereinstimm gefunden wird, wird die Schalufe beendet und eine Variable herausgegeben
                            if ( username.toLowerCase() === data[i]["username"].toLowerCase()  ) {
                                usernameGut = false;
                                alert("Der Username ist bereits vergeben");
                                break;
                            }
                            // username ist korrekt
                            else {
                                usernameGut = true;
                            }
                        }
                        // Nachdem die Schlaufe beendet wurde - und der Username valide ist, wird dieser dem Array hinzugefügt
                        if( usernameGut ) {
                            // Diese Arrays werden dem Ajay Sendeazftrag miteliefert mit den neuen DAten
                            arrayUpdateSpalte.push('username');
                            arrayUpdateWert.push( username );
                        }
                    }
                    // Wenn sich der Name nicht geändert hat, so wird er auch nicht neu gespeichert und USername wird freigegeben
                    else {
                        usernameGut = true;
                    }
                }
                // Usernamefeld ist leer
                else {
                    alert("Das Feld Username darf nicht leer sein");
                }



                //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                /////////////////     Emailadresse : Feld muss entweder mit einer korrekten Emailadresse belegt sein oder leer gelassen werden. Bei Newsletter Senden aktiv, muss eine Email eingegeben werden
                /////////////////     Ich habe die Email Validierung nicht slebergemacht, sonern aus einer Seite im Internet kopiert :
                /////////////////     http://www.w3resource.com/javascript/form/email-validation.php
                //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

                // Der Username hat sich geändert und muss neu abgespeichert und demnach validiert werden
                if ( $(".kundendaten__form__email").val() !== kundenLoginUserAktiv[0]['email'] ) {

                    // Ist Newsletter Senden auf Ja, so muss eine Email angegeben werden
                    if ($(".kundendaten__form__newsletter__ja").attr("checked") === "checked") {
                        // Email muss eine valide form haben - DAzu mit einem Regulären Ausdruck maskieren und vergleichen
                        if (ValidateEmail($(".kundendaten__form__email").val() ) ) {
                            emailGut = true;
                            // Diese Arrays werden dem Ajay Sendeazftrag miteliefert mit den neuen DAten
                            arrayUpdateSpalte.push('email');
                            arrayUpdateWert.push($(".kundendaten__form__email").val() );
                        }
                        // Email ist nicht Valide
                        else {
                            alert("Email ist nicht Valide - Bitte korrigieren");
                        }
                    }
                    // Ansonsten muss das Feld Email leer sein    ODER     eine Valide Email sein
                    else {
                        // Eingabe Feld leer
                        if ($(".kundendaten__form__email").val() === '') {
                            emailGut = true;
                            // Diese Arrays werden dem Ajay Sendeazftrag miteliefert mit den neuen DAten
                            arrayUpdateSpalte.push('email');
                            arrayUpdateWert.push($(".kundendaten__form__email").val() );
                        }
                        // Feld nicht leer - dann muss Email Valide sein
                        else if (ValidateEmail($(".kundendaten__form__email").val())) {
                            emailGut = true;
                            // Diese Arrays werden dem Ajay Sendeazftrag miteliefert mit den neuen DAten
                            arrayUpdateSpalte.push('email');
                            arrayUpdateWert.push($(".kundendaten__form__email").val() );
                        }
                        // Meldung an User Feld leer oder alide
                        else {
                            alert("Email ist nicht Valide - Bitte Feld leer lassen oder ien Valide Email eingeben");
                        }
                    }
                }
                // Wenn sich der Name nicht geändert hat, so wird er auch nicht neu gespeichert und USername wird freigegeben
                else {
                    emailGut = true;
                }

                //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                /////////////////     Kontrolle ob Namensfelder belegt sind
                //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

                if ( $(".kundendaten__form__vorname").val() !== '' && $(".kundendaten__form__nachname").val() !== '' ) {
                    NameGut = true;

                    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                    /////////////////     Kontrolle ob eines der Felder geändert hat und neu auf die DAtenbak geschirieben werden muss
                    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

                    // Vorname
                    if ( $(".kundendaten__form__vorname").val() !== kundenLoginUserAktiv[0]['vorname'] ) {
                        // Diese Arrays werden dem Ajay Sendeazftrag miteliefert mit den neuen DAten
                        arrayUpdateSpalte.push('vorname');
                        arrayUpdateWert.push($(".kundendaten__form__vorname").val() );
                    }
                    // nachname
                    if ( $(".kundendaten__form__nachname").val() !== kundenLoginUserAktiv[0]['nachname'] ) {
                        // Diese Arrays werden dem Ajay Sendeazftrag miteliefert mit den neuen DAten
                        arrayUpdateSpalte.push('nachname');
                        arrayUpdateWert.push($(".kundendaten__form__nachname").val() );
                    }
                }
                // Feld darf nicht ller sein
                else {
                    alert("Bitte Felder Vorname und Nachname ausfüllen ");
                }

                //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                /////////////////     Kontrolle ob Adressfelder belegt sind
                //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

                if ( $(".kundendaten__form__strasse").val() !== '' && $(".kundendaten__form__platz").val() !== '' && $(".kundendaten__form__ort").val() !== '' ) {
                    adresseGut = true;

                    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                    /////////////////     Kontrolle ob eines der Felder geändert hat und neu auf die DAtenbak geschirieben werden muss
                    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

                    // strasse
                    if ( $(".kundendaten__form__strasse").val() !== kundenLoginUserAktiv[0]['strasse'] ) {
                        // Diese Arrays werden dem Ajay Sendeazftrag miteliefert mit den neuen DAten
                        arrayUpdateSpalte.push('strasse');
                        arrayUpdateWert.push($(".kundendaten__form__strasse").val() );
                    }
                    // platz - Datentyp Zahl
                    if ( parseInt( $(".kundendaten__form__platz").val() ) !== kundenLoginUserAktiv[0]['platz'])  {
                        // Diese Arrays werden dem Ajay Sendeazftrag miteliefert mit den neuen DAten
                        arrayUpdateSpalte.push('platz');
                        arrayUpdateWert.push($(".kundendaten__form__platz").val() );
                    }
                    // ort
                    if ( $(".kundendaten__form__ort").val() !== kundenLoginUserAktiv[0]['ort']  ) {
                        // Diese Arrays werden dem Ajay Sendeazftrag miteliefert mit den neuen DAten
                        arrayUpdateSpalte.push('ort');
                        arrayUpdateWert.push($(".kundendaten__form__ort").val() );
                    }
                }
                // Feld darf nicht ller sein
                else {
                    alert("Bitte Felder Strasse Platz und Ort ausfüllen ");
                }

                //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                /////////////////     Newsletter - Datenbank erwartet einen Datentyp bool, daher string in Bool umwandeln
                //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

                // Newsletter hat Wert "ja", demnach boolschenwert = true
                if( $(".kundendaten__form__newsletter [checked = checked]").val() === "Ja" ) {
                    newsletterJaNein = true;
                }
                // Newsletter hat Wert "Nein", demnach boolschenwert = false
                else {
                    newsletterJaNein = false;
                }

                // newsletterSenden - um einen Vergleich zu mahen muss ich den gleichen DAtentyp haben. Der Wert vom Server wird nicht als boolean sondern als numer umgewandelt
                // Habe keine Fuktion gefunden um number in bool zu verwandeln, daher wandle ich bool to numer um zu vergleichen
                if ( Number(newsletterJaNein) !== kundenLoginUserAktiv[0]['newsletterSenden']) {
                    // Diese Arrays werden dem Ajay Sendeazftrag miteliefert mit den neuen DAten
                    arrayUpdateSpalte.push('newsletterSenden');
                    arrayUpdateWert.push( newsletterJaNein );
                }

                //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                /////////////////     Kontrolle ob restlichen unvalidierten Felder sich geändert haben
                //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

                // anrede
                if ( $(".kundendaten__form__anrede").val() !==  kundenLoginUserAktiv[0]['anrede'] ) {
            // Diese Arrays werden dem Ajay Sendeazftrag miteliefert mit den neuen DAten
            arrayUpdateSpalte.push('anrede');
            arrayUpdateWert.push( $(".kundendaten__form__anrede").val() );
        }
        // telefonnummer
        if ( $(".kundendaten__form__telefon").val() !== kundenLoginUserAktiv[0]['telefonnummer']) {
            // Diese Arrays werden dem Ajay Sendeazftrag miteliefert mit den neuen DAten
            arrayUpdateSpalte.push('telefonnummer');
            arrayUpdateWert.push( $(".kundendaten__form__telefon").val() );
        }
        // zusatz
        if ( $(".kundendaten__form__zusatz").val() !==  kundenLoginUserAktiv[0]['zusatz'] ) {
        // Diese Arrays werden dem Ajay Sendeazftrag miteliefert mit den neuen DAten
        arrayUpdateSpalte.push('zusatz');
        arrayUpdateWert.push( $(".kundendaten__form__zusatz").val() );
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////
    /////////////////     Ajax abfrage:     kundendaten auf Server speichern
    /////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    // Ajax Zugriff zum speichern der Daten darf esrt geschen, sobald alle DAten richtig eingegeben wurden
    if (passwortGut && usernameGut && emailGut && NameGut && adresseGut) {

        // Das Passwort wird nur neu geschrieben, sofern die Passwort Eingabe und die BEstätigung eingegeben wurde
        // DAs PAsswort muss aber auf jeden Fall eigegeben werden, damit niemand die DAten ändern kann ohne das er das Passwort kennt
        // var arrayUpdateSpalte =     ['anrede', 'vorname', 'nachname', 'email', 'username', 'passwort', 'telefonnummer', 'strasse', 'zusatz', 'platz', 'ort', 'newsletterSenden'];
        // var arrayUpdateWert =     ['anrede', 'vorname', 'nachname', 'email', 'username', 'telefonnummer', 'strasse', 'zusatz', 'platz', 'ort', 'newsletterSenden'];

        // Kunde Profil anpassen
        // Auf diese Weise wird dem PHP Server die Aufgabe mitgeteilt
        var dataToSend = {
            tabelle         : "kunden",
            funktion        : "update",
            parameter       : "suchen",
            spaltenName     : "username",
            spaltenWert     : kundenLoginUserAktiv[0]["username"],
            idZeile         : -1 ,
            updateSpalte    : arrayUpdateSpalte,
            updateWert      : arrayUpdateWert,
            datensatz       : []
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
            headers: {'Authorization': 'Basic ' + btoa('admin:diplomarbeit')
            }

        }).done(function(data) {
            console.log(data);
            // Speichern der kundendaten auf DAtenbank war erfolgreich
            // Die Daten sind lokal noch    NICHT    in die Variable "kundenLoginUserAktiv" gespeichert
            if (data === "true") {

                // Auf diese Weise wird dem PHP Server die Aufgabe mitgeteilt
                var dataToSend = {
                    tabelle         : "kunden",
                    funktion        : "lesen",
                    parameter       : "suchen",
                    spaltenName     : "username",
                    spaltenWert     : kundenLoginUserAktiv[0]["username"],
                    idZeile         : -1 ,
                    updateSpalte    : [],
                    updateWert      : [],
                    datensatz       : []
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
                    headers: {'Authorization': 'Basic ' + btoa('admin:diplomarbeit')
                    }

                }).done(function(data) {
                    console.log(data);

                    // Die Daten des aktuellen Users in den Local Storage speichern
                    localStorage.setItem("kundenLoginUserAktiv", JSON.stringify(data) );

                    // Das Eingabeformular wird geschlossen
                    $(".kundendaten").html() ;
                    $(".kundendaten").css("display", "none");


                }).fail(function(error){
                    console.log(error);
                    alert("Daten konnten nicht gespeichert werden. Es ist ein unbekannter Fehler aufgetreten, veruchen Sie es erneut");
                });
            }
            // Es ist ein kontrollierter Fehler in einer PHP Funktion aufgetreten
            else {
                alert("Daten konnten nicht gespeichert werden. Bitte überprüfen Sie ihre Eingaben nochmals");
            }

        }).fail(function(error){
            console.log(error);
            alert("Daten konnten nicht gespeichert werden. Es ist ein unbekannter Fehler aufgetreten, veruchen Sie es erneut");
        });
    }
})
// Aufgabe war nicht erfolgreich
    .fail(function(){
        alert("Bitte versuchen Sie es erneut");
    });
});
});


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////     EVENTS : Kunden Profil und Neukunden               Formulareingabe FEld schliessen
/////////////////
/////////////////
/////////////////
/////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Button schliessen Eingabeformular Kundendaten - Eingaben alle löschen
$(".kundendaten__form__exit").on('click', function (e) {

    // Das Eingabeformular wird geschlossen
    $(".kundendaten").html() ;
    $(".kundendaten").css("display", "none");
});


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////     EVENTS : kundenLogin               Steuerung der Funktion kunden einloggen, nachdem das HTML nun auf Display : block gestellt wurde
/////////////////
/////////////////
/////////////////
/////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Starten der Funktionen darf erst mglich sein, wenn Dokument geladen ist
$(document).ready(function() {

    // Event : Daten verarbeitung starten durch drücken des Buttons Senden
    // LAden der Logindaten und vergleichen mit Eingabe - wenn eine ünereinstimmung ist und das BEstätigungsmail ausgeführt wurde, so wird eingeloggt
    $(".kundenLogin__form__submit").on('click', function (e) {


        // Das neuladen der Seite verhindern, damit HTML nicht verändert wird, bevor die Anfrage verarbitet wurde
        // e.preventDefault();

        // Eingaben in Local Storage speichern, damit Sie bei der asynchronen Antwort noch vorhanden sind
        localStorage.setItem("kundenLoginUsername", JSON.stringify($(".kundenLogin__form__username").val() ) );
        localStorage.setItem("kundenLoginPasswort", JSON.stringify( $(".kundenLogin__form__password").val() ) );


        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        /////////////////     AJAX CALL :   Abfrage an den Server, ob ein entsprechender User eingelogt ist, wenn ja, so werden dessen DAten geladen
        /////////////////                   Die geladenenen DAten werden in der Ajax Antwort "done" auf ein Valides PAsswort ausgewertet. Dort wird entschieden ob das Login korrekt ist oder nicht
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        // Steuerungvariable API PHP Server beschreiben für Ajax Call
        dataToSend = {
            tabelle: "kunden",
            funktion: "lesen",
            parameter: "suchen",
            spaltenName: "username",
            spaltenWert: $(".kundenLogin__form__username").val(),  // $(".kundenLogin__form__username").val(),
            idZeile: -1,
            updateSpalte: [],
            updateWert: []
        };

        // Start Ajax Call
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
        })
        // Aufgabe war erfolgreich
            .done(function(data) {
                console.log(data);

                // Die Daten speichern, damit Sie in event Bestätigungsmail anfordern noh vorhanden sind
                localStorage.setItem("ajaxDatenAntwort", JSON.stringify(data) );

                // Passwort hasch von Datenbank mit Klarwort Passwort von eingabe vergleichen
                // Die anmeldung ist korrekt - Anmeldedaten mit Serverdaten vergleichen
                // if (data [0]["passwort"] === JSON.parse(localStorage.getItem("kundenLoginPasswort")) ) {
                if (data [0]["passwort"] === CryptoJS.MD5( JSON.parse(localStorage.getItem("kundenLoginPasswort"))).toString() ) {

                    // Schauen ob der Bestätigungslink freigegeben wurde
                    // Die Boolschen Werte False und True werden auf de Datenbank als "number abgesleichert ala 1 und 0
                    // Deshalb auch die Auswertung ensprechend bearbeiten
                    if ( data[0]["loginFreigabe"] === 1) {

                        // Die Daten des aktuellen Users in den Local Storage speichern
                        localStorage.setItem("kundenLoginUserAktiv", JSON.stringify(data) );

                        // Das Fenster Login wird wieder versteckt
                        $(".kundenLogin").css("display", "none") ;
                        // Mitteilung an den User - Anmeldung erfolgreich
                        alert("Anmeldung erfolgreich");
                    }
                    // Sofern die Login Freigabe noch nicht erfolgreich war, wird ein button mit einem Link angezeigt, welcher das erneute senden des mails auslöst
                    // auf Basis der  eingegebenen Kundendaten und deren hinterlegten Emailadresse
                    // Das Mail kann erneut angefordert werden durch drücken dieses Buttons - der event dafür ist
                    else {
                        alert("Anmeldung fehlgeschlagen - Sie müssen zuerst den Account über ihr BEstätigungsemail aktivieren");
                        $(".kundenLogin__form__bestaetigungsMail").css("display", "inline-block");
                        $(".kundenLogin__form__bestaetigungsMail__h6").css("display", "inline-block");
                        $(".kundenLogin__form__bestaetigungsMail__email").css("display", "inline-block");
                    }


                    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                    /////////////////     AJAX CALL :   Den aktuellen Warenkorb des Kunden laden
                    /////////////////                   Die id des Warenkorb wird für das blockieren von Tickets benötigt
                    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

                    // Steuerungvariable API PHP Server beschreiben für Ajax Call
                    dataToSend = {
                        tabelle: "warenkorb",
                        funktion: "lesen",
                        parameter: "suchen",
                        spaltenName: "kunden_id",
                        spaltenWert: data[0]['id'],
                        idZeile: -1,
                        updateSpalte: [],
                        updateWert: []
                    };

                    // Start Ajax Call
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
                    })
                    // id wurde erfolgreich gelesen
                        .done(function(data) {
                            console.log(data);

                            // Die Daten speichern, damit Sie für den Bestellungsvoogang vorhanden sind
                            localStorage.setItem("aktuellerWarenkorb", JSON.stringify(data) );


                            // Der Seiten Reload darf nur geschehen, sofern der angemeldete User auch aktiviert ist. Ansonsten erscheint der Button mit dem BEstätigungsmail nicht
                            // Die Daten speichern, damit Sie in event Bestätigungsmail anfordern noh vorhanden sind
                            kundenLoginUserAktiv = localStorage.getItem("kundenLoginUserAktiv");

                            if ( kundenLoginUserAktiv[0]["loginFreigabe"] === 1) {
                                // Die Seite nochmals neuladen, damit Kundendaten aufgrund Loginwechsel aktualisiert werden
                                document.location.reload(true);
                            }

/*
                            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                            /////////////////     Header Menue oben Fix (Bild Ticket) - Sobald ein Benutzerangemeldet ist, mit Link auf Ticket dessen Verlauf versehen
                            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

                            // Dokument Root pfad lesenaus local Storage
                            var rootPfad = JSON.parse(localStorage.getItem("rootPfad"));

                            // href link
                            var link = rootPfad + '/assets/php/view/gekaufteTickets.php';

                            // Link erstellen und einfügen
                            var element = $("<a class='menue__iconLine__rechts__linkTicketVerlauf'>0</a>");
                            element.attr('href', link);
                            element.appendTo( $(".menue__iconLine__rechts__tickets") );

*/

                        })
                        // Unkontrollierter Fehler vom PHP Server
                        .fail(function(error){
                            console.log(error);
                        });

                }
                // Das Passwort ist falsch
                else {
                    alert("Das Passwort ist falsch. Bitte erneut eingeben oder neues PAsswort anfordern");
                }

                // Eingabefelder wieder löschen
                // $(".kundenLogin").html();

            })
            // Unkontrollierter Fehler vom PHP Server
            .fail(function(error){
                console.log(error);
                alert("Unbekannter Fehler - Bitte versuchen Sie es erneut");

                // Eingabefelder wieder löschen
                // $(".kundenLogin").html();
            });
    });



    // Event : Daten verarbeitung starten durch drücken des Buttons Senden
    // Das Bestätigungsmail welches bei erfassen eines Neukunden geschickt werden sollte, kann nochmals neu angefordert werden
    // Das automatisch generierte Passwort wird an die hinterlegte Email gesendet
    $(".kundenLogin__form__bestaetigungsMail").on('click', function (e) {

        // Passwort hasch von Datenbank mit Klarwort Passwort von eingabe vergleichen
        // Die anmeldung ist korrekt - Anmeldedaten mit Serverdaten vergleichen

        // aktuelle userdaten laden
        ajaxDatenAntwort = JSON.parse(localStorage.getItem("ajaxDatenAntwort"));

        if (ajaxDatenAntwort[0]["passwort"] === CryptoJS.MD5( JSON.parse(localStorage.getItem("kundenLoginPasswort"))).toString() ) {

            // Die Ajax abfrage kann erst gestartet werden, wenn eine valide Email eingegeben wurde
            if( ValidateEmail($(".kundenLogin__form__sendenMail__email").val() ) )  {

                //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                /////////////////     AJAX CALL :   Auftrag an den Server - MAil vershcicken
                /////////////////
                //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

                // Steuerungvariable API PHP Server beschreiben für Ajax Call
                dataToSend = {
                    tabelle: "",
                    funktion: "email_accountBestaetigen",
                    parameter: "",
                    spaltenName: "",
                    spaltenWert: "",
                    idZeile: -1,
                    updateSpalte: [],
                    updateWert: [],
                    datensatz: [ajaxDatenAntwort[0]['username'], JSON.parse(localStorage.getItem("kundenLoginPasswort")), $(".kundenLogin__form__sendenMail__email").val()]
                };

                // Start Ajax Call
                $.ajax({
                    url: rootAjax + 'assets/php/model/ajaxEmail.php',  // rootAjax + 'assets/php/model/ajaxEmail.php'
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
                // Mail wurde  erfolgreich gesendet - das neue PAsswort kann auf der DAtenbank gespeichert werden
                    .done(function(data) {
                        console.log(data);
                        if(data === "true") {
                            alert("Der Account ist Freigegeben");
                        }
                        // Es ist ein fehler aufgetreten
                        else {
                            alert(data);
                        }
                    })
                    // Unkontrollierter Fehler vom PHP Server
                    .fail(function(error){
                        console.log(error);
                        alert("Unbekannter Fehler - Bitte versuchen Sie es erneut");

                        // Eingabefelder wieder löschen
                        // $(".kundenLogin").html();
                    });

            }
            // Keine Valide Email wurde eingebenben
            else {
                alert("Valide Email Eingeben, an welche das BEstätigungsmail verschickt werden soll - Diese Email");
            }
        }

    });





    // Event : Daten verarbeitung starten durch drücken des Buttons Senden
    // Bei klick auf diesen Button wird auf eine php Seite gesprungen, wo die gespeicherte Email angegeben werden m
    // Das automatisch generierte Passwort wird an die hinterlegte Email gesendet
    $(".kundenLogin__form__passwortVergessen").on('click', function (e) {

        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        /////////////////     AJAX CALL :   Kundendaten neu lesen
        /////////////////
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        // Zuerst werden nochmals alle aktuellen DAten geladen - unteranderem das neu geeneriete PAsswort auf dem Server
        // Steuerungvariable API PHP Server beschreiben für Ajax Call
        dataToSend = {
            tabelle: "kunden",
            funktion: "lesen",
            parameter: "suchen",
            spaltenName: "username",
            spaltenWert: $(".kundenLogin__form__username").val(),
            idZeile: -1,
            updateSpalte: [],
            updateWert: []
        };

        // Start Ajax Call
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
        })
        // Aufgabe war erfolgreich
            .done(function(data) {
                // Die Daten speichern, damit Sie in event Bestätigungsmail anfordern noh vorhanden sind
                localStorage.setItem("ajaxDatenAntwort", JSON.stringify(data) );

                // aktuelle userdaten laden
                ajaxDatenAntwort = JSON.parse(localStorage.getItem("ajaxDatenAntwort"));

                // Die aktion wird nur durchgeführt, sofern die korrekt hinterlegte email angegeben wird, welche im Account gespeichert ist
                // Email wurde korrekt eingegeben - der Prozess beginnt
                if(ajaxDatenAntwort[0]['email'] === $(".kundenLogin__form__sendenMail__email").val() ) {

                    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                    /////////////////     AJAX CALL :   Auftrag an den Server - MAil vershcicken
                    /////////////////
                    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

                    // Steuerungvariable API PHP Server beschreiben für Ajax Call
                    dataToSend = {
                        tabelle: "",
                        funktion: "email_passwortVergessen",
                        parameter: "",
                        spaltenName: "",
                        spaltenWert: "",
                        idZeile: -1,
                        updateSpalte: [],
                        updateWert: [],
                        datensatz: [ajaxDatenAntwort[0]['username'], '', $(".kundenLogin__form__sendenMail__email").val()]
                    };

                    // Start Ajax Call
                    $.ajax({
                        url: rootAjax + 'assets/php/model/ajaxEmail.php',  // rootAjax + 'assets/php/model/ajaxEmail.php'
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
                    // Mail wurde  erfolgreich gesendet - das neue PAsswort kann auf der DAtenbank gespeichert werden
                        .done(function(data) {
                            console.log(data);
                            if(data === "true") {
                                alert("Wir haben ein neues Passwort an Ihre hinterlegte E-Mail Adresse versandt");
                            }
                            // Es ist ein fehler aufgetreten
                            else {
                                alert(data);
                            }
                        })
                        // Unkontrollierter Fehler vom PHP Server
                        .fail(function(error){
                            console.log(error);
                            alert("Unbekannter Fehler - Bitte versuchen Sie es erneut");
                        });
                }
                // Falsche Email in Email schreiben FEld
                else {
                    alert("Die eingegebene Email im Feld ist leer oder nicht im Account hinterlegt");
                }

            })
            // Unkontrollierter Fehler vom PHP Server
            .fail(function(error){
                console.log(error);
            });
    });






});


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////     EVENTS : KundenLogin               Formulareingabe FEld schliessen
/////////////////
/////////////////
/////////////////
/////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// Button schliessen Eingabeformular Kundendaten - Eingaben alle löschen
$(".kundenLogin__form__exit").on('click', function (e) {

    // Das Eingabeformular wird geschlossen
    $(".kundenLogin").html() ;
    $(".kundenLogin").css("display", "none");
});





//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////     EVENTS : Neuer kunden erfassen       kunden gibt seine PErsonlien und Logindaten in der gleichen Maske wie Profil ein. Diese werden auf der DAtenbak gespeichert
/////////////////
/////////////////
/////////////////
/////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Starten der Funktionen darf erst mglich sein, wenn Dokument geladen ist
$(document).ready(function() {

    // Event : Daten verarbeitung starten durch drücken des Buttons Senden
    $(".kundendaten__form__neu").on('click', function (e) {


        // Das neuladen der Seite verhindern, damit HTML nicht verändert wird, bevor die Anfrage verarbitet wurde
        e.preventDefault();

        // ariabelndefinitionen
        var passwort = '';
        var username = '';

        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        /////////////////     AJAX CALL :   Abfrage an den Server, aller Userdaten
        /////////////////                   Die geladenenen DAten werden in der Ajax Antwort "done" auf ein Valides PAsswort ausgewertet. Dort wird entschieden ob das Login korrekt ist oder nicht
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        // Steuerungvariable API PHP Server beschreiben für Ajax Call
        dataToSend = {
            tabelle: "kunden",
            funktion: "lesen",
            parameter: "alle",
            spaltenName: "",
            spaltenWert: "",
            idZeile: -1,
            updateSpalte: "",
            updateWert: []
        };

        // Start Ajax Call
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
        })
        // Aufgabe war erfolgreich - die aktuellen DAten wurden geladen
        // Nun kann dieEingabevalideiung statfinden
            .done(function(data) {

                //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                /////////////////     Eingabe Validierungen
                //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

                // Hilfsvariablen
                var passwortGut = false;
                var usernameGut = false;
                var emailGut = false;
                var NameGut = false;
                var adresseGut = false;
                var newsletterJaNein = false;

                //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                /////////////////     PASSWORT :    muss mit Eingabe Bestätigung übereinstimmen, minimal 6 Zeichen und mindestens ein Sonderzeichen und ein Grossbuchstabe müssen vorkommen
                /////////////////
                //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

                // Passworteingabe aus Formualar - alle Leerzeilen werden entfernt
                passwort = $(".kundendaten__form__password").val().replace(/\s/g,'');


                // Mit dieser Zeile wird einerseits ein Objekt regExp erstellt und anderseits wird dies gleich mit einem Regulärem Ausdruck initialisierten
                // \W = alles ausser Zahl, kleinbuschstaben oder Brossbuchstaben          {1,} = minimal ein Vorkommen nötig        [A-Z] = grossbichstaben
                // Es können nicht beide Zeichen in einen Ausgruck genommen werden, sonst ist die Reihenfolge definiert, welches ZEichen zuers kommen muss
                var regulaerAusdruck_1 = /\W{1,}/;
                var regulaerAusdruck_2 = /[A-Z]{1,}/;
                var regulaerAusdruck_3 = /[a-z]{1,}/;
                var regulaerAusdruck_4 = /[0-9]{1,}/;
                var regulaerAusdruck_5 = /[äÄöÖüÜß]/; // Muss in if negiert werden

                // Damit kein Fehler auftaucht, sofern das Element noch gar nicht exisiert
                if ( passwort !== '' && passwort !== null  && passwort !== undefined  ) {

                    // überprüfen der minimalen Passwortlänge
                    // überprüfen der Regulären Ausdrüke
                    // überprüfen ob beide Passwortfelder die gleiche Eingabe haben
                    if (passwort.length > 5 && regulaerAusdruck_1.test(passwort) && regulaerAusdruck_2.test(passwort) && regulaerAusdruck_3.test(passwort) &&
                        regulaerAusdruck_4.test(passwort) && !regulaerAusdruck_5.test(passwort)  ) {

                        // Beide Regulärer Ausdrücke sind erfüllt
                        passwortGut = true;
                    }
                    // Passwort ist nicht nach den vorgegebenen Regeln eingegeben worden
                    else {
                        alert("Das eingegebene Passwort ist nicht gültig")
                    }
                }
                // Passwortfeld darf nicht leer sein
                else {
                    alert ("Das Passwortfeld muss ausgefüllt werden");
                }

                //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                /////////////////     Kontrolle ob Username bereits vergeben ist - Gross und Kleinschrift wird nicht berücksichtig - in diesem Falle gilt das name ebenfalls als besetzt
                //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

                // Unernameeingabe aus Formualar - alle Leerzeilen werden entfernt
                username = $(".kundendaten__form__username").val().replace(/\s/g,'');

                // Damit kein Fehler auftaucht, sofern das Element noch gar nicht exisiert
                if ( username !== '' && username !== null  && username !== undefined  ) {

                    // Diese Schleife wird nur gemacht, sofern midesten ein Datensatz vorhanden ist
                    if ( data.length > 0 && data !== null  && data !== undefined) {

                        // Username wurde geändert - üerprüfung nötig ob bereits vergeben
                        for (var i = 0; i < data.length; i++) {

                            // Sobald eine übereinstimm gefunden wird, wird die Schalufe beendet und eine Variable herausgegeben
                            if ( username.toLowerCase() === data[i]["username"].toLowerCase()) {
                                usernameGut = false;
                                alert("Der Username ist bereits vergeben");
                                break;
                            }
                            // username ist korrekt
                            else {
                                usernameGut = true;
                            }
                        }
                    }
                    // Wenn data leer ist, so sind noch keine Kunden registriert. In diesem Falle muss keine Vergleich gemacht werden da der USername sicher noch rei ist
                    else {
                        usernameGut = true;
                    }
                }
                // Usernamefeld ist leer
                else {
                    alert("Das Feld USername muss ausgefüllt sein");
                }


                //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                /////////////////     Emailadresse : Feld muss mit einer korrekten Email aufgefüllt sein. Es wird ein Bestätigungslink geschickt - erst danach ist der Account freigeschaltet
                /////////////////     Ich habe die Email Validierung nicht slebergemacht, sonern aus einer Seite im Internet kopiert :
                /////////////////     http://www.w3resource.com/javascript/form/email-validation.php
                //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


                // Email muss eine valide form haben - DAzu mit einem Regulären Ausdruck maskieren und vergleichen
                if ( ValidateEmail( $(".kundendaten__form__email").val() ) ){
                    emailGut = true;
                }
                // Email ist nicht Valide
                else {
                    alert("Email ist nicht Valide - Bitte korrigieren");
                }


                //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                /////////////////     Kontrolle ob Namensfelder belegt sind
                //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

                //
                if ( $(".kundendaten__form__vorname").val() !== '' && $(".kundendaten__form__nachname").val() !== '' ) {
                    NameGut = true;
                }
                // Feld darf nicht ller sein
                else {
                    alert("Bitte Felder Vorname und Nachname ausfüllen ");
                }

                //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                /////////////////     Kontrolle ob Adressfelder belegt sind
                //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

                //
                if ( $(".kundendaten__form__strasse").val() !== '' && $(".kundendaten__form__platz").val() !== '' && $(".kundendaten__form__ort").val() !== '' ) {
                    adresseGut = true;
                }
                // Feld darf nicht ller sein
                else {
                    alert("Bitte Felder Strasse Platz und Ort ausfüllen ");
                }

                //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                /////////////////     Newsletter - Datenbank erwartet einen Datentyp bool, daher string in Bool umwandeln
                //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

                // Newsletter hat Wert "ja", demnach boolschenwert = true
                if( $(".kundendaten__form__newsletter [checked = checked]").val() === "Ja" ) {
                    newsletterJaNein = true;
                }
                // Newsletter hat Wert "Nein", demnach boolschenwert = false
                else {
                    newsletterJaNein = false;
                }

                //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                /////////////////
                /////////////////     Ajax abfrage:     kundendaten auf Server speichern
                /////////////////
                //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

                // Ajax Zugriff zum speichern der Daten darf esrt geschen, sobald alle DAten richtig eingegeben wurden
                if (passwortGut && usernameGut && emailGut && NameGut && adresseGut) {

                    // NEU kunden - DATEN AUF SERVER SPEICHERN
                    // Auf diese Weise wird dem PHP Server die Aufgabe mitgeteilt
                    var dataToSend = {
                        tabelle         : "kunden",
                        funktion        : "schreiben",
                        parameter       : "",
                        spaltenName     : "",
                        spaltenWert     : "",
                        idZeile         : -1 ,
                        updateSpalte    : [],
                        updateWert      : [],
                        datensatz       : [ $(".kundendaten__form__anrede").val(),  $(".kundendaten__form__vorname").val(), $(".kundendaten__form__nachname").val(), $(".kundendaten__form__email").val(),
                                            username, passwort, $(".kundendaten__form__telefon").val(), $(".kundendaten__form__strasse").val(), $(".kundendaten__form__zusatz").val(), $(".kundendaten__form__platz").val(),
                                            $(".kundendaten__form__ort").val(), newsletterJaNein ]
                    };

                    // Das Array mit den Sendedaten im local Storage speichern, da die DAten noch gebraucht werden
                    localStorage.setItem("ajaxDatenSenden", JSON.stringify(dataToSend) );


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
                        headers: {'Authorization': 'Basic ' + btoa('admin:diplomarbeit')
                        }

                    }).done(function(data) {
                        console.log(data);
                        // Speichern der kundendaten auf DAtenbank war erfolgreich
                        // Die Daten sind lokal noch    NICHT    in die Variable "kundenLoginUserAktiv" gespeichert
                        if (data === "true") {

                            // Die Daten aus dem Local Storage sind JSON, da nur Strings und keine Objekte gespeihert werden können
                            ajaxDatenSenden = JSON.parse(localStorage.getItem("ajaxDatenSenden"));

                            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                            /////////////////
                            /////////////////     Ajax Auftrag:     Dem Kunden mmuss ein Email mit dem BEstätigungslink geschickt werden
                            /////////////////
                            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

                            // Steuerungvariable API PHP Server beschreiben für Ajax Call
                            dataToSend = {
                                tabelle: "",
                                funktion: "email_accountBestaetigen",
                                parameter: "",
                                spaltenName: "",
                                spaltenWert: "",
                                idZeile: -1,
                                updateSpalte: "",
                                updateWert: "",
                                datensatz: [username, passwort, $(".kundendaten__form__email").val()]
                            };

                            // Start Ajax Call
                            $.ajax({
                                url: rootAjax + 'assets/php/model/ajaxEmail.php',  // rootAjax + 'assets/php/model/ajaxEmail.php'
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
                                // Der Email versand wurde ausgelöst
                                if (data === "true") {
                                    // Auf dem Server wird ein Mail mit einem Bestätigungslink versendet an die eingegebene Emails Adresse
                                    alert("Sie werden in Kürze ein Email erhalten mit dem Link. Sollten Sie keines erhalten, so loggen Sie sich bitte ein und klicken dann auf den Button \"Bestätigungslink anforder\" um diesen Vorgang zu wiederholen");

                                    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                    /////////////////     AJAX CALL :   aktuelle Kundendaten lesen - Kunden id wird gebraucht für erstellung warenkorb
                                    /////////////////
                                    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

                                    // Steuerungvariable API PHP Server beschreiben für Ajax Call
                                    dataToSend = {
                                        tabelle: "kunden",
                                        funktion: "lesen",
                                        parameter: "suchen",
                                        spaltenName: "username",
                                        spaltenWert: username,
                                        idZeile: -1,
                                        updateSpalte: [],
                                        updateWert: []
                                    };

                                    console.log(dataToSend);

                                    // Start Ajax Call
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
                                    })
                                    // Aufgabe war erfolgreich - die aktuellen DAten wurden geladen
                                    // Nun kann dieEingabevalideiung statfinden
                                        .done(function(data) {
                                            console.log(data);

                                            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                            /////////////////     AJAX CALL :   Warenkorb für diesen Kunde erstellen
                                            /////////////////
                                            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

                                            // Steuerungvariable API PHP Server beschreiben für Ajax Call
                                            dataToSend = {
                                                tabelle: "warenkorb",
                                                funktion: "schreiben",
                                                parameter: "",
                                                spaltenName: "",
                                                spaltenWert: "",
                                                idZeile: -1,
                                                updateSpalte: "",
                                                updateWert: [],
                                                datensatz: [ data[0]["id"] ]
                                            };

                                            // Start Ajax Call
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
                                            })
                                            // Aufgabe war erfolgreich - die aktuellen DAten wurden geladen
                                            // Nun kann dieEingabevalideiung statfinden
                                                .done(function(data) {
                                                    console.log(data);

                                                }).fail(function(error){
                                                console.log(error);
                                            });

                                        }).fail(function(error){
                                        console.log(error);
                                    });
                                }

                            }).fail(function(error){
                                console.log(error);
                                alert("Das Email konnte nicht verschickt werden. Es ist ein unbekannter Fehler aufgetreten, veruchen Sie es erneut");
                            });

                            // Auf dem Server wird ein Mail mit einem Bestätigungslink versendet an die eingegebene Emails Adresse
                            // Erst nachdem dieses BEstätigungsmail ausgeführt wurde, ist der Link freigeschaltet
                            alert("Daten wurden erfolgreich gespeichert.");

                            // Fenster schliessen sobald erfolgreich gespeichert werden konnte
                            $(".kundendaten").css("display", "none");

                        }
                        // Es ist ein kontrollierter Fehler in einer PHP Funktion aufgetreten
                        else {
                            alert("Daten konnten nicht gespeichert werden. Bitte überprüfen Sie ihre Eingaben nochmals");
                        }

                    }).fail(function(error){
                        console.log(error);
                        alert("Daten konnten nicht gespeichert werden. Es ist ein unbekannter Fehler aufgetreten, veruchen Sie es erneut");
                    });
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
/////////////////     FUNKTIONS - DEFINITIONEN
/////////////////
/////////////////
/////////////////
/////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// Email Validierern  -  kopiert aus Internetseite : http://www.w3resource.com/javascript/form/email-validation.php
function ValidateEmail(mail)
{
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail) )
    {
        return true;
    }
    return false;
}

/*
 // HTML Entities welche ich in PHP gemacht haben, wieder decodieren
 // Diese Funktion habe ich kopiert aus der  Internetseite : https://www.bram.us/2008/03/11/javascript-html_entity_decode/
 function str) {
 var ta = document.createElement("textarea");
 ta.innerHTML=str.replace(/</g,"&lt;").replace(/>/g,"&gt;");
 toReturn = ta.value;
 ta = null;
 return toReturn
 }
 */

