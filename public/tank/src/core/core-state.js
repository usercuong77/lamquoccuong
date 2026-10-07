const META_PROGRESS_STORAGE_KEY = 'tankMetaProgress_v1';
const BLESSING_REFUND_PERCENT = 80;
const META_GOLD_REWARD_CAP = 450;
const BLESSING_NODE_ORDER = ['hp', 'armor', 'damage', 'fireRate', 'goldGain', 'ultiGain'];
const SKIN_SYSTEM_ORDER = ['default', 'speed', 'engineer', 'juggernaut', 'mage', 'assassin'];
const BLESSING_NODE_CONFIG = {
            hp:       { maxLevel: 5, perLevel: 0.02, baseCost: 45, growth: 1.55 },
            armor:    { maxLevel: 5, perLevel: 0.01, baseCost: 55, growth: 1.60 },
            damage:   { maxLevel: 5, perLevel: 0.02, baseCost: 60, growth: 1.65 },
            fireRate: { maxLevel: 5, perLevel: 0.02, baseCost: 70, growth: 1.70 },
            goldGain: { maxLevel: 4, perLevel: 0.06, baseCost: 50, growth: 1.65 },
            ultiGain: { maxLevel: 4, perLevel: 0.06, baseCost: 50, growth: 1.65 }
        };

function clampInt(v, min, max) {
            const n = Number(v);
            if (!Number.isFinite(n)) return min;
            return Math.max(min, Math.min(max, Math.floor(n)));
        }

function blessingCostAtLevel(node, level) {
            if (!node) return 0;
            const lv = Math.max(0, clampInt(level, 0, 99));
            return Math.max(1, Math.round((node.baseCost || 1) * Math.pow(node.growth || 1, lv)));
        }

function getSkinDataSafe() {
            try {
                if (window.App && window.App.data && window.App.data.skins) return window.App.data.skins;
            } catch(e) {}
            return {
                version: 1,
                order: SKIN_SYSTEM_ORDER,
                catalog: {},
                byId: {},
                all: [],
                defaultEquippedBySystem: {}
            };
        }

function isFreeAllSkinsMode() {
            try {
                return !!(window.App && window.App.config && window.App.config.core && window.App.config.core.freeAllSkinsForTest);
            } catch(e) {}
            return false;
        }

const Game = {
            selectedSystemId: 'default',
            mode: 'PVE',
            player: null, coins: [], gold: 0, upgrades: { maxHpLv: 0, dmgLv: 0, fireRateLv: 0, speedLv: 0, magnetLv: 0, armorLv: 0 }, enemies: [], clones: [], turrets: [], projectiles: [], particles: [], pickups: [], bossMines: [], texts: [], obstacles: [], score: 0, shake: 0, active: false,
            adminFreeze: false,
            adminNoSkillCooldown: false,
            unlocks: { assassin: false },
            pvp: null,
            pvpLoadouts: null,
            endlessMode: false,
            meta: null,
            runStats: { bossKills: 0, metaRewardGranted: false, metaGoldEarned: 0, metaGoldTotal: 0 },
            metaRunMultipliers: { hpMult: 1, armorAdd: 0, damageMult: 1, fireCooldownMult: 1, goldGainMult: 1, ultiGainMult: 1 },
            metaGoldGainMult: 1,
            ui: {
                scoreVal: document.getElementById('scoreVal'), goldVal: document.getElementById('goldVal'), waveVal: document.getElementById('waveVal'), enemyCount: document.getElementById('enemyCount'), hpText: document.getElementById('hpText'), hpText2: document.getElementById('hpText2'), buffs: document.getElementById('buffsContainer'), healthBar: document.getElementById('healthBar'), healthBar2: document.getElementById('healthBar2'), weaponBar: document.getElementById('weaponBar'), weaponBar2: document.getElementById('weaponBar2'), ultiBar: document.getElementById('ultiBar'),
                updateScore(val) { this.scoreVal.innerText = val; }, updateGold(val) { if(this.goldVal) this.goldVal.innerText = val; }, updateWave(val) { this.waveVal.innerText = val; }, updateEnemies(val) { this.enemyCount.innerText = val; },
                updateHealth(curr, max) {
                    if (isNaN(curr)) curr = 0;
                    const pct = (max > 0) ? (curr / max) * 100 : 0;
                    const pid = (typeof Game !== 'undefined' && Game.__uiPid === 2) ? 2 : 1;
                    const hb = (pid === 2 && this.healthBar2) ? this.healthBar2 : this.healthBar;
                    const ht = (pid === 2 && this.hpText2) ? this.hpText2 : this.hpText;
                    if (!hb || !ht) return;
                    hb.style.width = `${Math.max(0, pct)}%`;
                    ht.innerText = `${Math.ceil(curr)}/${max}`;
                    if (pct < 30) hb.style.background = 'linear-gradient(90deg, #d32f2f, #f44336)';
                    else hb.style.background = 'linear-gradient(90deg, #4CAF50, #8BC34A)';
                },
                updateUltiBar(val) { this.ultiBar.style.width = `${val}%`; },
                updateSkillSlots(systemId, pid=1) {
                    try {
                        const prefix = (pid === 2) ? 'skill2-' : 'skill-';
                        const sysId = systemId || 'default';
                        const defs = {
                            clone: getSystemSkillDef(sysId, 'clone'),
                            stealth: getSystemSkillDef(sysId, 'stealth'),
                            vampirism: getSystemSkillDef(sysId, 'vampirism')
                        };
                        Object.keys(defs).forEach(k => {
                            const def = defs[k] || {};
                            const slot = document.getElementById(prefix + k);
                            if (!slot) return;
                            if (def.color) {
                                slot.style.borderColor = def.color;
                                slot.style.color = def.color;
                            }
                            const icon = slot.querySelector('.icon');
                            if (icon) icon.innerHTML = def.labelHTML || def.label || '';
                        });
                    } catch(e) {}
                },
                setShieldOverlay(on) { const pid = (typeof Game !== 'undefined' && Game.__uiPid === 2) ? 2 : 1; const el = document.getElementById(pid === 2 ? 'shieldOverlay2' : 'shieldOverlay'); if (el) el.style.display = on ? 'block' : 'none'; },
                addBuff(name, color) { const div = document.createElement('div'); div.className = 'buff-icon'; div.id = `buff-${name}`; div.style.borderColor = color; div.style.color = color; div.innerText = name; this.buffs.appendChild(div); },
                removeBuff(name) { const el = document.getElementById(`buff-${name}`); if (el) el.remove(); },
                updateWeaponInventory(inventory, currentIndex) {
                    const pid = (typeof Game !== 'undefined' && Game.__uiPid === 2) ? 2 : 1;
                    const bar = (pid === 2 && this.weaponBar2) ? this.weaponBar2 : this.weaponBar;
                    if (!bar) return;
                    bar.innerHTML = '';
                    for (let i = 0; i < inventory.length; i++) {
                        const weapon = inventory[i];
                        const slot = document.createElement('div');
                        slot.className = 'slot';
                        if (i === currentIndex) slot.classList.add('selected');
slot.innerHTML = `<div class="icon">${weapon.icon}</div><div class="weapon-level">${weapon.level}</div>`;
                        slot.style.borderColor = weapon.color;
                        slot.style.color = weapon.color;
                        bar.appendChild(slot);
                    }
                },
                updateTankSystemUI(systemId) {
                    const sys = getTankSystem(systemId);
                    const pid = (typeof Game !== 'undefined' && Game.__uiPid === 2) ? 2 : 1;
                    const base = (pid === 2) ? 'skill2-' : 'skill-';
                    const map = [
                        { key: 'clone',     slotId: base + 'clone' },
                        { key: 'stealth',   slotId: base + 'stealth' },
                        { key: 'vampirism', slotId: base + 'vampirism' }
                    ];
                    for (const it of map) {
                        const def = getSystemSkillDef(sys.id, it.key);
                        const slot = document.getElementById(it.slotId);
                        if (!slot || !def) continue;
                        slot.style.borderColor = def.color || '#fff';
                        slot.style.color = def.color || '#fff';
                        const icon = slot.querySelector('.icon');
                        if (icon) icon.innerHTML = def.labelHTML || it.key;
                        const keyNum = slot.querySelector('.key-number');
                        if (keyNum) {
                            // Phase 2: show correct keys by mode (Hard: Q/E/R, Easy & 2P: J/K/L) + P2 skill 1/2/3
                            const __m = (Input && Input.getMode) ? Input.getMode() : (Game.startMode || {difficulty:'hard', players:1});
                            const __hard1p = (__m && __m.players === 1 && __m.difficulty === 'hard');
                            if (pid === 2) {
                                const km2 = { clone:'1', stealth:'2', vampirism:'3' };
                                keyNum.textContent = km2[it.key] || keyNum.textContent;
                            } else {
                                const km = __hard1p ? { clone:'Q', stealth:'E', vampirism:'R' } : { clone:'J', stealth:'K', vampirism:'L' };
                                keyNum.textContent = km[it.key] || (def.key || keyNum.textContent);
                            }
                        }
                    }
                },
                updateSkillCooldown(skillName, lastUsed, cooldown) {
                    const pid = (typeof Game !== 'undefined' && Game.__uiPid === 2) ? 2 : 1;
                    const overlay = document.getElementById(pid === 2 ? `cd2-${skillName}` : `cd-${skillName}`);
                    const txt = document.getElementById(pid === 2 ? `cdt2-${skillName}` : `cdt-${skillName}`);
                    const remaining = Math.max(0, (lastUsed + cooldown) - Date.now());
                    const percent = (cooldown > 0) ? (remaining / cooldown) * 100 : 0;

                    if (overlay) overlay.style.height = `${percent}%`;

                    const slotEl = document.getElementById(pid === 2 ? `skill2-${skillName}` : `skill-${skillName}`);
                    if (slotEl) {
                        if (remaining <= 0) { slotEl.classList.add('ready'); slotEl.classList.remove('cooling'); }
                        else { slotEl.classList.remove('ready'); slotEl.classList.add('cooling'); }
                    }

                    if (txt) {
                        if (remaining <= 0) {
                            txt.textContent = '';
                            txt.style.opacity = 0;
                        } else {
                            txt.textContent = (remaining < 1000)
                                ? `${Math.ceil(remaining)}ms`
                                : `${(remaining / 1000).toFixed(1)}s`;
                            txt.style.opacity = 1;
                        }
                    }
                }
            },
            getSkinCatalog() {
                const data = getSkinDataSafe();
                const order = Array.isArray(data.order) && data.order.length ? data.order : SKIN_SYSTEM_ORDER;
                const catalog = data.catalog || {};
                const byId = data.byId || {};
                const all = Array.isArray(data.all) ? data.all : [];
                const defaults = data.defaultEquippedBySystem || {};
                return { order, catalog, byId, all, defaults };
            },
            normalizeOwnedSkins(rawOwned) {
                const out = {};
                const list = this.getSkinCatalog().all;
                const rawIsArr = Array.isArray(rawOwned);
                const rawMap = (!rawIsArr && rawOwned && typeof rawOwned === 'object') ? rawOwned : {};
                const freeAll = isFreeAllSkinsMode();
                for (let i = 0; i < list.length; i++) {
                    const s = list[i];
                    if (!s || !s.id) continue;
                    const ownedByDefault = freeAll || Number(s.price || 0) <= 0;
                    const ownedFromRaw = rawIsArr ? (rawOwned.indexOf(s.id) >= 0) : !!rawMap[s.id];
                    out[s.id] = !!(ownedByDefault || ownedFromRaw);
                }
                return out;
            },
            normalizeEquippedSkins(rawEquipped, ownedSkins) {
                const out = {};
                const sk = this.getSkinCatalog();
                const map = (rawEquipped && typeof rawEquipped === 'object') ? rawEquipped : {};
                const own = (ownedSkins && typeof ownedSkins === 'object') ? ownedSkins : {};
                for (let i = 0; i < sk.order.length; i++) {
                    const sid = sk.order[i];
                    const arr = Array.isArray(sk.catalog[sid]) ? sk.catalog[sid] : [];
                    const fallback = sk.defaults[sid] || (arr[0] && arr[0].id) || '';
                    let pick = String(map[sid] || fallback || '');
                    const skin = sk.byId[pick];
                    const validSystem = !!(skin && skin.systemId === sid);
                    const owned = !!own[pick];
                    if (!validSystem || !owned) pick = String(fallback || '');
                    if (pick) out[sid] = pick;
                }
                return out;
            },
            getEquippedSkinId(systemId) {
                const meta = this.ensureMetaProgress();
                const sid = String(systemId || 'default');
                const sk = this.getSkinCatalog();
                const arr = Array.isArray(sk.catalog[sid]) ? sk.catalog[sid] : [];
                const fallback = sk.defaults[sid] || (arr[0] && arr[0].id) || '';
                const pick = (meta && meta.equippedSkins && meta.equippedSkins[sid]) ? String(meta.equippedSkins[sid]) : fallback;
                const valid = sk.byId[pick] && sk.byId[pick].systemId === sid && meta.ownedSkins && meta.ownedSkins[pick];
                return valid ? pick : String(fallback || '');
            },
            getEquippedSkinStyle(systemId) {
                const sk = this.getSkinCatalog();
                const id = this.getEquippedSkinId(systemId);
                const item = sk.byId[id];
                return item && item.style ? item.style : null;
            },
            getSkinShopSnapshot(activeSystemId) {
                const meta = this.ensureMetaProgress();
                const sk = this.getSkinCatalog();
                const active = (sk.order.indexOf(String(activeSystemId || '')) >= 0) ? String(activeSystemId) : (sk.order[0] || 'default');
                const cards = (Array.isArray(sk.catalog[active]) ? sk.catalog[active] : []).map((it) => {
                    const owned = !!(meta.ownedSkins && meta.ownedSkins[it.id]);
                    const equipped = (meta.equippedSkins && meta.equippedSkins[active]) === it.id;
                    const priceRaw = Math.max(0, Math.floor(Number(it.price) || 0));
                    const price = isFreeAllSkinsMode() ? 0 : priceRaw;
                    return {
                        id: it.id,
                        systemId: it.systemId,
                        price,
                        rarity: String(it.rarity || 'base'),
                        name: it.name || { vi: it.id, en: it.id },
                        desc: it.desc || { vi: '', en: '' },
                        owned,
                        equipped
                    };
                });
                return {
                    gold: Math.max(0, Math.floor(Number(meta.gold) || 0)),
                    systems: sk.order.slice(),
                    activeSystem: active,
                    equippedSkins: Object.assign({}, meta.equippedSkins || {}),
                    cards
                };
            },
            buySkin(skinId) {
                const meta = this.ensureMetaProgress();
                const sk = this.getSkinCatalog();
                const sid = String(skinId || '');
                const item = sk.byId[sid];
                if (!item) return { ok: false, reason: 'invalid' };
                if (meta.ownedSkins && meta.ownedSkins[sid]) return { ok: false, reason: 'owned', skinId: sid };
                const priceRaw = Math.max(0, Math.floor(Number(item.price) || 0));
                const price = isFreeAllSkinsMode() ? 0 : priceRaw;
                if (meta.gold < price) return { ok: false, reason: 'notEnough', skinId: sid, price, gold: meta.gold };
                meta.gold -= price;
                meta.ownedSkins[sid] = true;
                this.saveMetaProgress(true);
                try { window.dispatchEvent(new CustomEvent('tank:skin:changed', { detail: { reason: 'buy', skinId: sid, systemId: item.systemId } })); } catch(e) {}
                return { ok: true, skinId: sid, systemId: item.systemId, price, gold: meta.gold };
            },
            equipSkin(systemId, skinId) {
                const meta = this.ensureMetaProgress();
                const sk = this.getSkinCatalog();
                const sid = String(systemId || 'default');
                const kid = String(skinId || '');
                const item = sk.byId[kid];
                if (!item || item.systemId !== sid) return { ok: false, reason: 'invalid' };
                if (!meta.ownedSkins || !meta.ownedSkins[kid]) return { ok: false, reason: 'notOwned' };
                if (!meta.equippedSkins) meta.equippedSkins = {};
                meta.equippedSkins[sid] = kid;
                this.saveMetaProgress(true);
                try { window.dispatchEvent(new CustomEvent('tank:skin:changed', { detail: { reason: 'equip', skinId: kid, systemId: sid } })); } catch(e) {}
                return { ok: true, skinId: kid, systemId: sid };
            },
            ensureMetaProgress() {
                if (this.meta && typeof this.meta === 'object') {
                    if (!this.meta.blessings || typeof this.meta.blessings !== 'object') this.meta.blessings = {};
                    if (!this.meta.ownedSkins || typeof this.meta.ownedSkins !== 'object') this.meta.ownedSkins = {};
                    if (!this.meta.equippedSkins || typeof this.meta.equippedSkins !== 'object') this.meta.equippedSkins = {};
                }
                if (this.meta && this.meta.blessings) {
                    for (let i = 0; i < BLESSING_NODE_ORDER.length; i++) {
                        const id = BLESSING_NODE_ORDER[i];
                        const node = BLESSING_NODE_CONFIG[id];
                        this.meta.blessings[id] = clampInt(this.meta.blessings[id], 0, node.maxLevel || 0);
                    }
                    this.meta.ownedSkins = this.normalizeOwnedSkins(this.meta.ownedSkins);
                    this.meta.equippedSkins = this.normalizeEquippedSkins(this.meta.equippedSkins, this.meta.ownedSkins);
                    this.meta.gold = Math.max(0, Math.floor(Number(this.meta.gold) || 0));
                    this.meta.spentGold = Math.max(0, Math.floor(Number(this.meta.spentGold) || 0));
                    return this.meta;
                }

                let raw = null;
                try {
                    const textRaw = localStorage.getItem(META_PROGRESS_STORAGE_KEY);
                    if (textRaw) raw = JSON.parse(textRaw);
                } catch(e) {}

                const blessings = {};
                for (let i = 0; i < BLESSING_NODE_ORDER.length; i++) {
                    const id = BLESSING_NODE_ORDER[i];
                    const node = BLESSING_NODE_CONFIG[id];
                    const rawLv = raw && raw.blessings ? raw.blessings[id] : 0;
                    blessings[id] = clampInt(rawLv, 0, node.maxLevel || 0);
                }

                const spentByLevels = this.computeBlessingSpent(blessings);
                const spentRaw = Math.max(0, Math.floor(Number(raw && raw.spentGold) || 0));
                const ownedSkins = this.normalizeOwnedSkins(raw && raw.ownedSkins);
                const equippedSkins = this.normalizeEquippedSkins(raw && raw.equippedSkins, ownedSkins);
                this.meta = {
                    version: 2,
                    gold: Math.max(0, Math.floor(Number(raw && raw.gold) || 0)),
                    spentGold: Math.max(spentByLevels, spentRaw),
                    blessings,
                    ownedSkins,
                    equippedSkins
                };
                this.saveMetaProgress(false);
                return this.meta;
            },
            saveMetaProgress(emitChange = true) {
                const meta = this.ensureMetaProgress();
                try { localStorage.setItem(META_PROGRESS_STORAGE_KEY, JSON.stringify(meta)); } catch(e) {}
                this.updateMetaGoldUi();
                if (emitChange) this.emitMetaProgressChanged('save');
            },
            emitMetaProgressChanged(reason) {
                try {
                    const meta = this.ensureMetaProgress();
                    window.dispatchEvent(new CustomEvent('tank:meta:changed', {
                        detail: {
                            reason: String(reason || 'update'),
                            gold: meta.gold,
                            spentGold: meta.spentGold,
                            blessings: Object.assign({}, meta.blessings),
                            ownedSkins: Object.assign({}, meta.ownedSkins || {}),
                            equippedSkins: Object.assign({}, meta.equippedSkins || {})
                        }
                    }));
                } catch(e) {}
            },
            computeBlessingSpent(levels) {
                let total = 0;
                const lvMap = (levels && typeof levels === 'object') ? levels : {};
                for (let i = 0; i < BLESSING_NODE_ORDER.length; i++) {
                    const id = BLESSING_NODE_ORDER[i];
                    const node = BLESSING_NODE_CONFIG[id];
                    const lv = clampInt(lvMap[id], 0, node.maxLevel || 0);
                    for (let n = 0; n < lv; n++) total += blessingCostAtLevel(node, n);
                }
                return Math.max(0, Math.floor(total));
            },
            getBlessingCatalog() {
                const list = [];
                for (let i = 0; i < BLESSING_NODE_ORDER.length; i++) {
                    const id = BLESSING_NODE_ORDER[i];
                    const node = BLESSING_NODE_CONFIG[id];
                    if (!node) continue;
                    list.push({
                        id,
                        maxLevel: node.maxLevel || 0,
                        perLevel: Number(node.perLevel || 0),
                        baseCost: Number(node.baseCost || 0),
                        growth: Number(node.growth || 1)
                    });
                }
                return list;
            },
            getBlessingSnapshot() {
                const meta = this.ensureMetaProgress();
                const nodes = {};
                const order = this.getBlessingCatalog();
                for (let i = 0; i < order.length; i++) {
                    const node = order[i];
                    const lv = clampInt(meta.blessings[node.id], 0, node.maxLevel);
                    const isMax = lv >= node.maxLevel;
                    nodes[node.id] = {
                        id: node.id,
                        maxLevel: node.maxLevel,
                        perLevel: node.perLevel,
                        level: lv,
                        isMax,
                        currentBonus: node.perLevel * lv,
                        nextCost: isMax ? 0 : blessingCostAtLevel(node, lv)
                    };
                }
                return {
                    gold: meta.gold,
                    spentGold: meta.spentGold,
                    refundPercent: BLESSING_REFUND_PERCENT,
                    order: order.map((n) => n.id),
                    nodes
                };
            },
            getBlessingLevel(nodeId) {
                const meta = this.ensureMetaProgress();
                const node = BLESSING_NODE_CONFIG[nodeId];
                if (!node) return 0;
                return clampInt(meta.blessings[nodeId], 0, node.maxLevel || 0);
            },
            getBlessingCost(nodeId) {
                const node = BLESSING_NODE_CONFIG[nodeId];
                if (!node) return 0;
                const lv = this.getBlessingLevel(nodeId);
                if (lv >= (node.maxLevel || 0)) return 0;
                return blessingCostAtLevel(node, lv);
            },
            buyBlessing(nodeId) {
                const meta = this.ensureMetaProgress();
                const node = BLESSING_NODE_CONFIG[nodeId];
                if (!node) return { ok: false, reason: 'invalid' };

                const lv = clampInt(meta.blessings[nodeId], 0, node.maxLevel || 0);
                if (lv >= (node.maxLevel || 0)) return { ok: false, reason: 'maxed', level: lv };

                const cost = blessingCostAtLevel(node, lv);
                if (meta.gold < cost) return { ok: false, reason: 'notEnough', cost, gold: meta.gold, level: lv };

                meta.gold -= cost;
                meta.blessings[nodeId] = lv + 1;
                meta.spentGold += cost;
                this.saveMetaProgress(true);

                return {
                    ok: true,
                    nodeId,
                    level: meta.blessings[nodeId],
                    cost,
                    gold: meta.gold,
                    bonus: (node.perLevel || 0) * (meta.blessings[nodeId] || 0)
                };
            },
            resetBlessings() {
                const meta = this.ensureMetaProgress();
                const spent = Math.max(0, Math.floor(Number(meta.spentGold) || 0));
                const refund = Math.max(0, Math.floor(spent * (BLESSING_REFUND_PERCENT / 100)));
                for (let i = 0; i < BLESSING_NODE_ORDER.length; i++) {
                    const id = BLESSING_NODE_ORDER[i];
                    meta.blessings[id] = 0;
                }
                meta.spentGold = 0;
                meta.gold += refund;
                this.saveMetaProgress(true);
                return { ok: true, refund, gold: meta.gold, refundPercent: BLESSING_REFUND_PERCENT };
            },
            getBlessingRuntimeMultipliers(isPvpMode) {
                if (isPvpMode) {
                    return { hpMult: 1, armorAdd: 0, damageMult: 1, fireCooldownMult: 1, goldGainMult: 1, ultiGainMult: 1 };
                }
                const meta = this.ensureMetaProgress();
                const lv = meta.blessings || {};
                const hpLv = clampInt(lv.hp, 0, BLESSING_NODE_CONFIG.hp.maxLevel);
                const armorLv = clampInt(lv.armor, 0, BLESSING_NODE_CONFIG.armor.maxLevel);
                const dmgLv = clampInt(lv.damage, 0, BLESSING_NODE_CONFIG.damage.maxLevel);
                const fireLv = clampInt(lv.fireRate, 0, BLESSING_NODE_CONFIG.fireRate.maxLevel);
                const goldLv = clampInt(lv.goldGain, 0, BLESSING_NODE_CONFIG.goldGain.maxLevel);
                const ultiLv = clampInt(lv.ultiGain, 0, BLESSING_NODE_CONFIG.ultiGain.maxLevel);
                return {
                    hpMult: 1 + hpLv * BLESSING_NODE_CONFIG.hp.perLevel,
                    armorAdd: armorLv * BLESSING_NODE_CONFIG.armor.perLevel,
                    damageMult: 1 + dmgLv * BLESSING_NODE_CONFIG.damage.perLevel,
                    fireCooldownMult: Math.max(0.65, 1 - fireLv * BLESSING_NODE_CONFIG.fireRate.perLevel),
                    goldGainMult: 1 + goldLv * BLESSING_NODE_CONFIG.goldGain.perLevel,
                    ultiGainMult: 1 + ultiLv * BLESSING_NODE_CONFIG.ultiGain.perLevel
                };
            },
            applyBlessingMultipliersToPlayer(player, multipliers) {
                if (!player || !multipliers) return;
                const hpMult = Number(multipliers.hpMult) || 1;
                const armorAdd = Number(multipliers.armorAdd) || 0;
                player.metaDamageMult = Math.max(0.2, Number(multipliers.damageMult) || 1);
                player.metaFireCooldownMult = Math.max(0.2, Number(multipliers.fireCooldownMult) || 1);
                player.metaUltiGainMult = Math.max(0.2, Number(multipliers.ultiGainMult) || 1);
                player.innateArmor = Math.max(-0.5, (Number(player.innateArmor) || 0) + armorAdd);
                player.maxHp = Math.max(1, Math.round((Number(player.maxHp) || 1) * hpMult));
                player.hp = player.maxHp;
                if (typeof player.__baseMaxHp === 'number') player.__baseMaxHp = Math.max(1, Math.round(player.__baseMaxHp * hpMult));
                if (typeof player.baseMaxHp === 'number') player.baseMaxHp = Math.max(1, Math.round(player.baseMaxHp * hpMult));
            },
            updateMetaGoldUi() {
                const meta = this.ensureMetaProgress();
                const val = String(Math.max(0, Math.floor(Number(meta.gold) || 0)));
                try { const q = document.getElementById('metaGoldQuick'); if (q) q.textContent = val; } catch(e) {}
                try { const mv = document.getElementById('blessingMetaGoldValue'); if (mv) mv.textContent = val; } catch(e) {}
            },
            calculateMetaGoldReward(isVictory) {
                const meta = this.ensureMetaProgress();
                if (this.mode === 'PVP_DUEL_AIM') return { earned: 0, total: meta.gold, capped: false };

                let wave = 1;
                try { wave = Math.max(1, Math.floor(Number(WaveManager && WaveManager.wave) || 1)); } catch(e) {}
                const score = Math.max(0, Math.floor(Number(this.score) || 0));
                const bossKills = Math.max(0, Math.floor(Number(this.runStats && this.runStats.bossKills) || 0));
                const winBonus = isVictory ? 80 : 0;
                const raw = Math.floor(wave * 8 + score * 0.02 + bossKills * 25 + winBonus);
                const earned = Math.max(0, Math.min(META_GOLD_REWARD_CAP, raw));
                return { earned, total: meta.gold + earned, capped: raw > META_GOLD_REWARD_CAP };
            },
            grantMetaGoldReward(isVictory) {
                const meta = this.ensureMetaProgress();
                if (!this.runStats || typeof this.runStats !== 'object') {
                    this.runStats = { bossKills: 0, metaRewardGranted: false, metaGoldEarned: 0, metaGoldTotal: meta.gold };
                }

                if (this.runStats.metaRewardGranted) {
                    return {
                        earned: Math.max(0, Math.floor(Number(this.runStats.metaGoldEarned) || 0)),
                        total: Math.max(0, Math.floor(Number(this.runStats.metaGoldTotal) || meta.gold))
                    };
                }

                const calc = this.calculateMetaGoldReward(!!isVictory);
                const earned = Math.max(0, Math.floor(Number(calc.earned) || 0));
                if (earned > 0) meta.gold += earned;
                this.runStats.metaRewardGranted = true;
                this.runStats.metaGoldEarned = earned;
                this.runStats.metaGoldTotal = meta.gold;

                this.saveMetaProgress(true);
                return { earned, total: meta.gold };
            },
            updateMetaRewardLine(prefix, rewardInfo) {
                const earned = Math.max(0, Math.floor(Number(rewardInfo && rewardInfo.earned) || 0));
                const total = Math.max(0, Math.floor(Number(rewardInfo && rewardInfo.total) || 0));
                const pref = String(prefix || 'final');
                try {
                    const e = document.getElementById(pref + 'MetaGoldEarn');
                    if (e) e.textContent = String(earned);
                    const t = document.getElementById(pref + 'MetaGoldTotal');
                    if (t) t.textContent = String(total);
                    const line = document.getElementById(pref + 'MetaGoldLine');
                    if (line) {
                        const msg = (window.t)
                            ? window.t('blessing.rewardLine', { earn: earned, total: total })
                            : ('Meta Gold +' + earned + ' (Total: ' + total + ')');
                        line.textContent = msg;
                    }
                } catch(e) {}
            },
            initPvpRounds() {
                const now = Date.now();
                const totalRounds = 5;
                const roundsToWin = 3;
                this.pvp = {
                    totalRounds,
                    roundsToWin,
                    round: 1,
                    wins: [0, 0],
                    state: 'countdown',
                    countdownMs: 3000,
                    countdownEnd: now + 3000,
                    roundEndAt: 0,
                    freeze: true,
                    message: 'ROUND 1',
                    messageUntil: now + 900,
                    matchWinner: 0,
                    zone: null,
                    zoneLast: now,
                    zoneDamagePerSec: 0.10, // 10% max HP per second outside zone
                    zoneShrinkMs: 12000,
                    zonePauseMs: 12000,
                    zoneSteps: 5,
                    __matchWinSound: false
                };
                this.pvpResetRound();
            },
            pvpResetRound() {
                // Clear dynamic entities (keep obstacles/map)
                this.enemies = [];
                this.clones = [];
                this.turrets = [];
                this.projectiles = [];
                this.particles = [];
                this.pickups = [];
                this.coins = [];
                this.bossMines = [];
                this.texts = [];

                const cx = WORLD_WIDTH / 2;
                const cy = WORLD_HEIGHT / 2;
                const offset = Math.max(360, Math.min(WORLD_WIDTH, WORLD_HEIGHT) * 0.35);

                const resetPlayer = (p, x, y) => {
                    if (!p) return;
                    p.x = x; p.y = y;
                    const r = p.radius || 22;
                    p.x = Math.max(r, Math.min(WORLD_WIDTH - r, p.x));
                    p.y = Math.max(r, Math.min(WORLD_HEIGHT - r, p.y));

                    p.hp = p.maxHp;
                    p.__noCollide = false;
                    p.isStealth = false;
                    p.lastShot = 0;
                    p.__pvpTarget = null;
                    p.__easyTarget = null;
                    p._pvpLockUntil = 0;
                    p._pvpSkillLockUntil = 0;
                    p._pvpHardCc = { lastAt: 0 };
                    p._motionVx = 0;
                    p._motionVy = 0;
                    p.__motionX = p.x;
                    p.__motionY = p.y;
                    p.__motionTick = Date.now();
                    p.ultiCharge = 0;
                    p.vampHeal = { windowStart: 0, healed: 0 };

                    if (p.skills) {
                        for (const k in p.skills) {
                            if (!p.skills[k]) continue;
                            p.skills[k].active = false;
                            p.skills[k].lastUsed = 0;
                            if (typeof p.skills[k].endTime === 'number') p.skills[k].endTime = 0;
                        }
                    }

                    if (p.buffs) {
                        for (const k in p.buffs) {
                            if (!p.buffs[k]) continue;
                            if (typeof p.buffs[k].active !== 'undefined') p.buffs[k].active = false;
                            if (typeof p.buffs[k].endTime !== 'undefined') p.buffs[k].endTime = 0;
                        }
                    }
                    if (p.effects) {
                        if (p.effects.stun) { p.effects.stun.active = false; p.effects.stun.endTime = 0; }
                        if (p.effects.slow) { p.effects.slow.active = false; p.effects.slow.endTime = 0; p.effects.slow.factor = 1; }
                    }
                    if (p.dash) p.dash.active = false;
                    if (p.ram) { p.ram.active = false; if (p.ram.hitSet && p.ram.hitSet.clear) p.ram.hitSet.clear(); }
                    if (p.mage && p.mage.blizzard) { p.mage.blizzard.active = false; p.mage.blizzard.locked = false; p.mage.blizzard.endTime = 0; }
                    if (typeof p.baseSpeed === 'number') p.speed = p.baseSpeed;
                    if (typeof p.baseRadius === 'number') p.radius = p.baseRadius;
                    if (typeof pvpApplyLoadoutToPlayer === 'function') pvpApplyLoadoutToPlayer(p, p.pid || 1);
                };

                if (this.pvp) {
                    // Reset shrinking zone
                    const cx = WORLD_WIDTH / 2;
                    const cy = WORLD_HEIGHT / 2;
                    const startR = Math.hypot(WORLD_WIDTH / 2, WORLD_HEIGHT / 2) * 0.98;
                    const endR = Math.max(220, Math.min(WORLD_WIDTH, WORLD_HEIGHT) * 0.12);
                    const steps = Math.max(1, this.pvp.zoneSteps || 8);
                    const stepSize = (startR - endR) / steps;
                    this.pvp.zone = {
                        cx, cy,
                        startR,
                        endR,
                        r: startR,
                        active: true,
                        stepSize: stepSize,
                        stepIndex: 0,
                        phase: 'idle',
                        phaseStart: 0,
                        phaseEnd: 0,
                        fromR: startR,
                        toR: startR
                    };
                    this.pvp.zoneLast = Date.now();
                    this.pvp.__matchWinSound = false;
                }

                const p1 = (this.players && this.players[0]) ? this.players[0] : null;
                const p2 = (this.players && this.players[1]) ? this.players[1] : null;
                resetPlayer(p1, cx - offset / 2, cy);
                resetPlayer(p2, cx + offset / 2, cy);
                if (p1) p1.angle = 0;
                if (p2) p2.angle = Math.PI;

                // Refresh HUD (HP/ulti/buffs)
                try { if (this.ui && this.ui.buffs) this.ui.buffs.innerHTML = ''; } catch(e){}
                const __pidPrev = this.__uiPid;
                try {
                    if (p1) { this.__uiPid = 1; this.ui.updateHealth(p1.hp, p1.maxHp); this.ui.updateUltiBar(0); }
                    if (p2) { this.__uiPid = 2; this.ui.updateHealth(p2.hp, p2.maxHp); }
                } catch(e) {}
                finally { this.__uiPid = __pidPrev; }
            },
            pvpEndRound(winner, msgOverride) {
                const p = this.pvp;
                if (!p) return;
                const now = Date.now();

                if (winner > 0) {
                    try { if (typeof MAX !== 'undefined' && MAX.Audio && MAX.Audio.roundWin) MAX.Audio.roundWin(); } catch(e){}
                }

                if (winner === 1) p.wins[0]++;
                if (winner === 2) p.wins[1]++;

                p.round++;
                p.message = msgOverride || (winner > 0 ? `P${winner} THẮNG ROUND` : 'ROUND HÒA');
                p.messageUntil = now + 1200;
                p.roundEndAt = now + 1200;
                p.state = 'roundEnd';
                p.freeze = true;

                // Stop leftover entities from affecting the end of round
                this.clones = [];
                this.turrets = [];
                this.projectiles = [];
                this.particles = [];
                this.pickups = [];
                this.coins = [];
                this.bossMines = [];
                this.texts = [];

                if (p.wins[0] >= p.roundsToWin || p.wins[1] >= p.roundsToWin) {
                    p.matchWinner = (p.wins[0] >= p.roundsToWin) ? 1 : 2;
                } else if (p.round > p.totalRounds) {
                    if (p.wins[0] > p.wins[1]) p.matchWinner = 1;
                    else if (p.wins[1] > p.wins[0]) p.matchWinner = 2;
                    else p.matchWinner = -1; // draw after max rounds
                } else {
                    p.matchWinner = 0;
                }
            },
            pvpTick() {
                if (!this.pvp) this.initPvpRounds();
                const p = this.pvp;
                const now = Date.now();
                if (p.state === 'countdown') {
                    p.freeze = true;
                    if (!p.countdownEnd) p.countdownEnd = now + p.countdownMs;
                    if (now >= p.countdownEnd) {
                        p.state = 'active';
                        p.freeze = false;
                        p.message = 'FIGHT!';
                        p.messageUntil = now + 700;
                        try { if (typeof MAX !== 'undefined' && MAX.Audio && MAX.Audio.roundStart) MAX.Audio.roundStart(); } catch(e){}
                        if (p.zone) {
                            p.zone.active = true;
                            p.zone.r = p.zone.startR;
                            p.zone.stepIndex = 0;
                            p.zone.phase = 'idle';
                            p.zone.phaseStart = now;
                            p.zone.phaseEnd = now + (p.zonePauseMs || 5000);
                            p.zone.fromR = p.zone.startR;
                            p.zone.toR = p.zone.startR;
                        }
                    }
                    if (p.zone) {
                        p.zone.r = p.zone.startR;
                        p.zoneLast = now;
                    }
                } else if (p.state === 'roundEnd') {
                    p.freeze = true;
                    if (now >= (p.roundEndAt || now)) {
                        if (p.matchWinner !== 0) {
                            p.state = 'matchEnd';
                            p.freeze = true;
                            if (p.matchWinner === -1) p.message = 'HÒA';
                            else p.message = (p.matchWinner === 1) ? 'P1 THẮNG TRẬN' : 'P2 THẮNG TRẬN';
                            p.messageUntil = now + 600000;
                            if (!p.__matchWinSound) {
                                p.__matchWinSound = true;
                                try { if (typeof MAX !== 'undefined' && MAX.Audio && MAX.Audio.matchWin) MAX.Audio.matchWin(); } catch(e){}
                            }
                        } else {
                            this.pvpResetRound();
                            p.state = 'countdown';
                            p.countdownEnd = now + p.countdownMs;
                            p.message = `ROUND ${p.round}`;
                            p.messageUntil = now + 900;
                        }
                    }
                } else if (p.state === 'matchEnd') {
                    p.freeze = true;
                } else {
                    p.freeze = false;
                }

                // Shrinking zone + damage (active round only)
                if (p.state === 'active' && p.zone) {
                    if (p.zone.active) {
                        if (p.zone.phase === 'idle') {
                            if (now >= (p.zone.phaseEnd || now)) {
                                p.zone.phase = 'shrinking';
                                p.zone.phaseStart = now;
                                p.zone.phaseEnd = now + (p.zoneShrinkMs || 5000);
                                p.zone.fromR = p.zone.r;
                                p.zone.toR = Math.max(p.zone.endR, p.zone.fromR - (p.zone.stepSize || 0));
                            }
                        } else if (p.zone.phase === 'shrinking') {
                            const dur = (p.zoneShrinkMs || 5000);
                            const t = Math.max(0, Math.min(1, (now - (p.zone.phaseStart || now)) / dur));
                            p.zone.r = p.zone.fromR + (p.zone.toR - p.zone.fromR) * t;
                            if (now >= (p.zone.phaseEnd || now)) {
                                p.zone.r = p.zone.toR;
                                p.zone.stepIndex = (p.zone.stepIndex || 0) + 1;
                                if (p.zone.stepIndex >= (p.zoneSteps || 5)) {
                                    // Final size reached: keep zone at minimum, no further shrinking
                                    p.zone.phase = 'done';
                                    p.zone.phaseStart = 0;
                                    p.zone.phaseEnd = 0;
                                } else {
                                    p.zone.phase = 'idle';
                                    p.zone.phaseStart = now;
                                    p.zone.phaseEnd = now + (p.zonePauseMs || 5000);
                                }
                            }
                        }
                    }

                    const dt = Math.max(0, (now - (p.zoneLast || now)) / 1000);
                    p.zoneLast = now;

                    if (dt > 0 && p.zone.active) {
                        const __plist = (this.players && this.players.length) ? this.players : (this.player ? [this.player] : []);
                        for (let i = 0; i < __plist.length; i++) {
                            const pl = __plist[i];
                            if (!pl || typeof pl.hp !== 'number' || pl.hp <= 0) continue;
                            if (pl.invulnerable) continue;
                            const pr = (pl.radius || 0);
                            const dx = pl.x - p.zone.cx;
                            const dy = pl.y - p.zone.cy;
                            const dist = Math.hypot(dx, dy);
                            if (dist > (p.zone.r - pr)) {
                                const baseMax = (pl.maxHp && pl.maxHp > 0) ? pl.maxHp : pl.hp;
                                const dmg = Math.max(1, Math.round(baseMax * (p.zoneDamagePerSec || 0.10) * dt));
                                pl.hp = Math.max(0, pl.hp - dmg);
                                const __pidPrev = Game.__uiPid;
                                try { Game.__uiPid = (pl.pid || 1); Game.ui.updateHealth(pl.hp, pl.maxHp); } catch(e){}
                                finally { Game.__uiPid = __pidPrev; }
                            }
                        }
                    }
                }
            },
            pvpCheckRoundEnd() {
                const p = this.pvp;
                if (!p || p.state !== 'active') return;
                const p1 = (this.players && this.players[0]) ? this.players[0] : null;
                const p2 = (this.players && this.players[1]) ? this.players[1] : null;
                if (!p1 || !p2) return;
                const now = Date.now();

                if (p1.hp <= 0 || p2.hp <= 0) {
                    let winner = 0;
                    if (p1.hp <= 0 && p2.hp > 0) winner = 2;
                    else if (p2.hp <= 0 && p1.hp > 0) winner = 1;
                    else winner = 0;
                    this.pvpEndRound(winner);
                    return;
                }
            },
            init() {
                WORLD_WIDTH = canvas.width * 3; WORLD_HEIGHT = canvas.height * 3;

                // Phase 4: multi-player foundation (2P local). Keep P1 as Game.player for compatibility.
                const isPvp = (this.mode === 'PVP_DUEL_AIM');
                let sm = null;
                try { sm = (this.startMode && typeof this.startMode === 'object') ? this.startMode : null; } catch(e){}
                const playersCount = isPvp ? 2 : Math.max(1, Math.min(2, parseInt((sm && sm.players), 10) || 1));
                const p1Sys = (this.selectedSystemId || (sm && sm.p1System) || 'default');
                const p2Sys = (sm && sm.p2System) ? sm.p2System : 'default';

                this.player = new Player(p1Sys);

                // Prefer latest selected system from localStorage if present (prevents UI mismatch)
                try {
                    const _lsSys = localStorage.getItem("tankSystem");
                    if (_lsSys) this.selectedSystemId = _lsSys;
                } catch(e) {}

                // Safety: if selected system differs, honor selection (avoid UI mismatch)
                if (this.selectedSystemId && this.selectedSystemId !== this.player.systemId) {
                    const __p = this.player;
                    const __n = new Player(this.selectedSystemId);
                    __n.pid = __p.pid || 1;
                    __n.x = __p.x; __n.y = __p.y;
                    this.player = __n;
                }

                // Safety: if selected system differs, honor selection (avoid UI mismatch)
                if (this.selectedSystemId && this.selectedSystemId !== this.player.systemId) {
                    const __p = this.player;
                    const __n = new Player(this.selectedSystemId);
                    __n.pid = __p.pid || 1;
                    __n.x = __p.x; __n.y = __p.y;
                    this.player = __n;
                }
                this.player.pid = 1;
                this.player2 = null;
                this.players = [this.player];

                if (playersCount === 2) {
                    this.player2 = new Player(p2Sys);
                    this.player2.pid = 2;
                    // spawn slightly offset so they don't overlap
                    try {
                        this.player2.x = this.player.x + 120;
                        this.player2.y = this.player.y;
                        const r = this.player2.radius || 22;
                        this.player2.x = Math.max(r, Math.min(WORLD_WIDTH - r, this.player2.x));
                        this.player2.y = Math.max(r, Math.min(WORLD_HEIGHT - r, this.player2.y));
                    } catch(e){}
                    this.players.push(this.player2);
                }

                this.ensureMetaProgress();
                this.updateMetaGoldUi();
                this.runStats = { bossKills: 0, metaRewardGranted: false, metaGoldEarned: 0, metaGoldTotal: this.meta ? this.meta.gold : 0 };
                this.metaRunMultipliers = this.getBlessingRuntimeMultipliers(isPvp);
                this.metaGoldGainMult = this.metaRunMultipliers.goldGainMult || 1;
                if (!isPvp) {
                    try {
                        const __plsMeta = (this.players && this.players.length) ? this.players : [];
                        for (let __i = 0; __i < __plsMeta.length; __i++) {
                            this.applyBlessingMultipliersToPlayer(__plsMeta[__i], this.metaRunMultipliers);
                        }
                    } catch(e) {}
                }

                // Ensure 2P HUD visibility is correct immediately after init.
                try {
                    const __twoPInit = (playersCount === 2);
                    const __hud2Init = document.getElementById('hudP2');
                    const __rowInit = document.getElementById('playersHudRow');
                    if (__hud2Init) {
                        __hud2Init.classList.toggle('hidden', !__twoPInit);
                        __hud2Init.style.display = __twoPInit ? 'flex' : 'none';
                    }
                    if (__rowInit) __rowInit.classList.toggle('twoP', __twoPInit);
                } catch(e) {}

                if (isPvp) {
                    try {
                        if (this.player) pvpApplyLoadoutToPlayer(this.player, 1);
                        if (this.player2) pvpApplyLoadoutToPlayer(this.player2, 2);
                    } catch(e) {}
                }

                // Sync skill labels/colors with selected system
                try {
                    if (this.ui && this.ui.updateSkillSlots) {
                        this.ui.updateSkillSlots(this.player.systemId, 1);
                        if (this.player2) this.ui.updateSkillSlots(this.player2.systemId, 2);
                    }
                } catch(e) {}

                // PvP: double base HP for all systems (survivability buff)
                if (isPvp) {
                    const __pls = (this.players && this.players.length) ? this.players : [];
                    for (let __i = 0; __i < __pls.length; __i++) {
                        const __p = __pls[__i];
                        if (!__p || typeof __p.maxHp !== 'number') continue;
                        __p.maxHp = Math.max(1, Math.round(__p.maxHp * 2));
                        __p.hp = __p.maxHp;
                        if (typeof __p.__baseMaxHp === 'number') __p.__baseMaxHp = Math.max(1, Math.round(__p.__baseMaxHp * 2));
                        if (typeof __p.baseMaxHp === 'number') __p.baseMaxHp = Math.max(1, Math.round(__p.baseMaxHp * 2));
                    }
                }

                this.enemies = []; this.clones = []; this.turrets = []; this.projectiles = []; this.particles = []; this.pickups = []; this.texts = []; this.obstacles = []; this.score = 0; this.coins = []; this.gold = 0; this.upgrades = { maxHpLv: 0, dmgLv: 0, fireRateLv: 0, speedLv: 0, magnetLv: 0, armorLv: 0 }; this.active = true; this.paused = false;
                this.endlessMode = false;
                this.adminFreeze = false;
                this.adminNoSkillCooldown = false;
                this.__pvpCleaned = false;
                this.generateObstacles();
                if (isPvp) {
                    try { WaveManager.active = false; WaveManager.wave = 1; } catch(e){}
                    setElDisplay('bossHealthContainer', 'none');
                    this.initPvpRounds();
                } else {
                    WaveManager.wave = 1; WaveManager.startWave();
                }

                // Phase 10.2: init HUD for each player (HP/skills/weapons) with clear pid
                this.ui.updateScore(0); this.ui.updateGold(0); this.ui.updateUltiBar(0);
                const __pidPrev0 = Game.__uiPid;
                try {
                    Game.__uiPid = 1;
                    this.ui.updateHealth(this.player.hp, this.player.maxHp);
                    this.ui.updateWeaponInventory(this.player.inventory, this.player.currentWeaponIndex);
                    this.ui.updateTankSystemUI(this.player.systemId || p1Sys);

                    if (this.player2) {
                        Game.__uiPid = 2;
                        this.ui.updateHealth(this.player2.hp, this.player2.maxHp);
                        this.ui.updateWeaponInventory(this.player2.inventory, this.player2.currentWeaponIndex);
                        this.ui.updateTankSystemUI(this.player2.systemId || p2Sys);
                    }
                } finally { Game.__uiPid = __pidPrev0; }
this.ui.buffs.innerHTML = '';

                Admin.init();
                Input.init(); requestAnimationFrame(loop);
            },
            generateObstacles() {
                this.obstacles = [];
                for (let i = 0; i < 30; i++) {
                    const w = 100 + Math.random() * 150; const h = 100 + Math.random() * 150; const x = Math.random() * (WORLD_WIDTH - w); const y = Math.random() * (WORLD_HEIGHT - h); const distToCenter = Math.hypot(x - WORLD_WIDTH/2, y - WORLD_HEIGHT/2);
                    if (distToCenter < 400) continue;
                    if(Game.player && checkCircleRect({x: Game.player.x, y: Game.player.y, radius: 150}, {x, y, width: w, height: h})) continue;
                    this.obstacles.push(new Obstacle(x, y, w, h));
                }
            },
            gameOver() {
                this.active = false;
                this.paused = true;

                hideCombatUi();

                // Update end screen values
                try { document.getElementById('finalScore').innerText = this.score; } catch(e){}
                try { document.getElementById('finalWave').innerText = WaveManager.wave; } catch(e){}
                try {
                    const reward = this.grantMetaGoldReward(false);
                    this.updateMetaRewardLine('final', reward);
                } catch(e) {}

                // Update best + sync UI
                try { if (typeof MAX !== 'undefined') MAX.State.updateBest(this.score, WaveManager.wave); } catch(e){}

                // Show screen
                showEl('gameOverScreen');
            },
            victory() {
                this.active = false;
                this.paused = true;

                hideCombatUi();

                const wave = WaveManager.wave;
                try { if (wave >= ASSASSIN_UNLOCK_WAVE) unlockAssassin('wave20'); } catch(e){}
                try { document.getElementById('victoryWave').innerText = wave; } catch(e){}
                try { document.getElementById('victoryScore').innerText = this.score; } catch(e){}
                try {
                    const reward = this.grantMetaGoldReward(true);
                    this.updateMetaRewardLine('victory', reward);
                } catch(e) {}

                // Update best + show best on victory screen
                try { if (typeof MAX !== 'undefined') MAX.State.updateBest(this.score, wave); } catch(e){}
                try {
                    const bs = (typeof MAX !== 'undefined' && MAX.State && MAX.State.save) ? MAX.State.save.bestScore : 0;
                    const bw = (typeof MAX !== 'undefined' && MAX.State && MAX.State.save) ? MAX.State.save.bestWave : 0;
                    const elBS = document.getElementById('victoryBestScore');
                    const elBW = document.getElementById('victoryBestWave');
                    if (elBS) elBS.innerText = bs;
                    if (elBW) elBW.innerText = bw;
                } catch(e){}

                showEl('victoryScreen');
            }
        };

        try {
            Game.ensureMetaProgress();
            Game.updateMetaGoldUi();
        } catch(e) {}

        // === Gameplay Utilities (collision, FX helpers, minimap) ===
        function checkCollision(c1, c2) { if(!c1 || !c2 || c1.__noCollide || c2.__noCollide || isNaN(c1.x) || isNaN(c2.x)) return false; const dist = Math.hypot(c1.x - c2.x, c1.y - c2.y); return dist < c1.radius + c2.radius; }
        function checkCircleRect(circle, rect) {
            if(isNaN(circle.x) || isNaN(circle.y)) return false; let testX = circle.x; let testY = circle.y;
            if (circle.x < rect.x) testX = rect.x; else if (circle.x > rect.x + rect.width) testX = rect.x + rect.width;
            if (circle.y < rect.y) testY = rect.y; else if (circle.y > rect.y + rect.height) testY = rect.y + rect.height;
            let distX = circle.x - testX; let distY = circle.y - testY; return (distX*distX + distY*distY) <= (circle.radius*circle.radius);
        }
        function isLineBlocked(x1, y1, x2, y2, obstacles) {
            const steps = 10; for(let i=0; i<=steps; i++) { const px = x1 + (x2-x1) * (i/steps); const py = y1 + (y2-y1) * (i/steps); for(let obs of obstacles) { if (px > obs.x && px < obs.x + obs.width && py > obs.y && py < obs.y + obs.height) return true; } } return false;
        }
        function hexToRgb(hex) {
            var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i; hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
            var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex); return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : "255, 255, 255";
        }
        
        function createComplexExplosion(x, y, color) {
            if(isNaN(x) || isNaN(y)) return;
            const mult = 1;

            if (typeof MAX !== 'undefined') MAX.Audio.boom();

            // Shockwave
            Game.particles.push(new Particle(x, y, {type: 'shockwave', color: color, size: 5, maxRadius: 50, life: 0.5, decay: 0.1}));

            // Debris
            const debrisCount = Math.round(6 * mult);
            for(let i=0; i<debrisCount; i++) Game.particles.push(new Particle(x, y, {
                type: 'debris', color: color, size: 4 + Math.random()*4, life: 1.0, decay: 0.03,
                velocity: {x: (Math.random()-0.5)*10, y: (Math.random()-0.5)*10}
            }));

            // Smoke
            const smokeCount = Math.round(4 * mult);
            for(let i=0; i<smokeCount; i++) Game.particles.push(new Particle(x, y, {
                type: 'smoke', color: '#555', size: 10, life: 1.5, decay: 0.01,
                velocity: {x: (Math.random()-0.5)*2, y: (Math.random()-0.5)*2}
            }));

            // Sparks
            const sparkCount = Math.round(10 * mult);
            for(let i=0; i<sparkCount; i++) Game.particles.push(new Particle(x, y, {
                type: 'spark', color: color, size: 2, life: 0.25, decay: 0.08,
                velocity: {x: (Math.random()-0.5)*12, y: (Math.random()-0.5)*12}
            }));
        }
        function createExplosion(x, y, color, count) { // Compatibility wrapper.
            createComplexExplosion(x, y, color);
        }

        function createMuzzleFlash(x, y, color, count) { // Compatibility wrapper.
            createComplexExplosion(x, y, color);
        }
        function createMuzzleFlash(x, y, angle, color) {
            if (typeof MAX !== 'undefined') MAX.Audio.shoot();
            Game.particles.push(new Particle(x + Math.cos(angle)*10, y + Math.sin(angle)*10, {type: 'spark', color: color, size: 3, life: 0.1, decay: 0.5}));
        }
        function createDamageText(x, y, text, color) { if(isNaN(x)) return; Game.texts.push({ x, y, text, color, life: 1.0, dy: -1 }); }
        function chainLightning(startEnemy, baseDamage, count, range) {
            if (count <= 0) return;
            let nearest = null; let minDst = Infinity;
            Game.enemies.forEach(e => { if (e === startEnemy) return; const d = Math.hypot(e.x - startEnemy.x, e.y - startEnemy.y); if (d < range && d < minDst) { nearest = e; minDst = d; } });
            if (nearest) {
                nearest.hp -= baseDamage; createDamageText(nearest.x, nearest.y, Math.floor(baseDamage), '#FFEB3B');
                const steps = 10; const dx = (nearest.x - startEnemy.x) / steps; const dy = (nearest.y - startEnemy.y) / steps;
                for(let i=0; i<steps; i++) Game.particles.push(new Particle(startEnemy.x + dx*i, startEnemy.y + dy*i, {type: 'spark', color: '#FFEB3B', size: 2, life: 0.2}));
                chainLightning(nearest, baseDamage * 0.7, count - 1, range);
            }
        }

        function dropGold(x, y, amount, scatter = true) {
            if (isNaN(x) || isNaN(y)) return;
            const val = Math.max(0, Math.floor(amount || 0));
            if (val <= 0) return;
            const c = new Coin(x, y, val);
            if (scatter) { c.x += (Math.random()-0.5)*14; c.y += (Math.random()-0.5)*14; }
            Game.coins.push(c);
        }

        function dropPickup(x, y) {
            if(isNaN(x)) return;
            if (Math.random() > 0.35) return; // Increase chance to 35%.
            const lootTable = [{id: 'HP_PACK', weight: 20}, {id: 'SHIELD', weight: 10}, {id: 'RAPID_FIRE', weight: 10}, {id: 'AMMO_NORMAL', weight: 15}, {id: 'AMMO_FIRE', weight: 10}, {id: 'AMMO_STUN', weight: 10}, {id: 'AMMO_PIERCE', weight: 10}, {id: 'AMMO_LIGHTNING', weight: 10}, {id: 'AMMO_HOMING', weight: 5}];
            const totalWeight = lootTable.reduce((sum, item) => sum + item.weight, 0);
            let random = Math.random() * totalWeight; let selectedItemKey = 'HP_PACK';
            for (const item of lootTable) { if (random < item.weight) { selectedItemKey = item.id; break; } random -= item.weight; }
            if (ITEM_TYPES[selectedItemKey]) Game.pickups.push(new Pickup(x, y, ITEM_TYPES[selectedItemKey]));
        }

        function dropBossWeapon(x, y) {
            if (isNaN(x) || isNaN(y)) return;
            const weapons = ['AMMO_FIRE', 'AMMO_STUN', 'AMMO_PIERCE', 'AMMO_LIGHTNING', 'AMMO_HOMING'];
            const key = weapons[(Math.random() * weapons.length) | 0];
            if (ITEM_TYPES[key]) {
                const px = x + (Math.random() - 0.5) * 18;
                const py = y + (Math.random() - 0.5) * 18;
                Game.pickups.push(new Pickup(px, py, ITEM_TYPES[key]));
            }
        }

        function drawMiniMap() {
            const mapSize = MINIMAP_SIZE; const mapX = canvas.width - mapSize - 20; const mapY = canvas.height - mapSize - 20;
            ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); 
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'; ctx.fillRect(mapX, mapY, mapSize, mapSize);
            ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.strokeRect(mapX, mapY, mapSize, mapSize);
            const scaleX = mapSize / WORLD_WIDTH; const scaleY = mapSize / WORLD_HEIGHT;
            if (Game.player) { ctx.fillStyle = '#0f0'; ctx.beginPath(); ctx.arc(mapX + Game.player.x * scaleX, mapY + Game.player.y * scaleY, 3, 0, Math.PI*2); ctx.fill(); }
            Game.enemies.forEach(e => { ctx.fillStyle = e.typeKey === 'BOSS' ? '#D50000' : '#f00'; const r = e.typeKey === 'BOSS' ? 6 : 2; ctx.beginPath(); ctx.arc(mapX + e.x * scaleX, mapY + e.y * scaleY, r, 0, Math.PI*2); ctx.fill(); });
            ctx.fillStyle = '#FFD700'; Game.pickups.forEach(p => { ctx.fillRect(mapX + p.x * scaleX - 1, mapY + p.y * scaleY - 1, 2, 2); });
            ctx.restore();
        }

        function drawPvpOverlay() {
            if (!Game || Game.mode !== 'PVP_DUEL_AIM' || !Game.pvp) return;
            const p = Game.pvp;
            const now = Date.now();
            ctx.save();
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            // Score + Round
            const roundDisp = Math.min(p.round || 1, p.totalRounds || 5);
            const scoreText = `P1 ${p.wins[0]} - ${p.wins[1]} P2  |  Round ${roundDisp}/${p.totalRounds}`;
            ctx.font = '700 18px Arial';
            const m = ctx.measureText(scoreText);
            const padX = 12, padY = 6;
            const sx = canvas.width / 2;
            const sy = 72;
            ctx.fillStyle = 'rgba(0,0,0,0.45)';
            ctx.fillRect(sx - m.width / 2 - padX, sy - 12, m.width + padX * 2, 24);
            ctx.fillStyle = '#fff';
            ctx.fillText(scoreText, sx, sy);

            // Countdown
            if (p.state === 'countdown') {
                const remain = Math.max(0, (p.countdownEnd || 0) - now);
                const num = Math.ceil(remain / 1000);
                if (num > 0) {
                    ctx.font = '900 86px Arial';
                    ctx.fillStyle = 'rgba(255,255,255,0.95)';
                    ctx.fillText(String(num), sx, canvas.height / 2);
                }
            }

            // Messages (round start/end, fight, match end)
            if (p.state !== 'matchEnd' && p.message && now < (p.messageUntil || 0)) {
                ctx.font = '900 48px Arial';
                ctx.fillStyle = 'rgba(255,255,255,0.95)';
                ctx.fillText(p.message, sx, canvas.height / 2 - 60);
            }

            if (p.state === 'matchEnd') {
                const msg = (p.matchWinner === 1) ? 'P1 THẮNG TRẬN' : (p.matchWinner === 2 ? 'P2 THẮNG TRẬN' : 'HÒA');
                ctx.font = '900 56px Arial';
                ctx.fillStyle = '#FFD54F';
                ctx.fillText(msg, sx, canvas.height / 2 + 10);
                ctx.font = '600 18px Arial';
                ctx.fillStyle = 'rgba(255,255,255,0.75)';
                ctx.fillText('Save & Quit để về menu', sx, canvas.height / 2 + 48);
            }

            ctx.restore();
        }

        function drawPvpZone() {
            if (!Game || Game.mode !== 'PVP_DUEL_AIM' || !Game.pvp || !Game.pvp.zone) return;
            const z = Game.pvp.zone;
            if (!z.active) return;
            const r = z.r || z.startR;
            if (!r || isNaN(r)) return;

            ctx.save();
            // Shade outside of safe zone
            ctx.fillStyle = 'rgba(255,80,80,0.08)';
            ctx.beginPath();
            ctx.rect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
            ctx.arc(z.cx, z.cy, r, 0, Math.PI * 2, true);
            ctx.fill('evenodd');

            // Safe zone ring
            ctx.strokeStyle = 'rgba(255,82,82,0.85)';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(z.cx, z.cy, r, 0, Math.PI * 2);
            ctx.stroke();

            // Inner glow
            ctx.strokeStyle = 'rgba(255,160,160,0.35)';
            ctx.lineWidth = 6;
            ctx.beginPath();
            ctx.arc(z.cx, z.cy, r - 2, 0, Math.PI * 2);
            ctx.stroke();

            ctx.restore();
        }

        // Phase 3 kickoff: expose Game via window/App without changing existing references.
        try {
            const __app = window.App || (window.App = {});
            __app.runtime = __app.runtime || {};
            __app.state = __app.state || {};
            __app.ui = __app.ui || {};
            __app.runtime.Game = Game;
            __app.state.game = Game;
            __app.ui.gameHud = Game.ui;
            __app.ui.drawPvpOverlay = drawPvpOverlay;
            __app.ui.drawPvpZone = drawPvpZone;
            window.Game = Game;
        } catch (e) {}

