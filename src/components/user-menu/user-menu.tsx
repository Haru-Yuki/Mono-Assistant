import React, {useEffect, useState} from "react";
import axios from "axios";

import './user-menu.scss';
import {useForm} from "react-hook-form";

export let currency: Array<any>;

const UserMenu = () => {
    const { register, handleSubmit } = useForm<any>();

    const user = JSON.parse(localStorage.getItem('mono-user'));
    const [balance, setBalance] = useState(0);
    const [creditLim, setCreditLim] = useState(0);
    const [topCurrency, setTopCurrency] = useState([]);
    const [isShowCurrency, setIsShowCurrency] = useState(false);
    const [isShowPersonalSettings, setIsShowPersonalSettings] = useState(false);

    const [showAccountMenu, setShowAccountMenu] = useState(false);
    const [showAnalMenu, setShowAnalMenu] = useState(false);
    const [showFundsMenu, setShowFundsMenu] = useState(false);
    const [showStatementMenu, setShowStatementMenu] = useState(false);

    const currencyCodes = [{
            code: 980,
            name: 'UAH'
        },
        {
            code: 978,
            name: 'EUR'
        },
        {
            code: 840,
            name: 'USD'
        }
    ];

    useEffect(() => {
        getCurrency().then((response) => {
            localStorage.setItem('currency', JSON.stringify(response.data));
            currency = JSON.parse(localStorage.getItem('currency'));

            setTopCurrency([{
                name: 'USD',
                image: 'https://flagicons.lipis.dev/flags/4x3/us.svg',
                rateBuy: currency.find((currency) => currency.currencyCodeA === 840).rateBuy,
                rateSell: currency.find((currency) => currency.currencyCodeA === 840).rateSell
            },
            {
                name: 'EUR',
                image: 'https://flagicons.lipis.dev/flags/4x3/eu.svg',
                rateBuy: currency.find((currency) => currency.currencyCodeA === 978).rateBuy,
                rateSell: currency.find((currency) => currency.currencyCodeA === 978).rateSell
            },
            {
                name: 'PLN',
                image: 'https://flagicons.lipis.dev/flags/4x3/pl.svg',
                rateSell: currency.find((currency) => currency.currencyCodeA === 985).rateCross
            }]);

            getTotalBalance(currency, user.clientId).then((response) => {
                setBalance(response.data);
            })

            getCreditLim(currency, user.clientId).then((response) => {
                setCreditLim(response.data);
            });
        });
    }, []);

    const renderMainMenu = () => {
        return <div className="user-menu-wrapper">
            <div>{`Вітаємо, ${user.name}`}</div>
            <div>{`Загальний баланс: ${balance.toFixed(2)} грн.`}</div>
            {parseInt(creditLim.toFixed(2), 10) > 0 ? <div>{`Заборгованість по кредитному ліміту: ${creditLim.toFixed(2)} грн.`}</div>: null}
            <ol>
                <li>
                    <a href="#" onClick={() => setShowAccountMenu(true)}>Перевірити баланс за рахунками</a>
                </li>
                <li>
                    <a href="#" onClick={() => setShowAnalMenu(true)}>Перейти в меню аналізу виписки</a>
                </li>
                <li>
                    <a href="#" onClick={() => setIsShowCurrency(!isShowCurrency)}>Отримати курс валют</a>
                    {isShowCurrency?
                        <>
                        <table className="currency-table">
                            <tbody>
                                <tr className="currency-table-row">
                                    <th className="currency-table-td">Валюта</th>
                                    <th className="currency-table-td">Покупка</th>
                                    <th className="currency-table-td">Продажа</th>
                                </tr>
                                {topCurrency.map((currency) =>
                                    currency.rateBuy ?
                                        <tr className="currency-table-row" key={currency.name}>
                                            <td className="currency-table-td"><div style={{backgroundImage: `url(${currency.image})`}} className='currency-table-flag'> </div>{currency.name}</td>
                                            <td className="currency-table-td">{currency.rateBuy}</td>
                                            <td className="currency-table-td">{currency.rateBuy}</td>
                                        </tr> :
                                        <tr className="currency-table-row" key={currency.name}>
                                            <td className="currency-table-td"><div style={{backgroundImage: `url(${currency.image})`}} className='currency-table-flag'> </div>{currency.name}</td>
                                            <td className="currency-table-td"> </td>
                                            <td className="currency-table-td">{currency.rateSell}</td>
                                        </tr>
                                )}
                            </tbody>
                        </table>
                        </> :
                        null
                    }
                </li>
                <li>
                    <a href="#" onClick={() => setIsShowPersonalSettings(!isShowPersonalSettings)}>Перейти до персональних налаштувань</a>
                    {isShowPersonalSettings?
                        <>
                            <ol className="user-menu-personalSettings">
                                <li>
                                    <a href="#">Додати категорію витрат</a>
                                </li>
                                <li>
                                    <a href="#">Видалити категорію витрат</a>
                                </li>
                                <li>
                                    <a href="#">Редагувати категорію витрат</a>
                                </li>
                            </ol>
                        </> :
                        null
                    }
                </li>
                <li>
                    <a href="#" onClick={() => {
                        localStorage.removeItem('token');
                        location.reload();
                    }}>Вийти з аккаунту</a>
                </li>
            </ol>
        </div>
    };

    const renderAccountMenu = (menu: any) => {
        return <div className="user-menu-wrapper user-menu-wrapper--account">
            {user.accounts.map((account: any) =>
                <div key={account.id}>
                    <div className={`account-wrapper account-wrapper-${account.type}`}>
                        <div className="account-currency">{currencyCodes.find(currency => currency.code === account.currencyCode).name}</div>
                        <div title="Натисніть, щоб скопіювати IBAN в буфер обміну" onClick={(event: any) => {
                            navigator.clipboard.writeText(event.target.innerText)
                            alert('IBAN успішно скопійовано в буфер обміну')
                        }} className="account-iban">{account.iban}</div>
                        <div className="account-balance">{account.balance.toFixed(2)}</div>
                    </div>
                </div>
            )}
            {menu}
            {menu ?
                <a href="#" onClick={() => {
                    setShowAccountMenu(false);
                    setShowFundsMenu(false);
                    setShowStatementMenu(false);
                    setShowAnalMenu(true);
                }}>Повернутись до попереднього екрану</a> :
                <a href="#" onClick={() => {
                    setShowAccountMenu(false);
                    setShowFundsMenu(false);
                    setShowStatementMenu(false);
                }}>Повернутись до головного екрану</a>
            }
        </div>
    };

    const renderAnalMenu = () => {
        return <div className="user-menu-wrapper user-menu-wrapper--account">
            <ol>
                <li>
                    <a onClick={() => {
                        setShowFundsMenu(true)
                        setShowAnalMenu(false)
                    }} href="#">Перейти до меню підрахунку</a>
                </li>
                <li>
                    <a href="#">Перейти до меню порівняння</a>
                </li>
                <li>
                    <a href="#">Аналізувати витрати за категоріями</a>
                </li>
                <li>
                    <a href="#" onClick={() => setShowAnalMenu(false)}>Повернутись до головного екрану</a>
                </li>
            </ol>
        </div>
    };

    const renderFundsMenu = () => {
        const menu = <>
            <form onSubmit={handleSubmit((data) => getFunds(prepareDataForAnal(data, user.accounts, user.id)))}>
                <input required style={{width: '250px'}} type="text" placeholder="Введіть IBAN для підрахунку" {...register("iban")} />
                <select required {...register("type")}>
                    <option value="refills">Підрахувати загальну суму витрат</option>
                    <option value="writeoff">Підрахувати загальну суму поповнень</option>
                    <option value="moneycircle">Підрахувати загальний оборот коштів</option>
                    <option value="extract">Показати виписку</option>
                </select>
                <label style={{display: 'block'}}>
                    Початкова дата
                    <input required type="date" {...register("dateFrom")} />
                </label>
                <label style={{display: 'block'}}>
                    Кінцева дата
                    <input required type="date" {...register("dateTo")} />
                </label>
                <button style={{margin: '10px 0 50px'}} type="submit">Підрахувати</button>
            </form>
        </>

        return <>
            {renderAccountMenu(menu)}
        </>
    };

    const renderStatementMenu = (data: any) => {
        data.reverse();

        return <>
            <table style={{color: 'papayawhip'}}>
                <tbody>
                    <tr>
                        <th>Дата</th>
                        <th>Найменування операції</th>
                        <th>Сума</th>
                    </tr>
                    {data.map((operation: any) => {
                        const date = new Date(operation.time * 1000);
                        const day = date.getDate();
                        const month = date.getMonth() + 1;
                        return <tr key={operation.time}>
                            <td style={{padding: '5px'}}>{day > 9 ? day : '0' + day}.{month  > 9 ? month : '0' + month}</td>
                            <td style={{padding: '5px'}}>{operation.description}</td>
                            <td style={{padding: '5px'}}>{operation.amount}</td>
                        </tr>
                    })}
                </tbody>
            </table>
            <a style={{color: 'black'}} href="#" onClick={() => {
                setShowAccountMenu(false);
                setShowStatementMenu(false);
                setShowAnalMenu(false)
                setShowFundsMenu(true);
            }}>Повернутись до попереднього екрану</a>
        </>
    };

    const getFunds = async (data: any) => {
        const response = await axios.post(`https://financeassistantdiplom.herokuapp.com/analyser/${data.type}?clientId=${data.clientId}&account=${data.account}`, {
            timestamp1: data.dateFrom,
            timestamp2: data.dateTo
        });

        switch (data.type) {
            case 'refills':
                alert(`Загальна сума витрат у період з ${data.dateFrom} по ${data.dateTo} становить: ${response.data.toFixed(2)} грн.`);
                break;
            case 'writeoff':
                alert(`Загальна сума поповнень у період з ${data.dateFrom} по ${data.dateTo} становить: ${response.data.toFixed(2)} грн.`);
                break;
            case 'moneycircle':
                alert(`Загальний оборот коштів у період з ${data.dateFrom} по ${data.dateTo} становить: ${response.data.toFixed(2)} грн.`);
                break;
            case 'extract':
                setShowAnalMenu(false);
                setShowFundsMenu(false);
                setShowAccountMenu(false);
                setShowStatementMenu(response.data);
                break;
            default:
                alert('Error');
                break;
        }
    }

    if (!showAccountMenu && !showAnalMenu && !showFundsMenu && showStatementMenu === false) {
        return renderMainMenu();
    }

    if (showAccountMenu) {
        return renderAccountMenu(null);
    }

    if (showAnalMenu) {
        return renderAnalMenu();
    }

    if (showFundsMenu) {
        return renderFundsMenu();
    }

    if (showStatementMenu !== false) {
        return renderStatementMenu(showStatementMenu);
    }
};

const prepareDataForAnal = (data: any, accounts: Array<any>, clientId: string) => {
    const id = accounts.find(account => account.iban === data.iban).id;

    return {
        account: id,
        clientId: clientId,
        type: data.type,
        dateFrom: data.dateFrom,
        dateTo: data.dateTo
    };
}

const getTotalBalance = async (currency: any, clientId: string) => {
    return await axios.post(`https://financeassistantdiplom.herokuapp.com/account/totalbalance?clientId=${clientId}`, currency);
}

const getCreditLim = async (currency: any, clientId: string) => {
    return await axios.post(`https://financeassistantdiplom.herokuapp.com/account/creditlim?clientId=${clientId}`, currency);
}

const getCurrency = async () => {
    return await axios.get('https://financeassistantdiplom.herokuapp.com/currency');
}

export default UserMenu;
