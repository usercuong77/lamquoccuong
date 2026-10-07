// === Skin Catalog Data (config-only) ===
(() => {
    const root = window;
    const app = root.App || (root.App = {});
    app.data = app.data || {};

    const SYSTEM_SKIN_CATALOG = Object.freeze({
        default: Object.freeze([
            Object.freeze({
                id: 'default_iron',
                systemId: 'default',
                price: 0,
                rarity: 'base',
                name: { vi: 'Chiến Binh Sắt', en: 'Iron Warrior' },
                desc: {
                    vi: 'Skin cơ bản cân bằng, dễ đọc hitbox.',
                    en: 'Balanced base skin with clear hitbox readability.'
                },
                style: Object.freeze({
                    bodyFill: '#333333',
                    bodyEdge: '#111111',
                    turretCore: '#2E7D32',
                    ringStroke: 'rgba(76,175,80,0.45)',
                    ringFill: 'rgba(76,175,80,0.08)'
                })
            }),
            Object.freeze({
                id: 'default_crimson',
                systemId: 'default',
                price: 160,
                rarity: 'rare',
                name: { vi: 'Chiến Binh Hồng Ngọc', en: 'Crimson Warrior' },
                desc: {
                    vi: 'Khung đỏ đen nổi bật, hợp lối chơi áp sát.',
                    en: 'Red-black combat frame for aggressive play.'
                },
                style: Object.freeze({
                    bodyFill: '#3a1212',
                    bodyEdge: '#150707',
                    turretCore: '#7a1f1f',
                    ringStroke: 'rgba(255,99,99,0.58)',
                    ringFill: 'rgba(255,99,99,0.10)'
                })
            }),
            Object.freeze({
                id: 'default_frost',
                systemId: 'default',
                price: 320,
                rarity: 'epic',
                name: { vi: 'Chiến Binh Băng Lam', en: 'Frost Warrior' },
                desc: {
                    vi: 'Tông băng xanh nhạt, hiệu ứng lạnh sâu.',
                    en: 'Cold cyan palette with deep frost vibe.'
                },
                style: Object.freeze({
                    bodyFill: '#142635',
                    bodyEdge: '#0a141d',
                    turretCore: '#1e4d67',
                    ringStroke: 'rgba(120,220,255,0.62)',
                    ringFill: 'rgba(120,220,255,0.12)'
                })
            })
        ]),
        speed: Object.freeze([
            Object.freeze({
                id: 'speed_neon',
                systemId: 'speed',
                price: 0,
                rarity: 'base',
                name: { vi: 'Tốc Độ Neon', en: 'Neon Speedster' },
                desc: {
                    vi: 'Tông xanh cyan nguyên bản, dễ nhìn khi lướt.',
                    en: 'Default cyan neon look with clear dash readability.'
                },
                style: Object.freeze({
                    bodyFill: '#152f36',
                    bodyEdge: '#08181d',
                    turretCore: '#0f4b55',
                    ringStroke: 'rgba(79,195,247,0.58)',
                    ringFill: 'rgba(79,195,247,0.10)'
                })
            }),
            Object.freeze({
                id: 'speed_solar',
                systemId: 'speed',
                price: 160,
                rarity: 'rare',
                name: { vi: 'Tốc Độ Mặt Trời', en: 'Solar Speedster' },
                desc: {
                    vi: 'Neon vàng cam rực, cảm giác bùng nổ nhịp cao.',
                    en: 'Bright amber neon for high-tempo burst runs.'
                },
                style: Object.freeze({
                    bodyFill: '#3a2a10',
                    bodyEdge: '#1a1105',
                    turretCore: '#7d4f16',
                    ringStroke: 'rgba(255,193,7,0.62)',
                    ringFill: 'rgba(255,193,7,0.12)'
                })
            }),
            Object.freeze({
                id: 'speed_phantom',
                systemId: 'speed',
                price: 320,
                rarity: 'epic',
                name: { vi: 'Tốc Độ Bóng Ma', en: 'Phantom Speedster' },
                desc: {
                    vi: 'Tím đậm lạnh, chuyên cho lối đánh đánh-rút.',
                    en: 'Dark violet scheme built for hit-and-run identity.'
                },
                style: Object.freeze({
                    bodyFill: '#211632',
                    bodyEdge: '#0e0918',
                    turretCore: '#3d2466',
                    ringStroke: 'rgba(183,140,255,0.63)',
                    ringFill: 'rgba(183,140,255,0.11)'
                })
            })
        ]),
        engineer: Object.freeze([
            Object.freeze({
                id: 'engineer_wrench',
                systemId: 'engineer',
                price: 0,
                rarity: 'base',
                name: { vi: 'Kỹ Sư Xưởng Máy', en: 'Workshop Engineer' },
                desc: {
                    vi: 'Bản cơ bản, phù hợp lối đặt tháp an toàn.',
                    en: 'Default workshop build, clean for turret placement.'
                },
                style: Object.freeze({
                    bodyFill: '#3a2d27',
                    bodyEdge: '#18110d',
                    turretCore: '#5a4135',
                    ringStroke: 'rgba(255,167,114,0.56)',
                    ringFill: 'rgba(255,167,114,0.10)'
                })
            }),
            Object.freeze({
                id: 'engineer_amber',
                systemId: 'engineer',
                price: 160,
                rarity: 'rare',
                name: { vi: 'Kỹ Sư Hổ Phách', en: 'Amber Engineer' },
                desc: {
                    vi: 'Nhấn mạnh sắc vàng công nghiệp, nhìn rõ góc đặt tháp.',
                    en: 'Industrial amber frame with strong utility identity.'
                },
                style: Object.freeze({
                    bodyFill: '#3c3218',
                    bodyEdge: '#1a1406',
                    turretCore: '#7a6522',
                    ringStroke: 'rgba(255,202,40,0.62)',
                    ringFill: 'rgba(255,202,40,0.12)'
                })
            }),
            Object.freeze({
                id: 'engineer_hazard',
                systemId: 'engineer',
                price: 320,
                rarity: 'epic',
                name: { vi: 'Kỹ Sư Cảnh Báo', en: 'Hazard Engineer' },
                desc: {
                    vi: 'Đen-vàng cảnh báo, cực hợp style khống chế.',
                    en: 'Black-yellow hazard style for control-heavy play.'
                },
                style: Object.freeze({
                    bodyFill: '#2a2a2a',
                    bodyEdge: '#0f0f0f',
                    turretCore: '#5f5f5f',
                    ringStroke: 'rgba(255,214,64,0.66)',
                    ringFill: 'rgba(255,214,64,0.14)'
                })
            })
        ]),
        juggernaut: Object.freeze([
            Object.freeze({
                id: 'juggernaut_bronze',
                systemId: 'juggernaut',
                price: 0,
                rarity: 'base',
                name: { vi: 'Giáp Sắt Đồng', en: 'Bronze Juggernaut' },
                desc: {
                    vi: 'Khung tanker tiêu chuẩn, dễ đọc sát thương nhận.',
                    en: 'Default tank frame with clear frontline readability.'
                },
                style: Object.freeze({
                    bodyFill: '#4b3a2f',
                    bodyEdge: '#241a14',
                    turretCore: '#5f4c3b',
                    ringStroke: 'rgba(255,213,79,0.56)',
                    ringFill: 'rgba(255,213,79,0.10)'
                })
            }),
            Object.freeze({
                id: 'juggernaut_obsidian',
                systemId: 'juggernaut',
                price: 160,
                rarity: 'rare',
                name: { vi: 'Giáp Sắt Hắc Diệm', en: 'Obsidian Juggernaut' },
                desc: {
                    vi: 'Giáp đen dày, tạo cảm giác cực lì đòn.',
                    en: 'Heavy black plating with brutal frontline tone.'
                },
                style: Object.freeze({
                    bodyFill: '#202226',
                    bodyEdge: '#0b0c0e',
                    turretCore: '#33373d',
                    ringStroke: 'rgba(163,181,205,0.58)',
                    ringFill: 'rgba(163,181,205,0.10)'
                })
            }),
            Object.freeze({
                id: 'juggernaut_titan',
                systemId: 'juggernaut',
                price: 320,
                rarity: 'epic',
                name: { vi: 'Giáp Sắt Titan', en: 'Titan Juggernaut' },
                desc: {
                    vi: 'Tông titan xanh thép, rất nổi trong combat dài.',
                    en: 'Steel-titan blue palette made for long brawls.'
                },
                style: Object.freeze({
                    bodyFill: '#253241',
                    bodyEdge: '#0d141d',
                    turretCore: '#33465b',
                    ringStroke: 'rgba(130,188,255,0.62)',
                    ringFill: 'rgba(130,188,255,0.12)'
                })
            })
        ]),
        mage: Object.freeze([
            Object.freeze({
                id: 'mage_arcane',
                systemId: 'mage',
                price: 0,
                rarity: 'base',
                name: { vi: 'Pháp Sư Arcane', en: 'Arcane Mage' },
                desc: {
                    vi: 'Màu tím chuẩn pháp sư, dễ quan sát kỹ năng.',
                    en: 'Default arcane purple with clear spell readability.'
                },
                style: Object.freeze({
                    bodyFill: '#2e1646',
                    bodyEdge: '#130a21',
                    turretCore: '#3f2062',
                    ringStroke: 'rgba(186,104,200,0.62)',
                    ringFill: 'rgba(186,104,200,0.12)'
                })
            }),
            Object.freeze({
                id: 'mage_void',
                systemId: 'mage',
                price: 160,
                rarity: 'rare',
                name: { vi: 'Pháp Sư Hư Không', en: 'Void Mage' },
                desc: {
                    vi: 'Tím đen u tối, hợp lối cấu rỉa kiểm soát.',
                    en: 'Void-dark style for zoning and control players.'
                },
                style: Object.freeze({
                    bodyFill: '#21172f',
                    bodyEdge: '#0c0812',
                    turretCore: '#34214a',
                    ringStroke: 'rgba(154,117,255,0.63)',
                    ringFill: 'rgba(154,117,255,0.12)'
                })
            }),
            Object.freeze({
                id: 'mage_aurora',
                systemId: 'mage',
                price: 320,
                rarity: 'epic',
                name: { vi: 'Pháp Sư Cực Quang', en: 'Aurora Mage' },
                desc: {
                    vi: 'Tím-lam cực quang, hiệu ứng ma mị mạnh mẽ.',
                    en: 'Aurora cyan-purple blend with high fantasy glow.'
                },
                style: Object.freeze({
                    bodyFill: '#1b2c3a',
                    bodyEdge: '#071018',
                    turretCore: '#2d4459',
                    ringStroke: 'rgba(120,225,255,0.65)',
                    ringFill: 'rgba(120,225,255,0.13)'
                })
            })
        ]),
        assassin: Object.freeze([
            Object.freeze({
                id: 'assassin_shadow',
                systemId: 'assassin',
                price: 0,
                rarity: 'base',
                name: { vi: 'Sát Thủ Bóng Đêm', en: 'Shadow Assassin' },
                desc: {
                    vi: 'Skin mặc định của Sát Thủ, đậm chất ẩn ảnh.',
                    en: 'Default assassin style with shadow identity.'
                },
                style: Object.freeze({
                    bodyFill: '#1b1228',
                    bodyEdge: '#352046',
                    turretCore: '#241333',
                    assBodyA: '#1b1026',
                    assBodyB: '#2d1540',
                    assBodyC: '#3b1b55',
                    assStroke: 'rgba(182,124,255,0.70)',
                    assStripe: 'rgba(255,80,180,0.85)',
                    assEye: 'rgba(255,80,180,0.85)',
                    assBladeA: '#f0e6ff',
                    assBladeB: '#caa6ff',
                    assBladeC: '#7a4ed1',
                    assTip: 'rgba(255,255,255,0.90)',
                    assAuraStroke: 'rgba(170,90,255,0.55)',
                    assAuraFill: 'rgba(90,35,140,0.10)'
                })
            }),
            Object.freeze({
                id: 'assassin_bloodmoon',
                systemId: 'assassin',
                price: 160,
                rarity: 'rare',
                name: { vi: 'Sát Thủ Huyết Nguyệt', en: 'Bloodmoon Assassin' },
                desc: {
                    vi: 'Tông đỏ tím, cảm giác kết liễu cực mạnh.',
                    en: 'Red-violet execution style with aggressive aura.'
                },
                style: Object.freeze({
                    bodyFill: '#2a1018',
                    bodyEdge: '#4c1a2a',
                    turretCore: '#36101f',
                    assBodyA: '#2a0d17',
                    assBodyB: '#4b1528',
                    assBodyC: '#6a2238',
                    assStroke: 'rgba(255,110,150,0.72)',
                    assStripe: 'rgba(255,80,120,0.90)',
                    assEye: 'rgba(255,98,132,0.92)',
                    assBladeA: '#ffe1ea',
                    assBladeB: '#ff9abb',
                    assBladeC: '#c7426f',
                    assTip: 'rgba(255,240,248,0.92)',
                    assAuraStroke: 'rgba(255,90,140,0.58)',
                    assAuraFill: 'rgba(130,20,55,0.12)'
                })
            }),
            Object.freeze({
                id: 'assassin_ghost',
                systemId: 'assassin',
                price: 320,
                rarity: 'epic',
                name: { vi: 'Sát Thủ Hư Ảnh', en: 'Ghost Assassin' },
                desc: {
                    vi: 'Lam trắng lạnh, thiên hướng ám sát tốc độ cao.',
                    en: 'Ghostly cyan style for fast precision assassins.'
                },
                style: Object.freeze({
                    bodyFill: '#122233',
                    bodyEdge: '#1d3850',
                    turretCore: '#183045',
                    assBodyA: '#0f1a2b',
                    assBodyB: '#1a2e45',
                    assBodyC: '#2a4d6f',
                    assStroke: 'rgba(140,220,255,0.74)',
                    assStripe: 'rgba(150,235,255,0.90)',
                    assEye: 'rgba(190,245,255,0.94)',
                    assBladeA: '#effbff',
                    assBladeB: '#b8e8ff',
                    assBladeC: '#5ea6d7',
                    assTip: 'rgba(245,255,255,0.96)',
                    assAuraStroke: 'rgba(120,210,255,0.60)',
                    assAuraFill: 'rgba(50,120,170,0.12)'
                })
            })
        ])
    });

    const ORDER = Object.freeze(['default', 'speed', 'engineer', 'juggernaut', 'mage', 'assassin']);
    const byId = {};
    const all = [];
    const defaultEquippedBySystem = {};

    for (let i = 0; i < ORDER.length; i++) {
        const sid = ORDER[i];
        const arr = Array.isArray(SYSTEM_SKIN_CATALOG[sid]) ? SYSTEM_SKIN_CATALOG[sid] : [];
        if (arr.length > 0) defaultEquippedBySystem[sid] = arr[0].id;
        for (let j = 0; j < arr.length; j++) {
            const s = arr[j];
            if (!s || !s.id) continue;
            byId[s.id] = s;
            all.push(s);
        }
    }

    app.data.skins = Object.freeze({
        version: 1,
        order: ORDER,
        catalog: SYSTEM_SKIN_CATALOG,
        byId: Object.freeze(byId),
        all: Object.freeze(all),
        defaultEquippedBySystem: Object.freeze(defaultEquippedBySystem)
    });

    // Backward-compatible globals.
    root.SYSTEM_SKIN_CATALOG = SYSTEM_SKIN_CATALOG;
    root.SKIN_BY_ID = byId;
    root.SKIN_DEFAULT_EQUIPPED = defaultEquippedBySystem;
})();
