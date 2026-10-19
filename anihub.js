(function () {
  'use strict';

  if (window.anihub_plugin_ready) return;
  window.anihub_plugin_ready = true;

  var API = 'https://api.anihub.in.ua';
  var ICON = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M8 5v14l11-7z"/></svg>';

  // ---------- network ----------
  function proxify(url) {
    var p = Lampa.Storage.get('anihub_proxy', '') || '';
    return p ? p + url : url;
  }

  // opts: { text: bool, cors: bool }  cors=true -> native on Android, otherwise via proxy
  function get(url, opts, ok, fail) {
    opts = opts || {};
    var net = new Lampa.Reguest();
    var useNative = opts.cors && Lampa.Platform.is('android') && typeof net.native === 'function';
    var target = opts.cors && !useNative ? proxify(url) : url;
    var params = { dataType: 'text', timeout: 15000 };

    net[useNative ? 'native' : 'silent'](target, function (data) {
      if (opts.text) return ok(typeof data === 'string' ? data : JSON.stringify(data));
      if (typeof data !== 'string') return ok(data);
      try { ok(JSON.parse(data)); } catch (e) { fail(e); }
    }, function (a, c) { fail(a || c); }, false, params);
  }

  // ---------- AniHub API ----------
  function searchAnime(movie, ok, fail) {
    var imdb = movie.imdb_id;
    var title = movie.original_name || movie.original_title || movie.name || movie.title || '';

    function bySearch() {
      if (title.length < 2) return ok([]);
      get(API + '/anime?page_size=20&search=' + encodeURIComponent(title), {}, function (r) {
        ok((r && r.items) || []);
      }, fail);
    }

    if (!imdb) return bySearch();
    get(API + '/anime?page_size=20&imdb_id=' + encodeURIComponent(imdb), {}, function (r) {
      var items = (r && r.items) || [];
      items.length ? ok(items) : bySearch();
    }, bySearch);
  }

  // !!! Перевір реальний ендпоінт і формат у DevTools сайту (вкладка Network на сторінці тайтлу)
  function loadEpisodes(anime, ok, fail) {
    get(API + '/anime/' + anime.id + '/episodes', {}, function (data) {
      ok(normalizeEpisodes(data));
    }, fail);
  }

  function normalizeEpisodes(data) {
    var list = Array.isArray(data) ? data : (data && (data.items || data.results || data.episodes)) || [];
    var out = [];
    list.forEach(function (e) {
      var url = e.url || e.video_url || e.embed_url || e.iframe || e.link || e.player_url;
      if (!url) return;
      var studio = e.dubbing_studio || e.studio || e.voice || e.dub;
      out.push({
        number: e.number || e.episode_number || e.episode || out.length + 1,
        title: e.title || e.name || '',
        dub: (studio && (studio.name || studio)) || 'Озвучення',
        player: e.player || e.provider || '',
        url: url
      });
    });
    out.sort(function (a, b) { return a.number - b.number; });
    return out;
  }

  // ---------- stream resolve ----------
  function parseQualities(file) {
    // формат Playerjs: "[480p]url1,[720p]url2"
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

  function resolve(url, ok, fail) {
    if (url.indexOf('//') === 0) url = 'https:' + url;
    if (/\.(m3u8|mp4)(\?|$)/i.test(url)) return ok({ url: url, quality: false });

    get(url, { text: true, cors: true }, function (html) {
      var m = html.match(/file\s*:\s*["']([^"']+)["']/) || html.match(/"file"\s*:\s*"([^"]+)"/);
      if (!m) return fail('file not found');
      var f = m[1].replace(/\\\//g, '/');
      if (f.charAt(0) === '[' && f.charAt(1) === '{') {
        try { f = firstFile(JSON.parse(f)); } catch (e) {}
      }
      if (!f) return fail('empty');
      ok(parseQualities(f));
    }, fail);
  }

  // ---------- UI ----------
  function back() { Lampa.Controller.toggle('full_start'); }

  function noty(t) { Lampa.Noty.show('AniHub: ' + t); }

  function play(episodes, index, anime) {
    var playlist = episodes.map(function (ep) {
      return {
        title: anime.title_ukrainian + ' — ' + ep.number + ' серія',
        url: function (call) {
          resolve(ep.url, function (s) { this.url = s.url; this.quality = s.quality; call(); }.bind(this),
            function () { noty('не вдалося отримати потік'); });
        }
      };
    });

    Lampa.Loading.start(function () { Lampa.Loading.stop(); });
    resolve(episodes[index].url, function (s) {
      Lampa.Loading.stop();
      var item = playlist[index];
      item.url = s.url;
      item.quality = s.quality;
      Lampa.Player.play(item);
      Lampa.Player.playlist(playlist);
    }, function () {
      Lampa.Loading.stop();
      noty('не вдалося отримати потік (CORS? вкажи проксі в налаштуваннях)');
    });
  }

  function chooseEpisode(episodes, anime) {
    Lampa.Select.show({
      title: anime.title_ukrainian,
      items: episodes.map(function (ep, i) {
        return { title: ep.number + ' серія' + (ep.title ? ' — ' + ep.title : ''), index: i };
      }),
      onSelect: function (a) { play(episodes, a.index, anime); },
      onBack: back
    });
  }

  function chooseDub(episodes, anime) {
    var groups = {}, names = [];
    episodes.forEach(function (ep) {
      var key = ep.dub + (ep.player ? ' (' + ep.player + ')' : '');
      if (!groups[key]) { groups[key] = []; names.push(key); }
      groups[key].push(ep);
    });
    if (names.length === 1) return chooseEpisode(groups[names[0]], anime);

    Lampa.Select.show({
      title: 'Озвучення',
      items: names.map(function (n) { return { title: n, subtitle: groups[n].length + ' серій', key: n }; }),
      onSelect: function (a) { chooseEpisode(groups[a.key], anime); },
      onBack: back
    });
  }

  function openAnime(anime) {
    Lampa.Loading.start(function () { Lampa.Loading.stop(); });
    loadEpisodes(anime, function (eps) {
      Lampa.Loading.stop();
      if (!eps.length) return noty('серій не знайдено');
      chooseDub(eps, anime);
    }, function () {
      Lampa.Loading.stop();
      noty('помилка завантаження серій');
    });
  }

  function start(movie) {
    Lampa.Loading.start(function () { Lampa.Loading.stop(); });
    searchAnime(movie, function (items) {
      Lampa.Loading.stop();
      if (!items.length) return noty('нічого не знайдено');
      if (items.length === 1) return openAnime(items[0]);

      Lampa.Select.show({
        title: 'AniHub',
        items: items.map(function (a) {
          return {
            title: a.title_ukrainian,
            subtitle: [a.year, a.type, a.episodes_count ? a.episodes_count + ' сер.' : ''].filter(Boolean).join(' · '),
            anime: a
          };
        }),
        onSelect: function (a) { openAnime(a.anime); },
        onBack: back
      });
    }, function () {
      Lampa.Loading.stop();
      noty('API недоступне');
    });
  }

  function addButton(e, attempt) {
    attempt = attempt || 0;
    var render = e.object && e.object.activity && e.object.activity.render();
    if (!render) return;
    if (render.find('.view--anihub').length) return;

    var box = render.find('.full-start-new__buttons, .full-start__buttons, .full-start-new__buttons-list').first();

    if (!box.length) {
      if (attempt < 10) return setTimeout(function () { addButton(e, attempt + 1); }, 300);
      return noty('не знайдено контейнер кнопок');
    }

    var btn = $('<div class="full-start__button selector view--anihub">' + ICON + '<span>AniHub</span></div>');
    btn.on('hover:enter', function () { start(e.data.movie); });

    var anchor = box.find('.view--torrent, .view--online').last();
    anchor.length ? anchor.after(btn) : box.append(btn);
  }

  function addSettings() {
    if (!Lampa.SettingsApi) return;
    Lampa.SettingsApi.addComponent({ component: 'anihub', name: 'AniHub', icon: ICON });
    Lampa.SettingsApi.addParam({
      component: 'anihub',
      param: { name: 'anihub_proxy', type: 'input', values: '', default: '', placeholder: 'https://your-proxy/' },
      field: { name: 'CORS-проксі', description: 'Префікс для запитів до плеєрів (не потрібен на Android)' }
    });
  }

  function init() {
    noty('плагін завантажено'); // тимчасово, для діагностики
    addSettings();
    Lampa.Listener.follow('full', function (e) {
      if (e.type === 'complite' || e.type === 'complete') addButton(e);
    });
  }

  if (window.appready) init();
  else Lampa.Listener.follow('app', function (e) { if (e.type === 'ready') init(); });
})();
