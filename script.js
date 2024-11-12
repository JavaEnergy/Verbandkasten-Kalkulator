/**
 
 *
 * @param {string} betriebsart - 
 * @param {number} mitarbeiter 
 * @param {boolean} [ersetzeDIN13169=false] 
 * @returns {Object} 
 * 
 */


function berechneVerbandkaesten(betriebsart, mitarbeiter, ersetzeDIN13169 = false) {
    let din13157 = 0;
    let din13169 = 0;

    const art = betriebsart.toLowerCase();

    switch (art) {
        case 'general':
        case 'betriebsart':
            if (mitarbeiter <= 50) {
                din13157 = 1;
            } else {
                din13169 = 1;
            }
            break;

        case 'manufacturing':
        case 'herstellungs-/verarbeitungsbetriebe':
        case 'herstellungs-verarbeitungsbetriebe':
            if (mitarbeiter <= 20) {
                din13157 = 1;
            } else {
                din13169 = 1;
            }
            break;

        case 'construction':
        case 'baustellen':
            if (mitarbeiter <= 10) {
                din13157 = 1;
            } else {
                din13169 = 1;
            }
            break;

        default:
            throw new Error('Unbekannte Betriebsart. Bitte überprüfe die Eingabe.');
    }

    // Wenn die Option zum Ersetzen aktiviert ist und ein DIN 13 169-E vorhanden ist
    if (ersetzeDIN13169 && din13169 > 0) {
        // Ersetze einen DIN 13 169-E durch zwei DIN 13157-C
        din13157 += din13169 * 2;
        din13169 = 0;
    }

    return {
        DIN13157: din13157,
        DIN13169: din13169
    };
}

// Event Listener für das Formular
document.getElementById('kalkulator-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Verhindert das Neuladen der Seite

    // Hole die Werte aus dem Formular
    const betriebsart = document.getElementById('betriebsart').value;
    const mitarbeiter = parseInt(document.getElementById('mitarbeiter').value, 10);
    const ersetzeDIN13169 = document.getElementById('ersetzeDIN13169').checked;

    // Validierung
    if (!betriebsart || isNaN(mitarbeiter) || mitarbeiter < 1) {
        alert('Bitte geben Sie gültige Werte ein.');
        return;
    }

    // Berechne die benötigten Verbandkästen
    let result;
    try {
        result = berechneVerbandkaesten(betriebsart, mitarbeiter, ersetzeDIN13169);
    } catch (error) {
        alert(error.message);
        return;
    }

    // Zeige die Ergebnisse an
    const ergebnisDiv = document.getElementById('ergebnis');
    ergebnisDiv.innerHTML = `
        <p>Benötigte Verbandkästen:</p>
        <ul>
            <li>DIN 13157-C: ${result.DIN13157}</li>
            <li>DIN 13 169-E: ${result.DIN13169}</li>
        </ul>
    `;
});
