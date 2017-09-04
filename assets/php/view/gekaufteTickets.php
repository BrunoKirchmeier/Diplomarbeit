
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


    <div class="gekaufteTickets__ticketsAktuell"></div>

    <div class="gekaufteTickets__ticketVerlauf"></div>




    <br>
    <br>

    <!-- Link zurück -->
    <a class="gekaufteTickets__button__zurueckGehen" href="<?php echo $pathRoot_index ."index.php"; ?>">Zurück</a>
    <!-- Link zu Tickets kaufen -->
    <a class="gekaufteTickets__button__weitereTicketKaufen" href="<?php echo $pathRoot_phpView ."tickets.php"; ?>">Weitere Tickets kaufen</a>











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
<script src="../../../assets/js/warenkorb.js"></script>
<script src="../../../assets/js/gekaufteTickets.js"></script>





</body>
</html>