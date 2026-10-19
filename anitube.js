(function () {
  'use strict';

  if (window.anitube_plugin_ready) return;
  window.anitube_plugin_ready = true;

  var HOST = 'https://anitube.in.ua';
  var VERSION = '2.0.0';
  var ICON = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M21 3H3a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h5v2h8v-2h5a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zm0 14H3V5h18v12zM10 8v6l5-3z"/></svg>';
  var CSS = ".anitube-ep{position:relative;-webkit-border-radius:.3em;-moz-border-radius:.3em;border-radius:.3em;background-color:rgba(0,0,0,0.3);display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;will-change:transform}.anitube-ep__body{padding:1.2em;line-height:1.3;-webkit-box-flex:1;-webkit-flex-grow:1;-moz-box-flex:1;-ms-flex-positive:1;flex-grow:1;position:relative}@media screen and (max-width:480px){.anitube-ep__body{padding:.8em 1.2em}}.anitube-ep__img{position:relative;width:13em;-webkit-flex-shrink:0;-ms-flex-negative:0;flex-shrink:0;min-height:8.2em}.anitube-ep__img>img{position:absolute;top:0;left:0;width:100%;height:100%;-o-object-fit:cover;object-fit:cover;-webkit-border-radius:.3em;-moz-border-radius:.3em;border-radius:.3em;opacity:0;-webkit-transition:opacity .3s;-o-transition:opacity .3s;-moz-transition:opacity .3s;transition:opacity .3s}.anitube-ep__img--loaded>img{opacity:1}@media screen and (max-width:480px){.anitube-ep__img{width:7em;min-height:6em}}.anitube-ep__folder{padding:1em;-webkit-flex-shrink:0;-ms-flex-negative:0;flex-shrink:0}.anitube-ep__folder>svg{width:4.4em !important;height:4.4em !important}.anitube-ep__viewed{position:absolute;top:1em;left:1em;background:rgba(0,0,0,0.45);-webkit-border-radius:100%;-moz-border-radius:100%;border-radius:100%;padding:.25em;font-size:.76em}.anitube-ep__viewed>svg{width:1.5em !important;height:1.5em !important}.anitube-ep__episode-number{position:absolute;top:0;left:0;right:0;bottom:0;display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;-webkit-box-align:center;-webkit-align-items:center;-moz-box-align:center;-ms-flex-align:center;align-items:center;-webkit-box-pack:center;-webkit-justify-content:center;-moz-box-pack:center;-ms-flex-pack:center;justify-content:center;font-size:2em}.anitube-ep__loader{position:absolute;top:50%;left:50%;width:2em;height:2em;margin-left:-1em;margin-top:-1em;background:url(./img/loader.svg) no-repeat center center;-webkit-background-size:contain;-moz-background-size:contain;-o-background-size:contain;background-size:contain}.anitube-ep__head,.anitube-ep__footer{display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;-webkit-box-pack:justify;-webkit-justify-content:space-between;-moz-box-pack:justify;-ms-flex-pack:justify;justify-content:space-between;-webkit-box-align:center;-webkit-align-items:center;-moz-box-align:center;-ms-flex-align:center;align-items:center}.anitube-ep__timeline{margin:.8em 0}.anitube-ep__timeline>.time-line{display:block !important}.anitube-ep__title{font-size:1.7em;overflow:hidden;-o-text-overflow:ellipsis;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:1;line-clamp:1;-webkit-box-orient:vertical}@media screen and (max-width:480px){.anitube-ep__title{font-size:1.4em}}.anitube-ep__time{padding-left:2em}.anitube-ep__info{display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;-webkit-box-align:center;-webkit-align-items:center;-moz-box-align:center;-ms-flex-align:center;align-items:center}.anitube-ep__info>*{overflow:hidden;-o-text-overflow:ellipsis;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:1;line-clamp:1;-webkit-box-orient:vertical}.anitube-ep__quality{padding-left:1em;white-space:nowrap}.anitube-ep__scan-file{position:absolute;bottom:0;left:0;right:0}.anitube-ep__scan-file .broadcast__scan{margin:0}.anitube-ep .anitube-ep-split{font-size:.8em;margin:0 1em;-webkit-flex-shrink:0;-ms-flex-negative:0;flex-shrink:0}.anitube-ep.focus::after{content:'';position:absolute;top:-0.6em;left:-0.6em;right:-0.6em;bottom:-0.6em;-webkit-border-radius:.7em;-moz-border-radius:.7em;border-radius:.7em;border:solid .3em #fff;z-index:-1;pointer-events:none}.anitube-ep+.anitube-ep{margin-top:1.5em}.anitube-ep--folder .anitube-ep__footer{margin-top:.8em}.anitube-ep-watched{padding:1em}.anitube-ep-watched__icon>svg{width:1.5em;height:1.5em}.anitube-ep-watched__body{padding-left:1em;padding-top:.1em;display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;-webkit-flex-wrap:wrap;-ms-flex-wrap:wrap;flex-wrap:wrap}.anitube-ep-watched__body>span+span::before{content:' ● ';vertical-align:top;display:inline-block;margin:0 .5em}.anitube-ep-rate{display:-webkit-inline-box;display:-webkit-inline-flex;display:-moz-inline-box;display:-ms-inline-flexbox;display:inline-flex;-webkit-box-align:center;-webkit-align-items:center;-moz-box-align:center;-ms-flex-align:center;align-items:center}.anitube-ep-rate>svg{width:1.3em !important;height:1.3em !important}.anitube-ep-rate>span{font-weight:600;font-size:1.1em;padding-left:.7em}.anitube-empty{line-height:1.4}.anitube-empty__title{font-size:1.8em;margin-bottom:.3em}.anitube-empty__time{font-size:1.2em;font-weight:300;margin-bottom:1.6em}.anitube-empty__buttons{display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex}.anitube-empty__buttons>*+*{margin-left:1em}.anitube-empty__button{background:rgba(0,0,0,0.3);font-size:1.2em;padding:.5em 1.2em;-webkit-border-radius:.2em;-moz-border-radius:.2em;border-radius:.2em;margin-bottom:2.4em}.anitube-empty__button.focus{background:#fff;color:black}.anitube-empty__templates .anitube-empty-template:nth-child(2){opacity:.5}.anitube-empty__templates .anitube-empty-template:nth-child(3){opacity:.2}.anitube-empty-template{background-color:rgba(255,255,255,0.3);padding:1em;display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;-webkit-box-align:center;-webkit-align-items:center;-moz-box-align:center;-ms-flex-align:center;align-items:center;-webkit-border-radius:.3em;-moz-border-radius:.3em;border-radius:.3em}.anitube-empty-template>*{background:rgba(0,0,0,0.3);-webkit-border-radius:.3em;-moz-border-radius:.3em;border-radius:.3em}.anitube-empty-template__ico{width:4em;height:4em;margin-right:2.4em}.anitube-empty-template__body{height:1.7em;width:70%}.anitube-empty-template+.anitube-empty-template{margin-top:1em}";

  var userHash = '';

  // ======================= NETWORK =======================
  function isNative() { return Lampa.Platform.is('android'); }
  function proxy() { return Lampa.Storage.get('anitube_proxy', '') || ''; }

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

  function parseDoc(html) { return new DOMParser().parseFromString(html, 'text/html'); }

  function grabHash(html) {
    var m = html.match(/dle_login_hash\s*=\s*['"]([a-f0-9]+)['"]/);
    if (m) userHash = m[1];
    return userHash;
  }

  // ======================= ANITUBE API =======================
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

  function searchMany(queries, ok, fail) {
    queries = queries.filter(function (q, i, arr) { return q && q.length > 1 && arr.indexOf(q) === i; });
    (function next(i) {
      if (i >= queries.length) return ok([]);
      searchOne(queries[i], function (items) {
        items.length ? ok(items) : next(i + 1);
      }, i === queries.length - 1 ? fail : function () { next(i + 1); });
    })(0);
  }

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
    }).filter(function (g) { return g.player !== 'moon'; })
      .sort(function (a, b) { return (a.player === 'ashdi' ? 0 : 1) - (b.player === 'ashdi' ? 0 : 1); });
  }

  function loadPlaylist(item, ok, fail, retried) {
    function request() {
      get(HOST + '/engine/ajax/playlists.php?news_id=' + item.id + '&xfield=playlist&user_hash=' + userHash, function (text) {
        var json;
        try { json = JSON.parse(text); } catch (e) { json = null; }
        if (json && json.success && json.response) return ok(parsePlaylist(json.response));

        if (!retried) {
          return get(item.url, function (html) { grabHash(html); loadPlaylist(item, ok, fail, true); }, fail);
        }

        // старі тайтли: один iframe прямо на сторінці
        get(item.url, function (html) {
          var m = html.match(/<iframe[^>]+src=["']([^"']*ashdi[^"']+)["']/i);
          if (!m) return ok([]);
          var url = m[1].indexOf('//') === 0 ? 'https:' + m[1] : m[1];
          ok([{ id: '0', label: 'ASHDI', player: 'ashdi', episodes: [{ number: 1, title: item.title, url: url }] }]);
        }, fail);
      }, fail);
    }

    if (userHash) request();
    else get(item.url, function (html) { grabHash(html); request(); }, fail);
  }

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
    if (isNative() || !proxy()) return s;
    var p = proxy(), q = false;
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

  // ======================= CHOICE STORAGE =======================
  function getChoice(movie) {
    var all = Lampa.Storage.cache('anitube_choice', 3000, {});
    return all[movie.id] || {};
  }

  function saveChoice(movie, choice) {
    var all = Lampa.Storage.cache('anitube_choice', 3000, {});
    all[movie.id] = choice;
    Lampa.Storage.set('anitube_choice', all);
  }

  // ======================= COMPONENT =======================
  function Component(object) {
    var self = this;
    var scroll = new Lampa.Scroll({ mask: true, over: true });
    var files = new Lampa.Explorer(object);
    var filter = new Lampa.Filter(object);
    var movie = object.movie;
    var serial = !!movie.name;
    var last, initialized, images = [];

    var results = [];     // знайдені тайтли
    var current = null;   // вибраний тайтл
    var groups = [];      // озвучки/плеєри
    var groupIndex = 0;

    this.initialize = function () {
      filter.onSearch = function (value) {
        Lampa.Activity.replace({ search: value, clarification: true });
      };
      filter.onBack = function () { self.start(); };
      filter.onSelect = function (type, a, b) {
        if (type !== 'filter') return;
        if (a.reset) {
          saveChoice(movie, {});
          return Lampa.Activity.replace();
        }
        Lampa.Select.close();
        if (a.stype === 'title') {
          self.openItem(results[b.index]);
        } else if (a.stype === 'voice') {
          groupIndex = b.index;
          var ch = getChoice(movie);
          ch.voice = groups[groupIndex].label;
          saveChoice(movie, ch);
          self.buildFilter();
          self.draw();
        }
      };

      if (filter.addButtonBack) filter.addButtonBack();
      filter.render().find('.filter--sort').remove();

      files.appendFiles(scroll.render());
      files.appendHead(filter.render());
      scroll.body().addClass('torrent-list');
      scroll.minus(files.render().find('.explorer__files-head'));

      this.search();
    };

    this.loading = function (on) {
      if (on) this.activity.loader(true);
      else { this.activity.loader(false); this.activity.toggle(); }
    };

    this.reset = function () {
      last = false;
      images.forEach(function (img) { img.onerror = img.onload = function () {}; img.src = ''; });
      images = [];
      scroll.render().find('.empty').remove();
      scroll.clear();
    };

    this.empty = function (title, text) {
      this.reset();
      var html = Lampa.Template.get('anitube_empty', {});
      html.find('.anitube-empty__title').text(title || Lampa.Lang.translate('empty_title_two'));
      html.find('.anitube-empty__time').text(text || '');
      scroll.append(html);
      this.loading(false);
    };

    this.search = function () {
      this.loading(true);
      this.buildFilter();

      var queries = object.clarification
        ? [object.search]
        : [movie.name || movie.title, movie.original_name || movie.original_title];

      searchMany(queries, function (items) {
        results = items;
        if (!items.length) return self.empty('Нічого не знайдено', 'Спробуй уточнити назву через пошук угорі');

        var saved = getChoice(movie);
        var savedItem = saved.id && items.filter(function (i) { return i.id === saved.id; })[0];

        if (savedItem) self.openItem(savedItem);
        else if (items.length === 1) self.openItem(items[0]);
        else self.drawResults();
      }, function (err) {
        var st = err && err.status;
        self.empty('AniTube недоступний', 'status ' + st + (st === 0 ? ' — CORS, вкажи проксі в налаштуваннях AniTube' : ''));
      });
    };

    this.drawResults = function () {
      this.reset();
      this.buildFilter();
      results.forEach(function (it, i) {
        var html = Lampa.Template.get('anitube_ep_folder', { title: it.title, time: '', info: 'AniTube' });
        html.on('hover:enter', function () { self.openItem(it); })
          .on('hover:focus', function (e) { last = e.target; scroll.update($(e.target), true); });
        scroll.append(html);
      });
      this.loading(false);
    };

    this.openItem = function (item) {
      current = item;
      this.loading(true);

      loadPlaylist(item, function (list) {
        groups = list;
        if (!groups.length) return self.empty('Немає доступних серій', 'Можливо, тут лише плеєр MoonAnime — він не підтримується');

        var ch = getChoice(movie);
        groupIndex = 0;
        if (ch.id === item.id && ch.voice) {
          for (var i = 0; i < groups.length; i++) if (groups[i].label === ch.voice) groupIndex = i;
        }
        ch.id = item.id;
        ch.voice = groups[groupIndex].label;
        saveChoice(movie, ch);

        self.buildFilter();
        self.draw();
      }, function (err) {
        self.empty('Помилка завантаження плейлиста', 'status ' + (err && err.status));
      });
    };

    this.buildFilter = function () {
      var select = [{ title: Lampa.Lang.translate('torrent_parser_reset'), reset: true }];
      var chosen = [];

      if (results.length > 1) {
        select.push({
          title: 'Тайтл',
          subtitle: current ? current.title : '',
          stype: 'title',
          items: results.map(function (r, i) { return { title: r.title, selected: current && r.id === current.id, index: i }; })
        });
      }

      if (groups.length) {
        select.push({
          title: Lampa.Lang.translate('torrent_parser_voice'),
          subtitle: groups[groupIndex].label,
          stype: 'voice',
          items: groups.map(function (g, i) { return { title: g.label, subtitle: g.episodes.length + ' сер.', selected: i === groupIndex, index: i }; })
        });
        chosen.push(groups[groupIndex].label);
      }

      filter.set('filter', select);
      filter.chosen('filter', chosen);
    };

    this.seasonNumber = function () {
      var m = current && current.title.match(/(\d+)\s*сезон|сезон\s*(\d+)/i);
      return m ? parseInt(m[1] || m[2], 10) : 1;
    };

    this.getTmdbEpisodes = function (season, call) {
      if (serial && typeof movie.id === 'number' && Lampa.Api.sources.tmdb) {
        Lampa.Api.sources.tmdb.get('tv/' + movie.id + '/season/' + season, {}, function (data) {
          call((data && data.episodes) || []);
        }, function () { call([]); });
      } else call([]);
    };

    this.draw = function () {
      this.reset();
      var group = groups[groupIndex];
      var season = this.seasonNumber();
      var choice = getChoice(movie);
      var viewed = Lampa.Storage.cache('online_view', 5000, []);

      this.getTmdbEpisodes(season, function (tmdb) {
        var focusEl = null;

        group.episodes.forEach(function (ep, index) {
          var info = [];
          var tm = tmdb.filter(function (t) { return t.episode_number === ep.number; })[0];
          var hashTimeline = Lampa.Utils.hash(serial ? [season, ep.number, movie.original_title || movie.original_name].join('') : (movie.original_title || movie.original_name));
          var hashView = Lampa.Utils.hash([hashTimeline, group.label].join(''));

          if (tm && tm.vote_average) info.push(Lampa.Template.get('anitube_ep_rate', { rate: parseFloat(tm.vote_average).toFixed(1) }, true));
          if (tm && tm.air_date) info.push(Lampa.Utils.parseTime(tm.air_date).full);
          info.push(group.label);

          var runtime = (tm && tm.runtime) || movie.runtime || 0;
          var html = Lampa.Template.get('anitube_ep_full', {
            title: (tm && tm.name) || (serial ? 'Серія ' + ep.number : current.title),
            time: runtime ? Lampa.Utils.secondsToTime(runtime * 60, true) : '',
            info: info.map(function (i) { return '<span>' + i + '</span>'; }).join('<span class="anitube-ep-split">●</span>'),
            quality: ''
          });

          var image = html.find('.anitube-ep__img');
          var loader = html.find('.anitube-ep__loader');
          var still = tm && tm.still_path ? tm.still_path : (!serial ? movie.backdrop_path : '');
          var number = '<div class="anitube-ep__episode-number">' + ('0' + ep.number).slice(-2) + '</div>';

          if (still) {
            var img = html.find('img')[0];
            img.onerror = function () { loader.remove(); image.append(number); };
            img.onload = function () { image.addClass('anitube-ep__img--loaded'); loader.remove(); if (serial) image.append(number); };
            img.src = Lampa.TMDB.image('t/p/w300' + still);
            images.push(img);
          } else {
            loader.remove();
            image.append(number);
          }

          var timeline = Lampa.Timeline.view(hashTimeline, Lampa.Timeline.link ? Lampa.Timeline.link(movie, season, ep.number) : undefined);
          html.find('.anitube-ep__timeline').append(Lampa.Timeline.render(timeline));

          if (viewed.indexOf(hashView) !== -1) {
            image.append('<div class="anitube-ep__viewed">' + Lampa.Template.get('icon_viewed', {}, true) + '</div>');
          }

          if (choice.episode === ep.number && choice.voice === group.label) focusEl = html;

          ep.timeline = timeline;
          ep.hashView = hashView;

          html.on('hover:enter', function () {
            if (movie.id) Lampa.Favorite.add('history', movie, 100);
            self.play(group, index, season, html);
          }).on('hover:focus', function (e) {
            last = e.target;
            scroll.update($(e.target), true);
          });

          scroll.append(html);
        });

        if (focusEl) last = focusEl[0];
        self.loading(false);
      });
    };

    this.markViewed = function (ep, html) {
      var viewed = Lampa.Storage.cache('online_view', 5000, []);
      if (viewed.indexOf(ep.hashView) === -1) {
        viewed.push(ep.hashView);
        Lampa.Storage.set('online_view', viewed);
      }
      if (html && !html.find('.anitube-ep__viewed').length) {
        html.find('.anitube-ep__img').append('<div class="anitube-ep__viewed">' + Lampa.Template.get('icon_viewed', {}, true) + '</div>');
      }
      var ch = getChoice(movie);
      ch.episode = ep.number;
      saveChoice(movie, ch);
    };

    this.play = function (group, index, season, html) {
      var title = current.title;

      var playlist = group.episodes.map(function (ep) {
        var pi = { title: serial ? title + ' — ' + ep.number + ' серія' : title, timeline: ep.timeline, season: season, episode: ep.number };
        pi.url = function (call) {
          resolve(ep.url, function (s) {
            pi.url = s.url; pi.quality = s.quality;
            self.markViewed(ep);
            call();
          }, function () { Lampa.Noty.show('AniTube: не вдалося отримати потік'); });
        };
        return pi;
      });

      Lampa.Loading.start(function () { Lampa.Loading.stop(); });
      resolve(group.episodes[index].url, function (s) {
        Lampa.Loading.stop();
        var cur = playlist[index];
        cur.url = s.url;
        cur.quality = s.quality;
        self.markViewed(group.episodes[index], html);
        Lampa.Player.play(cur);
        Lampa.Player.playlist(playlist);
      }, function () {
        Lampa.Loading.stop();
        Lampa.Noty.show('AniTube: не вдалося отримати потік');
      });
    };

    this.create = function () { return this.render(); };

    this.start = function () {
      if (Lampa.Activity.active().activity !== this.activity) return;
      if (!initialized) { initialized = true; this.initialize(); }

      Lampa.Background.immediately(Lampa.Utils.cardImgBackgroundBlur(movie));

      Lampa.Controller.add('content', {
        toggle: function () {
          Lampa.Controller.collectionSet(scroll.render(), files.render());
          Lampa.Controller.collectionFocus(last || false, scroll.render());
        },
        up: function () { if (Navigator.canmove('up')) Navigator.move('up'); else Lampa.Controller.toggle('head'); },
        down: function () { Navigator.move('down'); },
        right: function () { if (Navigator.canmove('right')) Navigator.move('right'); else filter.show(Lampa.Lang.translate('title_filter'), 'filter'); },
        left: function () { if (Navigator.canmove('left')) Navigator.move('left'); else Lampa.Controller.toggle('menu'); },
        back: this.back
      });
      Lampa.Controller.toggle('content');
    };

    this.render = function () { return files.render(); };
    this.back = function () { Lampa.Activity.backward(); };
    this.pause = function () {};
    this.stop = function () {};
    this.destroy = function () {
      this.reset();
      files.destroy();
      scroll.destroy();
    };
  }

  // ======================= TEMPLATES =======================
  function addTemplates() {
    Lampa.Template.add('anitube_ep_full', '<div class="anitube-ep anitube-ep--full selector">' +
      '<div class="anitube-ep__img"><img alt=""><div class="anitube-ep__loader"></div></div>' +
      '<div class="anitube-ep__body">' +
      '<div class="anitube-ep__head"><div class="anitube-ep__title">{title}</div><div class="anitube-ep__time">{time}</div></div>' +
      '<div class="anitube-ep__timeline"></div>' +
      '<div class="anitube-ep__footer"><div class="anitube-ep__info">{info}</div><div class="anitube-ep__quality">{quality}</div></div>' +
      '</div></div>');

    Lampa.Template.add('anitube_ep_folder', '<div class="anitube-ep anitube-ep--folder selector">' +
      '<div class="anitube-ep__folder"><svg viewBox="0 0 128 112" fill="none" xmlns="http://www.w3.org/2000/svg">' +
      '<rect y="20" width="128" height="92" rx="13" fill="white"></rect>' +
      '<path d="M29.9963 8H98.0037C96.0446 3.3021 91.4079 0 86 0H42C36.5921 0 31.9555 3.3021 29.9963 8Z" fill="white" fill-opacity="0.23"></path>' +
      '<rect x="11" y="8" width="106" height="76" rx="13" fill="white" fill-opacity="0.51"></rect></svg></div>' +
      '<div class="anitube-ep__body">' +
      '<div class="anitube-ep__head"><div class="anitube-ep__title">{title}</div><div class="anitube-ep__time">{time}</div></div>' +
      '<div class="anitube-ep__footer"><div class="anitube-ep__info">{info}</div></div>' +
      '</div></div>');

    Lampa.Template.add('anitube_ep_rate', '<div class="anitube-ep-rate">' +
      '<svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">' +
      '<path d="M8.39409 0.192139L10.99 5.30994L16.7882 6.20387L12.5475 10.4277L13.5819 15.9311L8.39409 13.2425L3.20626 15.9311L4.24065 10.4277L0 6.20387L5.79819 5.30994L8.39409 0.192139Z" fill="#fff"></path>' +
      '</svg><span>{rate}</span></div>');

    Lampa.Template.add('anitube_empty', '<div class="anitube-empty">' +
      '<div class="anitube-empty__title"></div><div class="anitube-empty__time"></div>' +
      '<div class="anitube-empty__templates">' +
      '<div class="anitube-empty-template"><div class="anitube-empty-template__ico"></div><div class="anitube-empty-template__body"></div></div>' +
      '<div class="anitube-empty-template"><div class="anitube-empty-template__ico"></div><div class="anitube-empty-template__body"></div></div>' +
      '<div class="anitube-empty-template"><div class="anitube-empty-template__ico"></div><div class="anitube-empty-template__body"></div></div>' +
      '</div></div>');
  }

  // ======================= BUTTON & SETTINGS =======================
  function addButton(e, attempt) {
    attempt = attempt || 0;
    var render = e.object && e.object.activity && e.object.activity.render();
    if (!render || render.find('.view--anitube').length) return;

    var box = render.find('.buttons--container').first();
    if (!box.length) box = render.find('.full-start-new__buttons, .full-start__buttons').first();
    if (!box.length) {
      if (attempt < 10) setTimeout(function () { addButton(e, attempt + 1); }, 300);
      return;
    }

    var btn = $('<div class="full-start__button selector view--online view--anitube" data-subtitle="AniTube v' + VERSION + '">' + ICON + '<span>AniTube</span></div>');
    btn.on('hover:enter', function () {
      var movie = e.data.movie;
      Lampa.Activity.push({
        url: '',
        title: 'AniTube',
        component: 'anitube',
        search: movie.name || movie.title,
        movie: movie,
        page: 1
      });
    });

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
    $('body').append('<style>' + CSS + '</style>');
    addTemplates();
    Lampa.Component.add('anitube', Component);
    addSettings();
    Lampa.Listener.follow('full', function (e) {
      if (e.type === 'complite' || e.type === 'complete') addButton(e);
    });
  }

  if (window.appready) init();
  else Lampa.Listener.follow('app', function (e) { if (e.type === 'ready') init(); });
})();
