"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type LoveTreeProps = {
  locale: string;
  fairyNight: boolean;
};

type TreeAction = "water" | "magic" | "mode";

function WaterIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <path d="M11 9h21c5 0 7 4 6 9l-5 23a6 6 0 0 1-6 5H13a7 7 0 0 1-7-7V16a7 7 0 0 1 5-7Z" fill="#A0DDF3" stroke="currentColor" strokeWidth="2" />
      <path d="M28 13c6-8 13-6 13 0v6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M7 12c7-4 17-4 27-2" stroke="#689BB4" strokeWidth="1.5" opacity=".8" />
    </svg>
  );
}

export function LoveTree({ locale, fairyNight }: LoveTreeProps) {
  const language = encodeURIComponent(locale === "en" ? "en" : "vi");
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [frameHeight, setFrameHeight] = useState<number>();
  const copy = locale === "en"
    ? {
        awaken: "AWAKEN THE TREE",
        water: "WATER IT ♡",
        magic: "MAGIC",
        night: "FAIRY NIGHT",
        morning: "GOLDEN MORNING",
        dayNote: "A gentle morning — every heart is a flower ✦",
        nightNote: "Night falls, and wishes begin to glow ✨",
      }
    : {
        awaken: "ĐÁNH THỨC CÂY",
        water: "TƯỚI NƯỚC ♡",
        magic: "DIỆU KỲ",
        night: "ĐÊM CỔ TÍCH",
        morning: "NẮNG BAN MAI",
        dayNote: "Nắng ban mai dịu ngọt — mỗi cánh tim là một sắc hoa ✦",
        nightNote: "Đêm xuống, những điều ước tỏa sáng lấp lánh ✨",
      };
  const syncTheme = useCallback(() => {
    iframeRef.current?.contentWindow?.postMessage(
      { type: "heart-tree-parent-theme", night: fairyNight },
      window.location.origin,
    );
  }, [fairyNight]);
  const sendAction = useCallback((action: TreeAction) => {
    iframeRef.current?.contentWindow?.postMessage(
      { type: "heart-tree-action", action },
      window.location.origin,
    );
  }, []);

  useEffect(() => {
    syncTheme();
  }, [syncTheme]);

  useEffect(() => {
    const handleTreeMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin || event.source !== iframeRef.current?.contentWindow) return;
      if (event.data?.type !== "heart-tree-height") return;
      const height = Number(event.data.height);
      if (Number.isFinite(height) && height > 0) setFrameHeight(Math.ceil(height));
    };

    window.addEventListener("message", handleTreeMessage);
    return () => window.removeEventListener("message", handleTreeMessage);
  }, []);

  return (
    <div className="love-tree-stage love-tree-legacy-stage">
      <iframe
        ref={iframeRef}
        className="love-tree-iframe"
        src={`/love-tree/index.html?embed=stage&lang=${language}&v=stage-only-20261009`}
        title={locale === "en" ? "Interactive heart tree" : "Cây trái tim tương tác"}
        loading="lazy"
        allowTransparency
        onLoad={syncTheme}
        style={frameHeight ? { height: `${frameHeight}px` } : undefined}
      />
      <div className="love-tree-external-controls" role="group" aria-label={locale === "en" ? "Heart tree controls" : "Điều khiển cây trái tim"}>
        <button className="love-tree-control love-tree-water-control" type="button" onClick={() => sendAction("water")}>
          <WaterIcon />
          <span><small>{copy.awaken}</small><strong>{copy.water}</strong></span>
        </button>
        <button className="love-tree-control love-tree-magic-control" type="button" onClick={() => sendAction("magic")}>✧ &nbsp; {copy.magic}</button>
        <button className="love-tree-control love-tree-mode-control" type="button" onClick={() => sendAction("mode")}>{fairyNight ? "☀" : "☾"} &nbsp; {fairyNight ? copy.morning : copy.night}</button>
      </div>
      <p className="love-tree-external-note">{fairyNight ? copy.nightNote : copy.dayNote}</p>
    </div>
  );
}
