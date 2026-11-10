/* Bewerbung in zwei Minuten – Vorführung, sendet keine Daten. Deutsch und Niederländisch. */
(function () {
  'use strict';
  var buehne = document.getElementById('b-schritt');
  if (!buehne) return;
  var NL = document.documentElement.lang.slice(0, 2) === 'nl';
  var L = function (de, nl) { return NL ? nl : de; };
  var stand = document.getElementById('b-stand'), zurueck = document.getElementById('b-zurueck');
  var balken = document.getElementById('b-balken'), zettel = document.getElementById('b-zettel');
  var leer = document.getElementById('b-leer'), dauer = document.getElementById('b-dauer');
  var abschnitt = document.getElementById('bewerben');
  var ruhig = matchMedia('(prefers-reduced-motion: reduce)').matches;

  var JA = [L('Ja, passt', 'Ja, dat past'), L('Das möchte ich erst besprechen', 'Dat wil ik eerst bespreken')];
  var START = { t: 'regler', k: L('Start', 'Start'), f: L('Ab wann könntest du anfangen?', 'Vanaf wanneer zou je kunnen beginnen?'),
    h: L('Zieh den Regler oder tippe auf einen Zeitpunkt.', 'Versleep de schuif of tik op een moment.'),
    a: [L('Sofort', 'Direct'), L('In 1 Monat', 'Over 1 maand'), L('In 2 Monaten', 'Over 2 maanden'), L('In 3 Monaten oder später', 'Over 3 maanden of later')],
    m: [L('sofort', 'direct'), L('1 Monat', '1 maand'), L('2 Monate', '2 maanden'), L('3 Monate +', '3 maanden +')] };
  var BERUFE = [L('Flachglastechnologe/-in', 'Vlakglastechnoloog'), L('Industriekaufmann/-frau', 'Commercieel medewerker industrie'), L('Fachkraft für Lagerlogistik', 'Logistiek vakkracht'), L('Fachlagerist/-in', 'Magazijnmedewerker')];

  var STELLEN = {
    produktion: { name: L('Produktionsmitarbeiter (m/w/d)', 'Productiemedewerker (m/v/x)'), kurz: L('Produktionsmitarbeiter', 'Productiemedewerker'), sub: L('Früh- und Spätschicht, mit Zulage', 'Vroege en late dienst, met toeslag'), s: [
      { t: 'mehr', k: L('Das bringst du mit', 'Dat breng je mee'), f: L('Was trifft auf dich zu?', 'Wat is op jou van toepassing?'),
        h: L('Tippe alles an, was passt. Ausbildung und Erfahrung sind kein Muss, dein Team arbeitet dich gründlich ein.', 'Tik alles aan wat klopt. Opleiding en ervaring zijn geen must, je team werkt je grondig in.'),
        a: [L('Ich bin handwerklich geschickt', 'Ik ben handig'), L('Ich bin körperlich belastbar', 'Ik kan fysiek werk aan'), L('Ich habe eine handwerkliche Ausbildung', 'Ik heb een technische vakopleiding'), L('Ich habe schon in einer Produktion gearbeitet', 'Ik heb al in een productie gewerkt')] },
      { t: 'wahl', k: L('Schicht', 'Ploegendienst'), f: L('Früh- und Spätschicht im Wechsel: Passt das für dich?', 'Vroege en late dienst in wisseling: past dat bij je?'), a: JA },
      { t: 'wahl', k: L('Deutsch', 'Duits'), f: L('Wie gut sprichst du Deutsch?', 'Hoe goed spreek je Duits?'), a: [L('Muttersprache', 'Moedertaal'), L('Gut', 'Goed'), L('Ich kann mich verständigen', 'Ik kan me redden'), L('Kaum', 'Nauwelijks')] },
      START ] },
    lkw: { name: L('Lkw-Fahrer im Nahverkehr (m/w/d)', 'Vrachtwagenchauffeur regionaal (m/v/x)'), kurz: L('Lkw-Fahrer im Nahverkehr', 'Vrachtwagenchauffeur regionaal'), sub: L('Touren in der Region', 'Ritten in de regio'), s: [
      { t: 'wahl', k: L('Führerschein', 'Rijbewijs'), f: L('Welchen Führerschein hast du?', 'Welk rijbewijs heb je?'), a: [L('Klasse C', 'Rijbewijs C'), L('Klasse CE', 'Rijbewijs CE'), L('Noch keinen von beiden', 'Nog geen van beide')] },
      { t: 'wahl', k: L('Be- und Entladen', 'Laden en lossen'), f: L('Du belädst und entlädst die Glasgestelle selbst. Passt das für dich?', 'Je laadt en lost de glasbokken zelf. Past dat bij je?'), a: JA },
      START ] },
    lager: { name: L('Fachkraft für Lagerlogistik oder Fachlagerist (m/w/d)', 'Logistiek medewerker (m/v/x)'), kurz: L('Lagerlogistik', 'Logistiek'), sub: L('Lager und Versand', 'Magazijn en verzending'), s: [
      { t: 'wahl', k: L('Ausbildung', 'Opleiding'), f: L('Hast du eine Ausbildung im Lager?', 'Heb je een logistieke opleiding?'), a: [L('Fachkraft für Lagerlogistik', 'Ja, logistiek vakkracht'), L('Fachlagerist', 'Ja, magazijnmedewerker'), L('Nein, aber Erfahrung im Lager', 'Nee, wel ervaring in een magazijn'), L('Nein', 'Nee')] },
      START ] },
    elektro: { name: L('Elektroniker Betriebstechnik oder Mechatroniker (m/w/d)', 'Elektromonteur bedrijfstechniek of mechatronicus (m/v/x)'), kurz: L('Elektroniker oder Mechatroniker', 'Elektromonteur of mechatronicus'), sub: L('Instandhaltung der Anlagen', 'Onderhoud van de installaties'), s: [
      { t: 'wahl', k: L('Ausbildung', 'Opleiding'), f: L('Welche Ausbildung hast du?', 'Welke opleiding heb je?'), a: [L('Elektroniker für Betriebstechnik', 'Elektromonteur bedrijfstechniek'), L('Mechatroniker', 'Mechatronicus'), L('Etwas Ähnliches', 'Iets vergelijkbaars')] },
      { t: 'wahl', k: L('Schicht und Bereitschaft', 'Ploegen- en bereikbaarheidsdienst'), f: L('Zur Instandhaltung gehören Schicht und Bereitschaft, beides mit Zulage. Passt das für dich?', 'Bij het onderhoud horen ploegendienst en bereikbaarheidsdienst, allebei met toeslag. Past dat bij je?'), a: JA },
      START ] },
    ausbildung: { name: L('Ausbildung ab 1. August 2027', 'Opleiding vanaf 1 augustus 2027'), kurz: L('Ausbildung ab August 2027', 'Opleiding vanaf augustus 2027'), sub: L('4 Berufe', '4 beroepen'), s: [
      { t: 'wahl', k: L('Beruf', 'Beroep'), f: L('Welcher Beruf interessiert dich?', 'Welk beroep spreekt je aan?'), a: BERUFE.concat([L('Weiß ich noch nicht', 'Weet ik nog niet')]) },
      { t: 'wahl', k: L('Schulabschluss', 'Diploma'), f: L('Welchen Schulabschluss hast du oder machst du gerade?', 'Welk diploma heb je of haal je binnenkort?'), a: [L('Hauptschulabschluss', 'Vmbo'), L('Realschulabschluss', 'Havo'), L('Fachabitur oder Abitur', 'Vwo'), L('Einen anderen', 'Een ander of een Duits diploma')] },
      { t: 'wahl', k: L('Beginn', 'Begin'), f: L('Die Ausbildung beginnt am 1. August 2027. Passt das für dich?', 'De opleiding begint op 1 augustus 2027. Past dat bij je?'), a: [L('Ja, passt', 'Ja, dat past'), L('Ich suche für später', 'Ik zoek voor later')] } ] },
    initiativ: { name: L('Initiativbewerbung', 'Open sollicitatie'), kurz: L('Etwas anderes', 'Iets anders'), sub: L('Initiativbewerbung', 'Open sollicitatie'), s: [
      { t: 'mehr', k: L('Bereich', 'Afdeling'), f: L('In welchem Bereich möchtest du arbeiten?', 'Op welke afdeling wil je werken?'), h: L('Du kannst mehrere antippen.', 'Je kunt er meerdere aantikken.'),
        a: [L('Produktion', 'Productie'), L('Lager und Versand', 'Magazijn en verzending'), L('Lkw fahren', 'Vrachtwagen rijden'), L('Technik und Instandhaltung', 'Techniek en onderhoud'), L('Büro', 'Kantoor')] },
      START ] }
  };
  var REIHE = ['produktion', 'lkw', 'lager', 'elektro', 'ausbildung', 'initiativ'];
  var ZEITEN = [L('Vormittags', "'s Ochtends"), L('Mittags', "'s Middags"), L('Nachmittags', 'Later in de middag'), L('Egal', 'Maakt niet uit')];

  var z;
  function neu(stelle) { z = { stelle: stelle || null, i: stelle ? 0 : -1, a: [], fertig: false, kontakt: null }; }
  neu();

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function schritte() { return z.stelle ? STELLEN[z.stelle].s : []; }
  function gesamt() { return z.stelle ? schritte().length + 2 : 5; }
  function text(i) {
    var s = schritte()[i], a = z.a[i];
    if (a === undefined) return null;
    if (s.t === 'mehr') return a.length ? a.map(function (k) { return s.a[k]; }).join(', ') : L('Nichts davon', 'Geen van deze');
    return s.a[a];
  }

  function zeige(html, fokus) {
    buehne.classList.remove('neu');
    buehne.innerHTML = html;
    void buehne.offsetWidth;
    buehne.classList.add('neu');
    if (fokus) { var h = buehne.querySelector('h3'); if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); } }
  }

  function maleZettel() {
    var zeilen = [];
    if (z.stelle) zeilen.push([L('Stelle', 'Functie'), STELLEN[z.stelle].name, -1]);
    schritte().forEach(function (s, i) { var t = text(i); if (t !== null) zeilen.push([s.k, t, i]); });
    if (z.kontakt) zeilen.push([L('Kontakt', 'Contact'), z.kontakt, schritte().length]);
    leer.hidden = zeilen.length > 0;
    zettel.innerHTML = zeilen.map(function (r) {
      var aktiv = !z.fertig && r[2] === z.i;
      return '<div' + (aktiv ? ' class="jetzt"' : '') + '><dt>' + esc(r[0]) + '</dt><dd><span>' + esc(r[1]) + '</span>' +
        (z.fertig ? '' : '<button type="button" data-zu="' + r[2] + '" aria-label="' + esc(r[0] + ': ' + L('ändern', 'wijzigen')) + '">' + L('ändern', 'wijzigen') + '</button>') + '</dd></div>';
    }).join('');
    var offen = z.fertig ? 0 : gesamt() - (z.i + 1);
    dauer.textContent = z.fertig ? '' : z.i < 0 ? L('Dauer: etwa zwei Minuten.', 'Duur: ongeveer twee minuten.')
      : offen <= 1 ? L('Gleich geschafft.', 'Bijna klaar.') : L('Noch ' + (offen - 1) + (offen - 1 === 1 ? ' Frage' : ' Fragen') + ', dann dein Kontakt.', 'Nog ' + (offen - 1) + (offen - 1 === 1 ? ' vraag' : ' vragen') + ', daarna je contact.');
  }

  function kacheln(liste, attr, spalten, gewaehlt) {
    return '<div class="kacheln kacheln--' + spalten + '">' + liste.map(function (a, k) {
      var haupt = typeof a === 'string' ? a : a[0], neben = typeof a === 'string' ? '' : a[1];
      return '<button class="kachel' + (gewaehlt === k ? ' an' : '') + '" type="button" ' + attr + '="' + k + '"><span>' + esc(haupt) + (neben ? '<small>' + esc(neben) + '</small>' : '') + '</span></button>';
    }).join('') + '</div>';
  }

  function male(fokus) {
    var n = schritte().length, nr = z.i + 2, ges = gesamt();
    zurueck.hidden = z.i < 0 || z.fertig;
    balken.style.width = (z.fertig ? 100 : Math.round(100 * (nr - 1) / ges)) + '%';
    maleZettel();

    if (z.fertig) {
      stand.textContent = L('Fertig', 'Klaar');
      zeige('<h3>' + L('Das war ein Test. Es wurde nichts gesendet.', 'Dit was een test. Er is niets verzonden.') + '</h3>' +
        '<p>' + L('In der fertigen Website geht deine Bewerbung jetzt an Gethke. So geht es danach weiter:', 'In de definitieve website gaat je sollicitatie nu naar Gethke. Zo gaat het daarna verder:') + '</p>' +
        '<ol class="ablauf"><li>' + L('Gethke bestätigt dir sofort den Eingang.', 'Gethke bevestigt meteen de ontvangst.') + '</li><li>' +
        L('Innerhalb von fünf Werktagen ruft dich jemand aus dem Werk an.', 'Binnen vijf werkdagen belt iemand van de fabriek je op.') + '</li><li>' +
        L('Wenn alles passt, lernt ihr euch bei einem Gespräch im Werk kennen.', 'Als alles past, leren jullie elkaar kennen bij een gesprek in de fabriek.') + '</li></ol>' +
        '<p class="bew__weiter"><button class="knopf knopf--weiss" type="button" data-neu>' + L('Noch einmal von vorn', 'Opnieuw beginnen') + '</button></p>', fokus);
      return;
    }
    if (z.i < 0) {
      stand.textContent = L('Schritt 1', 'Stap 1');
      zeige('<h3>' + L('Wofür möchtest du dich bewerben?', 'Waarvoor wil je solliciteren?') + '</h3>' +
        kacheln(REIHE.map(function (k) { return [STELLEN[k].kurz, STELLEN[k].sub]; }), 'data-nr', 2), fokus);
      return;
    }
    stand.textContent = L('Schritt ' + nr + ' von ' + ges, 'Stap ' + nr + ' van ' + ges);
    if (z.i < n) {
      var s = schritte()[z.i], kopf = '<h3>' + esc(s.f) + '</h3>' + (s.h ? '<p>' + esc(s.h) + '</p>' : '');
      if (s.t === 'wahl') {
        zeige(kopf + kacheln(s.a, 'data-antwort', s.a.length === 2 || s.a.length === 4 ? 2 : s.a.length > 4 ? 2 : 3, z.a[z.i]), fokus);
      } else if (s.t === 'mehr') {
        var an = z.a[z.i] || [];
        zeige(kopf + '<div class="kacheln kacheln--2">' + s.a.map(function (a, k) {
          return '<button class="kachel kachel--haken' + (an.indexOf(k) > -1 ? ' an' : '') + '" type="button" data-haken="' + k + '" aria-pressed="' + (an.indexOf(k) > -1) + '"><i aria-hidden="true"></i><span>' + esc(a) + '</span></button>';
        }).join('') + '</div><p class="bew__weiter"><button class="knopf knopf--weiss" type="button" data-weiter>' + L('Weiter', 'Verder') + '</button></p>', fokus);
      } else {
        var w = z.a[z.i] === undefined ? 0 : z.a[z.i];
        zeige(kopf + '<div class="regler">' +
          '<output class="regler__wert" id="b-wert" for="b-regler">' + esc(s.a[w]) + '</output>' +
          '<input type="range" id="b-regler" style="--anteil:' + (100 * w / (s.a.length - 1)) + '%" min="0" max="' + (s.a.length - 1) + '" step="1" value="' + w + '" aria-label="' + esc(s.f) + '" aria-valuetext="' + esc(s.a[w]) + '">' +
          '<div class="regler__marken" aria-hidden="true">' + s.m.map(function (m, k) { return '<button type="button" tabindex="-1" data-marke="' + k + '"' + (k === w ? ' class="an"' : '') + '>' + esc(m) + '</button>'; }).join('') + '</div>' +
          '</div><p class="bew__weiter"><button class="knopf knopf--weiss" type="button" data-weiter>' + L('Weiter', 'Verder') + '</button></p>', fokus);
      }
      return;
    }
    /* Kontakt */
    zeige('<h3>' + L('Fast fertig. Wie erreichen wir dich?', 'Bijna klaar. Hoe bereiken wij je?') + '</h3>' +
      '<form class="formular bew__form" id="b-form" novalidate>' +
      '<fieldset class="umschalt"><legend class="sr">' + L('Kontaktweg', 'Contactmanier') + '</legend>' +
      '<label><input type="radio" name="weg" value="tel" checked><span>' + L('Ruft mich an', 'Bel mij') + '</span></label>' +
      '<label><input type="radio" name="weg" value="mail"><span>' + L('Schreibt mir eine E-Mail', 'Stuur mij een e-mail') + '</span></label></fieldset>' +
      '<div class="feld" id="b-rueck-feld"><label for="b-rueck">' + L('Deine Telefonnummer', 'Je telefoonnummer') + '</label>' +
      '<input id="b-rueck" name="rueck" type="tel" inputmode="tel" autocomplete="tel" aria-describedby="b-rueck-f" required>' +
      '<p class="fehler" id="b-rueck-f">' + L('Bitte trag eine Telefonnummer ein.', 'Vul een telefoonnummer in.') + '</p></div>' +
      '<fieldset id="b-zeit"><legend>' + L('Wann erreichen wir dich am besten?', 'Wanneer ben je het best bereikbaar?') + ' <small>' + L('(Angabe optional)', '(optioneel)') + '</small></legend><div class="wahl">' +
      ZEITEN.map(function (t, k) { return '<label><input type="radio" name="zeit" value="' + k + '"><span>' + esc(t) + '</span></label>'; }).join('') + '</div></fieldset>' +
      '<div class="feld"><label for="b-name">' + L('Vorname', 'Voornaam') + ' <small>' + L('(Angabe optional)', '(optioneel)') + '</small></label><input id="b-name" name="name" autocomplete="given-name"></div>' +
      '<div class="formular__fuss"><button class="knopf knopf--weiss" type="submit">' + L('Bewerbung abschicken', 'Sollicitatie versturen') + '</button><p>' + L('Entwurf: Es wird nichts versendet.', 'Ontwerp: er wordt niets verzonden.') + '</p></div></form>', fokus);
  }

  function start(stelle, beruf, scroll) {
    neu(stelle);
    if (stelle === 'ausbildung' && beruf !== undefined && beruf !== null && beruf !== '') { z.a[0] = +beruf; z.i = 1; }
    male(true);
    if (scroll) abschnitt.scrollIntoView({ behavior: ruhig ? 'auto' : 'smooth', block: 'start' });
  }
  function weiter() { z.i++; male(true); }

  buehne.addEventListener('click', function (e) {
    var b = e.target.closest('button');
    if (!b) return;
    if (b.dataset.nr !== undefined) { start(REIHE[+b.dataset.nr]); return; }
    if (b.dataset.antwort !== undefined) {
      z.a[z.i] = +b.dataset.antwort;
      Array.prototype.forEach.call(buehne.querySelectorAll('.kachel'), function (k) { k.classList.toggle('an', k === b); });
      maleZettel();
      setTimeout(weiter, ruhig ? 0 : 260);
      return;
    }
    if (b.dataset.haken !== undefined) {
      var an = z.a[z.i] || (z.a[z.i] = []), k = +b.dataset.haken, p = an.indexOf(k);
      if (p > -1) an.splice(p, 1); else { an.push(k); an.sort(); }
      b.classList.toggle('an', p === -1); b.setAttribute('aria-pressed', p === -1 ? 'true' : 'false');
      maleZettel();
      return;
    }
    if (b.dataset.marke !== undefined) { var r = document.getElementById('b-regler'); r.value = b.dataset.marke; regle(r); return; }
    if (b.hasAttribute('data-weiter')) {
      var s = schritte()[z.i];
      if (s.t === 'mehr' && !z.a[z.i]) z.a[z.i] = [];
      if (s.t === 'regler' && z.a[z.i] === undefined) z.a[z.i] = +document.getElementById('b-regler').value;
      weiter(); return;
    }
    if (b.hasAttribute('data-neu')) { neu(); male(true); }
  });

  function regle(r) {
    var s = schritte()[z.i], w = +r.value;
    z.a[z.i] = w;
    r.setAttribute('aria-valuetext', s.a[w]);
    r.style.setProperty('--anteil', (100 * w / (s.a.length - 1)) + '%');
    document.getElementById('b-wert').textContent = s.a[w];
    Array.prototype.forEach.call(buehne.querySelectorAll('[data-marke]'), function (m) { m.classList.toggle('an', +m.dataset.marke === w); });
    maleZettel();
  }
  buehne.addEventListener('input', function (e) {
    if (e.target.id === 'b-regler') regle(e.target);
    if (e.target.id === 'b-rueck') { document.getElementById('b-rueck-feld').classList.remove('feld--fehler'); e.target.removeAttribute('aria-invalid'); }
  });
  buehne.addEventListener('change', function (e) {
    if (e.target.name !== 'weg') return;
    var mail = e.target.value === 'mail', ein = document.getElementById('b-rueck');
    ein.type = mail ? 'email' : 'tel'; ein.setAttribute('inputmode', mail ? 'email' : 'tel'); ein.setAttribute('autocomplete', mail ? 'email' : 'tel');
    buehne.querySelector('label[for="b-rueck"]').textContent = mail ? L('Deine E-Mail-Adresse', 'Je e-mailadres') : L('Deine Telefonnummer', 'Je telefoonnummer');
    document.getElementById('b-rueck-f').textContent = mail ? L('Bitte trag eine E-Mail-Adresse ein.', 'Vul een e-mailadres in.') : L('Bitte trag eine Telefonnummer ein.', 'Vul een telefoonnummer in.');
    document.getElementById('b-zeit').hidden = mail;
    document.getElementById('b-rueck-feld').classList.remove('feld--fehler'); ein.removeAttribute('aria-invalid');
  });
  buehne.addEventListener('submit', function (e) {
    e.preventDefault();
    var f = e.target, ein = document.getElementById('b-rueck'), v = ein.value.trim(), mail = f.weg.value === 'mail';
    var ok = mail ? /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) : /^[+0-9][0-9 ()\/-]{5,}$/.test(v);
    if (!ok) { document.getElementById('b-rueck-feld').classList.add('feld--fehler'); ein.setAttribute('aria-invalid', 'true'); ein.focus(); return; }
    var zeit = f.zeit && f.zeit.value !== '' && !mail ? ', ' + ZEITEN[+f.zeit.value].toLowerCase() : '';
    z.kontakt = (mail ? L('E-Mail an ', 'E-mail naar ') : L('Anruf unter ', 'Bellen op ')) + v + zeit;
    z.fertig = true; male(true);
  });

  zurueck.addEventListener('click', function () {
    if (z.i <= 0) neu(); else z.i--;
    male(true);
  });
  zettel.addEventListener('click', function (e) {
    var b = e.target.closest('button[data-zu]');
    if (!b) return;
    var zu = +b.dataset.zu;
    if (zu < 0) neu(); else z.i = zu;
    male(true);
  });

  /* Stellen-Zeilen und Knöpfe außerhalb der Bühne starten die Bewerbung direkt */
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-stelle]');
    if (!b || abschnitt.contains(b)) return;
    start(b.dataset.stelle, b.dataset.beruf, true);
  });

  /* Einstieg von der Startseite: karriere.html?stelle=lkw#bewerben */
  var p = new URLSearchParams(location.search).get('stelle');
  if (p && STELLEN[p]) neu(p);
  male(false);
})();
