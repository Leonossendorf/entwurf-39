/* Klickstrecke zur Bewerbung – Vorführung, sendet keine Daten. */
(function () {
  'use strict';
  var buehne = document.getElementById('s-schritt');
  if (!buehne) return;
  var stand = document.getElementById('s-stand'), zurueck = document.getElementById('s-zurueck');
  var abschnitt = document.getElementById('bewerben');

  var START = { f: 'Ab wann könntest du anfangen?', a: ['Sofort', 'In 1 bis 2 Monaten', 'In 3 Monaten oder später'] };
  var STELLEN = {
    produktion: { name: 'Produktionsmitarbeiter (m/w/d)', fragen: [
      { f: 'Früh- und Spätschicht im Wechsel: Passt das für dich?', a: ['Ja, passt', 'Das möchte ich erst besprechen'], zwei: 1 },
      { f: 'Hast du schon in einer Produktion gearbeitet?', h: 'Erfahrung ist kein Muss. Dein Team arbeitet dich gründlich ein.', a: ['Ja', 'Nein, ich lerne es gern'], zwei: 1 },
      START ] },
    lkw: { name: 'Lkw-Fahrer im Nahverkehr (m/w/d)', fragen: [
      { f: 'Welchen Führerschein hast du?', a: ['Klasse C', 'Klasse CE', 'Noch keinen von beiden'] },
      { f: 'Du belädst und entlädst die Glasgestelle selbst. Passt das für dich?', a: ['Ja, passt', 'Das möchte ich erst besprechen'], zwei: 1 },
      START ] },
    lager: { name: 'Fachkraft für Lagerlogistik oder Fachlagerist (m/w/d)', fragen: [
      { f: 'Hast du eine Ausbildung im Lager?', a: ['Fachkraft für Lagerlogistik', 'Fachlagerist', 'Nein, aber Erfahrung im Lager', 'Nein'] },
      START ] },
    elektro: { name: 'Elektroniker Betriebstechnik oder Mechatroniker (m/w/d)', fragen: [
      { f: 'Welche Ausbildung hast du?', a: ['Elektroniker für Betriebstechnik', 'Mechatroniker', 'Etwas Ähnliches'] },
      { f: 'Zur Instandhaltung gehören Schicht und Bereitschaft, beides mit Zulage. Passt das für dich?', a: ['Ja, passt', 'Das möchte ich erst besprechen'], zwei: 1 },
      START ] },
    ausbildung: { name: 'Ausbildung ab 1. August 2027', fragen: [
      { id: 'beruf', f: 'Welcher Beruf interessiert dich?', a: ['Flachglastechnologe/-in', 'Industriekaufmann/-frau', 'Fachkraft für Lagerlogistik', 'Fachlagerist/-in', 'Weiß ich noch nicht'] },
      { f: 'Welchen Schulabschluss hast du oder machst du gerade?', a: ['Hauptschulabschluss', 'Realschulabschluss', 'Fachabitur oder Abitur', 'Einen anderen'] },
      { f: 'Die Ausbildung beginnt am 1. August 2027. Passt das für dich?', a: ['Ja, passt', 'Ich suche für später'], zwei: 1 } ] },
    initiativ: { name: 'Initiativbewerbung', fragen: [
      { f: 'In welchem Bereich möchtest du arbeiten?', a: ['Produktion', 'Lager und Versand', 'Lkw fahren', 'Technik und Instandhaltung', 'Büro'] },
      START ] }
  };
  var WAHL = [['produktion', 'Produktionsmitarbeiter'], ['lkw', 'Lkw-Fahrer im Nahverkehr'], ['lager', 'Lagerlogistik'], ['elektro', 'Elektroniker oder Mechatroniker'], ['ausbildung', 'Ausbildung ab August 2027'], ['initiativ', 'Etwas anderes oder ich weiß es noch nicht']];

  var z = { stelle: null, i: -1, antworten: [], fertig: false };

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  function scheibe(anteil, fertig) {
    var n = fertig ? 5 : Math.min(4, Math.floor(anteil * 5 + 0.0001));
    var teile = abschnitt.querySelectorAll('.scheibe__bild .teil');
    teile[0].classList.toggle('da', n >= 1);
    teile[1].classList.toggle('da', n >= 2);
    teile[2].classList.toggle('da', n >= 3);
    teile[1].classList.toggle('gas', n >= 4);
    teile[1].classList.toggle('dicht', n >= 5);
    Array.prototype.forEach.call(abschnitt.querySelectorAll('.scheibe__liste li'), function (li) {
      li.classList.toggle('da', +li.dataset.teil <= n);
    });
  }

  function zeige(html, fokus) {
    buehne.classList.remove('neu');
    buehne.innerHTML = html;
    void buehne.offsetWidth;
    buehne.classList.add('neu');
    if (fokus) { var h = buehne.querySelector('h3'); if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); } }
  }

  function gesamt() { return z.stelle ? STELLEN[z.stelle].fragen.length + 2 : 5; }

  function male(fokus) {
    zurueck.hidden = z.i < 0 || z.fertig;
    if (z.fertig) {
      stand.textContent = 'Fertig';
      scheibe(1, true);
      zeige('<h3>Das war ein Test. Es wurde nichts gesendet.</h3>' +
        '<p>In der fertigen Website geht deine Bewerbung als ' + esc(STELLEN[z.stelle].name) + ' jetzt an Gethke. So geht es danach weiter:</p>' +
        '<ol class="ablauf"><li>Du bekommst sofort eine Bestätigung per E-Mail.</li><li>Gethke ruft dich innerhalb von fünf Werktagen an.</li><li>Wenn alles passt, lernt ihr euch bei einem Gespräch im Werk kennen.</li></ol>' +
        '<p style="margin-top:22px"><button class="knopf knopf--hell" type="button" data-neu>Noch einmal von vorn</button></p>', fokus);
      return;
    }
    if (z.i < 0) {
      stand.textContent = 'Schritt 1';
      scheibe(0);
      zeige('<h3>Wofür möchtest du dich bewerben?</h3><div class="antworten antworten--2">' +
        WAHL.map(function (w) { return '<button class="antwort" type="button" data-stelle="' + w[0] + '">' + esc(w[1]) + '</button>'; }).join('') + '</div>', fokus);
      return;
    }
    var s = STELLEN[z.stelle], n = s.fragen.length;
    stand.textContent = 'Schritt ' + (z.i + 2) + ' von ' + gesamt() + ': ' + s.name;
    scheibe((z.i + 1) / gesamt());
    if (z.i < n) {
      var q = s.fragen[z.i];
      zeige('<h3>' + esc(q.f) + '</h3>' + (q.h ? '<p>' + esc(q.h) + '</p>' : '') +
        '<div class="antworten' + (q.zwei ? ' antworten--2' : '') + '">' +
        q.a.map(function (a, k) { return '<button class="antwort" type="button" data-antwort="' + k + '">' + esc(a) + '</button>'; }).join('') + '</div>', fokus);
    } else {
      zeige('<h3>Fast fertig. Wie erreichen wir dich?</h3><p>Eine Telefonnummer oder eine E-Mail-Adresse genügt.</p>' +
        '<form class="formular" id="s-form" novalidate>' +
        '<div class="feld" id="s-rueck-feld"><label for="s-rueck">Telefon oder E-Mail</label><input id="s-rueck" name="rueck" autocomplete="tel" aria-describedby="s-rueck-f" required><p class="fehler" id="s-rueck-f">Bitte trag eine Telefonnummer oder eine E-Mail-Adresse ein.</p></div>' +
        '<div class="feld"><label for="s-name">Vorname <small>(Angabe optional)</small></label><input id="s-name" name="name" autocomplete="given-name"></div>' +
        '<div class="feld"><label for="s-text">Möchtest du noch etwas sagen? <small>(Angabe optional)</small></label><textarea id="s-text" name="text" style="min-height:84px"></textarea></div>' +
        '<div class="formular__fuss"><button class="knopf" type="submit">Bewerbung abschicken</button><p>Entwurf: Es wird nichts versendet.</p></div></form>', fokus);
    }
  }

  function start(stelle, beruf, scroll) {
    z = { stelle: stelle, i: 0, antworten: [], fertig: false };
    if (stelle === 'ausbildung' && beruf) { z.antworten[0] = beruf; z.i = 1; }
    male(true);
    if (scroll) abschnitt.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
  }

  buehne.addEventListener('click', function (e) {
    var b = e.target.closest('button');
    if (!b) return;
    if (b.dataset.stelle) { start(b.dataset.stelle); return; }
    if (b.dataset.antwort !== undefined) { z.antworten[z.i] = STELLEN[z.stelle].fragen[z.i].a[+b.dataset.antwort]; z.i++; male(true); return; }
    if (b.hasAttribute('data-neu')) { z = { stelle: null, i: -1, antworten: [], fertig: false }; male(true); }
  });
  buehne.addEventListener('submit', function (e) {
    e.preventDefault();
    var ein = document.getElementById('s-rueck'), v = ein.value.trim();
    var ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) || /^[+0-9][0-9 ()\/-]{5,}$/.test(v);
    if (!ok) { document.getElementById('s-rueck-feld').classList.add('feld--fehler'); ein.setAttribute('aria-invalid', 'true'); ein.focus(); return; }
    z.fertig = true; male(true);
  });
  zurueck.addEventListener('click', function () {
    if (z.i <= 0 || (z.stelle === 'ausbildung' && z.i === 1 && z.vorgewaehlt)) { z = { stelle: null, i: -1, antworten: [], fertig: false }; }
    else { z.i--; }
    male(true);
  });

  /* Stellen-Zeilen und Knöpfe außerhalb der Bühne starten die Strecke direkt */
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-stelle]');
    if (!b || buehne.contains(b)) return;
    start(b.dataset.stelle, b.dataset.beruf, true);
  });

  /* Einstieg von der Startseite: karriere.html?stelle=lkw#bewerben */
  var p = new URLSearchParams(location.search).get('stelle');
  if (p && STELLEN[p]) { z = { stelle: p, i: 0, antworten: [], fertig: false }; male(false); }
  else male(false);
})();
