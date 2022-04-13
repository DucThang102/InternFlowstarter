import notify from "../components/notify";
function errorContract(err: any) {
    try {
        if (typeof err.data !== "undefined") {
            notify.error(err.data.message);
            return;
        }
        notify.error(err.message);
    } catch {
        notify.error("Đã có lỗi sảy ra, bạn vui lòng thử lại sau");
    }
}
export default errorContract;
