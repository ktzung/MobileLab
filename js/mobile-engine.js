/* MobileLab engine — bố cục, pin, ngoại tuyến; kết quả tất định */
window.MOB_ENGINE = (function () {
  const r1 = (n) => Math.round(n * 10) / 10;
  const fmt = (n) => Number(n).toLocaleString("vi-VN", { maximumFractionDigits: 1 });

  function layout(v) {
    const width = Number(v.widthDp);
    const gutter = Number(v.gutter);
    const cols = Math.max(1, Number(v.cols));
    const contentDp = width - 2 * gutter;
    const cellDp = r1(contentDp / cols);
    const fits = cellDp >= 48 ? 1 : 0;
    return {
      ok: !!fits,
      verdict: fits ? "Ô chạm đạt" : "Ô chạm quá nhỏ",
      meta: `Mỗi ô ${cellDp} dp trên ${cols} cột`,
      statusText: fits ? `${cellDp} dp · đạt mốc 48 dp` : `${cellDp} dp · dưới mốc 48 dp`,
      tags: ["Bố cục", `${cols} cột`, `lề ${gutter} dp`],
      trace: [
        { step: "content", label: "Bề rộng nội dung", result: "ok", note: `${width} − 2 × ${gutter} = ${contentDp} dp` },
        { step: "cell", label: "Chia cột", result: "ok", note: `${contentDp} ÷ ${cols} = ${cellDp} dp` },
        { step: "check", label: "So mốc 48 dp", result: fits ? "ok" : "warn", note: fits ? "Ô chạm đủ lớn để bấm chính xác" : "Ô chạm nhỏ hơn khuyến nghị, dễ bấm nhầm" },
        { step: "verdict", label: "Kết luận", result: fits ? "ok" : "fail", note: fits ? "Bố cục dùng được trên điện thoại" : "Giảm số cột hoặc tăng bề rộng thiết bị" }
      ],
      payloadTitle: "Chi tiết phép tính",
      payload: {
        "bề rộng màn hình": `${width} dp`,
        "lề hai bên": `${gutter} dp`,
        "bề rộng nội dung": `${contentDp} dp`,
        "số cột": `${cols}`,
        "ô chạm": `${cellDp} dp`
      },
      metrics: [
        { label: "Ô chạm", value: `${cellDp} dp` },
        { label: "Nội dung", value: `${contentDp} dp` },
        { label: "Số cột", value: `${cols}` },
        { label: "Kết luận", value: fits ? "đạt" : "quá nhỏ" }
      ],
      values: { contentDp, cellDp, cols, fits }
    };
  }

  function battery(v) {
    const capacity = Number(v.capacity);
    const drain = Math.max(1, Number(v.drain));
    const reserve = Number(v.reserve);
    const usable = (capacity * (100 - reserve)) / 100;
    const hours = r1(usable / drain);
    const ok = hours >= 8 ? 1 : 0;
    return {
      ok: !!ok,
      verdict: ok ? "Đủ một ngày" : "Chưa đủ một ngày",
      meta: `${hours} giờ với dòng xả ${fmt(drain)} mA`,
      statusText: ok ? `${hours} giờ · đạt mốc 8 giờ` : `${hours} giờ · dưới mốc 8 giờ`,
      tags: ["Pin", `${fmt(capacity)} mAh`, `dự phòng ${reserve}%`],
      trace: [
        { step: "usable", label: "Dung lượng dùng được", result: "ok", note: `${fmt(capacity)} mAh × ${100 - reserve}% = ${fmt(r1(usable))} mAh` },
        { step: "drain", label: "Dòng xả", result: "ok", note: `Trung bình ${fmt(drain)} mA` },
        { step: "hours", label: "Thời lượng", result: ok ? "ok" : "warn", note: `${fmt(r1(usable))} ÷ ${fmt(drain)} = ${hours} giờ` },
        { step: "verdict", label: "Kết luận", result: ok ? "ok" : "fail", note: ok ? "Dùng thoải mái một ngày làm việc" : "Cần giảm dòng xả hoặc tăng dung lượng" }
      ],
      payloadTitle: "Chi tiết phép tính",
      payload: {
        "dung lượng": `${fmt(capacity)} mAh`,
        "mức dự phòng": `${reserve}%`,
        "dung lượng dùng": `${fmt(r1(usable))} mAh`,
        "dòng xả": `${fmt(drain)} mA`,
        "thời lượng": `${hours} giờ`
      },
      metrics: [
        { label: "Thời lượng", value: `${hours} giờ` },
        { label: "Dung lượng dùng", value: `${fmt(r1(usable))} mAh` },
        { label: "Dòng xả", value: `${fmt(drain)} mA` },
        { label: "Kết luận", value: ok ? "đủ" : "thiếu" }
      ],
      values: { hours, reservePct: 100 - reserve, ok }
    };
  }

  function offline(v) {
    const requests = Number(v.requests);
    const pct = Number(v.cachedPct);
    const batch = Math.max(1, Number(v.batch));
    const cacheHits = Math.round((requests * pct) / 100);
    const misses = requests - cacheHits;
    const syncBatches = Math.ceil(misses / batch);
    const ok = pct >= 80 ? 1 : 0;
    return {
      ok: !!ok,
      verdict: ok ? "Đệm đủ dùng" : "Đệm quá mỏng",
      meta: `${fmt(cacheHits)} yêu cầu từ đệm, ${syncBatches} lô đồng bộ`,
      statusText: ok ? `Đệm ${pct}% · đạt mốc 80%` : `Đệm ${pct}% · dưới mốc 80%`,
      tags: ["Ngoại tuyến", `${fmt(requests)} yêu cầu`, `đệm ${pct}%`],
      trace: [
        { step: "hits", label: "Yêu cầu từ đệm", result: "ok", note: `${fmt(requests)} × ${pct}% = ${fmt(cacheHits)} yêu cầu` },
        { step: "misses", label: "Yêu cầu ra mạng", result: "ok", note: `${fmt(requests)} − ${fmt(cacheHits)} = ${fmt(misses)} yêu cầu` },
        { step: "batch", label: "Chia lô đồng bộ", result: "ok", note: `${fmt(misses)} ÷ ${fmt(batch)} làm tròn lên = ${syncBatches} lô` },
        { step: "verdict", label: "Kết luận", result: ok ? "ok" : "fail", note: ok ? "Đệm đủ để dùng khi mất mạng" : "Cần tăng tỉ lệ đệm lên ít nhất 80%" }
      ],
      payloadTitle: "Chi tiết phép tính",
      payload: {
        "tổng yêu cầu": fmt(requests),
        "tỉ lệ đệm": `${pct}%`,
        "trúng đệm": fmt(cacheHits),
        "ra mạng": fmt(misses),
        "lô đồng bộ": `${syncBatches}`
      },
      metrics: [
        { label: "Trúng đệm", value: fmt(cacheHits) },
        { label: "Ra mạng", value: fmt(misses) },
        { label: "Lô đồng bộ", value: `${syncBatches}` },
        { label: "Kết luận", value: ok ? "đủ" : "mỏng" }
      ],
      values: { cacheHits, misses, syncBatches, ok }
    };
  }

  const runners = { layout, battery, offline };

  function run(kind, values) {
    const fn = runners[kind];
    if (!fn) return { ok: false, verdict: "Không rõ", meta: "", statusText: "Không rõ", tags: [], trace: [], payload: {}, metrics: [], values: {} };
    return fn(values || {});
  }

  return {
    run,
    kinds: Object.keys(runners),
    labels: { layout: "Bố cục", battery: "Pin", offline: "Ngoại tuyến" }
  };
})();
