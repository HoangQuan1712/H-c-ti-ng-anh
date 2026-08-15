# 🌟 FluentActive - Nền Tảng Học Tiếng Anh Thực Hành Mỗi Ngày

> **Phương pháp học tiếng Anh thực chiến 4 kỹ năng** (Writing, Listening, Reading, Speaking) tích hợp trợ lý AI thông minh, kiểm tra xếp loại trình độ đa kỳ thi (CEFR, IELTS, TOEIC, VSTEP), nhóm học tập thời gian thực và đồng bộ cơ sở dữ liệu.

---

## 🚀 Các Tính Năng Nổi Bật

### 1. ✍️ Phần 1: Writing (Luyện Viết & AI Chấm Lỗi Chi Tiết)
- **Đề bài thích ứng thông minh:** Tự động điều chỉnh theo mục tiêu học tập (Giao tiếp, Công sở, Du học, IELTS, v.v.) và trình độ CEFR (A1 - C2).
- **AI Chấm Điểm & Chỉ Ra Từng Lỗi Cụ Thể:**
  - Bóc tách lỗi Ngữ pháp, Từ vựng, Chính tả, Giới từ, Cấu trúc câu.
  - So sánh trực quan: `❌ Lỗi sai của bạn` ➔ `✅ Cách sửa chuẩn`.
  - Giải thích chi tiết quy tắc ngữ pháp bằng tiếng Việt.
  - Chấm điểm 4 tiêu chí chuẩn IELTS (*Task Response, Coherence & Cohesion, Lexical Resource, Grammar Accuracy*).
  - Viết lại bài luận hoàn chỉnh đã trau chuốt (Polished Native Version) kèm phát âm audio.
- **Lưu trữ toàn bộ lịch sử bài viết:** Xem lại chi tiết từng bài viết và các lỗi sai đã sửa theo từng ngày.

### 2. 🎧 Phần 2: Listening (Luyện Nghe Chủ Động & Trắc Nghiệm Phản Xạ)
- Phát audio giọng chuẩn bản xứ với 3 mức tốc độ (0.8x, 1.0x, 1.2x).
- Transcript song ngữ Anh - Việt ẩn/hiện thông minh.
- Bộ câu hỏi trắc nghiệm kiểm tra khả năng bắt ý và phản xạ nghe.

### 3. 📖 Phần 3: Reading (Luyện Đọc Song Song & Bàn Luận Cùng AI Bot)
- **Bố cục Split Workspace 2 cột cuộn độc lập:** Đọc bài báo bên trái không làm trôi khung nhập cảm nghĩ bên phải.
- **Audio Narration & Read-Along:** Tự động phát âm thanh toàn bộ bài viết hoặc từng đoạn riêng biệt, tự động highlight đoạn đang đọc.
- **Tra từ điển tức thì:** Nhấp đúp hoặc bôi đen bất kỳ từ nào để xem nghĩa và lưu vào Sổ tay từ vựng.
- **Lưu bài học Reading:** Bookmark các bài đọc yêu thích và quản lý trong danh mục riêng.
- **AI Discussion Bot:** Trò chuyện, phản biện và luyện diễn đạt quan điểm bằng tiếng Anh theo chủ đề bài đọc.

### 4. 🎙️ Phần 4: Speaking (Voice Studio & Thách Thức 5 Mẫu Câu Daily)
- 5 mẫu câu ứng dụng cao mỗi ngày kèm phiên âm quốc tế và phát âm mẫu.
- Phòng luyện nói AI thu âm giọng thật qua Web Speech API và chấm điểm độ chính xác.

### 5. 🎯 Trung Tâm Khảo Thí (Testing & Certification Hub)
- **4 Chế độ thi:**
  1. *CEFR Diagnostic Placement Test (15 phút)*: Khảo sát xếp loại trình độ A1-C2.
  2. *Weekly Progress Exam (12 phút)*: Bài kiểm tra định kỳ bắt buộc hàng tuần.
  3. *Monthly Benchmark Exam (20 phút)*: Bài kiểm tra lớn tổng hợp bắt buộc cuối tháng.
  4. *Bộ đề chuẩn hóa quốc tế*: Mô phỏng đề thi IELTS, TOEIC, VSTEP.
- **Lịch thi & Deadline thông minh:** Tự động đánh dấu ngày đến hạn và cho phép đặt lịch nhắc nhở thi.
- **Thanh thời gian ghim cố định (`Sticky Locked Timer Bar`):** Luôn theo dõi thời gian làm bài khi cuộn trang.

### 6. 👥 Nhóm Học Tập & Cá Nhân Hóa (Study Groups & Profile)
- Tham gia các nhóm học tập theo chủ đề, áp dụng các từ vựng mục tiêu trong ngày vào đoạn chat để nhận thưởng EXP.
- Đổi Avatar bằng ảnh tải lên từ máy tính, đổi hình nền không gian vũ trụ/tùy chỉnh.
- Quản lý tài khoản, cập nhật thông tin cá nhân và đổi mật khẩu an toàn.

---

## 💻 Hướng Dẫn Cài Đặt & Chạy Ứng Dụng

### 1. Yêu Cầu Hệ Thống
- Đã cài đặt **[Node.js](https://nodejs.org/)** (phiên bản 18+ trở lên).

### 2. Khởi Chạy Máy Chủ

Mở terminal tại thư mục dự án và chạy:

```bash
node server.js
```

Hoặc nhấp đúp chuột vào file:
```
serve.ps1
```

### 3. Truy Cập Ứng Dụng
Mở trình duyệt web và truy cập vào địa chỉ:
👉 **`http://localhost:3000`**

---

## 🛠️ Công Nghệ Sử Dụng
- **Frontend:** Pure Vanilla HTML5, Modern CSS3 (Glassmorphism, 60-120 FPS GPU Acceleration, Split Scroll), ES6+ JavaScript Modules.
- **Backend:** Node.js HTTP Server, REST API Endpoints.
- **Database:** Local JSON Database Server với cơ chế lưu trữ bền vững trên ổ đĩa.
- **AI Integration:** Google Gemini REST API & Smart Offline NLP Heuristic Engine.
- **Audio & Speech:** Web Speech Synthesis API, Web Speech Recognition API.
- **Icons:** Lucide Icons.

---

## 📄 Bản Quyền & Giấy Phép
Dự án được xây dựng phục vụ mục đích học tập và rèn luyện tiếng Anh hàng ngày.
