(function () {
  'use strict';

  if (window.anitube_plugin_ready) return;
  window.anitube_plugin_ready = true;

  var HOST = 'https://anitube.in.ua';
  var ICON = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M21 3H3a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h5v2h8v-2h5a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zm0 14H3V5h18v12zM10 8v6l5-3z"/></svg>';

  var userHash = '';

  // ---------- network ----------
  function isNative() {
    return Lampa.Platform.is('android');
  }

  function proxy() {
    return Lampa.Storage.get('anitube_proxy', '') || '';
  }

  function get(url, ok, fail) {
    var net = new Lampa.Reguest();
    var nat = isNative() && typeof net.native === 'function';
    var target = nat ? url : proxy() + url;

    net[nat ? 'native' : 'silent'](target, function (data) {
      ok(typeof data === 'string' ? data : JSON.stringify(data));
    }, function (a) {
      var st = a && typeof a.status !== 'undefined' ? a.status : '?';
      console.log('AniTube request failed', st, target);
      fail({ status: st });
    }, false, { dataType: 'text', timeout: 15000, headers: { 'X-Requested-With': 'XMLHttpRequest' } });
  }

  function parseDoc(html) {
    return new DOMParser().parseFromString(html, 'text/html');
  }

  function grabHash(html) {
    var m = html.match(/dle_login_hash\s*=\s*['"]([a-f0-9]+)['"]/);
    if (m) userHash = m[1];
    return userHash;
  }

  function noty(t) { Lampa.Noty.show('AniTube: ' + t); }
  function back() { Lampa.Controller.toggle('full_start'); }
  function loading(on) { on ? Lampa.Loading.start(function () { Lampa.Loading.stop(); }) : Lampa.Loading.stop(); }

  // ---------- search ----------
  function searchOne(query, ok, fail) {
    get(HOST + '/index.php?do=search&subaction=search&story=' + encodeURIComponent(query), function (html) {
      grabHash(html);
      var doc = parseDoc(html), seen = {}, out = [];
      [].forEach.call(doc.querySelectorAll('h2 a[href]'), function (a) {
        var href = a.getAttribute('href') || '';
        var m = href.match(/\/(\d+)-[^\/]+\.html$/);
        if (!m || seen[m[1]]) return;
        seen[m[1]] = true;
        out.push({ id: m[1], title: a.textContent.trim(), url: href.indexOf('http') === 0 ? href : HOST + href });
      });
      ok(out);
    }, fail);
  }

  function search(movie, ok, fail) {
    var queries = [movie.name || movie.title, movie.original_name || movie.original_title]
      .filter(function (q, i, arr) { return q && q.length > 1 && arr.indexOf(q) === i; });

    (function next(i) {
      if (i >= queries.length) return ok([]);
      searchOne(queries[i], function (items) {
        items.length ? ok(items) : next(i + 1);
      }, i === queries.length - 1 ? fail : function () { next(i + 1); });
    })(0);
  }

  // ---------- playlist ----------
  function detectPlayer(url) {
    if (/ashdi/.test(url)) return 'ashdi';
    if (/moonanime/.test(url)) return 'moon';
    if (/tortuga/.test(url)) return 'trg';
    return 'other';
  }

  function parsePlaylist(html) {
    var doc = parseDoc(html), names = {}, groups = {}, order = [];

    [].forEach.call(doc.querySelectorAll('.playlists-lists li[data-id]'), function (li) {
      names[li.getAttribute('data-id')] = li.textContent.trim();
    });

    [].forEach.call(doc.querySelectorAll('li[data-file]'), function (li) {
      var id = li.getAttribute('data-id') || '0';
      var file = li.getAttribute('data-file');
      if (!file) return;
      if (file.indexOf('//') === 0) file = 'https:' + file;
      if (!groups[id]) { groups[id] = { id: id, episodes: [] }; order.push(id); }
      var text = li.textContent.trim();
      groups[id].episodes.push({ number: parseInt(text, 10) || groups[id].episodes.length + 1, title: text, url: file });
    });

    return order.map(function (id) {
      var parts = id.split('_'), labels = [];
      for (var i = 2; i <= parts.length; i++) {
        var key = parts.slice(0, i).join('_');
        if (names[key]) labels.push(names[key]);
      }
      var g = groups[id];
      g.label = labels.join(' · ') || 'Плеєр';
      g.player = detectPlayer(g.episodes[0].url);
      return g;
    });
  }

  function fallbackFromPage(item, ok, fail) {
    get(item.url, function (html) {
      grabHash(html);
      var m = html.match(/<iframe[^>]+src=["']([^"']*ashdi[^"']+)["']/i);
      if (!m) return ok([]);
      var url = m[1].indexOf('//') === 0 ? 'https:' + m[1] : m[1];
      ok([{ id: '0', label: 'ASHDI', player: 'ashdi', episodes: [{ number: 1, title: item.title, url: url }] }]);
    }, fail);
  }

  function loadPlaylist(item, ok, fail, retried) {
    function request() {
      get(HOST + '/engine/ajax/playlists.php?news_id=' + item.id + '&xfield=playlist&user_hash=' + userHash, function (text) {
        var json;
        try { json = JSON.parse(text); } catch (e) { json = null; }

        if (json && json.success && json.response) return ok(parsePlaylist(json.response));

        if (!retried) {
          // хеш міг застаріти — беремо свіжий зі сторінки тайтлу
          return get(item.url, function (html) {
            grabHash(html);
            loadPlaylist(item, ok, fail, true);
          }, fail);
        }
        fallbackFromPage(item, ok, fail);
      }, fail);
    }

    if (userHash) request();
    else get(item.url, function (html) { grabHash(html); request(); }, fail);
  }

  // ---------- stream ----------
  function parseQualities(file) {
    var map = {}, best = file, re = /\[([^\]]+)\]([^,\[]+)/g, m, any = false;
    while ((m = re.exec(file))) { map[m[1]] = m[2].trim(); best = m[2].trim(); any = true; }
    return { url: best, quality: any ? map : false };
  }

  function firstFile(pl) {
    for (var i = 0; i < pl.length; i++) {
      if (pl[i].file) return pl[i].file;
      if (pl[i].folder) { var f = firstFile(pl[i].folder); if (f) return f; }
    }
    return '';
  }

  function wrapStream(s) {
    // у браузері / на ТВ сегменти HLS теж блокує CORS — пускаємо через проксі
    if (isNative() || !proxy()) return s;
    var p = proxy();
    var q = false;
    if (s.quality) { q = {}; for (var k in s.quality) q[k] = p + s.quality[k]; }
    return { url: p + s.url, quality: q };
  }

  function resolve(url, ok, fail) {
    if (/\.(m3u8|mp4)(\?|$)/i.test(url)) return ok(wrapStream({ url: url, quality: false }));

    get(url, function (html) {
      var m = html.match(/file\s*:\s*["']([^"']+)["']/) || html.match(/"file"\s*:\s*"([^"]+)"/);
      if (!m) return fail('file not found');
      var f = m[1].replace(/\\\//g, '/');
      if (f.charAt(0) === '[' && f.charAt(1) === '{') {
        try { f = firstFile(JSON.parse(f)); } catch (e) {}
      }
      if (!f) return fail('empty');
      if (f.indexOf('//') === 0) f = 'https:' + f;
      ok(wrapStream(parseQualities(f)));
    }, fail);
  }

  // ---------- UI ----------
  function play(group, index, item) {
    var playlist = group.episodes.map(function (ep) {
      var pi = { title: item.title + ' — ' + ep.title };
      pi.url = function (call) {
        resolve(ep.url, function (s) { pi.url = s.url; pi.quality = s.quality; call(); },
          function () { noty('не вдалося отримати потік'); });
      };
      return pi;
    });

    loading(true);
    resolve(group.episodes[index].url, function (s) {
      loading(false);
      var cur = playlist[index];
      cur.url = s.url;
      cur.quality = s.quality;
      Lampa.Player.play(cur);
      Lampa.Player.playlist(playlist);
    }, function () {
      loading(false);
      noty('не вдалося отримати потік');
    });
  }

  function chooseEpisode(group, item) {
    if (group.episodes.length === 1) return play(group, 0, item);
    Lampa.Select.show({
      title: group.label,
      items: group.episodes.map(function (ep, i) { return { title: ep.title, index: i }; }),
      onSelect: function (a) { play(group, a.index, item); },
      onBack: back
    });
  }

  function chooseGroup(groups, item) {
    var playable = groups.filter(function (g) { return g.player !== 'moon'; });
    if (!playable.length) {
      return noty(groups.length ? 'є лише плеєр MoonAnime, він не підтримується' : 'серій не знайдено');
    }
    playable.sort(function (a, b) { return (a.player === 'ashdi' ? 0 : 1) - (b.player === 'ashdi' ? 0 : 1); });
    if (playable.length === 1) return chooseEpisode(playable[0], item);

    Lampa.Select.show({
      title: item.title,
      items: playable.map(function (g, i) { return { title: g.label, subtitle: g.episodes.length + ' сер.', index: i }; }),
      onSelect: function (a) { chooseEpisode(playable[a.index], item); },
      onBack: back
    });
  }

  function openItem(item) {
    loading(true);
    loadPlaylist(item, function (groups) {
      loading(false);
      chooseGroup(groups, item);
    }, function (err) {
      loading(false);
      noty('помилка завантаження плейлиста (status ' + (err && err.status) + ')');
    });
  }

  function start(movie) {
    loading(true);
    search(movie, function (items) {
      loading(false);
      if (!items.length) return noty('нічого не знайдено');
      if (items.length === 1) return openItem(items[0]);

      Lampa.Select.show({
        title: 'AniTube',
        items: items.map(function (it) { return { title: it.title, item: it }; }),
        onSelect: function (a) { openItem(a.item); },
        onBack: back
      });
    }, function (err) {
      loading(false);
      var st = err && err.status;
      noty('сайт недоступний (status ' + st + (st === 0 ? ' — CORS, вкажи проксі' : '') + ')');
    });
  }

  function addButton(e, attempt) {
    attempt = attempt || 0;
    var render = e.object && e.object.activity && e.object.activity.render();
    if (!render || render.find('.view--anitube').length) return;

    // нова Лампа: меню «Джерело» збирає кнопки з прихованого .buttons--container
    var box = render.find('.buttons--container').first();
    if (!box.length) box = render.find('.full-start-new__buttons, .full-start__buttons').first();
    if (!box.length) {
      if (attempt < 10) setTimeout(function () { addButton(e, attempt + 1); }, 300);
      return;
    }

    var btn = $('<div class="full-start__button selector view--online view--anitube" data-subtitle="AniTube — аніме українською">' + ICON + '<span>AniTube</span></div>');
    btn.on('hover:enter', function () { start(e.data.movie); });

    var anchor = box.find('.view--torrent, .view--online').not('.view--anitube').last();
    anchor.length ? anchor.after(btn) : box.append(btn);
  }

  function addSettings() {
    if (!Lampa.SettingsApi) return;
    Lampa.SettingsApi.addComponent({ component: 'anitube', name: 'AniTube', icon: ICON });
    Lampa.SettingsApi.addParam({
      component: 'anitube',
      param: { name: 'anitube_proxy', type: 'input', values: '', default: '', placeholder: 'https://your-proxy.workers.dev/' },
      field: { name: 'CORS-проксі', description: 'Потрібен у браузері / Tizen / webOS. На Android не потрібен' }
    });
  }

  function init() {
    addSettings();
    Lampa.Listener.follow('full', function (e) {
      if (e.type === 'complite' || e.type === 'complete') addButton(e);
    });
  }

  if (window.appready) init();
  else Lampa.Listener.follow('app', function (e) { if (e.type === 'ready') init(); });
})();
