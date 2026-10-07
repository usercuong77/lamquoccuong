// === Start Mode Selector + PvP Preload Config ===
        (function(){
            const STORAGE_KEY = 'tankStartMode_v1';
            const $ = (id)=>document.getElementById(id);
            function __getRuntime(){
                try { return (window && window.App && window.App.runtime) ? window.App.runtime : null; } catch(e){ return null; }
            }
            function __getConfig(){
                try { return (window && window.App && window.App.config) ? window.App.config : null; } catch(e){ return null; }
            }
            function __getPvpLoadoutStorageKey(){
                try {
                    const cfg = __getConfig();
                    if (cfg && cfg.pvpLoadoutStorageKey) return cfg.pvpLoadoutStorageKey;
                } catch(e){}
                try { if (typeof PVP_LOADOUT_STORAGE_KEY !== 'undefined') return PVP_LOADOUT_STORAGE_KEY; } catch(e){}
                return 'tankPvpLoadout_v1';
            }
            function __getPvpAmmoTypes(){
                try {
                    const cfg = __getConfig();
                    if (cfg && cfg.pvpAmmoTypes) return cfg.pvpAmmoTypes;
                } catch(e){}
                try { if (typeof PVP_AMMO_TYPES !== 'undefined') return PVP_AMMO_TYPES; } catch(e){}
                return {};
            }
            function __getPvpItemTypes(){
                try {
                    const cfg = __getConfig();
                    if (cfg && cfg.pvpItemTypes) return cfg.pvpItemTypes;
                } catch(e){}
                try { if (typeof PVP_ITEM_TYPES !== 'undefined') return PVP_ITEM_TYPES; } catch(e){}
                return {};
            }
            function __getPvpDefaultLoadout(){
                try {
                    const cfg = __getConfig();
                    if (cfg && cfg.pvpDefaultLoadout) return cfg.pvpDefaultLoadout;
                } catch(e){}
                try { if (typeof PVP_DEFAULT_LOADOUT !== 'undefined') return PVP_DEFAULT_LOADOUT; } catch(e){}
                return { p1:{ ammo:'ap40', items:[] }, p2:{ ammo:'jammer', items:[] } };
            }
            function __getPvpAmmoLocaleFn(){
                try {
                    const rt = __getRuntime();
                    if (rt && typeof rt.getPvpAmmoLocale === 'function') return rt.getPvpAmmoLocale;
                } catch(e){}
                try { if (typeof getPvpAmmoLocale === 'function') return getPvpAmmoLocale; } catch(e){}
                return function(ammoId){ return { id: ammoId, label: ammoId || 'unknown', desc: '', stats: [] }; };
            }
            function __getPvpItemLocaleFn(){
                try {
                    const rt = __getRuntime();
                    if (rt && typeof rt.getPvpItemLocale === 'function') return rt.getPvpItemLocale;
                } catch(e){}
                try { if (typeof getPvpItemLocale === 'function') return getPvpItemLocale; } catch(e){}
                return function(itemId){ return { id: itemId, label: itemId || 'unknown', desc: '', stats: [] }; };
            }
            function __sanitizePvpLoadouts(raw){
                try {
                    const rt = __getRuntime();
                    if (rt && typeof rt.sanitizePvpLoadouts === 'function') return rt.sanitizePvpLoadouts(raw);
                } catch(e){}
                try { if (typeof sanitizePvpLoadouts === 'function') return sanitizePvpLoadouts(raw); } catch(e){}
                const fb = __getPvpDefaultLoadout();
                return {
                    p1: {
                        ammo: (raw && raw.p1 && raw.p1.ammo) ? raw.p1.ammo : fb.p1.ammo,
                        items: (raw && raw.p1 && Array.isArray(raw.p1.items) && raw.p1.items.length) ? raw.p1.items.slice(0, 3) : (fb.p1.items || []).slice(0, 3)
                    },
                    p2: {
                        ammo: (raw && raw.p2 && raw.p2.ammo) ? raw.p2.ammo : fb.p2.ammo,
                        items: (raw && raw.p2 && Array.isArray(raw.p2.items) && raw.p2.items.length) ? raw.p2.items.slice(0, 3) : (fb.p2.items || []).slice(0, 3)
                    }
                };
            }
            function __notifyStartSaveUi(){
                try {
                    const rt = __getRuntime();
                    if (rt && typeof rt.updateStartSaveUI === 'function') { rt.updateStartSaveUI(); return; }
                } catch(e){}
                try { if (window.__updateStartSaveUI) window.__updateStartSaveUI(); } catch(e){}
            }

            function getRadioValue(name, fallback){
                const el = document.querySelector('input[name="'+name+'"]:checked');
                return el ? el.value : fallback;
            }
            function setRadioValue(name, value){
                const els = document.querySelectorAll('input[name="'+name+'"]');
                els && els.forEach(r=>{ r.checked = (r.value === value); });
            }

            function pvpSelectIds(){
                return {
                    p1Ammo: 'pvpP1Ammo', p2Ammo: 'pvpP2Ammo',
                    p1Items: ['pvpP1Item1','pvpP1Item2','pvpP1Item3'],
                    p2Items: ['pvpP2Item1','pvpP2Item2','pvpP2Item3']
                };
            }

            function fillSelect(el, list){
                if (!el) return;
                const prev = el.value;
                el.innerHTML = '';
                for (let i = 0; i < list.length; i++) {
                    const it = list[i];
                    const opt = document.createElement('option');
                    opt.value = it.id;
                    opt.textContent = it.label;
                    el.appendChild(opt);
                }
                if (prev && el.querySelector('option[value="' + prev + '"]')) el.value = prev;
            }

            function ensurePvpSelectOptions(){
                const ids = pvpSelectIds();
                const pvpAmmoTypes = __getPvpAmmoTypes();
                const pvpItemTypes = __getPvpItemTypes();
                const getAmmoLocale = __getPvpAmmoLocaleFn();
                const getItemLocale = __getPvpItemLocaleFn();
                const ammoList = Object.keys(pvpAmmoTypes || {}).map(k => {
                    const tx = getAmmoLocale(k);
                    return { id:k, label: tx.label || k };
                });
                const itemList = Object.keys(pvpItemTypes || {}).map(k => {
                    const tx = getItemLocale(k);
                    return { id:k, label: tx.label || k };
                });

                fillSelect($(ids.p1Ammo), ammoList);
                fillSelect($(ids.p2Ammo), ammoList);
                for (let i = 0; i < ids.p1Items.length; i++) fillSelect($(ids.p1Items[i]), itemList);
                for (let i = 0; i < ids.p2Items.length; i++) fillSelect($(ids.p2Items[i]), itemList);
            }

            function normalizeSideItems(side){
                const ids = pvpSelectIds();
                const itemIds = (side === 'p2') ? ids.p2Items : ids.p1Items;
                const pvpItemTypes = __getPvpItemTypes();
                const all = Object.keys(pvpItemTypes || {});
                const used = {};
                for (let i = 0; i < itemIds.length; i++) {
                    const el = $(itemIds[i]);
                    if (!el) continue;
                    let val = String(el.value || '');
                    if (!pvpItemTypes[val] || used[val]) {
                        val = '';
                        for (let j = 0; j < all.length; j++) {
                            const cand = all[j];
                            if (!used[cand]) { val = cand; break; }
                        }
                        if (val) el.value = val;
                    }
                    if (val) used[val] = true;
                }
            }

            function readPvpLoadoutUI(){
                const ids = pvpSelectIds();
                const readSelectValue = (id, fallback) => {
                    const el = $(id);
                    return (el && el.value) ? el.value : fallback;
                };
                const readItems = (itemIds) => itemIds.map(id => readSelectValue(id, '')).filter(Boolean);
                const raw = {
                    p1: {
                        ammo: readSelectValue(ids.p1Ammo, 'ap40'),
                        items: readItems(ids.p1Items)
                    },
                    p2: {
                        ammo: readSelectValue(ids.p2Ammo, 'jammer'),
                        items: readItems(ids.p2Items)
                    }
                };
                return __sanitizePvpLoadouts(raw);
            }

            function writePvpLoadoutUI(raw){
                ensurePvpSelectOptions();
                const ids = pvpSelectIds();
                const cfg = __sanitizePvpLoadouts(raw || __getPvpDefaultLoadout());
                if ($(ids.p1Ammo)) $(ids.p1Ammo).value = cfg.p1.ammo;
                if ($(ids.p2Ammo)) $(ids.p2Ammo).value = cfg.p2.ammo;
                for (let i = 0; i < ids.p1Items.length; i++) {
                    if ($(ids.p1Items[i])) $(ids.p1Items[i]).value = cfg.p1.items[i] || cfg.p1.items[0];
                }
                for (let i = 0; i < ids.p2Items.length; i++) {
                    if ($(ids.p2Items[i])) $(ids.p2Items[i]).value = cfg.p2.items[i] || cfg.p2.items[0];
                }
                normalizeSideItems('p1');
                normalizeSideItems('p2');
            }

            function readCfg(){
                const difficulty = getRadioValue('modeDifficulty','hard');
                const players = parseInt(getRadioValue('modePlayers','1'),10) || 1;
                const p2Mode = getRadioValue('mode2p','coop');
                const p2System = ($('p2SystemSelect') && $('p2SystemSelect').value) ? $('p2SystemSelect').value : 'default';
                const pvpLoadout = readPvpLoadoutUI();
                return { difficulty, players, p2Mode, p2System, pvpLoadout };
            }

            function refreshUI(){
                const tr = (k, vars) => {
                    try { return window.t ? window.t(k, vars) : k; } catch(e){ return k; }
                };
                const cfg = readCfg();
                const toggleHidden = (id, hidden) => {
                    const el = $(id);
                    if (el) el.classList.toggle('hidden', !!hidden);
                };
                const modeNoteKey = () => {
                    if (cfg.players === 1) return (cfg.difficulty === 'easy') ? 'mode.noteEasy' : 'mode.noteHard';
                    return (cfg.p2Mode === 'pvp') ? 'mode.notePvp' : 'mode.noteCoop';
                };
                toggleHidden('p2SystemRow', cfg.players !== 2);
                toggleHidden('difficultySeg', cfg.players !== 1);
                toggleHidden('p2ModeSeg', cfg.players === 1);
                const variantLabel = $('modeVariantLabel');
                if (variantLabel) variantLabel.textContent = tr(cfg.players === 1 ? 'start.modeDifficulty' : 'start.mode2p');
                toggleHidden('pvpLoadoutRow', true);
                toggleHidden('pvpLoadoutHint', true);
                const note = $('modeNote');
                if (note) note.textContent = tr(modeNoteKey());
            }

            function save(){
                try { localStorage.setItem(STORAGE_KEY, JSON.stringify(readCfg())); } catch(e){}
            }

            function load(){
                let cfg = null;
                try {
                    const raw = localStorage.getItem(STORAGE_KEY);
                    if (raw){
                        cfg = JSON.parse(raw);
                        if (cfg && typeof cfg === 'object'){
                            if (cfg.difficulty) setRadioValue('modeDifficulty', String(cfg.difficulty));
                            if (cfg.players) setRadioValue('modePlayers', String(cfg.players));
                            if (cfg.p2Mode) setRadioValue('mode2p', String(cfg.p2Mode));
                            const p2Sel = $('p2SystemSelect');
                            if (p2Sel && cfg.p2System) p2Sel.value = String(cfg.p2System);
                        }
                    }
                } catch(e){}

                ensurePvpSelectOptions();
                let rawPvp = null;
                try { const rp = localStorage.getItem(__getPvpLoadoutStorageKey()); if (rp) rawPvp = JSON.parse(rp); } catch(e){}
                if (!rawPvp && cfg && cfg.pvpLoadout) rawPvp = cfg.pvpLoadout;
                writePvpLoadoutUI(rawPvp || __getPvpDefaultLoadout());
                refreshUI();
            }

            // Hook listeners
            const radios = document.querySelectorAll('input[name="modeDifficulty"], input[name="modePlayers"], input[name="mode2p"]');
            radios && radios.forEach(r=>{
                r.addEventListener('change', ()=>{ refreshUI(); save(); __notifyStartSaveUi(); });
            });
            const p2Sel = $('p2SystemSelect');
            p2Sel && p2Sel.addEventListener('change', ()=>{ save(); __notifyStartSaveUi(); });

            const ids = pvpSelectIds();
            const allPvpSelects = [ids.p1Ammo, ids.p2Ammo].concat(ids.p1Items).concat(ids.p2Items);
            allPvpSelects.forEach((id)=>{
                const el = $(id);
                if (!el) return;
                el.addEventListener('change', ()=>{
                    normalizeSideItems('p1');
                    normalizeSideItems('p2');
                    save();
                });
            });

            load();
            window.addEventListener('tank:langchange', () => {
                ensurePvpSelectOptions();
                refreshUI();
            });

            // Expose for startGame to read
            window.__readPvpLoadoutUI = readPvpLoadoutUI;
            window.__writePvpLoadoutUI = writePvpLoadoutUI;
            window.__readStartModeCfg = readCfg;
            try {
                const __app = window.App || (window.App = {});
                __app.actions = __app.actions || {};
                __app.actions.readPvpLoadoutUI = readPvpLoadoutUI;
                __app.actions.writePvpLoadoutUI = writePvpLoadoutUI;
                __app.actions.readStartModeCfg = readCfg;
            } catch(e){}
        })();

// === Blessings modal + Meta Gold menu hooks ===
        (function(){
            const $ = (id) => document.getElementById(id);
            const NAME_KEYS = {
                hp: 'blessing.nodeHpName',
                armor: 'blessing.nodeArmorName',
                damage: 'blessing.nodeDamageName',
                fireRate: 'blessing.nodeFireRateName',
                goldGain: 'blessing.nodeGoldGainName',
                ultiGain: 'blessing.nodeUltiGainName'
            };
            const DESC_KEYS = {
                hp: 'blessing.nodeHpDesc',
                armor: 'blessing.nodeArmorDesc',
                damage: 'blessing.nodeDamageDesc',
                fireRate: 'blessing.nodeFireRateDesc',
                goldGain: 'blessing.nodeGoldGainDesc',
                ultiGain: 'blessing.nodeUltiGainDesc'
            };
            const BLESSING_ICONS = {
                hp: '❤',
                armor: '🛡',
                damage: '⚔',
                fireRate: '⚡',
                goldGain: '💰',
                ultiGain: '◎'
            };
            const INFO_SYSTEM_ORDER = ['default', 'speed', 'engineer', 'juggernaut', 'mage', 'assassin'];
            const INFO_SYSTEM_STATS = {
                default:    { hp: 100, spd: 6.5, armor: 0.00, cd: 1.00, size: 22 },
                speed:      { hp: 85,  spd: 8.2, armor: 0.00, cd: 0.85, size: 22 },
                engineer:   { hp: 120, spd: 6.0, armor: 0.05, cd: 1.00, size: 22 },
                juggernaut: { hp: 160, spd: 5.0, armor: 0.15, cd: 1.10, size: 24 },
                mage:       { hp: 70,  spd: 6.2, armor: 0.00, cd: 1.00, size: 19 },
                assassin:   { hp: 105, spd: 7.6, armor: 0.08, cd: 0.88, size: 21 }
            };
            const INFO_SYSTEM_PROFILE = {
                vi: {
                    default: {
                        role: 'Đa dụng / cân bằng',
                        difficulty: 'Dễ',
                        strengths: ['Ổn định ở mọi mode', 'Có tàng hình để đổi góc', 'R giúp hồi phục trong giao tranh dài'],
                        weaknesses: ['Burst thấp hơn Sát Thủ/Pháp Sư', 'Không có khống chế cứng diện rộng', 'Cần giữ uptime bắn để tối ưu hồi máu'],
                        tips: ['Ưu tiên đạn dễ trúng (Đuổi/Thường)', 'Bật R trước khi all-in để tối đa hồi máu']
                    },
                    speed: {
                        role: 'Cơ động / hit-and-run',
                        difficulty: 'Trung bình',
                        strengths: ['Q miễn sát thương + không rớt súng', 'E chặn damage và hồi ngược', 'R tăng mạnh nhịp bắn + sát thương'],
                        weaknesses: ['HP thấp, dễ vỡ khi hụt Q/E', 'Sai nhịp lao vào sẽ mất lợi thế', 'Phụ thuộc kỹ năng điều hướng'],
                        tips: ['Q để né burst, không dùng để mở bừa', 'Combo chuẩn: E giữ nhịp -> R tăng tốc -> Q kết liễu']
                    },
                    engineer: {
                        role: 'Kiểm soát / cấu rỉa',
                        difficulty: 'Trung bình',
                        strengths: ['Q giữ góc bắn rất tốt', 'E hồi máu theo % max HP', 'R xóa đạn + khống chế diện rộng'],
                        weaknesses: ['Thiếu cơ động so với Tốc Độ/Sát Thủ', 'Phụ thuộc vị trí đặt tháp', 'Kém hiệu quả khi bị ép giao tranh liên tục'],
                        tips: ['Đặt tháp lệch góc để tạo crossfire', 'Giữ R để ngắt nhịp dồn skill của đối thủ']
                    },
                    juggernaut: {
                        role: 'Tanker mở giao tranh',
                        difficulty: 'Trung bình',
                        strengths: ['Giáp nền cao + nhiều lớp giảm sát thương', 'Q phản đòn cực khó chịu', 'R chuyển Siege, áp lực tuyến trước rất mạnh'],
                        weaknesses: ['Chậm, dễ bị kite nếu hụt E', 'Kích thước lớn dễ ăn đạn', 'Cần chọn thời điểm bật R chính xác'],
                        tips: ['E dùng để ép góc hoặc cắt đường rút', 'Bật Q trước khi ôm sát để tận dụng phản đòn']
                    },
                    mage: {
                        role: 'Burst tầm xa / kiểm soát vùng',
                        difficulty: 'Khó',
                        strengths: ['Q nổ AOE rất mạnh', 'E dịch chuyển tạo góc liên tục', 'R bão tuyết vừa slow vừa tick damage'],
                        weaknesses: ['HP thấp nhất nhóm chính', 'Sai vị trí rất dễ bị bắt lẻ', 'Cần combo chuẩn để đạt trần sức mạnh'],
                        tips: ['Q mở góc -> R giữ vùng -> E giữ khoảng cách', 'PvP: tích ấn đủ rồi mới E để blink áp sát mục tiêu']
                    },
                    assassin: {
                        role: 'Dồn burst / kết liễu',
                        difficulty: 'Khó',
                        strengths: ['Chuỗi Q/E/R tạo burst cực cao', 'Có giảm sát thương khi đang thi triển', 'Có hồi máu từ skill + hồi chiêu khi hạ mục tiêu'],
                        weaknesses: ['Phụ thuộc mục tiêu và tầm skill', 'Nếu hụt chuỗi mở combat sẽ rất rủi ro', 'Khó chơi khi đối thủ giữ khoảng cách tốt'],
                        tips: ['Ưu tiên kết liễu mục tiêu thấp máu để kích hồi chiêu', 'Không mở R khi chưa chắc vào tầm chém']
                    }
                },
                en: {
                    default: {
                        role: 'All-round / balanced',
                        difficulty: 'Easy',
                        strengths: ['Stable in all modes', 'Stealth provides angle reset', 'R gives sustain in long trades'],
                        weaknesses: ['Lower burst than Assassin/Mage', 'No large hard-CC tool', 'Needs firing uptime to maximize healing'],
                        tips: ['Use high-consistency ammo (Homing/Normal)', 'Enable R before all-in for max sustain']
                    },
                    speed: {
                        role: 'Mobility / hit-and-run',
                        difficulty: 'Medium',
                        strengths: ['Q grants invulnerability + no weapon drop', 'E blocks damage and converts to heal', 'R spikes fire tempo and damage'],
                        weaknesses: ['Low HP, punishing if Q/E is mistimed', 'Bad engage timing loses momentum', 'Relies on movement execution'],
                        tips: ['Use Q defensively against burst', 'Core combo: E hold -> R tempo -> Q finish']
                    },
                    engineer: {
                        role: 'Control / attrition',
                        difficulty: 'Medium',
                        strengths: ['Q turret controls lanes well', 'E heals by % max HP', 'R clears bullets + wide control'],
                        weaknesses: ['Less mobile than Speed/Assassin', 'Turret value depends on placement', 'Can be overwhelmed by fast re-engages'],
                        tips: ['Place turret on offset angles for crossfire', 'Hold R to break enemy skill tempo']
                    },
                    juggernaut: {
                        role: 'Frontline tank engage',
                        difficulty: 'Medium',
                        strengths: ['High base armor + layered mitigation', 'Q reflect is highly punishing', 'R Siege creates heavy frontline pressure'],
                        weaknesses: ['Slow and vulnerable to kiting if E misses', 'Large hitbox takes more fire', 'R timing is critical'],
                        tips: ['Use E to cut retreat lines', 'Activate Q before close brawls to reflect damage']
                    },
                    mage: {
                        role: 'Long-range burst / zone control',
                        difficulty: 'Hard',
                        strengths: ['Q delivers strong AOE burst', 'E gives constant angle resets', 'R storm provides slow + sustained damage'],
                        weaknesses: ['Lowest effective HP among core systems', 'Very punishable on positioning errors', 'Needs clean combo execution'],
                        tips: ['Q open -> R control -> E reposition', 'In PvP, consume marks with E only at high-value timing']
                    },
                    assassin: {
                        role: 'Burst finisher',
                        difficulty: 'Hard',
                        strengths: ['Q/E/R chain enables very high burst', 'Gets mitigation during cast windows', 'Has skill leech + kill-based cooldown refund'],
                        weaknesses: ['Range and target dependency', 'Failed engage windows are risky', 'Can struggle versus disciplined spacing'],
                        tips: ['Prioritize low-HP executions for cooldown refund', 'Do not open R outside slash range']
                    }
                }
            };
            const INFO_SKILL_TEXT = {
                vi: {
                    default: {
                        Q: { name: 'Q - Phân Thân', desc: 'Tạo phân thân hỗ trợ bắn, phù hợp giữ nhịp DPS ổn định.' },
                        E: { name: 'E - Tàng Hình', desc: 'Ẩn thân ngắn để thoát focus hoặc đổi góc giao tranh.' },
                        R: { name: 'R - Hút Máu', desc: 'Hút máu theo sát thương gây ra, giúp trụ giao tranh dài.' }
                    },
                    speed: {
                        Q: { name: 'Q - Lướt', desc: 'Lướt tốc độ cao, miễn sát thương khi lướt và không rớt súng.' },
                        E: { name: 'E - Miễn Thương', desc: 'Miễn thương ngắn, nhận sát thương có thể chuyển thành hồi máu.' },
                        R: { name: 'R - Cường Tốc', desc: 'Tăng tốc độ + sát thương, đẩy nhịp dồn dame.' }
                    },
                    engineer: {
                        Q: { name: 'Q - Tháp Pháo', desc: 'Đặt tháp bắn hỗ trợ, kiểm soát góc và khóa đường tiến.' },
                        E: { name: 'E - Sửa Chữa', desc: 'Hồi máu tức thì theo % máu tối đa để kéo dài giao tranh.' },
                        R: { name: 'R - Xung EMP', desc: 'Xóa đạn diện rộng, khống chế nhịp tấn công đối thủ.' }
                    },
                    juggernaut: {
                        Q: { name: 'Q - Giáp Phản', desc: 'Giảm sát thương nhận và phản đòn, tốt khi mở combat trực diện.' },
                        E: { name: 'E - Cú Húc', desc: 'Lao tới gây va chạm mạnh, mở góc hoặc đẩy lùi mục tiêu.' },
                        R: { name: 'R - Pháo Đài', desc: 'Vào Siege Mode, tăng độ lì và áp lực theo thời gian.' }
                    },
                    mage: {
                        Q: { name: 'Q - Hỏa Cầu', desc: 'Đạn kỹ năng diện rộng, gây nổ và ép vị trí mục tiêu.' },
                        E: { name: 'E - Blink', desc: 'Dịch chuyển nhanh để đổi góc, vào/ra giao tranh linh hoạt.' },
                        R: { name: 'R - Bão Tuyết', desc: 'Vùng khống chế theo thời gian, gây chậm và dồn sát thương.' }
                    },
                    assassin: {
                        Q: { name: 'Q - Ám Kích', desc: 'Đột kích cự ly ngắn, chém nhanh để mở combo.' },
                        E: { name: 'E - Liên Hoàn', desc: 'Chuỗi chém nhiều mục tiêu gần, tạo áp lực lớn trong giao tranh nhỏ.' },
                        R: { name: 'R - Thập Ảnh', desc: 'Nhiều nhịp blink/chém liên tiếp, kết liễu mục tiêu máu thấp.' }
                    }
                },
                en: {
                    default: {
                        Q: { name: 'Q - Clone', desc: 'Spawns a support clone for stable sustained DPS.' },
                        E: { name: 'E - Stealth', desc: 'Short stealth window to disengage or rotate angle.' },
                        R: { name: 'R - Lifesteal', desc: 'Converts dealt damage into healing for extended trades.' }
                    },
                    speed: {
                        Q: { name: 'Q - Dash', desc: 'High-mobility dash, invulnerable during dash with no weapon drop.' },
                        E: { name: 'E - Phase', desc: 'Brief invulnerability, incoming damage can convert to healing.' },
                        R: { name: 'R - Adrenaline', desc: 'Boosts speed + damage for aggressive tempo play.' }
                    },
                    engineer: {
                        Q: { name: 'Q - Turret', desc: 'Deploys support turret for lane and angle control.' },
                        E: { name: 'E - Repair', desc: 'Instant % max-HP heal to stabilize long fights.' },
                        R: { name: 'R - EMP Pulse', desc: 'Wide bullet-clear pulse that disrupts enemy tempo.' }
                    },
                    juggernaut: {
                        Q: { name: 'Q - Reflect Armor', desc: 'Reduces incoming damage and reflects pressure in front-line fights.' },
                        E: { name: 'E - Ram', desc: 'Heavy engage tool for displacement and close-range pressure.' },
                        R: { name: 'R - Siege', desc: 'Siege mode for higher uptime and front-line threat.' }
                    },
                    mage: {
                        Q: { name: 'Q - Fireball', desc: 'AOE projectile with explosive zoning pressure.' },
                        E: { name: 'E - Blink', desc: 'Fast reposition tool for spacing and reset angles.' },
                        R: { name: 'R - Blizzard', desc: 'Persistent control zone with slow and sustained damage.' }
                    },
                    assassin: {
                        Q: { name: 'Q - Ambush', desc: 'Short-range engage slash to start burst sequences.' },
                        E: { name: 'E - Chain Slash', desc: 'Multi-target slash chain for compact skirmishes.' },
                        R: { name: 'R - Shadow Barrage', desc: 'Repeated blink/slash sequence for execute pressure.' }
                    }
                }
            };
            const INFO_AMMO_ORDER = ['NORMAL', 'FIRE', 'LIGHTNING', 'PIERCING', 'HOMING', 'STUN'];
            const INFO_AMMO_TEXT = {
                vi: {
                    NORMAL: { label: 'Thường', desc: 'Đạn cơ bản, cân bằng sát thương và độ ổn định.' },
                    FIRE: { label: 'Đạn Lửa', desc: 'Thiên về DPS theo thời gian, ép hồi máu và rút máu đều.' },
                    LIGHTNING: { label: 'Sấm Sét', desc: 'Chuỗi điện lan mục tiêu gần, mạnh khi quái đông hoặc giao tranh cụm.' },
                    PIERCING: { label: 'Xuyên', desc: 'Đạn tốc cao xuyên mục tiêu, phù hợp lối bắn tầm xa chính xác.' },
                    HOMING: { label: 'Đuổi', desc: 'Tự bẻ hướng theo mục tiêu, tăng tỷ lệ trúng mục tiêu di chuyển.' },
                    STUN: { label: 'Choáng', desc: 'Khống chế ngắn hạn, tạo cửa sổ dồn damage hoặc rút lui an toàn.' }
                },
                en: {
                    NORMAL: { label: 'Normal', desc: 'Baseline ammo with stable all-round performance.' },
                    FIRE: { label: 'Fire', desc: 'Damage-over-time pressure for sustained HP drain.' },
                    LIGHTNING: { label: 'Lightning', desc: 'Chain effect against grouped targets.' },
                    PIERCING: { label: 'Piercing', desc: 'High-speed pierce shots for precision long-range play.' },
                    HOMING: { label: 'Homing', desc: 'Tracks targets to improve hit consistency versus movement.' },
                    STUN: { label: 'Stun', desc: 'Brief control effect to create burst or disengage windows.' }
                }
            };
            const INFO_AMMO_SCALE_TEXT = {
                vi: {
                    NORMAL: 'Theo level: tăng damage, tăng tốc độ bắn; Lv cao có thêm bắn phụ.',
                    FIRE: 'Theo level: tăng damage đạn và sát thương đốt, đẩy DPS dài hạn.',
                    LIGHTNING: 'Theo level: tăng damage, số mục tiêu lan và tầm lan.',
                    PIERCING: 'Theo level: tăng damage và số lần xuyên mục tiêu.',
                    HOMING: 'Theo level: tăng damage và tốc độ bẻ lái khi truy đuổi.',
                    STUN: 'Theo level: tăng damage và thời gian choáng.'
                },
                en: {
                    NORMAL: 'Level scaling: higher damage and lower fire cooldown; high level adds extra shots.',
                    FIRE: 'Level scaling: higher base hit and burn-tick damage.',
                    LIGHTNING: 'Level scaling: more damage, chains, and chain range.',
                    PIERCING: 'Level scaling: more damage and pierce count.',
                    HOMING: 'Level scaling: more damage and stronger turn tracking.',
                    STUN: 'Level scaling: more damage and longer stun duration.'
                }
            };
            const INFO_PANE_DETAILS = {
                vi: {
                    modes: {
                        badges: ['1P Hard = aim tay', '1P Easy = auto aim', '2P Bot = co-op', '2P PvP = đấu đối kháng'],
                        cards: [
                            { title: '1P Hard', lines: ['Chuột ngắm + click bắn, yêu cầu kỹ năng aim cao.', 'Phù hợp luyện phản xạ và kiểm soát vị trí.'] },
                            { title: '1P Easy', lines: ['Auto-aim + auto-shoot, dễ làm quen cơ chế.', 'Aim-assist preset 55%.'] },
                            { title: '2P Bot', lines: ['Đi cùng P2 Bot, nhịp trận ổn định để leo wave.', 'Aim-assist preset 30% để tránh quá “auto”.'] },
                            { title: '2P PvP', lines: ['Chọn đạn + trang bị khắc chế trước round.', 'Skill damage đã có hệ số cân bằng riêng cho PvP.'] }
                        ],
                        hint: 'Mẹo: muốn thử build mới nhanh, test ở 1P Easy trước rồi chuyển Hard/PvP.'
                    },
                    pvp: {
                        badges: ['Mỗi bên: 1 đạn + 3 trang bị', 'Khắc chế theo hệ đối thủ', 'Không dùng Blessing meta'],
                        cards: [
                            { title: 'Luồng trận PvP', lines: ['Chọn loadout trước round.', 'Vào trận, đọc counter hint để chỉnh build.', 'Thắng round bằng hạ HP đối thủ và giữ vị trí bo tốt.'] },
                            { title: 'Tuning quan trọng', lines: ['Skill damage PvP có giảm toàn cục để tránh one-shot.', 'CC cứng có trần thời gian + giảm hiệu lực khi ăn liên tục.', 'Có global lockout ngắn để chống spam skill liên hoàn.'] },
                            { title: 'Nguyên tắc build', lines: ['Gặp tanker: ưu tiên xuyên giáp / giảm hồi.', 'Gặp triệu hồi: ưu tiên chống clone-tháp.', 'Gặp burst: ưu tiên giảm chấn burst + giáp tổng hợp.'] }
                        ],
                        hint: 'Mẹo: đừng build all-in damage; luôn giữ ít nhất 1 món thủ để sống qua nhịp burst đầu.'
                    },
                    boss: {
                        badges: ['3 phase', 'Weak point xoay', 'Mở giáp theo cửa sổ'],
                        cards: [
                            { title: 'Nhịp phase', lines: ['Boss đổi pattern theo % máu còn lại.', 'Phase sau sẽ nhanh hơn và dồn áp lực nhiều hơn.'] },
                            { title: 'Weak Point & Armor', lines: ['Bắn trúng weak point để mở giáp.', 'Khi mở giáp, sát thương vào boss tăng rõ rệt.'] },
                            { title: 'Chiến thuật an toàn', lines: ['Giữ kỹ năng thoát thân để né combo charge/radial.', 'Không đứng giữa map quá lâu khi bo thu nhỏ.'] }
                        ],
                        hint: 'Mẹo: canh burst vào đúng thời điểm boss mở giáp sẽ tiết kiệm rất nhiều thời gian.'
                    },
                    economy: {
                        badges: ['Gold trong trận', 'Meta Gold ngoài trận', 'Không trộn 2 loại tiền'],
                        cards: [
                            { title: 'Gold trong trận', lines: ['Dùng ở shop giữa wave: HP, Damage, Tốc độ bắn, Speed, Magnet, Armor.', 'Ảnh hưởng ngay trận hiện tại.'] },
                            { title: 'Meta Gold', lines: ['Dùng cho Blessing vĩnh viễn ngoài trận.', 'Áp dụng cho 1P và 2P Bot, không áp dụng PvP.'] },
                            { title: 'Ưu tiên nâng cấp', lines: ['Đầu trận: ưu tiên sống sót (HP/Armor).', 'Giữa trận: bổ sung Damage + Tốc độ bắn.', 'Cuối trận: vá điểm yếu theo hệ xe đang chơi.'] }
                        ],
                        hint: 'Mẹo: nâng lệch quá nhiều Damage mà thiếu thủ sẽ dễ vỡ nhịp ở wave cao.'
                    },
                    progress: {
                        badges: ['Best Score', 'Best Wave', 'Save có bảo vệ chữ ký'],
                        cards: [
                            { title: 'Lưu tiến trình', lines: ['Auto-save có thể bật/tắt trong Settings.', 'Save sai chữ ký sẽ bị bỏ qua để tránh lỗi runtime.'] },
                            { title: 'Mở khóa nội dung', lines: ['Sát Thủ mở khi qua wave 20 hoặc nhập code.', 'Mở khóa được lưu vĩnh viễn trong save hợp lệ.'] },
                            { title: 'Theo dõi hiệu năng', lines: ['Dùng Best Wave để đo độ ổn định build.', 'Dùng Best Score để so tốc độ clear + độ sạch trận.'] }
                        ],
                        hint: 'Mẹo: đổi build lớn thì nên chụp mốc Best Wave trước để so sánh khách quan.'
                    },
                    controls: {
                        badges: ['WASD di chuyển', 'Q/E/R hoặc J/K/L dùng skill', 'Esc mở settings'],
                        cards: [
                            { title: 'Điều khiển cơ bản', lines: ['WASD: di chuyển.', 'P: tạm dừng.', 'Esc: mở settings.'] },
                            { title: 'Theo mode', lines: ['Hard: chuột ngắm + bắn.', 'Easy/2P Bot: tự ngắm, tập trung di chuyển và dùng skill.'] },
                            { title: 'Khi chơi PvP', lines: ['Xem counter hint trước round.', 'Ưu tiên kỹ năng né burst ở nhịp mở giao tranh.'] }
                        ],
                        hint: 'Mẹo: khi thấy hụt aim, giảm nhịp bắn và ưu tiên giữ vị trí trước.'
                    }
                },
                en: {
                    modes: {
                        badges: ['1P Hard = manual aim', '1P Easy = auto-aim', '2P Bot = co-op', '2P PvP = duel'],
                        cards: [
                            { title: '1P Hard', lines: ['Mouse aim + click shoot with high execution demand.', 'Best for raw aim and positioning practice.'] },
                            { title: '1P Easy', lines: ['Auto-aim + auto-shoot for onboarding.', 'Aim-assist preset: 55%.'] },
                            { title: '2P Bot', lines: ['Co-op with P2 bot for stable wave climbing.', 'Aim-assist preset: 30%.'] },
                            { title: '2P PvP', lines: ['Pick ammo + counter-items before each round.', 'PvP uses dedicated skill-balance multipliers.'] }
                        ],
                        hint: 'Tip: test new builds in 1P Easy first, then move to Hard/PvP.'
                    },
                    pvp: {
                        badges: ['Each side: 1 ammo + 3 items', 'Counter-build around enemy system', 'No meta Blessing bonus'],
                        cards: [
                            { title: 'Round Flow', lines: ['Choose loadout before entering round.', 'Read counter hints and adjust build.', 'Win by HP advantage and better zone control.'] },
                            { title: 'Key Tuning', lines: ['Global PvP skill-damage reduction prevents one-shot chains.', 'Hard CC has cap + DR behavior on repeated hits.', 'Short global lockout prevents abusive skill spam.'] },
                            { title: 'Build Rule', lines: ['Vs tanks: prefer armor-break/cooldown disruption.', 'Vs summon comps: prioritize anti-clone/turret.', 'Vs burst comps: include at least one defensive item.'] }
                        ],
                        hint: 'Tip: avoid full glass-cannon loadouts; one defensive slot is usually worth it.'
                    },
                    boss: {
                        badges: ['3 phases', 'Rotating weak point', 'Armor-open windows'],
                        cards: [
                            { title: 'Phase Rhythm', lines: ['Boss behavior changes by HP thresholds.', 'Later phases increase pressure and tempo.'] },
                            { title: 'Weak Point & Armor', lines: ['Hit weak point to force armor-open windows.', 'Armor-open state significantly increases boss damage taken.'] },
                            { title: 'Safe Pattern', lines: ['Hold one escape skill for charge/radial patterns.', 'Do not overstay center during zone pressure.'] }
                        ],
                        hint: 'Tip: save burst cooldowns for armor-open windows for faster clears.'
                    },
                    economy: {
                        badges: ['Match Gold', 'Meta Gold', 'Separated currencies'],
                        cards: [
                            { title: 'Match Gold', lines: ['Spend between waves on HP, Damage, Fire Rate, Speed, Magnet, Armor.', 'Only affects current run.'] },
                            { title: 'Meta Gold', lines: ['Spend outside matches on permanent Blessings.', 'Applies to 1P and 2P Bot; not PvP.'] },
                            { title: 'Upgrade Priority', lines: ['Early: survivability first (HP/Armor).', 'Mid: add Damage + Fire Rate.', 'Late: patch your system-specific weakness.'] }
                        ],
                        hint: 'Tip: over-investing damage without defense often collapses at high waves.'
                    },
                    progress: {
                        badges: ['Best Score', 'Best Wave', 'Signed save integrity'],
                        cards: [
                            { title: 'Save Flow', lines: ['Auto-save is configurable in Settings.', 'Tampered save signatures are ignored for runtime safety.'] },
                            { title: 'Unlocks', lines: ['Assassin unlocks by clearing wave 20 or via code.', 'Unlock state is persisted permanently in valid save data.'] },
                            { title: 'Tracking', lines: ['Use Best Wave for consistency checks.', 'Use Best Score to compare clear speed and efficiency.'] }
                        ],
                        hint: 'Tip: snapshot Best Wave before major balance changes for clean comparison.'
                    },
                    controls: {
                        badges: ['WASD movement', 'Q/E/R or J/K/L skills', 'Esc opens settings'],
                        cards: [
                            { title: 'Core Inputs', lines: ['WASD: movement.', 'P: pause.', 'Esc: settings.'] },
                            { title: 'Mode Inputs', lines: ['Hard: mouse aim + shoot.', 'Easy/2P Bot: auto-aim focus with movement + skill timing.'] },
                            { title: 'PvP Inputs', lines: ['Review counter hints before round start.', 'Preserve anti-burst skills during opening trade.'] }
                        ],
                        hint: 'Tip: if accuracy drops, reduce panic-firing and prioritize spacing.'
                    }
                }
            };

            function tr(key, vars){
                try { return window.t ? window.t(key, vars) : key; } catch(e){ return key; }
            }
            function game(){
                try { return window.Game || (window.App && window.App.state && window.App.state.game) || null; } catch(e){ return null; }
            }
            function bonusText(id, bonus){
                const p = Math.round(Math.abs(Number(bonus) || 0) * 1000) / 10;
                if (id === 'fireRate') {
                    const lang = (window.I18N && typeof window.I18N.lang === 'function') ? window.I18N.lang() : 'vi';
                    return (lang === 'en') ? ('+' + p + '% fire rate') : ('+' + p + '% tốc độ bắn');
                }
                return '+' + p + '%';
            }
            function updateQuickMetaLabel(gold){
                const wrap = $('metaGoldQuickWrap');
                const val = $('metaGoldQuick');
                if (val) val.textContent = String(Math.max(0, Math.floor(Number(gold) || 0)));
                if (wrap && val) {
                    const label = tr('start.metaGoldLabel') + ': ';
                    if (wrap.firstChild && wrap.firstChild.nodeType === 3) wrap.firstChild.nodeValue = label;
                    else wrap.insertBefore(document.createTextNode(label), val);
                }
            }
            function setActionMsg(msg){
                const el = $('blessingActionMsg');
                if (!el) return;
                el.textContent = String(msg || '');
            }
            const SKIN_RARITY_KEYS = {
                base: 'blessing.skinRarityBase',
                rare: 'blessing.skinRarityRare',
                epic: 'blessing.skinRarityEpic'
            };
            let activeSkinSystemId = 'default';
            const activeSkinCardBySystem = {};
            let activeShopSection = 'blessing';
            const skinPreviewAnim = {
                running: false,
                rafId: 0,
                lastTs: 0,
                canvas: null,
                systemId: 'default',
                style: null,
                isEquipped: false,
                zoom: 1.5
            };

            function isElementVisible(el){
                if (!el) return false;
                try {
                    const cs = window.getComputedStyle(el);
                    if (!cs || cs.display === 'none' || cs.visibility === 'hidden') return false;
                } catch(e){}
                return el.getClientRects().length > 0;
            }
            function stopSkinPreviewAnimation(){
                skinPreviewAnim.running = false;
                skinPreviewAnim.lastTs = 0;
                if (skinPreviewAnim.rafId) {
                    try { cancelAnimationFrame(skinPreviewAnim.rafId); } catch(e){}
                    skinPreviewAnim.rafId = 0;
                }
            }
            function tickSkinPreviewAnimation(ts){
                if (!skinPreviewAnim.running) return;
                const viewSkin = $('shopSectionSkinView');
                const canvas = skinPreviewAnim.canvas;
                const skinTabActive = !!(viewSkin && viewSkin.classList && viewSkin.classList.contains('active'));
                if (!canvas || !canvas.isConnected || !skinTabActive) {
                    stopSkinPreviewAnimation();
                    return;
                }
                if (!skinPreviewAnim.lastTs || (ts - skinPreviewAnim.lastTs) >= 33) {
                    skinPreviewAnim.lastTs = ts || 0;
                    drawSkinPreview(
                        canvas,
                        skinPreviewAnim.systemId,
                        skinPreviewAnim.style,
                        !!skinPreviewAnim.isEquipped,
                        { zoom: skinPreviewAnim.zoom }
                    );
                }
                skinPreviewAnim.rafId = requestAnimationFrame(tickSkinPreviewAnimation);
            }
            function startSkinPreviewAnimation(){
                if (skinPreviewAnim.running) return;
                skinPreviewAnim.running = true;
                skinPreviewAnim.lastTs = 0;
                skinPreviewAnim.rafId = requestAnimationFrame(tickSkinPreviewAnimation);
            }
            function setSkinPreviewTarget(canvas, systemId, style, isEquipped, zoom){
                skinPreviewAnim.canvas = canvas || null;
                skinPreviewAnim.systemId = String(systemId || 'default');
                skinPreviewAnim.style = (style && typeof style === 'object') ? style : null;
                skinPreviewAnim.isEquipped = !!isEquipped;
                skinPreviewAnim.zoom = (typeof zoom === 'number' && isFinite(zoom)) ? zoom : 1.5;
            }

            function skinTextPack(obj, lang, fallback) {
                const source = (obj && typeof obj === 'object') ? obj : null;
                if (!source) return String(fallback || '');
                if (typeof source[lang] === 'string' && source[lang]) return source[lang];
                if (typeof source.vi === 'string' && source.vi) return source.vi;
                if (typeof source.en === 'string' && source.en) return source.en;
                return String(fallback || '');
            }
            function getSystemDisplayName(systemId){
                const sid = String(systemId || 'default');
                try {
                    if (window.I18N && typeof window.I18N.systemText === 'function') {
                        const tx = window.I18N.systemText(sid);
                        if (tx && tx.name) return tx.name;
                    }
                } catch(e){}
                return sid;
            }
            function getSkinRarityLabel(rarity){
                const key = SKIN_RARITY_KEYS[String(rarity || 'base').toLowerCase()] || SKIN_RARITY_KEYS.base;
                return tr(key);
            }
            function getSkinSwatchStyle(style){
                const s = (style && typeof style === 'object') ? style : {};
                const c1 = s.bodyFill || s.assBodyA || '#263548';
                const c2 = s.turretCore || s.assBodyC || '#5a7ba6';
                const edge = s.ringStroke || s.assAuraStroke || 'rgba(255,255,255,0.35)';
                return {
                    background: 'linear-gradient(135deg,' + c1 + ' 0%,' + c2 + ' 100%)',
                    border: edge
                };
            }
            function applyShopSectionState(section){
                const next = (String(section || '').toLowerCase() === 'skin') ? 'skin' : 'blessing';
                activeShopSection = next;
                const tabBless = $('shopSectionTabBlessing');
                const tabSkin = $('shopSectionTabSkin');
                const viewBless = $('shopSectionBlessingView');
                const viewSkin = $('shopSectionSkinView');
                const resetBtn = $('btnBlessingReset');

                if (tabBless) tabBless.classList.toggle('active', next === 'blessing');
                if (tabSkin) tabSkin.classList.toggle('active', next === 'skin');
                if (viewBless) viewBless.classList.toggle('active', next === 'blessing');
                if (viewSkin) viewSkin.classList.toggle('active', next === 'skin');
                if (resetBtn) resetBtn.classList.toggle('hidden', next !== 'blessing');
                if (next === 'skin') {
                    setTimeout(() => { try { renderSkinShop(activeSkinSystemId); } catch(e) {} }, 0);
                } else {
                    stopSkinPreviewAnimation();
                }
            }
            function bindShopSectionTabs(){
                const wrap = $('shopSectionTabs');
                if (!wrap || wrap.__tabsBound) return;
                wrap.__tabsBound = true;
                const tabs = Array.from(wrap.querySelectorAll('.shopSectionTab[data-shop-section]'));
                for (let i = 0; i < tabs.length; i++) {
                    const tab = tabs[i];
                    tab.addEventListener('click', () => {
                        applyShopSectionState(tab.getAttribute('data-shop-section'));
                    });
                }
            }
            function renderShopSectionTabs(){
                const tabBless = $('shopSectionTabBlessing');
                const tabSkin = $('shopSectionTabSkin');
                if (tabBless) tabBless.textContent = tr('blessing.shopTabBlessings');
                if (tabSkin) tabSkin.textContent = tr('blessing.shopTabSkins');
                bindShopSectionTabs();
                applyShopSectionState(activeShopSection);
            }
            function fitCanvasToClient(canvas){
                if (!canvas) return;
                const cw = Number(canvas.clientWidth || 0);
                const ch = Number(canvas.clientHeight || 0);
                if (cw < 20 || ch < 20) return;
                const w = Math.max(2, Math.round(cw * (window.devicePixelRatio || 1)));
                const h = Math.max(2, Math.round(ch * (window.devicePixelRatio || 1)));
                if (canvas.width !== w) canvas.width = w;
                if (canvas.height !== h) canvas.height = h;
            }
            function getTankPreviewRenderer(){
                try {
                    const rt = (window.App && window.App.runtime) ? window.App.runtime : null;
                    if (rt && typeof rt.renderTankPreview === 'function') return rt.renderTankPreview;
                } catch(e){}
                return null;
            }
            function drawPreviewPlaceholder(canvas){
                if (!canvas) return;
                if (canvas.isConnected) fitCanvasToClient(canvas);
                else {
                    if (!canvas.width) canvas.width = 320;
                    if (!canvas.height) canvas.height = 160;
                }
                const ctx = canvas.getContext('2d');
                if (!ctx) return;
                const w = canvas.width;
                const h = canvas.height;
                ctx.clearRect(0, 0, w, h);
                const bg = ctx.createLinearGradient(0, 0, 0, h);
                bg.addColorStop(0, 'rgba(14,20,36,0.95)');
                bg.addColorStop(1, 'rgba(6,10,18,0.98)');
                ctx.fillStyle = bg;
                ctx.fillRect(0, 0, w, h);
            }
            function drawSkinPreview(canvas, systemId, style, isEquipped, opts){
                if (!canvas) return;
                const renderPreview = getTankPreviewRenderer();
                if (!renderPreview) {
                    drawPreviewPlaceholder(canvas);
                    return;
                }
                const ok = renderPreview(canvas, systemId, {
                    fit: true,
                    time: (Date.now() % 100000) / 1000,
                    scale: (opts && typeof opts.zoom === 'number') ? opts.zoom : 1,
                    skinStyle: style || null
                });
                if (!ok) {
                    drawPreviewPlaceholder(canvas);
                    return;
                }
                if (!isEquipped) return;
                const ctx = canvas.getContext('2d');
                if (!ctx) return;
                const w = canvas.width;
                const h = canvas.height;
                const dpr = window.devicePixelRatio || 1;
                const fontPx = Math.max(12, Math.round(12 * dpr));
                ctx.save();
                ctx.fillStyle = 'rgba(255,214,90,0.96)';
                ctx.font = `${fontPx}px Arial`;
                ctx.textAlign = 'right';
                ctx.textBaseline = 'top';
                ctx.fillText(tr('blessing.skinEquipped'), w - (10 * dpr), 10 * dpr);
                ctx.restore();
            }
            const skinImageCache = {};
            function clearSkinImageCache(){
                const keys = Object.keys(skinImageCache);
                for (let i = 0; i < keys.length; i++) delete skinImageCache[keys[i]];
            }
            function styleToCacheKey(style){
                try {
                    const s = (style && typeof style === 'object') ? style : {};
                    return Object.keys(s).sort().map((k) => k + ':' + String(s[k])).join('|');
                } catch(e) {
                    return '';
                }
            }
            function getSkinImageDataUrl(systemId, style){
                const sid = String(systemId || 'default');
                const key = sid + '|' + styleToCacheKey(style);
                if (skinImageCache[key]) return skinImageCache[key];
                const renderPreview = getTankPreviewRenderer();
                if (!renderPreview) return '';
                try {
                    const c = document.createElement('canvas');
                    c.width = 640;
                    c.height = 360;
                    renderPreview(c, sid, { fit: false, time: 0, scale: 1.5, skinStyle: style || null });
                    const url = c.toDataURL('image/png');
                    skinImageCache[key] = url;
                    return url;
                } catch(e) {
                    return '';
                }
            }
            function renderSkinShop(forceSystemId){
                const g = game();
                const titleEl = $('skinShopTitle');
                const ownedEl = $('skinShopOwned');
                const tabsWrap = $('skinSystemTabs');
                const cardsWrap = $('skinCards');
                const imageLabelEl = $('skinImageLabel');
                const previewLabelEl = $('skinPreviewLabel');
                const showcaseImg = $('skinShowcaseImage');
                const showcaseCanvas = $('skinShowcasePreview');
                const showcaseName = $('skinShowcaseName');
                const showcaseDesc = $('skinShowcaseDesc');
                const showcaseMeta = $('skinShowcaseMeta');
                const showcaseAction = $('skinShowcaseAction');
                if (!g || typeof g.getSkinShopSnapshot !== 'function' || typeof g.getSkinCatalog !== 'function') return;
                if (!tabsWrap || !cardsWrap || !showcaseImg || !showcaseCanvas || !showcaseName || !showcaseDesc || !showcaseMeta || !showcaseAction) return;

                const lang = (window.I18N && typeof window.I18N.lang === 'function') ? window.I18N.lang() : 'vi';
                const catalog = g.getSkinCatalog();
                const systems = Array.isArray(catalog.order) && catalog.order.length ? catalog.order.slice() : ['default'];
                const requestedSystem = String(forceSystemId || '');
                if (requestedSystem && systems.indexOf(requestedSystem) >= 0) activeSkinSystemId = requestedSystem;
                if (systems.indexOf(activeSkinSystemId) < 0) {
                    const preferred = String(g.selectedSystemId || '');
                    activeSkinSystemId = (systems.indexOf(preferred) >= 0) ? preferred : (systems[0] || 'default');
                }

                const snap = g.getSkinShopSnapshot(activeSkinSystemId);
                activeSkinSystemId = String((snap && snap.activeSystem) || activeSkinSystemId || systems[0] || 'default');

                let ownedCount = 0;
                const totalSkins = Array.isArray(catalog.all) ? catalog.all.length : 0;
                try {
                    const meta = (typeof g.ensureMetaProgress === 'function') ? g.ensureMetaProgress() : null;
                    const ownMap = (meta && meta.ownedSkins && typeof meta.ownedSkins === 'object') ? meta.ownedSkins : {};
                    const all = Array.isArray(catalog.all) ? catalog.all : [];
                    for (let i = 0; i < all.length; i++) {
                        const item = all[i];
                        if (item && ownMap[item.id]) ownedCount++;
                    }
                } catch(e){}

                if (titleEl) titleEl.textContent = tr('blessing.skinsTitle');
                if (ownedEl) ownedEl.textContent = tr('blessing.skinsOwned', { owned: ownedCount, total: totalSkins });
                if (imageLabelEl) imageLabelEl.textContent = tr('blessing.skinImageLabel');
                if (previewLabelEl) previewLabelEl.textContent = tr('blessing.skinPreviewLabel');

                tabsWrap.innerHTML = '';
                for (let i = 0; i < systems.length; i++) {
                    const sid = systems[i];
                    const tab = document.createElement('button');
                    tab.type = 'button';
                    tab.className = 'skinSystemTab' + (sid === activeSkinSystemId ? ' active' : '');
                    tab.textContent = getSystemDisplayName(sid);
                    tab.addEventListener('click', () => {
                        activeSkinSystemId = sid;
                        renderSkinShop(sid);
                    });
                    tabsWrap.appendChild(tab);
                }

                const cards = (snap && Array.isArray(snap.cards)) ? snap.cards : [];
                let activeCardId = String(activeSkinCardBySystem[activeSkinSystemId] || '');
                let activeCard = cards.find((c) => c && c.id === activeCardId) || null;
                if (!activeCard) activeCard = cards.find((c) => c && c.equipped) || cards[0] || null;
                if (activeCard && activeCard.id) {
                    activeSkinCardBySystem[activeSkinSystemId] = activeCard.id;
                }

                cardsWrap.innerHTML = '';
                for (let i = 0; i < cards.length; i++) {
                    const card = cards[i];
                    if (!card || !card.id) continue;
                    const entry = (catalog.byId && catalog.byId[card.id]) ? catalog.byId[card.id] : null;
                    const cardName = skinTextPack(card.name, lang, card.id);
                    const cardDesc = skinTextPack(card.desc, lang, '');
                    const price = Math.max(0, Math.floor(Number(card.price) || 0));
                    const isSelected = !!(activeCard && activeCard.id === card.id);
                    const cardBox = document.createElement('div');
                    cardBox.className = 'skinCard rarity-' + String(card.rarity || 'base').toLowerCase();
                    if (card.owned) cardBox.classList.add('owned');
                    if (card.equipped) cardBox.classList.add('equipped');
                    if (isSelected) cardBox.classList.add('selected');

                    const sw = document.createElement('div');
                    sw.className = 'skinSwatch';
                    const swatch = getSkinSwatchStyle(entry && entry.style);
                    sw.style.background = swatch.background;
                    sw.style.borderColor = swatch.border;

                    const main = document.createElement('div');
                    main.className = 'skinCardMain';
                    const name = document.createElement('div');
                    name.className = 'skinCardName';
                    name.textContent = cardName;
                    const meta = document.createElement('div');
                    meta.className = 'skinCardMeta';
                    const rarity = document.createElement('span');
                    rarity.className = 'skinRarity';
                    rarity.textContent = getSkinRarityLabel(card.rarity);
                    const shortDesc = document.createElement('span');
                    shortDesc.textContent = cardDesc.length > 52 ? (cardDesc.slice(0, 52) + '...') : cardDesc;
                    meta.appendChild(rarity);
                    meta.appendChild(shortDesc);
                    main.appendChild(name);
                    main.appendChild(meta);

                    const right = document.createElement('div');
                    right.className = 'skinCardRight';
                    const priceEl = document.createElement('span');
                    priceEl.className = 'skinPrice';
                    priceEl.textContent = (price <= 0) ? tr('blessing.skinFree') : tr('blessing.skinCost', { cost: price });
                    const st = document.createElement('span');
                    st.className = 'skinStatusOwned';
                    st.textContent = isSelected
                        ? ((lang === 'en') ? 'Selected' : 'Đang chọn')
                        : (card.equipped
                            ? tr('blessing.skinEquipped')
                            : (card.owned ? tr('blessing.skinEquip') : tr('blessing.skinBuy')));
                    right.appendChild(priceEl);
                    right.appendChild(st);

                    cardBox.appendChild(sw);
                    cardBox.appendChild(main);
                    cardBox.appendChild(right);
                    cardBox.addEventListener('click', () => {
                        activeSkinCardBySystem[activeSkinSystemId] = card.id;
                        renderSkinShop(activeSkinSystemId);
                    });
                    cardsWrap.appendChild(cardBox);
                }

                if (!activeCard) {
                    showcaseImg.removeAttribute('src');
                    setSkinPreviewTarget(null, 'default', null, false, 1.5);
                    stopSkinPreviewAnimation();
                    showcaseName.textContent = '-';
                    showcaseDesc.textContent = '';
                    showcaseMeta.textContent = '';
                    showcaseAction.innerHTML = '';
                    return;
                }

                const activeEntry = (catalog.byId && catalog.byId[activeCard.id]) ? catalog.byId[activeCard.id] : null;
                const activeName = skinTextPack(activeCard.name, lang, activeCard.id);
                const activeDesc = skinTextPack(activeCard.desc, lang, '');
                const activePrice = Math.max(0, Math.floor(Number(activeCard.price) || 0));

                showcaseImg.alt = activeName;
                showcaseImg.loading = 'eager';
                showcaseImg.decoding = 'async';
                const imageUrl = getSkinImageDataUrl(activeCard.systemId, activeEntry && activeEntry.style);
                if (imageUrl) showcaseImg.src = imageUrl;
                else showcaseImg.removeAttribute('src');
                setSkinPreviewTarget(showcaseCanvas, activeCard.systemId, activeEntry && activeEntry.style, !!activeCard.equipped, 1.5);
                drawSkinPreview(showcaseCanvas, activeCard.systemId, activeEntry && activeEntry.style, !!activeCard.equipped, { zoom: 1.5 });
                startSkinPreviewAnimation();
                showcaseName.textContent = activeName;
                showcaseDesc.textContent = activeDesc;
                showcaseMeta.textContent = getSkinRarityLabel(activeCard.rarity) + ' • ' + ((activePrice <= 0) ? tr('blessing.skinFree') : tr('blessing.skinCost', { cost: activePrice }));

                showcaseAction.innerHTML = '';
                if (activeCard.equipped) {
                    const equipped = document.createElement('span');
                    equipped.className = 'skinStatusOwned';
                    equipped.textContent = tr('blessing.skinEquipped');
                    showcaseAction.appendChild(equipped);
                } else if (activeCard.owned) {
                    const equipBtn = document.createElement('button');
                    equipBtn.type = 'button';
                    equipBtn.className = 'btn btn-gold';
                    equipBtn.textContent = tr('blessing.skinEquip');
                    equipBtn.addEventListener('click', () => {
                        const res = (typeof g.equipSkin === 'function')
                            ? g.equipSkin(activeCard.systemId, activeCard.id)
                            : { ok: false };
                        if (!res || !res.ok) return;
                        setActionMsg(tr('blessing.skinEquipSuccess', { name: activeName }));
                        renderBlessingNodes();
                    });
                    showcaseAction.appendChild(equipBtn);
                } else {
                    const buyBtn = document.createElement('button');
                    buyBtn.type = 'button';
                    buyBtn.className = 'btn';
                    buyBtn.textContent = tr('blessing.skinBuy');
                    buyBtn.disabled = ((snap && snap.gold) || 0) < activePrice;
                    buyBtn.addEventListener('click', () => {
                        const res = (typeof g.buySkin === 'function')
                            ? g.buySkin(activeCard.id)
                            : { ok: false };
                        if (!res || !res.ok) {
                            setActionMsg((res && res.reason === 'notEnough')
                                ? tr('blessing.skinNotEnough')
                                : '');
                            renderBlessingNodes();
                            return;
                        }
                        setActionMsg(tr('blessing.skinBuySuccess', { name: activeName }));
                        renderBlessingNodes();
                    });
                    showcaseAction.appendChild(buyBtn);
                }
            }
            function renderBlessingNodes(){
                const g = game();
                const container = $('blessingNodes');
                if (!g || !container || typeof g.getBlessingSnapshot !== 'function') return;
                renderShopSectionTabs();

                const snap = g.getBlessingSnapshot();
                const order = Array.isArray(snap.order) ? snap.order : [];
                container.innerHTML = '';

                for (let i = 0; i < order.length; i++) {
                    const id = order[i];
                    const node = snap.nodes && snap.nodes[id];
                    if (!node) continue;

                    const card = document.createElement('div');
                    card.className = 'blessingNode';

                    const head = document.createElement('div');
                    head.className = 'blessingNodeHead';

                    const icon = document.createElement('div');
                    icon.className = 'blessingNodeIcon blessingIcon-' + id;
                    icon.textContent = BLESSING_ICONS[id] || '⬢';
                    icon.setAttribute('aria-hidden', 'true');

                    const title = document.createElement('div');
                    title.className = 'blessingNodeTitle';
                    title.textContent = tr(NAME_KEYS[id] || id);
                    head.appendChild(icon);
                    head.appendChild(title);

                    const desc = document.createElement('div');
                    desc.className = 'blessingNodeDesc';
                    desc.textContent = tr(DESC_KEYS[id] || '', { value: Math.round((Number(node.perLevel) || 0) * 100) });

                    const meta = document.createElement('div');
                    meta.className = 'blessingNodeMeta';
                    meta.textContent = tr('blessing.level', { level: node.level, max: node.maxLevel });

                    const owned = document.createElement('div');
                    owned.className = 'blessingNodeMeta';
                    owned.textContent = tr('blessing.ownedBonus', { value: bonusText(id, node.currentBonus) });

                    const actions = document.createElement('div');
                    actions.className = 'blessingNodeActions';

                    const cost = document.createElement('div');
                    cost.className = 'blessingCost';
                    cost.textContent = node.isMax
                        ? tr('blessing.costMax')
                        : tr('blessing.cost', { cost: node.nextCost });

                    const buyBtn = document.createElement('button');
                    buyBtn.type = 'button';
                    buyBtn.className = 'btn';
                    buyBtn.textContent = node.isMax ? tr('blessing.maxed') : tr('blessing.buy');
                    buyBtn.disabled = !!node.isMax || snap.gold < (node.nextCost || 0);
                    buyBtn.addEventListener('click', () => {
                        const res = (typeof g.buyBlessing === 'function') ? g.buyBlessing(id) : { ok: false, reason: 'invalid' };
                        if (!res || !res.ok) {
                            setActionMsg(res && res.reason === 'notEnough' ? tr('blessing.notEnough') : '');
                            renderBlessingNodes();
                            return;
                        }
                        setActionMsg(tr('blessing.buySuccess', { name: tr(NAME_KEYS[id] || id), level: res.level }));
                        renderBlessingNodes();
                    });

                    actions.appendChild(cost);
                    actions.appendChild(buyBtn);

                    card.appendChild(head);
                    card.appendChild(desc);
                    card.appendChild(meta);
                    card.appendChild(owned);
                    card.appendChild(actions);
                    container.appendChild(card);
                }

                const goldVal = $('blessingMetaGoldValue');
                if (goldVal) goldVal.textContent = String(Math.max(0, Math.floor(Number(snap.gold) || 0)));
                const goldLabel = $('blessingMetaGoldLabel');
                if (goldLabel) goldLabel.textContent = tr('blessing.metaGold');
                updateQuickMetaLabel(snap.gold);
                renderSkinShop(activeSkinSystemId);
            }
            function openBlessingModal(){
                const m = $('blessingModal');
                const panel = $('blessingPanel');
                if (!m) return;
                try {
                    if (panel && panel.parentElement !== m) m.appendChild(panel);
                    if (panel) panel.classList.remove('blessing-inline');
                } catch(e) {}
                m.classList.remove('hidden');
                renderShopSectionTabs();
                renderBlessingNodes();
            }
            function closeBlessingModal(){
                const m = $('blessingModal');
                if (!m) return;
                m.classList.add('hidden');
            }
            function bindStartZoneTabs(){
                const root = $('startZones');
                if (!root || root.__zoneTabsBound) return;
                root.__zoneTabsBound = true;

                const tabs = Array.from(root.querySelectorAll('.startZone[data-zone]'));
                if (!tabs.length) return;
                const startScreen = $('startScreen');
                const startMain = (startScreen ? startScreen.querySelector('.startMain') : null);
                const altViewsRoot = $('startTabAltViews');
                const shopView = $('startTabShopView');
                const settingsView = $('startTabSettingsView');
                const displayView = $('startTabDisplayView');
                const settingsModal = $('settingsModal');
                const settingsPanel = settingsModal ? settingsModal.querySelector('.settings-panel') : null;
                const settingsInlineHost = $('startSettingsInlineHost');
                const blessingModal = $('blessingModal');
                const blessingPanel = $('blessingPanel');
                const shopBlessingHost = $('startShopBlessingHost');

                const restoreSettingsPanelToModal = () => {
                    try {
                        if (settingsPanel && settingsModal && settingsPanel.parentElement !== settingsModal) {
                            settingsModal.appendChild(settingsPanel);
                        }
                        if (settingsModal) settingsModal.classList.add('hidden');
                        if (startScreen) startScreen.classList.remove('settings-inline-mode');
                    } catch(e) {}
                };
                const mountSettingsPanelInline = () => {
                    try {
                        if (settingsPanel && settingsInlineHost && settingsPanel.parentElement !== settingsInlineHost) {
                            settingsInlineHost.appendChild(settingsPanel);
                        }
                        if (settingsModal) settingsModal.classList.add('hidden');
                        if (startScreen) startScreen.classList.add('settings-inline-mode');
                    } catch(e) {}
                };
                const restoreBlessingPanelToModal = () => {
                    try {
                        if (blessingPanel) blessingPanel.classList.remove('blessing-inline');
                        if (blessingPanel && blessingModal && blessingPanel.parentElement !== blessingModal) {
                            blessingModal.appendChild(blessingPanel);
                        }
                        if (blessingModal) blessingModal.classList.add('hidden');
                    } catch(e) {}
                };
                const mountBlessingPanelInline = () => {
                    try {
                        if (blessingPanel && shopBlessingHost && blessingPanel.parentElement !== shopBlessingHost) {
                            shopBlessingHost.appendChild(blessingPanel);
                        }
                        if (blessingPanel) blessingPanel.classList.add('blessing-inline');
                        if (blessingModal) blessingModal.classList.add('hidden');
                    } catch(e) {}
                    renderBlessingNodes();
                };
                const setAltView = (zone) => {
                    if (!altViewsRoot) return;
                    const z = String(zone || '');
                    const showAlt = (z === 'shop' || z === 'settings' || z === 'display');
                    altViewsRoot.classList.toggle('active', showAlt);
                    if (shopView) shopView.classList.toggle('active', z === 'shop');
                    if (settingsView) settingsView.classList.toggle('active', z === 'settings');
                    if (displayView) displayView.classList.toggle('active', z === 'display');
                    if (startMain) startMain.classList.toggle('hidden-tab-main', showAlt);
                };

                const activate = (zone) => {
                    const z = String(zone || 'game');
                    if (startScreen) {
                        startScreen.classList.remove('tab-game', 'tab-shop', 'tab-settings', 'tab-display');
                        startScreen.classList.add('tab-' + z);
                    }
                    for (let i = 0; i < tabs.length; i++) {
                        const t = tabs[i];
                        const on = (t.getAttribute('data-zone') === z);
                        t.classList.toggle('active', on);
                        t.setAttribute('aria-selected', on ? 'true' : 'false');
                    }
                    setAltView(z);
                    if (z === 'settings') mountSettingsPanelInline();
                    else restoreSettingsPanelToModal();
                    if (z === 'shop') mountBlessingPanelInline();
                    else restoreBlessingPanelToModal();
                };

                for (let i = 0; i < tabs.length; i++) {
                    const tab = tabs[i];
                    tab.addEventListener('click', () => activate(tab.getAttribute('data-zone')));
                }
                const firstActive = tabs.find((t) => t.classList.contains('active'));
                activate(firstActive ? firstActive.getAttribute('data-zone') : 'game');
            }
            function bindStartInfoHub(){
                const hub = $('startInfoHub');
                if (!hub || hub.__infoBound) return;
                hub.__infoBound = true;

                const buttons = Array.from(hub.querySelectorAll('.startInfoBtn[data-info]'));
                const panes = Array.from(hub.querySelectorAll('.startInfoPane[data-info-pane]'));
                if (!buttons.length || !panes.length) return;
                const systemBtns = Array.from(hub.querySelectorAll('#infoSystemsSubnav .startInfoSubBtn[data-system-id]'));
                const ammoBtns = Array.from(hub.querySelectorAll('#infoAmmoSubnav .startInfoSubBtn[data-ammo-id]'));
                const systemDetail = $('infoSystemDetail');
                const ammoDetail = $('infoAmmoDetail');
                const paneBodies = {
                    modes: $('infoPaneModesBody'),
                    pvp: $('infoPanePvpBody'),
                    boss: $('infoPaneBossBody'),
                    economy: $('infoPaneEconomyBody'),
                    progress: $('infoPaneProgressBody'),
                    controls: $('infoPaneControlsBody')
                };
                const slotToSkill = { Q: 'clone', E: 'stealth', R: 'vampirism' };
                let activeSystem = 'default';
                let activeAmmo = 'NORMAL';

                const langNow = () => {
                    try { return (window.I18N && typeof window.I18N.lang === 'function') ? window.I18N.lang() : 'vi'; } catch(e){ return 'vi'; }
                };
                const fmtSec = (ms) => {
                    const v = Number(ms);
                    if (!isFinite(v)) return '-';
                    return ((v / 1000) >= 10 ? (v / 1000).toFixed(0) : (v / 1000).toFixed(1)) + 's';
                };
                const esc = (v) => String(v == null ? '' : v)
                    .replace(/&/g, '&amp;')
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;')
                    .replace(/"/g, '&quot;');
                const pct = (v, digits) => {
                    const n = Number(v);
                    if (!isFinite(n)) return '0%';
                    return (n * 100).toFixed(typeof digits === 'number' ? digits : 0) + '%';
                };
                const listHtml = (arr) => {
                    const list = Array.isArray(arr) ? arr : [];
                    if (!list.length) return '';
                    return '<ul class="infoMiniList">' + list.map((x) => '<li>' + esc(x) + '</li>').join('') + '</ul>';
                };
                const getSkillDef = (sysId, slot) => {
                    try {
                        const rt = (window.App && window.App.runtime) ? window.App.runtime : null;
                        const fn = (rt && typeof rt.getSystemSkillDef === 'function')
                            ? rt.getSystemSkillDef
                            : ((typeof window.getSystemSkillDef === 'function') ? window.getSystemSkillDef : null);
                        if (!fn) return {};
                        const def = fn(sysId, slotToSkill[slot]) || {};
                        if (def && Object.keys(def).length) return def;
                    } catch(e){}
                    try {
                        const data = (window.App && window.App.data && window.App.data.skillSystems && window.App.data.skillSystems.tankSystems)
                            ? window.App.data.skillSystems.tankSystems
                            : null;
                        if (!data || !data[sysId] || !data[sysId].skills) return {};
                        const k = slotToSkill[slot];
                        return data[sysId].skills[k] || {};
                    } catch(e){ return {}; }
                };
                const getSystemName = (sysId) => {
                    try {
                        if (window.I18N && typeof window.I18N.systemText === 'function') {
                            const s = window.I18N.systemText(sysId);
                            if (s && s.name) return s.name;
                        }
                    } catch(e){}
                    return sysId;
                };
                const getSkillExtra = (sysId, slot, def, lang) => {
                    const x = [];
                    if (def && typeof def.healPct === 'number') x.push((lang === 'en' ? 'Heal ' : 'Hồi ') + Math.round(def.healPct * 100) + '% HP');
                    if (def && typeof def.radius === 'number') x.push((lang === 'en' ? 'Range ' : 'Tầm ') + Math.round(def.radius));
                    if (def && typeof def.stunDuration === 'number') x.push((lang === 'en' ? 'Stun ' : 'Choáng ') + fmtSec(def.stunDuration));
                    if (def && typeof def.dashSpeedMult === 'number') x.push((lang === 'en' ? 'Dash x' : 'Lướt x') + def.dashSpeedMult.toFixed(2));
                    if (def && typeof def.speedMult === 'number') x.push((lang === 'en' ? 'Move x' : 'Tốc độ x') + def.speedMult.toFixed(2));
                    if (def && typeof def.damageMult === 'number') x.push((lang === 'en' ? 'Damage x' : 'Sát thương x') + def.damageMult.toFixed(2));
                    if (def && typeof def.fireMult === 'number') x.push((lang === 'en' ? 'Fire rate x' : 'Tốc độ bắn x') + def.fireMult.toFixed(2));
                    if (def && typeof def.maxTurrets === 'number') x.push((lang === 'en' ? 'Turret cap ' : 'Tháp tối đa ') + def.maxTurrets);
                    if (def && typeof def.fireRate === 'number') x.push((lang === 'en' ? 'Turret fire ' : 'Nhịp bắn tháp ') + def.fireRate + 'ms');
                    if (def && typeof def.bulletDmgMult === 'number') x.push((lang === 'en' ? 'Turret dmg x' : 'Dmg tháp x') + def.bulletDmgMult.toFixed(2));
                    if (def && typeof def.ramSpeedMult === 'number') x.push((lang === 'en' ? 'Ram speed x' : 'Tốc húc x') + def.ramSpeedMult.toFixed(2));
                    if (def && typeof def.impactBase === 'number') x.push((lang === 'en' ? 'Impact ' : 'Va chạm ') + Math.round(def.impactBase));
                    if (def && typeof def.fireballBase === 'number') x.push((lang === 'en' ? 'Fireball base ' : 'Base cầu lửa ') + Math.round(def.fireballBase));
                    if (def && typeof def.explosionRadius === 'number') x.push((lang === 'en' ? 'Explosion ' : 'Nổ ') + Math.round(def.explosionRadius));
                    if (def && typeof def.tickDamage === 'number') x.push((lang === 'en' ? 'Tick ' : 'Tick ') + Math.round(def.tickDamage));
                    if (def && typeof def.slowFactor === 'number') x.push((lang === 'en' ? 'Slow ' : 'Làm chậm ') + Math.round((1 - def.slowFactor) * 100) + '%');
                    if (sysId === 'assassin') {
                        try {
                            const cfg = (window.App && window.App.config && window.App.config.assassin) ? window.App.config.assassin : null;
                            if (cfg) {
                                if (slot === 'Q' && typeof cfg.skillRangeQ === 'number') x.push((lang === 'en' ? 'Range ' : 'Tầm ') + cfg.skillRangeQ);
                                if (slot === 'E' && typeof cfg.skillRangeE === 'number') x.push((lang === 'en' ? 'Range ' : 'Tầm ') + cfg.skillRangeE);
                                if (slot === 'R' && typeof cfg.skillRangeR === 'number') x.push((lang === 'en' ? 'Range ' : 'Tầm ') + cfg.skillRangeR);
                            }
                        } catch(e){}
                    }
                    return x.join(' • ');
                };
                const getSkillNumbers = (sysId, slot, def, lang) => {
                    const lines = [];
                    const cfgSkill = (window.App && window.App.rules && window.App.rules.skillConfig) ? window.App.rules.skillConfig : {};
                    const assCfg = (window.App && window.App.config && window.App.config.assassin) ? window.App.config.assassin : {};
                    const pvpTuning = (window.App && window.App.config && window.App.config.pvpTuning) ? window.App.config.pvpTuning : {};
                    const skillMult = Number(pvpTuning.skillDamageMult || 0.85);
                    if (sysId === 'default') {
                        if (slot === 'Q') {
                            lines.push(lang === 'en'
                                ? 'Clone HP: ' + Math.round(Number((cfgSkill.CLONE || {}).hp || 150)) + ', fire interval: 600ms.'
                                : 'Phân thân có ' + Math.round(Number((cfgSkill.CLONE || {}).hp || 150)) + ' HP, nhịp bắn 600ms.');
                            lines.push(lang === 'en'
                                ? 'Clone uses Normal-bullet base damage profile (scaled by your current shot multipliers).'
                                : 'Sát thương phân thân dựa trên profile đạn Thường (ăn theo hệ số bắn hiện tại).');
                        } else if (slot === 'E') {
                            lines.push(lang === 'en'
                                ? 'Stealth duration: ' + fmtSec(def.duration) + '.'
                                : 'Thời lượng tàng hình: ' + fmtSec(def.duration) + '.');
                        } else if (slot === 'R') {
                            const leechPct = Number((cfgSkill.VAMPIRISM || {}).leechPercent || 0.2);
                            const leechCap = Number((cfgSkill.VAMPIRISM || {}).capPerSecond || 20);
                            lines.push(lang === 'en'
                                ? 'Lifesteal: +' + pct(leechPct) + ' dealt damage (cap ' + Math.round(leechCap) + ' HP/s).'
                                : 'Hút máu: +' + pct(leechPct) + ' sát thương gây ra (trần ' + Math.round(leechCap) + ' HP/s).');
                            lines.push(lang === 'en'
                                ? 'Incoming damage reduction while active: 70%.'
                                : 'Giảm sát thương nhận khi bật: 70%.');
                        }
                    } else if (sysId === 'speed') {
                        if (slot === 'Q') {
                            lines.push(lang === 'en'
                                ? 'Dash speed x' + Number(def.dashSpeedMult || 3.2).toFixed(2) + ' for ' + fmtSec(def.duration) + '.'
                                : 'Tốc độ lướt x' + Number(def.dashSpeedMult || 3.2).toFixed(2) + ' trong ' + fmtSec(def.duration) + '.');
                            lines.push(lang === 'en'
                                ? 'Full invulnerability + no weapon loss while dashing.'
                                : 'Miễn sát thương hoàn toàn + không mất đạn khi đang lướt.');
                        } else if (slot === 'E') {
                            lines.push(lang === 'en'
                                ? 'Phase duration: ' + fmtSec(def.duration) + ', blocked damage heals 50%.'
                                : 'Thời lượng pha: ' + fmtSec(def.duration) + ', sát thương chặn được hồi lại 50%.');
                        } else if (slot === 'R') {
                            lines.push(lang === 'en'
                                ? 'Damage x' + Number(def.damageMult || 1.35).toFixed(2) + ', move speed x' + Number(def.speedMult || 1.25).toFixed(2) + '.'
                                : 'Sát thương x' + Number(def.damageMult || 1.35).toFixed(2) + ', tốc chạy x' + Number(def.speedMult || 1.25).toFixed(2) + '.');
                            lines.push(lang === 'en'
                                ? 'Shot cooldown multiplier: x' + Number(def.fireMult || 0.5).toFixed(2) + ' (higher fire rate).'
                                : 'Hệ số nhịp bắn: x' + Number(def.fireMult || 0.5).toFixed(2) + ' (tăng tốc độ bắn).');
                        }
                    } else if (sysId === 'engineer') {
                        if (slot === 'Q') {
                            const turretMult = Number(def.bulletDmgMult || 0.6);
                            const normalBase = Number((window.App && window.App.config && window.App.config.BULLET_TYPES && window.App.config.BULLET_TYPES.NORMAL && window.App.config.BULLET_TYPES.NORMAL.damage) || 20);
                            lines.push(lang === 'en'
                                ? 'Turret active ' + fmtSec(def.duration) + ', range ' + Math.round(def.range || 650) + ', fire every ' + Math.round(def.fireRate || 320) + 'ms.'
                                : 'Tháp tồn tại ' + fmtSec(def.duration) + ', tầm ' + Math.round(def.range || 650) + ', bắn mỗi ' + Math.round(def.fireRate || 320) + 'ms.');
                            lines.push(lang === 'en'
                                ? 'Turret bullet damage ≈ ' + Math.round(normalBase * turretMult) + ' per shot (x' + turretMult.toFixed(2) + ' of Normal base).'
                                : 'Sát thương tháp ≈ ' + Math.round(normalBase * turretMult) + '/phát (x' + turretMult.toFixed(2) + ' so với đạn Thường base).');
                        } else if (slot === 'E') {
                            lines.push(lang === 'en'
                                ? 'Instant heal: +' + pct(def.healPct || 0.26) + ' max HP.'
                                : 'Hồi tức thì: +' + pct(def.healPct || 0.26) + ' máu tối đa.');
                        } else if (slot === 'R') {
                            lines.push(lang === 'en'
                                ? 'Pulse radius ' + Math.round(def.radius || 1020) + ', stun ' + fmtSec(def.stunDuration || 2400) + '.'
                                : 'Bán kính xung ' + Math.round(def.radius || 1020) + ', choáng ' + fmtSec(def.stunDuration || 2400) + '.');
                            lines.push(lang === 'en'
                                ? 'PvP damage: ~2% target max HP. PvE boss bonus: ~1.5% boss max HP.'
                                : 'Sát thương PvP: khoảng 2% máu tối đa mục tiêu. PvE boss: khoảng 1.5% máu tối đa boss.');
                        }
                    } else if (sysId === 'juggernaut') {
                        if (slot === 'Q') {
                            lines.push(lang === 'en'
                                ? 'Incoming damage x0.50 while active; reflected damage = 50% incoming (non-boss only).'
                                : 'Sát thương nhận vào x0.50 khi bật; phản đòn = 50% sát thương nhận (không phản boss).');
                        } else if (slot === 'E') {
                            lines.push(lang === 'en'
                                ? 'Ram damage formula: (impactBase + impactPerWave × (wave-1)) × damage multipliers.'
                                : 'Công thức dame húc: (impactBase + impactPerWave × (wave-1)) × các hệ số sát thương.');
                            lines.push(lang === 'en'
                                ? 'Current base: ' + Math.round(def.impactBase || 60) + ', +'
                                    + Math.round(def.impactPerWave || 3) + '/wave, knockback ' + Math.round(def.knockback || 95) + '.'
                                : 'Base hiện tại: ' + Math.round(def.impactBase || 60) + ', +'
                                    + Math.round(def.impactPerWave || 3) + '/wave, hất văng ' + Math.round(def.knockback || 95) + '.');
                        } else if (slot === 'R') {
                            lines.push(lang === 'en'
                                ? 'Siege duration ' + fmtSec(def.duration || 7000) + ': forces ROCKET, incoming damage x0.40.'
                                : 'Siege ' + fmtSec(def.duration || 7000) + ': ép dùng ROCKET, sát thương nhận vào x0.40.');
                            lines.push(lang === 'en'
                                ? 'Movement x0.30, shot cooldown x0.50 while Siege is active.'
                                : 'Tốc chạy x0.30, nhịp bắn x0.50 khi đang Siege.');
                        }
                    } else if (sysId === 'mage') {
                        if (slot === 'Q') {
                            lines.push(lang === 'en'
                                ? 'Fireball damage = (base ' + Math.round(def.fireballBase || 60) + ' + weapon Lv) × '
                                    + Number(def.fireballDmgMult || 2.9).toFixed(2) + '.'
                                : 'Dame cầu lửa = (base ' + Math.round(def.fireballBase || 60) + ' + Lv súng) × '
                                    + Number(def.fireballDmgMult || 2.9).toFixed(2) + '.');
                            lines.push(lang === 'en'
                                ? 'Explosion radius: ' + Math.round(def.explosionRadius || 280) + ', falloff applies outside center.'
                                : 'Bán kính nổ: ' + Math.round(def.explosionRadius || 280) + ', có falloff theo khoảng cách.');
                        } else if (slot === 'E') {
                            const markReq = Math.max(1, Number((pvpTuning.passive || {}).mageMarkReq || 2));
                            lines.push(lang === 'en'
                                ? 'Default blink distance: 600 (non-mark blink).'
                                : 'Khoảng cách blink mặc định: 600 (khi chưa dùng ấn).');
                            lines.push(lang === 'en'
                                ? 'PvP marked blink: consume ' + markReq + ' marks to blink directly to target.'
                                : 'Blink theo ấn ở PvP: tiêu hao ' + markReq + ' ấn để dịch chuyển thẳng tới mục tiêu.');
                        } else if (slot === 'R') {
                            const tickDmg = Number(def.tickDamage || 24);
                            const tickI = Math.max(1, Number(def.tickInterval || 400));
                            const dps = tickDmg * (1000 / tickI);
                            lines.push(lang === 'en'
                                ? 'Storm radius ' + Math.round(def.radius || 220) + ', tick every ' + tickI + 'ms, base DPS ≈ ' + dps.toFixed(1) + '.'
                                : 'Bán kính bão ' + Math.round(def.radius || 220) + ', tick mỗi ' + tickI + 'ms, DPS base ≈ ' + dps.toFixed(1) + '.');
                            lines.push(lang === 'en'
                                ? 'Slow factor: x' + Number(def.slowFactor || 0.5).toFixed(2) + ' for ' + fmtSec(def.slowDuration || 900) + '.'
                                : 'Hệ số làm chậm: x' + Number(def.slowFactor || 0.5).toFixed(2) + ' trong ' + fmtSec(def.slowDuration || 900) + '.');
                        }
                    } else if (sysId === 'assassin') {
                        const qRange = Math.round(Number(assCfg.skillRangeQ || 520));
                        const eRange = Math.round(Number(assCfg.skillRangeE || 650));
                        const rRange = Math.round(Number(assCfg.skillRangeR || 900));
                        const refundMs = Math.round(Number(assCfg.killRefundMs || 1000));
                        const refundCap = Math.round(Number(assCfg.killRefundCapMs || 4000));
                        const refundWindow = Math.round(Number(assCfg.killRefundWindowMs || 5000));
                        if (slot === 'Q') {
                            lines.push(lang === 'en'
                                ? 'Range ' + qRange + ', performs 3 slashes.'
                                : 'Tầm ' + qRange + ', thực hiện 3 nhát chém.');
                        } else if (slot === 'E') {
                            lines.push(lang === 'en'
                                ? 'Range ' + eRange + ', up to 3 targets, 2 slashes per target.'
                                : 'Tầm ' + eRange + ', tối đa 3 mục tiêu, 2 chém/mục tiêu.');
                        } else if (slot === 'R') {
                            lines.push(lang === 'en'
                                ? 'Range ' + rRange + ', up to 10 blink-slashes, max 3 hits per target.'
                                : 'Tầm ' + rRange + ', tối đa 10 nhịp blink-chém, mỗi mục tiêu tối đa 3 hit.');
                        }
                        lines.push(lang === 'en'
                            ? 'Slash damage scales from current weapon profile + damage multipliers.'
                            : 'Dame mỗi nhát chém ăn theo profile đạn hiện tại + các hệ số sát thương.');
                        lines.push(lang === 'en'
                            ? 'Skill leech: 2% dealt damage (cap 12 HP/s).'
                            : 'Hút máu kỹ năng: 2% sát thương gây ra (trần 12 HP/s).');
                        lines.push(lang === 'en'
                            ? 'Kill refund: -' + (refundMs / 1000).toFixed(1) + 's cooldown per kill, cap -' + (refundCap / 1000).toFixed(1) + 's per ' + (refundWindow / 1000).toFixed(0) + 's.'
                            : 'Hồi chiêu khi hạ mục tiêu: -' + (refundMs / 1000).toFixed(1) + 's/kill, trần -' + (refundCap / 1000).toFixed(1) + 's mỗi ' + (refundWindow / 1000).toFixed(0) + 's.');
                        if (Number.isFinite(skillMult) && skillMult > 0 && skillMult < 1) {
                            lines.push(lang === 'en'
                                ? 'PvP global skill damage modifier: x' + skillMult.toFixed(2) + '.'
                                : 'Hệ số sát thương skill toàn cục trong PvP: x' + skillMult.toFixed(2) + '.');
                        }
                    }
                    return lines;
                };
                const renderRichInfoPanes = () => {
                    const lang = langNow();
                    const pack = (INFO_PANE_DETAILS[lang] && INFO_PANE_DETAILS[lang]) ? INFO_PANE_DETAILS[lang] : INFO_PANE_DETAILS.vi;
                    const keys = Object.keys(paneBodies);
                    for (let i = 0; i < keys.length; i++) {
                        const key = keys[i];
                        const host = paneBodies[key];
                        const data = pack[key];
                        if (!host || !data) continue;
                        const badges = (Array.isArray(data.badges) && data.badges.length)
                            ? '<div class="infoRichBadges">' + data.badges.map((b) => '<span class="infoRichBadge">' + esc(b) + '</span>').join('') + '</div>'
                            : '';
                        const cards = (Array.isArray(data.cards) && data.cards.length)
                            ? '<div class="infoRichGrid">' + data.cards.map((card) => ''
                                + '<div class="infoRichCard">'
                                + '<div class="infoRichCardTitle">' + esc(card.title) + '</div>'
                                + listHtml(card.lines)
                                + '</div>'
                            ).join('') + '</div>'
                            : '';
                        const hint = data.hint ? ('<div class="infoRichHint">' + esc(data.hint) + '</div>') : '';
                        host.innerHTML = '<div class="infoRichWrap">' + badges + cards + hint + '</div>';
                    }
                };
                const renderSystemDetail = () => {
                    if (!systemDetail) return;
                    const lang = langNow();
                    const pack = (INFO_SKILL_TEXT[lang] && INFO_SKILL_TEXT[lang][activeSystem])
                        ? INFO_SKILL_TEXT[lang][activeSystem]
                        : INFO_SKILL_TEXT.vi.default;
                    const st = INFO_SYSTEM_STATS[activeSystem] || INFO_SYSTEM_STATS.default;
                    const profilePack = (INFO_SYSTEM_PROFILE[lang] && INFO_SYSTEM_PROFILE[lang][activeSystem])
                        ? INFO_SYSTEM_PROFILE[lang][activeSystem]
                        : INFO_SYSTEM_PROFILE.vi.default;
                    const lines = ['Q', 'E', 'R'].map((slot) => {
                        const info = (pack && pack[slot]) ? pack[slot] : { name: slot, desc: '' };
                        const def = getSkillDef(activeSystem, slot);
                        const cd = fmtSec(def.cooldown);
                        const dur = (def.duration != null) ? fmtSec(def.duration) : '-';
                        const extra = getSkillExtra(activeSystem, slot, def, lang);
                        const numbers = getSkillNumbers(activeSystem, slot, def, lang);
                        const numbersHtml = numbers.length
                            ? '<div class="infoSkillNumbers">' + numbers.map((n) => '<div class="infoSkillLine">• ' + esc(n) + '</div>').join('') + '</div>'
                            : '';
                        return '<div class="infoSkillItem">'
                            + '<div class="infoSkillTitle">' + info.name + '</div>'
                            + '<div class="infoSkillDesc">' + info.desc + '</div>'
                            + '<div class="infoSkillMeta">'
                                + (lang === 'en' ? 'Duration: ' : 'Thời lượng: ') + '<b>' + dur + '</b>'
                                + ' • '
                                + (lang === 'en' ? 'Cooldown: ' : 'Hồi chiêu: ') + '<b>' + cd + '</b>'
                                + (extra ? (' • ' + extra) : '')
                            + '</div>'
                            + numbersHtml
                        + '</div>';
                    }).join('');
                    systemDetail.innerHTML = ''
                        + '<div class="infoDetailHead"><div class="infoDetailName">' + getSystemName(activeSystem) + '</div></div>'
                        + '<div class="infoStatRow">'
                            + '<span class="infoStatChip">HP <b>' + st.hp + '</b></span>'
                            + '<span class="infoStatChip">SPD <b>' + st.spd.toFixed(1) + '</b></span>'
                            + '<span class="infoStatChip">ARM <b>' + Math.round(st.armor * 100) + '%</b></span>'
                            + '<span class="infoStatChip">CD <b>x' + st.cd.toFixed(2) + '</b></span>'
                            + '<span class="infoStatChip">SIZE <b>' + st.size + '</b></span>'
                        + '</div>'
                        + '<div class="infoSystemMetaRow">'
                            + '<span class="infoStatChip">' + (lang === 'en' ? 'Role' : 'Vai trò') + ': <b>' + esc(profilePack.role || '-') + '</b></span>'
                            + '<span class="infoStatChip">' + (lang === 'en' ? 'Difficulty' : 'Độ khó') + ': <b>' + esc(profilePack.difficulty || '-') + '</b></span>'
                        + '</div>'
                        + '<div class="infoSystemGrid">'
                            + '<div class="infoSystemBlock">'
                                + '<div class="infoSystemBlockTitle">' + (lang === 'en' ? 'Strengths' : 'Điểm mạnh') + '</div>'
                                + listHtml(profilePack.strengths)
                            + '</div>'
                            + '<div class="infoSystemBlock">'
                                + '<div class="infoSystemBlockTitle">' + (lang === 'en' ? 'Weaknesses' : 'Điểm yếu') + '</div>'
                                + listHtml(profilePack.weaknesses)
                            + '</div>'
                            + '<div class="infoSystemBlock infoSystemBlockWide">'
                                + '<div class="infoSystemBlockTitle">' + (lang === 'en' ? 'Practical Tips' : 'Mẹo vận hành') + '</div>'
                                + listHtml(profilePack.tips)
                            + '</div>'
                        + '</div>'
                        + '<div class="infoSkillList">' + lines + '</div>';
                };
                const getBulletTypes = () => {
                    try {
                        return (window.App && window.App.config && window.App.config.BULLET_TYPES)
                            ? window.App.config.BULLET_TYPES
                            : ((typeof window.BULLET_TYPES !== 'undefined' && window.BULLET_TYPES) ? window.BULLET_TYPES : {});
                    } catch(e){ return {}; }
                };
                const calcAmmoLevelStats = (ammoId, base, lang) => {
                    const rows = [];
                    for (let lv = 1; lv <= 5; lv++) {
                        let damage = Number(base.damage || 0);
                        let cooldown = Number(base.cooldown || 0);
                        const speed = Number(base.speed || 0);
                        let bulletsPerShot = 1;
                        const extra = [];

                        if (ammoId === 'NORMAL') {
                            cooldown = Math.max(100, cooldown - (lv - 1) * 30);
                            damage += (lv - 1) * 3;
                            if (lv >= 5) bulletsPerShot = 3;
                            else if (lv >= 3) bulletsPerShot = 2;
                        } else if (ammoId === 'FIRE') {
                            cooldown = Math.max(80, cooldown - (lv - 1) * 30);
                            damage += (lv - 1) * 2;
                            if (base.effect && typeof base.effect.tickDamage === 'number') {
                                extra.push((lang === 'en' ? 'Burn tick ' : 'Đốt mỗi nhịp ') + Math.round(base.effect.tickDamage + (lv - 1) * 2));
                            }
                        } else if (ammoId === 'LIGHTNING') {
                            damage += (lv - 1) * 6;
                            cooldown = Math.max(250, cooldown - (lv - 1) * 40);
                            extra.push((lang === 'en' ? 'Chain ' : 'Chuỗi ') + Math.max(0, Math.round((base.chainCount || 0) + (lv - 1))));
                            extra.push((lang === 'en' ? 'Range ' : 'Tầm ') + Math.max(0, Math.round((base.chainRange || 0) + (lv - 1) * 50)));
                        } else if (ammoId === 'PIERCING') {
                            damage = 35 + (lv - 1) * 12;
                            cooldown = Math.max(300, cooldown - (lv - 1) * 60);
                            extra.push((lang === 'en' ? 'Pierce ' : 'Xuyên ') + Math.max(0, Math.round((base.pierceCount || 0) + (lv - 1))));
                        } else if (ammoId === 'HOMING') {
                            damage += (lv - 1) * 4;
                            if (lv >= 5) {
                                damage += 15;
                                bulletsPerShot = 3;
                            }
                            extra.push((lang === 'en' ? 'Turn ' : 'Độ bẻ ') + Math.min(0.5, Number(base.turnSpeed || 0) + (lv - 1) * 0.05).toFixed(2));
                            extra.push((lang === 'en' ? 'Range ' : 'Tầm ') + Math.max(0, Math.round(base.homingRange || 0)));
                        } else if (ammoId === 'STUN') {
                            cooldown = Math.max(200, cooldown - (lv - 1) * 50);
                            damage += (lv - 1) * 5;
                            if (base.effect && typeof base.effect.duration === 'number') {
                                extra.push((lang === 'en' ? 'Stun ' : 'Choáng ') + fmtSec(base.effect.duration + (lv - 1) * 200));
                            }
                        }

                        damage = Math.max(1, Math.round(damage));
                        cooldown = Math.max(40, cooldown);
                        const dps = (cooldown > 0) ? ((damage * bulletsPerShot) / (cooldown / 1000)) : 0;
                        const rps = (cooldown > 0) ? ((bulletsPerShot * 1000) / cooldown) : 0;
                        rows.push({
                            level: lv,
                            bulletsPerShot: bulletsPerShot,
                            damage: damage,
                            speed: speed,
                            cooldown: cooldown,
                            dps: dps,
                            rps: rps,
                            extra: extra.join(' • ')
                        });
                    }
                    return rows;
                };
                const renderAmmoDetail = () => {
                    if (!ammoDetail) return;
                    const lang = langNow();
                    const fmtSecDetail = (ms) => {
                        const v = Number(ms);
                        if (!isFinite(v)) return '-';
                        const s = v / 1000;
                        if (s < 1) return s.toFixed(2) + 's';
                        if (s < 10) return s.toFixed(1) + 's';
                        return s.toFixed(0) + 's';
                    };
                    const bullets = getBulletTypes();
                    const b = bullets[activeAmmo] || {};
                    const tx = (INFO_AMMO_TEXT[lang] && INFO_AMMO_TEXT[lang][activeAmmo])
                        ? INFO_AMMO_TEXT[lang][activeAmmo]
                        : INFO_AMMO_TEXT.vi.NORMAL;
                    const scale = (INFO_AMMO_SCALE_TEXT[lang] && INFO_AMMO_SCALE_TEXT[lang][activeAmmo])
                        ? INFO_AMMO_SCALE_TEXT[lang][activeAmmo]
                        : '';
                    const lvRows = calcAmmoLevelStats(activeAmmo, b, lang);
                    const specials = [];
                    if (b.special === 'CHAIN') specials.push((lang === 'en' ? 'Chain: ' : 'Chuỗi: ') + (b.chainCount || 0) + ' • ' + (lang === 'en' ? 'Range ' : 'Tầm ') + (b.chainRange || 0));
                    if (b.special === 'PIERCE') specials.push((lang === 'en' ? 'Pierce: ' : 'Xuyên: ') + (b.pierceCount || 0));
                    if (b.special === 'HOMING') specials.push((lang === 'en' ? 'Homing ' : 'Bám đuổi ') + (b.homingRange || 0) + ' • Turn ' + (Number(b.turnSpeed || 0).toFixed(2)));
                    if (b.effect && b.effect.type === 'BURN') specials.push((lang === 'en' ? 'Burn ' : 'Đốt ') + fmtSec(b.effect.duration) + ' • Tick ' + (b.effect.tickDamage || 0));
                    if (b.effect && b.effect.type === 'STUN') specials.push((lang === 'en' ? 'Stun ' : 'Choáng ') + fmtSec(b.effect.duration));
                    const lvHeader = (lang === 'en')
                        ? { lv: 'Lv', bullets: 'Shots', dmg: 'Damage', spd: 'Bullet Speed', cd: 'Fire Rate', rps: 'Shots/s', dps: 'DPS', extra: 'Extra' }
                        : { lv: 'Lv', bullets: 'Viên/bắn', dmg: 'Damage', spd: 'Tốc độ đạn', cd: 'Tốc độ bắn', rps: 'Viên/s', dps: 'DPS', extra: 'Thông số thêm' };
                    const lvTitle = (lang === 'en') ? 'Level Detail (Lv1 -> Lv5)' : 'Chi tiết theo cấp (Lv1 -> Lv5)';
                    const lvNote = (lang === 'en')
                        ? '*Bullet Speed is projectile travel speed. Faster feel usually comes from higher fire rate (lower time between shots) and higher shots/s.'
                        : '*Tốc độ đạn là vận tốc bay viên đạn. Cảm giác bắn nhanh thường đến từ tốc độ bắn tăng (thời gian giữa 2 phát giảm) và viên/giây tăng.';
                    const lvTable = '<div class="infoAmmoLvTitle">' + lvTitle + '</div>'
                        + '<div class="infoAmmoTableWrap"><table class="infoAmmoTable">'
                        + '<thead><tr>'
                            + '<th>' + lvHeader.lv + '</th>'
                            + '<th>' + lvHeader.bullets + '</th>'
                            + '<th>' + lvHeader.dmg + '</th>'
                            + '<th>' + lvHeader.spd + '</th>'
                            + '<th>' + lvHeader.cd + '</th>'
                            + '<th>' + lvHeader.rps + '</th>'
                            + '<th>' + lvHeader.dps + '</th>'
                            + '<th>' + lvHeader.extra + '</th>'
                        + '</tr></thead>'
                        + '<tbody>'
                        + lvRows.map((r) => '<tr>'
                            + '<td>' + r.level + '</td>'
                            + '<td>' + r.bulletsPerShot + '</td>'
                            + '<td>' + r.damage + '</td>'
                            + '<td>' + r.speed.toFixed(1) + '</td>'
                            + '<td>' + fmtSecDetail(r.cooldown) + '</td>'
                            + '<td>' + r.rps.toFixed(2) + '</td>'
                            + '<td>' + r.dps.toFixed(1) + '</td>'
                            + '<td>' + (r.extra || '-') + '</td>'
                        + '</tr>').join('')
                        + '</tbody></table></div>'
                        + '<div class="infoAmmoNote">' + lvNote + '</div>';
                    ammoDetail.innerHTML = ''
                        + '<div class="infoDetailHead"><div class="infoDetailName">' + (tx.label || activeAmmo) + '</div></div>'
                        + '<div class="infoAmmoDesc">' + (tx.desc || '') + '</div>'
                        + '<div class="infoAmmoMeta">'
                            + '<span class="infoStatChip">' + (lang === 'en' ? 'Damage' : 'Sát thương') + ': <b>' + Math.round(Number(b.damage || 0)) + '</b></span>'
                            + '<span class="infoStatChip">' + (lang === 'en' ? 'Speed' : 'Tốc độ đạn') + ': <b>' + Number(b.speed || 0).toFixed(1) + '</b></span>'
                            + '<span class="infoStatChip">' + (lang === 'en' ? 'Fire Rate' : 'Tốc độ bắn') + ': <b>' + fmtSec(b.cooldown) + '</b></span>'
                            + '<span class="infoStatChip">' + (lang === 'en' ? 'Radius' : 'Bán kính') + ': <b>' + Math.round(Number(b.radius || 0)) + '</b></span>'
                            + (specials.length ? ('<span class="infoStatChip" style="grid-column:1/-1;">' + specials.join(' • ') + '</span>') : '')
                            + (scale ? ('<span class="infoStatChip" style="grid-column:1/-1;">' + (lang === 'en' ? 'Level Scaling: ' : 'Tăng theo level: ') + scale + '</span>') : '')
                        + '</div>'
                        + lvTable;
                };
                const refreshSubLabels = () => {
                    const lang = langNow();
                    for (let i = 0; i < systemBtns.length; i++) {
                        const sid = systemBtns[i].getAttribute('data-system-id');
                        systemBtns[i].textContent = getSystemName(sid);
                    }
                    for (let i = 0; i < ammoBtns.length; i++) {
                        const aid = ammoBtns[i].getAttribute('data-ammo-id');
                        const tx = (INFO_AMMO_TEXT[lang] && INFO_AMMO_TEXT[lang][aid]) ? INFO_AMMO_TEXT[lang][aid] : INFO_AMMO_TEXT.vi.NORMAL;
                        ammoBtns[i].textContent = tx.label || aid;
                    }
                    renderSystemDetail();
                    renderAmmoDetail();
                    renderRichInfoPanes();
                };
                const activateSystem = (sid) => {
                    activeSystem = INFO_SYSTEM_ORDER.includes(sid) ? sid : 'default';
                    for (let i = 0; i < systemBtns.length; i++) {
                        systemBtns[i].classList.toggle('active', systemBtns[i].getAttribute('data-system-id') === activeSystem);
                    }
                    renderSystemDetail();
                };
                const activateAmmo = (aid) => {
                    activeAmmo = INFO_AMMO_ORDER.includes(aid) ? aid : 'NORMAL';
                    for (let i = 0; i < ammoBtns.length; i++) {
                        ammoBtns[i].classList.toggle('active', ammoBtns[i].getAttribute('data-ammo-id') === activeAmmo);
                    }
                    renderAmmoDetail();
                };

                const activate = (key) => {
                    const id = String(key || 'systems');
                    for (let i = 0; i < buttons.length; i++) {
                        const b = buttons[i];
                        b.classList.toggle('active', b.getAttribute('data-info') === id);
                    }
                    for (let i = 0; i < panes.length; i++) {
                        const p = panes[i];
                        p.classList.toggle('active', p.getAttribute('data-info-pane') === id);
                    }
                };

                for (let i = 0; i < buttons.length; i++) {
                    const btn = buttons[i];
                    btn.addEventListener('click', () => activate(btn.getAttribute('data-info')));
                }
                for (let i = 0; i < systemBtns.length; i++) {
                    const btn = systemBtns[i];
                    btn.addEventListener('click', () => activateSystem(btn.getAttribute('data-system-id')));
                }
                for (let i = 0; i < ammoBtns.length; i++) {
                    const btn = ammoBtns[i];
                    btn.addEventListener('click', () => activateAmmo(btn.getAttribute('data-ammo-id')));
                }
                const first = buttons.find((b) => b.classList.contains('active'));
                const firstSystem = systemBtns.find((b) => b.classList.contains('active'));
                const firstAmmo = ammoBtns.find((b) => b.classList.contains('active'));
                activateSystem(firstSystem ? firstSystem.getAttribute('data-system-id') : 'default');
                activateAmmo(firstAmmo ? firstAmmo.getAttribute('data-ammo-id') : 'NORMAL');
                activate(first ? first.getAttribute('data-info') : 'systems');
                refreshSubLabels();
                window.addEventListener('tank:langchange', refreshSubLabels);
            }
            function bind(){
                const btnOpen = $('btnBlessings');
                const btnClose = $('btnBlessingClose');
                const btnReset = $('btnBlessingReset');
                const modal = $('blessingModal');
                const panel = $('blessingPanel');
                if (!btnClose || !btnReset || !modal || !panel) return;
                if (panel.__blessingBound) return;
                panel.__blessingBound = true;
                bindStartZoneTabs();
                bindStartInfoHub();

                if (btnOpen) btnOpen.addEventListener('click', openBlessingModal);
                btnClose.addEventListener('click', closeBlessingModal);
                modal.addEventListener('click', (ev) => { if (ev.target === modal) closeBlessingModal(); });
                btnReset.addEventListener('click', () => {
                    const g = game();
                    if (!g || typeof g.getBlessingSnapshot !== 'function' || typeof g.resetBlessings !== 'function') return;
                    const snap = g.getBlessingSnapshot();
                    const ok = window.confirm(tr('blessing.resetConfirm', { refund: snap.refundPercent }));
                    if (!ok) return;
                    const res = g.resetBlessings();
                    if (res && res.ok) setActionMsg(tr('blessing.resetDone') + ' +' + (res.refund || 0));
                    renderBlessingNodes();
                });

                window.addEventListener('tank:meta:changed', renderBlessingNodes);
                window.addEventListener('tank:skin:changed', renderBlessingNodes);
                window.addEventListener('tank:preview:ready', () => {
                    try { clearSkinImageCache(); } catch(e) {}
                    try { renderSkinShop(activeSkinSystemId); } catch(e) {}
                });
                window.addEventListener('tank:langchange', () => {
                    renderShopSectionTabs();
                    renderBlessingNodes();
                    setActionMsg('');
                    const g = game();
                    if (g && typeof g.updateMetaRewardLine === 'function' && g.runStats) {
                        const info = {
                            earned: Number(g.runStats.metaGoldEarned || 0),
                            total: Number(g.runStats.metaGoldTotal || 0)
                        };
                        g.updateMetaRewardLine('final', info);
                        g.updateMetaRewardLine('victory', info);
                    }
                });

                try {
                    const __app = window.App || (window.App = {});
                    __app.actions = __app.actions || {};
                    __app.actions.openBlessingModal = openBlessingModal;
                    __app.actions.closeBlessingModal = closeBlessingModal;
                } catch(e){}

                renderShopSectionTabs();
                renderBlessingNodes();
            }

            if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bind, { once: true });
            else setTimeout(bind, 0);
        })();

