import React, { useState, useEffect } from "react";
import axios from "axios";

import Layout from "@theme/Layout";

const DEFAULT_TICK = 60;
const SUBMIT_URL = "https://r2.docs.rancher.cn/sendEmail";
const GENERATE_CODE_URL = "https://r2.docs.rancher.cn/sendCode";

function GetPDF() {
    const [tick, setTick] = useState(DEFAULT_TICK);
    const [sent, setSent] = useState(false);
    const [sending, setSending] = useState(false);
    const [name, setName] = useState();
    const [company, setCompany] = useState();
    const [position, setPosition] = useState();
    const [email, setEmail] = useState();
    const [phone, setPhone] = useState();
    const [invalidPhone, setInvalidPhone] = useState(false);
    const [code, setCode] = useState();
    const [submitted, setSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [invalidCode, setInvalidCode] = useState(false);

    useEffect(() => {
        let timer = DEFAULT_TICK;

        const interval = setInterval(() => {
            if (sent) {
                if (timer > 0) {
                    setTick(timer--);
                } else {
                    setSent(false);
                    setTick(DEFAULT_TICK);
                }
            } else {
                clearInterval(interval);
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [sent]);

    function getCode() {
        setSending(true);
        axios
            .post(
                GENERATE_CODE_URL,
                {
                    phone,
                },
                {
                    params: {
                        kind: "pdf",
                    },
                }
            )
            .then(function (response) {
                // handle success
                setInvalidPhone(false);
                setSent(true);
            })
            .catch(function (error) {
                // handle error
                setInvalidPhone(true);
                console.log(error);
            })
            .then(function () {
                setSending(false);
            });
    }

    function submit(event) {
        event.preventDefault();

        if (!code || !phone || !email || submitted || invalidPhone) {
            return;
        }
        setSubmitting(true);
        axios
            .post(
                SUBMIT_URL,
                {
                    name,
                    company,
                    position,
                    phone,
                    email,
                    code,
                },
                {
                    params: {
                        kind: "pdf",
                    },
                }
            )
            .then(function (response) {
                // handle success
                setSubmitted(true);
                setInvalidCode(false);
            })
            .catch(function (error) {
                // handle error
                setInvalidCode(true);
                console.log(error);
            })
            .then(function () {
                setSubmitting(false);
            });
    }

    return (
        <Layout title="获取 PDF 文档">
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <div
                    style={{
                        maxWidth: "600px",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "left",
                            alignItems: "center",
                            paddingTop: "5vh",
                        }}
                    >
                        <h2>获取 Rancher 2.x PDF 文档</h2>
                    </div>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <form onSubmit={submit}>
                            <input
                                type="text"
                                className="form-input"
                                name="name"
                                onChange={(e) => setName(e.target.value)}
                                required
                                placeholder="姓名（必填）"
                            />

                            <input
                                type="text"
                                className="form-input"
                                name="company"
                                onChange={(e) => setCompany(e.target.value)}
                                required
                                placeholder="公司（必填）"
                            />

                            <input
                                type="text"
                                className="form-input"
                                name="position"
                                onChange={(e) => setPosition(e.target.value)}
                                required
                                placeholder="职位（必填）"
                            />

                            <input
                                type="email"
                                className="form-input"
                                name="email"
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="邮箱（必填）"
                            />

                            <input
                                type="tel"
                                className="form-input"
                                name="phone"
                                required
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="手机号码（必填）"
                            />

                            {(() => {
                                if (phone) {
                                    return (
                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "left",
                                                alignItems: "center",
                                            }}
                                        >
                                            <input
                                                type="text"
                                                className="form-input input-phone"
                                                name="code"
                                                onChange={(e) =>
                                                    setCode(e.target.value)
                                                }
                                                placeholder="短信验证码（必填）"
                                                required
                                            />
                                            <button
                                                type="button"
                                                disabled={
                                                    sent ||
                                                    sending ||
                                                    submitted ||
                                                    submitting
                                                }
                                                onClick={getCode}
                                                className="form-input button-phone button-pdf"
                                            >
                                                {(() => {
                                                    if (sent) {
                                                        return `重新发送短信验证码 (${tick} s)`;
                                                    } else if (sending) {
                                                        return "发送中...";
                                                    } else {
                                                        return "发送短信验证码";
                                                    }
                                                })()}
                                            </button>
                                        </div>
                                    );
                                }
                            })()}

                            {(() => {
                                if (invalidPhone) {
                                    return (
                                        <div className="text-error">
                                            验证码发送失败，请检查您的手机号码是否正确。
                                        </div>
                                    );
                                }
                            })()}
                            <div>
                                <p className="text-grey">
                                    Rancher Labs
                                    可能会根据您提供给我们联系信息，就您的产品和服务与您取得联系。请花一些时间熟悉我们的
                                    <a
                                        href="https://rancher.cn/privacy/"
                                        target="_blank"
                                    >
                                        隐私政策
                                    </a>
                                    ，如果您有任何问题，请联系我们。
                                </p>
                            </div>
                            <button
                                type="submit"
                                className="form-input button-pdf"
                            >
                                {(() => {
                                    if (submitted) {
                                        return `获取成功！文档会发送到您的邮箱。`;
                                    } else if (submitting) {
                                        return "提交中...";
                                    } else {
                                        return "立即获取";
                                    }
                                })()}
                            </button>
                            {(() => {
                                if (invalidCode) {
                                    return (
                                        <div className="text-error">
                                            提交失败，请检查您的验证码是否正确。
                                        </div>
                                    );
                                }
                            })()}
                        </form>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default GetPDF;
