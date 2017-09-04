
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <title>Diplomarbeit</title>
    <link rel="stylesheet" href="<?php echo $pathRoot_npm ."node_modules/bootstrap/dist/css/bootstrap.min.css"; ?>">
    <link rel="stylesheet" href="<?php echo $pathRoot_npm ."node_modules/slick-carousel/slick/slick-theme.css"; ?>">
    <link rel="stylesheet" href="<?php echo $pathRoot_css ."styles.css"; ?>">
</head>
<body>





<!-- Wrapper wird von Bootstrap Framework übernommen -->
<div class="wrapper bootstrap-wrapper">

    <!-- Header mit Logo / Button Menue Naviagtion / Button Login -->
    <div class="adminHeader">

        <!-- Logo -->
        <div class="adminHeader__logo"></div>

        <!-- Button - Login -->
        <!-- Container Div für Untermenue Aufruf für Profil / Login / Logout -->
        <div class="adminHeader__LoginContainer ">
            <div class="adminHeader__LoginContainer__links "></div>
            <div class="adminHeader__LoginContainer__rechts ">
                <!-- Hier wird der Name des aktuell angemeldeten USer eingeblendet  -->
                <div class="adminLoginMenue__userAktiv"></div>
                <!-- Untermenue Aktionswahl - Positionierung mittels yquery gleich unterhalb von Contaner -->
                <div class="adminLoginMenue">
                    <!-- Login Sub Menue für Aktionswahl    -  AKTION : Profil anschauen und anpassen  -->
                    <div class="adminLoginMenue__profil">Profil</div>
                    <!-- Login Sub Menue für Aktionswahl    -  AKTION : Login  -->
                    <div class="adminLoginMenue__login">Login</div>
                    <!-- Login Sub Menue für Aktionswahl    -  AKTION : Logout  -->
                    <div class="adminLoginMenue__logout">Logout</div>
                </div>
            </div>
        </div>

        <!-- Button - Hauptnavigation für admin Seite -->
        <div class="adminHeader__nav glyphicon glyphicon-menu-hamburger"></div>



    </div>



    <!-- Eigentliche Menuenavigation - wird mit Javascript eingeblendet -->
    <div class="adminMenue">
        <ul>
            <!-- Navigations Elemente -->
            <li><a href="<?php echo $pathRoot_index ."index.php"; ?>">LINE UP</a></li>
            <li><a href="<?php echo $pathRoot_phpView ."adminBand.php"; ?>">BANDS</a></li>
            <li><a href="<?php echo $pathRoot_phpView ."adminTicketarten.php"; ?>">TICKETS</a></li>
        </ul>
    </div>


    <!-- admin Content Inhalt Login wird immer geladen -->
    <!-- Login -->
    <div class="adminContent">

        <!-- admin Account HAndling - dient zum schliessen aller aktiven Menues bei wechsel auf win anderes -->
        <div class="adminAccount">

            <!-- LOGIN  -  Dieses Menue ist Standartmässig auf Display : none -->
            <!-- Login Sub Menue für Aktionswahl    -  AKTION : Login -->
            <div class="adminLogin">
                <!-- Formular  -->
                <form class="adminLogin__form" method="post" action="<? $PHP_SELF ?>">
                    <!-- Username  -->
                    <h1> Username: </h1>
                    <input class="adminLogin__form__username" type="text" name="adminLogin" placeholder="Benutzername">
                    <!-- Passwort  -->
                    <h1> Passwort: </h1>
                    <input class="adminLogin__form__password"  type="password" name="adminPassword" placeholder="Passwort">
                    <br>
                    <br>
                    <!-- Exit Button  -->
                    <button class="adminLogin__form__exit" type="button">Schliessen</button>
                    <!-- Submit  -->
                    <button class="adminLogin__form__submit" type="button">Senden</button>
                </form>
            </div>

            <!-- PROFIL  -  Dieses Menue ist Standartmässig auf Display : none -->
            <!-- Login Sub Menue für Aktionswahl    -  AKTION : Profil anschauen und anpassen -->
            <div class="adminProfil">
                <!-- Formular  -->
                <form class="adminProfil__form" method="post" action="<? $PHP_SELF ?>">
                    <!-- Email  -->
                    <h4>Email</h4>
                    <input class="adminProfil__form__email"  type="email" name="adminProfilEmail" placeholder="email">
                    <br>
                    <!-- Username  -->
                    <h4>Username</h4>
                    <input class="adminProfil__form__username"  type="text" name="adminProfilUsername" placeholder="Benutzername">
                    <br>
                    <!-- Passwort  -->
                    <h4>Passwort</h4>
                    <input class="adminProfil__form__password"  type="password" name="adminProfilPassword" placeholder="Passwort">
                    <br>
                    <!-- PAsswort Bestätigung  -->
                    <h4>Passwort Bestätigen</h4>
                    <input class="adminProfil__form__passwordBestaetigen"  type="password" name="adminProfilPasswordBestaetigen" placeholder="Passwort bestätigen">
                    <br>
                    <!-- Telefon  -->
                    <h4>Telefonnummer</h4>
                    <input class="adminProfil__form__telefon"  type="text" name="adminProfilTelefon" placeholder="Telefonnnummer">
                    <br>
                    <!-- Berechtigungslevel  -->
                    <h4>Berechtigungsstufe</h4>
                    <input class="adminProfil__form__level"  type="text" name="adminProfilLevel" value="">
                    <br>
                    <br>
                    <!-- Exit Button  -->
                    <button class="adminProfil__form__exit" type="button">Schliessen</button>
                    <!-- Submit  -->
                    <button class="adminProfil__form__speichern" type="button">Änderungen speichern</button>
                </form>
            </div>

        </div>