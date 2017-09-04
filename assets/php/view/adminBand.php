
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
        <h3>Bandeinträge verwalten: </h3>


        <!-- Neuen Eintrag erstellen -->
        <button class="adminBandListErstellen__neu">Neuen Eintrag erfassen</button>
        <br>
        <br>

        <!-- Hier wird die aktuelle Bandliste als übersicht dargestellt -->
        <!-- Jedoch nur, wenn ein aktiver Administrator angemeldet ist -->
        <div class="adminBandList"></div>


        <!-- Detailansicht eines einzelnen Beitrages -->
        <!-- Jedoch nur, wenn ein aktiver Administrator angemeldet ist -->
        <div class="adminBandDetails">

            <!-- Änderungen speichern -->
            <button class="adminBandDetails__speichern">Änderungen speichern</button>
            <!-- Zurück  -->
            <button class="adminBandDetails__zurueck">Zurück</button>


            <!-- Element id -->
            <div class="adminBandDetails__container adminBandDetails__id"><h3>id</h3>
                <div class="adminBandDetails__container__links"></div>
                <div class="adminBandDetails__container__rechts">
                    <div class="adminBandDetails__aktuell adminBandDetails__id"></div>
                </div>
            </div>
            <!-- Element Bild 1 -->
            <div class="adminBandDetails__container adminBandDetails__bild01"><h3>bild_1</h3>
                <div class="adminBandDetails__container__links"></div>
                <div class="adminBandDetails__container__rechts">
                    <div class="adminBandDetails__aktuell adminBandDetails__bild01"></div>
                    <div class="adminBandDetails__neu">
                        <input class="adminBandDetails__neu adminBandDetails__bild01" type="text" placeholder="Neuer Pfad angeben">
                    </div>
                </div>
            </div>
            <!-- Element Bild 2 -->
            <div class="adminBandDetails__container adminBandDetails__bild02"><h3>bild_2</h3>
                <div class="adminBandDetails__container__links"></div>
                <div class="adminBandDetails__container__rechts">
                    <div class="adminBandDetails__aktuell adminBandDetails__bild02"></div>
                    <div class="adminBandDetails__neu">
                        <input class="adminBandDetails__neu adminBandDetails__bild02" type="text" placeholder="Neuer Pfad angeben">
                    </div>
                </div>
            </div>
            <!-- Element Bild 3 -->
            <div class="adminBandDetails__container adminBandDetails__bild03"><h3>bild_3</h3>
                <div class="adminBandDetails__container__links"></div>
                <div class="adminBandDetails__container__rechts">
                    <div class="adminBandDetails__aktuell adminBandDetails__bild03"></div>
                    <div class="adminBandDetails__neu">
                        <input class="adminBandDetails__neu adminBandDetails__bild03" type="text" placeholder="Neuer Pfad angeben">
                    </div>
                </div>
            </div>
            <!-- Element Titel -->
            <div class="adminBandDetails__container adminBandDetails__titel"><h3>title</h3>
                <div class="adminBandDetails__container__links"></div>
                <div class="adminBandDetails__container__rechts">
                    <div class="adminBandDetails__aktuell adminBandDetails__titel"></div>
                    <div class="adminBandDetails__neu">
                        <input class="adminBandDetails__neu adminBandDetails__titel" type="text" placeholder="Neue Eingabe">
                    </div>
                </div>
            </div>
            <!-- Element Beschreibung  -->
            <div class="adminBandDetails__container adminBandDetails__beschreibung"><h3>beschreibung</h3>
                <div class="adminBandDetails__container__links"></div>
                <div class="adminBandDetails__container__rechts">
                    <div class="adminBandDetails__aktuell adminBandDetails__beschreibung"></div>
                    <div class="adminBandDetails__neu">
                        <textarea class="adminBandDetails__neu adminBandDetails__beschreibung" placeholder="Neuer Inhalt"></textarea>
                    </div>
                </div>
            </div>
            <!-- Element Datum  -->
            <div class="adminBandDetails__container adminBandDetails__datum"><h3>eventDatum</h3>
                <div class="adminBandDetails__container__links"></div>
                <div class="adminBandDetails__container__rechts">
                    <div class="adminBandDetails__aktuell adminBandDetails__datum"></div>
                    <div class="adminBandDetails__neu">
                        <input class="adminBandDetails__neu adminBandDetails__datum" type="text" maxlength="4" placeholder="yyyy">
                        <input class="adminBandDetails__neu adminBandDetails__datum" type="text" maxlength="2" placeholder="mm">
                        <input class="adminBandDetails__neu adminBandDetails__datum" type="text" maxlength="2" placeholder="dd">
                    </div>
                </div>
            </div>
            <!-- Element Zeit  -->
            <div class="adminBandDetails__container adminBandDetails__zeit"><h3>eventZeit</h3>
                <div class="adminBandDetails__container__links"></div>
                <div class="adminBandDetails__container__rechts">
                    <div class="adminBandDetails__aktuell adminBandDetails__zeit"></div>
                    <div class="adminBandDetails__neu">
                        <input class="adminBandDetails__neu adminBandDetails__zeit" type="text" maxlength="2" placeholder="hh">
                        <input class="adminBandDetails__neu adminBandDetails__zeit" type="text" maxlength="2" placeholder="mm">
                    </div>
                </div>
            </div>
            <!-- Element Ort  -->
            <div class="adminBandDetails__container adminBandDetails__ort"><h3>eventOrt</h3>
                <div class="adminBandDetails__container__links"></div>
                <div class="adminBandDetails__container__rechts">
                    <div class="adminBandDetails__aktuell adminBandDetails__ort"></div>
                    <div class="adminBandDetails__neu">
                        <input class="adminBandDetails__neu adminBandDetails__ort" type="text" placeholder="Neue  Eingabe">
                    </div>
                </div>
            </div>
            <!-- Element Tag  -->
            <div class="adminBandDetails__container adminBandDetails__tag"><h3>eventTag</h3>
                <div class="adminBandDetails__container__links"></div>
                <div class="adminBandDetails__container__rechts">
                    <div class="adminBandDetails__aktuell adminBandDetails__tag"></div>
                    <div class="adminBandDetails__neu">
                        <input class="adminBandDetails__neu adminBandDetails__tag" type="text" placeholder="Neue  Eingabe">
                    </div>
                </div>
            </div>
            <!-- Element Link Facebook -->
            <div class="adminBandDetails__container adminBandDetails__linkFacebook"><h3>linkFacebook</h3>
                <div class="adminBandDetails__container__links"></div>
                <div class="adminBandDetails__container__rechts">
                    <div class="adminBandDetails__aktuell adminBandDetails__linkFacebook"></div>
                    <div class="adminBandDetails__neu">
                        <input class="adminBandDetails__neu adminBandDetails__linkFacebook" type="text" placeholder="Neuen Link">
                    </div>
                </div>
            </div>
            <!-- Element Link Youtube -->
            <div class="adminBandDetails__container adminBandDetails__linkYoutoube"><h3>linkYoutube</h3>
                <div class="adminBandDetails__container__links"></div>
                <div class="adminBandDetails__container__rechts">
                    <div class="adminBandDetails__aktuell adminBandDetails__linkYoutoube"></div>
                    <div class="adminBandDetails__neu">
                        <input class="adminBandDetails__neu adminBandDetails__linkYoutoube" type="text" placeholder="Neuen Link">
                    </div>
                </div>
            </div>
            <!-- Element Link Instagramm -->
            <div class="adminBandDetails__container adminBandDetails__linkInstagramm"><h3>linkInstagram</h3>
                <div class="adminBandDetails__container__links "></div>
                <div class="adminBandDetails__container__rechts">
                    <div class="adminBandDetails__aktuell adminBandDetails__linkInstagramm"></div>
                    <div class="adminBandDetails__neu">
                        <input class="adminBandDetails__neu adminBandDetails__linkInstagramm" type="text" placeholder="Neuen Link">
                    </div>
                </div>
            </div>
            <!-- Element Link Twitter -->
            <div class="adminBandDetails__container adminBandDetails__linkTwitter"><h3>linkTwitter</h3>
                <div class="adminBandDetails__container__links"></div>
                <div class="adminBandDetails__container__rechts">
                    <div class="adminBandDetails__aktuell adminBandDetails__linkTwitter"></div>
                    <div class="adminBandDetails__neu">
                        <input class="adminBandDetails__neu adminBandDetails__linkTwitter" type="text" placeholder="Neuen Link">
                    </div>
                </div>
            </div>
            <!-- Erstell Datum -->
            <div class="adminBandDetails__container adminBandDetails__createTime"><h3>Datum der Erstellung</h3>
                <div class="adminBandDetails__container__links"></div>
                <div class="adminBandDetails__container__rechts">
                    <div class="adminBandDetails__aktuell adminBandDetails__createTime"></div>
                </div>
            </div>
            <!-- Element Letztes update der DAten -->
            <div class="adminBandDetails__container adminBandDetails__updateTime"><h3>Datum des Letztes Update</h3>
                <div class="adminBandDetails__container__links"></div>
                <div class="adminBandDetails__container__rechts">
                    <div class="adminBandDetails__aktuell adminBandDetails__updateTime"></div>
                </div>
            </div>
            <!-- Element Administrator letzte Aenderungen -->
            <div class="adminBandDetails__container adminBandDetails__administrator"><h3>Administrator des letzten updates</h3>
                <div class="adminBandDetails__container__links"></div>
                <div class="adminBandDetails__container__rechts">
                    <div class="adminBandDetails__aktuell adminBandDetails__administrator"></div>
                </div>
            </div>

        </div>


        <!-- Neuen Eintrag erstellen -->
        <div class="adminBandListErstellen">

            <!-- Änderungen speichern -->
            <button class="adminBandListErstellen__speichern">Speichern</button>
            <!-- Zurück  -->
            <button class="adminBandListErstellen__zurueck">Zurück</button>

            <!-- Element Bild 1 -->
            <div class="adminBandListErstellen__container adminBandListErstellen__bild01"><h3>bild_1</h3>
                <div class="adminBandListErstellen__container__links"></div>
                <div class="adminBandListErstellen__container__rechts">
                    <div class="adminBandListErstellen__neu">
                        <input class="adminBandListErstellen__neu adminBandListErstellen__bild01" type="text" placeholder="Pfad angeben">
                    </div>
                </div>
            </div>
            <!-- Element Bild 2 -->
            <div class="adminBandListErstellen__container adminBandListErstellen__bild02"><h3>bild_2</h3>
                <div class="adminBandListErstellen__container__links"></div>
                <div class="adminBandListErstellen__container__rechts">
                    <div class="adminBandListErstellen__neu">
                        <input class="adminBandListErstellen__neu adminBandListErstellen__bild02" type="text" placeholder="Pfad angeben">
                    </div>
                </div>
            </div>
            <!-- Element Bild 3 -->
            <div class="adminBandListErstellen__container adminBandListErstellen__bild03"><h3>bild_3</h3>
                <div class="adminBandListErstellen__container__links"></div>
                <div class="adminBandListErstellen__container__rechts">
                    <div class="adminBandListErstellen__neu">
                        <input class="adminBandListErstellen__neu adminBandListErstellen__bild03" type="text" placeholder="Pfad angeben">
                    </div>
                </div>
            </div>
            <!-- Element Titel -->
            <div class="adminBandListErstellen__container adminBandListErstellen__titel"><h3>title</h3>
                <div class="adminBandListErstellen__container__links"></div>
                <div class="adminBandListErstellen__container__rechts">
                    <div class="adminBandListErstellen__neu">
                        <input class="adminBandListErstellen__neu adminBandListErstellen__titel" type="text" placeholder="Neue Eingabe">
                    </div>
                </div>
            </div>
            <!-- Element Beschreibung  -->
            <div class="adminBandListErstellen__container adminBandListErstellen__beschreibung"><h3>beschreibung</h3>
                <div class="adminBandListErstellen__container__links"></div>
                <div class="adminBandListErstellen__container__rechts">
                    <div class="adminBandListErstellen__neu">
                        <textarea class="adminBandListErstellen__neu adminBandListErstellen__beschreibung" placeholder="Inhalt"></textarea>
                    </div>
                </div>
            </div>
            <!-- Element Datum  -->
            <div class="adminBandListErstellen__container adminBandListErstellen__datum"><h3>eventDatum</h3>
                <div class="adminBandListErstellen__container__links"></div>
                <div class="adminBandListErstellen__container__rechts">
                    <div class="adminBandListErstellen__neu">
                        <input class="adminBandListErstellen__neu adminBandListErstellen__datum" type="text" maxlength="4" placeholder="yyyy">
                        <input class="adminBandListErstellen__neu adminBandListErstellen__datum" type="text" maxlength="2" placeholder="mm">
                        <input class="adminBandListErstellen__neu adminBandListErstellen__datum" type="text" maxlength="2" placeholder="dd">
                    </div>
                </div>
            </div>
            <!-- Element Zeit  -->
            <div class="adminBandListErstellen__container adminBandListErstellen__zeit"><h3>eventZeit</h3>
                <div class="adminBandListErstellen__container__links"></div>
                <div class="adminBandListErstellen__container__rechts">
                    <div class="adminBandListErstellen__neu">
                        <input class="adminBandListErstellen__neu adminBandListErstellen__zeit" type="text" maxlength="2" placeholder="hh">
                        <input class="adminBandListErstellen__neu adminBandListErstellen__zeit" type="text" maxlength="2" placeholder="mm">
                    </div>
                </div>
            </div>
            <!-- Element Ort  -->
            <div class="adminBandListErstellen__container adminBandListErstellen__ort"><h3>eventOrt</h3>
                <div class="adminBandListErstellen__container__links"></div>
                <div class="adminBandListErstellen__container__rechts">
                    <div class="adminBandListErstellen__neu">
                        <input class="adminBandListErstellen__neu adminBandListErstellen__ort" type="text" placeholder="Neue  Eingabe">
                    </div>
                </div>
            </div>
            <!-- Element Tag  -->
            <div class="adminBandListErstellen__container adminBandListErstellen__tag"><h3>eventTag</h3>
                <div class="adminBandListErstellen__container__links"></div>
                <div class="adminBandListErstellen__container__rechts">
                    <div class="adminBandListErstellen__neu">
                        <input class="adminBandListErstellen__neu adminBandListErstellen__tag" type="text" placeholder="Neue  Eingabe">
                    </div>
                </div>
            </div>
            <!-- Element Link Facebook -->
            <div class="adminBandListErstellen__container adminBandListErstellen__linkFacebook"><h3>linkFacebook</h3>
                <div class="adminBandListErstellen__container__links"></div>
                <div class="adminBandListErstellen__container__rechts">
                    <div class="adminBandListErstellen__neu">
                        <input class="adminBandListErstellen__neu adminBandListErstellen__linkFacebook" type="text" placeholder="Neuen Link">
                    </div>
                </div>
            </div>
            <!-- Element Link Youtube -->
            <div class="adminBandListErstellen__container adminBandListErstellen__linkYoutoube"><h3>linkYoutube</h3>
                <div class="adminBandListErstellen__container__links"></div>
                <div class="adminBandListErstellen__container__rechts">
                    <div class="adminBandListErstellen__neu">
                        <input class="adminBandListErstellen__neu adminBandListErstellen__linkYoutoube" type="text" placeholder="Neuen Link">
                    </div>
                </div>
            </div>
            <!-- Element Link Instagramm -->
            <div class="adminBandListErstellen__container adminBandListErstellen__linkInstagramm"><h3>linkInstagram</h3>
                <div class="adminBandListErstellen__container__links "></div>
                <div class="adminBandListErstellen__container__rechts">
                    <div class="adminBandListErstellen__neu">
                        <input class="adminBandListErstellen__neu adminBandListErstellen__linkInstagramm" type="text" placeholder="Neuen Link">
                    </div>
                </div>
            </div>
            <!-- Element Link Twitter -->
            <div class="adminBandListErstellen__container adminBandListErstellen__linkTwitter"><h3>linkTwitter</h3>
                <div class="adminBandListErstellen__container__links"></div>
                <div class="adminBandListErstellen__container__rechts">
                    <div class="adminBandListErstellen__neu">
                        <input class="adminBandListErstellen__neu adminBandListErstellen__linkTwitter" type="text" placeholder="Neuen Link">
                    </div>
                </div>
            </div>

        </div>


<!-- Footer laden -->
<?php include '../../../assets/php/view/adminFooter.php'; ?>
