# Setup Guide #
----------


### Projekt von Git laden  ###

Das Projekt setzt die Installation von den zwei folgenden Tools voraus:

1. Git Versionierungs Tools
2. Node Modules

Das Projekt liegt ist auf Github auf einem Repository.Zuerst muss das Projekt von Github auf den lokalen PC kopiert werden.Dies geschieht über die Shell über folgende Kommandos:

    1. Git Initialisieren:
		$ git init

    2. Git Repository clonen:
		$ git clone git@github.com:WebProfessionals/dipl1617-bruno-kirchmeier.git


Sobald das Projekt auf dem lokalen Rechner geclont wurde, müssen die npm Tools initialisiert werden.
Die zu installierenden pnm Tools sind in der package.json Datei festgelegt.

		$ npm install



### Datenbank Model auf den Server einrichten  ###
Das Datenbankmodel wurde mittels MySQL Workbench erstellt und auch auf den Liveserver gepielt. Mit dem Tool kann eine dirkte Verbung zum Server eingerichtet werden und mittels eines Asistenten werden die Tabellen auf dem Server automatisch erstellt. Die Zugangsdaten können über die Email bruno.kirchmeier@gmail.com angeforert werden.



### Projekt live stellen  ###
Der Liveserver ist bei der Firma Web Profesionals eingerichtet. Die Zugangsdaten können bei Bruno Kirchmeier über die Emailadresse bruno.kirchmeier@gmail.com angefordert werden.

Die Daten aus em geconten Ordner können mit einem FDP Client wie zum Beispiel File Zilla hochgeladen werden. Der PHP Server und die Datenbank sind bereits durch die Firma Web Proffesinals eingerichtet worden.

##### URL Live Server #####
Die Website ist auf folgende Adresse erreichbar: **http://bruno.techfabrik.com/**

### Browser Kompatibilität  ###
Die Website ist für den Browser Chrome von Google ausgelegt. Fallback Lösungen für andere BRowser wurden keine Implementiert.