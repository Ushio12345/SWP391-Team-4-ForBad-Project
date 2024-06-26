// src/utils/alertUtils.js

import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.css';
import '../../src/styles/alertStyles.css';

export const showAlert = (icon, title, text, position) => {
    Swal.fire({
        icon: icon,
        title: title,
        text: text,
        timer: 3000, // Thời gian tự động đóng (ms)
        timerProgressBar: true, // Thanh tiến độ thời gian
        showConfirmButton: false, // Không hiển thị nút OK
        position: position, // Đặt vị trí thông báo ở góc trên bên phải
        toast: true, // Thêm tính năng toast để thông báo tự đóng
        customClass: {
            popup: icon, // Tùy chỉnh CSS cho hộp thoại
        }
    });
};

export const showConfirmAlert = (title, text, confirmText, position) => {
    return Swal.fire({
        title: title,
        text: text,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        position: position,
        confirmButtonText: confirmText
    }).then((result) => {
        return result; // Return the result of Swal.fire()
    });
};

