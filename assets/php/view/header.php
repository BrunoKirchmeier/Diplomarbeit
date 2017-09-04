
<div class="header">

    <!-- Header Menue -->
    <div class="menue">
        <!-- Header Menue obere Linie immer sichtabr mit icons-->

        <div class="menue__iconLine row">
            <!-- Header oberhalb von Headerbild  "../../../assets/images/svg/UWF_Logo_Header-01.svg" assets/images/svg/UWF_Logo_Header-01.svg" -->
            <div class="menue__iconLine__links  col-xs-3">
                <a href="<?php echo $pathRoot_index .""; ?>" ><img class="menue__iconLine__links__img" src="<?php echo $pathRoot_img ."svg/UWF_Logo_Header-01.svg"; ?>"></a>
            </div>
            <div class="menue__iconLine__mitte col-xs-1"></div>
            <div class="menue__iconLine__rechts col-xs-8">
                <div class="menue__iconLine__rechts__sprache" >DE</div>
                <div class="menue__iconLine__rechts__trennbalken">|</div>
                <div class="menue__iconLine__rechts__login" >LOGIN</div>
                <div class="menue__iconLine__rechts__trennbalken">|</div>
                <div class="menue__iconLine__rechts__tickets">
                    <a class="menue__iconLine__rechts__linkTicketVerlauf" href="<?php echo $pathRoot_phpView ."gekaufteTickets.php"; ?>">
                        <img class="menue__iconLine__rechts__img" src="<?php echo $pathRoot_img."svg/Ticket_Header_Icon_grau.svg"; ?>">
                    </a>
                </div>
                <div class="menue__iconLine__rechts__trennbalken">|</div>
                <div class="menue__iconLine__rechts__nav glyphicon glyphicon-menu-hamburger"></div>
            </div>
        </div>
        <!-- Flyout Menue -->
        <div class="menue__flyout">
            <ul>
                <li><a href="<?php echo $pathRoot_index .""; ?>">LINE UP</a></li>
                <li><a href="<?php echo $pathRoot_phpView ."tickets.php"; ?>">Tickets</a></li>
                <li><a href="<?php echo $pathRoot_phpView ."adminBand.php"; ?>">Admin Backend</a></li>
            </ul>
        </div>
    </div>

    <!-- Header Bild -->
    <div class="headerBild"></div>


    <!-- countdown bis beginn des Anlasses  countdownTageKreis  width="100%" height="100%"  -->
    <div class="countdown">
        <!-- Anzahl Tage -->
        <div class="countdown__tage"><canvas class="countdown__tage__kreis" width="50" height="50">Canvas kann nicht angezeigt werden</canvas></div>
        <!-- Anzahl Stunden -->
        <div class="countdown__stunden"><canvas class="countdown__stunden__kreis" width="50" height="50">Canvas kann nicht angezeigt werden</canvas></div>
        <!-- Anzahl Minuten -->
        <div class="countdown__minuten"><canvas class="countdown__minuten__kreis" width="50" height="50">Canvas kann nicht angezeigt werden</canvas></div>
        <!-- Anzahl Sekunden -->
        <div class="countdown__sekunden"><canvas class="countdown__sekunden__kreis"width="50" height="50" >Canvas kann nicht angezeigt werden</canvas></div>
    </div>


    <!-- Untermenue Aktionswahl - Positionierung mittels yquery gleich unterhalb von Contaner -->
    <div class="kundenLoginMenue">
        <!-- Login Sub Menue für Aktionswahl    -  AKTION : Profil anschauen und anpassen  -->
        <div class="kundenLoginMenue__profil">Profil</div>
        <!-- Login Sub Menue für Aktionswahl    -  AKTION : Login  -->
        <div class="kundenLoginMenue__login">Login</div>
        <!-- Login Sub Menue für Aktionswahl    -  AKTION : Logout  -->
        <div class="kundenLoginMenue__logout">Logout</div>
        <!-- Login Sub Menue für Aktionswahl    -  AKTION : Logout  -->
        <div class="kundenLoginMenue__accountErstellen">Account erstellen</div>
    </div>


    <!-- kunden Account HAndling - dient zum schliessen aller aktiven Menues bei wechsel auf win anderes -->
    <div class="kundenAccount">
        <!-- LOGIN  -  Dieses Menue ist Standartmässig auf Display : none -->
        <!-- Login Sub Menue für Aktionswahl    -  AKTION : Login -->
        <div class="kundenLogin">
            <!-- Formular  -->
            <form class="kundenLogin__form" method="post" action="<? $PHP_SELF ?>">
                <!-- Username  -->
                <h1> Username: </h1>
                <input class="kundenLogin__form__username" type="text" name="kundenLogin" placeholder="Benutzername">
                <!-- Passwort  -->
                <h1> Passwort: </h1>
                <input class="kundenLogin__form__password"  type="password" name="kundenPassword" placeholder="Passwort">
                <br>
                <br>
                <!-- Exit Button  -->
                <button class="kundenLogin__form__exit" type="button">Schliessen</button>
                <!-- Submit  -->
                <button class="kundenLogin__form__submit" type="button">Senden</button>
                <br>
                <br>

                <!-- Passwort vergessen  -->
                <!-- Neues Passwort setzen und auf Email schicken  -->
                <h6 class="kundenLogin__form__passwortVergessen__h6">Passwort vergessen: Neues automatisches Passwort speichern <br>und an hinterlegte Email schicken. Sie müssen den <br>Benutzernamen und die hinterlegte Emailadresse eingeben eingeben</h6>
                <button class="kundenLogin__form__passwortVergessen" type="button">Passwort Vergessen</button>

                <!-- Bestätigumgsmail vergessen  -->
                <!-- Bestätigumgsmail erneut schicken  -->
                <br class="kundenLogin__form__bestaetigungsMail__h6">
                <h6 class="kundenLogin__form__bestaetigungsMail__h6">Bestätigungsmail Accountffreigabe erneut senden</h6>
                <br class="kundenLogin__form__bestaetigungsMail__h6">
                <button class="kundenLogin__form__bestaetigungsMail" type="button">Bestätigungslink anfordern</button>

                <!-- Emailadresse bestätigen für senden Passwwort der bestätigungslink  -->
                <br class="kundenLogin__form__sendenMail__h6">
                <br class="kundenLogin__form__sendenMail__h6">
                <h6 class="kundenLogin__form__sendenMail__h6">Emailadresse</h6>
                <input class="kundenLogin__form__sendenMail__email" type="text" name="kundenPasswordEmail" placeholder="Emailadresse">
                <br class="kundenLogin__form__sendenMail__h6">
            </form>
        </div>

        <!-- NEU Kunde  -  Dieses Menue ist Standartmässig auf Display : none -->
        <!-- Login Sub Menue für Aktionswahl    -  AKTION : Profil anschauen und anpassen -->
        <div class="kundendaten">
            <!-- Formular  -->
            <form class="kundendaten__form" method="post" action="<? $PHP_SELF ?>">
                <!-- Anrede  -->
                <h4>Anrede</h4>
                <select class="kundendaten__form__anrede">
                    <option value="Herr">Herr</option>
                    <option value="Frau">Frau</option>
                </select>
                <!-- Vorname  -->
                <h4>Vorname</h4>
                <input class="kundendaten__form__vorname"  type="text"  placeholder="Vorname">
                <br>
                <!-- Nachname  -->
                <h4>Nachname</h4>
                <input class="kundendaten__form__nachname"  type="text"  placeholder="Nachname">
                <br>
                <!-- Email  -->
                <h4>Email</h4>
                <input class="kundendaten__form__email"  type="email" placeholder="email">
                <br>
                <!-- Username  -->
                <h4>Username</h4>
                <input class="kundendaten__form__username"  type="text" placeholder="Benutzername">
                <br>
                <!-- Passwort  -->
                <h4>Passwort Neu</h4>
                <h6>Nur bei Neukunde oder Passwort ändern nötig</h6>
                <h6>Minimal 6 Zeichen</h6>
                <h6>Mindestens ein Sonderzeichen, eine Zahl</h6>
                <h6>ein Klein und ein Grossbuchstabe und keine Umlaute</h6>
                <h6>Keine Leerzeichen</h6>
                <input class="kundendaten__form__password"  type="password" placeholder="Passwort">
                <br>
                <!-- PAsswort Bestätigung  -->
                <h4>Passwort Bestätigen</h4>
                <input class="kundendaten__form__passwordBestaetigen"  type="password" placeholder="Passwort bestätigen">
                <br>
                <!-- Telefon  -->
                <h4>Telefonnummer</h4>
                <input class="kundendaten__form__telefon"  type="text" placeholder="Telefonnnummer">
                <br>
                <!-- Strasse  -->
                <h4>Strasse</h4>
                <input class="kundendaten__form__strasse"  type="text" placeholder="Strasse">
                <br>
                <!-- Zusatz  -->
                <h4>Nr./Zusatz</h4>
                <input class="kundendaten__form__zusatz"  type="text" placeholder="Zusatz">
                <br>
                <!-- PLZ  -->
                <h4>PLZ</h4>
                <input class="kundendaten__form__platz"  type="number" placeholder="PLZ">
                <br>
                <!-- Ort  -->
                <h4>Ort</h4>
                <input class="kundendaten__form__ort"  type="text" placeholder="Ort">
                <br>
                <!-- Newsletter Senden Ja/Nein  -->
                <h4>Newsletter</h4>
                <div class="kundendaten__form__newsletter">
                    Ja   :
                    <input class="kundendaten__form__newsletter__ja" type="radio" name="newsletter" value="Ja">
                    <br>
                    Nein :
                    <input class="kundendaten__form__newsletter__nein" type="radio" name="newsletter" value="Nein" checked= "checked">
                </div>
                <br>
                <!-- Exit Button  -->
                <button class="kundendaten__form__exit" type="button">Schliessen</button>
                <!-- Submit - Wird bei Funktion Neuer Kunde Profil anlegen angezeigt - DAmit wird ein Neukunde registriert -->
                <button class="kundendaten__form__neu" type="button">Senden</button>
                <!-- Speichern - Wird bei Funktion Profil des eigenen Account anpassen angezeigt - Damit werden Profilanpassungen auf dem Server gespeichert -->
                <button class="kundendaten__form__speichern" type="button">Änderungen speichern</button>
            </form>
        </div>

    </div>


</div>

