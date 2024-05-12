import React, { useEffect } from 'react';
import { getAllExams } from '../../../apicalls/exams';
import { useDispatch, useSelector } from 'react-redux';
import { HideLoading, ShowLoading } from '../../../redux/loaderSlice';
import { Col, Row, message } from 'antd';
import PageTitle from "../../../components/PageTitle";
import { useNavigate } from "react-router-dom";

function Home() {
    const [exams, setExams] = React.useState([]);
    const dispatch = useDispatch();
    const user = useSelector((state) => state.users);
    const navigate = useNavigate();
    const [filter, setFilter] = React.useState({ examName: "" });

    const getExams = async (tempFilter) => {
        try {
            dispatch(ShowLoading());
            const response = await getAllExams(tempFilter);
            if (response.success) {
                setExams(response.data);
            }
            else {
                message.error(response.message);
            }
            dispatch(HideLoading());
        } catch (error) {
            dispatch(HideLoading());
            message.error(error.message);
        }
    }

    useEffect(() => {
        getExams(filter);
    }, []);

    return (
        user && <div>
            <PageTitle title={
                `Chào mừng ${user.users?.name} đến với hệ thống quản lý thi trắc nghiệm!`
            } />
            <div className='divider'></div>
            <div className='mt-2'></div>
            <div className="flex gap-2 mt-2 text-xl mb-2">
                <input type="text" placeholder="Tên bài thi"
                    onChange={(e) => setFilter({ ...filter, examName: e.target.value })}
                ></input>
                {/* <input type="text" placeholder="Nguoi dung"
                    onChange={(e) => setFilter({ ...filter, userName: e.target.value })}
                ></input> */}
                <button className="primary-outlined-btn"
                    onClick={() => {
                        setFilter({
                            examName: "",
                            // userName: ""
                        });
                        getExams({
                            examName: "",
                            // userName: ""
                        });
                    }}
                >Làm mới</button>
                <button className="primary-contanied-btn"
                    onClick={() => getExams(filter)}
                >Tìm kiếm</button>
            </div>
            <Row gutter={[16, 16]}>
                {exams.map((exam) => (
                    <Col span={6}>
                        <div className='card-lg flex flex-col gap-1 p-2'>
                            <h1 className='text-2xl'>{exam?.name}</h1>
                            <h1 className='text-md text-normal'>Môn học: {exam.category}</h1>
                            <h1 className='text-md text-normal'>Tổng điểm: {exam.totalMarks}</h1>
                            <h1 className='text-md text-normal'>Điểm qua môn: {exam.passingMarks}</h1>
                            <h1 className='text-md text-normal'>Thời gian: {exam.duration} phút</h1>
                            <button className='primary-outlined-btn'
                                onClick={() => navigate(`/user/write-exam/${exam._id}`)}>
                                Làm bài
                            </button>
                        </div>
                    </Col>
                ))}
            </Row>
        </div>
    );
}
export default Home;