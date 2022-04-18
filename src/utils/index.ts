class Utils {
    private imgType = ["image/png", "image/jpeg"];
    private limitSize = 1024 * 1024;
    public validateImageUpload(file: File) {
        return this.imgType.includes(file.type);
    }
    public validateImageSize(file: File) {
        return file.size <= this.limitSize;
    }
}
export default new Utils();
