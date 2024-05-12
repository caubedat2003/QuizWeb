const router = require('express').Router();
const Exam = require('../models/examModels');
const authMiddlewares = require('../middlewares/authMiddlewares');
const Question = require('../models/questionModels');
// const User = require('../models/userModels');

//add exam
router.post('/add', authMiddlewares, async (req, res) => {
    try {
        //check if exam already exists
        const examExists = await Exam.findOne({ name: req.body.name });
        if (examExists) {
            return res.status(200).send({
                message: 'Exam already exists',
                success: false
            });
        }
        req.body.question = [];
        const NewExam = new Exam(req.body);
        await NewExam.save();
        res.send({
            message: 'Exam added successfully',
            success: true
        });
    } catch (error) {
        res.status(500).send({
            message: error.message,
            data: error,
            success: false
        });
    }
});

//get all exams
router.post('/get-all-exams', authMiddlewares, async (req, res) => {
    try {
        const { examName, userName } = req.body;
        const examRegex = examName ? new RegExp(examName, 'i') : /.*/;
        // const userRegex = userName ? new RegExp(userName, 'i') : /.*/;
        const exams = await Exam.find({
            name: {
                $regex: examRegex,
            }
        });
        const matchedExamIds = exams.map((exam) => exam._id);
        // const users = await User.find({
        //     name: {
        //         $regex: userName,
        //     }
        // });
        // const matchedUserIds = users.map((user) => user._id);
        // const exams = await Exam.find({});
        res.send({
            message: 'Exams fetched successfully',
            data: exams,
            success: true
        });
    } catch (error) {
        res.status(500).send({
            message: error.message,
            data: error,
            success: false
        });
    }
});

//get exam by id
router.post('/get-exam-by-id', authMiddlewares, async (req, res) => {
    try {
        const exam = await Exam.findById(req.body.examId).populate('questions');
        res.send({
            message: 'Exam fetched successfully',
            data: exam,
            success: true
        });
    } catch (error) {
        res.status(500).send({
            message: error.message,
            data: error,
            success: false
        });
    }
});

//edit exam by id
router.post('/edit-exam-by-id', authMiddlewares, async (req, res) => {
    try {
        await Exam.findByIdAndUpdate(req.body.examId, req.body);
        res.send({
            message: 'Exam updated successfully',
            success: true
        });
    } catch (error) {
        res.status(500).send({
            message: error.message,
            data: error,
            success: false
        });
    }
});

//delete exam by id
router.post('/delete-exam-by-id', authMiddlewares, async (req, res) => {
    try {
        await Exam.findByIdAndDelete(req.body.examId);
        res.send({
            message: 'Exam deleted successfully',
            success: true
        });
    } catch (error) {
        res.status(500).send({
            message: error.message,
            data: error,
            success: false
        });
    }
});

//add question to exam
router.post('/add-question-to-exam', authMiddlewares, async (req, res) => {
    try {
        //add question to Questions collection
        const NewQuestion = new Question(req.body);
        const question = await NewQuestion.save();

        //add question to exam
        const exam = await Exam.findById(req.body.exam);
        exam.questions.push(question._id);
        await exam.save();
        res.send({
            message: 'Question added to exam successfully',
            success: true
        });
    } catch (error) {
        res.status(500).send({
            message: error.message,
            data: error,
            success: false
        });
    }
});

//edit question in exam
router.post('/edit-question-in-exam', authMiddlewares, async (req, res) => {
    try {
        //edit question in Questions collection
        await Question.findByIdAndUpdate(req.body.questionId, req.body);
        res.send({
            message: 'Question edited successfully',
            success: true
        });
    } catch (error) {
        res.status(500).send({
            message: error.message,
            data: error,
            success: false
        });
    }
});

// delete question from exam
router.post('/delete-question-in-exam', authMiddlewares, async (req, res) => {
    try {
        //delete question from Questions collection
        await Question.findOneAndDelete(req.body.questionId);
        //delete question from exam
        const exam = await Exam.findById(req.body.examId);
        exam.questions = exam.questions.filter(
            (question) => question._id != req.body.questionId
        )
        await exam.save();
        res.send({
            message: 'Question deleted successfully',
            success: true
        });
    }
    catch (error) {
        res.status(500).send({
            message: error.message,
            data: error,
            success: false
        });
    }
});
module.exports = router;