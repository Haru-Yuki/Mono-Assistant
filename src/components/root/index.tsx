import React, {useEffect, useState} from "react";
import { createRoot } from 'react-dom/client';
import "./index.scss";
import TokenLogin, {deleteUserInfo, saveUserInfo} from "../token-login/token-login";
import UserMenu from "../user-menu/user-menu";
import axios from "axios";

type Token = {
    token: string
}

const Index = () => {
    const [token, setToken] = useState({token: localStorage.getItem('token')});

    const checkToken = async (data: Token) => {
            if (data.token) {
                const response = await axios.post(`https://financeassistantdiplom.herokuapp.com/loginMenu/login?token=${data.token}`);

                saveUserInfo(response.data);
                setToken({token: response.data.personalToken});
            } else {
                deleteUserInfo();
                setToken({token: null});
            }

    }

    return (
        token.token ?
            <UserMenu/> :
            <TokenLogin onConfirm={checkToken}/>
    );
}

const root = createRoot(document.getElementById('root'));
root.render(<Index />);
