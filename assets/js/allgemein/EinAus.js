
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////     Funktionen können für verschiedene Aufgaben geladen werden  /////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



// Funktion zum Ein und Auslbleden eines Elementes, über ein selbst erstelltes Attribut
// Diese Funktion kann für verschiedene Menues Gebraucht werden - Für das  Flyout Menu und auch für das Filter MEnue und das Footer Menue
function MenueEinAus(htmlKlasse) {

    // HTML Referenz per Klasse mit Dommanipulation laden
    var Menue = htmlKlasse;

    // Zustand des selbst erstellen Attributes ermitteln, welches gebraucht wird, um das  Menue zu öffen oder schliessen
    // Der Zusatnd des Attributtes wird beim jedem Start der Funktion getoggelt (das heisst EIN -AUS -EIN -AUS ... etc)
    var MenueZustand = Menue.attr('data-MenueActive');


    // Wenn Wert des Attribut false ist, dann wird Wert auf true gesetzt und das  Menue erscheint
    if (MenueZustand === 'true') {
        Menue.css("display", "none");
        Menue.attr('data-MenueActive', 'false');
    }
    // Andern Falls wird  Menue angezeigt
    // Dies funktiert auch, wenn Attribut noch gar nicht existiert ist
    else {
        Menue.css("display", "block");
        Menue.attr('data-MenueActive', 'true');
    }
}




// Funktion zum ändern eines selbst erstellen Attributtes. Im gegensatz zum MEnueEinAus wird kein Display Block angewendet
// Diese Funktion mach einen toogle auf ein selbst erstelles Attributt und gigt als Returnwert den aktuellen Zustand aus
function ElementEinAus(htmlKlasseChild, string_attributtsname, string_colorAktiv, string_colorInaktiv) {

    // HTML Referenz per Klasse mit Dommanipulation laden
    var element = htmlKlasseChild; // Einzel Element welches gerade angeklickt wird


    // Variable zum zwishenspeichern des aktuellen Zustandes
    var elementEndZustand ;


    // Zustand des selbst erstellen Attributes ermitteln, welches gebraucht wird, um das  Menue zu öffen oder zu schliessen
    // Der Zustand des Attributtes wird beim jedem Start der Funktion getoggelt (das heisst EIN -AUS -EIN -AUS ... etc)
    var elementStartZustand = element.attr(string_attributtsname);


    // Wenn Wert des Attribut "false" ist, dann wird Wert auf "true" gesetzt und das  Menue erscheint
    if (elementStartZustand === 'true') {
        element.attr(string_attributtsname, 'false');
        element.css( "color", string_colorInaktiv);
        elementEndZustand = 'false';

    }
    // Andern Falls wird  Menue angezeigt
    // Dies funktiert auch, wenn Attribut noch gar nicht existiert ist
    else {
        element.attr(string_attributtsname, 'true');
        element.css("color", string_colorAktiv);
        elementEndZustand = 'true';
    }

    // TRUE = ELEMENT AKTIV    / FALSE = ELEMENT INAKTIV
    return elementEndZustand;

}


// Dies Funktion bindet einen neuen Event Handler ein
// Dieser reagiert auf einen Wechsel im HTML inhalt. Ich habe diesen von der fogenden Seite kopiert : https://stackoverflow.com/questions/15657686/jquery-event-detect-changes-to-the-html-text-of-a-div
function changeHtml(selector, html) {
    var elem = $(selector);
    jQuery.event.trigger('htmlchanging', { elements: elem, content: { current: elem.html(), pending: html} });
    elem.html(html);
    jQuery.event.trigger('htmlchanged', { elements: elem, content: html });
}




/*
 // Diese Funktion wird relativ zu einem Container Element positioniert.
 // Es werden ein Container mt mehreren Unerdivs erstellt
 function subMenuContainer(htmlKlasse, htmlParent, array_stringNamesSubDivs) {  // array_stringNamesSubDivs

 // Position des Eltern Elementes ermitteln, an welches dieses Elemnt ausgerichtet wird
 var offsets = htmlParent.offset();
 var breite =  htmlParent.width();
 var hoehe = htmlParent.height();

 // Klassenname aus jquery Element ermitteln
 var containerClassName = htmlKlasse.attr('class');

 // Positionierung und breite an PAren Element ausrichten
 htmlKlasse.css("position", "relative");
 htmlKlasse.css("top", offsets.top + hoehe);
 htmlKlasse.css("left", offsets.left );
 htmlKlasse.css("width", breite);

 // Zuerst muss die aktuelle Ausgabe gelöscht werden, damit der DOM Baum neu aufgebaut weerden kann
 htmlKlasse.children().remove();

 // Alle Elemente aus Array erstellen
 for (var i=0; i < array_stringNamesSubDivs.length; i++) {

 // Div Element erstellen und an Container Element verknüpfen
 var element = $("<div</div>").appendTo(htmlKlasse);
 element.html( array_stringNamesSubDivs[i] );
 element.attr('class', containerClassName + '__element' + i);
 element.css("position", "relative");
 element.css("width", breite);
 }
 }
 */