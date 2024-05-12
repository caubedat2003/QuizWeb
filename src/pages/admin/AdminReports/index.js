import React, { useEffect } from "react";
import PageTitle from "../../../components/PageTitle";
import { Table, message } from "antd";
import { useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";
import { getAllReports } from "../../../apicalls/reports";
import moment from "moment";


function AdminReports() {
    const [reportsData, setReportsData] = React.useState([]);
    const dispatch = useDispatch();
    const [filter, setFilter] = React.useState({
        examName: "",
        userName: ""
    });

    const colums = [
        {
            title: "Tên bài thi",
            dataIndex: "examName",
            render: (text, record) => <>
                {record.exam.name}
            </>
        },
        {
            title: "Người dùng",
            dataIndex: "user",
            render: (text, record) => <>
                {record.user.name}
            </>
        },
        {
            title: "Thời gian làm bài",
            dataIndex: "date",
            render: (text, record) => <>
                {
                    moment(record.createdAt).format("DD/MM/YYYY HH:mm:ss")
                }
            </>
        },
        {
            title: "Điểm",
            dataIndex: "correctAnswers",
            render: (text, record) => <>
                {record.result.correctAnswers.length}
            </>
        },
        {
            title: "Số câu hỏi",
            dataIndex: "totalQuestion",
            render: (text, record) => <>
                {record.exam.totalMarks}
            </>
        },
        {
            title: "Điểm qua môn",
            dataIndex: "passingMarks",
            render: (text, record) => <>
                {record.exam.passingMarks}
            </>
        },
        {
            title: "Trạng thái",
            dataIndex: "vedict",
            render: (text, record) => <>
                {record.result.vedict}
            </>
        }
    ];
    const getData = async (tempFilter) => {
        try {
            dispatch(ShowLoading());
            const response = await getAllReports(tempFilter);
            if (response.success) {
                setReportsData(response.data);
            }
            else {
                message.error(response.message);
            }
            dispatch(HideLoading());
        } catch (error) {
            dispatch(HideLoading());
            message.error(error.message);
        }
    };
    useEffect(() => {
        getData(filter);
    }, []);

    return (
        <div>
            <PageTitle title="Kết quả" />
            <div className="divider"></div>
            <div className="flex gap-2 mt-2 ">
                <input type="text" placeholder="Tên bài thi"
                    onChange={(e) => setFilter({ ...filter, examName: e.target.value })}
                ></input>
                <input type="text" placeholder="Người dùng"
                    onChange={(e) => setFilter({ ...filter, userName: e.target.value })}
                ></input>
                <button className="primary-outlined-btn"
                    onClick={() => {
                        setFilter({
                            examName: "",
                            userName: ""
                        });
                        getData({
                            examName: "",
                            userName: ""
                        });
                    }}
                >Làm mới</button>
                <button className="primary-contanied-btn"
                    onClick={() => getData(filter)}
                >Tìm kiếm</button>
            </div>
            <Table columns={colums} dataSource={reportsData} className="mt-2"></Table>
        </div>
    );
}

export default AdminReports;