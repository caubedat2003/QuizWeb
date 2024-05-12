import React from "react";
import { useSelector } from "react-redux";

function Profile() {
    const user = useSelector((state) => state.users);
    return (
        <div className="flex item-center justify-center mt-2">
            <div className="flex flex-col gap-2 profile w-25 ">
                <div className="flex item-center justify-center">
                    <i className="ri-file-user-fill mr-1"></i>
                    <h1 className="text-2xl">
                        Hồ sơ
                    </h1>
                </div>
                <div className="divider"></div>
                <div className="flex flex-col gap-2">
                    <h1 className="text-md text-normal"> Tên: {user.users?.name}</h1>
                    <h1 className="text-md text-normal"> Email: {user.users?.email}</h1>
                    <h1 className="text-md text-normal"> Vai trò: {user.users?.isAdmin ? "Admin" : "Người dùng"}</h1>
                </div>
            </div>
        </div>
    );
}
export default Profile;