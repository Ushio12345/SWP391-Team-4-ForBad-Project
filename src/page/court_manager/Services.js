import React, { Component } from "react";
import axiosInstance from "../../config/axiosConfig";
import { showAlert } from "../../utils/alertUtils";
import { handleTokenError } from "../../utils/tokenErrorHandle";

export default class Services extends Component {
    state = {
        services: [],
        selectedServices: [],
        selectedCourt: "",
        selectedCourtName: "",
        courts: [],
        facilityOfCourt: [],
    };

    componentDidMount() {
        this.fetchServices();
        this.fetchCourts();
    }

    fetchCourts = () => {
        axiosInstance
            .get("/court/courts-of-owner")
            .then((res) => {
                if (res.status === 200) {
                    this.setState({ courts: res.data });
                } else {
                    showAlert("error", "Lỗi !", "Không lấy được dữ liệu", "top-end");
                    console.error("Response không thành công:", res.status);
                }
            })
            .catch((error) => {
                this.handleRequestError(error);
            });
    };

    fetchServices = () => {
        axiosInstance
            .get("/facility/all")
            .then((res) => {
                if (res.status === 200) {
                    this.setState({ services: res.data });
                } else {
                    showAlert("error", "Lỗi !", "Không lấy được dữ liệu", "top-end");
                    console.error("Response không thành công:", res.status);
                }
            })
            .catch((error) => {
                this.handleRequestError(error);
            });
    };

    handleCourtChange = (event) => {
        const courtId = event.target.value;
        const courtName = event.target.options[event.target.selectedIndex].text;
        this.setState({
            selectedCourt: courtId,
            selectedCourtName: courtName,
            selectedServices: [],
        });

        this.renderServicesInCourt(courtId);
    };

    handleActionSelectServices = (facilityId) => {
        const { selectedCourt } = this.state;
        const isFacilityInCourt = this.state.facilityOfCourt.some((facility) => facility.facilityId === facilityId);

        if (isFacilityInCourt) {
            axiosInstance
                .delete(`/court/${selectedCourt}/deleteFacilityFromCourt/${facilityId}`)
                .then((res) => {
                    if (res.status === 200) {
                        showAlert("success", "Thành công", "Đã xóa dịch vụ khỏi sân", "top-end");
                        this.fetchServicesInCourt(selectedCourt); // Cập nhật lại danh sách dịch vụ trong sân
                    } else {
                        showAlert("error", "Lỗi !", "Không thể xóa dịch vụ", "top-end");
                        console.error("Response không thành công:", res.status);
                    }
                })
                .catch((error) => {
                    this.handleRequestError(error);
                });
        } else {
            axiosInstance
                .post(`/court/${selectedCourt}/addFacilityToCourt/${facilityId}`)
                .then((res) => {
                    if (res.status === 200) {
                        showAlert("success", "Thành công", "Đã thêm dịch vụ vào sân", "top-end");
                        this.fetchServicesInCourt(selectedCourt); // Cập nhật lại danh sách dịch vụ trong sân
                    } else {
                        showAlert("error", "Lỗi !", "Không thể thêm dịch vụ", "top-end");
                        console.error("Response không thành công:", res.status);
                    }
                })
                .catch((error) => {
                    this.handleRequestError(error);
                });
        }

        // Update selected services state
        this.setState((prevState) => ({
            selectedServices: prevState.facilityOfCourt.map((facility) => facility.facilityId),
        }));
    };

    renderServices = () => {
        const { facilityOfCourt } = this.state;
        return this.state.services.map((service) => {
            const isFacilityInCourt = facilityOfCourt.some((facility) => facility.facilityId === service.facilityId);

            return (
                <div
                    key={service.facilityId}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "10px",
                        justifyContent: "space-between",
                        backgroundColor: isFacilityInCourt ? "#000" : "#f5f5f5",
                        color: isFacilityInCourt ? "#fff" : "#000",
                        padding: "5px 0",
                    }}
                >
                    <div>
                        <p style={{ margin: "0 10px 0 0" }}>
                            <i className={service.facilityIcon} style={{ marginRight: "20px" }} />
                            {service.facilityName}
                        </p>
                    </div>
                    <div>
                        <button onClick={() => this.handleActionSelectServices(service.facilityId)}>
                            {isFacilityInCourt ? <i className="fa-solid fa-minus"></i> : <i className="fa-solid fa-plus"></i>}
                        </button>
                    </div>
                </div>
            );
        });
    };

    renderServicesInCourt = (selectedCourtId) => {
        axiosInstance
            .get(`/court/facilities-of-court/${selectedCourtId}`)
            .then((res) => {
                if (res.status === 200) {
                    this.setState({ facilityOfCourt: res.data });
                } else {
                    showAlert("error", "Lỗi !", "Không lấy được dữ liệu", "top-end");
                    console.error("Response không thành công:", res.status);
                }
            })
            .catch((error) => {
                this.handleRequestError(error);
            });
    };

    handleRequestError = (error) => {};

    render() {
        return (
            <div className="services-for-court">
                <h1 className="text-center mb-5">Danh sách các tiện ích</h1>
                <div className="form-group">
                    <select id="courtSelect" className="form-control w-25 m-auto" onChange={this.handleCourtChange}>
                        {this.state.courts.map((court) => (
                            <option key={court.courtId} value={court.courtId}>
                                {court.courtName}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="list-services w-50 m-auto" style={{ fontSize: "20px" }}>
                    {this.renderServices()}
                </div>
            </div>
        );
    }
}
