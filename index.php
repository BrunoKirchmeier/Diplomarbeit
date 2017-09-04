
<!-- Pfad Konfigurationen -->
<?php
// Rootverzeichnisse für relative Pfade, damit bei Include der PFad immer korrekt ist
$pathRoot_index = './';
$pathRoot_phpView = './assets/php/view/';
$pathRoot_img = './assets/images/';
$pathRoot_js = './assets/js/';
$pathRoot_npm = '../';
$pathRoot_css = './assets/css/';
// phpinfo();
?>



<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Diplomarbeit</title>
    <link rel="stylesheet" href="./node_modules/bootstrap/dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="./node_modules/slick-carousel/slick/slick-theme.css">
    <link rel="stylesheet" href="./assets/css/styles.css">
</head>
<body>


<!-- Hier wird erstmalig der Dokument Root Pfad gespeichert, um mit absoluten Pfaden auf die richtige DAtei zu zielen -->
<script>
    // Root Pfad ermitteln
    var pathRootDokument = window.location.pathname;

    // Pfad darf nur beim allerersten Mal ermittelt werden. Wird von einer anderen Seite zurückgesprungen, so ist die Pfadangabe falsch mit index.php anschluss
    if (localStorage.getItem("rootPfad") === undefined || localStorage.getItem("rootPfad") === "" || localStorage.getItem("rootPfad") === null) {
        localStorage.setItem("rootPfad", JSON.stringify(pathRootDokument));
        // console.log( pathRootDokument.substring(0,pathRootDokument.length-9) )
    }
</script>




<!-- Wrapper wird von Bootstrap Framework übernommen -->
<div class="wrapper bootstrap-wrapper">


    <!-- Header laden -->
    <?php include 'assets/php/view/header.php'; ?>




    <!-- Container für Filter -->
    <div class="contentBandListFilter row">
        <!-- FEld Links - Kein Filter aktiv - schnellwahl -->
        <div class="contentBandListFilter__links col-xs-3">Alle</div>

        <!-- Feld rechts - Filter aktivieren über Carrouseel Menue-->
        <div class="contentBandListFilter__rechts col-xs-3 glyphicon glyphicon-menu-hamburger"></div>
    </div>


    <!-- Container für Filter -->
    <div class="contentBandListFilterDropdown">

        <!-- Menue - Kategorie 1 -->
        <div class="contentBandListFilterDropdown__kat">
            <div class="contentBandListFilterDropdown__kat__text">Uhrzeit</div>
            <div class="contentBandListFilterDropdown__kat__list" data-menueactive="true" data-filterKriterium="zeit">
                <ul>
                    <li class="contentBandListFilterDropdown__element" data-filteractive="false" data-filterWert="14:00:00">14:00 Uhr</li>
                    <li class="contentBandListFilterDropdown__element" data-filteractive="false" data-filterWert="20:00:00">20:00 Uhr</li>
                    <li class="contentBandListFilterDropdown__element" data-filteractive="false" data-filterWert="21:00:00">21:00 Uhr</li>
                </ul>
            </div>
        </div>
        <!-- Menue - Kategorie 2 -->
        <div class="contentBandListFilterDropdown__kat">
            <div class="contentBandListFilterDropdown__kat__text">Tag</div>
            <div class="contentBandListFilterDropdown__kat__list" data-menueactive="true" data-filterKriterium="tag">
                <ul>
                    <li class="contentBandListFilterDropdown__element" data-filteractive="false" data-filterWert="Freitag">Freitag</li>
                    <li class="contentBandListFilterDropdown__element" data-filteractive="false" data-filterWert="Samstag">Samstag</li>
                    <li class="contentBandListFilterDropdown__element" data-filteractive="false" data-filterWert="Sonntag">Sonntag</li>
                </ul>
            </div>
        </div>

    </div>





    <!-- Container für Band übersicht -->
    <div class="contentBandListDaten"></div>






    <!-- Container für Band Detaildaten -->
    <div class="contentBandDetail"></div>




</div>



<!--  Externe Bibliotheken laden -->
<script  src="node_modules/jquery/dist/jquery.min.js"></script>
<script  src="node_modules/crypto-js/crypto-js.js"></script>
<script  src="node_modules/slick-carousel/slick/slick.min.js"></script>


<!-- Javascript files Allgemeine Funktion wird in verschiedenen Scripts verwendet -->
<script src="assets/js/allgemein/EinAus.js"></script>

<!-- Einzelne JAvascript Files mit Teilfunktionen laden  -->
<script src="assets/js/countdown.js"></script>
<script src="assets/js/menues.js"></script>
<script src="assets/js/kundeAccount.js"></script>
<script src="assets/js/bandList.js"></script>





</body>
</html>