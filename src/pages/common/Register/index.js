import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../../apicalls/users";
import { Form, message } from "antd";
import { useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";

function Register() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const onFinish = async (values) => {
        try {
            dispatch(ShowLoading());
            const response = await registerUser(values);
            dispatch(HideLoading());
            if (response.success) {
                message.success(response.message);
                navigate('/login');
            }
            else {
                message.error(response.message);
            }
        } catch (error) {
            dispatch(HideLoading());
            message.error(error.message);
        }
    }

    return (
        <div className="flex justify-center item-center h-screen w-screen">
            <div className="card w-400 p-3">
                <div className="flex flex-col">
                    <div className="flex gap-2 justify-center align-center">
                        <i class="ri-user-add-line mt-1-5"></i>
                        <h1 className="text-2xl">Đăng kí</h1>
                    </div>
                    <div className="divider" />
                    <Form layout="vertical" className="mt-2" onFinish={onFinish} initialValues={{}}>
                        <Form.Item name="name" label="Tên: ">
                            <input type="text" placeholder="Tên" />
                        </Form.Item>

                        <Form.Item name="email" label="Email: ">
                            <input type="text" placeholder="Email" />
                        </Form.Item>

                        <Form.Item name="password" label="Mật khẩu: ">
                            <input type="password" placeholder="Mật khẩu" />
                        </Form.Item>

                        <div className="flex flex-col gap-2">
                            <button type="submit" className="primary-contanied-btn mt-2 w-100">Đăng kí</button>
                            <Link to="/login" className="text-center underline">Đăng nhập</Link>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    )
}
export default Register