
<!-- Pfad Konfigurationen -->
<?php
// Rootverzeichnisse für relative Pfade, damit bei Include der PFad immer korrekt ist
$pathRoot_index = '../../../';
$pathRoot_phpView = '../../../assets/php/view/';
$pathRoot_img = '../../../assets/images/';
$pathRoot_js = '../../../assets/js/';
$pathRoot_npm = '../../../';
$pathRoot_css = '../../../assets/css/';
// phpinfo();
?>

<!-- Header laden -->
<?php include '../../../assets/php/view/adminHeader.php'; ?>
<br>
<h3>Ticketeinträge verwalten: </h3>


<!-- Neuen Eintrag erstellen -->
<button class="adminTicketListErstellen__neu">Neuen Eintrag erfassen</button>
<br>
<br>

<!-- Hier wird die aktuelle Ticketliste als übersicht dargestellt -->
<!-- Jedoch nur, wenn ein aktiver Administrator angemeldet ist -->
<div class="adminTicketList"></div>


<!-- Detailansicht eines einzelnen Beitrages -->
<!-- Jedoch nur, wenn ein aktiver Administrator angemeldet ist -->
<div class="adminTicketDetails">

    <!-- Änderungen speichern -->
    <button class="adminTicketDetails__speichern">Änderungen speichern</button>
    <!-- Zurück  -->
    <button class="adminTicketDetails__zurueck">Zurück</button>


    <!-- Element id -->
    <div class="adminTicketDetails__container adminTicketDetails__id"><h3>id</h3>
        <div class="adminTicketDetails__container__links"></div>
        <div class="adminTicketDetails__container__rechts">
            <div class="adminTicketDetails__aktuell adminTicketDetails__id"></div>
        </div>
    </div>
    <!-- Element Bild -->
    <div class="adminTicketDetails__container adminTicketDetails__bild"><h3>bild</h3>
        <div class="adminTicketDetails__container__links"></div>
        <div class="adminTicketDetails__container__rechts">
            <div class="adminTicketDetails__aktuell adminTicketDetails__bild"></div>
            <div class="adminTicketDetails__neu">
                <input class="adminTicketDetails__neu adminTicketDetails__bild" type="text" placeholder="Neuer Pfad angeben">
            </div>
        </div>
    </div>
    <!-- Element Titel -->
    <div class="adminTicketDetails__container adminTicketDetails__titel"><h3>title</h3>
        <div class="adminTicketDetails__container__links"></div>
        <div class="adminTicketDetails__container__rechts">
            <div class="adminTicketDetails__aktuell adminTicketDetails__titel"></div>
            <div class="adminTicketDetails__neu">
                <input class="adminTicketDetails__neu adminTicketDetails__titel" type="text" placeholder="Neue Eingabe">
            </div>
        </div>
    </div>
    <!-- Element Beschreibung  -->
    <div class="adminTicketDetails__container adminTicketDetails__beschreibung"><h3>beschreibung</h3>
        <div class="adminTicketDetails__container__links"></div>
        <div class="adminTicketDetails__container__rechts">
            <div class="adminTicketDetails__aktuell adminTicketDetails__beschreibung"></div>
            <div class="adminTicketDetails__neu">
                <textarea class="adminTicketDetails__neu adminTicketDetails__beschreibung" placeholder="Neuer Inhalt"></textarea>
            </div>
        </div>
    </div>
    <!-- Element Datum  -->
    <div class="adminTicketDetails__container adminTicketDetails__datum"><h3>eventDatum</h3>
        <div class="adminTicketDetails__container__links"></div>
        <div class="adminTicketDetails__container__rechts">
            <div class="adminTicketDetails__aktuell adminTicketDetails__datum"></div>
            <div class="adminTicketDetails__neu">
                <input class="adminTicketDetails__neu adminTicketDetails__datum" type="text" maxlength="4" placeholder="yyyy">
                <input class="adminTicketDetails__neu adminTicketDetails__datum" type="text" maxlength="2" placeholder="mm">
                <input class="adminTicketDetails__neu adminTicketDetails__datum" type="text" maxlength="2" placeholder="dd">
            </div>
        </div>
    </div>
    <!-- Element Zeit  -->
    <div class="adminTicketDetails__container adminTicketDetails__zeit"><h3>eventZeit</h3>
        <div class="adminTicketDetails__container__links"></div>
        <div class="adminTicketDetails__container__rechts">
            <div class="adminTicketDetails__aktuell adminTicketDetails__zeit"></div>
            <div class="adminTicketDetails__neu">
                <input class="adminTicketDetails__neu adminTicketDetails__zeit" type="text" maxlength="2" placeholder="hh">
                <input class="adminTicketDetails__neu adminTicketDetails__zeit" type="text" maxlength="2" placeholder="mm">
            </div>
        </div>
    </div>
    <!-- Element Ort  -->
    <div class="adminTicketDetails__container adminTicketDetails__ort"><h3>eventOrt</h3>
        <div class="adminTicketDetails__container__links"></div>
        <div class="adminTicketDetails__container__rechts">
            <div class="adminTicketDetails__aktuell adminTicketDetails__ort"></div>
            <div class="adminTicketDetails__neu">
                <input class="adminTicketDetails__neu adminTicketDetails__ort" type="text" placeholder="Neue  Eingabe">
            </div>
        </div>
    </div>
    <!-- Element Adresse  -->
    <div class="adminTicketDetails__container adminTicketDetails__adresse"><h3>eventAdresse</h3>
        <div class="adminTicketDetails__container__links"></div>
        <div class="adminTicketDetails__container__rechts">
            <div class="adminTicketDetails__aktuell adminTicketDetails__adresse"></div>
            <div class="adminTicketDetails__neu">
                <input class="adminTicketDetails__neu adminTicketDetails__adresse" type="text" placeholder="Neue  Eingabe">
            </div>
        </div>
    </div>
    <!-- Element Ticket Preis  -->
    <div class="adminTicketDetails__container adminTicketDetails__ticketpreis"><h3>Ticketpreis</h3>
        <div class="adminTicketDetails__container__links"></div>
        <div class="adminTicketDetails__container__rechts">
            <div class="adminTicketDetails__aktuell adminTicketDetails__ticketpreis"></div>
            <div class="adminTicketDetails__neu">
                <input class="adminTicketDetails__neu adminTicketDetails__ticketpreis" type="number" placeholder="Neue  Eingabe">
            </div>
        </div>
    </div>
    <!-- Element maxAnzahlTickets   -->
    <div class="adminTicketDetails__container adminTicketDetails__maximaleAnzahlTickets"><h3>Zu verkaufende Anzahl Tickets</h3>
        <div class="adminTicketDetails__container__links"></div>
        <div class="adminTicketDetails__container__rechts">
            <div class="adminTicketDetails__aktuell adminTicketDetails__maximaleAnzahlTickets"></div>
            <div class="adminTicketDetails__neu">
                <input class="adminTicketDetails__neu adminTicketDetails__maximaleAnzahlTickets" type="number" placeholder="Neue Eingabe">
            </div>
        </div>
    </div>
    <!-- Element verkauftAnzTickets   -->
    <div class="adminTicketDetails__container adminTicketDetails__verkaufteAnzahlTickets"><h3>Bereits verkaufte Tickets</h3>
        <div class="adminTicketDetails__container__links"></div>
        <div class="adminTicketDetails__container__rechts">
            <div class="adminTicketDetails__aktuell adminTicketDetails__verkaufteAnzahlTickets"></div>
            <div class="adminTicketDetails__neu">
                <input class="adminTicketDetails__neu adminTicketDetails__verkaufteAnzahlTickets" type="number" placeholder="Neue Eingabe">
            </div>
        </div>
    </div>
    <!-- Element startDatumTicketVerkauf -->
    <div class="adminTicketDetails__container adminTicketDetails__startDatumTicketVerkauf"><h3>Start Datum Freigabe Ticket Verkauf</h3>
        <div class="adminTicketDetails__container__links "></div>
        <div class="adminTicketDetails__container__rechts">
            <div class="adminTicketDetails__aktuell adminTicketDetails__startDatumTicketVerkauf"></div>
            <div class="adminTicketDetails__neu">
                <input class="adminTicketDetails__neu adminTicketDetails__startDatumTicketVerkauf" type="text" maxlength="4" placeholder="yyyy">
                <input class="adminTicketDetails__neu adminTicketDetails__startDatumTicketVerkauf" type="text" maxlength="2" placeholder="mm">
                <input class="adminTicketDetails__neu adminTicketDetails__startDatumTicketVerkauf" type="text" maxlength="2" placeholder="dd">
            </div>
        </div>
    </div>
    <!-- Element endDatumTicketVerkauf -->
    <div class="adminTicketDetails__container adminTicketDetails__endDatumTicketVerkauf"><h3>End Datum Freigabe Ticket Verkauf</h3>
        <div class="adminTicketDetails__container__links"></div>
        <div class="adminTicketDetails__container__rechts">
            <div class="adminTicketDetails__aktuell adminTicketDetails__endDatumTicketVerkauf"></div>
            <div class="adminTicketDetails__neu">
                <input class="adminTicketDetails__neu adminTicketDetails__endDatumTicketVerkauf" type="text" maxlength="4" placeholder="yyyy">
                <input class="adminTicketDetails__neu adminTicketDetails__endDatumTicketVerkauf" type="text" maxlength="2" placeholder="mm">
                <input class="adminTicketDetails__neu adminTicketDetails__endDatumTicketVerkauf" type="text" maxlength="2" placeholder="dd">
            </div>
        </div>
    </div>
    <!-- Element maxTicketsProKauf -->
    <div class="adminTicketDetails__container adminTicketDetails__maxTicketsProKauf"><h3>Maximale Anzahl Tickets die pro Kaufauftrag gewählt werden können</h3>
        <div class="adminTicketDetails__container__links"></div>
        <div class="adminTicketDetails__container__rechts">
            <div class="adminTicketDetails__aktuell adminTicketDetails__maxTicketsProKauf"></div>
            <div class="adminTicketDetails__neu">
                <input class="adminTicketDetails__neu adminTicketDetails__maxTicketsProKauf" type="number"  placeholder="Eingabe">
            </div>
        </div>
    </div>
    <!-- Element erstell Datum  -->
    <div class="adminTicketDetails__container adminTicketDetails__createTime"><h3>Erstellungs Datum</h3>
        <div class="adminTicketDetails__container__links"></div>
        <div class="adminTicketDetails__container__rechts">
            <div class="adminTicketDetails__aktuell adminTicketDetails__createTime"></div>
        </div>
    </div>
    <!-- Element Letztes update der DAten -->
    <div class="adminTicketDetails__container adminTicketDetails__updateTime"><h3>Datum des Letztes Update</h3>
        <div class="adminTicketDetails__container__links"></div>
        <div class="adminTicketDetails__container__rechts">
            <div class="adminTicketDetails__aktuell adminTicketDetails__updateTime"></div>
        </div>
    </div>
    <!-- Element Administrator letzte Aenderungen -->
    <div class="adminTicketDetails__container adminTicketDetails__administrator"><h3>Administrator des letzten updates</h3>
        <div class="adminTicketDetails__container__links"></div>
        <div class="adminTicketDetails__container__rechts">
            <div class="adminTicketDetails__aktuell adminTicketDetails__administrator"></div>
        </div>
    </div>

</div>


<!-- Neuen Eintrag erstellen -->
<div class="adminTicketListErstellen">

    <!-- Änderungen speichern -->
    <button class="adminTicketListErstellen__speichern">Speichern</button>
    <!-- Zurück  -->
    <button class="adminTicketListErstellen__zurueck">Zurück</button>

    <!-- Element Bild -->
    <div class="adminTicketListErstellen__container adminTicketListErstellen__bild"><h3>bild</h3>
        <div class="adminTicketListErstellen__container__links"></div>
        <div class="adminTicketListErstellen__container__rechts">
            <div class="adminTicketListErstellen__neu">
                <input class="adminTicketListErstellen__neu adminTicketListErstellen__bild" type="text" placeholder="Pfad angeben">
            </div>
        </div>
    </div>
    <!-- Element Titel -->
    <div class="adminTicketListErstellen__container adminTicketListErstellen__titel"><h3>title</h3>
        <div class="adminTicketListErstellen__container__links"></div>
        <div class="adminTicketListErstellen__container__rechts">
            <div class="adminTicketListErstellen__neu">
                <input class="adminTicketListErstellen__neu adminTicketListErstellen__titel" type="text" placeholder="Neue Eingabe">
            </div>
        </div>
    </div>
    <!-- Element Beschreibung  -->
    <div class="adminTicketListErstellen__container adminTicketListErstellen__beschreibung"><h3>beschreibung</h3>
        <div class="adminTicketListErstellen__container__links"></div>
        <div class="adminTicketListErstellen__container__rechts">
            <div class="adminTicketListErstellen__neu">
                <textarea class="adminTicketListErstellen__neu adminTicketListErstellen__beschreibung" placeholder="Inhalt"></textarea>
            </div>
        </div>
    </div>
    <!-- Element Datum  -->
    <div class="adminTicketListErstellen__container adminTicketListErstellen__datum"><h3>eventDatum</h3>
        <div class="adminTicketListErstellen__container__links"></div>
        <div class="adminTicketListErstellen__container__rechts">
            <div class="adminTicketListErstellen__neu">
                <input class="adminTicketListErstellen__neu adminTicketListErstellen__datum" type="text" maxlength="4" placeholder="yyyy">
                <input class="adminTicketListErstellen__neu adminTicketListErstellen__datum" type="text" maxlength="2" placeholder="mm">
                <input class="adminTicketListErstellen__neu adminTicketListErstellen__datum" type="text" maxlength="2" placeholder="dd">
            </div>
        </div>
    </div>
    <!-- Element Zeit  -->
    <div class="adminTicketListErstellen__container adminTicketListErstellen__zeit"><h3>eventZeit</h3>
        <div class="adminTicketListErstellen__container__links"></div>
        <div class="adminTicketListErstellen__container__rechts">
            <div class="adminTicketListErstellen__neu">
                <input class="adminTicketListErstellen__neu adminTicketListErstellen__zeit" type="text" maxlength="2" placeholder="hh">
                <input class="adminTicketListErstellen__neu adminTicketListErstellen__zeit" type="text" maxlength="2" placeholder="mm">
            </div>
        </div>
    </div>
    <!-- Element Ort  -->
    <div class="adminTicketListErstellen__container adminTicketListErstellen__ort"><h3>eventOrt</h3>
        <div class="adminTicketListErstellen__container__links"></div>
        <div class="adminTicketListErstellen__container__rechts">
            <div class="adminTicketListErstellen__neu">
                <input class="adminTicketListErstellen__neu adminTicketListErstellen__ort" type="text" placeholder="Neue  Eingabe">
            </div>
        </div>
    </div>
    <!-- Element Adresse  -->
    <div class="adminTicketListErstellen__container adminTicketListErstellen__adresse"><h3>eventAdresse</h3>
        <div class="adminTicketListErstellen__container__links"></div>
        <div class="adminTicketListErstellen__container__rechts">
            <div class="adminTicketListErstellen__neu">
                <input class="adminTicketListErstellen__neu adminTicketListErstellen__adresse" type="text" placeholder="Neue  Eingabe">
            </div>
        </div>
    </div>
    <!-- Element ticketPreis  -->
    <div class="adminTicketListErstellen__container adminTicketListErstellen__ticketPreis"><h3>Ticket Preis</h3>
        <div class="adminTicketListErstellen__container__links"></div>
        <div class="adminTicketListErstellen__container__rechts">
            <div class="adminTicketListErstellen__neu">
                <input class="adminTicketListErstellen__neu adminTicketListErstellen__ticketPreis" type="number" placeholder="Neue  Eingabe">
            </div>
        </div>
    </div>
    <!-- Element maxAnzahlTicket -->
    <div class="adminTicketListErstellen__container adminTicketListErstellen__maximaleAnzahlTickets"><h3>Zu verkaufende Anzahl Tickets</h3>
        <div class="adminTicketListErstellen__container__links"></div>
        <div class="adminTicketListErstellen__container__rechts">
            <div class="adminTicketListErstellen__neu">
                <input class="adminTicketListErstellen__neu adminTicketListErstellen__maximaleAnzahlTickets" type="number" placeholder="Neue  Eingabe">
            </div>
        </div>
    </div>
    <!-- Element verkauftAnzTickets -->
    <div class="adminTicketListErstellen__container adminTicketListErstellen__verkaufteAnzahlTickets"><h3>Bereits verkaufte Tickets</h3>
        <div class="adminTicketListErstellen__container__links"></div>
        <div class="adminTicketListErstellen__container__rechts">
            <div class="adminTicketListErstellen__neu">
                <input class="adminTicketListErstellen__neu adminTicketListErstellen__verkaufteAnzahlTickets" type="number" placeholder="Neue  Eingabe">
            </div>
        </div>
    </div>
    <!-- Element startDatumTicketVerkauf -->
    <div class="adminTicketListErstellen__container adminTicketListErstellen__startDatumTicketVerkauf"><h3>Start Datum Freigabe Ticket Verkauf</h3>
        <div class="adminTicketListErstellen__container__links "></div>
        <div class="adminTicketListErstellen__container__rechts">
            <div class="adminTicketListErstellen__neu">
                <input class="adminTicketListErstellen__neu adminTicketListErstellen__startDatumTicketVerkauf" type="text" maxlength="4" placeholder="yyyy">
                <input class="adminTicketListErstellen__neu adminTicketListErstellen__startDatumTicketVerkauf" type="text" maxlength="2" placeholder="mm">
                <input class="adminTicketListErstellen__neu adminTicketListErstellen__startDatumTicketVerkauf" type="text" maxlength="2" placeholder="dd">
            </div>
        </div>
    </div>
    <!-- Element endDatumTicketVerkauf -->
    <div class="adminTicketListErstellen__container adminTicketListErstellen__endDatumTicketVerkauf"><h3>End Datum Freigabe Ticket Verkauf</h3>
        <div class="adminTicketListErstellen__container__links"></div>
        <div class="adminTicketListErstellen__container__rechts">
            <div class="adminTicketListErstellen__neu">
                <input class="adminTicketListErstellen__neu adminTicketListErstellen__endDatumTicketVerkauf" type="text" maxlength="4" placeholder="yyyy">
                <input class="adminTicketListErstellen__neu adminTicketListErstellen__endDatumTicketVerkauf" type="text" maxlength="2" placeholder="mm">
                <input class="adminTicketListErstellen__neu adminTicketListErstellen__endDatumTicketVerkauf" type="text" maxlength="2" placeholder="dd">
            </div>
        </div>
    </div>
    <!-- Element maxTicketsProKauf -->
    <div class="adminTicketListErstellen__container adminTicketListErstellen__maxTicketsProKauf"><h3>Maximale Anzahl Tickets die pro Kaufauftrag gewählt werden können</h3>
        <div class="adminTicketListErstellen__container__links"></div>
        <div class="adminTicketListErstellen__container__rechts">
            <div class="adminTicketListErstellen__neu">
                <input class="adminTicketListErstellen__neu adminTicketListErstellen__maxTicketsProKauf" type="number" placeholder="Eingabe">
            </div>
        </div>
    </div>





</div>







<!-- Footer laden -->
<?php include '../../../assets/php/view/adminFooter.php';?>
