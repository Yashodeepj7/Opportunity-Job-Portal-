import React, { useEffect, useState } from 'react';
import Navbar from '../shared/Navbar';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { RadioGroup } from '../ui/radio-group';
import { Button } from '../ui/button';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { USER_API_END_POINT } from '@/utils/constant';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading } from '@/redux/authSlice';
import { Loader2 } from 'lucide-react';

const Signup = () => {

    const [input, setInput] = useState({
        fullname: "",
        email: "",
        phoneNumber: "",
        password: "",
        role: "",
        file: ""
    });

    const { loading, user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const changeFileHandler = (e) => {
        setInput({ ...input, file: e.target.files?.[0] });
    };

    const submitHandler = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("fullname", input.fullname);
        formData.append("email", input.email);
        formData.append("phoneNumber", input.phoneNumber);
        formData.append("password", input.password);
        formData.append("role", input.role);
        if (input.file) formData.append("file", input.file);

        try {
            dispatch(setLoading(true));

            const res = await axios.post(
                `${USER_API_END_POINT}/register`,
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                    withCredentials: true,
                    timeout: 0,   // production safe timeout
                }
            );

            if (res.data.success) {
                toast.success(res.data.message);

                // Clear form properly
                setInput({
                    fullname: "",
                    email: "",
                    phoneNumber: "",
                    password: "",
                    role: "",
                    file: ""
                });

                navigate("/login");
            }

        } catch (error) {

            if (error.code === "ECONNABORTED") {
                toast.error("Signup took too long. Please try again.");
            } 
            else if (error.response) {
                toast.error(error.response.data.message);
            } 
            else {
                toast.error("Network error, please try again.");
            }

        } finally {
            dispatch(setLoading(false));
        }
    };

    useEffect(() => {
        if (user) navigate("/");
    }, []);

    return (
        <div>
            <Navbar />

            <div className="flex items-center justify-center max-w-7xl mx-auto px-3">

                <form
                    onSubmit={submitHandler}
                    className="
                        w-full 
                        md:w-1/2 
                        border border-gray-200 
                        rounded-md 
                        p-4 md:p-6 
                        my-10 
                        bg-white dark:bg-[#0d1117]
                    "
                >

                    <h1 className="font-bold text-xl mb-5">Sign Up</h1>

                    <div className="my-2">
                        <Label>Full Name</Label>
                        <Input
                            type="text"
                            value={input.fullname}
                            name="fullname"
                            onChange={changeEventHandler}
                            placeholder="John Doe"
                        />
                    </div>

                    <div className="my-2">
                        <Label>Email</Label>
                        <Input
                            type="email"
                            value={input.email}
                            name="email"
                            onChange={changeEventHandler}
                            placeholder="john@gmail.com"
                        />
                    </div>

                    <div className="my-2">
                        <Label>Phone Number</Label>
                        <Input
                            type="text"
                            value={input.phoneNumber}
                            name="phoneNumber"
                            onChange={changeEventHandler}
                            placeholder="8080808080"
                        />
                    </div>

                    <div className="my-2">
                        <Label>Password</Label>
                        <Input
                            type="password"
                            value={input.password}
                            name="password"
                            onChange={changeEventHandler}
                            placeholder="*******"
                        />
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-4">

                        <RadioGroup className="flex gap-4">
                            <div className="flex items-center space-x-2">
                                <Input
                                    type="radio"
                                    name="role"
                                    value="student"
                                    checked={input.role === 'student'}
                                    onChange={changeEventHandler}
                                    className="cursor-pointer"
                                />
                                <Label>Student</Label>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Input
                                    type="radio"
                                    name="role"
                                    value="recruiter"
                                    checked={input.role === 'recruiter'}
                                    onChange={changeEventHandler}
                                    className="cursor-pointer"
                                />
                                <Label>Recruiter</Label>
                            </div>
                        </RadioGroup>

                        <div className="flex flex-col w-full md:w-auto">
                            <Label>Profile Photo</Label>
                            <Input
                                accept="image/*"
                                type="file"
                                onChange={changeFileHandler}
                                className="cursor-pointer mt-1"
                            />
                        </div>
                    </div>

                    {loading ? (
                        <Button className="w-full my-4" disabled>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing…
                        </Button>
                    ) : (
                        <Button type="submit" className="w-full my-4">Signup</Button>
                    )}

                    <span className="text-sm">
                        Already have an account?{" "}
                        <Link to="/login" className="text-blue-600">Login</Link>
                    </span>

                </form>
            </div>
        </div>
    );
};

export default Signup;
