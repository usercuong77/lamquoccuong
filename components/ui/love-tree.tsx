"use client";

import { motion } from "framer-motion";

type LoveTreeProps = {
  locale: string;
};

export function LoveTree({ locale }: LoveTreeProps) {
  const language = encodeURIComponent(locale === "en" ? "en" : "vi");

  return (
    <motion.div
      className="love-tree-stage love-tree-legacy-stage"
      initial={{ opacity: 0, scale: 0.96 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <iframe
        className="love-tree-iframe"
        src={`/love-tree/index.html?lang=${language}`}
        title={locale === "en" ? "Interactive heart tree" : "Cây trái tim tương tác"}
        loading="lazy"
      />
    </motion.div>
  );
}
