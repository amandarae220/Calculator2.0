(function () {
    'use strict';

    var cfg = window.CALC_CONFIG;
    if (!cfg || !window.supabase || !window.supabase.createClient) return;

    // ── Localhost short-circuit ───────────────────────────────────────────────
    var host = window.location.hostname;
    var isLocalhost = host === 'localhost' || host === '127.0.0.1' || host === '::1';

    // ── Visitor identity (matches amanda-repository pattern) ──────────────────
    var VISITOR_ID_KEY        = 'calc_visitor_id';
    var VISITOR_ID_ISSUED_KEY = 'calc_visitor_id_issued_at';
    var VISITOR_ID_TTL_MS     = 30 * 24 * 60 * 60 * 1000; // 30 days

    function getVisitorId() {
        try {
            var existing = localStorage.getItem(VISITOR_ID_KEY);
            var issuedRaw = localStorage.getItem(VISITOR_ID_ISSUED_KEY);
            var issued = issuedRaw ? parseInt(issuedRaw, 10) : 0;
            var expired = !issued || Date.now() - issued > VISITOR_ID_TTL_MS;
            if (existing && !expired) return existing;
            var id = (crypto.randomUUID && crypto.randomUUID()) || ('v_' + Math.random().toString(36).slice(2) + Date.now().toString(36));
            localStorage.setItem(VISITOR_ID_KEY, id);
            localStorage.setItem(VISITOR_ID_ISSUED_KEY, String(Date.now()));
            return id;
        } catch (e) {
            return 'anon';
        }
    }

    function getDevice() {
        return navigator.maxTouchPoints > 0 ? 'touch' : 'mouse';
    }

    function getBrowser() {
        var ua = navigator.userAgent;
        if (/Edg\//.test(ua))     return 'Edge';
        if (/Chrome\//.test(ua))  return 'Chrome';
        if (/Firefox\//.test(ua)) return 'Firefox';
        if (/Safari\//.test(ua))  return 'Safari';
        return 'Other';
    }

    function getReferrer() {
        var ref = document.referrer;
        if (!ref) return 'direct';
        try { return new URL(ref).hostname; } catch (_) { return ref; }
    }

    // ── Supabase client ───────────────────────────────────────────────────────
    var client = window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY, {
        auth: { persistSession: false, autoRefreshToken: false },
    });

    // ── Event sender ──────────────────────────────────────────────────────────
    var visitorId = getVisitorId();
    var pageBase = {
        visitor_id: visitorId,
        page:       window.location.pathname,
        referrer:   getReferrer(),
        device:     getDevice(),
        browser:    getBrowser(),
    };

    function track(eventType, extras) {
        if (isLocalhost) return;
        var row = Object.assign({}, pageBase, { event_type: eventType }, extras || {});
        client.from(cfg.EVENT_TABLE).insert(row).then(function () {}, function () {});
    }

    // ── Once-per-session guard for "first time" events ────────────────────────
    var firedOnce = {};
    function trackOnce(eventType, extras) {
        if (firedOnce[eventType]) return;
        firedOnce[eventType] = true;
        track(eventType, extras);
    }

    // ── Page view / page exit (auto) ──────────────────────────────────────────
    var pageStart = Date.now();
    track('page_view');

    function trackExit() {
        if (firedOnce.page_exit) return;
        firedOnce.page_exit = true;
        var duration = Math.round((Date.now() - pageStart) / 1000);
        if (isLocalhost) return;
        // Use sendBeacon so the request survives the unload.
        try {
            var url = cfg.SUPABASE_URL + '/rest/v1/' + cfg.EVENT_TABLE;
            var body = JSON.stringify(Object.assign({}, pageBase, {
                event_type: 'page_exit',
                duration_seconds: duration,
            }));
            var blob = new Blob([body], { type: 'application/json' });
            // sendBeacon doesn't let us set custom headers; the Supabase REST API
            // requires apikey + Authorization, so beacon would 401. Fall through
            // to the regular client which uses fetch with keepalive.
            void url; void blob;
        } catch (_) { /* noop */ }
        client.from(cfg.EVENT_TABLE).insert(Object.assign({}, pageBase, {
            event_type: 'page_exit',
            duration_seconds: duration,
        })).then(function () {}, function () {});
    }
    window.addEventListener('pagehide', trackExit);
    window.addEventListener('beforeunload', trackExit);

    // ── Public API for index.html to call ─────────────────────────────────────
    window.CalcAnalytics = {
        track: track,
        trackOnce: trackOnce,
        scenarioSaved: function (name, inputs) {
            track('scenario_saved', { label: name, payload: inputs });
        },
        insightFocused: function (insightName) {
            // One row per insight per session — avoid spamming on every hover
            var key = 'insight_focused:' + insightName;
            if (firedOnce[key]) return;
            firedOnce[key] = true;
            track('insight_focused', { label: insightName });
        },
        mobileSheetOpened: function () {
            track('mobile_sheet_opened');
        },
        calculation: function () {
            track('calculation');
        },
        coastFiUsed: function (yearlySpend) {
            trackOnce('coast_fi_used', { payload: { yearly_spend: yearlySpend } });
        },
    };
})();
