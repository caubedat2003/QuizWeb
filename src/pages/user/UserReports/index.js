import React, { useEffect } from "react";
import PageTitle from "../../../components/PageTitle";
import { Table, message } from "antd";
import { useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";
import { getAllReportsByUser } from "../../../apicalls/reports";
import moment from "moment";

function UserReports() {
    const [reportsData, setReportsData] = React.useState([]);
    const dispatch = useDispatch();

    const colums = [
        {
            title: "Ten bai thi",
            dataIndex: "examName",
            render: (text, record) => <>
                {record.exam.name}
            </>
        },
        {
            title: "Thoi gian lam bai",
            dataIndex: "date",
            render: (text, record) => <>
                {
                    moment(record.createdAt).format("DD/MM/YYYY HH:mm:ss")
                }
            </>
        },
        {
            title: "Diem",
            dataIndex: "correctAnswers",
            render: (text, record) => <>
                {record.result.correctAnswers.length}
            </>
        },
        {
            title: "So cau hoi",
            dataIndex: "totalQuestion",
            render: (text, record) => <>
                {record.exam.totalMarks}
            </>
        },
        {
            title: "Diem qua mon",
            dataIndex: "passingMarks",
            render: (text, record) => <>
                {record.exam.passingMarks}
            </>
        },
        {
            title: "Trang thai",
            dataIndex: "vedict",
            render: (text, record) => <>
                {record.result.vedict}
            </>
        }
    ];
    const getData = async () => {
        try {
            dispatch(ShowLoading());
            const response = await getAllReportsByUser();
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
        getData();
    }, []);

    return (
        <div>
            <PageTitle title="Kết quả" />
            <div className="divider"></div>
            <Table columns={colums} dataSource={reportsData}></Table>
        </div>
    );
}

export default UserReports;