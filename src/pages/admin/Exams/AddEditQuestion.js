import { Form, Input, Modal, message } from "antd";
import React from "react";
import { addQuestionToExam, editExamById, editQuestionById } from "../../../apicalls/exams";
import { useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";

function AddEditQuestion({
    showAddEditQuestionModal,
    setShowAddEditQuestionModal,
    refreshData,
    examId,
    selectedQuestion,
    setSelectedQuestion,
}) {
    const dispatch = useDispatch();
    const onFinish = async (values) => {
        try {
            dispatch(ShowLoading());
            const requiredPayload = {
                name: values.name,
                correctOption: values.correctOption,
                options: {
                    A: values.A,
                    B: values.B,
                    C: values.C,
                    D: values.D,
                },
                exam: examId,
            };
            let response
            if (selectedQuestion) {
                response = await editQuestionById({
                    ...requiredPayload,
                    questionId: selectedQuestion._id,
                })
            }
            else {
                response = await addQuestionToExam(requiredPayload);
            }
            if (response.success) {
                message.success(response.message);
                setShowAddEditQuestionModal(false);
                refreshData();
            }
            else {
                message.error(response.message);
            }
            setSelectedQuestion(null);
            dispatch(HideLoading());
        } catch (error) {
            dispatch(HideLoading());
            message.error(error.message);
        }
    }
    return (
        <Modal title={selectedQuestion ? "Chinh sua cau hoi" : "Them cau hoi"}
            visible={showAddEditQuestionModal} footer={false}
            onCancel={() => {
                setShowAddEditQuestionModal(false);
                setSelectedQuestion(null);
            }}>

            <Form onFinish={onFinish} layout="vertical" className="themcauhoi"
                initialValues={{
                    name: selectedQuestion?.name,
                    A: selectedQuestion?.options.A,
                    B: selectedQuestion?.options.B,
                    C: selectedQuestion?.options.C,
                    D: selectedQuestion?.options.D,
                    correctOption: selectedQuestion?.correctOption
                }}>
                <Form.Item name="name" label="Câu hỏi">
                    <Input type="text" />
                </Form.Item>
                <Form.Item name="correctOption" label="Đáp án đúng">
                    <Input type="text" />
                </Form.Item>
                <div className="flex gap-1">
                    <Form.Item name="A" label="Đáp án A">
                        <Input type="text" />
                    </Form.Item>
                    <Form.Item name="B" label="Đáp án B">
                        <Input type="text" />
                    </Form.Item>
                </div>
                <div className="flex gap-1">
                    <Form.Item name="C" label="Đáp án C">
                        <Input type="text" />
                    </Form.Item>
                    <Form.Item name="D" label="Đáp án D">
                        <Input type="text" />
                    </Form.Item>
                </div>
                <div className="flex justify-end mt-2 gap-3">
                    <button className="primary-outlined-btn" type="button"
                        onClick={() => setShowAddEditQuestionModal(false)}>
                        Huỷ
                    </button>
                    <button className="primary-contanied-btn" type="submit">Lưu</button>
                </div>
            </Form>
        </Modal >
    );
}
export default AddEditQuestion;