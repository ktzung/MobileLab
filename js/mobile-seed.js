/* MobileLab — dữ liệu mô phỏng bố cục, pin và chế độ offline */
window.MOB_SEED = {
  lab: {
    heading: "Ba ràng buộc của ứng dụng di động",
    intro: "Tính kích thước ô chạm theo chiều rộng màn hình, ước lượng thời lượng pin theo mức tiêu hao và đo số yêu cầu được phục vụ từ bộ nhớ đệm khi mất mạng. Engine viết tay, kết quả tất định để đối chiếu từng nhiệm vụ.",
    tabs: [
      {
        id: "layout",
        label: "Bố cục",
        title: "Ô chạm trên lưới",
        badge: "dp",
        runLabel: "Tính ô chạm",
        hint: "Vùng nội dung = chiều rộng màn hình trừ hai lề. Mỗi ô rộng bằng vùng nội dung chia số cột. Ô dưới 48 dp là quá nhỏ để chạm chính xác.",
        fields: [
          { id: "widthDp", label: "Chiều rộng màn hình (dp)", type: "number", min: 280, max: 600, step: 10, value: 360 },
          { id: "gutter", label: "Lề hai bên (dp)", type: "number", min: 8, max: 32, step: 4, value: 16 },
          { id: "cols", label: "Số cột", type: "number", min: 2, max: 8, step: 1, value: 4 }
        ]
      },
      {
        id: "battery",
        label: "Pin",
        title: "Thời lượng còn lại",
        badge: "giờ",
        runLabel: "Ước lượng pin",
        hint: "Giờ dùng = dung lượng × (1 − dự phòng) ÷ mức tiêu hao. Giữ 20% dự phòng; dưới 8 giờ là chưa đủ một ngày làm việc.",
        fields: [
          { id: "capacity", label: "Dung lượng pin (mAh)", type: "number", min: 2000, max: 8000, step: 100, value: 4000 },
          { id: "drain", label: "Tiêu hao (mA)", type: "number", min: 100, max: 2000, step: 50, value: 500 },
          { id: "reserve", label: "Dự phòng (%)", type: "number", min: 0, max: 40, step: 5, value: 20 }
        ]
      },
      {
        id: "offline",
        label: "Ngoại tuyến",
        title: "Bộ nhớ đệm",
        badge: "cache",
        runLabel: "Đo phục vụ offline",
        hint: "Yêu cầu phục vụ từ đệm = tổng yêu cầu × tỉ lệ đã lưu. Phần còn lại phải đồng bộ theo lô; đệm từ 80% mới coi là dùng offline được.",
        fields: [
          { id: "requests", label: "Yêu cầu mỗi ngày", type: "number", min: 100, max: 5000, step: 50, value: 500 },
          { id: "cachedPct", label: "Đã lưu đệm (%)", type: "number", min: 0, max: 95, step: 5, value: 80 },
          { id: "batch", label: "Lô đồng bộ (mục)", type: "number", min: 10, max: 200, step: 10, value: 50 }
        ]
      }
    ],
    defaults: {
      layout: { widthDp: 360, gutter: 16, cols: 4 },
      battery: { capacity: 4000, drain: 500, reserve: 20 },
      offline: { requests: 500, cachedPct: 80, batch: 50 }
    },
    presets: {
      layout: [
        { id: "mob-layout-base", label: "360 dp, 4 cột", dataset: { widthDp: 360, gutter: 16, cols: 4 } },
        { id: "mob-layout-tight", label: "320 dp, 7 cột", dataset: { widthDp: 320, gutter: 16, cols: 7 } },
        { id: "mob-layout-wide", label: "Máy tính bảng 5 cột", dataset: { widthDp: 600, gutter: 24, cols: 5 } }
      ],
      battery: [
        { id: "mob-battery-base", label: "4.000 mAh, 500 mA", dataset: { capacity: 4000, drain: 500, reserve: 20 } },
        { id: "mob-battery-big", label: "6.000 mAh, đủ ngày", dataset: { capacity: 6000, drain: 500, reserve: 20 } },
        { id: "mob-battery-hot", label: "Tải nặng 900 mA", dataset: { capacity: 4000, drain: 900, reserve: 20 } }
      ],
      offline: [
        { id: "mob-off-base", label: "500 yêu cầu, đệm 80%", dataset: { requests: 500, cachedPct: 80, batch: 50 } },
        { id: "mob-off-thin", label: "Đệm mỏng 30%", dataset: { requests: 800, cachedPct: 30, batch: 50 } },
        { id: "mob-off-full", label: "Đệm gần đủ 95%", dataset: { requests: 1000, cachedPct: 95, batch: 20 } }
      ]
    },
    examples: [
      { id: "ex-layout", kind: "layout", label: "320 dp chia 7 cột có chạm được?", dataset: { widthDp: 320, gutter: 16, cols: 7 } },
      { id: "ex-battery", kind: "battery", label: "Pin 4.000 mAh, tải 900 mA", dataset: { capacity: 4000, drain: 900, reserve: 20 } },
      { id: "ex-offline", kind: "offline", label: "Mất mạng, còn 30% đệm", dataset: { requests: 800, cachedPct: 30, batch: 50 } }
    ],
    missions: [
      {
        id: "m-layout-cell",
        kind: "layout",
        title: "Ô chạm cơ bản",
        prompt: "Màn hình 360 dp, lề 16 dp mỗi bên, chia 4 cột. Ghi lại chiều rộng một ô (dp, 1 chữ số thập phân).",
        metric: "cellDp",
        expect: 82,
        hint: "Vùng nội dung 360 − 32 = 328; 328 ÷ 4 = 82 dp.",
        dataset: { widthDp: 360, gutter: 16, cols: 4 }
      },
      {
        id: "m-layout-tight",
        kind: "layout",
        title: "Bảy cột trên máy nhỏ",
        prompt: "Màn hình 320 dp, lề 16 dp, chia 7 cột. Engine phải kết luận ô chạm không đạt ngưỡng 48 dp.",
        metric: "fits",
        expect: 0,
        hint: "Vùng nội dung 288; 288 ÷ 7 ≈ 41,1 dp, dưới 48 dp.",
        dataset: { widthDp: 320, gutter: 16, cols: 7 }
      },
      {
        id: "m-battery-hours",
        kind: "battery",
        title: "Pin cơ bản",
        prompt: "Pin 4.000 mAh, tiêu hao 500 mA, giữ 20% dự phòng. Ghi lại số giờ dùng (1 chữ số thập phân).",
        metric: "hours",
        expect: 6.4,
        hint: "4.000 × 0,8 = 3.200 mAh; 3.200 ÷ 500 = 6,4 giờ.",
        dataset: { capacity: 4000, drain: 500, reserve: 20 }
      },
      {
        id: "m-battery-ok",
        kind: "battery",
        title: "Pin đủ một ngày",
        prompt: "Pin 6.000 mAh, tiêu hao 500 mA, dự phòng 20%. Engine phải kết luận đủ 8 giờ.",
        metric: "ok",
        expect: 1,
        hint: "6.000 × 0,8 ÷ 500 = 9,6 giờ, vượt ngưỡng 8 giờ.",
        dataset: { capacity: 6000, drain: 500, reserve: 20 }
      },
      {
        id: "m-offline-cache",
        kind: "offline",
        title: "Bao nhiêu yêu cầu từ đệm",
        prompt: "Mỗi ngày 500 yêu cầu, đã lưu đệm 80%. Ghi lại số yêu cầu phục vụ được khi mất mạng.",
        metric: "cacheHits",
        expect: 400,
        hint: "500 × 0,8 = 400 yêu cầu.",
        dataset: { requests: 500, cachedPct: 80, batch: 50 }
      },
      {
        id: "m-offline-batches",
        kind: "offline",
        title: "Số lô đồng bộ",
        prompt: "Vẫn 500 yêu cầu, đệm 80%, mỗi lô 50 mục. Ghi lại số lô phải đồng bộ phần còn thiếu.",
        metric: "syncBatches",
        expect: 2,
        hint: "Còn 100 yêu cầu chưa có đệm; 100 ÷ 50 = 2 lô.",
        dataset: { requests: 500, cachedPct: 80, batch: 50 }
      }
    ]
  }
};

window.MOB_SEED.home = {
  "title": "MobileLab — Ứng dụng di động, nhìn thấy từng bước",
  "eyebrow": "Khóa học tương tác · 12 bài · tiếng Việt",
  "h1": "Một màn hình nhỏ.<br><span class=\"hl\">Thấy</span> cả trải nghiệm.",
  "sub": "Đi từ bố cục, điều hướng, trạng thái đến pin, mạng, ngoại tuyến và phát hành. Mỗi bài là <strong>một sơ đồ sống</strong>, còn phòng mô phỏng tính ô chạm, thời lượng pin và mức phục vụ offline ngay trong trình duyệt — không cần cài đặt.",
  "note": "Không backend. Số liệu mô phỏng và tiến độ nằm trên máy bạn.",
  "startLabel": "Bắt đầu bài 01",
  "labLabel": "Mở phòng mô phỏng",
  "modesHead": "Bốn cách học, một màn hình nhỏ",
  "modesSub": "Không chỉ đọc hướng dẫn API. Bạn xem một màn hình đi từ bố cục, dữ liệu, mạng đến bản phát hành, kèm một ứng dụng cụ thể để đối chiếu.",
  "modes": [
    {
      "title": "Học bằng sơ đồ sống",
      "desc": "Từng thành phần giao diện, trạng thái và yêu cầu mạng hiện ra theo bước, kèm một ứng dụng đặt món cụ thể để đối chiếu.",
      "href": "#/learn",
      "icon": "process",
      "tone": "blue",
      "cta": "Vào lớp học"
    },
    {
      "title": "Luyện tập tình huống",
      "desc": "8 ca thường gặp: ô chạm quá nhỏ, pin tụt nhanh, mất mạng và dữ liệu cũ chưa đồng bộ.",
      "href": "#/practice",
      "icon": "star",
      "tone": "coral",
      "cta": "Bắt đầu luyện"
    },
    {
      "title": "Phòng mô phỏng",
      "desc": "Tính ô chạm theo lưới, ước lượng thời lượng pin và mức phục vụ ngoại tuyến, kèm 6 nhiệm vụ.",
      "href": "#/lab",
      "icon": "gateway",
      "tone": "violet",
      "cta": "Mở phòng mô phỏng"
    },
    {
      "title": "Cheatsheets",
      "desc": "Bảng kích thước, mẫu vòng đời, checklist pin và quy trình phát hành — tra nhanh khi làm bài.",
      "href": "#/cheatsheets",
      "icon": "file",
      "tone": "green",
      "cta": "Mở bảng tra"
    }
  ],
  "outlineHead": "Lộ trình 12 bài",
  "outlineSub": "Từ màn hình đầu tiên đến bản cập nhật: mỗi module trả lời một câu hỏi lớn của ứng dụng di động.",
  "faq": [
    {
      "q": "Đây có phải bộ công cụ làm app thật?",
      "a": "Không. Đây là mô phỏng viết tay cho khóa học: tính ô chạm, ước lượng pin và mức phục vụ ngoại tuyến. Đủ để thấy vì sao một bố cục hoặc cấu hình hao pin — không thay thế Android Studio, Xcode hay một thiết bị thật."
    },
    {
      "q": "Vì sao số liệu mẫu cố định?",
      "a": "Dữ liệu cố định để kết quả tất định và dễ đối chiếu: màn hình 360 dp, pin 4.000 mAh, 500 yêu cầu mỗi ngày. Nhờ vậy nhiệm vụ có đáp án kiểm chứng được, không phụ thuộc dữ liệu ngẫu nhiên."
    },
    {
      "q": "Có cần biết lập trình trước không?",
      "a": "Không bắt buộc. Bài học giải thích bằng sơ đồ và ví dụ; mẫu mã và bảng kích thước nằm ở cheatsheet để tra khi cần. Người đã quen một ngôn ngữ sẽ đi nhanh hơn ở phần trạng thái."
    },
    {
      "q": "Dùng trên điện thoại hoặc máy chiếu được không?",
      "a": "Được. Giao diện responsive, thanh bên chuyển thành drawer và sơ đồ cuộn ngang trên màn hình nhỏ. Bảng kết quả vẫn đọc được; nên xoay ngang khi xem nhiều cột."
    }
  ],
  "letter": "M",
  "brand": "MobileLab",
  "hero": {
    "bar": "mobile://app/home",
    "title": "bố cục · trạng thái · mạng · phát hành",
    "aria": "Màn hình ứng dụng đi từ bố cục qua trạng thái và mạng đến phát hành",
    "states": [
      {
        "label": "Cài đặt"
      },
      {
        "label": "Bố cục"
      },
      {
        "label": "Mạng"
      },
      {
        "label": "Phát hành"
      }
    ],
    "final": "OK",
    "queueSmall": "Kết quả",
    "queueChip": "82 dp",
    "queueVerdict": "đạt 48",
    "frames": [
      {
        "small": "Ô chạm",
        "b": "82 dp",
        "cls": "hit"
      },
      {
        "small": "Pin một ngày",
        "b": "6,4 giờ"
      },
      {
        "small": "Bảy cột",
        "b": "41 dp",
        "cls": "miss"
      }
    ]
  },
  "promo": {
    "eyebrow": "Phòng mô phỏng · chạy cục bộ",
    "h2": "Một màn hình.<br>Ba ràng buộc.",
    "p": "Tính chiều rộng ô chạm theo lưới, ước lượng thời lượng pin theo mức tiêu hao và đo số yêu cầu phục vụ được khi mất mạng. Sáu nhiệm vụ chấm điểm ngay trên kết quả, kèm gợi ý sửa từng bố cục yếu.",
    "cta": "Mở phòng mô phỏng",
    "nodes": [
      {
        "icon": "user",
        "label": "Người dùng",
        "sub": "một tay",
        "hot": true
      },
      {
        "icon": "code",
        "label": "Màn hình",
        "sub": "giao diện"
      },
      {
        "icon": "grid",
        "label": "Bố cục",
        "sub": "4 cột"
      },
      {
        "icon": "bolt",
        "label": "Pin",
        "sub": "6,4 giờ",
        "hot": true
      },
      {
        "icon": "signal",
        "label": "Mạng",
        "sub": "chập chờn"
      },
      {
        "icon": "check",
        "label": "Đồng bộ",
        "sub": "2 lô"
      },
      {
        "icon": "star",
        "label": "Phát hành",
        "sub": "bản cập nhật"
      }
    ]
  }
};
window.MOBILELAB = window.MOBILELAB || { modules: [], lessons: {}, practice: [], cheatsheets: [] };
window.MOBILELAB.home = window.MOB_SEED.home;

(function () {
  const D = window.MOBILELAB;
  if (!D) return;
  Object.values(D.lessons || {}).forEach((lesson) => {
    (lesson.steps || []).forEach((step) => {
      if (Array.isArray(step.metrics)) {
        const keyed = {};
        step.metrics.forEach((m) => { if (m && m.key != null) keyed[m.key] = m.value; });
        step.metrics = keyed;
      }
      if (Array.isArray(step.changes)) {
        step.changes = step.changes.map((c) => {
          if (!c || typeof c !== "object") return String(c);
          if (c.before && c.after) return c.label + ": " + c.before + " thành " + c.after;
          return String(c.label || c.after || "");
        });
      }
    });
  });
  (D.cheatsheets || []).forEach((sheet) => {
    (sheet.cards || []).forEach((card) => { if (!card.html && card.body) card.html = card.body; });
  });
})();

(function () {
  const D = window.MOBILELAB;
  if (!D) return;
  D.practice.push(
    {
      id: "mobile-practice-privacy",
      module: "tai-nguyen-va-mang",
      tag: "PRIVACY",
      title: "Xin quyền đúng lúc",
      scenario: "Ứng dụng ghi chú mở lần đầu đã xin quyền camera và vị trí, dù người dùng chỉ muốn gõ văn bản. Khảo sát cho thấy 38% người từ chối và rời ứng dụng. Nhóm muốn giữ tính năng chụp ảnh đính kèm nhưng giảm cảm giác bị làm phiền. Hãy chọn cách xin quyền hợp lý nhất.",
      metrics: [
        { label: "Quyền xin lúc mở", value: "2" },
        { label: "Tính năng dùng camera", value: "1" },
        { label: "Tỉ lệ từ chối", value: "38%" }
      ],
      options: [
        "Chỉ xin quyền camera khi người dùng bấm chụp ảnh, kèm một dòng giải thích mục đích",
        "Xin cả camera và vị trí ngay khi mở để tiện sau này",
        "Xin lại quyền sau mỗi lần người dùng mở ứng dụng",
        "Bỏ tính năng chụp ảnh để không phải xin quyền"
      ],
      correct: 0,
      explain: "Xin quyền đúng lúc người dùng cần giúp họ hiểu vì sao ứng dụng hỏi và tăng tỉ lệ đồng ý. Camera chỉ phục vụ một tính năng nên không có lý do hỏi ngay khi mở; vị trí còn ít liên quan hơn. Xin lại liên tục gây khó chịu, còn bỏ hẳn tính năng là mất giá trị sản phẩm. Kèm lời giải thích ngắn là cách cân bằng tốt nhất."
    },
    {
      id: "mobile-practice-startup",
      module: "phat-hanh-va-do-luong",
      tag: "PERF",
      title: "Khởi động chậm gấp đôi",
      scenario: "Bản phát hành mới mất 4,2 giây để vào màn hình chính, vượt hạn 2 giây của nhóm. Khi mở, ứng dụng tải đồng thời 18 tác vụ gồm đồng bộ đám mây, đọc chỉ số phân tích và tải ảnh bìa. Người dùng phàn nàn màn hình trắng. Hãy chọn cách xử lý đúng nhất trước khi phát hành lại.",
      metrics: [
        { label: "Khởi động", value: "4,2 s" },
        { label: "Hạn mục tiêu", value: "2 s" },
        { label: "Tác vụ lúc mở", value: "18" }
      ],
      options: [
        "Chỉ tải phần cần cho màn hình chính, hoãn đồng bộ và phân tích ra sau rồi đo lại",
        "Thêm màn hình chờ thật lâu để người dùng không thấy trắng",
        "Tăng dung lượng lưu trữ đệm cho mọi tác vụ",
        "Giảm số màn hình của ứng dụng xuống còn hai"
      ],
      correct: 0,
      explain: "18 tác vụ chạy ngay khi mở tranh nhau CPU và mạng, đẩy thời gian khởi động lên 4,2 giây. Cách đúng là xác định phần tối thiểu để vẽ màn hình chính, hoãn đồng bộ đám mây, phân tích và ảnh bìa ra sau, rồi đo lại trên máy thật. Màn hình chờ chỉ che triệu chứng; thêm bộ nhớ đệm hay bớt màn hình không giải quyết khối việc nặng lúc khởi động."
    }
  );
})();
