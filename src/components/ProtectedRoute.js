import React, { useEffect, useState } from "react";
import { getUserInfo } from "../apicalls/users";
import { message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { setUsers } from "../redux/usersSlice.js";
import { useNavigate } from "react-router-dom";
import { HideLoading, ShowLoading } from "../redux/loaderSlice.js";

// ProtectedRoute component
function ProtectedRoute({ children }) {
    const user = useSelector((state) => state.users);
    const dispatch = useDispatch();
    const [menu, setMenu] = useState([]);
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();

    const userMenu = [
        {
            title: "Trang chủ",
            paths: ["/"],
            icon: <i className="ri-home-4-line"></i>,
            onClick: () => navigate("/")
        },
        {
            title: "Kết quả",
            paths: ["/reports"],
            icon: <i className="ri-file-chart-line"></i>,
            onClick: () => navigate("/reports")
        },
        {
            title: "Hồ sơ",
            paths: ["/profile"],
            icon: <i className="ri-user-3-line"></i>,
            onClick: () => navigate("/profile")
        },
        {
            title: "Đăng xuất",
            paths: ["/logout"],
            icon: <i className="ri-logout-box-line"></i>,
            onClick: () => {
                localStorage.removeItem("token");
                navigate("/login");
            }
        }
    ]

    const adminMenu = [
        {
            title: "Trang chủ",
            paths: ["/"],
            icon: <i className="ri-home-4-line"></i>,
            onClick: () => navigate("/")
        },
        {
            title: "Bài thi",
            paths: ["/admin/exams", "/admin/exams/add"],
            icon: <i className="ri-file-list-2-line"></i>,
            onClick: () => navigate("/admin/exams")
        },
        {
            title: "Kết quả",
            paths: ["/reports"],
            icon: <i className="ri-file-chart-line"></i>,
            onClick: () => navigate("admin//reports")
        },
        {
            title: "Hồ sơ",
            paths: ["/profile"],
            icon: <i className="ri-user-3-line"></i>,
            onClick: () => navigate("/profile")
        },
        {
            title: "Đăng xuất",
            paths: ["/logout"],
            icon: <i className="ri-logout-box-line"></i>,
            onClick: () => {
                localStorage.removeItem("token");
                navigate("/login");
            }
        }
    ]

    const getUserData = async () => {
        try {
            dispatch(ShowLoading());
            const response = await getUserInfo();
            dispatch(HideLoading());
            if (response.success) {
                // message.success(response.message);
                dispatch(setUsers(response.data));
                if (response.data.isAdmin) {
                    setMenu(adminMenu);
                }
                else {
                    setMenu(userMenu);
                }
            }
            else {
                message.error(response.message);
            }
        } catch (error) {
            dispatch(HideLoading());
            message.error(error.message);
        }
    }

    useEffect(() => {
        getUserData();
    }, []);

    const activeRoute = window.location.pathname;

    const getIsActiveOrNot = (path) => {
        if (path.includes(activeRoute)) {
            return true;
        }
        return false;
    }

    return (
        <div className="layout">
            <div className="flex gap-2 h-screen h-100">
                <div className="sidebar">
                    <div className="menu">
                        {menu.map((item, index) => {
                            return <div className={`menu-item ${getIsActiveOrNot(item.paths) && 'active-menu-item'}`}
                                key={index}
                                onClick={item.onClick}
                            >
                                {item.icon}
                                {!collapsed && <span>{item.title}</span>}
                            </div>
                        })}
                    </div>
                </div>
                <div className="body">
                    <div className="header flex justify-between">
                        {!collapsed && <i className="ri-close-line" onClick={() => setCollapsed(true)}></i>}
                        {collapsed && <i className="ri-menu-line" onClick={() => setCollapsed(false)}></i>}
                        <h1 className="text-2xl">Web thi trắc nghiệm</h1>
                        <div className="flex gap-1 item-center">
                            <i className="ri-user-3-line text-xl"></i>
                            <h1 className="text-md underline">
                                {user.users?.name}
                            </h1>
                        </div>
                    </div>
                    <div className="content">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
export default ProtectedRoute;