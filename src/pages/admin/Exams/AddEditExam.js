import React, { useEffect } from "react";
import PageTitle from "../../../components/PageTitle";
import { Col, Form, Row, Select, Tabs, message } from "antd";
import { addExam, editExamById, getExamById } from "../../../apicalls/exams";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";
import TabPane from "antd/es/tabs/TabPane";

function AddEditExam() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const params = useParams();
    const [examData, setExamData] = React.useState(null);
    const onFinish = async (values) => {
        try {
            dispatch(ShowLoading());
            let response;
            if (params.id) {
                response = await editExamById({
                    ...values,
                    examId: params.id,
                });
            }
            else {
                response = await addExam(values);
            }
            if (response.success) {
                message.success(response.message);
                navigate('/admin/exams');
            } else {
                message.error(response.message);
            }
            dispatch(HideLoading());
        } catch (error) {
            dispatch(HideLoading());
            message.error(error.message);
        }
    }

    const getExamData = async () => {
        try {
            dispatch(ShowLoading());
            const response = await getExamById({
                examId: params.id,
            });
            dispatch(HideLoading());
            if (response.success) {
                setExamData(response.data);
                // console.log(response.data);
            } else {
                message.error(response.message);
            }
        } catch (error) {
            dispatch(HideLoading());
            message.error(error.message);
        }
    };
    useEffect(() => {
        if (params.id) {
            getExamData();
        }
    }, []);

    return (
        <div>
            <PageTitle title=
                {params.id ? "Chỉnh sửa bài thi" : "Thêm bài thi"}
            ></PageTitle>
            <div className="divider"></div>

            {(examData || !params.id) &&
                <Form layout="vertical" onFinish={onFinish} initialValues={examData}>
                    <Tabs defaultActiveKey="1">
                        <TabPane tab="Thông tin bài thi" key="1">
                            <Row gutter={[10, 10]}>
                                <Col span={8}>
                                    <Form.Item label="Tên bài thi" name="name">
                                        <input type="text" />
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item label="Thời gian làm bài" name="duration">
                                        <input type="number" />
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item label="Môn học" name="category">
                                        <Select>
                                            <Select.Option value="chon">Chọn môn học</Select.Option>
                                            <Select.Option value="toan">Toán</Select.Option>
                                            <Select.Option value="van">Văn</Select.Option>
                                            <Select.Option value="anh">Anh</Select.Option>
                                            <Select.Option value="theduc">Thể dục</Select.Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item label="Tổng điểm" name="totalMarks">
                                        <input type="number" />
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item label="Điểm để đạt" name="passingMarks">
                                        <input type="number" />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </TabPane>
                        {params.id && (
                            <TabPane tab="Câu hỏi" key="2">

                            </TabPane>
                        )}
                    </Tabs>

                    <div className="flex justify-end">
                        <button className="primary-contanied-btn" type="submit">Lưu</button>
                    </div>
                </Form>}
        </div>
    );
}
export default AddEditExam;