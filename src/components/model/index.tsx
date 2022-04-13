import { useCallback, useEffect, useState } from "react";
import "./style.scss";
type propsModal = {
    children: any;
    show: boolean;
    onClose: any;
};

const Modal = (props: propsModal) => {
    const { children, show, onClose } = props;
    const [showElemamt, setShowElement] = useState(show);

    const escFunction = useCallback(
        (event) => {
            if (event.key === "Escape") {
                onClose();
            }
        },
        [onClose]
    );

    useEffect(() => {
        if (show === true) {
            setShowElement(true);
        } else {
            setTimeout(() => {
                setShowElement(false);
            }, 200);
        }
    }, [show]);

    useEffect(() => {
        document.addEventListener("keydown", escFunction, false);

        return () => {
            document.removeEventListener("keydown", escFunction, false);
        };
    }, [escFunction]);

    if (!showElemamt) {
        return <></>;
    }
    return (
        <div className={show ? "_modal _modal-show" : "_modal _modal-not-show"}>
            <div className={"modal-children"}>{children}</div>
            <div
                style={{ display: show ? "block" : "none" }}
                onClick={onClose}
                className="modal-close"
            ></div>
        </div>
    );
};
export default Modal;
