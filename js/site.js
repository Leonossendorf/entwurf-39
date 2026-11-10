/* Gethke Glas Gronau – Entwurf. Kein Tracking, keine Datenübertragung. */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var NL = document.documentElement.lang.slice(0, 2) === 'nl';
  var L = function (de, nl) { return NL ? nl : de; };
  var WURZEL = NL ? '../' : '';

  /* Stand-Check: GitHub Pages hält Seiten 10 Minuten im Zwischenspeicher */
  try {
    fetch(WURZEL + 'stand.txt?' + Date.now(), { cache: 'no-store' }).then(function (r) { return r.ok ? r.text() : ''; }).then(function (t) {
      t = t.trim();
      if (t && window.STAND && t !== window.STAND && !sessionStorage.getItem('stand-' + t)) {
        sessionStorage.setItem('stand-' + t, '1');
        location.reload();
      }
    }).catch(function () {});
  } catch (e) {}

  /* Sprachwechsel: die Stelle auf der Seite mitnehmen */
  $$('.sprache a').forEach(function (a) {
    a.addEventListener('click', function () { if (location.hash && a.getAttribute('href').indexOf('#') < 0) a.href = a.getAttribute('href') + location.search + location.hash; });
  });

  /* Menü am Handy */
  var mb = $('.kopf__menue'), nav = $('#hauptnav');
  if (mb && nav) {
    mb.addEventListener('click', function () {
      var offen = nav.classList.toggle('offen');
      mb.setAttribute('aria-expanded', offen ? 'true' : 'false');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) { nav.classList.remove('offen'); mb.setAttribute('aria-expanded', 'false'); }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('offen')) { nav.classList.remove('offen'); mb.setAttribute('aria-expanded', 'false'); mb.focus(); }
    });
  }

  /* ---------- Glasaufbau-Finder (Werte: SANCO-Datenblätter auf gethke.de) ---------- */
  var BASIS = 'https://gethke.de/www.gethke.de/contero/gallery/Downloads/';
  var DATEN = {
    waerme: { titel: L('Wärmedämmung', 'Warmte-isolatie'), produkt: 'SANCO Plus EN', pdf: 'wm_db_002_sanco_plus_en.pdf', stand: '01/2026', f: {
      2: [
        { a: '4-16AR-4', ug: '1,1', lt: 82, g: '61 / 65', gp: 1, lr: 12 },
        { a: '4-14AR-4', ug: '1,2', lt: 82, g: '61 / 65', gp: 1, lr: 12 },
        { a: '4-12AR-4', ug: '1,3', lt: 82, g: '61 / 65', gp: 1, lr: 12 },
        { a: '4-10KR-4', ug: '1,0', lt: 82, g: '61 / 65', gp: 1, lr: 12 }
      ],
      3: [
        { a: '4-14AR-4-14AR-4', ug: '0,6', lt: 74, g: '53', lr: 15 },
        { a: '4-12AR-4-12AR-4', ug: '0,7', lt: 74, g: '53', lr: 15 },
        { a: '4-18AR-4-18AR-4', ug: '0,5', lt: 74, g: '53', lr: 15 },
        { a: '4-10AR-4-10AR-4', ug: '0,8', lt: 74, g: '53', lr: 15 }
      ] } },
    schall: { titel: L('Schalldämmung', 'Geluidsisolatie'), produkt: 'SANCO Phon', pdf: 'wm_db_006_sanco_phon.pdf', stand: '01/2026', f: {
      2: [
        { n: '40/32', a: '10-16AR-6', ug: '1,1', lt: 80, g: '61', rw: 40 },
        { n: '37/28', a: '8-16AR-4', ug: '1,1', lt: 81, g: '62', rw: 37 },
        { n: '35/26', a: '6-16AR-4', ug: '1,1', lt: 81, g: '64', rw: 35 },
        { n: '30/24', a: '4-16AR-4', ug: '1,1', lt: 82, g: '65', rw: 30 }
      ],
      3: [
        { n: '41/44', a: '10-12AR-4-12AR-6', ug: '0,7', lt: 73, g: '50', rw: 41 },
        { n: '37/38', a: '6-12AR-4-12AR-4', ug: '0,7', lt: 74, g: '52', rw: 37 },
        { n: '33/36', a: '4-12AR-4-12AR-4', ug: '0,7', lt: 74, g: '53', rw: 33 }
      ] } },
    schallsicher: { titel: L('Schall und Sicherheit', 'Geluid en veiligheid'), produkt: 'SANCO Phon PS', pdf: 'wm_db_008_sanco_phon_ps.pdf', stand: '01/2026', f: {
      2: [
        { n: '42/31', a: '8VSG-16AR-6', ug: '1,1', lt: 80, g: '59', rw: 42 },
        { n: '36/27', a: '6VSG-16AR-4', ug: '1,1', lt: 81, g: '60', rw: 36 },
        { n: '45/35', a: '8VSG-16AR-10', ug: '1,1', lt: 80, g: '59', rw: 45 },
        { n: '50/42', a: '8VSG-20AR-12VSG', ug: '1,2', lt: 79, g: '58', rw: 50 }
      ],
      3: [
        { n: '42/43', a: '6-12AR-4-12AR-8VSG', ug: '0,7', lt: 73, g: '52', rw: 42 },
        { n: '45/45', a: '8-12AR-4-12AR-8VSG', ug: '0,7', lt: 72, g: '51', rw: 45 }
      ] } },
    sonne: { titel: L('Sonnenschutz', 'Zonwering'), produkt: 'SANCO Sun', pdf: 'wm_db_011_sanco_sun_combi.pdf', stand: '01/2026', f: {
      2: [
        { n: 'Selekt 70', a: '6-16AR-4', ug: '1,0', lt: 70, g: '37', lr: 13 },
        { n: 'Combi neutral 60', a: '6-16AR-4', ug: '1,0', lt: 60, g: '32', lr: 13 },
        { n: 'neutral 50', a: '6-16AR-4', ug: '1,0', lt: 51, g: '27', lr: 13 }
      ],
      3: [
        { n: 'Selekt 70', a: '6-14AR-4-14AR-4', ug: '0,6', lt: 63, g: '35', lr: 15 },
        { n: 'Combi neutral 60', a: '6-14AR-4-14AR-4', ug: '0,6', lt: 55, g: '30', lr: 14 },
        { n: 'Combi neutral 50', a: '6-14AR-4-14AR-4', ug: '0,6', lt: 46, g: '24', lr: 14 }
      ] } },
    einbruch: { titel: L('Einbruchhemmung', 'Inbraakwering'), produkt: 'SANCO Safe', pdf: 'wm_db_013_sanco_safe_356.pdf', stand: '05/2007', f: {
      2: [
        { n: 'P4A', a: '10VSG-16AR-4', ug: '1,2', lt: 78, g: '56', kl: 'P4A' },
        { n: 'P2A', a: '9VSG-16AR-4', ug: '1,2', lt: 78, g: '57', kl: 'P2A' },
        { n: 'P6B', a: '23VSG-16AR-6', ug: '1,2', lt: 73, g: '48', kl: 'P6B' },
        { n: 'P8B', a: '29VSG-16AR-6', ug: '1,2', lt: 71, g: '43', kl: 'P8B' }
      ] } }
  };
  var GAS = { AR: 'Argon', KR: 'Krypton', L: L('Luft', 'Lucht') };

  function lagen(a) {
    return a.split('-').map(function (t) {
      var m = /^(\d+)(AR|KR|L|VSG)?$/.exec(t);
      var mm = +m[1], z = m[2];
      if (z === 'VSG') return { art: 'vsg', mm: mm };
      if (z) return { art: 'szr', mm: mm, gas: z };
      return { art: 'glas', mm: mm };
    });
  }
  function formel(a) { return a.replace(/(\d+)(AR|KR|L|VSG)/g, '$1 $2').replace(/-/g, ' – '); }

  var finder = $('#finder');
  if (finder) {
    var zustand = { fn: 'waerme', fach: 2, i: 0 };
    var elFn = $('#f-funktion'), elFach = $('#f-fach'), elAuf = $('#f-aufbau');
    var radio = function (name, wert, text, an, aus) {
      return '<label><input type="radio" name="' + name + '" value="' + wert + '"' + (an ? ' checked' : '') + (aus ? ' disabled' : '') + '><span' + (aus ? ' style="opacity:.45"' : '') + '>' + text + '</span></label>';
    };
    elFn.innerHTML = Object.keys(DATEN).map(function (k) { return radio('fn', k, DATEN[k].titel, k === zustand.fn); }).join('');

    var zeichne = function () {
      var d = DATEN[zustand.fn];
      if (!d.f[zustand.fach]) zustand.fach = 2;
      var liste = d.f[zustand.fach];
      if (zustand.i >= liste.length) zustand.i = 0;
      var e = liste[zustand.i];
      elFach.innerHTML = radio('fach', 2, L('2-fach', 'Dubbel'), zustand.fach === 2) + radio('fach', 3, L('3-fach', 'Triple'), zustand.fach === 3, !d.f[3]);
      elAuf.innerHTML = liste.map(function (x, i) {
        return radio('auf', i, (x.n ? '<b style="font-weight:600;margin-right:.5em">' + x.n + '</b>' : '') + formel(x.a), i === zustand.i);
      }).join('');
      $('#f-aufbau-hilfe').textContent = d.f[3] ? '' : L('(dieses Datenblatt nennt nur 2-fach)', '(dit productblad noemt alleen dubbel glas)');

      var LG = lagen(e.a), summe = LG.reduce(function (s, l) { return s + l.mm; }, 0);
      var breit = $('#a-lagen').clientWidth || 320;
      var px = Math.min(9.6, (breit - 8) / 56);
      var kette = $('#a-kette'), lg = $('#a-lagen');
      /* vorhandene Elemente weiterverwenden, damit die Breiten weich wechseln */
      while (kette.children.length < LG.length) { kette.appendChild(document.createElement('div')); lg.appendChild(document.createElement('div')); }
      while (kette.children.length > LG.length) { kette.removeChild(kette.lastChild); lg.removeChild(lg.lastChild); }
      LG.forEach(function (l, i) {
        var w = Math.max(l.mm * px, 6) + 'px';
        kette.children[i].style.width = w;
        kette.children[i].innerHTML = '<b>' + l.mm + '</b>';
        var el = lg.children[i];
        el.className = 'lage lage--' + l.art;
        el.style.width = w;
        el.innerHTML = l.art === 'szr' ? '<i>' + (l.mm * px > 62 ? GAS[l.gas] : l.gas) + '</i>' : '';
      });
      $('#a-name').textContent = d.produkt + (e.n ? ' ' + e.n : '');
      $('#a-formel').textContent = formel(e.a);
      $('#a-dicke').textContent = summe + ' mm';
      $('#a-beschreibung').textContent = L('Schnitt von außen nach innen: ', 'Doorsnede van buiten naar binnen: ') + LG.map(function (l) {
        return l.art === 'szr' ? l.mm + L(' Millimeter Scheibenzwischenraum mit ', ' millimeter spouw met ') + GAS[l.gas] : l.mm + ' ' + L('Millimeter ', 'millimeter ') + (l.art === 'vsg' ? L('Verbundsicherheitsglas', 'gelaagd veiligheidsglas') : L('Glas', 'glas'));
      }).join(', ') + L('. Elementdicke ', '. Totale dikte ') + summe + L(' Millimeter.', ' millimeter.');
      var w4 = e.rw ? [L('Schalldämmwert R<sub>w</sub>', 'Geluidsisolatie R<sub>w</sub>'), e.rw + ' <small>dB</small>']
        : e.kl ? [L('Widerstandsklasse nach DIN EN 356', 'Weerstandsklasse volgens EN 356'), e.kl]
        : [L('Lichtreflexion außen', 'Lichtreflectie buiten'), e.lr + ' <small>%</small>'];
      $('#a-werte').innerHTML =
        '<div><dt>' + L('U<sub>g</sub>-Wert nach DIN EN 673', 'U<sub>g</sub>-waarde volgens EN 673') + '</dt><dd>' + e.ug + ' <small>W/m²K</small></dd></div>' +
        '<div><dt>' + L('Lichttransmission', 'Lichttransmissie') + '</dt><dd>' + e.lt + ' <small>%</small></dd></div>' +
        '<div><dt>' + L('g-Wert nach DIN EN 410', 'g-waarde volgens EN 410') + (e.gp ? L(', Schicht auf Pos. 2 / Pos. 3', ', coating op pos. 2 / pos. 3') : '') + '</dt><dd>' + e.g + ' <small>%</small></dd></div>' +
        '<div><dt>' + w4[0] + '</dt><dd>' + w4[1] + '</dd></div>';
      $('#a-pdf').href = BASIS + d.pdf;
      $('#a-pdf').textContent = L('Datenblatt ' + d.produkt + ' (PDF)', 'Productblad ' + d.produkt + ' (pdf, Duits)');
      $('#a-quelle').textContent = L('Werte aus dem SANCO-Datenblatt, Stand ' + d.stand + ', Toleranz ±2. Maßgeblich ist die Leistungserklärung zu Ihrer Lieferung.', 'Waarden uit het SANCO-productblad, stand ' + d.stand + ', tolerantie ±2. Bepalend is de prestatieverklaring bij uw levering.');
      $('#f-kurz-name').textContent = d.produkt + (e.n ? ' ' + e.n : '');
      $('#f-kurz-wert').textContent = formel(e.a) + ', Ug ' + e.ug + (e.rw ? ', Rw ' + e.rw + ' dB' : e.kl ? ', ' + e.kl : ', g ' + e.g + ' %');
      $('#a-anfragen').dataset.text = d.produkt + (e.n ? ' ' + e.n : '') + L(', Aufbau ', ', opbouw ') + formel(e.a) + L('\nMaße und Stückzahl: ', '\nMaten en aantallen: ');
    };
    finder.addEventListener('change', function (ev) {
      var t = ev.target, merk = t.name + '=' + t.value;
      if (t.name === 'fn') { zustand.fn = t.value; zustand.i = 0; }
      if (t.name === 'fach') { zustand.fach = +t.value; zustand.i = 0; }
      if (t.name === 'auf') { zustand.i = +t.value; }
      zeichne();
      /* Fokus nach dem Neuzeichnen zurückgeben (Tastatur) */
      var p = merk.split('='), neu = finder.querySelector('input[name="' + p[0] + '"][value="' + p[1] + '"]');
      if (neu) neu.focus({ preventScroll: true });
    });
    finder.addEventListener('submit', function (ev) { ev.preventDefault(); });
    zeichne();
    var rt; window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(zeichne, 150); });
  }

  /* ---------- Ansprechpartner (Quelle: gethke.de, Ansprechpartner) ---------- */
  var TEL = L('02562 7006-', '+49 2562 7006-');
  var K_DE = [L('Verkauf Deutschland', 'Verkoop Duitsland'), [['Agathe Poorthuis', '170'], ['Anne Buscholl', '162'], ['Jan van Koetsveld', '142'], ['Jonas Terwolbeck', '143']]];
  var K_NL = ['Verkoop Nederland', [['Michael Bernhart', '183'], ['André Jan Kottig', '181', L('auch Außendienst Niederlande', 'ook buitendienst Nederland')], ['André Schürmann', '182']]];
  var KONTAKTE = (NL ? [K_NL, K_DE] : [K_DE, K_NL]).concat([
    [L('Auftragsvorbereitung', 'Werkvoorbereiding'), [['Lukas Bauland', '190'], ['Silvia Meyer', '192'], ['Stefanie Aydin', '196']]],
    [L('Versand und Gestelle', 'Verzending en bokken'), [['Dieter Heckhuis', '231', L('Leitung Disposition und Versand', 'Hoofd planning en verzending')], ['Hannah Tersteege, Alina Silvi', '220', L('Versand, Gestellverwaltung', 'Verzending, beheer van bokken')]]]
  ]);
  var kg = $('#k-gruppen'), kl = $('#k-liste');
  if (kg && kl) {
    kg.innerHTML = KONTAKTE.map(function (g, i) {
      return '<label><input type="radio" name="kgruppe" value="' + i + '"' + (i === 0 ? ' checked' : '') + '><span' + (!NL && g[0] === 'Verkoop Nederland' ? ' lang="nl"' : '') + '>' + g[0] + '</span></label>';
    }).join('');
    var zeig = function (i) {
      kl.innerHTML = KONTAKTE[i][1].map(function (k) {
        return '<li><span>' + k[0] + (k[2] ? '<small>' + k[2] + '</small>' : '') + '</span><a href="tel:+4925627006' + k[1] + '">' + TEL + k[1] + '</a></li>';
      }).join('');
    };
    kg.addEventListener('change', function (e) { zeig(+e.target.value); });
    zeig(0);
  }

  /* ---------- Anfrageformular (Demo, sendet nichts) ---------- */
  var form = $('#anfrageform');
  if (form) {
    var erfolg = $('#anfrage-erfolg');
    var zweckWahl = function (z, text) {
      var r = form.querySelector('input[name="zweck"][value="' + z + '"]');
      if (!r) return;
      r.checked = true;
      $$('[data-fuer]', form).forEach(function (b) { b.hidden = b.dataset.fuer !== z; });
      if (text && z === 'glas') { var ta = $('#an-was'); ta.value = text; }
      $('#an-rueck').setAttribute('autocomplete', z === 'le' ? 'email' : 'on');
      form.querySelector('label[for="an-rueck"]').textContent = z === 'le' ? L('E-Mail-Adresse', 'E-mailadres') : L('Telefon oder E-Mail', 'Telefoon of e-mail');
      $('#an-rueck-h').textContent = z === 'le' ? L('Dorthin schicken wir die Leistungserklärung als PDF.', 'Daarheen sturen wij de prestatieverklaring als pdf.') : L('Damit wir antworten können. Eins von beiden genügt.', 'Zodat wij kunnen antwoorden. Eén van beide is genoeg.');
      $('#an-rueck-f').textContent = z === 'le' ? L('Bitte tragen Sie eine E-Mail-Adresse ein.', 'Vul een e-mailadres in.') : L('Bitte tragen Sie eine Telefonnummer oder eine E-Mail-Adresse ein.', 'Vul een telefoonnummer of een e-mailadres in.');
    };
    form.addEventListener('change', function (e) { if (e.target.name === 'zweck') zweckWahl(e.target.value); });
    /* Der Einstieg bestimmt die Vorauswahl */
    document.addEventListener('click', function (e) {
      var a = e.target.closest('a[data-zweck]');
      if (!a) return;
      erfolg.hidden = true; form.hidden = false;
      zweckWahl(a.dataset.zweck, a.dataset.text);
      if (a.dataset.text) setTimeout(function () { var ta = $('#an-was'); ta.focus({ preventScroll: true }); ta.setSelectionRange(ta.value.length, ta.value.length); }, 500);
    });
    var gueltig = function (v, nurMail) {
      v = v.trim();
      var mail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v), tel = /^[+0-9][0-9 ()\/-]{5,}$/.test(v);
      return nurMail ? mail : (mail || tel);
    };
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var z = form.zweck.value, feld = $('#an-rueck-feld'), ein = $('#an-rueck');
      if (!gueltig(ein.value, z === 'le')) {
        feld.classList.add('feld--fehler'); ein.setAttribute('aria-invalid', 'true'); ein.focus(); return;
      }
      feld.classList.remove('feld--fehler'); ein.removeAttribute('aria-invalid');
      $('#anfrage-erfolg-text').textContent = z === 'le'
        ? L('In der fertigen Website geht diese Nachricht an lek@gethke.de, und Sie erhalten Ihre Leistungserklärung als PDF per E-Mail.', 'In de definitieve website gaat dit bericht naar lek@gethke.de en ontvangt u uw prestatieverklaring als pdf per e-mail.')
        : z === 'glas'
          ? L('In der fertigen Website geht diese Anfrage direkt an den Verkauf, und Sie sehen hier, wer sich bei Ihnen meldet.', 'In de definitieve website gaat deze aanvraag direct naar de verkoop en ziet u hier wie contact met u opneemt.')
          : L('In der fertigen Website geht diese Nachricht an die Zentrale in Gronau.', 'In de definitieve website gaat dit bericht naar de centrale in Gronau.');
      form.hidden = true; erfolg.hidden = false; erfolg.focus();
    });
    $('#an-rueck').addEventListener('input', function () { $('#an-rueck-feld').classList.remove('feld--fehler'); this.removeAttribute('aria-invalid'); });
    $('#anfrage-neu').addEventListener('click', function () { form.reset(); zweckWahl('glas'); erfolg.hidden = true; form.hidden = false; $('#an-was').focus(); });
  }
})();
