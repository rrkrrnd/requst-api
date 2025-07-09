# Requst Client

Requst Client là một công cụ dựa trên web mạnh mẽ và trực quan cho phép bạn gửi các yêu cầu API, xem phản hồi, quản lý lịch sử yêu cầu và lưu chúng dưới dạng bộ sưu tập. Được thiết kế tương tự như Postman hoặc Insomnia, nó giúp các nhà phát triển kiểm tra và gỡ lỗi API một cách hiệu quả.

## Tính năng

### 1. Xử lý Yêu cầu và Phản hồi
- **Tạo Yêu cầu**: Tạo các yêu cầu API bằng cách chọn phương thức HTTP (GET, POST, PUT, DELETE, v.v.) và nhập URL yêu cầu.
- **Nội dung Yêu cầu (Request Body)**: Hỗ trợ nội dung yêu cầu định dạng JSON, với tính năng định dạng JSON tiện lợi.
- **Quản lý Header**: Thêm, chỉnh sửa, bật/tắt các header yêu cầu dưới dạng cặp khóa-giá trị.
- **Xác thực (Authentication)**: Hỗ trợ xác thực Bearer Token.
- **Tham số Truy vấn (Query Parameters)**: Dễ dàng quản lý và bật/tắt các tham số truy vấn dưới dạng cặp khóa-giá trị.
- **Header Toàn cục (Global Headers)**: Đặt và quản lý các header toàn cục được tự động áp dụng cho tất cả các yêu cầu.
- **Xem Phản hồi**: Hiển thị rõ ràng mã trạng thái phản hồi, văn bản trạng thái, thời gian phản hồi, header và nội dung cho các yêu cầu của bạn. Nội dung phản hồi được tự động chuyển đổi sang định dạng JSON để dễ đọc hơn.

### 2. Quản lý và Tổ chức Dữ liệu
- **Bộ sưu tập (Collections)**: Lưu và quản lý các yêu cầu thường dùng dưới dạng bộ sưu tập.
- **Nhóm (Grouping)**: Tổ chức các yêu cầu một cách có hệ thống bằng cách nhóm chúng trong các bộ sưu tập.
- **Kéo và Thả (Drag and Drop)**: Dễ dàng sắp xếp lại các yêu cầu và nhóm trong bộ sưu tập bằng cách kéo và thả.
- **Lọc (Filtering)**: Nhanh chóng tìm kiếm các yêu cầu trong bộ sưu tập và lịch sử theo tên hoặc URL.
- **Lịch sử (History)**: Tự động lưu bản ghi của tất cả các yêu cầu đã gửi, cho phép bạn dễ dàng tải lại các yêu cầu trước đó hoặc lưu chúng vào bộ sưu tập.
- **Xuất/Nhập Dữ liệu (Data Export/Import)**: Xuất hoặc nhập tất cả lịch sử yêu cầu, bộ sưu tập, header toàn cục và cài đặt giao diện người dùng của bạn dưới dạng tệp JSON, giúp dễ dàng sao lưu và khôi phục dữ liệu.

### 3. Giao diện Người dùng và Cài đặt
- **Giao diện trực quan (Intuitive UI)**: Cung cấp giao diện sạch sẽ và dễ sử dụng để hợp lý hóa quy trình kiểm tra API.
- **Chủ đề (Themes)**: Cá nhân hóa trải nghiệm người dùng của bạn bằng cách chọn từ các chủ đề giao diện người dùng khác nhau.

## Cách sử dụng

### 1. Thiết lập và Chạy Dự án

Để chạy dự án trong môi trường cục bộ của bạn, hãy làm theo các bước sau:

```bash
# 1. Sao chép kho lưu trữ
git clone https://github.com/your-username/requst-client.git
cd requst-client

# 2. Cài đặt các phụ thuộc
npm install

# 3. Chạy ứng dụng
npm start
```

Ứng dụng sẽ chạy tại `http://localhost:3000` (hoặc một cổng khả dụng khác).

### 2. Gửi Yêu cầu API

1.  **Nhập URL và Phương thức**: Trong bảng "Request", nhập URL của API bạn muốn yêu cầu và chọn phương thức HTTP (GET, POST, v.v.) từ menu thả xuống.
2.  **Cấu hình Chi tiết Yêu cầu**:
    *   **Body**: Đối với các yêu cầu POST, PUT, nhập nội dung yêu cầu định dạng JSON vào tab "Body". Nhấp vào nút "Format JSON" để định dạng nội dung dễ đọc hơn.
    *   **Headers**: Trong tab "Headers", thêm các header yêu cầu cần thiết dưới dạng cặp khóa-giá trị.
    *   **Auth**: Trong tab "Auth", nhập Bearer Token.
    *   **Query**: Trong tab "Query", thêm các tham số truy vấn URL dưới dạng cặp khóa-giá trị.
    *   **Global Headers**: Trong tab "Global Headers", đặt các header toàn cục sẽ được áp dụng cho tất cả các yêu cầu.
3.  **Gửi Yêu cầu**: Nhấp vào nút "Send" để gửi yêu cầu API.
4.  **Xem Phản hồi**: Kiểm tra phản hồi (trạng thái, thời gian, header, nội dung) cho yêu cầu của bạn trong bảng "Response".

### 3. Quản lý Bộ sưu tập và Lịch sử

-   **Collections**: Trong tab "Collections", bạn có thể lưu các yêu cầu mới, hoặc chỉnh sửa, xóa và nhóm các yêu cầu hiện có. Bạn có thể sắp xếp lại chúng bằng cách kéo và thả.
-   **History**: Trong tab "History", xem danh sách các yêu cầu đã gửi trước đó, nhấp để tải lại chúng vào bảng yêu cầu, hoặc lưu chúng vào bộ sưu tập.

### 4. Thay đổi Cài đặt

-   Nhấp vào biểu tượng bánh răng ở đầu ứng dụng để mở cửa sổ "Settings".
-   **Themes**: Chọn chủ đề giao diện người dùng mong muốn từ menu thả xuống "Select Theme".
-   **Data Management**: Trong phần "Data Management", nhấp vào "Export Data" để sao lưu tất cả dữ liệu của bạn, hoặc "Import Data" để khôi phục dữ liệu đã sao lưu trước đó.

---