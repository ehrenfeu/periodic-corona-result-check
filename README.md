# Corona-Ergebnis.de Periodic Checker

Skript zur periodischen Test-Status Überprüfung von corona-ergebnis.de

Fork from [tkupek/corona-ergebnis-check](https://github.com/tkupek/corona-ergebnis-check)

---

## Anleitung

Die eigenen Testdaten zur Abfrage in `CONFIG.js` eintragen.


Starten der periodischen Überprüfung auf der Konsole mit

```
node .\checkLoopMail.js
> Covid test result available: FALSE
```

## Erweiterung

Es kann ein eigenes Skript mit einer eigenen Benachrichtigung verwendet werden:

```
const checkLoop = require('./checkLoop.js');

function customNotification(resultText)
{
	// Own Notification Code
	console.log(resultText);
}

function checkLoopWithCustomNotification()
{
    return checkLoop.Start(customNotification);
}
```
