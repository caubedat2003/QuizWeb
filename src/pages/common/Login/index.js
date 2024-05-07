import React from "react";
import { Link } from "react-router-dom";
import { Form, message } from "antd";
import { loginUser } from "../../../apicalls/users";
import { useDispatch } from "react-redux";
import { ShowLoading } from "../../../redux/loaderSlice";
import { HideLoading } from "../../../redux/loaderSlice";

function Login() {
    const dispatch = useDispatch();
    const onFinish = async (values) => {
        try {
            dispatch(ShowLoading());
            const response = await loginUser(values);
            dispatch(HideLoading());
            if (response.success) {
                message.success(response.message);
                localStorage.setItem('token', response.data);
                window.location.href = '/';
            } else {
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
                    <h1 className="text-2xl">Login</h1>
                    <div className="divider" />
                    <Form layout="vertical" className="mt-2" onFinish={onFinish}>
                        <Form.Item name="email" label="Email: ">
                            <input type="text" placeholder="Username" />
                        </Form.Item>

                        <Form.Item name="password" label="Password: ">
                            <input type="password" placeholder="Password" />
                        </Form.Item>

                        <div className="flex flex-col gap-2">
                            <button type="submit" className="primary-contanied-btn mt-2 w-100">Login</button>
                            <Link to="/register" className="text-center underline">Register</Link>
                        </div>
                    </Form>
                </div>
            </div>
        </div>

    )
}
export default Login