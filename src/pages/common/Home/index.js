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

    const getExams = async () => {
        try {
            dispatch(ShowLoading());
            const response = await getAllExams();
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
        getExams();
    }, []);

    return (
        user && <div>
            <PageTitle title={
                `Chào mừng ${user.users?.name} đến với hệ thống quản lý thi trắc nghiệm!`
            } />
            <div className='divider'></div>
            <div className='mt-2'></div>
            <Row gutter={[16, 16]}>
                {exams.map((exam) => (
                    <Col span={6}>
                        <div className='card-lg flex flex-col gap-1 p-2'>
                            <h1 className='text-2xl'>{exam?.name}</h1>
                            <h1 className='text-md text-normal'>Mon hoc: {exam.category}</h1>
                            <h1 className='text-md text-normal'>Tong diem: {exam.totalMarks}</h1>
                            <h1 className='text-md text-normal'>Diem qua mon: {exam.passingMarks}</h1>
                            <h1 className='text-md text-normal'>Thoi gian: {exam.duration} phut</h1>
                            <button className='primary-outlined-btn'
                                onClick={() => navigate(`/user/write-exam/${exam._id}`)}>
                                Lam bai
                            </button>
                        </div>
                    </Col>
                ))}
            </Row>
        </div>
    );
}
export default Home;