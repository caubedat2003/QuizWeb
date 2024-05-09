import React from "react";
import { useNavigate } from "react-router-dom";

function Instructions({ examData, setView, startTimer }) {
    const navigate = useNavigate();
    return (
        <div className="flex flex-col item-center">

            <ul className="flex flex-col gap-1">
                <h1 className="text-2xl underline">
                    Quy chế
                </h1>
                <li>Thời gian thi: {examData.duration} giây</li>
                <li>Bài làm tự động nộp khi hết {examData.duration} giây</li>
                <li>Khi hoàn thành, không thể thay đổi đáp án</li>
                <li>Không được tải lại trang</li>
                <li>
                    Có thể dùng <span className="font-bold">"Trước"</span> {" "}
                    và <span className="font-bold">"Sau"</span> để chuyển câu hỏi
                </li>
                <li>Tổng điểm của bài thi là <span>{examData.totalMarks}</span></li>
                <li>Điểm để đạt: <span>{examData.passingMarks}</span></li>
                <li>Chúc bạn làm bài tốt</li>
            </ul>
            <div className="flex gap-2">
                <button className="primary-outlined-btn mt-2"
                    onClick={() => navigate("/")}>
                    Quay lại
                </button>
                <button className="primary-contanied-btn mt-2"
                    onClick={() => {
                        startTimer();
                        setView("questions");
                    }}>
                    Bắt đầu làm bài</button>
            </div>
        </div>
    )
}

export default Instructions;