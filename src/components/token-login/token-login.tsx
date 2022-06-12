import React from "react";
import {useForm} from "react-hook-form";

import './token-login.scss';

const TokenLogin = (props: {onConfirm: any}) => {
    const { register, handleSubmit } = useForm<any>();

    return (
        <div className="token-login-wrapper">
            <div>Ласкаво просимо в Financial Assistant!</div>
            <div>За для продовження роботи в программі потрібен персональний токен Monobank</div>
            <ol>
                <li>
                    <form onSubmit={handleSubmit(props.onConfirm)} className="modal-form">
                        <label>В мене вже є персональний токен
                            <input className="token-login-input" type="text" {...register("token")}/>
                        </label>
                        <button className="token-login-button" type="submit" id="token-button">Ввести</button>
                    </form>
                </li>
                <li>
                    <a href="https://api.monobank.ua/">Я кліент Монобанку, але не маю токена</a>
                </li>
                <li>
                    <a href="https://www.monobank.ua/">Я не кліент Монобанку</a>
                </li>
            </ol>
        </div>
    )
};

export const saveUserInfo = (data: any) => {
    localStorage.setItem('mono-user', JSON.stringify(data));
    localStorage.setItem('token', data.personalToken);
}

export const deleteUserInfo = () => {
    localStorage.removeItem('mono-user');
    localStorage.removeItem('token');

}

export default TokenLogin;
