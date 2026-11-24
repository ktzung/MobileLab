/* MobileLab — module 02: tài nguyên, mạng, ngoại tuyến và lưu trữ trên máy */
window.MOBILELAB = window.MOBILELAB || { modules: [], lessons: {}, practice: [], cheatsheets: [] };

(function () {
  const D = window.MOBILELAB;

  D.modules.push({
    id: "tai-nguyen-va-mang",
    num: "02",
    title: "Tài nguyên và mạng",
    tone: "mint",
    blurb: "Bốn bài nối theo hành trình ra thế giới thật: ước lượng pin từ dung lượng và dòng xả, chịu mạng chập chờn bằng thử lại có giới hạn, phục vụ ngoại tuyến nhờ bộ nhớ đệm và chia lô, rồi giữ dữ liệu trên máy gọn và mã hóa.",
    lessons: ["pin", "mang", "offline", "luu-tru"]
  });

  D.lessons["pin"] = {
    id: "pin",
    module: "tai-nguyen-va-mang",
    title: "Pin và tiêu hao",
    shortTitle: "Pin",
    subtitle: "Từ mAh và mA đến số giờ dùng thật",
    blurb: "Thời lượng pin bằng dung lượng chia dòng tiêu hao, sau khi chừa 20% dự phòng. Bài này tính 4.000 mAh với 500 mA ra 6,4 giờ, viên 6.000 mAh cho 9,6 giờ, và chỉ ra ba thủ phạm làm sai con số.",
    duration: "12 phút",
    level: "Cơ bản",
    tags: ["mAh", "dòng xả", "dự phòng", "wake lock", "định vị"],
    metrics: [
      { key: "capacity", label: "Dung lượng", tone: "mint" },
      { key: "drain", label: "Tiêu hao", tone: "yellow" },
      { key: "hours", label: "Thời lượng", tone: "blue" },
      { key: "ok", label: "Đánh giá", tone: "coral" }
    ],
    nodes: [
      { id: "pin", type: "disk", x: 340, y: 80, w: 200, h: 70, label: "Pin 4.000 mAh", sub: "dung lượng danh định" },
      { id: "app", type: "user", x: 55, y: 80, w: 200, h: 70, label: "Ứng dụng", sub: "tác vụ nền" },
      { id: "drain", type: "bolt", x: 625, y: 80, w: 200, h: 70, label: "Mức tiêu hao", sub: "500 mA trung bình" },
      { id: "hours", type: "clock", x: 340, y: 310, w: 200, h: 70, label: "Thời lượng", sub: "6,4 giờ dùng" },
      { id: "reserve", type: "shield", x: 55, y: 310, w: 200, h: 70, label: "Dự phòng 20%", sub: "chừa 800 mAh" },
      { id: "screen", type: "grid", x: 625, y: 310, w: 200, h: 70, label: "Màn hình và sóng", sub: "sáng 60%, 4G" },
      { id: "alarm", type: "alert", x: 340, y: 195, w: 200, h: 70, label: "Tụt pin bất thường", sub: "wake lock giữ máy" }
    ],
    edges: [
      { id: "app-drain", from: "app", to: "drain", kind: "request", label: "tác vụ nền", bow: 22 },
      { id: "drain-app", from: "drain", to: "app", kind: "response", label: "cảnh báo 15%", bow: -22 },
      { id: "pin-hours", from: "pin", to: "hours", kind: "data", label: "4.000 mAh" },
      { id: "drain-hours", from: "drain", to: "hours", kind: "data", label: "500 mA" },
      { id: "reserve-hours", from: "reserve", to: "hours", kind: "control", label: "giữ 800 mAh" },
      { id: "screen-drain", from: "screen", to: "drain", kind: "data", label: "sáng 60% + 4G" },
      { id: "alarm-drain", from: "alarm", to: "drain", kind: "data", label: "wake lock 300 mA" }
    ],
    learn: [
      "Thời lượng = <code>dung lượng × 0,8 ÷ dòng xả</code>.",
      "<strong>Dự phòng 20%</strong> giữ pin khỏe và tránh tắt máy đột ngột.",
      "4.000 mAh với 500 mA cho <code>6,4 giờ</code>, thiếu một ca tám giờ.",
      "<strong>Wake lock</strong> và GPS liên tục kéo tiêu hao vượt xa mức trung bình."
    ],
    steps: [
      {
        short: "mAh nghĩa là gì",
        type: "concept",
        title: "Dung lượng pin đọc thế nào",
        body: "Pin điện thoại được ghi bằng miliampe giờ, viết tắt <code>mAh</code>: viên 4.000 mAh về lý thuyết xả được 4.000 mA trong một giờ, hoặc 500 mA trong tám giờ. Con số này là danh định, vì điện áp pin lithium tụt dần từ 4,2 V xuống 3,3 V và bộ điều áp phải bù lại. Khi ước lượng thời lượng, ta lấy dung lượng chia dòng tiêu hao trung bình rồi trừ hao. Với ứng dụng di động, dòng tiêu hao không đứng yên: màn hình sáng, sóng yếu và tác vụ nền đều kéo nó lên. Bài này dùng một mức trung bình để so sánh phương án, không thay thế phép đo trên máy thật.",
        focus: ["pin", "drain", "app"],
        edges: ["app-drain", "drain-app"],
        metrics: { capacity: "4.000 mAh", drain: "500 mA", hours: "8,0 giờ", ok: "chưa trừ hao" },
        changes: [
          "Dung lượng được hiểu là mAh, không phải số giờ.",
          "Mọi ước lượng sau đó đều quy về dòng xả trung bình."
        ],
        note: "Dung lượng danh định luôn cao hơn phần thực sự dùng được."
      },
      {
        short: "Chia 4.000 cho 500",
        type: "flow",
        title: "Bốn nghìn chia năm trăm",
        body: "Giả sử pin 4.000 mAh và ứng dụng kéo trung bình 500 mA. Nếu xả cạn, thời gian là 4.000 chia 500, tức tám giờ. Nhưng không nên xả tới 0%: pin lithium xuống quá thấp sẽ giảm tuổi thọ và máy có thể tắt đột ngột giữa ca, nên quy ước giữ 20% dự phòng. Phần dùng được là 3.200 mAh, chia 500 mA cho <code>6,4 giờ</code>. Đây là con số nên ghi vào tài liệu thiết kế. Một ca làm việc tám giờ vẫn thiếu khoảng 1,6 giờ, nên nhân viên giao hàng sẽ phải sạc giữa ca. Muốn đủ ca thì phải giảm dòng tiêu hao hoặc tăng dung lượng.",
        focus: ["pin", "hours", "reserve"],
        edges: ["pin-hours", "reserve-hours"],
        metrics: { capacity: "4.000 mAh", drain: "500 mA", hours: "6,4 giờ", ok: "thiếu 1,6 giờ" },
        changes: [
          "Dự phòng 20% được trừ trước khi chia, còn 3.200 mAh.",
          "Thời lượng thực tế giảm từ tám giờ xuống 6,4 giờ."
        ],
        note: "Trừ dự phòng trước rồi mới chia, đừng chia rồi mới trừ."
      },
      {
        short: "Viên 6.000 mAh",
        type: "detail",
        title: "Đổi sang pin 6.000 mAh",
        body: "Giữ nguyên mức tiêu hao 500 mA và dự phòng 20%, viên pin 6.000 mAh cho phần dùng được 4.800 mAh, chia 500 mA ra <code>9,6 giờ</code>, dư 1,6 giờ so với ca tám giờ. Tăng dung lượng là cách dễ hiểu nhưng đắt: pin to hơn làm máy nặng và dày, và với ứng dụng đã phát hành thì nhóm phát triển không sửa được. Vì vậy hãy xem tăng dung lượng là phương án phần cứng, còn giảm tiêu hao là phương án phần mềm, thứ nằm trong bản cập nhật kế tiếp. Cùng một mức dự phòng, hai cách cho hai kết quả khác nhau rõ rệt: một cách cần mua máy mới, một cách chỉ cần sửa mã.",
        focus: ["pin", "hours", "drain"],
        edges: ["pin-hours", "drain-hours"],
        metrics: { capacity: "6.000 mAh", drain: "500 mA", hours: "9,6 giờ", ok: "dư 1,6 giờ" },
        changes: [
          "Thời lượng tăng thêm 3,2 giờ so với viên 4.000 mAh.",
          "Chi phí chuyển sang phần cứng, không sửa được bằng bản vá."
        ],
        note: "Pin to hơn chỉ giải quyết triệu chứng; dòng xả mới là gốc."
      },
      {
        short: "Ba thủ phạm",
        type: "pitfall",
        title: "Wake lock, GPS và màn hình",
        body: "Ba thủ phạm làm mức tiêu hao vượt xa con số trung bình. Thứ nhất là <code>wake lock</code> giữ CPU thức: một khóa rò rỉ có thể kéo thêm 300 mA suốt đêm, biến 6,4 giờ thành dưới ba giờ. Thứ hai là định vị độ chính xác cao chạy liên tục, mỗi lần bật GPS tốn thêm hàng trăm mA. Thứ ba là màn hình sáng 100% kèm tải mạng không nghỉ. Cách chặn khá gọn: đặt thời hạn cho mọi wake lock, hạ tần suất lấy vị trí, gộp yêu cầu mạng theo lô, và đo lại bằng công cụ của hệ điều hành trước khi phát hành. Đừng tin cảm giác pin tụt nhanh, hãy đọc số đo.",
        focus: ["alarm", "screen", "drain"],
        edges: ["alarm-drain", "screen-drain"],
        metrics: { capacity: "4.000 mAh", drain: "800 mA", hours: "4,0 giờ", ok: "có rò rỉ" },
        changes: [
          "Wake lock rò rỉ bị phát hiện nhờ chênh lệch dòng xả ban đêm.",
          "Tần suất lấy vị trí được giãn ra thay vì chạy liên tục."
        ],
        note: "Một wake lock không nhả là lỗi phổ biến nhất trong các báo cáo pin."
      },
      {
        short: "Checklist pin",
        type: "final",
        title: "Checklist giữ chân pin",
        tone: "final",
        body: "Chốt lại bằng checklist ngắn. Một: tính thời lượng theo công thức dung lượng nhân 0,8 chia dòng xả, và ghi con số đó vào tài liệu. Hai: đo dòng xả thật trên máy đời thấp, không chỉ trên máy mạnh. Ba: đặt thời hạn cho mọi <code>wake lock</code> và gỡ khóa trong khối finally. Bốn: hạ tần suất GPS, dùng vị trí thô khi đủ, và chỉ lấy vị trí khi người dùng đang mở màn hình. Năm: gộp yêu cầu mạng theo lô để radio không thức liên tục. Sáu: kiểm thử pin qua đêm và ghi lại mức tụt. Bảy: cảnh báo người dùng khi pin dưới 15%.",
        focus: "all",
        edges: "all",
        metrics: { capacity: "4.000 mAh", drain: "500 mA", hours: "6,4 giờ", ok: "đạt" },
        changes: [
          "Mọi wake lock đều có thời hạn và được nhả trong finally.",
          "Dòng xả ban đêm được đo và đưa vào tiêu chí phát hành."
        ],
        note: "Pin là tài nguyên người dùng cảm nhận được ngay, hãy đo trước khi hứa."
      }
    ]
  };

  D.lessons["mang"] = {
    id: "mang",
    module: "tai-nguyen-va-mang",
    title: "Mạng chập chờn",
    shortTitle: "Mạng",
    subtitle: "Độ trễ, mất gói và thử lại có giới hạn",
    blurb: "Sóng di động không ổn định như Wi-Fi trong phòng lab. Bài này đo độ trễ 250 ms và mất gói 12%, đặt giới hạn ba lần thử lại với backoff, và xếp yêu cầu vào hàng đợi khi sóng yếu.",
    duration: "12 phút",
    level: "Trung cấp",
    tags: ["độ trễ", "mất gói", "thử lại", "backoff", "hàng đợi"],
    metrics: [
      { key: "latencyMs", label: "Độ trễ", tone: "blue" },
      { key: "lossPct", label: "Mất gói", tone: "coral" },
      { key: "retries", label: "Thử lại", tone: "yellow" },
      { key: "ok", label: "Kết quả", tone: "mint" }
    ],
    nodes: [
      { id: "app", type: "user", x: 55, y: 80, w: 200, h: 70, label: "Ứng dụng", sub: "gửi yêu cầu" },
      { id: "net", type: "signal", x: 340, y: 80, w: 200, h: 70, label: "Mạng 3G yếu", sub: "250 ms, mất 12%" },
      { id: "api", type: "api", x: 625, y: 80, w: 200, h: 70, label: "Máy chủ", sub: "nhận gói tin" },
      { id: "queue", type: "memory", x: 55, y: 310, w: 200, h: 70, label: "Hàng đợi yêu cầu", sub: "50 mục chờ gửi" },
      { id: "retry", type: "queue", x: 340, y: 310, w: 200, h: 70, label: "Thử lại 3 lần", sub: "backoff 1-2-4 giây" },
      { id: "timeout", type: "clock", x: 625, y: 310, w: 200, h: 70, label: "Hết thời gian", sub: "8 giây mỗi lần" },
      { id: "drop", type: "alert", x: 340, y: 195, w: 200, h: 70, label: "Gói tin rơi", sub: "không có phản hồi" }
    ],
    edges: [
      { id: "app-net", from: "app", to: "net", kind: "request", label: "yêu cầu", bow: 22 },
      { id: "net-app", from: "net", to: "app", kind: "response", label: "lỗi 504", bow: -22 },
      { id: "net-api", from: "net", to: "api", kind: "request", label: "gói tin" },
      { id: "api-timeout", from: "api", to: "timeout", kind: "control", label: "chờ 8 giây" },
      { id: "timeout-retry", from: "timeout", to: "retry", kind: "data", label: "hết hạn" },
      { id: "net-drop", from: "net", to: "drop", kind: "data", label: "mất gói 12%" },
      { id: "retry-queue", from: "retry", to: "queue", kind: "control", label: "xếp hàng đợi" }
    ],
    learn: [
      "<strong>Độ trễ 250 ms</strong> và mất gói 12% là mức thường gặp trên 3G yếu.",
      "Mọi yêu cầu phải có <code>timeout</code>, không chờ vô hạn.",
      "Thử lại tối đa <strong>3 lần</strong>, backoff 1, 2, 4 giây, có jitter.",
      "Hàng đợi giữ yêu cầu khi mất mạng thay vì <strong>báo lỗi ngay</strong>."
    ],
    steps: [
      {
        short: "Trễ và mất gói",
        type: "concept",
        title: "Hai con số quan trọng hơn tốc độ",
        body: "Mạng di động có hai con số quan trọng hơn tốc độ: độ trễ và tỉ lệ mất gói. Độ trễ là thời gian từ lúc gửi yêu cầu đến lúc nhận byte đầu tiên; 250 ms là mức bình thường trên 3G, còn 4G tốt thường dưới 80 ms. Mất gói là phần trăm gói tin không bao giờ tới đích; 12% nghĩa là cứ một trăm gói thì mất mười hai, và giao thức phải gửi lại. Trong hầm gửi xe, cả hai con số xấu đi cùng lúc. Vì vậy ứng dụng không được coi mạng là hoàn hảo: mọi yêu cầu đều có thể chậm, có thể mất, và có thể chỉ trả về lỗi sau khi đã chờ đủ lâu.",
        focus: ["app", "net", "api"],
        edges: ["app-net", "net-api"],
        metrics: { latencyMs: "250", lossPct: "12", retries: "0", ok: "chưa xử lý" },
        changes: [
          "Thời gian chờ được đặt cho từng yêu cầu thay vì mặc định vô hạn.",
          "Tỉ lệ mất gói được ghi vào tài liệu kiểm thử."
        ],
        note: "Đo độ trễ ở bách phân vị 95, đừng chỉ lấy trung bình."
      },
      {
        short: "Ba lần thử lại",
        type: "flow",
        title: "Thử lại có giới hạn và backoff",
        body: "Gặp lỗi mạng, phản xạ đầu tiên là gửi lại ngay. Gửi lại ngay lập tức thường hỏng tiếp vì sóng chưa hồi, nên cần chờ tăng dần. Công thức quen dùng là <code>1, 2, 4</code> giây giữa các lần thử, tối đa ba lần, mỗi lần chờ phản hồi 8 giây. Tổng thời gian xấu nhất khoảng 31 giây, vẫn chấp nhận được với một yêu cầu đồng bộ. Ba lần là đủ vì mất gói 12% thì xác suất hỏng cả ba lần chỉ khoảng 0,17%. Quan trọng hơn, phải có điểm dừng: thử lại vô hạn biến một lỗi mạng tạm thời thành vòng lặp đốt pin và đốt dữ liệu.",
        focus: ["net", "retry", "timeout"],
        edges: ["net-drop", "timeout-retry"],
        metrics: { latencyMs: "250", lossPct: "12", retries: "3", ok: "đạt" },
        changes: [
          "Mỗi yêu cầu có tối đa ba lần thử với khoảng chờ tăng dần.",
          "Tổng thời gian xấu nhất bị chặn ở khoảng 31 giây."
        ],
        note: "Thêm jitter ngẫu nhiên để hàng nghìn máy không thử lại cùng một giây."
      },
      {
        short: "Hàng đợi",
        type: "detail",
        title: "Xếp yêu cầu vào hàng đợi",
        body: "Khi mất mạng hẳn, thử lại chỉ tốn pin. Cách tốt hơn là đưa yêu cầu vào hàng đợi bền và gửi lại khi có mạng. Một hàng đợi 50 mục với hai luồng song song, mỗi luồng 25 mục, giúp radio thức một lần thay vì thức 50 lần, tiết kiệm đáng kể pin. Mỗi mục cần khóa nhận dạng để máy chủ bỏ qua bản trùng khi mạng chập chờn khiến cùng một yêu cầu tới hai lần. Hàng đợi cũng phải có giới hạn và thứ tự ưu tiên: đơn hàng mới quan trọng hơn ảnh đại diện. Nếu để hàng đợi phình vô hạn, bộ nhớ máy sẽ đầy sau vài ngày ngoại tuyến.",
        focus: ["queue", "retry", "app"],
        edges: ["retry-queue", "app-net"],
        metrics: { latencyMs: "250", lossPct: "12", retries: "3", ok: "có hàng đợi" },
        changes: [
          "Yêu cầu được giữ trong hàng đợi thay vì báo lỗi cho người dùng.",
          "Radio chỉ thức một lần cho cả lô 50 mục."
        ],
        note: "Hàng đợi phải bền qua lần tắt ứng dụng, nếu không sẽ mất đơn."
      },
      {
        short: "Bão thử lại",
        type: "pitfall",
        title: "Thử lại dồn dập làm sập máy chủ",
        body: "Lỗi hay gặp là thử lại không có jitter và không có giới hạn phía máy chủ. Giả sử 500 máy cùng mất mạng lúc 8 giờ sáng, mỗi máy thử ba lần đúng giây thứ nhất, thứ hai và thứ tư: máy chủ nhận 1.500 yêu cầu trong bốn giây, gấp ba lần bình thường, và sập tiếp. Cách chặn gồm bốn việc: thêm jitter ngẫu nhiên vào khoảng chờ, đặt hạn mức thử lại theo thiết bị, trả mã <code>429</code> kèm thời gian chờ khi quá tải, và dùng khóa idempotency để bản gửi trùng không tạo hai đơn. Thử lại là con dao hai lưỡi, phải có phanh.",
        focus: ["retry", "queue", "api"],
        edges: ["retry-queue", "api-timeout"],
        metrics: { latencyMs: "900", lossPct: "12", retries: "bão", ok: "quá tải" },
        changes: [
          "Khoảng chờ được cộng jitter nên các máy không dồn về cùng giây.",
          "Máy chủ trả 429 kèm thời gian chờ thay vì nhận hết rồi sập."
        ],
        note: "500 máy nhân ba lần thử là 1.500 yêu cầu, đủ làm sập một cụm nhỏ."
      },
      {
        short: "Checklist mạng",
        type: "final",
        title: "Checklist chịu mạng yếu",
        tone: "final",
        body: "Chốt lại bằng checklist. Một: đặt thời gian chờ cho mọi yêu cầu, không có ngoại lệ. Hai: thử lại tối đa ba lần với backoff 1, 2, 4 giây và jitter. Ba: đưa yêu cầu vào hàng đợi bền khi mất mạng, giới hạn số mục và ưu tiên theo nghiệp vụ. Bốn: gắn khóa idempotency cho mọi thao tác ghi để bản gửi trùng không tạo hai đơn. Năm: hiển thị trạng thái rõ cho người dùng, ví dụ đang chờ mạng thay vì quay vòng vô tận. Sáu: kiểm thử bằng cách chặn mạng và làm rơi 12% gói trong phòng lab. Bảy: theo dõi độ trễ bách phân vị 95 trên máy thật.",
        focus: "all",
        edges: "all",
        metrics: { latencyMs: "250", lossPct: "12", retries: "3", ok: "ổn định" },
        changes: [
          "Toàn bộ luồng gọi mạng đi qua một lớp có thời gian chờ và thử lại.",
          "Kiểm thử mạng yếu trở thành bước bắt buộc trước phát hành."
        ],
        note: "Mạng yếu là điều kiện mặc định ở Việt Nam, không phải trường hợp biên."
      }
    ]
  };

  D.lessons["offline"] = {
    id: "offline",
    module: "tai-nguyen-va-mang",
    title: "Ngoại tuyến và bộ nhớ đệm",
    shortTitle: "Ngoại tuyến",
    subtitle: "Cache-first và chia lô đồng bộ",
    blurb: "Ngoại tuyến là chọn đúng phần dữ liệu cần giữ. Bài này tính 500 yêu cầu mỗi ngày, đệm 80% cho 400 mục phục vụ tại chỗ, còn 100 mục chia lô 50 thành hai lượt đồng bộ khi có mạng.",
    duration: "12 phút",
    level: "Trung cấp",
    tags: ["cache-first", "bộ nhớ đệm", "đồng bộ", "chia lô", "thời hạn"],
    metrics: [
      { key: "requests", label: "Yêu cầu/ngày", tone: "blue" },
      { key: "cachedPct", label: "Đã đệm", tone: "mint" },
      { key: "cacheHits", label: "Phục vụ tại chỗ", tone: "yellow" },
      { key: "syncBatches", label: "Lô đồng bộ", tone: "coral" }
    ],
    nodes: [
      { id: "app", type: "user", x: 55, y: 80, w: 200, h: 70, label: "Ứng dụng", sub: "mở màn hình" },
      { id: "cache", type: "memory", x: 340, y: 80, w: 200, h: 70, label: "Bộ nhớ đệm", sub: "400 mục đã lưu" },
      { id: "net", type: "signal", x: 625, y: 80, w: 200, h: 70, label: "Kiểm tra mạng", sub: "có hay không" },
      { id: "queue", type: "queue", x: 55, y: 310, w: 200, h: 70, label: "Hàng đợi ghi", sub: "100 mục chờ" },
      { id: "batch", type: "layers", x: 340, y: 310, w: 200, h: 70, label: "Chia lô 50 mục", sub: "hai lượt đồng bộ" },
      { id: "api", type: "api", x: 625, y: 310, w: 200, h: 70, label: "Máy chủ", sub: "nhận từng lô" },
      { id: "miss", type: "alert", x: 340, y: 195, w: 200, h: 70, label: "Thiếu 100 mục", sub: "phải chờ mạng" }
    ],
    edges: [
      { id: "app-cache", from: "app", to: "cache", kind: "request", label: "đọc trước", bow: 22 },
      { id: "cache-app", from: "cache", to: "app", kind: "response", label: "dữ liệu đã lưu", bow: -22 },
      { id: "cache-net", from: "cache", to: "net", kind: "control", label: "hết thời hạn" },
      { id: "net-api", from: "net", to: "api", kind: "request", label: "làm mới" },
      { id: "cache-miss", from: "cache", to: "miss", kind: "data", label: "đệm thiếu" },
      { id: "queue-batch", from: "queue", to: "batch", kind: "control", label: "chia lô 50" },
      { id: "batch-api", from: "batch", to: "api", kind: "data", label: "lô 50 mục" }
    ],
    learn: [
      "Đệm 80% của 500 yêu cầu là <code>400 mục</code> phục vụ tại chỗ.",
      "<code>cache-first</code> cho cảm giác tức thì, cần kèm thời hạn rõ ràng.",
      "100 mục còn lại chia lô <strong>50</strong> thành hai lượt đồng bộ.",
      "Chỉ đệm <strong>phản hồi thành công</strong>, không đệm lỗi hay dữ liệu nhạy cảm."
    ],
    steps: [
      {
        short: "Đệm để làm gì",
        type: "concept",
        title: "Đệm là bản sao trên máy",
        body: "Bộ nhớ đệm là bản sao dữ liệu đặt ngay trên máy, để lần mở sau không phải chờ mạng. Với 500 yêu cầu mỗi ngày, nếu đệm được 80% thì 400 yêu cầu phục vụ tại chỗ và chỉ 100 yêu cầu cần mạng. Con số 80% không phải mục tiêu cho đẹp: dưới mức đó, nhân viên giao hàng vào hầm là mất gần nửa chức năng. Cần phân biệt ba loại dữ liệu: danh mục gần như không đổi, đơn hàng đang mở thay đổi liên tục, và ảnh chứng từ chỉ đọc. Mỗi loại cần chính sách riêng. Đệm tất cả là lãng phí dung lượng, còn không đệm gì là bỏ người dùng giữa đường.",
        focus: ["app", "cache", "miss"],
        edges: ["app-cache", "cache-app"],
        metrics: { requests: "500", cachedPct: "0", cacheHits: "0", syncBatches: "10" },
        changes: [
          "Ba loại dữ liệu được tách theo tần suất thay đổi.",
          "Tỉ lệ đệm trở thành chỉ số đo được thay vì cảm tính."
        ],
        note: "Đệm là bản sao, không bao giờ là nguồn sự thật duy nhất."
      },
      {
        short: "Cache-first",
        type: "flow",
        title: "Đọc đệm trước, làm mới sau",
        body: "Chiến lược <code>cache-first</code> đọc đệm trước, hiển thị ngay, rồi làm mới ngầm. Với danh mục sản phẩm, cách này cho cảm giác mở tức thì và vẫn cập nhật khi có mạng. Chiến lược ngược lại là network-first, phù hợp với đơn hàng vì dữ liệu cũ có thể khiến nhân viên giao sai địa chỉ. Mỗi mục đệm cần thời hạn: danh mục 24 giờ, đơn hàng 5 phút. Khi hết hạn mà không có mạng, ứng dụng phải nói rõ đang hiển thị bản cũ thay vì im lặng. Đệm không có thời hạn sẽ phục vụ dữ liệu tháng trước với vẻ tự tin, và đó là lỗi tốn kém nhất trong nhóm lỗi ngoại tuyến.",
        focus: ["cache", "net", "app"],
        edges: ["app-cache", "cache-net"],
        metrics: { requests: "500", cachedPct: "80", cacheHits: "400", syncBatches: "2" },
        changes: [
          "Danh mục đọc từ đệm trong khi vẫn làm mới ngầm.",
          "Mỗi mục đệm có thời hạn thay vì sống mãi."
        ],
        note: "Network-first cho dữ liệu phải đúng, cache-first cho dữ liệu phải nhanh."
      },
      {
        short: "Hai lô 50",
        type: "detail",
        title: "Chia 100 mục thành hai lô",
        body: "Phần còn lại sau khi trừ đệm là 100 mục cần đồng bộ, gồm ảnh chứng từ và trạng thái đơn mới. Chia lô 50 mục cho hai lượt gửi thay vì một lần 100: lô nhỏ dễ thử lại, ít tốn dữ liệu khi hỏng giữa đường, và không giữ kết nối quá lâu trên sóng yếu. Mỗi lô có mã riêng để biết lô nào đã xong, tránh gửi lại cả trăm mục chỉ vì một ảnh hỏng. Với mất gói 12%, gửi một lần 100 mục có xác suất thành công rất thấp. Hai lô 50 mục, mỗi lô thử lại ba lần, là cấu hình cân bằng giữa thời gian chờ và độ bền của dữ liệu.",
        focus: ["queue", "batch", "api"],
        edges: ["queue-batch", "batch-api"],
        metrics: { requests: "500", cachedPct: "80", cacheHits: "400", syncBatches: "2" },
        changes: [
          "100 mục được gửi thành hai lô 50 thay vì một lần.",
          "Mỗi lô có mã riêng để đánh dấu đã đồng bộ xong."
        ],
        note: "Lô nhỏ làm hỏng vặt rẻ hơn nhiều so với lô lớn hỏng toàn bộ."
      },
      {
        short: "Ba lỗi đệm",
        type: "pitfall",
        title: "Đệm lỗi và đệm quá tay",
        body: "Ba lỗi đệm thường gặp. Thứ nhất là đệm cả phản hồi lỗi: một lần máy chủ trả <code>500</code>, ứng dụng lưu luôn và hiển thị lỗi đó suốt ngày. Thứ hai là đệm dữ liệu nhạy cảm như token hay ảnh căn cước mà không mã hóa, nên ai mượn máy cũng đọc được. Thứ ba là không có giới hạn dung lượng, đệm phình tới vài trăm MB rồi tranh chỗ với ảnh chụp. Cách chặn khá rõ: chỉ đệm phản hồi thành công, mã hóa phần nhạy cảm, đặt hạn mức theo loại dữ liệu, và dọn mục cũ nhất trước khi thêm mục mới. Đệm sai còn tệ hơn không đệm.",
        focus: ["cache", "miss", "net"],
        edges: ["cache-miss", "cache-net"],
        metrics: { requests: "500", cachedPct: "80", cacheHits: "400", syncBatches: "2" },
        changes: [
          "Phản hồi lỗi không còn được ghi vào đệm.",
          "Đệm có hạn mức và chính sách dọn mục cũ nhất."
        ],
        note: "Đệm một phản hồi 500 là tự tay làm hỏng ứng dụng cho cả ngày."
      },
      {
        short: "Checklist đệm",
        type: "final",
        title: "Checklist ngoại tuyến",
        tone: "final",
        body: "Chốt lại bằng checklist. Một: phân loại dữ liệu theo tần suất thay đổi trước khi chọn chính sách. Hai: cache-first cho danh mục, network-first cho đơn hàng và tồn kho. Ba: đặt thời hạn cho từng loại, danh mục 24 giờ, đơn hàng 5 phút. Bốn: chỉ đệm phản hồi thành công, bỏ qua mã lỗi. Năm: mã hóa phần nhạy cảm và đặt hạn mức dung lượng. Sáu: đồng bộ theo lô 50 mục, mỗi lô có mã và thử lại ba lần. Bảy: hiển thị nhãn dữ liệu cũ cho người dùng. Tám: kiểm thử bằng chế độ máy bay giữa lúc đang ghi đơn, rồi bật mạng lại và xem lô có đi đủ hay không.",
        focus: "all",
        edges: "all",
        metrics: { requests: "500", cachedPct: "80", cacheHits: "400", syncBatches: "2" },
        changes: [
          "Toàn bộ luồng đọc và ghi có chính sách đệm ghi trong tài liệu.",
          "Kiểm thử máy bay trở thành bước bắt buộc trước phát hành."
        ],
        note: "Đo tỉ lệ phục vụ tại chỗ mỗi tuần, đừng đo một lần rồi quên."
      }
    ]
  };

  D.lessons["luu-tru"] = {
    id: "luu-tru",
    module: "tai-nguyen-va-mang",
    title: "Lưu trữ trên máy",
    shortTitle: "Lưu trữ",
    subtitle: "Dung lượng, dọn dẹp và mã hóa",
    blurb: "Dung lượng trên máy là hữu hạn: hạn mức 512 MB, đã dùng 78% tức khoảng 400 MB với 1.200 tệp. Bài này chỉ cách dọn tệp cũ, đặt hạn mức theo loại dữ liệu, và mã hóa phần nhạy cảm.",
    duration: "12 phút",
    level: "Cơ bản",
    tags: ["dung lượng", "dọn dẹp", "nhạy cảm", "mã hóa", "hạn mức"],
    metrics: [
      { key: "storageMB", label: "Hạn mức", tone: "blue" },
      { key: "usedPct", label: "Đã dùng", tone: "yellow" },
      { key: "files", label: "Số tệp", tone: "mint" },
      { key: "encrypted", label: "Mã hóa", tone: "coral" }
    ],
    nodes: [
      { id: "app", type: "user", x: 55, y: 80, w: 200, h: 70, label: "Ứng dụng", sub: "ghi và đọc tệp" },
      { id: "disk", type: "disk", x: 340, y: 80, w: 200, h: 70, label: "Bộ nhớ trong", sub: "400 MB trên 512 MB" },
      { id: "quota", type: "grid", x: 625, y: 80, w: 200, h: 70, label: "Hạn mức 512 MB", sub: "cảnh báo ở 80%" },
      { id: "clean", type: "task", x: 55, y: 310, w: 200, h: 70, label: "Dọn tệp cũ", sub: "xóa ảnh đệm" },
      { id: "key", type: "key", x: 340, y: 310, w: 200, h: 70, label: "Khóa mã hóa", sub: "Keychain, Keystore" },
      { id: "audit", type: "shield", x: 625, y: 310, w: 200, h: 70, label: "Nhật ký truy cập", sub: "không ghi nội dung" },
      { id: "full", type: "alert", x: 340, y: 195, w: 200, h: 70, label: "Đầy bộ nhớ", sub: "ghi tệp thất bại" }
    ],
    edges: [
      { id: "app-disk", from: "app", to: "disk", kind: "request", label: "ghi tệp", bow: 22 },
      { id: "disk-app", from: "disk", to: "app", kind: "response", label: "đọc lại", bow: -22 },
      { id: "disk-quota", from: "disk", to: "quota", kind: "data", label: "đã dùng 78%" },
      { id: "disk-full", from: "disk", to: "full", kind: "data", label: "vượt hạn mức" },
      { id: "clean-disk", from: "clean", to: "disk", kind: "control", label: "giải phóng 150 MB" },
      { id: "disk-key", from: "disk", to: "key", kind: "data", label: "tệp nhạy cảm" },
      { id: "key-audit", from: "key", to: "audit", kind: "control", label: "ghi nhật ký" }
    ],
    learn: [
      "Hạn mức <code>512 MB</code>, dùng 78% là khoảng 400 MB cho 1.200 tệp.",
      "Mỗi loại dữ liệu có <strong>hạn mức riêng</strong>, không dùng chung một trần.",
      "Dọn <strong>ảnh đệm cũ</strong> trước khi xin thêm dung lượng.",
      "Dữ liệu nhạy cảm mã hóa bằng khóa trong <code>Keychain</code> hoặc Keystore."
    ],
    steps: [
      {
        short: "Hạn mức",
        type: "concept",
        title: "Bộ nhớ máy không phải vô hạn",
        body: "Ứng dụng chạy trên máy của người dùng, nơi ảnh, video và ứng dụng khác cũng tranh chỗ. Đặt hạn mức 512 MB cho phần dữ liệu của mình là cách tự bảo vệ: ở mức 78%, tức khoảng 400 MB với 1.200 tệp, trung bình mỗi tệp khoảng 340 KB. Khi vượt 80%, ứng dụng nên cảnh báo và bắt đầu dọn. Không có hạn mức thì sớm muộn máy cũng đầy, và lúc đó <code>ghi tệp</code> thất bại giữa lúc nhân viên đang chụp ảnh chứng từ. Hai điều cần nhớ: dung lượng là tài nguyên chia sẻ, và mọi lần ghi đều có thể thất bại vì lý do nằm ngoài ứng dụng.",
        focus: ["disk", "quota", "app"],
        edges: ["app-disk", "disk-quota"],
        metrics: { storageMB: "512", usedPct: "78", files: "1.200", encrypted: "chưa" },
        changes: [
          "Dung lượng dùng được có trần rõ ràng thay vì chiếm bao nhiêu cũng được.",
          "Mọi lần ghi tệp đều kiểm tra chỗ trống trước."
        ],
        note: "Máy đầy là lỗi của cả hệ thống, nhưng người dùng luôn đổ cho ứng dụng."
      },
      {
        short: "Dọn 150 MB",
        type: "flow",
        title: "Dọn ảnh đệm cũ trước",
        body: "Trong 400 MB đang dùng, khoảng 150 MB là ảnh đệm đã tải về để xem nhanh, tức 480 trong 1.200 tệp. Dọn nhóm này đưa mức dùng xuống còn 250 MB, khoảng 49%, và số tệp còn 720. Thứ tự dọn nên theo tuổi và khả năng tái tạo: ảnh đệm xóa được vì tải lại từ máy chủ, còn ảnh chứng từ chưa đồng bộ thì tuyệt đối không. Cần chạy dọn định kỳ chứ không chờ tới lúc đầy, vì lúc đầy thì cả thao tác dọn cũng có thể thất bại. Ghi lại số đã giải phóng để biết chính sách có hiệu quả hay không, thay vì tin rằng dọn một lần là xong.",
        focus: ["clean", "disk", "quota"],
        edges: ["clean-disk", "disk-quota"],
        metrics: { storageMB: "512", usedPct: "49", files: "720", encrypted: "chưa" },
        changes: [
          "150 MB ảnh đệm bị xóa, mức dùng giảm từ 78% xuống 49%.",
          "Số tệp giảm từ 1.200 xuống 720."
        ],
        note: "Chỉ xóa thứ tái tạo được; ảnh chứng từ chưa đồng bộ là dữ liệu gốc."
      },
      {
        short: "Dữ liệu nhạy cảm",
        type: "detail",
        title: "Mã hóa phần nhạy cảm",
        body: "Không phải tệp nào cũng cần mã hóa, nhưng ba nhóm sau thì bắt buộc: token phiên, ảnh giấy tờ tùy thân và nhật ký có thông tin cá nhân. Trên iOS, khóa nên nằm trong <code>Keychain</code>; trên Android là <code>Keystore</code>, và dữ liệu nhỏ dùng EncryptedSharedPreferences. Cơ sở dữ liệu dùng SQLCipher hoặc mã hóa từng trường bằng AES-GCM với nonce riêng. Khóa không bao giờ nằm trong mã nguồn hay trong tệp cấu hình đi kèm gói cài. Sao lưu cũng phải tính: bản sao lưu đám mây chứa token là lỗ hổng, nên loại phần nhạy cảm khỏi sao lưu hoặc mã hóa bằng khóa chỉ máy giữ.",
        focus: ["key", "disk", "audit"],
        edges: ["disk-key", "key-audit"],
        metrics: { storageMB: "512", usedPct: "49", files: "720", encrypted: "có" },
        changes: [
          "Token và ảnh giấy tờ được mã hóa bằng khóa trong Keychain hoặc Keystore.",
          "Khóa không còn xuất hiện trong mã nguồn hay tệp cấu hình."
        ],
        note: "Mã hóa mà khóa nằm cùng chỗ với dữ liệu thì chỉ là che mắt."
      },
      {
        short: "Bốn lỗi",
        type: "pitfall",
        title: "Xóa tệp mà chưa xóa dấu vết",
        body: "Bốn lỗi hay gặp khi dọn dữ liệu. Thứ nhất là xóa tệp nhưng quên ảnh thu nhỏ và bản ghi trong cơ sở dữ liệu, nên dung lượng không giảm. Thứ hai là để bản sao lưu đám mây chứa token, dù máy đã mã hóa. Thứ ba là xin quyền đọc toàn bộ bộ nhớ trong khi chỉ cần thư mục của ứng dụng. Thứ tư là ghi nội dung tệp vào log để gỡ lỗi rồi quên gỡ. Cách chặn: xóa theo khóa ngoại, loại trừ thư mục nhạy cảm khỏi sao lưu, xin quyền tối thiểu, và rà log trước mỗi bản phát hành. Dữ liệu đã lộ thì không lấy lại được bằng bản vá.",
        focus: ["full", "audit", "key"],
        edges: ["disk-full", "key-audit"],
        metrics: { storageMB: "512", usedPct: "78", files: "1.200", encrypted: "một phần" },
        changes: [
          "Ảnh thu nhỏ và bản ghi liên quan được xóa cùng tệp gốc.",
          "Thư mục nhạy cảm bị loại khỏi sao lưu đám mây."
        ],
        note: "Xóa nửa vời để lại dấu vết và không giải phóng được dung lượng."
      },
      {
        short: "Checklist lưu trữ",
        type: "final",
        title: "Checklist lưu trữ trên máy",
        tone: "final",
        body: "Chốt lại bằng checklist. Một: đặt hạn mức 512 MB và cảnh báo ở 80%. Hai: phân loại tệp theo khả năng tái tạo, chỉ dọn nhóm tái tạo được. Ba: chạy dọn định kỳ, ghi lại số dung lượng giải phóng. Bốn: mã hóa token, ảnh giấy tờ và nhật ký cá nhân bằng khóa trong <code>Keychain</code> hoặc Keystore. Năm: loại dữ liệu nhạy cảm khỏi sao lưu đám mây. Sáu: xin quyền tối thiểu, không đọc cả bộ nhớ. Bảy: rà log và tắt ghi nội dung tệp trước phát hành. Tám: kiểm thử trường hợp máy đầy bằng cách chặn ghi tệp và xem ứng dụng có báo lỗi rõ ràng.",
        focus: "all",
        edges: "all",
        metrics: { storageMB: "512", usedPct: "49", files: "720", encrypted: "có" },
        changes: [
          "Chính sách hạn mức, dọn dẹp và mã hóa được ghi thành một tài liệu.",
          "Kiểm thử máy đầy trở thành một ca bắt buộc trong bộ kiểm thử."
        ],
        note: "Dữ liệu nhạy cảm nằm trên máy người dùng, hãy coi máy đó là nơi không tin cậy."
      }
    ]
  };

  D.practice.push({
    id: "giao-hang-ham",
    module: "tai-nguyen-va-mang",
    tag: "OFFLINE",
    tags: ["OFFLINE", "bộ nhớ đệm", "đồng bộ"],
    title: "Giao hàng trong hầm mất sóng",
    scenario: "Một ứng dụng giao hàng được dùng trong hầm giữ xe và thang máy chung cư, nơi sóng mất hẳn ba đến năm phút mỗi lần. Mỗi ngày một nhân viên phát sinh khoảng 500 yêu cầu, và mỗi ca có khoảng 40 điểm giao, gồm xem danh mục, mở đơn và chụp ảnh chứng từ. Bản hiện tại chỉ đệm 30% nên khi mất mạng, nhân viên phải đứng chờ hoặc gọi điện xin số đơn. Nhóm kỹ thuật có hai tuần và không được đổi máy chủ. Bạn chọn hướng nào cho lần phát hành tới?",
    metrics: [
      { label: "Yêu cầu mỗi ngày", value: "500" },
      { label: "Đệm hiện tại", value: "30%" },
      { label: "Thời gian sửa", value: "2 tuần" }
    ],
    options: [
      "Đệm toàn bộ 500 yêu cầu mỗi ngày và không đặt thời hạn",
      "Tăng đệm lên 80% theo loại dữ liệu, đồng bộ 100 mục còn lại theo lô 50",
      "Ẩn các màn hình cần mạng và nhắc nhân viên ra ngoài mới mở lại",
      "Giữ mức 30% nhưng thêm nút thử lại bằng tay cho nhân viên"
    ],
    correct: 1,
    explain: "Với 500 yêu cầu mỗi ngày, đệm 80% cho 400 mục phục vụ tại chỗ, chỉ còn 100 mục phải chờ mạng. Chia 100 mục thành hai lô 50 giúp mỗi lượt gửi ngắn, hỏng thì thử lại rẻ và không giữ kết nối lâu trên sóng yếu. Đệm tất cả là sai vì đơn hàng thay đổi liên tục, không có thời hạn thì nhân viên giao theo địa chỉ cũ. Ẩn màn hình là bỏ chức năng chứ không phải sửa lỗi, và 30% vẫn khiến 350 yêu cầu phải chờ mạng. Nút thử lại bằng tay đẩy khó khăn sang người dùng, trong khi hệ thống có thể tự xử lý."
  });

  D.practice.push({
    id: "theo-doi-suc-khoe",
    module: "tai-nguyen-va-mang",
    tag: "BATTERY",
    tags: ["BATTERY", "tiêu hao", "GPS"],
    title: "Ứng dụng sức khỏe hao pin",
    scenario: "Một ứng dụng theo dõi sức khỏe ghi nhịp tim và vị trí mỗi phút, kéo trung bình 900 mA trên viên pin 4.000 mAh. Người dùng phàn nàn máy chỉ dùng được khoảng 3,6 giờ, không đủ một buổi chạy dài. Nhóm sản phẩm có hai đề xuất: giảm tần suất lấy GPS từ mỗi phút xuống mỗi năm phút và gộp nhịp tim theo lô, hoặc chuyển sang dòng máy pin 6.000 mAh. Ngân sách chỉ đủ một hướng trong quý này, và ứng dụng đã có 40.000 người dùng trên nhiều đời máy. Bạn chọn hướng nào?",
    metrics: [
      { label: "Dòng xả", value: "900 mA" },
      { label: "Dung lượng pin", value: "4.000 mAh" },
      { label: "Dự phòng", value: "20%" }
    ],
    options: [
      "Chuyển sang dòng máy pin 6.000 mAh trong quý này",
      "Giữ nguyên mức tiêu hao và thêm chế độ tiết kiệm pin bật thủ công",
      "Giảm tần suất GPS và gộp nhịp tim theo lô để hạ dòng xả",
      "Tắt hoàn toàn phần ghi vị trí để pin bền hơn"
    ],
    correct: 2,
    explain: "Với dự phòng 20%, phần dùng được là 3.200 mAh, chia 900 mA ra khoảng 3,6 giờ. GPS mỗi phút tốn khoảng 350 mA; giãn xuống mỗi năm phút còn khoảng 70 mA, đưa tổng dòng xả về 620 mA và thời lượng lên 5,2 giờ, áp dụng cho cả 40.000 người dùng ngay trong bản cập nhật. Pin 6.000 mAh cho 4.800 mAh chia 900 mA, tức 5,3 giờ, nhưng chỉ người mua máy mới được hưởng. Chế độ tiết kiệm bật tay vẫn giữ nguyên 900 mA khi người dùng quên bật. Tắt hẳn vị trí thì phá chức năng chính của ứng dụng."
  });

  D.cheatsheets.push({
    id: "resources",
    num: "02",
    module: "tai-nguyen-va-mang",
    title: "Bảng tra tài nguyên và mạng",
    intro: "Năm bảng tra khi thiết kế: công thức ước lượng pin, cách chọn chiến lược đệm, mẫu thử lại có backoff, checklist dữ liệu nhạy cảm và bảng dung lượng lưu trữ. Cả nhóm nên dùng chung một chuẩn.",
    cards: [
      {
        title: "Công thức ước lượng pin",
        wide: true,
        html: "<table class=\"cheat-table\"><thead><tr><th>Đại lượng</th><th>Công thức</th><th>Ví dụ</th></tr></thead><tbody><tr><td>Phần dùng được</td><td class=\"mono\">mAh × (1 − dự phòng)</td><td class=\"mono\">4.000 × 0,8 = 3.200</td></tr><tr><td>Thời lượng</td><td class=\"mono\">mAh dùng được ÷ mA</td><td class=\"mono\">3.200 ÷ 500 = 6,4 giờ</td></tr><tr><td>Pin 6.000 mAh</td><td class=\"mono\">4.800 ÷ 500</td><td class=\"mono\">9,6 giờ</td></tr><tr><td>Hao do GPS</td><td class=\"mono\">mỗi phút khoảng 350 mA</td><td class=\"mono\">mỗi 5 phút khoảng 70 mA</td></tr><tr><td>Ngưỡng cảnh báo</td><td class=\"mono\">dưới 15% pin</td><td class=\"mono\">bật tiết kiệm pin</td></tr></tbody></table>"
      },
      {
        title: "Chọn chiến lược đệm",
        html: "<table class=\"cheat-table\"><thead><tr><th>Loại dữ liệu</th><th>Chiến lược</th><th>Thời hạn</th></tr></thead><tbody><tr><td>Danh mục</td><td class=\"mono\">cache-first</td><td>24 giờ</td></tr><tr><td>Đơn đang mở</td><td class=\"mono\">network-first</td><td>5 phút</td></tr><tr><td>Ảnh chứng từ</td><td class=\"mono\">cache-only</td><td>không hết hạn</td></tr><tr><td>Phản hồi lỗi</td><td>không đệm</td><td>-</td></tr></tbody></table>"
      },
      {
        title: "Thử lại có backoff",
        wide: true,
        html: "<div style=\"margin-top:10px;overflow-x:auto\"><pre><code>async function go(fn, tries = 3) {\n  for (let i = 0; i &lt; tries; i++) {\n    try { return await fn(); }\n    catch (e) {\n      if (i === tries - 1) throw e;\n      const base = 1000 * 2 ** i;      // 1s, 2s, 4s\n      const wait = base + Math.random() * 300;\n      await sleep(wait);\n    }\n  }\n}\n// xau nhat ~ 7 giay backoff + 3 x 8 giay timeout</code></pre></div><p>Luôn có jitter và điểm dừng; gắn khóa idempotency cho thao tác ghi.</p>"
      },
      {
        title: "Checklist dữ liệu nhạy cảm",
        html: "<ul style=\"margin-top:9px;padding-left:16px;font-size:.7rem;line-height:1.55;color:var(--text-soft)\"><li>Token phiên, ảnh giấy tờ, log cá nhân là nhóm bắt buộc mã hóa.</li><li>Khóa nằm trong Keychain (iOS) hoặc Keystore (Android).</li><li>Không đặt khóa trong mã nguồn hay tệp cấu hình của gói cài.</li><li>Loại thư mục nhạy cảm khỏi sao lưu đám mây.</li><li>Xin quyền tối thiểu, chỉ đọc thư mục của ứng dụng.</li><li>Rà log trước phát hành, không ghi nội dung tệp.</li></ul>"
      },
      {
        title: "Dung lượng lưu trữ",
        html: "<table class=\"cheat-table\"><thead><tr><th>Mốc</th><th>Dung lượng</th><th>Hành động</th></tr></thead><tbody><tr><td>Hạn mức</td><td class=\"mono\">512 MB</td><td>cảnh báo ở 80%</td></tr><tr><td>Đang dùng</td><td class=\"mono\">400 MB (78%)</td><td>dọn ảnh đệm</td></tr><tr><td>Sau khi dọn</td><td class=\"mono\">250 MB (49%)</td><td>giải phóng 150 MB</td></tr><tr><td>Số tệp</td><td class=\"mono\">1.200 xuống 720</td><td>xóa 480 ảnh đệm</td></tr></tbody></table>"
      }
    ]
  });

})();
