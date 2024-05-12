import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";
import { getExamById } from "../../../apicalls/exams";
import { message } from "antd";
import Instructions from "./Instructions";
import { addReport } from "../../../apicalls/reports";

function WriteExam() {
    const [examData, setExamData] = useState(null);
    const [questions = [], setQuestions] = useState([]);
    const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);
    const [selectedOptions, setSelectedOptions] = useState({});
    const [result, setResult] = useState({});
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const params = useParams();
    const [view, setView] = useState("instructions");
    const [secondsLeft, setSecondsLeft] = useState(0);
    const [timeUp, setTimeUp] = useState(false);
    const [intervalId, setIntervalId] = useState(null);
    const user = useSelector((state) => state.users);

    const getExamData = async () => {
        try {
            dispatch(ShowLoading());
            const response = await getExamById({
                examId: params.id,
            });
            dispatch(HideLoading());
            if (response.success) {
                setQuestions(response.data.questions);
                setExamData(response.data);
                setSecondsLeft(response.data.duration);
                // console.log(response.data);
            } else {
                message.error(response.message);
            }
        } catch (error) {
            dispatch(HideLoading());
            message.error(error.message);
        }
    };

    const calculateResult = async () => {
        try {
            let correctAnswers = [];
            let wrongAnswers = [];

            questions.forEach((question, index) => {
                if (question.correctOption === selectedOptions[index]) {
                    correctAnswers.push(question);
                }
                else {
                    wrongAnswers.push(question);
                }
            });
            let vedict = "Đỗ";
            if (correctAnswers.length < examData.passingMarks) {
                vedict = "Trượt";
            }
            const tempResult = ({
                correctAnswers,
                wrongAnswers,
                vedict
            });
            setResult(tempResult);
            dispatch(ShowLoading());
            const response = await addReport({
                exam: params.id,
                result: tempResult,
                user: user.users._id
            });
            dispatch(HideLoading());
            if (response.success) {
                setView("result");
            }
            else {
                message.error(response.message);
            }
        } catch (error) {
            dispatch(HideLoading());
            message.error(error.message);
        }
    }

    const startTimer = () => {
        const totalSeconds = examData.duration;
        const intervalId = setInterval(() => {
            if (totalSeconds > 0) {
                totalSeconds = totalSeconds - 1;
                setSecondsLeft(totalSeconds);
            }
            else {
                setTimeUp(true);
                // calculateResult();
            };
        }, 1000);
        clearInterval(intervalId);
    }

    useEffect(() => {
        if (timeUp && view === "questions") {
            clearInterval(intervalId);
            calculateResult();
        }
    }, [timeUp]);

    useEffect(() => {
        if (params.id) {
            getExamData();
        }
    }, []);

    return (
        examData &&
        (<div className="mt-2">
            {/* <div className="divider"></div> */}
            <h1 className="text-center">{examData.name}</h1>
            <div className="divider"></div>

            {view === "instructions" && <Instructions examData={examData} setView={setView} startTimer={startTimer} />}

            {view === "questions" && (<div className="flex flex-col gap-2">
                <div className="flex justify-between">
                    <h1 className="text-2xl">
                        {selectedQuestionIndex + 1}: {" "}{questions[selectedQuestionIndex].name}
                    </h1>
                    <div className="timer mt-2">
                        <span className="text-2xl">{secondsLeft}</span>
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    {Object.keys(questions[selectedQuestionIndex].options).map((option, index) => {
                        return <div className={
                            `flex flex-col gap-2 ${selectedOptions[selectedQuestionIndex] === option ? "selected-option" : "option"}`}
                            key={index}
                            onClick={() => {
                                setSelectedOptions({
                                    ...selectedOptions,
                                    [selectedQuestionIndex]: option
                                });
                            }}>
                            <h1 className="text-xl text-normal">
                                {option}: {questions[selectedQuestionIndex].options[option]}
                            </h1>
                        </div>
                    })}
                </div>
                <div className="flex justify-between">
                    {selectedQuestionIndex > 0 && (
                        <button className="primary-outlined-btn"
                            onClick={() => {
                                setSelectedQuestionIndex(selectedQuestionIndex - 1);
                            }}>Trước</button>
                    )}
                    {selectedQuestionIndex < questions.length - 1 && (
                        <button className="primary-contanied-btn"
                            onClick={() => {
                                setSelectedQuestionIndex(selectedQuestionIndex + 1);
                            }}>Sau</button>
                    )}
                    {selectedQuestionIndex === questions.length - 1 && (
                        <button className="primary-contanied-btn-nopbai"
                            onClick={() => {
                                clearInterval(intervalId);
                                setTimeUp(true);
                            }}>Nộp bài</button>
                    )}
                </div>


            </div>)}

            {view === "result" &&
                (<div className="flex item-center justify-center mt-2 result">
                    <div className="flex flex-col gap-2 ">
                        <h1 className="text-2xl">
                            Kết quả
                        </h1>
                        <div className="divider"></div>
                        <div className="marks">
                            <h1 className="text-md text-normal">Tổng điểm: {examData.totalMarks}</h1>
                            <h1 className="text-md text-normal">Điểm đạt được: {result.correctAnswers.length}</h1>
                            <h1 className="text-md text-normal">Trả lời sai: {result.wrongAnswers.length}</h1>
                            <h1 className="text-md text-normal">Điểm cần đạt: {examData.passingMarks}</h1>
                            <h1 className="text-md text-normal">Trạng thái: {result.vedict}</h1>

                            <div className="flex gap-2 mt-2">
                                <button className="primary-outlined-btn"
                                    onClick={() => {
                                        setView("instructions");
                                        setSelectedQuestionIndex(0);
                                        setSelectedOptions({});
                                        setSecondsLeft(examData.duration);
                                    }}
                                >Làm lại</button>

                                <button className="primary-contanied-btn-nopbai"
                                    onClick={() => {
                                        setView("review");
                                    }}
                                >Xem đáp án</button>
                            </div>
                        </div>
                    </div>
                    <div className="lotie-animation">
                        {result.vedict === "Đỗ" &&
                            <lottie-player src="https://lottie.host/eadff671-235a-4520-b9f3-9145ca7a107f/268xzlxw2a.json"
                                background="transparent" speed="1"
                                loop autoplay direction="1" mode="normal"></lottie-player>}

                        {result.vedict === "Trượt" &&
                            <lottie-player src="https://lottie.host/a6f48e2e-edce-4766-a4aa-0a2c0ee59f80/bEfNctqViW.json"
                                background="transparent" speed="1"
                                loop autoplay direction="1" mode="normal"></lottie-player>}
                    </div>
                </div>)}

            {view === "review" && (
                <div className="flex flex-col gap-2 mt-2 mb-2">
                    {questions.map((question, index) => {
                        const isCorrect = question.correctOption === selectedOptions[index];
                        return <div className={`
                            flex flex-col gap-1 p-2 card ${isCorrect ? "bg-success" : "bg-warning"}
                        `}>
                            <h1 className="text-xl">{index + 1} : {question.name}</h1>
                            <h1 className=" text-md  text-normal">
                                Dap an chon: {selectedOptions[index]} - {question.options[selectedOptions[index]]}
                            </h1>
                            <h1 className=" text-md  text-normal">
                                Dap an dung: {question.correctOption} - {question.options[question.correctOption]}
                            </h1>
                        </div>
                    })}

                    <div className="flex justify-center gap-2 ">
                        <button className="primary-outlined-btn"
                            onClick={() => {
                                navigate("");
                            }}
                        >Đóng</button>
                        <button className="primary-contanied-btn"
                            onClick={() => {
                                setView("instructions");
                                setSelectedQuestionIndex(0);
                                setSelectedOptions({});
                                setSecondsLeft(examData.duration);
                            }}
                        >Làm lại</button>
                    </div>
                </div>
            )}
        </div>)
    )
}

export default WriteExam;