import notify from "../components/notify";
function errorContract(err: any) {
    try {
        if (typeof err.data !== "undefined") {
            notify.error(err.data.message);
            return;
        }
        if (typeof err.error !== "undefined") {
            notify.error(err.error.message);
            return;
        }
        notify.error(err.message);
    } catch {}
}
export default errorContract;

export const IPFSError = (e: any) => {
    try {
        if (typeof e.message! == "undefined") {
            return notify.error(e.message.statusText);
        }
        notify.error("Upload file không thành công");
    } catch {
        notify.error("Đã có lỗi sảy ra, bạn vui lòng thử lại sau");
    }
};
