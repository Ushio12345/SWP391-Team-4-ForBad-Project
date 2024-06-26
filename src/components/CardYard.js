import React from "react";
import { useNavigate } from "react-router-dom";

const CardYard = ({ court }) => {
    const navigate = useNavigate();

    const handleBookingClick = (e) => {
        e.preventDefault(); // Prevent default anchor behavior
        navigate("/bookingPage", { state: { court } });
    };

    const renderStars = (rate) => {
        const totalStars = 5; // Tổng số ngôi sao
        const stars = [];
        for (let i = 1; i <= totalStars; i++) {
            if (i <= rate) {
                stars.push(<span key={i} className="fa fa-star checked" style={{ color: "#ffc107" }}></span>);
            } else {
                stars.push(<span key={i} className="fa fa-star" style={{ color: "#000000" }}></span>);
            }
        }
        return stars;
    };

    // Kiểm tra xem court có tồn tại và có thuộc tính imageUrl không
    if (!court || !court.imageUrl) {
        return null; // Trả về null nếu không có dữ liệu hợp lệ
    }

    return (
        <div className="card-yard" style={{ height: 400 }}>
            <div className="card-yard-img ">
                {court.imageUrl && <img src={court.imageUrl} alt="Ảnh Sân" />} {/* Kiểm tra imageUrl trước khi sử dụng */}
            </div>
            <div className="card-yard-content">
                <h6>
                    <b>{court.courtName}</b>
                </h6>
                <p>
                    <b>Địa chỉ:</b> {court.address}
                </p>
                <p>
                    <b>Số sân:</b> {court.yards.length}
                </p>
                <p>
                    <b>Giờ mở cửa:</b> {court.openTime} - {court.closeTime}
                </p>
                <p className="" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <b>Đánh giá:</b> <div className="rate-start">{renderStars(court.rate)}</div>
                </p>
                <a href="#" onClick={handleBookingClick} style={{ color: "black" }}>
                    Đặt Ngay
                </a>
            </div>
        </div>
    );
};

export default CardYard;
