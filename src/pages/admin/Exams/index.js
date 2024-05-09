import React, { useEffect } from "react";
import PageTitle from "../../../components/PageTitle";
import { useNavigate } from "react-router-dom";
import { Table, message } from "antd";
import { useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";
import { deleteExamById, getAllExams } from "../../../apicalls/exams";

function Exams() {
    const navigate = useNavigate();
    const [exams, setExams] = React.useState([]);
    const dispatch = useDispatch();

    const getExamsData = async () => {
        try {
            dispatch(ShowLoading());
            const response = await getAllExams();
            dispatch(HideLoading());
            if (response.success) {
                setExams(response.data);
            }
            else {
                message.error(response.message);
            }
        } catch (error) {
            dispatch(HideLoading());
            message.error(error.message);
        }
    };
    const deleteExam = async (examId) => {
        try {
            dispatch(ShowLoading());
            const response = await deleteExamById({ examId });
            dispatch(HideLoading());
            if (response.success) {
                message.success(response.message);
                getExamsData();
            }
            else {
                message.error(response.message);
            }
        } catch (error) {
            dispatch(HideLoading());
            message.error(error.message);
        }
    };

    const columns = [
        {
            title: "Tên bài thi",
            dataIndex: "name",
        },
        {
            title: "Thời gian làm bài (phút)",
            dataIndex: "duration",
        },
        {
            title: "Môn học",
            dataIndex: "category",
        },
        {
            title: "Tổng điểm",
            dataIndex: "totalMarks",
        },
        {
            title: "Điểm qua môn",
            dataIndex: "passingMarks",
        },
        {
            title: "Hành động",
            dataIndex: "action",
            render: (text, record) => (
                <div className="flex gap-2">
                    <i
                        className="ri-edit-line"
                        onClick={() => navigate(`/admin/exams/edit/${record._id}`)}
                    ></i>
                    <i className="ri-delete-bin-6-line" onClick={() => deleteExam(record._id)}></i>
                </div>
            ),
        },
    ];
    useEffect(() => {
        getExamsData();
    }, []);

    return (
        <div>
            <div className="flex justify-between mt-2">
                <PageTitle title="Bài thi"></PageTitle>
                <button className="primary-outlined-btn-thembaithi flex items-center"
                    onClick={() => navigate("/admin/exams/add")}
                >
                    <i className="ri-add-line"></i>
                    Thêm bài thi
                </button>
            </div>
            <div className="divider"></div>

            <Table columns={columns} dataSource={exams} />
        </div>
    );
}
export default Exams;