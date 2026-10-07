const DEV_LOG = false;
function __devLog() {
    if (!DEV_LOG) return;
    console.log.apply(console, arguments);
}

// === Runtime Module: I18N + Start Screen Text Sync ===

(function initI18NCore(){
  if (window.I18N && window.I18N.__ready) return;

  const STORAGE_KEY = 'tankLang_v1';
  const TEXT = {
    vi: {
      ui: {
        languageButton: 'Ngôn ngữ: VI',
        settings: 'SETTINGS',
        settingsEsc: 'SETTINGS (Esc)',
        pause: 'PAUSE (P)',
        saveQuit: 'SAVE & QUIT',
        replayPvp: 'REPLAY PVP'
      },
      start: {
        subtitle: 'Chọn hệ xe - xem preview và kỹ năng',
        hintUpgrade: 'Nhặt 2 súng giống nhau để NÂNG CẤP (tối đa Lv.5).',
        hintAmmo: 'Đạn thường không bao giờ mất, chỉ bị hạ cấp.',
        hintBoss: 'CẢNH BÁO: Boss sẽ phá hủy mọi vật cản!',
        chooseSystem: 'CHỌN HỆ XE TĂNG',
        preview: 'PREVIEW',
        skillBoard: 'BẢNG CHIÊU',
        tip: 'Tip: tắt VietKey / bộ gõ tiếng Việt (chuyển EN) để di chuyển mượt mà.',
        keyMove: 'Di chuyển',
        keyAimShoot: 'Ngắm & Bắn',
        keyWeapon: 'Chọn súng',
        keySkill: 'Kỹ năng',
        keyPause: 'Tạm dừng',
        modeTitle: 'CHẾ ĐỘ',
        modePlayers: 'Người chơi',
        modeDifficulty: 'Độ khó',
        mode2p: 'Chế độ 2P',
        modeP2System: 'Hệ P2',
        pvpBuildHint: 'PvP-only: mỗi bên chọn 1 đạn + 3 trang bị khác nhau.',
        continue: 'TIẾP TỤC',
        clearSave: 'XÓA SAVE',
        deploy: 'TRIỂN KHAI',
        blessings: 'BLESSINGS',
        metaGoldLabel: 'Meta Gold',
        zoneGameTitle: 'GAME CHÍNH',
        zoneGameDesc: 'Chọn hệ xe, mode và bắt đầu trận.',
        zoneShopTitle: 'SHOP & BLESSING',
        zoneShopDesc: 'Nâng Blessing vĩnh viễn bằng Meta Gold.',
        zoneSettingsTitle: 'CÀI ĐẶT',
        zoneSettingsDesc: 'Ngôn ngữ, âm thanh, trợ ngắm và tùy chọn game.',
        zoneDisplayTitle: 'HIỂN THỊ',
        zoneDisplayDesc: 'Hướng dẫn chơi, mẹo build và cơ chế quan trọng.',
        zonePanelGameHead: 'Điều khiển trận',
        zonePanelGameBody: 'Chọn hệ, chọn mode, sau đó bấm TRIỂN KHAI để vào game.',
        zonePanelShopHead: 'Meta Progress',
        zonePanelShopBody: 'Dùng Meta Gold để mua Blessing vĩnh viễn cho 1P và 2P Bot.',
        zonePanelSettingsHead: 'Cài đặt nhanh',
        zonePanelSettingsBody: 'Mở Settings hoặc đổi ngôn ngữ ngay tại menu.',
        zonePanelDisplayHead: 'Mục hiển thị',
        zonePanelDisplayBody: 'Nhấn để nhìn nhanh Preview hoặc Bảng chiêu.',
        zoneOpenSettingsBtn: 'MỞ SETTINGS',
        zoneToggleLangBtn: 'ĐỔI NGÔN NGỮ',
        zoneFocusPreviewBtn: 'XEM PREVIEW',
        zoneFocusSkillsBtn: 'XEM BẢNG CHIÊU',
        shopViewTitle: 'SHOP & BLESSINGS',
        shopViewDesc: 'Nâng Blessing trực tiếp tại đây bằng Meta Gold.',
        shopViewNote: 'Tip: Blessing chỉ áp dụng cho 1P và 2P Bot.',
        settingsViewTitle: 'SETTINGS',
        settingsViewDesc: 'Màn hình cài đặt đầy đủ cho game.',
        guideViewTitle: 'HƯỚNG DẪN CHƠI',
        guideViewDesc: 'Nắm nhanh cơ chế trước khi vào trận.',
        guideCardObjectiveTitle: 'Mục tiêu',
        guideCardObjectiveBody: 'Vượt wave, hạ boss và giữ máu an toàn.',
        guideCardControlTitle: 'Điều khiển',
        guideCardControlBody: '1P Hard dùng chuột. Easy/2P Bot tự ngắm. Dùng Q/E/R hoặc J/K/L để kích skill.',
        guideCardBuildTitle: 'Build cơ bản',
        guideCardBuildBody: 'Nhặt 2 súng cùng loại để nâng cấp. Ưu tiên súng dễ bắn trúng trước, sát thương sau.',
        guideCardWinTitle: 'Mẹo sống sót',
        guideCardWinBody: 'Luôn giữ di chuyển, canh hồi chiêu, không ở lại giữa bo khi gặp boss.',
        guideCardModeTitle: 'Khác nhau giữa các mode',
        guideCardModeBody: '1P Hard: thuần kỹ năng aim. Easy/2P Bot: hợp người mới. 2P PvP: vào trận rồi chọn đạn + trang bị khắc chế.',
        guideCardEconomyTitle: 'Kinh tế & phát triển',
        guideCardEconomyBody: 'Gold dùng trong trận để nâng cấp wave shop. Meta Gold dùng ngoài trận cho Blessing vĩnh viễn.',
        infoBtnSystems: 'HỆ XE',
        infoBtnModes: 'CHẾ ĐỘ CHƠI',
        infoBtnAmmo: 'ĐẠN THƯỜNG',
        infoBtnPvp: 'PVP LOADOUT',
        infoBtnBoss: 'BOSS & PHASE',
        infoBtnEconomy: 'KINH TẾ',
        infoBtnProgress: 'TIẾN TRÌNH',
        infoBtnControls: 'ĐIỀU KHIỂN',
        infoPaneSystemsTitle: 'Hệ xe',
        infoPaneSystemsBody: 'Chiến Binh: cân bằng công-thủ. Tốc Độ: cơ động cao. Kỹ Sư: lập tháp, sửa chữa, khống chế. Giáp Sắt: tanker mở giao tranh. Pháp Sư: combo kỹ năng tầm xa. Sát Thủ: burst đột kích, mở khóa sau wave 20.',
        infoPaneModesTitle: 'Chế độ chơi',
        infoPaneModesBody: '1P Hard: dành cho người muốn tự aim tự bắn. 1P Easy: tự aim/tự bắn, dễ làm quen. 2P Bot: co-op với P2 bot. 2P PvP: đấu đầu, mỗi bên chọn đạn và trang bị khắc chế trước round.',
        infoPaneAmmoTitle: 'Đạn thường',
        infoPaneAmmoBody: 'Thường: đa dụng, dễ dùng. Đạn Lửa: DPS theo thời gian. Sấm Sét: chain hit, mạnh khi quái đông. Xuyên: đạn sniper có pierce. Đuổi: dễ trúng mục tiêu di chuyển. Choáng: khống chế mục tiêu. Rocket: nổ lan, mạnh giai đoạn cuối.',
        infoPanePvpTitle: 'PvP Loadout',
        infoPanePvpBody: 'Mỗi bên chọn 1 đạn PvP + 3 trang bị. Ví dụ: AP-40 phá giáp, Jammer cấm nhịp skill, Cryo làm chậm. Trang bị có nhánh chống xuyên, giảm burst, chống clone/turret, cắt hồi chiêu địch. Hãy build theo hệ xe đối thủ.',
        infoPaneBossTitle: 'Boss & Phase',
        infoPaneBossBody: 'Boss có 3 phase, pattern đổi theo mức máu. Có giai đoạn mở giáp (weak point) để burst damage. Bo thu dần tạo áp lực vị trí, nên giữ skill thoát hiểm để tránh combo.',
        infoPaneEconomyTitle: 'Kinh tế trận',
        infoPaneEconomyBody: 'Gold dùng trong shop giữa wave: HP, Damage, Tốc độ bắn, Speed, Magnet, Armor. Meta Gold dùng ngoài trận cho Blessing vĩnh viễn (1P/2P Bot). Không dùng chung giữa Gold trận và Meta Gold.',
        infoPaneProgressTitle: 'Tiến trình & lưu game',
        infoPaneProgressBody: 'Best Score/Best Wave hiển thị trong Settings. Auto-save có thể bật/tắt. Save có chữ ký bảo vệ, nếu file bị sửa sai hệ thống sẽ bỏ qua để tránh lỗi.',
        infoPaneControlsTitle: 'Điều khiển nhanh',
        infoPaneControlsBody: 'WASD di chuyển. Hard: chuột ngắm+bắn, Q/E/R dùng skill. Easy/2P Bot: J/K/L dùng skill, auto-aim auto-shoot. P tạm dừng, Esc mở settings. Trong PvP, đọc gợi ý khắc chế trước khi vào round.',
        newGame: 'CHƠI MỚI',
        bestScore: 'Best Score',
        bestWave: 'Best Wave'
      },
      mode: {
        noteHard: 'Hard 1P: dùng chuột ngắm + click bắn.',
        noteEasy: 'Easy 1P: tự ngắm + tự bắn.',
        noteCoop: '2P Bot: chế độ co-op, tự ngắm + tự bắn.',
        notePvp: '2P PvP: vào trận rồi mới chọn đạn + trang bị trong Shop PvP.'
      },
      settings: {
        title: 'CÀI ĐẶT',
        close: 'ĐÓNG',
        sectionCoreTitle: 'Tùy chỉnh cơ bản',
        sectionGameplayTitle: 'Gameplay',
        infoTitle: 'Thông tin chi tiết',
        language: 'Ngôn ngữ',
        languageVi: 'Tiếng Việt',
        languageEn: 'English',
        volume: 'Âm lượng',
        musicVolume: 'Âm lượng nhạc',
        fpsCap: 'FPS cap',
        gameCode: 'Code cài đặt',
        gameCodeHint: 'Chưa có code',
        gameCodePlaceholder: 'Nhập code cài đặt (chưa kích hoạt)...',
        shake: 'Rung màn hình',
        minimap: 'Bản đồ mini',
        fpsCounter: 'Đếm FPS',
        autoSave: 'Tự động lưu',
        aimAssist: 'Hỗ trợ bắn',
        progress: 'TIẾN ĐỘ',
        save: 'LƯU',
        resetSave: 'XÓA SAVE',
        infoModeLabel: 'Chế độ:',
        infoModeValue: '1P Hard: chuột ngắm+bắn, Easy/2P Bot: auto-aim.',
        infoAimLabel: 'Hỗ trợ bắn:',
        infoAimValue: 'Easy 55%, 2P Bot 30%, PvP có thể bật/tắt trong settings.',
        infoShopLabel: 'Shop trận:',
        infoShopValue: '1P/2P Bot mua nâng cấp bằng Gold sau mỗi wave.',
        infoUnlockLabel: 'Mở khóa Sát Thủ:',
        infoUnlockValue: 'Qua wave 20, lưu vĩnh viễn.',
        infoSaveLabel: 'Lưu dữ liệu:',
        infoSaveValue: 'Save tự động có chữ ký, file bị sửa sai sẽ bị bỏ qua.',
        infoMetaLabel: 'Meta Gold:',
        infoMetaValue: 'Dùng cho Blessing vĩnh viễn (không áp dụng PvP).',
        infoVersionLabel: 'Phiên bản:',
        infoVersionValue: 'Tank Battle 2D - Runtime Split Build.',
        hotkeys: 'Phím tắt: P Tạm dừng/Tiếp tục, Esc Cài đặt, M Minimap, F FPS.'
      },
      welcome: {
        title: 'Chúc bạn chơi game vui vẻ!',
        line1: 'Trước khi vào menu chọn hệ xe, hãy chuẩn bị tinh thần "cày" thật đã nhé!',
        line2: '<b>Gợi ý nhanh:</b> Hard dùng chuột để ngắm/bắn - Easy/2P tự ngắm tự bắn.',
        line3: '<b>Liên hệ support:</b> <a href=\"https://www.facebook.com/lvmedits\" target=\"_blank\" rel=\"noopener\">Cường đẹp trai</a>',
        hint: 'Chỉ bấm nút để tiếp tục',
        button: 'Ok Cường đẹp trai'
      },
      pvp: {
        loadTitle: 'SHOP PvP - Chọn Đạn & Trang Bị',
        loadSub: 'Mỗi bên chọn 1 đạn PvP và 3 trang bị khác nhau. Có hiển thị thông số để người mới dễ xem.',
        loadHint: 'Build này chỉ dùng cho PvP.',
        ammo: 'Đạn PvP',
        item1: 'Trang bị 1',
        item2: 'Trang bị 2',
        item3: 'Trang bị 3',
        reset: 'Mặc định',
        confirm: 'Vào trận',
        noAmmoData: 'Không có dữ liệu đạn.',
        noItemData: 'Không có dữ liệu trang bị.',
        itemLabel: 'Trang bị',
        counterTitle: 'Gợi ý khắc chế khi gặp {system}',
        counterAmmo: 'Đạn gợi ý:',
        counterItems: 'Trang bị gợi ý:',
        counterFallbackSystem: 'đối thủ',
        counterFallbackReason: 'Build an toàn cho người mới, cân bằng giữa sát thương và sống sót.'
      },
      blessing: {
        title: 'BLESSINGS',
        close: 'Đóng',
        reset: 'Reset Blessing',
        hint: 'Nâng cấp vĩnh viễn chỉ áp dụng cho 1P và 2P Bot.',
        shopTabBlessings: 'BLESSINGS',
        shopTabSkins: 'SKINS',
        metaGold: 'Meta Gold',
        buy: 'Nâng',
        maxed: 'Tối đa',
        level: 'Cấp {level}/{max}',
        cost: 'Giá: {cost}',
        costMax: 'Đã tối đa',
        ownedBonus: 'Hiệu lực: {value}',
        notEnough: 'Không đủ Meta Gold.',
        buySuccess: 'Đã nâng cấp {name} lên cấp {level}.',
        resetConfirm: 'Reset toàn bộ Blessing và nhận lại {refund}% vàng đã dùng?',
        resetDone: 'Đã reset Blessing.',
        nodeHpName: 'Thể chất',
        nodeHpDesc: '+{value}% máu nền mỗi cấp.',
        nodeArmorName: 'Giáp nền',
        nodeArmorDesc: '+{value}% giáp nền mỗi cấp.',
        nodeDamageName: 'Hỏa lực',
        nodeDamageDesc: '+{value}% sát thương mỗi cấp.',
        nodeFireRateName: 'Nhịp bắn',
        nodeFireRateDesc: '+{value}% tốc độ bắn mỗi cấp.',
        nodeGoldGainName: 'Thu hoạch',
        nodeGoldGainDesc: '+{value}% vàng nhặt mỗi cấp.',
        nodeUltiGainName: 'Năng lượng tối thượng',
        nodeUltiGainDesc: '+{value}% tích ulti mỗi cấp.',
        skinsTitle: 'SKIN HỆ XE',
        skinsOwned: 'Sở hữu {owned}/{total}',
        skinFree: 'Miễn phí',
        skinCost: '{cost} Gold',
        skinBuy: 'Mua',
        skinEquip: 'Trang bị',
        skinEquipped: 'Đang dùng',
        skinNotEnough: 'Không đủ Meta Gold để mua skin.',
        skinBuySuccess: 'Đã mua skin {name}.',
        skinEquipSuccess: 'Đã trang bị {name}.',
        skinRarityBase: 'Cơ bản',
        skinRarityRare: 'Hiếm',
        skinRarityEpic: 'Epic',
        skinImageLabel: 'Ảnh',
        skinPreviewLabel: 'Preview',
        rewardLine: 'Meta Gold +{earn} (Tổng: {total})'
      },
      assassin: {
        title: 'SÁT THỦ',
        lockText: 'Chơi thắng màn 20 để mở khóa.',
        close: 'Đóng',
        unlockedWave20: 'Đã mở khóa do wave >= 20',
        unlockedCode: 'Đã mở khóa bằng code',
        unlockOk: 'OK (Đã mở khóa)'
      },
      skill: {
        duration: 'Thời lượng',
        cooldown: 'Hồi chiêu',
        range: 'Tầm',
        defaultR: 'Hút {leech}% sát thương gây ra - tối đa {cap} HP/giây - giảm {dr}% sát thương nhận',
        speedQ: 'Khi lướt: miễn sát thương - không rớt súng',
        assassinQ: '{range} - 3 lần chém - Có thể quay về',
        assassinE: '{range} - 3 mục tiêu - 2 chém/mục',
        assassinR: '{range} - 10 lần blink - Tối đa 3 hit/mục'
      }
    },
    en: {
      ui: {
        languageButton: 'Language: EN',
        settings: 'SETTINGS',
        settingsEsc: 'SETTINGS (Esc)',
        pause: 'PAUSE (P)',
        saveQuit: 'SAVE & QUIT',
        replayPvp: 'REPLAY PVP'
      },
      start: {
        subtitle: 'Choose your tank system - preview and skills',
        hintUpgrade: 'Pick up 2 identical guns to UPGRADE (max Lv.5).',
        hintAmmo: 'Normal ammo never disappears, it only gets downgraded.',
        hintBoss: 'WARNING: Boss can destroy all obstacles!',
        chooseSystem: 'CHOOSE TANK SYSTEM',
        preview: 'PREVIEW',
        skillBoard: 'SKILL BOARD',
        tip: 'Tip: turn off VietKey / Vietnamese IME (switch EN) for smoother movement.',
        keyMove: 'Move',
        keyAimShoot: 'Aim & Shoot',
        keyWeapon: 'Select weapon',
        keySkill: 'Skills',
        keyPause: 'Pause',
        modeTitle: 'MODE',
        modePlayers: 'Players',
        modeDifficulty: 'Difficulty',
        mode2p: '2P Mode',
        modeP2System: 'P2 System',
        pvpBuildHint: 'PvP-only: each side picks 1 ammo + 3 different items.',
        continue: 'CONTINUE',
        clearSave: 'CLEAR SAVE',
        deploy: 'DEPLOY',
        blessings: 'BLESSINGS',
        metaGoldLabel: 'Meta Gold',
        zoneGameTitle: 'GAME CORE',
        zoneGameDesc: 'Pick system, mode, and start the match.',
        zoneShopTitle: 'SHOP & BLESSINGS',
        zoneShopDesc: 'Buy permanent Blessings with Meta Gold.',
        zoneSettingsTitle: 'SETTINGS',
        zoneSettingsDesc: 'Language, audio, aim assist, and options.',
        zoneDisplayTitle: 'DISPLAY',
        zoneDisplayDesc: 'Gameplay guide, build tips, and key mechanics.',
        zonePanelGameHead: 'Match Control',
        zonePanelGameBody: 'Pick system and mode, then press DEPLOY to start.',
        zonePanelShopHead: 'Meta Progress',
        zonePanelShopBody: 'Spend Meta Gold on permanent Blessings for 1P and 2P Bot.',
        zonePanelSettingsHead: 'Quick Settings',
        zonePanelSettingsBody: 'Open Settings or switch language directly from menu.',
        zonePanelDisplayHead: 'Display Focus',
        zonePanelDisplayBody: 'Quick jump to Preview or Skill Board sections.',
        zoneOpenSettingsBtn: 'OPEN SETTINGS',
        zoneToggleLangBtn: 'SWITCH LANGUAGE',
        zoneFocusPreviewBtn: 'VIEW PREVIEW',
        zoneFocusSkillsBtn: 'VIEW SKILL BOARD',
        shopViewTitle: 'SHOP & BLESSINGS',
        shopViewDesc: 'Upgrade Blessings directly here with Meta Gold.',
        shopViewNote: 'Tip: Blessings apply only to 1P and 2P Bot.',
        settingsViewTitle: 'SETTINGS',
        settingsViewDesc: 'Full settings screen for game options.',
        guideViewTitle: 'HOW TO PLAY',
        guideViewDesc: 'Learn core mechanics before entering battle.',
        guideCardObjectiveTitle: 'Objective',
        guideCardObjectiveBody: 'Clear waves, defeat bosses, and keep your HP stable.',
        guideCardControlTitle: 'Controls',
        guideCardControlBody: '1P Hard uses mouse aim. Easy/2P Bot use auto-aim. Use Q/E/R or J/K/L for skills.',
        guideCardBuildTitle: 'Basic Build',
        guideCardBuildBody: 'Pick 2 identical guns to upgrade. Prioritize easy-hit weapons before raw damage.',
        guideCardWinTitle: 'Survival Tips',
        guideCardWinBody: 'Keep moving, track cooldowns, and avoid staying in the center during boss zone shrink.',
        guideCardModeTitle: 'Mode Differences',
        guideCardModeBody: '1P Hard is pure aiming skill. Easy/2P Bot is newcomer-friendly. 2P PvP lets you pick ammo + counter items in-match.',
        guideCardEconomyTitle: 'Economy & Progression',
        guideCardEconomyBody: 'Gold is spent in-wave shop upgrades. Meta Gold is spent outside match for permanent Blessings.',
        infoBtnSystems: 'SYSTEMS',
        infoBtnModes: 'MODES',
        infoBtnAmmo: 'CORE AMMO',
        infoBtnPvp: 'PVP LOADOUT',
        infoBtnBoss: 'BOSS & PHASES',
        infoBtnEconomy: 'ECONOMY',
        infoBtnProgress: 'PROGRESSION',
        infoBtnControls: 'CONTROLS',
        infoPaneSystemsTitle: 'Tank Systems',
        infoPaneSystemsBody: 'Warrior: balanced offense/defense. Speed: high mobility. Engineer: turret setup, sustain, and control. Juggernaut: frontline tank engage. Mage: long-range skill combos. Assassin: burst flanker, unlock at wave 20.',
        infoPaneModesTitle: 'Game Modes',
        infoPaneModesBody: '1P Hard: full manual aiming and shooting. 1P Easy: auto-aim/auto-shoot for onboarding. 2P Bot: co-op with P2 bot. 2P PvP: head-to-head with ammo + counter-item pick before rounds.',
        infoPaneAmmoTitle: 'Core Ammo',
        infoPaneAmmoBody: 'Normal: all-rounder. Fire: damage-over-time pressure. Lightning: chain hits, strong versus packs. Piercing: sniper-style pierce shots. Homing: better hit consistency on moving targets. Stun: control utility. Rocket: AoE burst, strongest in late waves.',
        infoPanePvpTitle: 'PvP Loadout',
        infoPanePvpBody: 'Each side picks 1 PvP ammo + 3 items. Examples: AP-40 for armor break, Jammer for skill tempo denial, Cryo for slows. Items cover anti-pierce, burst mitigation, anti-clone/turret, and cooldown disruption. Build around enemy system.',
        infoPaneBossTitle: 'Boss & Phases',
        infoPaneBossBody: 'Boss uses 3 phases with pattern shifts by HP thresholds. There are armor-open weak-point windows for burst damage. Zone shrink adds positional pressure, so keep at least one escape skill available.',
        infoPaneEconomyTitle: 'Match Economy',
        infoPaneEconomyBody: 'Gold is spent in between-wave shop: HP, Damage, Fire Rate, Speed, Magnet, Armor. Meta Gold is spent outside matches on permanent Blessings (1P/2P Bot). Match Gold and Meta Gold are separate pools.',
        infoPaneProgressTitle: 'Progress & Save',
        infoPaneProgressBody: 'Best Score/Best Wave are shown in Settings. Auto-save can be toggled. Save data is signature-protected, and tampered files are ignored for runtime safety.',
        infoPaneControlsTitle: 'Quick Controls',
        infoPaneControlsBody: 'WASD to move. Hard: mouse aim+shoot, Q/E/R skills. Easy/2P Bot: J/K/L skills with auto-aim and auto-shoot. P pauses, Esc opens settings. In PvP, read counter hints before entering rounds.',
        newGame: 'NEW GAME',
        bestScore: 'Best Score',
        bestWave: 'Best Wave'
      },
      mode: {
        noteHard: 'Hard 1P: mouse aim + click to shoot.',
        noteEasy: 'Easy 1P: auto-aim + auto-shoot.',
        noteCoop: '2P Bot: co-op mode, auto-aim + auto-shoot.',
        notePvp: '2P PvP: enter match first, then pick ammo + items in PvP Shop.'
      },
      settings: {
        title: 'SETTINGS',
        close: 'CLOSE',
        sectionCoreTitle: 'Core Controls',
        sectionGameplayTitle: 'Gameplay',
        infoTitle: 'Detailed Info',
        language: 'Language',
        languageVi: 'Vietnamese',
        languageEn: 'English',
        volume: 'Master Volume',
        musicVolume: 'Music Volume',
        fpsCap: 'FPS cap',
        gameCode: 'Settings Code',
        gameCodeHint: 'No code yet',
        gameCodePlaceholder: 'Enter settings code (not active yet)...',
        shake: 'Screen shake',
        minimap: 'Minimap',
        fpsCounter: 'FPS Counter',
        autoSave: 'Auto Save',
        aimAssist: 'Aim Assist',
        progress: 'PROGRESS',
        save: 'SAVE',
        resetSave: 'RESET SAVE',
        infoModeLabel: 'Modes:',
        infoModeValue: '1P Hard uses mouse aim+shoot, Easy/2P Bot use auto-aim.',
        infoAimLabel: 'Aim Assist:',
        infoAimValue: 'Easy 55%, 2P Bot 30%, PvP can be toggled in settings.',
        infoShopLabel: 'Wave Shop:',
        infoShopValue: '1P/2P Bot buy upgrades with Gold after each wave.',
        infoUnlockLabel: 'Assassin Unlock:',
        infoUnlockValue: 'Clear wave 20 for permanent unlock.',
        infoSaveLabel: 'Save Data:',
        infoSaveValue: 'Autosave is signed; tampered files are ignored.',
        infoMetaLabel: 'Meta Gold:',
        infoMetaValue: 'Used for permanent Blessings (does not apply in PvP).',
        infoVersionLabel: 'Version:',
        infoVersionValue: 'Tank Battle 2D - Runtime Split Build.',
        hotkeys: 'Hotkeys: P Pause/Resume, Esc Settings, M Minimap, F FPS.'
      },
      welcome: {
        title: 'Have fun playing!',
        line1: 'Before entering the system menu, get ready for a serious grind.',
        line2: '<b>Quick tip:</b> Hard uses mouse aim/shoot - Easy/2P uses auto-aim and auto-shoot.',
        line3: '<b>Support contact:</b> <a href=\"https://www.facebook.com/lvmedits\" target=\"_blank\" rel=\"noopener\">Cuong dep trai</a>',
        hint: 'Press the button to continue',
        button: 'Ok Cuong dep trai'
      },
      pvp: {
        loadTitle: 'PvP SHOP - Pick Ammo & Items',
        loadSub: 'Each side picks 1 PvP ammo and 3 different items. Stats are shown for new players.',
        loadHint: 'This build applies to PvP only.',
        ammo: 'PvP Ammo',
        item1: 'Item 1',
        item2: 'Item 2',
        item3: 'Item 3',
        reset: 'Default',
        confirm: 'Enter Match',
        noAmmoData: 'No ammo data.',
        noItemData: 'No item data.',
        itemLabel: 'Item',
        counterTitle: 'Counter hint vs {system}',
        counterAmmo: 'Suggested ammo:',
        counterItems: 'Suggested items:',
        counterFallbackSystem: 'enemy',
        counterFallbackReason: 'Safe beginner setup with balanced damage and survivability.'
      },
      blessing: {
        title: 'BLESSINGS',
        close: 'Close',
        reset: 'Reset Blessings',
        hint: 'Permanent upgrades apply only to 1P and 2P Bot.',
        shopTabBlessings: 'BLESSINGS',
        shopTabSkins: 'SKINS',
        metaGold: 'Meta Gold',
        buy: 'Buy',
        maxed: 'Max',
        level: 'Level {level}/{max}',
        cost: 'Cost: {cost}',
        costMax: 'Maxed',
        ownedBonus: 'Effect: {value}',
        notEnough: 'Not enough Meta Gold.',
        buySuccess: 'Upgraded {name} to level {level}.',
        resetConfirm: 'Reset all Blessings and refund {refund}% spent gold?',
        resetDone: 'Blessings reset complete.',
        nodeHpName: 'Vitality',
        nodeHpDesc: '+{value}% base HP per level.',
        nodeArmorName: 'Base Armor',
        nodeArmorDesc: '+{value}% base armor per level.',
        nodeDamageName: 'Firepower',
        nodeDamageDesc: '+{value}% damage per level.',
        nodeFireRateName: 'Fire Rhythm',
        nodeFireRateDesc: '+{value}% fire rate per level.',
        nodeGoldGainName: 'Harvest',
        nodeGoldGainDesc: '+{value}% gold pickup per level.',
        nodeUltiGainName: 'Ultimate Charge',
        nodeUltiGainDesc: '+{value}% ultimate charge gain per level.',
        skinsTitle: 'SYSTEM SKINS',
        skinsOwned: 'Owned {owned}/{total}',
        skinFree: 'Free',
        skinCost: '{cost} Gold',
        skinBuy: 'Buy',
        skinEquip: 'Equip',
        skinEquipped: 'Equipped',
        skinNotEnough: 'Not enough Meta Gold to buy this skin.',
        skinBuySuccess: 'Purchased skin {name}.',
        skinEquipSuccess: 'Equipped skin {name}.',
        skinRarityBase: 'Base',
        skinRarityRare: 'Rare',
        skinRarityEpic: 'Epic',
        skinImageLabel: 'Image',
        skinPreviewLabel: 'Preview',
        rewardLine: 'Meta Gold +{earn} (Total: {total})'
      },
      assassin: {
        title: 'ASSASSIN',
        lockText: 'Win Wave 20 to unlock.',
        close: 'Close',
        unlockedWave20: 'Unlocked by wave >= 20',
        unlockedCode: 'Unlocked by code',
        unlockOk: 'OK (Unlocked)'
      },
      skill: {
        duration: 'Duration',
        cooldown: 'Cooldown',
        range: 'Range',
        defaultR: 'Leech {leech}% dealt damage - up to {cap} HP/s - reduce incoming damage by {dr}%',
        speedQ: 'During dash: invulnerable - no weapon drop',
        assassinQ: '{range} - 3 slashes - Can return',
        assassinE: '{range} - 3 targets - 2 slashes/target',
        assassinR: '{range} - 10 blinks - Up to 3 hits/target'
      }
    }
  };

  const SYSTEM_TEXTS = {
    default: {
      vi: { name: 'Chiến Binh', desc: 'Phân thân - Tàng hình - Hút máu', tagline: 'Bền bỉ - tự hồi phục theo damage (R)' },
      en: { name: 'Warrior', desc: 'Clone - Stealth - Lifesteal', tagline: 'Durable - sustain from damage (R)' }
    },
    speed: {
      vi: { name: 'Tốc Độ', desc: 'Lướt - Miễn thương - Cường tốc', tagline: 'Cơ động - lướt liên tục - cường tốc' },
      en: { name: 'Speed', desc: 'Dash - Invuln - Adrenaline', tagline: 'Mobility - rapid dashes - overdrive' }
    },
    engineer: {
      vi: { name: 'Kỹ Sư', desc: 'Tháp pháo - Sửa chữa - Xung EMP', tagline: 'Công trình - tháp pháo - EMP' },
      en: { name: 'Engineer', desc: 'Turret - Repair - EMP Pulse', tagline: 'Structures - turret control - EMP' }
    },
    juggernaut: {
      vi: { name: 'Giáp Sắt', desc: 'Giáp phản - Cú húc - Pháo đài', tagline: 'Tanker - giáp phản vàng kim - pháo đài' },
      en: { name: 'Juggernaut', desc: 'Reflect Armor - Ram - Siege', tagline: 'Tank - reflective armor - siege mode' }
    },
    mage: {
      vi: { name: 'Pháp Sư', desc: 'Hỏa cầu - Dịch chuyển - Bão tuyết', tagline: 'Glass cannon - bão tuyết cuốn sạch' },
      en: { name: 'Mage', desc: 'Fireball - Blink - Blizzard', tagline: 'Glass cannon - sweeping blizzard' }
    },
    assassin: {
      vi: { name: 'Sát Thủ', desc: 'Ám Kích - Liên Hoàn - Thập Ảnh', tagline: 'Ẩn ảnh - kiếm thuật - sát thương bùng nổ' },
      en: { name: 'Assassin', desc: 'Ambush - Multi-slash - Shadow Storm', tagline: 'Stealth - blade art - burst damage' }
    }
  };

  function getRawLang(){
    try {
      const v = String(localStorage.getItem(STORAGE_KEY) || '').trim().toLowerCase();
      return (v === 'en' || v === 'vi') ? v : 'vi';
    } catch(e){ return 'vi'; }
  }
  let currentLang = getRawLang();

  function lookup(obj, key){
    const parts = String(key || '').split('.');
    let cur = obj;
    for (let i = 0; i < parts.length; i++) {
      if (!cur || typeof cur !== 'object' || !(parts[i] in cur)) return null;
      cur = cur[parts[i]];
    }
    return cur;
  }
  function fmt(str, vars){
    if (!vars || typeof vars !== 'object') return String(str);
    return String(str).replace(/\{([a-zA-Z0-9_]+)\}/g, (m, k) => {
      if (Object.prototype.hasOwnProperty.call(vars, k)) return String(vars[k]);
      return m;
    });
  }
  function t(key, vars){
    const byLang = TEXT[currentLang] || TEXT.vi;
    const val = lookup(byLang, key);
    if (val == null) {
      const fallback = lookup(TEXT.vi, key);
      return fmt((fallback == null ? key : fallback), vars);
    }
    return fmt(val, vars);
  }

  function setNodeText(sel, text){
    const el = document.querySelector(sel);
    if (el) el.textContent = text;
  }
  function setNodeHtml(sel, html){
    const el = document.querySelector(sel);
    if (el) el.innerHTML = html;
  }
  function setInputPlaceholder(id, text){
    const el = document.getElementById(id);
    if (el) el.setAttribute('placeholder', text);
  }
  function setSelectOptionText(selectId, value, text){
    const sel = document.getElementById(selectId);
    if (!sel) return;
    const opt = sel.querySelector('option[value="' + value + '"]');
    if (opt) opt.textContent = text;
  }
  function setSkillGuideTexts(){
    const keyNodes = document.querySelectorAll('.keyGuideWide .kg .key');
    if (keyNodes && keyNodes.length >= 6) {
      keyNodes[0].textContent = 'WASD';
      keyNodes[1].textContent = (currentLang === 'en') ? 'Mouse' : 'Chu\u1ed9t';
      keyNodes[2].textContent = '1-6';
      keyNodes[3].textContent = 'Q/E/R';
      keyNodes[4].textContent = 'P';
      keyNodes[5].textContent = 'ESC';
    }
    const nodes = document.querySelectorAll('.keyGuideWide .kg span:last-child');
    if (!nodes || nodes.length < 6) return;
    nodes[0].textContent = t('start.keyMove');
    nodes[1].textContent = t('start.keyAimShoot');
    nodes[2].textContent = t('start.keyWeapon');
    nodes[3].textContent = t('start.keySkill');
    nodes[4].textContent = t('start.keyPause');
    nodes[5].textContent = t('ui.settings');
  }
  const SYSTEM_IDS = ['default', 'speed', 'engineer', 'juggernaut', 'mage', 'assassin'];

  function applySystemListTexts(){
    for (let i = 0; i < SYSTEM_IDS.length; i++) {
      const sysId = SYSTEM_IDS[i];
      const pack = SYSTEM_TEXTS[sysId] || SYSTEM_TEXTS.default;
      const row = pack[currentLang] || pack.vi;
      const item = document.querySelector('#systemList .sysItem[data-sys="' + sysId + '"]');
      if (item) {
        const n = item.querySelector('.sysName');
        const d = item.querySelector('.sysDesc');
        if (n) n.textContent = row.name;
        if (d) d.textContent = row.desc;
      }
      setSelectOptionText('p2SystemSelect', sysId, row.name);
    }
  }
  const STATIC_TEXT_BINDINGS = [
    ['#btnSettings', 'ui.settingsEsc'],
    ['#btnPause', 'ui.pause'],
    ['#btnSaveQuit', 'ui.saveQuit'],
    ['#btnPvpReplay', 'ui.replayPvp'],
    ['#btnCloseSettings', 'settings.close'],
    ['#btnSaveNow', 'settings.save'],
    ['#btnResetSave', 'settings.resetSave'],
    ['#settingsSectionCoreTitle', 'settings.sectionCoreTitle'],
    ['#settingsSectionGameplayTitle', 'settings.sectionGameplayTitle'],
    ['#settingsInfoTitle', 'settings.infoTitle'],
    ['#settingsInfoModeLabel', 'settings.infoModeLabel'],
    ['#settingsInfoModeValue', 'settings.infoModeValue'],
    ['#settingsInfoAimLabel', 'settings.infoAimLabel'],
    ['#settingsInfoAimValue', 'settings.infoAimValue'],
    ['#settingsInfoShopLabel', 'settings.infoShopLabel'],
    ['#settingsInfoShopValue', 'settings.infoShopValue'],
    ['#settingsInfoUnlockLabel', 'settings.infoUnlockLabel'],
    ['#settingsInfoUnlockValue', 'settings.infoUnlockValue'],
    ['#settingsInfoSaveLabel', 'settings.infoSaveLabel'],
    ['#settingsInfoSaveValue', 'settings.infoSaveValue'],
    ['#settingsInfoMetaLabel', 'settings.infoMetaLabel'],
    ['#settingsInfoMetaValue', 'settings.infoMetaValue'],
    ['#settingsInfoVersionLabel', 'settings.infoVersionLabel'],
    ['#settingsInfoVersionValue', 'settings.infoVersionValue'],
    ['#welcomeCard h2', 'welcome.title'],
    ['#welcomeCard p:nth-of-type(1)', 'welcome.line1'],
    ['#welcomeHint', 'welcome.hint'],
    ['#welcomeContinueBtn', 'welcome.button'],
    ['.startSubtitle', 'start.subtitle'],
    ['.startHints .hintLine:nth-child(1)', 'start.hintUpgrade'],
    ['.startHints .hintLine:nth-child(2)', 'start.hintAmmo'],
    ['.startHints .hintLine:nth-child(3)', 'start.hintBoss'],
    ['.startLeft .panelTitle', 'start.chooseSystem'],
    ['.startRight .previewWrap .panelTitle', 'start.preview'],
    ['.startRight .skillsWrap .panelTitle', 'start.skillBoard'],
    ['.leftFootNote', 'start.tip'],
    ['#modeBox .modeTitle', 'start.modeTitle'],
    ['#modeBox .modeRow .modeLabel', 'start.modePlayers'],
    ['#p2SystemRow .modeLabel', 'start.modeP2System'],
    ['#pvpLoadoutHint', 'start.pvpBuildHint'],
    ['#zoneGameTitle', 'start.zoneGameTitle'],
    ['#zoneGameDesc', 'start.zoneGameDesc'],
    ['#zoneShopTitle', 'start.zoneShopTitle'],
    ['#zoneShopDesc', 'start.zoneShopDesc'],
    ['#zoneSettingsTitle', 'start.zoneSettingsTitle'],
    ['#zoneSettingsDesc', 'start.zoneSettingsDesc'],
    ['#zoneDisplayTitle', 'start.zoneDisplayTitle'],
    ['#zoneDisplayDesc', 'start.zoneDisplayDesc'],
    ['#shopViewTitle', 'start.shopViewTitle'],
    ['#shopViewDesc', 'start.shopViewDesc'],
    ['#shopViewNote', 'start.shopViewNote'],
    ['#settingsViewTitle', 'start.settingsViewTitle'],
    ['#settingsViewDesc', 'start.settingsViewDesc'],
    ['#guideViewTitle', 'start.guideViewTitle'],
    ['#guideViewDesc', 'start.guideViewDesc'],
    ['#infoBtnSystems', 'start.infoBtnSystems'],
    ['#infoBtnModes', 'start.infoBtnModes'],
    ['#infoBtnAmmo', 'start.infoBtnAmmo'],
    ['#infoBtnPvp', 'start.infoBtnPvp'],
    ['#infoBtnBoss', 'start.infoBtnBoss'],
    ['#infoBtnEconomy', 'start.infoBtnEconomy'],
    ['#infoBtnProgress', 'start.infoBtnProgress'],
    ['#infoBtnControls', 'start.infoBtnControls'],
    ['#infoPaneSystemsTitle', 'start.infoPaneSystemsTitle'],
    ['#infoPaneSystemsBody', 'start.infoPaneSystemsBody'],
    ['#infoPaneModesTitle', 'start.infoPaneModesTitle'],
    ['#infoPaneModesBody', 'start.infoPaneModesBody'],
    ['#infoPaneAmmoTitle', 'start.infoPaneAmmoTitle'],
    ['#infoPaneAmmoBody', 'start.infoPaneAmmoBody'],
    ['#infoPanePvpTitle', 'start.infoPanePvpTitle'],
    ['#infoPanePvpBody', 'start.infoPanePvpBody'],
    ['#infoPaneBossTitle', 'start.infoPaneBossTitle'],
    ['#infoPaneBossBody', 'start.infoPaneBossBody'],
    ['#infoPaneEconomyTitle', 'start.infoPaneEconomyTitle'],
    ['#infoPaneEconomyBody', 'start.infoPaneEconomyBody'],
    ['#infoPaneProgressTitle', 'start.infoPaneProgressTitle'],
    ['#infoPaneProgressBody', 'start.infoPaneProgressBody'],
    ['#infoPaneControlsTitle', 'start.infoPaneControlsTitle'],
    ['#infoPaneControlsBody', 'start.infoPaneControlsBody'],
    ['#startBtn', 'start.deploy'],
    ['#clearSaveBtn', 'start.clearSave'],
    ['#blessingModalTitle', 'blessing.title'],
    ['#blessingMetaGoldLabel', 'blessing.metaGold'],
    ['#btnBlessingClose', 'blessing.close'],
    ['#btnBlessingReset', 'blessing.reset'],
    ['#blessingHintText', 'blessing.hint'],
    ['#assassinLockPanel h3', 'assassin.title'],
    ['#assassinLockText', 'assassin.lockText'],
    ['#assassinUnlockClose', 'assassin.close'],
    ['#setLanguageLabel', 'settings.language'],
    ['#setGameCodeHint', 'settings.gameCodeHint'],
    ['.pvpLoadTitleMain', 'pvp.loadTitle'],
    ['.pvpLoadSub', 'pvp.loadSub'],
    ['.pvpLoadRoundHint', 'pvp.loadHint'],
    ['#pvpLiveReset', 'pvp.reset'],
    ['#pvpLiveConfirm', 'pvp.confirm']
  ];

  const STATIC_HTML_BINDINGS = [
    ['#welcomeCard p:nth-of-type(2)', 'welcome.line2'],
    ['#welcomeCard p:nth-of-type(3)', 'welcome.line3']
  ];

  const STATIC_PLACEHOLDER_BINDINGS = [
    ['setGameCodeInput', 'settings.gameCodePlaceholder']
  ];
  const SETTINGS_INPUT_LABEL_BINDINGS = [
    ['setVolume', 'settings.volume'],
    ['setMusicVolume', 'settings.musicVolume'],
    ['setFpsCap', 'settings.fpsCap'],
    ['setGameCodeInput', 'settings.gameCode']
  ];
  const SETTINGS_CHECKBOX_BINDINGS = [
    ['setShake', 'settings.shake'],
    ['setMinimap', 'settings.minimap'],
    ['setFps', 'settings.fpsCounter'],
    ['setAutoSave', 'settings.autoSave'],
    ['setAimAssist', 'settings.aimAssist']
  ];
  const PVP_FIELD_LABEL_KEYS = ['pvp.ammo', 'pvp.item1', 'pvp.item2', 'pvp.item3'];

  function applyTextBindings(list){
    for (let i = 0; i < list.length; i++) {
      setNodeText(list[i][0], t(list[i][1]));
    }
  }
  function applyHtmlBindings(list){
    for (let i = 0; i < list.length; i++) {
      setNodeHtml(list[i][0], t(list[i][1]));
    }
  }
  function applyPlaceholderBindings(list){
    for (let i = 0; i < list.length; i++) {
      setInputPlaceholder(list[i][0], t(list[i][1]));
    }
  }
  function applyPvpFieldLabels(){
    const labels = document.querySelectorAll('#pvpLoadoutModal .pvpSideCard .pvpFieldLabel');
    if (!labels || labels.length === 0) return;
    for (let i = 0; i < labels.length; i++) {
      labels[i].textContent = t(PVP_FIELD_LABEL_KEYS[i % PVP_FIELD_LABEL_KEYS.length]);
    }
  }
  function applyContinueButtonText(){
    const continueBtn = document.getElementById('continueBtn');
    if (!continueBtn || continueBtn.classList.contains('hidden')) return;
    const m = String(continueBtn.textContent || '').match(/\(\s*WAVE\s*(\d+)\s*\)/i);
    if (m && m[1]) {
      continueBtn.textContent = t('start.continue') + ' (WAVE ' + m[1] + ')';
      return;
    }
    continueBtn.textContent = t('start.continue');
  }
  function applyLanguageSelector(){
    const sel = document.getElementById('setLanguage');
    if (!sel) return;
    const viOpt = sel.querySelector('option[value="vi"]');
    const enOpt = sel.querySelector('option[value="en"]');
    if (viOpt) viOpt.textContent = t('settings.languageVi');
    if (enOpt) enOpt.textContent = t('settings.languageEn');
    sel.value = currentLang;
  }

  function applyStaticTexts(){
    const setCheckboxLabel = (inputId, key) => {
      const inp = document.getElementById(inputId);
      if (!inp || !inp.parentElement) return;
      const parent = inp.parentElement;
      let textNode = null;
      for (let i = 0; i < parent.childNodes.length; i++) {
        const n = parent.childNodes[i];
        if (n && n.nodeType === 3) { textNode = n; break; }
      }
      const txt = ' ' + t(key);
      if (textNode) textNode.nodeValue = txt;
      else parent.appendChild(document.createTextNode(txt));
    };
    const setLabelByInput = (inputId, key) => {
      const inp = document.getElementById(inputId);
      if (!inp || !inp.parentElement) return;
      const lbl = inp.parentElement.firstElementChild;
      if (lbl) lbl.textContent = t(key);
    };

    document.documentElement.setAttribute('lang', currentLang);
    applyTextBindings(STATIC_TEXT_BINDINGS);
    applyHtmlBindings(STATIC_HTML_BINDINGS);
    applyPlaceholderBindings(STATIC_PLACEHOLDER_BINDINGS);

    const setTitle = document.querySelector('#settingsModal .settings-title') || document.querySelector('#startSettingsInlineHost .settings-title');
    if (setTitle) setTitle.textContent = t('settings.title');
    for (let i = 0; i < SETTINGS_INPUT_LABEL_BINDINGS.length; i++) {
      setLabelByInput(SETTINGS_INPUT_LABEL_BINDINGS[i][0], SETTINGS_INPUT_LABEL_BINDINGS[i][1]);
    }
    for (let i = 0; i < SETTINGS_CHECKBOX_BINDINGS.length; i++) {
      setCheckboxLabel(SETTINGS_CHECKBOX_BINDINGS[i][0], SETTINGS_CHECKBOX_BINDINGS[i][1]);
    }
    const bestScoreEl = document.getElementById('bestScore');
    const bestWaveEl = document.getElementById('bestWave');
    if (bestScoreEl && bestScoreEl.parentNode && bestScoreEl.parentNode.firstChild) {
      bestScoreEl.parentNode.firstChild.nodeValue = t('start.bestScore') + ': ';
    }
    if (bestWaveEl && bestWaveEl.parentNode && bestWaveEl.parentNode.firstChild) {
      bestWaveEl.parentNode.firstChild.nodeValue = t('start.bestWave') + ': ';
    }
    const progTitle = document.querySelector('.settings-progress-title');
    if (progTitle) {
      progTitle.textContent = t('settings.progress');
    }
    const hotkeys = document.querySelector('#settingsModal .settings-hotkeys');
    if (hotkeys) hotkeys.textContent = t('settings.hotkeys');

    setSkillGuideTexts();
    applyLanguageSelector();
    applyPvpFieldLabels();
    applySystemListTexts();
    applyContinueButtonText();
  }

  function emitLanguageChange(){
    try { window.dispatchEvent(new CustomEvent('tank:langchange', { detail: { lang: currentLang } })); } catch(e){}
  }
  function setLang(lang){
    const next = (String(lang || '').toLowerCase() === 'en') ? 'en' : 'vi';
    if (next === currentLang) return;
    currentLang = next;
    try { localStorage.setItem(STORAGE_KEY, currentLang); } catch(e){}
    applyStaticTexts();
    emitLanguageChange();
  }
  function lang(){ return currentLang; }
  function systemText(id){
    const pack = SYSTEM_TEXTS[id] || SYSTEM_TEXTS.default;
    return pack[currentLang] || pack.vi;
  }

  window.I18N = {
    __ready: true,
    lang,
    setLang,
    t,
    apply: applyStaticTexts,
    systemText
  };
  window.t = t;

  function init(){
    applyStaticTexts();
    const langSel = document.getElementById('setLanguage');
    if (langSel && !langSel.__boundI18N) {
      langSel.__boundI18N = true;
      langSel.addEventListener('change', () => setLang(langSel.value));
    }
    emitLanguageChange();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else setTimeout(init, 0);
})();

