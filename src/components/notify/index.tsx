import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { MdCheckCircle, MdError } from "react-icons/md";
import "./style.scss";
type NotifiMessageProps = {
    message: string | JSX.Element;
    time: number;
    classChill: string;
};
const NotifyMessage = (props: NotifiMessageProps) => {
    const [show, setShow] = useState<boolean>(false);
    const [remove, setRemove] = useState<boolean>(false);
    const { message, time, classChill } = props;
    useEffect(() => {
        setShow(true);
        let timerShow = setTimeout(() => setShow(false), time);
        let timerRemove = setTimeout(() => setRemove(true), time + 500);

        return () => {
            clearTimeout(timerShow);
            clearTimeout(timerRemove);
        };
    }, [message, time]);

    const getIcon = (key: string) => {
        switch (key) {
            case "success":
                return <MdCheckCircle className="icon" />;
            case "error":
                return <MdError className="icon" />;
            default:
                return <></>;
        }
    };
    if (remove) {
        return <></>;
    }
    return (
        <div
            className={
                show
                    ? `show-notify _notify bgr_${classChill}`
                    : `not-show-notify _notify bgr_${classChill}`
            }
        >
            {getIcon(classChill)}
            <div className={`erect ${classChill}`}></div>
            <div className="message">{message}</div>
            <div>
                <div
                    onClick={() => setShow(false)}
                    className={`close-btn close_${classChill}`}
                >
                    X
                </div>
            </div>

            <div
                style={{
                    animation: `time_close ${time / 1000}s ease forwards`,
                }}
                className={`notify_time ${classChill}`}
            ></div>
        </div>
    );
};

function showNotify(
    message: string | JSX.Element,
    time: number,
    classChill: string = ""
) {
    const child = document.createElement("DIV");
    child.className = "notify";

    const e = document.getElementById("__notify");
    if (e) {
        ReactDOM.render(
            <NotifyMessage
                message={message}
                time={time}
                classChill={classChill}
            />,
            e.appendChild(child)
        );
    } else {
        const mess = document.createElement("DIV");
        mess.id = "__notify";
        ReactDOM.render(
            <NotifyMessage
                message={message}
                time={time}
                classChill={classChill}
            />,
            document.body.appendChild(mess)
        );
    }
}

function error(message: string, time: number = 5000) {
    showNotify(message, time, "error");
}
function success(message: string, time: number = 5000) {
    showNotify(message, time, "success");
}

const notify = {
    error,
    success,
};
export default notify;
