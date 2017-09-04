
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



<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <title>Diplomarbeit</title>
    <link rel="stylesheet" href="../../../node_modules/bootstrap/dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="../../../node_modules/slick-carousel/slick/slick-theme.css">
    <link rel="stylesheet" href="../../../assets/css/styles.css">
</head>
<body>


<!-- Header laden -->
<?php include '../../../assets/php/view/header.php'; ?>




<!-- Wrapper wird von Bootstrap Framework übernommen -->
<div class="wrapper bootstrap-wrapper">


    <!-- Gesamte Ticketliste anzeigen mit Anzahl Tickets undPreissume pro Ticketart   -->
    <div class="ticketsListe row "></div>


    <!-- Balken mit total esamtsumme aller Tickets   -->
    <div class="ticketsTotal row ">

        <!-- DIV Links mit text   -->
        <div class="ticketsTotal__containerLinks col-xs-7">Total:</div>

        <!-- DIV rechts mit text   -->
        <div class="ticketsTotal__containerRechts col-xs-4"></div>

    </div>



    <!-- Button - BEstellvorgang ausführen   -->
    <button class="tickets__button__inWarenkorb">Tickets in Warenkorb legen</button>

    <!-- Link zum Warenorb -->
    <a class="tickets__button__zumWarenkorbGehen" href="<?php echo $pathRoot_phpView ."warenkorb.php"; ?>">Zum Warenkorb</a>





</div>



<!--  Externe Bibliotheken laden -->
<script  src="../../../node_modules/jquery/dist/jquery.min.js"></script>
<script  src="../../../node_modules/crypto-js/crypto-js.js"></script>
<script  src="../../../node_modules/slick-carousel/slick/slick.min.js"></script>


<!-- Javascript files Allgemeine Funktion wird in verschiedenen Scripts verwendet -->
<script src="../../../assets/js/allgemein/EinAus.js"></script>

<!-- Einzelne JAvascript Files mit Teilfunktionen laden  -->
<script src="../../../assets/js/countdown.js"></script>
<script src="../../../assets/js/menues.js"></script>
<script src="../../../assets/js/kundeAccount.js"></script>
<script src="../../../assets/js/tickets.js"></script>




</body>
</html>