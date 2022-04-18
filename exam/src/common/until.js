export function validateNFTFileType(type) {
    switch (type) {
        case "image/jpeg":
        case "image/png":
        case "image/gif":
            return true;
        default:
            return false;
    }
}