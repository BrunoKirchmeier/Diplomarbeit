

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////     MENUE FLYOUT              Hauptnavigation in Mobile First Variante
/////////////////                               HTML Page : header.php
/////////////////
/////////////////     MENUE FILTERKRITERIEN     Mit diesem MEnue können die Filterkriterien ausgelesen werden. Es ist ein Slide down Menue (orgel)
/////////////////                               HTML Page : header.php
/////////////////
/////////////////     FUNKTIONS - AUFRUFE
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// MENUE FLYOUT
// DOM Selektoren
var iconHamburgerMenueFlyout = $(".menue__iconLine__rechts__nav"); // Aktionsbutton zum starten und verlassen des Flyout Menue
var menueFlyout = $(".menue__flyout"); // Parent Klasse mit eigentlichem Inhalt von Flyout Menue




// MENUE FLYOUT
// Starten der Funktionen darf erst mglich sein, wenn Dokument geladen ist
$(document).ready(function() {

    // Offnen oder schliessen des HAuptnaviagtions Menues im Mobile First Flyout Menue
    iconHamburgerMenueFlyout.on('click', function () {
        MenueEinAus(menueFlyout);
    });

});





// MENUE FILTERKRITERIEN
// DOM Selektor für starten Menu
var iconHamburgerMenueFilterkriterien = $(".contentBandListFilter__rechts"); // Aktionsbutton zum starten und verlassen des Flyout Menue

// MENUE FILTERKRITERIEN
// Filterkriterien Menue Dropdown - Untergatekorien schliessen oder öffen bei Klick - HTML Page : index.php
var menueFilterkriterienContainer = $(".contentBandListFilterDropdown"); // // Parent Klasse mit eigentlichem Inhalt von Filterkriterium Menue
var menueFilterkriterienKategorienText = $(".contentBandListFilterDropdown__kat__text"); // Aktionsbutton zum starten und verlassen des Flyout Menue
var menueFilterkriterienElemente = $(".contentBandListFilterDropdown__element"); // // Parent Klasse mit eigentlichem Inhalt von Filterkriterium Menue


// MENUE FILTERKRITERIEN
// Starten der Funktionen darf erst mglich sein, wenn Dokument geladen ist
$(document).ready(function() {

    // Offnen oder schliessen des Menues zum einstellen der Filterkriterien
    iconHamburgerMenueFilterkriterien.on('click', function () {
        MenueEinAus(menueFilterkriterienContainer);
    });


    // Unterkategorien offen oder schliessen innerhalb des Filtermenues
    menueFilterkriterienKategorienText.on('click', function () {
        // Im Selektor sind zunächst mehrere Element mit dem gleichen Klassennamen enthalten. Mit eq kann nur einer ausgewählt werden über einen nteger
        // Ausgeweählt wird der aktuelle Div mittels des this operators
        MenueEinAus( $(this).next() );  // ALT : menueFilterkriterienKategorienList.eq( $(this).index() ) )  NEU : $(this).next()
    });


    // Setzen des aktiven Filterkriteriums durch klicken auf das Element. Es kann nur ein Kriterium gesetzt werden, alle anderen werden zurückgesetzt
    // Danach wird gleich die Funktion gestartet welche die BAnds auflistet
    menueFilterkriterienElemente.on('click', function (e) {

        // Wird this in der Funktion direkt aufgerufen, so ist der namespase falsch
        var html = $(this);

        // Zuerst weden alle Kriterien zurückgesetzt, dannach wird das aktuelle gesetzt
        menueFilterkriterienElemente.attr('data-FilterActive', 'false') ;
        menueFilterkriterienElemente.css("color", "white");

        // Das aktive Element mit dem eingegebenen attributt auf true setzen
        ElementEinAus(html, 'data-FilterActive', "red", "white");

        // Sobald ein Kriterium angeklickt wurde, menue wieder schliessen
        MenueEinAus( menueFilterkriterienContainer );

    });

});




//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////     FUNKTIONS - DEFINITIONEN
/////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/*               siehe in ORdner :   JS: Allgemein  */