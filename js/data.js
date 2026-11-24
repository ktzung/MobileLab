/* MobileLab — module nền tảng di động, tình huống luyện tập và cheatsheet */
window.MOBILELAB = window.MOBILELAB || { modules: [], lessons: {}, practice: [], cheatsheets: [] };
(function () {
  const T = window.MOBILELAB;

  T.modules.push({
    id: "nen-tang-di-dong",
    num: "01",
    title: "Nền tảng di động",
    tone: "blue",
    blurb: "Màn hình điện thoại không có một kích thước cố định. Module này đi từ đơn vị dp và mật độ điểm ảnh, qua lưới bốn cột với ngưỡng chạm 48 dp, rồi tới điều hướng tab và ngăn xếp, cuối cùng là giữ trạng thái khi xoay máy.",
    lessons: ["man-hinh", "bo-cuc", "dieu-huong", "trang-thai"]
  });

  T.lessons["man-hinh"] = {
    id: "man-hinh",
    module: "nen-tang-di-dong",
    title: "Màn hình và mật độ điểm ảnh",
    shortTitle: "Màn hình và dp",
    subtitle: "Từ điểm ảnh vật lý đến vùng an toàn",
    blurb: "Cùng một nút có thể to bằng hạt gạo trên máy mật độ cao và bằng ngón tay trên máy cũ. Bài này giải thích dp, mật độ, kích thước vật lý và vùng an toàn để giao diện hiển thị đúng trên mọi thiết bị.",
    duration: "12 phút",
    level: "Cơ bản",
    tags: ["dp", "mật độ", "điểm ảnh", "vùng an toàn", "kích thước"],
    metrics: [
      { key: "widthDp", label: "Chiều rộng", tone: "blue" },
      { key: "density", label: "Mật độ", tone: "mint" },
      { key: "px", label: "Điểm ảnh", tone: "yellow" },
      { key: "safeArea", label: "Vùng an toàn", tone: "coral" }
    ],
    nodes: [
      { id: "device", type: "user", x: 55, y: 80, w: 200, h: 70, label: "Điện thoại 360 dp", sub: "khung thiết kế chuẩn" },
      { id: "density", type: "signal", x: 340, y: 80, w: 200, h: 70, label: "Mật độ 3x", sub: "xxhdpi, 480 dpi" },
      { id: "px", type: "grid", x: 625, y: 80, w: 200, h: 70, label: "Điểm ảnh thật", sub: "1080 x 2340 px" },
      { id: "dp", type: "layers", x: 55, y: 310, w: 200, h: 70, label: "Đơn vị dp", sub: "1 dp = density px" },
      { id: "safe", type: "shield", x: 340, y: 310, w: 200, h: 70, label: "Vùng an toàn", sub: "thanh trên và cử chỉ dưới" },
      { id: "frame", type: "page", x: 625, y: 310, w: 200, h: 70, label: "Khung nội dung", sub: "360 x 752 dp" },
      { id: "notch", type: "alert", x: 340, y: 195, w: 200, h: 70, label: "Tai thỏ và thanh trên", sub: "ăn mất 24 dp" }
    ],
    edges: [
      { id: "device-density", from: "device", to: "density", kind: "request", label: "hỏi mật độ" },
      { id: "density-px", from: "density", to: "px", kind: "data", label: "nhân hệ số" },
      { id: "px-dp", from: "px", to: "dp", kind: "data", label: "chia mật độ" },
      { id: "dp-safe", from: "dp", to: "safe", kind: "control", label: "trừ vùng an toàn" },
      { id: "safe-frame", from: "safe", to: "frame", kind: "data", label: "khung khả dụng" },
      { id: "frame-device", from: "frame", to: "device", kind: "response", label: "vẽ giao diện" },
      { id: "notch-safe", from: "notch", to: "safe", kind: "control", label: "che nội dung" }
    ],
    learn: [
      "Kích thước và khoảng cách dùng <code>dp</code>, cỡ chữ dùng <code>sp</code>.",
      "Điểm ảnh bằng dp nhân hệ số mật độ: <code>1080 px = 360 dp x 3</code>.",
      "Cộng vùng an toàn bằng <code>WindowInsets</code> thay vì số cố định.",
      "Xuất ảnh theo nhóm <code>1x</code>, <code>2x</code>, <code>3x</code> cho từng mật độ."
    ],
    steps: [
      {
        short: "Vì sao dùng dp",
        type: "concept",
        title: "Điểm ảnh không phải đơn vị thiết kế",
        body: "Đặt kích thước theo điểm ảnh là lỗi đầu tiên khi làm ứng dụng di động. Cùng một nút cao 48 px sẽ nhỏ như hạt gạo trên máy mật độ 3x và to gấp ba trên máy đời cũ. Android giải quyết bằng <code>dp</code>, đơn vị độc lập mật độ: 1 dp bằng 1 px trên màn hình mdpi 160 dpi, sau đó nhân theo hệ số của từng máy. Một điện thoại rộng 360 dp ở mật độ 3x có bề ngang thật 1080 px. Nhờ vậy cùng một bố cục 360 dp chạy giống nhau trên máy 720 px và 1440 px, chỉ khác độ nét. Kích thước, lề và khoảng cách dùng dp; cỡ chữ dùng <code>sp</code> để tôn trọng cài đặt chữ lớn.",
        focus: ["device", "density", "px", "dp"],
        edges: ["device-density", "density-px", "px-dp"],
        metrics: { widthDp: "360 dp", density: "3x", px: "1080 px", safeArea: "chưa trừ" },
        changes: [
          { label: "Đơn vị", before: "48 px cố định", after: "48 dp theo mật độ" },
          { label: "Cỡ chữ", before: "px", after: "sp theo cài đặt máy" }
        ],
        note: "Một bản thiết kế 360 dp đúng nghĩa chạy được trên mọi mật độ."
      },
      {
        short: "Đọc mật độ",
        type: "flow",
        title: "Mật độ quyết định số điểm ảnh",
        body: "Mật độ là số điểm ảnh vật lý trên một inch, viết tắt dpi, và hệ điều hành gom thành nhóm: mdpi 1x, hdpi 1,5x, xhdpi 2x, xxhdpi 3x, xxxhdpi 4x. Công thức rất ngắn: điểm ảnh bằng dp nhân hệ số. Màn hình 360 dp nhân 3 cho 1080 px, đúng thông số của phần lớn điện thoại tầm trung hiện nay. Khi xuất ảnh, hãy đặt tên theo nhóm như <code>icon.png</code>, <code>icon@2x.png</code>, <code>icon@3x.png</code> để hệ thống chọn đúng bản. Ngược lại, khi đọc ảnh chụp thiết kế từ Figma hay Sketch, hãy xem khung là 360 hay 390 dp, đừng lấy số px làm chuẩn. Sai bước quy đổi này là mọi khoảng cách lệch theo.",
        focus: ["density", "px", "dp"],
        edges: ["density-px", "px-dp"],
        metrics: { widthDp: "360 dp", density: "3x", px: "1080 px", safeArea: "chưa tính" },
        changes: [
          { label: "Bề ngang thật", before: "360 px", after: "1080 px" },
          { label: "Tài nguyên ảnh", before: "một bản duy nhất", after: "ba bản 1x, 2x, 3x" }
        ],
        note: "Hệ số mật độ đọc từ hệ thống, không đoán theo tên máy."
      },
      {
        short: "Vùng an toàn",
        type: "detail",
        title: "Phần trên và dưới không thuộc về bạn",
        body: "Phần trên và dưới màn hình không hoàn toàn thuộc về bạn. Thanh trạng thái chiếm khoảng 24 dp, tai thỏ có thể ăn vào 30 dp, thanh cử chỉ dưới chiếm thêm 24 dp. Nếu vẽ nút ở mép trên, người dùng sẽ thấy nó bị che hoặc chạm nhầm. Cách đúng là đọc vùng an toàn từ hệ thống, trên Android dùng <code>WindowInsets</code>, trên iOS dùng <code>safeAreaInsets</code>, rồi cộng phần đệm đó vào khung nội dung. Với màn hình 360 x 800 dp, trừ 48 dp an toàn còn 360 x 752 dp để bố trí. Đừng đoán bằng số cố định, vì mỗi máy cắt tai thỏ một kiểu khác nhau.",
        focus: ["safe", "notch", "frame"],
        edges: ["dp-safe", "notch-safe", "safe-frame"],
        metrics: { widthDp: "360 dp", density: "3x", px: "1080 px", safeArea: "48 dp" },
        changes: [
          { label: "Chiều cao dùng được", before: "800 dp", after: "752 dp" },
          { label: "Nguồn số đo", before: "hằng số 24 dp", after: "WindowInsets của máy" }
        ],
        note: "Thanh cử chỉ dưới cũng là vùng an toàn, đừng bỏ qua."
      },
      {
        short: "Bốn lỗi hay gặp",
        type: "pitfall",
        title: "Những chỗ làm lệch giao diện",
        body: "Bốn lỗi lặp lại ở gần như mọi dự án. Một: hardcode <code>width: 360px</code> thay vì 360 dp, làm giao diện teo lại trên máy mật độ cao. Hai: thiết kế trên khung 320 dp rồi ngạc nhiên khi máy 360 dp thừa chỗ; hãy chọn 360 dp làm chuẩn và kiểm tra thêm 320 dp. Ba: dùng px cho cỡ chữ, khiến người đặt chữ lớn vẫn đọc không ra. Bốn: bỏ qua vùng an toàn nên thanh tab dưới bị thanh cử chỉ đè lên. Mỗi lỗi đều lộ ra khi chạy trên máy thật, không lộ trên trình giả lập mặc định. Hãy thử trên một máy nhỏ và một máy có tai thỏ trước khi phát hành.",
        focus: ["device", "frame", "notch", "dp"],
        edges: ["frame-device", "notch-safe", "dp-safe"],
        metrics: { widthDp: "360 dp", density: "3x", px: "1080 px", safeArea: "bị che 48 dp" },
        changes: [
          { label: "Kích thước trong mã", before: "360px", after: "360dp" },
          { label: "Thanh tab dưới", before: "bị đè", after: "cộng đệm an toàn" }
        ],
        note: "Giả lập mặc định che mất lỗi; máy thật mới lộ."
      },
      {
        short: "Checklist",
        type: "final",
        title: "Checklist hiển thị trên mọi máy",
        tone: "final",
        body: "Chốt lại bằng checklist ngắn. Một: mọi kích thước trong mã dùng <code>dp</code>, cỡ chữ dùng <code>sp</code>. Hai: khung thiết kế chuẩn 360 x 800 dp, kiểm tra thêm 320 dp và máy tính bảng. Ba: biết hệ số mật độ của thiết bị đang chạy, 3x nghĩa là 1080 px cho 360 dp. Bốn: cộng vùng an toàn trên và dưới vào khung nội dung. Năm: xuất ảnh theo nhóm 1x, 2x, 3x. Sáu: thử chữ lớn nhất trong cài đặt hệ thống. Bảy: đo lại trên máy thật trước khi phát hành. Làm đủ bảy mục này, phần lớn lỗi hiển thị biến mất trước khi người dùng nhìn thấy.",
        focus: "all",
        edges: "all",
        metrics: { widthDp: "360 dp", density: "3x", px: "1080 px", safeArea: "trừ đủ 48 dp" },
        changes: [
          { label: "Bộ số dùng chung", before: "mỗi máy một kiểu", after: "360 dp, 3x, 1080 px" },
          { label: "Kiểm thử", before: "một máy giả lập", after: "máy nhỏ và máy tai thỏ" }
        ],
        note: "Ba số 360, 3x, 1080 là bộ quy đổi cần nhớ."
      }
    ]
  };

  T.lessons["bo-cuc"] = {
    id: "bo-cuc",
    module: "nen-tang-di-dong",
    title: "Bố cục lưới",
    shortTitle: "Bố cục lưới",
    subtitle: "Bốn cột, lề 16 dp và ngưỡng chạm 48 dp",
    blurb: "Lưới chia cột chỉ đúng khi mỗi ô còn đủ lớn để chạm. Bài này tính vùng nội dung, so ô 82 dp với ngưỡng 48 dp, rồi chỉ ra vì sao bảy cột trên máy 320 dp là quá nhỏ.",
    duration: "12 phút",
    level: "Cơ bản",
    tags: ["lưới", "lề", "ô chạm", "48 dp", "cột"],
    metrics: [
      { key: "widthDp", label: "Chiều rộng", tone: "blue" },
      { key: "cols", label: "Số cột", tone: "mint" },
      { key: "cellDp", label: "Ô mỗi cột", tone: "yellow" },
      { key: "fits", label: "Ngưỡng 48 dp", tone: "coral" }
    ],
    nodes: [
      { id: "screen", type: "grid", x: 55, y: 80, w: 200, h: 70, label: "Màn hình 360 dp", sub: "lề 16 dp hai bên" },
      { id: "gutter", type: "layers", x: 340, y: 80, w: 200, h: 70, label: "Lề 16 dp", sub: "nội dung còn 328 dp" },
      { id: "cols", type: "grid", x: 625, y: 80, w: 200, h: 70, label: "Lưới 4 cột", sub: "mỗi ô 82 dp" },
      { id: "cell", type: "check", x: 55, y: 310, w: 200, h: 70, label: "Ô chạm 82 dp", sub: "trên ngưỡng 48 dp" },
      { id: "touch", type: "shield", x: 340, y: 310, w: 200, h: 70, label: "Ngưỡng 48 dp", sub: "đầu ngón tay khoảng 9 mm" },
      { id: "seven", type: "alert", x: 625, y: 310, w: 200, h: 70, label: "Bảy cột: 41,1 dp", sub: "quá nhỏ để chạm" },
      { id: "adapt", type: "code", x: 340, y: 195, w: 200, h: 70, label: "Lưới thích ứng", sub: "đổi cột theo bề rộng" }
    ],
    edges: [
      { id: "screen-gutter", from: "screen", to: "gutter", kind: "control", label: "trừ hai lề" },
      { id: "gutter-cols", from: "gutter", to: "cols", kind: "data", label: "chia số cột" },
      { id: "cols-cell", from: "cols", to: "cell", kind: "data", label: "ô 82 dp" },
      { id: "cell-touch", from: "cell", to: "touch", kind: "control", label: "so ngưỡng" },
      { id: "touch-seven", from: "touch", to: "seven", kind: "control", label: "dưới ngưỡng" },
      { id: "cols-adapt", from: "cols", to: "adapt", kind: "control", label: "chọn số cột" },
      { id: "adapt-screen", from: "adapt", to: "screen", kind: "response", label: "bố cục mới" }
    ],
    learn: [
      "Vùng nội dung bằng chiều rộng trừ hai lề: <code>360 - 32 = 328 dp</code>.",
      "Ô chạm tối thiểu <strong>48 dp</strong>, khoảng cách tối thiểu 8 dp.",
      "Bốn cột cho 82 dp, sáu cột cho 54,7 dp, bảy cột chỉ 41,1 dp.",
      "Đổi số cột theo bề rộng màn hình thay vì cố định một con số."
    ],
    steps: [
      {
        short: "Trừ lề trước",
        type: "concept",
        title: "Vùng nội dung trước, số cột sau",
        body: "Trước khi chia cột, phải tính vùng nội dung. Lấy chiều rộng màn hình trừ hai lề: 360 dp trừ 2 x 16 dp còn 328 dp. Chia cho 4 cột được 82 dp mỗi ô, vừa đúng vì 328 chia hết. Con số 82 dp này là thứ quyết định bố cục có dùng được hay không, chứ không phải 360 dp. Nhiều nhóm thiết kế quên bước trừ lề nên tính ra 90 dp rồi ngạc nhiên khi ô thực tế nhỏ hơn. Hãy viết công thức ra giấy: <code>cell = (width - 2 x gutter) / cols</code>. Chỉ cần ba số đó, bạn kiểm tra được mọi đề xuất đổi cột trong vài giây.",
        focus: ["screen", "gutter", "cols", "cell"],
        edges: ["screen-gutter", "gutter-cols", "cols-cell"],
        metrics: { widthDp: "360 dp", cols: "4 cột", cellDp: "82 dp", fits: "Đạt" },
        changes: [
          { label: "Vùng nội dung", before: "360 dp", after: "328 dp" },
          { label: "Số đo kiểm tra", before: "bề rộng màn hình", after: "bề rộng mỗi ô" }
        ],
        note: "Sai bước trừ lề là mọi phép chia sau đó đều sai."
      },
      {
        short: "Ngưỡng 48 dp",
        type: "flow",
        title: "Ngưỡng chạm đến từ bàn tay",
        body: "Ngưỡng 48 dp là kết quả đo ngón tay người, không phải con số tùy ý. Đầu ngón tay người lớn rộng khoảng 9 mm, tương đương 48 dp trên màn hình chuẩn, nên vùng chạm nhỏ hơn ngưỡng này khiến người dùng bấm trượt. Material Design khuyến nghị tối thiểu 48 x 48 dp, còn Apple ghi 44 x 44 pt. Ô 82 dp của lưới 4 cột vượt ngưỡng thoải mái, thậm chí chứa được biểu tượng 24 dp và một dòng nhãn. Khi kiểm tra, hãy đo cả khoảng cách giữa hai ô: hai ô 30 dp cách nhau 4 dp vẫn khó chạm vì vùng chạm dính nhau. Quy tắc an toàn: ô từ 48 dp, cách nhau từ 8 dp.",
        focus: ["cell", "touch", "seven"],
        edges: ["cell-touch", "touch-seven"],
        metrics: { widthDp: "360 dp", cols: "4 cột", cellDp: "82 dp", fits: "Đạt 48 dp" },
        changes: [
          { label: "Tiêu chuẩn so sánh", before: "cảm giác khi tự bấm", after: "ngưỡng 48 dp" },
          { label: "Khoảng cách tối thiểu", before: "không quy định", after: "8 dp" }
        ],
        note: "Đo khoảng cách giữa hai ô, không chỉ kích thước ô."
      },
      {
        short: "Sáu hay bảy cột",
        type: "detail",
        title: "Sáu cột vẫn đạt, bảy cột thì không",
        body: "Thử hai đề xuất trên cùng màn hình 360 dp. Sáu cột: 328 chia 6 được 54,7 dp, vẫn trên ngưỡng 48 dp, chỉ cần giảm cỡ biểu tượng và cho nhãn xuống một dòng. Bảy cột: 328 chia 7 được 41,1 dp, dưới ngưỡng, người dùng sẽ bấm nhầm sang ô bên cạnh. Nếu buộc phải bảy cột, cách duy nhất là giảm lề, nhưng lề 8 dp làm nội dung dính mép và trông chật. Với màn hình 320 dp, ngay cả sáu cột cũng chỉ còn 48 dp đúng ngưỡng, không còn chỗ cho khoảng cách. Kết luận thực hành: 4 cột là mặc định, 6 cột là giới hạn cho lưới ảnh nhỏ.",
        focus: ["cols", "cell", "touch", "seven"],
        edges: ["gutter-cols", "cols-cell", "touch-seven"],
        metrics: { widthDp: "320 dp", cols: "7 cột", cellDp: "41,1 dp", fits: "Không đạt" },
        changes: [
          { label: "Số cột", before: "4 cột", after: "7 cột thử nghiệm" },
          { label: "Kích thước ô", before: "82 dp", after: "41,1 dp" }
        ],
        note: "41,1 dp là dưới ngưỡng, dù chỉ thiếu gần 7 dp."
      },
      {
        short: "Lưới thích ứng",
        type: "pitfall",
        title: "Đừng nhồi một con số cột",
        body: "Đừng cố nhồi một con số cột cho mọi thiết bị. Máy tính bảng 600 dp với lề 24 dp, chia 5 cột cho ô 110,4 dp, quá rộng cho một biểu tượng, nên thường dùng 6 hoặc 8 cột. Điện thoại gập mở ra 700 dp cũng cần bố cục khác. Cách làm bền vững là đặt số cột theo bề rộng: dưới 360 dp dùng 2 đến 4 cột, từ 360 đến 600 dp dùng 4 đến 6 cột, trên 600 dp dùng 6 đến 8 cột, rồi kiểm tra lại ô nhỏ nhất. Đừng quên chữ: ô 54,7 dp chứa được biểu tượng nhưng không chứa nổi nhãn hai dòng ở cỡ chữ lớn. Hãy thử với cỡ chữ 130 phần trăm trước khi chốt.",
        focus: ["adapt", "cols", "touch", "screen"],
        edges: ["cols-adapt", "adapt-screen", "cell-touch"],
        metrics: { widthDp: "600 dp", cols: "5 cột", cellDp: "110,4 dp", fits: "Đạt" },
        changes: [
          { label: "Cách chọn cột", before: "một số cố định", after: "theo khoảng bề rộng" },
          { label: "Kiểm tra thêm", before: "chỉ cỡ chữ mặc định", after: "cỡ chữ 130 phần trăm" }
        ],
        note: "Máy rộng cần nhiều cột hơn, nhưng ô vẫn phải đủ lớn."
      },
      {
        short: "Checklist",
        type: "final",
        title: "Checklist chốt lưới bố cục",
        tone: "final",
        body: "Checklist cho lưới bố cục. Một: tính vùng nội dung bằng chiều rộng trừ hai lề, ghi ra con số cụ thể. Hai: chia cho số cột và làm tròn một chữ số thập phân. Ba: so ô nhỏ nhất với ngưỡng <code>48 dp</code>, dưới ngưỡng thì bỏ bớt cột. Bốn: giữ khoảng cách giữa các ô từ 8 dp để vùng chạm không dính nhau. Năm: kiểm tra ở 320, 360 và 600 dp. Sáu: thử cỡ chữ lớn nhất. Bảy: đặt số cột theo bề rộng thay vì cố định. Với bộ số của bài này, 4 cột cho 82 dp, 6 cột cho 54,7 dp, 7 cột cho 41,1 dp và chỉ hai phương án đầu là dùng được.",
        focus: "all",
        edges: "all",
        metrics: { widthDp: "360 dp", cols: "4 cột", cellDp: "82 dp", fits: "Đạt" },
        changes: [
          { label: "Quyết định cuối", before: "thử bảy cột", after: "bốn cột, sáu cột dự phòng" },
          { label: "Bộ số kiểm tra", before: "một kích thước", after: "320, 360, 600 dp" }
        ],
        note: "Ba con số 82, 54,7 và 41,1 dp đủ để trả lời mọi đề xuất."
      }
    ]
  };

  T.lessons["dieu-huong"] = {
    id: "dieu-huong",
    module: "nen-tang-di-dong",
    title: "Điều hướng",
    shortTitle: "Điều hướng",
    subtitle: "Tab, ngăn xếp, liên kết sâu và nút quay lại",
    blurb: "Người dùng phải luôn biết mình đang ở đâu và về lại được. Bài này so sánh tab với ngăn xếp, dựng liên kết sâu đúng cách và đặt giới hạn độ sâu để tránh chồng màn hình.",
    duration: "12 phút",
    level: "Trung cấp",
    tags: ["tab", "ngăn xếp", "liên kết sâu", "quay lại", "độ sâu"],
    metrics: [
      { key: "tabs", label: "Số tab", tone: "blue" },
      { key: "stackDepth", label: "Độ sâu", tone: "mint" },
      { key: "deepLinks", label: "Liên kết sâu", tone: "yellow" },
      { key: "backOk", label: "Nút quay lại", tone: "coral" }
    ],
    nodes: [
      { id: "home", type: "page", x: 55, y: 80, w: 200, h: 70, label: "Tab Trang chủ", sub: "thanh tab dưới" },
      { id: "list", type: "page", x: 340, y: 80, w: 200, h: 70, label: "Danh sách lớp", sub: "trong tab Học tập" },
      { id: "detail", type: "page", x: 625, y: 80, w: 200, h: 70, label: "Chi tiết lớp", sub: "mở từ danh sách" },
      { id: "deep", type: "api", x: 55, y: 310, w: 200, h: 70, label: "Liên kết sâu", sub: "app://lop/42" },
      { id: "back", type: "signal", x: 340, y: 310, w: 200, h: 70, label: "Nút quay lại", sub: "đóng đúng một lớp" },
      { id: "stack", type: "memory", x: 625, y: 310, w: 200, h: 70, label: "Ngăn xếp màn hình", sub: "sâu tối đa 3 lớp" },
      { id: "loop", type: "alert", x: 340, y: 195, w: 200, h: 70, label: "Màn hình lặp", sub: "mở lại chính nó" }
    ],
    edges: [
      { id: "home-list", from: "home", to: "list", kind: "request", label: "chuyển tab" },
      { id: "list-detail", from: "list", to: "detail", kind: "request", label: "mở chi tiết" },
      { id: "deep-detail", from: "deep", to: "detail", kind: "data", label: "mở thẳng lớp 42" },
      { id: "detail-back", from: "detail", to: "back", kind: "control", label: "bấm quay lại" },
      { id: "back-stack", from: "back", to: "stack", kind: "data", label: "bớt một lớp" },
      { id: "stack-home", from: "stack", to: "home", kind: "response", label: "về gốc" },
      { id: "loop-detail", from: "loop", to: "detail", kind: "data", label: "đẩy bản sao" }
    ],
    learn: [
      "Tab là điều hướng ngang cấp, ngăn xếp là điều hướng dọc.",
      "Giữ độ sâu tối đa <strong>3 lớp</strong> cho luồng chính.",
      "Liên kết sâu như <code>app://lop/42</code> phải dựng ngăn xếp giả.",
      "Nút quay lại lấy đúng một lớp, không nhảy về trang chủ."
    ],
    steps: [
      {
        short: "Ba kiểu điều hướng",
        type: "concept",
        title: "Tab, ngăn xếp và liên kết sâu",
        body: "Ứng dụng di động thường dùng ba kiểu điều hướng chồng lên nhau. Thanh tab dưới chia ứng dụng thành bốn khu vực ngang cấp: Trang chủ, Học tập, Thông báo, Tài khoản. Bên trong mỗi tab là một ngăn xếp: mở danh sách lớp, rồi chi tiết lớp, rồi bài học. Liên kết sâu cho phép nhảy thẳng từ thông báo đẩy vào chi tiết lớp mà không cần đi qua hai bước trước. Ba lớp này phải thống nhất, nếu không người dùng bấm thông báo sẽ thấy một ngăn xếp khác với lúc họ tự mở. Quy tắc: tab là ngang cấp, ngăn xếp là dọc, liên kết sâu phải dựng lại đúng ngăn xếp đó.",
        focus: ["home", "list", "detail", "deep"],
        edges: ["home-list", "list-detail", "deep-detail"],
        metrics: { tabs: "4 tab", stackDepth: "0", deepLinks: "0", backOk: "Có" },
        changes: [
          { label: "Khu vực chính", before: "một màn hình dài", after: "bốn tab ngang cấp" },
          { label: "Đường vào chi tiết", before: "chỉ từ danh sách", after: "danh sách và liên kết sâu" }
        ],
        note: "Ba kiểu điều hướng phải dùng chung một bảng định tuyến."
      },
      {
        short: "Ngăn xếp",
        type: "flow",
        title: "Mỗi lần mở là một lớp",
        body: "Mỗi lần mở màn hình mới, một lớp được đẩy vào ngăn xếp. Bấm quay lại thì lấy đúng một lớp ra, không phải nhảy về trang chủ. Với luồng Trang chủ, Danh sách lớp, Chi tiết lớp, độ sâu là 3, và ba lần bấm quay lại mới thoát ứng dụng. Nếu màn hình chi tiết tự mở thêm một bản sao của chính nó, ngăn xếp phình ra và người dùng phải bấm quay lại nhiều lần vô ích. Hãy đặt giới hạn mềm: quá 3 lớp thì cân nhắc gộp hoặc mở tab mới. Trên Android, <code>onBackPressed</code> cũ và <code>OnBackPressedDispatcher</code> mới cần cùng một logic, đừng xử lý riêng lẻ.",
        focus: ["list", "detail", "back", "stack"],
        edges: ["list-detail", "detail-back", "back-stack", "stack-home"],
        metrics: { tabs: "4 tab", stackDepth: "2", deepLinks: "0", backOk: "Có" },
        changes: [
          { label: "Độ sâu ngăn xếp", before: "1 lớp", after: "3 lớp" },
          { label: "Số lần bấm để thoát", before: "1", after: "3" }
        ],
        note: "Quay lại là lấy một lớp, không phải nhảy về gốc."
      },
      {
        short: "Liên kết sâu",
        type: "detail",
        title: "Dựng ngăn xếp giả cho liên kết sâu",
        body: "Liên kết sâu là địa chỉ mở thẳng vào một màn hình, ví dụ <code>app://lop/42</code>. Khi người dùng bấm thông báo, hệ thống chuyển liên kết cho ứng dụng, và ứng dụng phải dựng ngăn xếp giả: Trang chủ, Danh sách lớp, Chi tiết lớp 42. Thiếu bước dựng này, nút quay lại sẽ đóng ứng dụng ngay từ màn hình đầu, cảm giác như bị đá ra ngoài. Liên kết sâu cũng cần kiểm tra tham số: lớp 42 có thể đã bị xóa, khi đó hiển thị thông báo thay vì màn hình trắng. Hãy đặt một bảng định tuyến duy nhất cho cả tab, ngăn xếp và liên kết sâu để ba luồng không lệch nhau.",
        focus: ["deep", "detail", "back", "stack"],
        edges: ["deep-detail", "detail-back", "back-stack"],
        metrics: { tabs: "4 tab", stackDepth: "3", deepLinks: "1", backOk: "Có" },
        changes: [
          { label: "Ngăn xếp khi mở từ thông báo", before: "chỉ một màn hình", after: "ba lớp dựng giả" },
          { label: "Tham số sai", before: "màn hình trắng", after: "thông báo lớp không tồn tại" }
        ],
        note: "Không có ngăn xếp giả thì nút quay lại vô nghĩa."
      },
      {
        short: "Chồng quá sâu",
        type: "pitfall",
        title: "Vòng lặp màn hình và ngăn xếp sâu",
        body: "Chồng màn hình quá sâu là lỗi khó thấy khi tự thử nhưng rất rõ với người dùng thật. Mở thông báo, mở lớp, mở bài, mở tệp đính kèm, rồi mở lại lớp từ tệp: sau năm bước ngăn xếp đã sâu 5 và nút quay lại phải bấm năm lần mới về được. Cách xử lý là mỗi tab chỉ giữ một ngăn xếp riêng, và khi mở lại một màn hình đã có trong ngăn xếp thì đưa nó lên đầu thay vì đẩy bản sao. Với liên kết sâu, dựng ngăn xếp giả đúng một lần. Đặt giới hạn 3 lớp cho luồng chính, và ghi log khi vượt ngưỡng để phát hiện vòng lặp.",
        focus: ["loop", "detail", "back", "stack"],
        edges: ["loop-detail", "detail-back", "back-stack"],
        metrics: { tabs: "4 tab", stackDepth: "5", deepLinks: "2", backOk: "Có" },
        changes: [
          { label: "Số bản sao chi tiết", before: "2 bản", after: "1 bản, đưa lên đầu" },
          { label: "Giới hạn", before: "không có", after: "3 lớp cho luồng chính" }
        ],
        note: "Mở lại màn hình đã có thì đưa lên đầu, đừng đẩy bản sao."
      },
      {
        short: "Checklist",
        type: "final",
        title: "Checklist điều hướng",
        tone: "final",
        body: "Checklist điều hướng. Một: chọn 3 đến 5 tab, mỗi tab là một ngăn xếp riêng. Hai: nút quay lại luôn lấy đúng một lớp ra, không nhảy về gốc. Ba: giữ độ sâu tối đa 3 lớp cho luồng chính. Bốn: mở lại màn hình đã có thì đưa lên đầu, không tạo bản sao. Năm: liên kết sâu dựng ngăn xếp giả đủ để nút quay lại có nghĩa. Sáu: xử lý tham số sai bằng thông báo rõ ràng. Bảy: kiểm tra cả nút quay lại hệ thống và nút trên thanh tiêu đề. Với bốn tab và độ sâu 3, người dùng luôn về được trang chủ trong tối đa ba lần bấm.",
        focus: "all",
        edges: "all",
        metrics: { tabs: "4 tab", stackDepth: "3", deepLinks: "2", backOk: "Có" },
        changes: [
          { label: "Độ sâu tối đa", before: "5 lớp", after: "3 lớp" },
          { label: "Liên kết sâu", before: "mở rời rạc", after: "dựng kèm ngăn xếp" }
        ],
        note: "Bốn tab, ba lớp, một bảng định tuyến là đủ cho hầu hết ứng dụng."
      }
    ]
  };

  T.lessons["trang-thai"] = {
    id: "trang-thai",
    module: "nen-tang-di-dong",
    title: "Quản lý trạng thái",
    shortTitle: "Trạng thái",
    subtitle: "Giữ form qua xoay máy và lưu nháp bền vững",
    blurb: "Xoay máy là lúc ứng dụng dựng lại màn hình và dễ làm mất thứ người dùng vừa gõ. Bài này phân loại trạng thái, dùng ViewModel cho dữ liệu tạm và ghi nháp bền vững để không mất nội dung.",
    duration: "12 phút",
    level: "Trung cấp",
    tags: ["trạng thái", "ViewModel", "xoay máy", "bản nháp", "khôi phục"],
    metrics: [
      { key: "states", label: "Số trạng thái", tone: "blue" },
      { key: "shared", label: "Chia sẻ", tone: "mint" },
      { key: "rebuilds", label: "Dựng lại", tone: "yellow" },
      { key: "lost", label: "Mất dữ liệu", tone: "coral" }
    ],
    nodes: [
      { id: "form", type: "task", x: 55, y: 80, w: 200, h: 70, label: "Form đăng ký lớp", sub: "họ tên, email, ghi chú" },
      { id: "local", type: "memory", x: 340, y: 80, w: 200, h: 70, label: "Trạng thái cục bộ", sub: "biến trong activity" },
      { id: "vm", type: "code", x: 625, y: 80, w: 200, h: 70, label: "ViewModel", sub: "sống qua xoay máy" },
      { id: "store", type: "disk", x: 55, y: 310, w: 200, h: 70, label: "Lưu tạm bền vững", sub: "SharedPreferences" },
      { id: "rotate", type: "clock", x: 340, y: 310, w: 200, h: 70, label: "Xoay máy", sub: "activity bị tạo lại" },
      { id: "restore", type: "check", x: 625, y: 310, w: 200, h: 70, label: "Khôi phục form", sub: "điền lại đúng chỗ" },
      { id: "share", type: "layers", x: 340, y: 195, w: 200, h: 70, label: "Trạng thái chia sẻ", sub: "giỏ hàng, phiên đăng nhập" }
    ],
    edges: [
      { id: "form-local", from: "form", to: "local", kind: "data", label: "gán giá trị" },
      { id: "local-rotate", from: "local", to: "rotate", kind: "control", label: "bị hủy" },
      { id: "rotate-vm", from: "rotate", to: "vm", kind: "control", label: "tạo lại màn hình" },
      { id: "vm-restore", from: "vm", to: "restore", kind: "data", label: "khôi phục" },
      { id: "store-restore", from: "store", to: "restore", kind: "data", label: "đọc bản nháp" },
      { id: "restore-form", from: "restore", to: "form", kind: "response", label: "điền lại" },
      { id: "share-vm", from: "share", to: "vm", kind: "data", label: "đọc chung" }
    ],
    learn: [
      "Phân biệt trạng thái cục bộ, chia sẻ và bền vững trước khi viết mã.",
      "Đưa dữ liệu form vào <code>ViewModel</code> để sống qua xoay máy.",
      "Ghi bản nháp sau khoảng <strong>500 ms</strong> ngừng gõ.",
      "Xóa bản nháp sau khi gửi thành công để không gặp dữ liệu cũ."
    ],
    steps: [
      {
        short: "Ba loại trạng thái",
        type: "concept",
        title: "Ba loại trạng thái cần phân biệt",
        body: "Trạng thái là mọi thứ ứng dụng đang nhớ: chữ người dùng đã gõ, tab đang chọn, danh sách đã tải, giỏ hàng. Có ba loại cần phân biệt. Trạng thái cục bộ chỉ thuộc một màn hình, như nội dung form đăng ký lớp. Trạng thái chia sẻ dùng ở nhiều màn hình, như giỏ hàng hay phiên đăng nhập. Trạng thái bền vững phải còn sau khi tắt ứng dụng, như bản nháp. Phân loại sai dẫn đến hai lỗi ngược nhau: giữ quá lâu thứ chỉ nên sống trong một màn hình, hoặc làm mất thứ người dùng đã gõ. Hãy ghi rõ mỗi biến thuộc loại nào trước khi viết mã nguồn.",
        focus: ["form", "local", "vm", "share"],
        edges: ["form-local", "share-vm"],
        metrics: { states: "3 trường", shared: "0", rebuilds: "0", lost: "0" },
        changes: [
          { label: "Cách nhìn dữ liệu", before: "một đống biến", after: "ba loại trạng thái" },
          { label: "Nơi lưu form", before: "biến trong activity", after: "chưa quyết định" }
        ],
        note: "Gọi đúng tên loại trạng thái là nửa việc sửa lỗi."
      },
      {
        short: "Xoay máy",
        type: "flow",
        title: "Xoay máy làm dựng lại màn hình",
        body: "Khi xoay máy, Android mặc định hủy activity và tạo lại từ đầu để nạp tài nguyên mới cho màn hình ngang. Mọi biến giữ trong activity biến mất, nên form đăng ký lớp trắng trơn dù người dùng vừa gõ xong ba trường. Cơ chế <code>onSaveInstanceState</code> chỉ cứu được lượng nhỏ dữ liệu, giới hạn khoảng 1 MB và không phù hợp cho danh sách dài. Cách đúng là đưa dữ liệu form vào <code>ViewModel</code>, thứ sống qua lần dựng lại cấu hình. Với bản nháp cần sống qua cả việc tắt ứng dụng, phải ghi xuống bộ nhớ bền vững. Hai lớp này bổ sung nhau, không thay thế nhau.",
        focus: ["local", "rotate", "vm", "form"],
        edges: ["local-rotate", "rotate-vm", "vm-restore"],
        metrics: { states: "3 trường", shared: "0", rebuilds: "1", lost: "3" },
        changes: [
          { label: "Nội dung form", before: "đã gõ đủ ba trường", after: "trắng sau khi xoay" },
          { label: "Đối tượng bị hủy", before: "không", after: "activity cũ" }
        ],
        note: "Trắng form sau khi xoay là triệu chứng, không phải nguyên nhân."
      },
      {
        short: "ViewModel",
        type: "detail",
        title: "ViewModel giữ, bản nháp cứu",
        body: "<code>ViewModel</code> giữ trạng thái trong bộ nhớ suốt vòng đời màn hình, kể cả khi xoay máy, nhưng mất khi tiến trình bị hệ thống thu hồi. Vì vậy form đăng ký lớp cần thêm bản nháp ghi xuống <code>SharedPreferences</code> hoặc Room sau mỗi lần người dùng ngừng gõ khoảng 500 ms. Khi mở lại, đọc bản nháp và điền vào form, kèm nhãn cho biết đây là bản nháp lưu lúc mấy giờ. Cách này chịu được xoay máy, chuyển ứng dụng, tắt máy và cả khi hệ thống thu hồi tiến trình. Nhớ xóa bản nháp sau khi gửi thành công, nếu không lần sau người dùng lại thấy dữ liệu cũ.",
        focus: ["vm", "store", "restore", "form"],
        edges: ["rotate-vm", "vm-restore", "store-restore", "restore-form"],
        metrics: { states: "3 trường", shared: "0", rebuilds: "1", lost: "0" },
        changes: [
          { label: "Nơi giữ form", before: "biến activity", after: "ViewModel" },
          { label: "Bản nháp", before: "không có", after: "ghi sau 500 ms ngừng gõ" }
        ],
        note: "ViewModel sống qua xoay máy nhưng không sống qua thu hồi tiến trình."
      },
      {
        short: "Trạng thái chia sẻ",
        type: "pitfall",
        title: "Đừng giữ hai bản sao của một dữ liệu",
        body: "Trạng thái chia sẻ dễ sinh lỗi tinh vi. Nếu form đăng ký lớp và giỏ hàng cùng đọc một kho chung, một thay đổi ở màn hình này có thể làm màn hình kia hiển thị dữ liệu cũ hoặc nhảy giá trị. Hãy tách kho theo miền nghiệp vụ: phiên đăng nhập một kho, giỏ hàng một kho, bản nháp form một kho. Khi một sự kiện cập nhật kho, mọi màn hình đang mở phải nhận cùng một bản. Đừng giữ hai bản sao của cùng dữ liệu rồi tự đồng bộ bằng tay, vì thứ tự cập nhật sẽ quyết định kết quả và rất khó tái hiện lỗi. Ghi log mỗi lần ghi kho để lần ra nguyên nhân.",
        focus: ["share", "vm", "form", "store"],
        edges: ["share-vm", "form-local"],
        metrics: { states: "3 trường", shared: "2 kho", rebuilds: "1", lost: "1" },
        changes: [
          { label: "Kho dữ liệu", before: "một kho chung", after: "ba kho theo miền" },
          { label: "Đồng bộ", before: "tự làm bằng tay", after: "một chiều từ kho" }
        ],
        note: "Hai bản sao của một dữ liệu là nguồn gốc của phần lớn lỗi lạ."
      },
      {
        short: "Checklist",
        type: "final",
        title: "Checklist giữ trạng thái form",
        tone: "final",
        body: "Checklist trạng thái cho màn hình có form. Một: liệt kê ba trường và đánh dấu loại trạng thái của từng trường. Hai: đưa dữ liệu form vào <code>ViewModel</code> để sống qua xoay máy. Ba: ghi bản nháp xuống bộ nhớ bền vững sau khoảng 500 ms ngừng gõ. Bốn: khôi phục bản nháp khi mở lại và hiển thị thời điểm lưu. Năm: xóa bản nháp sau khi gửi thành công. Sáu: tách kho chia sẻ theo miền nghiệp vụ. Bảy: thử xoay máy, chuyển ứng dụng và tắt máy giữa lúc đang gõ. Với ba trường và hai lớp lưu, không lần xoay máy nào làm mất nội dung nữa.",
        focus: "all",
        edges: "all",
        metrics: { states: "3 trường", shared: "2 kho", rebuilds: "1", lost: "0" },
        changes: [
          { label: "Kết quả sau xoay", before: "mất cả ba trường", after: "giữ đủ ba trường" },
          { label: "Bản nháp", before: "không dọn", after: "xóa sau khi gửi" }
        ],
        note: "Ba trường, hai lớp lưu, một lần xóa nháp sau khi gửi."
      }
    ]
  };

  T.practice.push({
    id: "layout-6-cot",
    tag: "LAYOUT",
    module: "nen-tang-di-dong",
    title: "Sáu cột hay bảy cột cho lưới đặt lịch",
    scenario: "Một nhóm sinh viên làm ứng dụng đặt lịch học. Màn hình chính rộng 360 dp, lề hai bên 16 dp, đang chia lưới 4 cột và mỗi ô đo được 82 dp, vượt ngưỡng chạm 48 dp. Giảng viên yêu cầu hiển thị nhiều mục hơn trên một hàng để giảm cuộn, nên nhóm cân nhắc tăng lên 6 cột hoặc 7 cột. Với 6 cột, mỗi ô còn 54,7 dp; với 7 cột, mỗi ô chỉ còn 41,1 dp. Một thành viên đề nghị giữ nguyên 4 cột và bỏ ngưỡng 48 dp vì màn hình đã đủ rộng. Nhóm có một buổi để chốt trước khi nộp bản thử.",
    metrics: [
      { label: "Chiều rộng", value: "360 dp" },
      { label: "Lề hai bên", value: "16 dp" },
      { label: "Ô 4 cột", value: "82 dp" }
    ],
    options: [
      "Tăng lên 7 cột để mỗi hàng hiện bảy mục, chấp nhận ô 41,1 dp",
      "Tăng lên 6 cột, mỗi ô 54,7 dp vẫn trên ngưỡng 48 dp",
      "Giữ 4 cột và giảm lề xuống 8 dp để nới rộng ô",
      "Bỏ ngưỡng 48 dp vì màn hình 360 dp đã đủ rộng"
    ],
    correct: 1,
    explain: "Đáp án đúng là 6 cột. Vùng nội dung là <code>360 - 2 x 16 = 328 dp</code>; chia 6 được 54,7 dp, vẫn trên ngưỡng 48 dp nên vẫn chạm chính xác. Bảy cột cho 41,1 dp, dưới ngưỡng, ngón tay sẽ bấm nhầm sang ô bên cạnh, đúng lỗi cần tránh. Giảm lề xuống 8 dp chỉ nới thêm 16 dp cho cả hàng, không giải quyết yêu cầu hiển thị nhiều mục và làm nội dung dính mép. Bỏ ngưỡng 48 dp là bỏ tiêu chuẩn duy nhất bảo vệ người dùng, vì bề rộng màn hình không liên quan đến kích thước ngón tay."
  });

  T.practice.push({
    id: "state-xoay-may",
    tag: "STATE",
    module: "nen-tang-di-dong",
    title: "Xoay máy làm mất form đăng ký lớp",
    scenario: "Ứng dụng của trung tâm đào tạo có form đăng ký lớp gồm họ tên, email và ghi chú. Người dùng thường gõ dở rồi xoay máy để xem lịch, và mỗi lần như vậy form trắng trơn. Nhóm kỹ thuật đang cân nhắc bốn cách: chỉ giữ trạng thái trong activity, dựa hoàn toàn vào onSaveInstanceState, đưa form vào ViewModel kèm lưu nháp bền vững, hoặc khóa xoay màn hình. Ứng dụng còn phải chịu được việc người dùng chuyển sang ứng dụng khác rồi quay lại sau vài giờ. Thời gian còn hai ngày trước buổi kiểm thử với ba mươi học viên thật.",
    metrics: [
      { label: "Trường dữ liệu", value: "3" },
      { label: "Sự kiện", value: "xoay máy" },
      { label: "Mất dữ liệu", value: "3/3 trường" }
    ],
    options: [
      "Giữ trạng thái trong activity và chấp nhận mất khi xoay máy",
      "Chỉ dựa vào onSaveInstanceState cho cả ba trường",
      "Đưa form vào ViewModel và ghi bản nháp bền vững khi ngừng gõ",
      "Khóa xoay màn hình để activity không bị dựng lại"
    ],
    correct: 2,
    explain: "Đáp án đúng là ViewModel cộng bản nháp bền vững. <code>ViewModel</code> sống qua lần dựng lại do xoay máy, nên ba trường còn nguyên ngay khi màn hình ngang hiện ra. Bản nháp ghi xuống bộ nhớ bền vững sau khoảng 500 ms ngừng gõ cứu trường hợp tiến trình bị thu hồi khi người dùng chuyển ứng dụng vài giờ. onSaveInstanceState chỉ giữ được lượng nhỏ và không đủ tin cậy cho ghi chú dài. Khóa xoay màn hình là né vấn đề chứ không giải quyết, còn chặn người dùng xem lịch. Giữ trạng thái trong activity thì mất ngay lần xoay đầu tiên, đúng hiện tượng đang gặp."
  });

  T.cheatsheets.push({
    id: "mobile-basics",
    num: "01",
    module: "nen-tang-di-dong",
    title: "Bảng tra nền tảng di động",
    intro: "Bảng tra nhanh cho bài nền tảng di động: quy đổi dp sang điểm ảnh theo mật độ, kích thước ô chạm tối thiểu, sơ đồ tab và ngăn xếp, checklist giữ trạng thái khi xoay máy và mẫu lưu nháp.",
    cards: [
      {
        title: "Quy đổi dp, mật độ và điểm ảnh",
        wide: true,
        html: "<table class=\"cheat-table\"><thead><tr><th>Nhóm</th><th>Hệ số</th><th>dpi</th><th>360 dp bằng</th></tr></thead><tbody><tr><td class=\"mono\">mdpi</td><td>1x</td><td>160</td><td>360 px</td></tr><tr><td class=\"mono\">hdpi</td><td>1,5x</td><td>240</td><td>540 px</td></tr><tr><td class=\"mono\">xhdpi</td><td>2x</td><td>320</td><td>720 px</td></tr><tr><td class=\"mono\">xxhdpi</td><td>3x</td><td>480</td><td>1080 px</td></tr><tr><td class=\"mono\">xxxhdpi</td><td>4x</td><td>640</td><td>1440 px</td></tr></tbody></table><p>Công thức: <code>px = dp x density</code>. Máy 360 dp ở mật độ 3x có bề ngang thật 1080 px.</p>"
      },
      {
        title: "Kích thước ô chạm",
        html: "<table class=\"cheat-table\"><thead><tr><th>Thành phần</th><th>Tối thiểu</th><th>Nên dùng</th></tr></thead><tbody><tr><td>Ô trong lưới</td><td>48 dp</td><td>56 dp</td></tr><tr><td>Nút chính</td><td>48 dp</td><td>56 dp</td></tr><tr><td>Biểu tượng</td><td>24 dp</td><td>24 dp trong ô 48</td></tr><tr><td>Khoảng cách ô</td><td>8 dp</td><td>16 dp</td></tr></tbody></table><p>Đầu ngón tay người lớn rộng khoảng 9 mm, tương đương 48 dp.</p>"
      },
      {
        title: "Sơ đồ tab và ngăn xếp",
        wide: true,
        html: "<div style=\"margin-top:10px;overflow-x:auto\"><pre><code>Tab Trang chu     Tab Hoc tap      Tab Thong bao\n   |                 |                 |\n Trang chu  ->  Danh sach lop  ->  Chi tiet lop 42\n                     ^\n            app://lop/42  (dung ngan xep gia)\n\nQuay lai: bo dung mot lop, khong nhay ve goc\nDo sau toi da: 3 lop cho luong chinh</code></pre></div><p>Tab là ngang cấp, ngăn xếp là dọc. Liên kết sâu phải dựng kèm ngăn xếp giả.</p>"
      },
      {
        title: "Checklist khi xoay máy",
        html: "<ul style=\"margin-top:9px;padding-left:16px;font-size:.7rem;line-height:1.55;color:var(--text-soft)\"><li>Dữ liệu form nằm trong <code>ViewModel</code>, không nằm trong biến activity.</li><li>Ghi bản nháp sau khoảng 500 ms ngừng gõ.</li><li>Khôi phục bản nháp khi mở lại và hiện thời điểm lưu.</li><li>Xóa bản nháp sau khi gửi thành công.</li><li>Tách kho chia sẻ theo miền nghiệp vụ.</li><li>Thử xoay máy, chuyển ứng dụng và tắt máy giữa lúc đang gõ.</li></ul>"
      },
      {
        title: "Mẫu lưu nháp",
        html: "<div style=\"margin-top:10px;overflow-x:auto\"><pre><code>const KEY = \"nhap-dang-ky\";\n\nfunction luuNhap(form) {\n  localStorage.setItem(KEY, JSON.stringify({\n    hoTen: form.hoTen,\n    email: form.email,\n    ghiChu: form.ghiChu,\n    luc: Date.now()\n  }));\n}\n\nfunction docNhap() {\n  const raw = localStorage.getItem(KEY);\n  return raw ? JSON.parse(raw) : null;\n}\n\n// sau khi gui thanh cong\nlocalStorage.removeItem(KEY);</code></pre></div><p>Đọc lại lúc mở màn hình, điền vào form và ghi rõ đây là bản nháp.</p>"
      }
    ]
  });
})();
