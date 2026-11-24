/* MobileLab — phần 3: phát hành, cửa hàng, đo lường và cập nhật */
window.MOBILELAB = window.MOBILELAB || { modules: [], lessons: {}, practice: [], cheatsheets: [] };
(function () {
  const T = window.MOBILELAB;

  T.modules.push({
    id: "phat-hanh-va-do-luong",
    num: "03",
    title: "Phát hành và đo lường",
    tone: "yellow",
    blurb: "Ba tháng trước, một nhóm sinh viên có ứng dụng chạy tốt trên máy mình nhưng không ai cài được bản phát hành. Module này đi qua bốn chặng: dựng và ký gói, đưa lên cửa hàng, đo lường bằng sự kiện, rồi cập nhật mà không làm hỏng dữ liệu cũ.",
    lessons: ["build", "store", "analytics", "update"]
  });

  T.lessons["build"] = {
    id: "build",
    module: "phat-hanh-va-do-luong",
    title: "Bản dựng và ký số",
    shortTitle: "Bản dựng",
    subtitle: "Debug, release, biến thể và chữ ký",
    blurb: "Một gói 120 MB dùng chung cho mọi môi trường là công thức của sự cố. Bài này tách bản debug khỏi bản release, chia ba biến thể theo môi trường, giảm kích thước gói và đưa việc ký số vào đường ống tự động.",
    duration: "12 phút",
    level: "Cơ bản",
    tags: ["bản dựng", "ký số", "biến thể", "R8", "App Bundle"],
    metrics: [
      { key: "variants", label: "Biến thể", tone: "blue" },
      { key: "sizeMB", label: "Kích thước", tone: "yellow" },
      { key: "signed", label: "Chữ ký", tone: "mint" },
      { key: "ok", label: "Trạng thái", tone: "coral" }
    ],
    nodes: [
      { id: "source", type: "code", x: 55, y: 80, w: 200, h: 70, label: "Mã nguồn", sub: "nhánh phát hành" },
      { id: "pipeline", type: "layers", x: 340, y: 80, w: 200, h: 70, label: "Đường ống build", sub: "ba môi trường" },
      { id: "key", type: "key", x: 625, y: 80, w: 200, h: 70, label: "Khóa ký trong KMS", sub: "không nằm trên máy" },
      { id: "debug", type: "check", x: 55, y: 310, w: 200, h: 70, label: "Bản debug", sub: "log, chưa nén" },
      { id: "release", type: "file", x: 340, y: 310, w: 200, h: 70, label: "Bản release", sub: "AAB đã ký" },
      { id: "store", type: "disk", x: 625, y: 310, w: 200, h: 70, label: "Gói phát hành", sub: "120 MB, chưa ký" },
      { id: "check", type: "shield", x: 340, y: 195, w: 200, h: 70, label: "Kiểm tra chữ ký", sub: "chặn gói chưa ký" }
    ],
    edges: [
      { id: "source-pipeline", from: "source", to: "pipeline", kind: "request", label: "mã nguồn" },
      { id: "pipeline-debug", from: "pipeline", to: "debug", kind: "control", label: "bản dev" },
      { id: "pipeline-release", from: "pipeline", to: "release", kind: "control", label: "bản prod" },
      { id: "key-release", from: "key", to: "release", kind: "data", label: "ký v1" },
      { id: "release-check", from: "release", to: "check", kind: "control", label: "gửi chữ ký", bow: 22 },
      { id: "check-release", from: "check", to: "release", kind: "response", label: "đạt hoặc chặn", bow: -22 },
      { id: "release-store", from: "release", to: "store", kind: "data", label: "AAB 68 MB" }
    ],
    learn: [
      "Bản debug và bản release là hai sản phẩm riêng, không đổi cờ mà thành nhau.",
      "Mỗi môi trường một biến thể với <code>applicationIdSuffix</code> riêng.",
      "R8, WebP và App Bundle đưa gói 120 MB xuống 68 MB.",
      "Khóa release nằm trong KMS; CI ký và <code>apksigner</code> kiểm lại."
    ],
    steps: [
      {
        short: "Hai sản phẩm",
        type: "concept",
        title: "Debug và release không thay nhau",
        body: "Trong Android Studio hay Xcode, nút chạy tạo ra bản debug: khóa ký mặc định, bật log, không nén mã, đóng gói cả tài nguyên thử nghiệm nên nặng gần 120 MB. Bản release thì bật R8, tắt log, tách tài nguyên theo ngôn ngữ và màn hình. Hai bản không thay nhau được: cài bản debug chồng lên bản release sẽ báo lỗi chữ ký, còn bản release chưa ký thì không cửa hàng nào nhận. Vì vậy hãy coi chúng là hai sản phẩm riêng, mỗi sản phẩm có khóa, cấu hình và đường ống riêng. Đừng đổi cờ trên cùng một bản dựng rồi hy vọng kết quả giống nhau.",
        focus: ["source", "pipeline", "debug", "release"],
        edges: ["source-pipeline", "pipeline-debug", "pipeline-release"],
        metrics: { variants: "1", sizeMB: "120", signed: "không", ok: "chưa" },
        changes: [
          { label: "Loại bản dựng", before: "một bản dùng chung", after: "debug và release tách riêng" },
          { label: "Khóa ký", before: "khóa debug mặc định", after: "khóa riêng cho từng loại" }
        ],
        note: "Lỗi chữ ký khi cài chồng là dấu hiệu sớm, đừng bỏ qua."
      },
      {
        short: "Ba biến thể",
        type: "flow",
        title: "Ba biến thể theo môi trường",
        body: "Ba môi trường cần ba biến thể, không phải ba tệp cấu hình chép tay. Với Android, mỗi flavor có <code>applicationIdSuffix</code> riêng, ví dụ .dev và .staging, nhờ vậy ba bản cài chung một máy mà không ghi đè. Mỗi biến thể trỏ tới một địa chỉ API, một bộ khóa và một tên hiển thị. Tài nguyên thử như ảnh giả hay log chi tiết chỉ đi kèm bản dev. Với iOS, cấu hình build làm việc này qua scheme và tệp xcconfig. Kết quả là bản dev nặng 94 MB vì còn công cụ gỡ lỗi, còn bản production gọn hơn và không chứa gì thừa. Đừng dùng chung một mã ứng dụng cho cả ba, vì dữ liệu thử sẽ lẫn vào bản thật.",
        focus: ["pipeline", "debug", "release"],
        edges: ["pipeline-debug", "pipeline-release"],
        metrics: { variants: "3", sizeMB: "94", signed: "không", ok: "chưa" },
        changes: [
          { label: "Mã ứng dụng", before: "một applicationId", after: "ba hậu tố riêng" },
          { label: "Tài nguyên thử", before: "đi cả ba bản", after: "chỉ bản dev" }
        ],
        note: "Kiểm thử hai bản trên cùng máy là cách rẻ nhất để thấy biến thể đã tách."
      },
      {
        short: "Giảm kích thước",
        type: "detail",
        title: "Từ 120 MB xuống 68 MB",
        body: "Gói 120 MB là kết quả của ba thứ: thư viện không dùng, ảnh chưa nén và tài nguyên thử. Bật R8 để loại mã chết, chuyển ảnh sang WebP, xóa bộ phông chữ thừa, và dùng Android App Bundle để cửa hàng chỉ giao phần cần cho từng máy. Với một ứng dụng đọc tin, ba bước này thường cắt được 40% đến 45%. Ở đây gói production xuống 68 MB, tức giảm 43% so với 120 MB ban đầu. Đừng nén bằng cách bỏ tính năng. Hãy đọc báo cáo kích thước trong Android Studio theo từng mục: mã, tài nguyên, thư viện native. Thư viện native cho bốn kiến trúc CPU là chỗ phình nhanh nhất, và App Bundle tự tách chúng theo máy.",
        focus: ["release", "store", "pipeline"],
        edges: ["release-store", "pipeline-release"],
        metrics: { variants: "3", sizeMB: "68", signed: "không", ok: "chưa" },
        changes: [
          { label: "Kích thước gói", before: "120 MB", after: "68 MB" },
          { label: "Định dạng ảnh", before: "PNG gốc", after: "WebP đã nén" }
        ],
        note: "Đo lại kích thước sau mỗi thư viện mới, đừng đợi đến tuần phát hành."
      },
      {
        short: "Quên ký",
        type: "pitfall",
        title: "Bản release dựng mà không ký",
        body: "Bản release dựng bằng lệnh gradle assembleRelease nhưng thiếu signingConfig sẽ ra tệp chưa ký; cài lên máy chỉ nhận thông báo ứng dụng chưa được cài đặt. Tệ hơn là ký bằng khóa debug: bản đó cài được, nhưng không thể cập nhật lên bản ký bằng khóa thật, và cửa hàng từ chối. Mất tệp keystore cũng là sự cố không sửa được, vì mọi bản cập nhật sau phải cùng khóa. Vì thế khóa release thuộc về tổ chức, không thuộc laptop cá nhân. Hãy để CI đọc khóa từ kho bí mật, ký trong một bước riêng, rồi kiểm bằng <code>apksigner verify</code> trước khi đẩy lên. Pipeline ký đúng là thứ duy nhất bảo đảm mọi gói ra khỏi nhà máy đều cùng một danh tính.",
        focus: ["key", "release", "check"],
        edges: ["key-release", "release-check", "check-release"],
        metrics: { variants: "3", sizeMB: "68", signed: "khóa debug", ok: "lỗi" },
        changes: [
          { label: "Chữ ký gói", before: "khóa debug", after: "thiếu, bị từ chối" },
          { label: "Cài đặt", before: "cài được trên máy thử", after: "báo lỗi chưa cài đặt" }
        ],
        note: "Khóa debug không bao giờ được dùng cho gói ra ngoài."
      },
      {
        short: "Quy trình ký",
        type: "final",
        title: "Pipeline ký và checklist",
        tone: "final",
        body: "Chốt lại quy trình: một, tách ba biến thể dev, staging, prod với mã ứng dụng riêng. Hai, bật R8, WebP và App Bundle, đo lại kích thước sau mỗi lần thêm thư viện. Ba, giữ khóa release trong KMS hoặc kho bí mật của CI, sao lưu hai nơi có kiểm soát. Bốn, để pipeline chạy assembleRelease rồi <code>apksigner verify</code>; chữ ký sai thì dừng, không đẩy lên. Năm, ghi lại versionCode, số hiệu bản dựng và mã commit vào chính gói. Sáu, cài thử bản ký thật lên một máy sạch trước khi gửi cửa hàng. Với số liệu ở đây: ba biến thể, gói production 68 MB, ký bằng khóa release, kiểm tra đạt.",
        focus: "all",
        edges: "all",
        metrics: { variants: "3", sizeMB: "68", signed: "khóa release", ok: "đạt" },
        changes: [
          { label: "Đường ống", before: "ký tay trên máy cá nhân", after: "CI ký bằng khóa trong KMS" },
          { label: "Cổng kiểm tra", before: "không có", after: "chặn gói sai chữ ký" }
        ],
        note: "Khóa mất là mất đường cập nhật; sao lưu phải nằm ngoài máy lập trình viên."
      }
    ]
  };

  T.lessons["store"] = {
    id: "store",
    module: "phat-hanh-va-do-luong",
    title: "Cửa hàng ứng dụng",
    shortTitle: "Cửa hàng",
    subtitle: "Hồ sơ, quy trình duyệt và thời gian chờ",
    blurb: "Cửa hàng không chỉ là nơi tải tệp. Trang ứng dụng, ảnh chụp, phân loại và mô tả quyền quyết định người dùng có bấm cài. Bài này đi qua một lượt duyệt thật, từ lúc gửi gói đến khi bản 2.4 hiện trên kệ.",
    duration: "12 phút",
    level: "Cơ bản",
    tags: ["cửa hàng", "ảnh chụp", "phân loại", "duyệt", "chính sách"],
    metrics: [
      { key: "screenshots", label: "Ảnh chụp", tone: "blue" },
      { key: "reviewDays", label: "Chờ duyệt", tone: "yellow" },
      { key: "policy", label: "Chính sách", tone: "mint" },
      { key: "ok", label: "Trạng thái", tone: "coral" }
    ],
    nodes: [
      { id: "build", type: "file", x: 55, y: 80, w: 200, h: 70, label: "Bản dựng đã ký", sub: "AAB 68 MB" },
      { id: "listing", type: "page", x: 340, y: 80, w: 200, h: 70, label: "Trang ứng dụng", sub: "mô tả và phân loại" },
      { id: "shots", type: "grid", x: 625, y: 80, w: 200, h: 70, label: "Ảnh chụp", sub: "sáu ảnh, hai ngôn ngữ" },
      { id: "policy", type: "shield", x: 55, y: 310, w: 200, h: 70, label: "Chính sách", sub: "quyền riêng tư" },
      { id: "review", type: "queue", x: 340, y: 310, w: 200, h: 70, label: "Hàng đợi duyệt", sub: "máy rồi người" },
      { id: "live", type: "star", x: 625, y: 310, w: 200, h: 70, label: "Bản trên kệ", sub: "2.4, mở 20%" },
      { id: "autocheck", type: "audit", x: 340, y: 195, w: 200, h: 70, label: "Máy kiểm tự động", sub: "chữ ký, API, quyền" }
    ],
    edges: [
      { id: "build-listing", from: "build", to: "listing", kind: "data", label: "gói và mô tả" },
      { id: "shots-listing", from: "shots", to: "listing", kind: "data", label: "ảnh chụp" },
      { id: "listing-review", from: "listing", to: "review", kind: "request", label: "gửi duyệt", bow: 22 },
      { id: "review-listing", from: "review", to: "listing", kind: "response", label: "trả kết quả", bow: -22 },
      { id: "policy-review", from: "policy", to: "review", kind: "control", label: "đối chiếu" },
      { id: "autocheck-review", from: "autocheck", to: "review", kind: "control", label: "kiểm trước" },
      { id: "review-live", from: "review", to: "live", kind: "data", label: "phát hành" }
    ],
    learn: [
      "Trang ứng dụng là mặt tiền: tên, 80 ký tự mô tả ngắn và ảnh chụp quyết định lượt cài.",
      "Mỗi ngôn ngữ cần bộ ảnh riêng, chụp từ bản release trên máy thật.",
      "Duyệt thường mất một đến ba ngày; bị đánh dấu có thể kéo dài bảy ngày.",
      "Khai báo an toàn dữ liệu phải khớp từng quyền trong <code>manifest</code>."
    ],
    steps: [
      {
        short: "Mặt tiền",
        type: "concept",
        title: "Trang ứng dụng là mặt tiền",
        body: "Cửa hàng không chỉ nhận tệp, nó bày ứng dụng cạnh hàng trăm lựa chọn khác. Trang ứng dụng gồm tên, mô tả ngắn 80 ký tự, ảnh chụp, biểu tượng và phân loại; đây là nơi phần lớn người dùng quyết định trong vài giây. Một trang rõ ràng thường nâng tỉ lệ cài từ 20% lên gần 30% số người xem. Ngược lại, ảnh chụp mờ hoặc mô tả chung chung khiến ứng dụng tốt bị bỏ qua. Bài học từ một ứng dụng đặt món: đổi ảnh đầu tiên từ màn hình đăng nhập sang màn hình thực đơn, tỉ lệ cài tăng 18% trong hai tuần mà không sửa một dòng mã. Trang ứng dụng là sản phẩm, không phải thủ tục.",
        focus: ["build", "listing", "shots"],
        edges: ["build-listing", "shots-listing"],
        metrics: { screenshots: "4", reviewDays: "1-3", policy: "chưa rà", ok: "chờ" },
        changes: [
          { label: "Ảnh đầu tiên", before: "màn hình đăng nhập", after: "màn hình thực đơn" },
          { label: "Tỉ lệ cài", before: "20%", after: "gần 30%" }
        ],
        note: "Người dùng không đọc mô tả dài; ảnh đầu tiên làm việc đó."
      },
      {
        short: "Hồ sơ gửi duyệt",
        type: "flow",
        title: "Sáu ảnh chụp và mô tả",
        body: "Hồ sơ gửi duyệt cần đủ bộ: biểu tượng 512 px, ảnh giới thiệu 1024 x 500, từ ba đến tám ảnh chụp mỗi ngôn ngữ, mô tả ngắn 80 ký tự và mô tả đầy đủ dưới 4.000 ký tự. Ảnh chụp nên kể một câu chuyện: màn hình chính, thao tác chính, kết quả, rồi phần cài đặt. Phân loại sai cũng làm giảm hiển thị; một ứng dụng học tiếng nên nằm ở Giáo dục chứ không phải Công cụ. Với hai ngôn ngữ Việt và Anh, cần hai bộ ảnh riêng. Ở đây nhóm chuẩn bị sáu ảnh cho mỗi ngôn ngữ, mô tả nhấn vào việc đặt món trong ba chạm, và khai báo đầy đủ mục an toàn dữ liệu.",
        focus: ["listing", "shots", "build"],
        edges: ["shots-listing", "build-listing"],
        metrics: { screenshots: "6", reviewDays: "1-3", policy: "chưa rà", ok: "chờ" },
        changes: [
          { label: "Ảnh chụp", before: "4 ảnh một ngôn ngữ", after: "6 ảnh mỗi ngôn ngữ" },
          { label: "Mô tả ngắn", before: "cắt từ mô tả dài", after: "80 ký tự có lợi ích rõ" }
        ],
        note: "Ảnh chụp phải là ảnh thật của bản release, không phải bản dựng thử."
      },
      {
        short: "Quy trình duyệt",
        type: "detail",
        title: "Máy kiểm rồi người duyệt",
        body: "Sau khi gửi, gói đi qua kiểm tra tự động rồi mới tới người duyệt. Máy kiểm chữ ký, mức API mục tiêu, quyền khai báo và siêu dữ liệu; phần này thường xong trong vài giờ. Người duyệt đọc mô tả, xem ảnh và thử luồng chính, mất một đến ba ngày với ứng dụng thông thường. Nếu bị đánh dấu, thời gian có thể kéo dài bảy ngày. Vì vậy đừng gửi bản đầu tiên vào chiều thứ Sáu. Ở đây lần gửi đầu bị từ chối vì thiếu đường dẫn chính sách quyền riêng tư, mất bảy ngày; lần hai đủ hồ sơ, duyệt trong hai ngày. Thời gian chờ là một phần của kế hoạch phát hành.",
        focus: ["listing", "review", "policy"],
        edges: ["listing-review", "review-listing", "policy-review"],
        metrics: { screenshots: "6", reviewDays: "7", policy: "thiếu", ok: "từ chối" },
        changes: [
          { label: "Thời gian chờ", before: "1-3 ngày", after: "7 ngày vì bị đánh dấu" },
          { label: "Hồ sơ", before: "thiếu chính sách", after: "trả lại kèm lý do" }
        ],
        note: "Mỗi lần sửa hồ sơ là một lượt xếp hàng mới, không được chen ngang."
      },
      {
        short: "Ba lý do",
        type: "pitfall",
        title: "Ba lý do bị từ chối hay gặp",
        body: "Ba lý do từ chối hay gặp nhất đều sửa được trong một buổi. Thứ nhất là thiếu chính sách quyền riêng tư công khai, trong khi ứng dụng xin quyền vị trí hoặc danh bạ. Thứ hai là ảnh chụp chứa thiết bị, thương hiệu hoặc nội dung không có thật trong ứng dụng. Thứ ba là mô tả hứa tính năng chưa có, hoặc phân loại sai để né kiểm duyệt. Ngoài ra, mức API mục tiêu quá cũ sẽ bị chặn thẳng. Cách phòng: lập checklist hồ sơ, đối chiếu từng quyền với mục an toàn dữ liệu, và chụp ảnh từ chính bản release trên máy thật. Một lần bị từ chối không chỉ mất bảy ngày mà còn làm chậm cả kế hoạch truyền thông.",
        focus: ["policy", "shots", "review"],
        edges: ["policy-review", "shots-listing", "review-listing"],
        metrics: { screenshots: "6", reviewDays: "7", policy: "sửa", ok: "gửi lại" },
        changes: [
          { label: "Chính sách", before: "không có đường dẫn", after: "trang công khai, có ngày" },
          { label: "Ảnh chụp", before: "có khung máy lạ", after: "chụp từ bản release" }
        ],
        note: "Đối chiếu từng quyền với mục an toàn dữ liệu trước khi bấm gửi."
      },
      {
        short: "Gửi duyệt",
        type: "final",
        title: "Checklist gửi cửa hàng",
        tone: "final",
        body: "Chốt quy trình gửi cửa hàng: một, chốt tên, mô tả ngắn 80 ký tự và phân loại đúng. Hai, chuẩn bị sáu ảnh chụp cho mỗi ngôn ngữ, chụp từ bản release trên máy thật. Ba, công khai chính sách quyền riêng tư và khai báo mục an toàn dữ liệu khớp với từng quyền. Bốn, chạy kiểm tra trước khi gửi: chữ ký, mức API mục tiêu, kích thước ảnh. Năm, gửi vào đầu tuần và theo dõi hộp thư của tài khoản nhà phát triển. Sáu, dùng phát hành theo giai đoạn 20% trước khi mở hết. Kết quả ở đây: sáu ảnh, chờ hai ngày, chính sách đạt, bản 2.4 lên kệ. Đừng sửa hồ sơ trong lúc đang chờ duyệt.",
        focus: "all",
        edges: "all",
        metrics: { screenshots: "6", reviewDays: "2", policy: "đạt", ok: "đạt" },
        changes: [
          { label: "Lượt duyệt", before: "bị từ chối, chờ 7 ngày", after: "đạt sau 2 ngày" },
          { label: "Phát hành", before: "mở 100% ngay", after: "mở 20% rồi tăng dần" }
        ],
        note: "Gửi đầu tuần để có người xử lý nếu bị hỏi lại."
      }
    ]
  };

  T.lessons["analytics"] = {
    id: "analytics",
    module: "phat-hanh-va-do-luong",
    title: "Đo lường sử dụng",
    shortTitle: "Đo lường",
    subtitle: "Sự kiện, phễu, giữ chân và quyền riêng tư",
    blurb: "Đo lường không phải là gắn nhiều sự kiện. Bài này chọn tám sự kiện cốt lõi, dựng phễu từ 1.000 lượt mở đến 250 hồ sơ hoàn tất, đọc tỉ lệ giữ chân theo ngày và chặn dữ liệu thừa ngay ở lớp ghi.",
    duration: "12 phút",
    level: "Trung cấp",
    tags: ["sự kiện", "phễu", "giữ chân", "đồng ý", "quyền riêng tư"],
    metrics: [
      { key: "events", label: "Sự kiện", tone: "blue" },
      { key: "funnelPct", label: "Phễu", tone: "yellow" },
      { key: "retentionPct", label: "Giữ chân D7", tone: "mint" },
      { key: "privacy", label: "Riêng tư", tone: "coral" }
    ],
    nodes: [
      { id: "app", type: "user", x: 55, y: 80, w: 200, h: 70, label: "Người dùng", sub: "1.000 lượt mở" },
      { id: "sdk", type: "code", x: 340, y: 80, w: 200, h: 70, label: "Lớp ghi sự kiện", sub: "hàng đợi cục bộ" },
      { id: "event", type: "event", x: 625, y: 80, w: 200, h: 70, label: "Sự kiện", sub: "tên và thuộc tính" },
      { id: "funnel", type: "grid", x: 55, y: 310, w: 200, h: 70, label: "Phễu chuyển đổi", sub: "bốn bước đăng ký" },
      { id: "dash", type: "page", x: 340, y: 310, w: 200, h: 70, label: "Bảng điều khiển", sub: "phễu và giữ chân" },
      { id: "consent", type: "shield", x: 625, y: 310, w: 200, h: 70, label: "Màn hình đồng ý", sub: "chưa đồng ý thì chặn" },
      { id: "filter", type: "audit", x: 340, y: 195, w: 200, h: 70, label: "Bộ lọc thuộc tính", sub: "chỉ trường cho phép" }
    ],
    edges: [
      { id: "app-sdk", from: "app", to: "sdk", kind: "request", label: "ghi sự kiện" },
      { id: "sdk-event", from: "sdk", to: "event", kind: "data", label: "đóng gói" },
      { id: "event-funnel", from: "event", to: "funnel", kind: "data", label: "đếm bước" },
      { id: "funnel-dash", from: "funnel", to: "dash", kind: "data", label: "tỉ lệ từng bước" },
      { id: "consent-sdk", from: "consent", to: "sdk", kind: "control", label: "chặn ghi sớm" },
      { id: "event-filter", from: "event", to: "filter", kind: "control", label: "soi thuộc tính", bow: 22 },
      { id: "filter-event", from: "filter", to: "event", kind: "response", label: "giữ hoặc bỏ", bow: -22 }
    ],
    learn: [
      "Mỗi sự kiện phải trả lời một quyết định, không ai đọc thì bỏ.",
      "Đặt tên theo mẫu đối tượng hành động, ví dụ <code>signup_phone_entered</code>.",
      "Phễu bốn bước cho biết mất ở đâu; một sự kiện cuối luồng thì không.",
      "Chờ đồng ý mới ghi, và chỉ gửi thuộc tính nằm trong danh sách cho phép."
    ],
    steps: [
      {
        short: "Đơn vị đo",
        type: "concept",
        title: "Sự kiện là đơn vị đo",
        body: "Đừng bắt đầu bằng bảng điều khiển, hãy bắt đầu bằng câu hỏi. Muốn biết người dùng rơi ở bước nào của đăng ký, ta cần một sự kiện cho mỗi bước, đặt tên theo mẫu đối tượng hành động như <code>signup_phone_entered</code>, kèm thuộc tính tối thiểu. Mỗi sự kiện phải trả lời được một quyết định: bước này có bị bỏ không, lỗi nào hay gặp, bản nào tệ hơn. Ở đây nhóm đang ghi 12 sự kiện rải rác, nhiều sự kiện không ai xem. Sau khi rà, chỉ còn 8 sự kiện gắn với bốn bước của phễu và ba mã lỗi. Ít mà đọc được còn hơn nhiều mà không ai mở.",
        focus: ["app", "sdk", "event"],
        edges: ["app-sdk", "sdk-event"],
        metrics: { events: "12", funnelPct: "25", retentionPct: "chưa đo", privacy: "chưa" },
        changes: [
          { label: "Danh sách sự kiện", before: "12 sự kiện rải rác", after: "8 sự kiện có người đọc" },
          { label: "Cách đặt tên", before: "tên tùy ý", after: "đối tượng hành động" }
        ],
        note: "Sự kiện không gắn với quyết định nào là chi phí, không phải dữ liệu."
      },
      {
        short: "Phễu bốn bước",
        type: "flow",
        title: "Phễu 1.000 xuống 250",
        body: "Phễu đăng ký có bốn bước: mở ứng dụng, nhập số điện thoại, nhập mã xác thực, hoàn tất hồ sơ. Trong một tháng, 1.000 người mở, 620 người nhập số, 410 người nhập đúng mã, và 250 người hoàn tất hồ sơ. Tỉ lệ cuối phễu là 25%. Nhìn từng bước mới thấy vấn đề: bước nhập số giữ 62%, bước xác thực giữ 66%, bước hồ sơ chỉ giữ 61%. Bước hồ sơ hỏi tới bảy trường, trong đó ba trường không bắt buộc. Nếu bỏ ba trường đó, nhóm ước tính tỉ lệ hoàn tất lên 31%. Phễu chỉ có giá trị khi mỗi bước là một sự kiện riêng; gộp cả luồng thành một sự kiện thì không biết mất ở đâu.",
        focus: ["funnel", "event", "app"],
        edges: ["event-funnel", "funnel-dash", "app-sdk"],
        metrics: { events: "8", funnelPct: "25", retentionPct: "chưa đo", privacy: "chưa" },
        changes: [
          { label: "Độ chi tiết", before: "một sự kiện cuối luồng", after: "bốn sự kiện theo bước" },
          { label: "Bước yếu nhất", before: "không rõ", after: "hồ sơ, giữ 61%" }
        ],
        note: "Số người tuyệt đối ở từng bước dễ đọc hơn phần trăm trần trụi."
      },
      {
        short: "Giữ chân",
        type: "detail",
        title: "Giữ chân theo nhóm ngày",
        body: "Tỉ lệ giữ chân trả lời câu hỏi khác với phễu: người đã cài có quay lại không. Cách đo là chia người dùng theo nhóm cùng ngày cài, rồi đếm bao nhiêu người mở lại ở ngày thứ 1, thứ 7, thứ 30. Ở đây nhóm 1.000 người có 42% quay lại ngày hôm sau và 18% còn dùng ở ngày thứ 7. Con số 18% chỉ có nghĩa khi so với chính phiên bản trước. Điều đáng chú ý là nhóm hoàn tất hồ sơ có tỉ lệ giữ chân ngày thứ 7 là 29%, gấp rưỡi nhóm bỏ dở. Vì vậy cải thiện bước hồ sơ không chỉ tăng phễu mà còn tăng giữ chân. Ghi theo nhóm ngày, đừng lấy trung bình toàn bộ.",
        focus: ["dash", "funnel", "event"],
        edges: ["funnel-dash", "event-funnel"],
        metrics: { events: "8", funnelPct: "25", retentionPct: "18", privacy: "chưa" },
        changes: [
          { label: "Cách đọc", before: "trung bình toàn bộ", after: "theo nhóm ngày cài" },
          { label: "Giữ chân D7", before: "chưa đo", after: "18%, nhóm đủ hồ sơ 29%" }
        ],
        note: "So nhóm hoàn tất với nhóm bỏ dở cho thấy bước hồ sơ đáng đầu tư."
      },
      {
        short: "Thu thập thừa",
        type: "pitfall",
        title: "Dữ liệu thừa và màn hình đồng ý",
        body: "Ba lỗi về quyền riêng tư thường đi cùng thói quen thu thập thừa. Thứ nhất là gắn mã thiết bị hoặc địa chỉ MAC vào mọi sự kiện, dù chỉ cần một mã ngẫu nhiên do ứng dụng sinh. Thứ hai là xin quyền danh bạ và vị trí chính xác ngay khi mở app, trong khi tính năng không dùng tới. Thứ ba là gửi cả nội dung tin nhắn hay số điện thoại dạng thô vào thuộc tính sự kiện. Cách chặn: chỉ gửi thuộc tính có người đọc, băm hoặc lược bỏ dữ liệu định danh, và chờ người dùng đồng ý rồi mới ghi. Lớp ghi sự kiện phải có bộ lọc từ chối trường ngoài danh sách cho phép.",
        focus: ["consent", "filter", "sdk"],
        edges: ["consent-sdk", "event-filter", "filter-event"],
        metrics: { events: "8", funnelPct: "25", retentionPct: "18", privacy: "đạt" },
        changes: [
          { label: "Đồng ý", before: "ghi ngay khi mở app", after: "chờ đồng ý rồi mới gửi" },
          { label: "Thuộc tính", before: "mã thiết bị, số thô", after: "mã ngẫu nhiên, đã lược" }
        ],
        note: "Danh sách trường cho phép là hàng rào rẻ nhất chống thu thập thừa."
      },
      {
        short: "Bộ tối thiểu",
        type: "final",
        title: "Bộ đo lường tối thiểu",
        tone: "final",
        body: "Chốt bộ đo lường tối thiểu: tám sự kiện, bốn bước phễu, ba mã lỗi, một thuộc tính phiên bản. Một, đặt tên theo mẫu đối tượng hành động và giữ danh sách trong một tệp dùng chung. Hai, mỗi sự kiện phải gắn với một quyết định; không ai đọc thì bỏ. Ba, dựng phễu bốn bước và xem tỉ lệ từng bước, không chỉ tỉ lệ cuối. Bốn, đo giữ chân theo nhóm ngày cài ở D1, D7, D30. Năm, chỉ gửi thuộc tính nằm trong danh sách cho phép, chờ đồng ý rồi mới ghi. Sáu, kiểm tra bảng điều khiển bằng một thiết bị thật trước khi phát hành. Với số liệu ở đây: 1.000 xuống 250, giữ chân D7 18%, quyền riêng tư đạt.",
        focus: "all",
        edges: "all",
        metrics: { events: "8", funnelPct: "25", retentionPct: "18", privacy: "đạt" },
        changes: [
          { label: "Bộ sự kiện", before: "12 mục, không ai đọc", after: "8 mục, mỗi mục một quyết định" },
          { label: "Dữ liệu gửi đi", before: "có mã thiết bị", after: "mã ngẫu nhiên, đã đồng ý" }
        ],
        note: "Bảng điều khiển chỉ có giá trị khi mỗi con số dẫn tới một hành động."
      }
    ]
  };

  T.lessons["update"] = {
    id: "update",
    module: "phat-hanh-va-do-luong",
    title: "Cập nhật và tương thích",
    shortTitle: "Cập nhật",
    subtitle: "Phiên bản, cờ tính năng và dữ liệu cũ",
    blurb: "Bản cập nhật là lúc dễ mất người dùng nhất. Bài này đặt phiên bản và cờ tính năng cạnh nhau, phát hành dần theo tỉ lệ, đọc tỉ lệ crash trước khi mở 100% và giữ lớp tương thích đọc được dữ liệu cũ.",
    duration: "12 phút",
    level: "Cơ bản",
    tags: ["phiên bản", "cờ tính năng", "phát hành dần", "migration", "crash"],
    metrics: [
      { key: "version", label: "Phiên bản", tone: "blue" },
      { key: "rolloutPct", label: "Đã mở", tone: "yellow" },
      { key: "crashes", label: "Crash", tone: "coral" },
      { key: "ok", label: "Trạng thái", tone: "mint" }
    ],
    nodes: [
      { id: "server", type: "server", x: 55, y: 80, w: 200, h: 70, label: "Máy chủ cấu hình", sub: "bản tối thiểu 2.4" },
      { id: "store", type: "page", x: 340, y: 80, w: 200, h: 70, label: "Cửa hàng", sub: "bản 2.4, mở 25%" },
      { id: "app", type: "code", x: 625, y: 80, w: 200, h: 70, label: "Ứng dụng đang chạy", sub: "bản 2.1 trên máy" },
      { id: "rollout", type: "signal", x: 55, y: 310, w: 200, h: 70, label: "Phát hành dần", sub: "5% rồi 25%" },
      { id: "compat", type: "layers", x: 340, y: 310, w: 200, h: 70, label: "Lớp tương thích", sub: "đọc dữ liệu 2.1" },
      { id: "crash", type: "alert", x: 625, y: 310, w: 200, h: 70, label: "Giám sát crash", sub: "ngưỡng 1%" },
      { id: "gate", type: "shield", x: 340, y: 195, w: 200, h: 70, label: "Buộc cập nhật", sub: "chỉ khi bản cũ hỏng" }
    ],
    edges: [
      { id: "server-store", from: "server", to: "store", kind: "data", label: "gói 2.4" },
      { id: "store-app", from: "store", to: "app", kind: "request", label: "cập nhật" },
      { id: "rollout-store", from: "rollout", to: "store", kind: "control", label: "mở 5%" },
      { id: "app-compat", from: "app", to: "compat", kind: "data", label: "dữ liệu 2.1" },
      { id: "compat-crash", from: "compat", to: "crash", kind: "data", label: "lỗi chuyển dữ liệu" },
      { id: "server-gate", from: "server", to: "gate", kind: "control", label: "buộc lên 2.4", bow: 22 },
      { id: "gate-server", from: "gate", to: "server", kind: "response", label: "bản tối thiểu", bow: -22 }
    ],
    learn: [
      "Tên phiên bản để người đọc, <code>versionCode</code> để hệ thống so sánh.",
      "Cờ tính năng tách triển khai khỏi bật, nhưng mỗi cờ là một món nợ.",
      "Phát hành 5%, 25%, 100% và tự dừng khi crash vượt 1% trong một giờ.",
      "Migration có số phiên bản, chạy lặp lại được, thử trên bản sao dữ liệu thật."
    ],
    steps: [
      {
        short: "Hai con số",
        type: "concept",
        title: "Phiên bản và cờ tính năng",
        body: "Phiên bản có hai con số không thay nhau được: tên phiên bản 2.4.1 để người dùng đọc, và versionCode 20401 để hệ thống so sánh. Cửa hàng từ chối gói có versionCode không tăng. Bên cạnh đó là cờ tính năng: một khóa từ xa bật tắt phần mới mà không phát hành lại. Cờ giúp tách việc triển khai khỏi việc bật, nên khi có sự cố chỉ cần tắt cờ trong vài phút. Nhưng cờ cũng là nợ: mỗi cờ còn sống là một nhánh mã phải kiểm thử. Ở đây bản 2.4 mang theo cờ new_checkout, bật cho 5% người dùng. Ghi cờ vào bảng cấu hình kèm tỉ lệ và ngày hết hạn.",
        focus: ["server", "store", "app"],
        edges: ["server-store", "store-app"],
        metrics: { version: "2.1", rolloutPct: "0", crashes: "0,4%", ok: "chưa" },
        changes: [
          { label: "Cách bật tính năng", before: "phát hành lại ứng dụng", after: "gạt cờ từ xa" },
          { label: "Phiên bản", before: "2.1, không có cờ", after: "2.4 kèm cờ new_checkout" }
        ],
        note: "Cờ không có ngày hết hạn sẽ sống lâu hơn người viết ra nó."
      },
      {
        short: "Mở dần",
        type: "flow",
        title: "Phát hành 5% rồi 25%",
        body: "Phát hành dần là cách giảm thiệt hại: gói 2.4 lên cửa hàng nhưng chỉ 5% người dùng nhận, sau 24 giờ không có bất thường thì mở 25%, rồi 100%. Trong 24 giờ đầu, tỉ lệ crash tăng từ 0,4% lên 1,8% trên Android 9, vượt ngưỡng dừng 1%. Cửa hàng cho phép tạm dừng phát hành, nhưng người đã nhận thì không thu hồi được. Vì vậy cần cả cờ tính năng: tắt new_checkout từ xa là chặn được phần gây lỗi mà không chờ bản vá. Quy tắc đặt trước: tự động dừng khi crash vượt 1% trong một giờ, và có người trực trong 24 giờ đầu. Không có quy tắc thì cuộc họp sẽ thay cho hệ thống.",
        focus: ["rollout", "store", "crash"],
        edges: ["rollout-store", "store-app", "compat-crash"],
        metrics: { version: "2.4", rolloutPct: "25", crashes: "1,8%", ok: "dừng" },
        changes: [
          { label: "Tỉ lệ mở", before: "5%", after: "25% rồi tạm dừng" },
          { label: "Crash", before: "0,4%", after: "1,8% trên Android 9" }
        ],
        note: "Cửa hàng không thu hồi được bản đã cài; cờ mới là công tắc thật."
      },
      {
        short: "Dữ liệu cũ",
        type: "detail",
        title: "Chuyển dữ liệu từ 2.1 lên 2.4",
        body: "Người dùng cập nhật từ 2.1 lên 2.4 mang theo cơ sở dữ liệu cũ. Nếu bản mới đổi tên cột mà không có bước chuyển, ứng dụng mở lên là trắng màn hình. Cách làm an toàn: mỗi lược đồ có số phiên bản, khi mở thì chạy migration theo thứ tự, mỗi bước chạy một lần và lặp lại được. Trước khi sửa, sao chép tệp cơ sở dữ liệu sang tên dự phòng. Ở đây bước chuyển từ 2 sang 3 quên điền cột trạng thái, khiến 1,8% phiên bị crash. Thử trên bản sao dữ liệu thật của 500 người dùng là bắt được lỗi này trước khi phát hành.",
        focus: ["app", "compat", "crash"],
        edges: ["app-compat", "compat-crash"],
        metrics: { version: "2.4", rolloutPct: "0", crashes: "1,8%", ok: "tắt cờ" },
        changes: [
          { label: "Lược đồ", before: "không có số phiên bản", after: "bước chuyển 2 sang 3" },
          { label: "Sự cố", before: "trắng màn hình", after: "xoay được, đã khoanh vùng" }
        ],
        note: "Migration phải chạy lại được nhiều lần mà không nhân đôi dữ liệu."
      },
      {
        short: "Buộc cập nhật",
        type: "pitfall",
        title: "Ép cập nhật quá tay",
        body: "Buộc cập nhật là vũ khí nặng, chỉ dùng khi bản cũ thực sự không còn dùng được: API đã đổi, lỗ hổng bảo mật, hoặc dữ liệu sai lệch. Nếu lạm dụng, người dùng mạng yếu hoặc máy cũ sẽ bỏ ứng dụng thay vì tải 68 MB. Cách làm đúng là máy chủ trả phiên bản tối thiểu, ứng dụng so với versionCode hiện tại; nếu thấp hơn thì hiện màn hình chặn kèm nút mở cửa hàng, không phải hộp thoại đóng được. Với trường hợp khẩn cấp, cho phép chế độ chỉ đọc: vẫn xem dữ liệu đã tải, không ghi mới. Ở đây nhóm buộc lên 2.4 sau khi vá lỗi chuyển dữ liệu, kèm một tuần thông báo trước.",
        focus: ["gate", "server", "app"],
        edges: ["server-gate", "gate-server", "store-app"],
        metrics: { version: "2.4", rolloutPct: "0", crashes: "0,6%", ok: "buộc lên" },
        changes: [
          { label: "Cổng phiên bản", before: "không có", after: "bản tối thiểu 2.4" },
          { label: "Chế độ khẩn cấp", before: "chặn hoàn toàn", after: "chỉ đọc, vẫn xem dữ liệu" }
        ],
        note: "Thông báo trước một tuần rẻ hơn nhiều so với mất nhóm người dùng cũ."
      },
      {
        short: "Quy trình",
        type: "final",
        title: "Quy trình cập nhật an toàn",
        tone: "final",
        body: "Chốt quy trình cập nhật: một, tăng versionCode mỗi lần gửi, đặt tên phiên bản theo ba số. Hai, đóng gói tính năng mới sau cờ, có tỉ lệ và ngày hết hạn. Ba, phát hành dần 5%, 25%, 100%, tự động dừng khi crash vượt 1% trong một giờ. Bốn, viết migration có số phiên bản, chạy lặp lại được, và thử trên bản sao dữ liệu thật. Năm, chỉ buộc cập nhật khi bản cũ hỏng thật, kèm chế độ chỉ đọc. Sáu, theo dõi crash theo phiên bản hệ điều hành trong 48 giờ đầu. Kết quả ở đây: bản 2.4, mở 100%, crash 0,3%, dữ liệu cũ chuyển xong.",
        focus: "all",
        edges: "all",
        metrics: { version: "2.4", rolloutPct: "100", crashes: "0,3%", ok: "đạt" },
        changes: [
          { label: "Phát hành", before: "mở 100% ngay", after: "5%, 25%, 100% có ngưỡng dừng" },
          { label: "Tương thích", before: "đọc thẳng lược đồ cũ", after: "lớp chuyển có số phiên bản" }
        ],
        note: "Giữ nhật ký từng lần mở tỉ lệ và từng lần tắt cờ để lần sau đọc lại."
      }
    ]
  };

  T.practice.push({
    id: "build-ky-so",
    tag: "BUILD",
    module: "phat-hanh-va-do-luong",
    tags: ["bản dựng", "ký số", "biến thể"],
    title: "Gói 120 MB, ba môi trường, quên ký",
    scenario: "Đội của bạn phát hành một ứng dụng đặt món. Bản dựng hiện tại nặng 120 MB vì đóng gói cả ảnh thử, log và ba bộ cấu hình. Nhóm cần ba môi trường dev, staging, production nhưng vẫn dùng chung một applicationId, nên bản thử ghi đè bản thật trên máy kiểm thử. Tệ hơn, bản release gửi lên cửa hàng tuần trước bị từ chối vì chưa ký; kỹ sư đã dựng bằng assembleRelease mà không cấu hình signingConfig, còn người khác ký bằng khóa debug. Sếp yêu cầu có quy trình để lần sau không lặp lại, vẫn giữ nguyên ngân sách CI hiện có. Bạn chọn hướng nào?",
    metrics: [
      { label: "Kích thước gói", value: "120 MB", danger: true },
      { label: "Biến thể", value: "1" },
      { label: "Chữ ký", value: "chưa có", danger: true }
    ],
    options: [
      "Giữ một bản dựng, đổi tên tệp theo môi trường và ký bằng khóa debug cho nhanh",
      "Tách ba biến thể, đưa khóa release vào KMS và để CI ký mỗi bản dựng",
      "Phát hành bản chưa ký, hướng dẫn người dùng bật cài từ nguồn không rõ",
      "Nén gói xuống dưới 50 MB rồi mới nghĩ đến chuyện ký"
    ],
    correct: 1,
    explain: "Đáp án đúng là tách ba biến thể và để CI ký bằng khóa release lấy từ KMS. Biến thể có <code>applicationIdSuffix</code> riêng nên ba bản cùng tồn tại, tài nguyên thử chỉ đi với dev, còn production bật R8 và App Bundle để giảm từ 120 MB xuống khoảng 68 MB. Khóa release phải thuộc tổ chức, nằm trong kho và chỉ CI đọc được; bước ký chạy riêng rồi apksigner verify, sai thì dừng. Đổi tên tệp không tách được dữ liệu và vẫn xung đột chữ ký. Phát hành bản chưa ký thì không cửa hàng nào nhận. Nén gói không giải quyết danh tính của gói."
  });

  T.practice.push({
    id: "analytics-pheu",
    tag: "ANALYTICS",
    module: "phat-hanh-va-do-luong",
    tags: ["sự kiện", "phễu", "quyền riêng tư"],
    title: "Phễu đăng ký chỉ còn 250 trên 1.000",
    scenario: "Ứng dụng học tiếng Anh của nhóm bạn có 1.000 người mở trong tháng trước, nhưng chỉ 250 người hoàn tất hồ sơ. Phễu hiện tại chỉ có một sự kiện gọi là signup ghi ở cuối luồng, nên không ai biết người dùng rơi ở bước nhập số điện thoại, bước nhập mã xác thực hay bước điền hồ sơ. Một kỹ sư đề nghị gắn thêm sự kiện cho mọi lần chạm, cuộn và thời gian chờ để có nhiều dữ liệu. Bộ phận pháp lý nhắc rằng ứng dụng chưa có màn hình xin đồng ý và đang gửi cả số điện thoại thô. Bạn chọn cách đo nào?",
    metrics: [
      { label: "Người mở", value: "1.000" },
      { label: "Hoàn tất", value: "250" },
      { label: "Tỉ lệ cuối", value: "25%" }
    ],
    options: [
      "Gắn sự kiện cho mọi lần chạm và cuộn, thu càng nhiều càng tốt rồi lọc sau",
      "Đo bốn bước của phễu hồ sơ kèm mã lỗi xác thực, chỉ gửi thuộc tính cần dùng và chờ đồng ý",
      "Thêm quyền truy cập danh bạ và vị trí để biết người dùng ở đâu bỏ dở",
      "Bỏ phễu, chỉ theo dõi số người dùng hoạt động hằng ngày"
    ],
    correct: 1,
    explain: "Đáp án đúng là đo bốn bước của phễu, kèm mã lỗi để biết vì sao rơi. Với 1.000 xuống 250, tỉ lệ cuối là 25%; chỉ khi tách bước mới thấy bước hồ sơ giữ 61% và là chỗ đáng sửa trước. Gắn mọi lần chạm tạo hàng triệu bản ghi không ai đọc, làm bảng điều khiển nhiễu. Danh bạ và vị trí không liên quan đến việc hoàn tất hồ sơ, lại vi phạm nguyên tắc thu thập tối thiểu. Chỉ nhìn số người dùng hoạt động hằng ngày thì không biết mất ở đâu. Nhớ chờ đồng ý rồi mới ghi và lược bỏ số điện thoại thô."
  });

  T.cheatsheets.push({
    id: "release",
    num: "03",
    module: "phat-hanh-va-do-luong",
    title: "Bảng tra phát hành",
    intro: "Bảng tra cho tuần phát hành: checklist trước khi bấm gửi, mốc kích thước gói, mẫu đặt tên sự kiện cho phễu, các điểm chính sách cửa hàng hay chặn, và trình tự cập nhật an toàn. In ra dán cạnh màn hình.",
    cards: [
      {
        title: "Checklist trước khi phát hành",
        html: '<ul style="margin-top:9px;padding-left:16px;font-size:.7rem;line-height:1.55;color:var(--text-soft)"><li>Chữ ký: gói ký bằng khóa release, <code>apksigner verify</code> đạt.</li><li>Phiên bản: versionCode tăng, tên phiên bản đúng ba số.</li><li>Kích thước: đo lại gói, ghi mức tăng so với bản trước.</li><li>Dữ liệu: migration có số phiên bản, đã thử trên bản sao.</li><li>Hồ sơ: sáu ảnh chụp mỗi ngôn ngữ, chính sách công khai.</li><li>Giám sát: bảng crash và ngưỡng dừng 1% đã bật.</li></ul>'
      },
      {
        title: "Mốc kích thước gói",
        wide: true,
        html: '<table class="cheat-table"><thead><tr><th>Mục</th><th>Trước</th><th>Sau</th><th>Cách làm</th></tr></thead><tbody><tr><td>Tổng gói</td><td>120 MB</td><td>68 MB</td><td>R8, WebP, App Bundle</td></tr><tr><td>Mã</td><td>38 MB</td><td>21 MB</td><td>R8 bỏ mã chết</td></tr><tr><td>Ảnh</td><td>46 MB</td><td>24 MB</td><td>WebP, bỏ ảnh thử</td></tr><tr><td>Thư viện native</td><td>28 MB</td><td>15 MB</td><td>Tách theo kiến trúc CPU</td></tr><tr><td>Còn lại</td><td>8 MB</td><td>8 MB</td><td>Phông chữ, âm thanh</td></tr></tbody></table>'
      },
      {
        title: "Mẫu phễu sự kiện",
        html: '<div style="margin-top:10px;overflow-x:auto"><pre><code>app_open                  1000\nsignup_phone_entered       620\nsignup_otp_verified        410\nsignup_profile_completed   250\n# 25% cuoi pheu, buoc ho so giu 61%\n# moi su kien: ten + version + ma loi</code></pre></div><p>Đặt tên theo mẫu đối tượng hành động, không gửi số điện thoại thô.</p>'
      },
      {
        title: "Điểm chính sách hay chặn",
        wide: true,
        html: '<table class="cheat-table"><thead><tr><th>Điểm</th><th>Yêu cầu</th><th>Cách sửa</th></tr></thead><tbody><tr><td>Quyền riêng tư</td><td>Trang công khai, có ngày</td><td>Đăng trước khi gửi</td></tr><tr><td>An toàn dữ liệu</td><td>Khớp từng quyền</td><td>Đối chiếu manifest</td></tr><tr><td>Ảnh chụp</td><td>Đúng nội dung ứng dụng</td><td>Chụp từ bản release</td></tr><tr><td>Mức API</td><td>Không quá cũ</td><td>Nâng target SDK</td></tr><tr><td>Phân loại</td><td>Đúng nhóm nội dung</td><td>Chọn lại danh mục</td></tr></tbody></table>'
      },
      {
        title: "Trình tự cập nhật",
        html: '<ol style="margin-top:9px;padding-left:18px;font-size:.7rem;line-height:1.55;color:var(--text-soft)"><li>Tăng versionCode, gắn cờ cho tính năng mới.</li><li>Mở 5%, theo dõi crash trong 24 giờ.</li><li>Mở 25%, so crash theo phiên bản hệ điều hành.</li><li>Vượt 1% thì tạm dừng và tắt cờ.</li><li>Sửa migration, thử trên 500 bản ghi thật.</li><li>Mở 100%, giữ nhật ký từng lần tăng tỉ lệ.</li></ol>'
      }
    ]
  });

})();
