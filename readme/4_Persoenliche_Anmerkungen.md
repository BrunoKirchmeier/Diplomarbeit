# Was ich nächstes Mal anderst machen würde
----------

## 1. Projektstruktur ##

#### Pfade #####
Ich würde als Basis im Index.php file gleich beim ersten mal Laden das aktuelle "absolute" Verzeichnis in den local storage speichern. alle folgenden Pfadangaben würde ich relativ zu diesem gespeicherten Pfad angeben.
Dadurch könnte der Header ohne Pfad Probleme überall sauber eingbunden werden.

#### Filestruktur HTML/PHP Frontend #####
Ich würde nur noch ein index.php File generieren, welches aufgerufen wird. Sämtlicher Content wird in dieses File geladen. Ich muss mich diesbezüglich noch weiter Informieren aber eine Variante währe mittels URL Parameter den aktuellen und den zu ladenden Context zu ermitteln.

#### Daten mit PHP anstatt Ajax an CLient senden #####
Anstatt sämtliche Daten nur mit Ajax zu laden, könnte es sinnvoll sein initialdaten oder auch bei mehreren nacheinanderfolgenden Aktionen direkt bei der dynamischen erzeiugung des HTML mittels PHP mitzugeben. Dafür könnte der eine oder andere Ajax aufruf erspart werden.

#### Ordner für Upload Content #####
Im Moment sind alle Ordner mit der gleichen Berechtigung und innerhalb der gleichen Strukutren auf dem Server abgelegt. Die Ordner für den Code und für den Content sollten an getrennten Orten sein und bestenfalls auch mit verschiedenen Berechtigungsstufen ausgestattest sein.
Zudem müsste ich noch den Code programmieren, dass die Bilder direkt über die Website hochgeladen werden könnten, ohne einen FDP Zugriff machen zu müssen. Somit müsste der Kunde gar keinen Serverzugriff haben.

#### Administrator Zugriff #####
Im Moment ist auf der Homepage ein Link hinterlegt für Administratoren. In Zukunft würde ich anstatt den Link, eine bestimmte URL definieren, wo die Administratoren ins BAckeend gelangen. Dort müsste noch eine Authentifizierung stattfinden. 
Im Moment kann der Administrator ebenfalls keine Änderungen vornehmen ohne angemeldet zu sein.

#### Modulariserung #####
Gewisse Elemente, wie zum Beispiel der Header müssten in teil Elemente zerlegt werden und seperat aufgerufen werden können, damit ein gezielterer Einsatz einzelner Teilfunktionen möglich währe.


## 2. Programmfunkionen ##

#### Login Administrator #####
Dies ist derzeit noch nicht so stark ausgereift wie das Kunden Login. Bei entsprechende Zeit würde ich dies noch angleichen.

#### PHP Funktionen für Datenbank Zugriff #####
Bei den Grundfunktion Lese, löschen und Update sind noch detailiertere Plausiblitätsprüfungen möglich, wie zum Beispiel ist die Eingabe ein gültiges Datum, etc.