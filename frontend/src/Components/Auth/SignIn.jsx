import React from "react";
import {useForm} from "react-hook-form";
import {useDispatch, useSelector} from "react-redux";
import {setUserData, setIsAuth, setError} from "../../store/slices/SignInSlice";
import {Navigate} from "react-router-dom";
import {postSignIn} from "../api";
import {useCookies} from "react-cookie";
import style from "./SignIn.module.css"

const SignIn = () => {

    const signIn = useSelector(state => state.signIn)
    const {register, formState: {errors}, handleSubmit} = useForm();
    const dispatch = useDispatch();
    const [cookies, setCookies, removeCookies] = useCookies(['token'])

    const onSubmit = (data) => {
        dispatch(setUserData(data));
        const postUser = async () => {
            try {
                const res = await postSignIn(data);
                dispatch(setUserData(data));
                dispatch(setError(res.status));
                if (res.status === 200) {
                    dispatch(setIsAuth(true));
                }
                data.checkbox === true ? setCookies('token', res.data.access_token, {
                        path: '/',
                        maxAge: 60 * 60 * 24 * 30,
                        secure: true
                    }) :
                    setCookies('token', res.data.access_token, {path: '/', maxAge: 1800, secure: true})
            } catch (e) {
                dispatch(setError(e.response.status));
            }

        }
        postUser();
    };

    return (<div>
            {signIn.isAuth ? <Navigate to={"/publication"}/> :
                <div>
                    {signIn.error === 404 ? <div>Аккаунт не найден!</div> : null}
                    <form onSubmit={handleSubmit(onSubmit)} className={style.form}>
                        <div className={style.block}>
                            <input className={style.input} {...register("username", {required: true})}
                                   aria-invalid={errors.username ? "true" : "false"}/>
                            {errors.username?.type === 'required' && <p role="alert">Login is required</p>}
                            <input className={style.input} type={"password"} {...register("password", {required: true})}
                                   aria-invalid={errors.password ? "true" : "false"}/>
                            {errors.password?.type === 'required' && <p role="alert">Password is required</p>}
                            <div>
                                <input className={style.input} type={"checkbox"}
                                       {...register("checkbox")}/> Запомнить меня
                            </div>
                            <input className={style.input} type="submit"/>
                        </div>
                    </form>
                </div>
            }
        </div>
    );
}

export default SignIn;