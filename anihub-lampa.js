/*
 * AniHub for Lampa — community plugin
 * Version: 0.1.0
 *
 * Uses the public AniHub JSON API for catalog/search/details.
 * AniHub's documented public API does NOT expose episode lists or direct video streams,
 * so playback is handed off to the official AniHub page rather than inventing stream URLs.
 *
 * Install by hosting this file at a public HTTPS URL and adding that URL in Lampa extensions.
 */
(function () {
    'use strict';

    if (window.anihub_lampa_plugin_loaded) return;
    window.anihub_lampa_plugin_loaded = true;

    var API = 'https://api.anihub.in.ua';
    var SITE = 'https://anihub.in.ua';
    var COMPONENT_LIST = 'anihub_lampa_list';
    var COMPONENT_DETAIL = 'anihub_lampa_detail';

    function esc(value) {
        return String(value == null ? '' : value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function titleOf(item) {
        return item.title_ukrainian || item.title_english || item.title_original || item.title || 'Без назви';
    }

    function siteUrl(item) {
        if (item && item.slug) return SITE + '/anime/' + item.slug + '-' + item.id;
        if (item && item.id) return SITE + '/anime/' + item.id;
        return SITE;
    }

    function request(path, success, fail) {
        var req = new Lampa.Reguest();
        req.timeout(15000);
        req.get(API + path, function (data) {
            success(data);
        }, function (error) {
            if (fail) fail(error);
        });
        return req;
    }

    function getItems(data) {
        if (Object.prototype.toString.call(data) === '[object Array]') return data;
        return data && data.items ? data.items : [];
    }

    function openExternal(url) {
        // The site page contains the episode list/player. Lampa builds differ in external URL support.
        if (Lampa && Lampa.Navigator && typeof Lampa.Navigator.canplay === 'function') {
            // No direct media URL is available here; don't send a website URL to the video player.
        }
        try {
            window.open(url, '_blank');
        } catch (e) {
            if (Lampa.Noty) Lampa.Noty.show('Відкрийте AniHub у браузері: ' + url);
        }
    }

    function makeCard(item) {
        var name = titleOf(item);
        var poster = item.poster_url || item.poster || '';
        var year = item.year ? String(item.year) : '';
        var rating = item.rating != null ? '★ ' + item.rating : '';
        var dub = item.has_ukrainian_dub ? ' • Українське озвучення' : '';
        var meta = [year, rating].filter(function (x) { return !!x; }).join(' • ') + dub;
        var card = $('<div class="selector anihub-card">' +
            '<div class="anihub-card__poster">' +
                (poster ? '<img src="' + esc(poster) + '" loading="lazy">' : '<div class="anihub-no-poster">AniHub</div>') +
            '</div>' +
            '<div class="anihub-card__title">' + esc(name) + '</div>' +
            '<div class="anihub-card__meta">' + esc(meta) + '</div>' +
        '</div>');
        card.on('hover:enter', function () {
            Lampa.Activity.push({
                url: '',
                title: name,
                component: COMPONENT_DETAIL,
                item: item,
                page: 1
            });
        });
        return card;
    }

    function addStyles() {
        if ($('#anihub-lampa-styles').length) return;
        $('head').append('<style id="anihub-lampa-styles">' +
            '.anihub-wrap{padding:1.5em;}' +
            '.anihub-toolbar{display:flex;flex-wrap:wrap;gap:.7em;margin-bottom:1.2em;}' +
            '.anihub-action{padding:.7em 1em;border-radius:.3em;background:rgba(255,255,255,.12);cursor:pointer;}' +
            '.anihub-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(145px,1fr));gap:1.2em;}' +
            '.anihub-card{min-width:0;cursor:pointer;}' +
            '.anihub-card__poster{width:100%;aspect-ratio:2/3;background:rgba(255,255,255,.08);overflow:hidden;border-radius:.25em;}' +
            '.anihub-card__poster img{width:100%;height:100%;object-fit:cover;}' +
            '.anihub-no-poster{display:flex;height:100%;align-items:center;justify-content:center;}' +
            '.anihub-card__title{font-size:1em;margin-top:.45em;line-height:1.25;}' +
            '.anihub-card__meta{font-size:.8em;opacity:.7;margin-top:.3em;line-height:1.3;}' +
            '.anihub-detail{display:flex;gap:1.5em;padding:1.5em;max-width:1100px;}' +
            '.anihub-detail__poster{width:230px;max-width:32%;height:auto;object-fit:cover;align-self:flex-start;border-radius:.3em;}' +
            '.anihub-detail__body{flex:1;min-width:0;}' +
            '.anihub-detail__title{font-size:1.7em;margin-bottom:.5em;}' +
            '.anihub-detail__meta{opacity:.75;margin:.35em 0;}' +
            '.anihub-detail__desc{white-space:pre-wrap;line-height:1.5;margin:1em 0;}' +
            '.anihub-notice{padding:1em;opacity:.8;line-height:1.5;}' +
            '@media(max-width:600px){.anihub-detail{gap:1em;padding:1em}.anihub-detail__poster{width:120px}.anihub-detail__title{font-size:1.2em}}' +
        '</style>');
    }

    function ListScreen(object) {
        var self = this;
        var scroll = new Lampa.Scroll({ mask: true, over: true });
        var net = null;
        var alive = true;
        var page = object.page || 1;
        var search = object.search || '';
        var mode = object.mode || 'popular';
        var totalPages = 1;
        var root = $('<div class="anihub-wrap"></div>');
        var toolbar = $('<div class="anihub-toolbar"></div>');
        var grid = $('<div class="anihub-grid"></div>');
        var status = $('<div class="anihub-notice">Завантаження каталогу AniHub…</div>');

        function action(label, callback) {
            var btn = $('<div class="selector anihub-action">' + esc(label) + '</div>');
            btn.on('hover:enter', callback);
            toolbar.append(btn);
        }

        function load() {
            if (net && net.clear) net.clear();
            grid.empty();
            status.text('Завантаження…').show();
            var path = '';
            if (search) {
                path = '/anime?page=' + page + '&page_size=20&search=' + encodeURIComponent(search);
            } else if (mode === 'newest' || mode === 'seasonal' || mode === 'recommended' || mode === 'popular') {
                path = '/anime/' + mode + '/?limit=40';
            } else {
                path = '/anime?page=' + page + '&page_size=20&ordering=-rating&has_ukrainian_dub=true';
            }

            net = request(path, function (data) {
                if (!alive) return;
                var items = getItems(data);
                totalPages = data && data.total_pages ? data.total_pages : 1;
                if (items.length) {
                    status.hide();
                    items.forEach(function (item) { grid.append(makeCard(item)); });
                    if (mode === 'popular' || mode === 'newest' || mode === 'seasonal' || mode === 'recommended') {
                        status.text('Добірка: ' + items.length + ' тайтлів.').show();
                    }
                } else {
                    status.text('Нічого не знайдено. Спробуйте інший запит.').show();
                }
            }, function () {
                if (alive) status.text('Не вдалося завантажити AniHub API. Перевірте з’єднання та спробуйте ще раз.').show();
            });
        }

        this.create = function () {
            addStyles();
            action('Популярне', function () { search = ''; mode = 'popular'; page = 1; load(); });
            action('Новинки', function () { search = ''; mode = 'newest'; page = 1; load(); });
            action('Поточний сезон', function () { search = ''; mode = 'seasonal'; page = 1; load(); });
            action('Рекомендоване', function () { search = ''; mode = 'recommended'; page = 1; load(); });
            action('Пошук', function () {
                if (Lampa.Input && Lampa.Input.show) {
                    Lampa.Input.show({
                        title: 'Пошук аніме на AniHub',
                        value: search,
                        free: true,
                        nomic: true,
                        placeholder: 'Введіть назву аніме',
                        onBack: function () {},
                        onSelect: function (value) {
                            search = (value || '').trim();
                            mode = 'search';
                            page = 1;
                            load();
                        }
                    });
                } else {
                    Lampa.Noty.show('Пошук недоступний у цій версії Lampa.');
                }
            });
            action('Українське озвучення', function () { search = ''; mode = 'dub'; page = 1; load(); });
            action('Ще', function () {
                if (search || mode === 'dub') {
                    if (page < totalPages) { page++; load(); }
                    else Lampa.Noty.show('Це остання сторінка.');
                } else {
                    search = '';
                    mode = 'dub';
                    page = 1;
                    load();
                }
            });

            root.append(toolbar, status, grid);
            scroll.append(root);
            load();
            return scroll.render();
        };
        this.render = function () { return scroll.render(); };
        this.destroy = function () {
            alive = false;
            if (net && net.clear) net.clear();
            scroll.destroy();
            root.remove();
        };
        this.empty = function () { status.text('Немає результатів.').show(); };
    }

    function DetailScreen(object) {
        var item = object.item || {};
        var self = this;
        var alive = true;
        var net = null;
        var root = $('<div class="anihub-detail"><div class="anihub-notice">Завантаження картки…</div></div>');

        function renderDetail(data) {
            if (!alive) return;
            data = data || item;
            var name = titleOf(data);
            var poster = data.poster_url || item.poster_url || '';
            var genres = data.genres || [];
            if (genres.length && typeof genres[0] === 'object') {
                genres = genres.map(function (g) { return g.name_ukrainian || g.name || ''; });
            }
            var studios = (data.dubbing_studios || []).map(function (s) { return s.name; }).filter(Boolean);
            var meta = [];
            if (data.year) meta.push(String(data.year));
            if (data.type) meta.push(data.type.toUpperCase());
            if (data.episodes_count) meta.push(data.episodes_count + ' серій');
            if (data.rating != null) meta.push('★ ' + data.rating + '/10');
            if (data.age_rating) meta.push(data.age_rating);
            var desc = data.description || 'Опис відсутній.';
            root.empty().append(
                poster ? $('<img class="anihub-detail__poster">').attr('src', poster) : $('<div class="anihub-detail__poster anihub-no-poster">AniHub</div>'),
                $('<div class="anihub-detail__body"></div>').append(
                    $('<div class="anihub-detail__title"></div>').text(name),
                    $('<div class="anihub-detail__meta"></div>').text(meta.join(' • ')),
                    $('<div class="anihub-detail__meta"></div>').text(genres.join(', ')),
                    studios.length ? $('<div class="anihub-detail__meta"></div>').text('Озвучення: ' + studios.join(', ')) : $(),
                    $('<div class="anihub-detail__desc"></div>').text(desc),
                    $('<div class="anihub-toolbar"></div>').append(
                        $('<div class="selector anihub-action">Відкрити серії та плеєр AniHub</div>').on('hover:enter', function () {
                            openExternal(siteUrl(data));
                        }),
                        data.youtube_trailer ? $('<div class="selector anihub-action">Трейлер YouTube</div>').on('hover:enter', function () {
                            openExternal(data.youtube_trailer);
                        }) : $()
                    ),
                    $('<div class="anihub-notice"></div>').text('Список серій і прямі відеопотоки не входять до публічної документації API. Кнопка відкриває сторінку тайтлу на AniHub, де доступні серії та плеєр.')
                )
            );
        }

        this.create = function () {
            addStyles();
            if (item.id) {
                net = request('/anime/' + encodeURIComponent(item.id), function (data) {
                    renderDetail(data);
                }, function () {
                    renderDetail(item);
                });
            } else renderDetail(item);
            return root;
        };
        this.render = function () { return root; };
        this.destroy = function () {
            alive = false;
            if (net && net.clear) net.clear();
            root.remove();
        };
    }

    function init() {
        if (!window.Lampa || !Lampa.Component || !Lampa.Activity) return;

        addStyles();
        if (!Lampa.Component.get(COMPONENT_LIST)) Lampa.Component.add(COMPONENT_LIST, ListScreen);
        if (!Lampa.Component.get(COMPONENT_DETAIL)) Lampa.Component.add(COMPONENT_DETAIL, DetailScreen);

        var button = $('<li class="menu__item selector anihub-menu-item">' +
            '<div class="menu__ico"><svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm2 3v12l10-6z"/></svg></div>' +
            '<div class="menu__text">AniHub</div></li>');
        button.on('hover:enter', function () {
            Lampa.Activity.push({
                url: '',
                title: 'AniHub — аніме українською',
                component: COMPONENT_LIST,
                page: 1,
                mode: 'popular'
            });
        });
        $('.menu .menu__list').eq(0).append(button);
    }

    function start() {
        if (!window.Lampa) return;
        if (window.appready) init();
        else Lampa.Listener.follow('app', function (event) {
            if (event.type === 'ready') init();
        });
    }

    start();
})();
