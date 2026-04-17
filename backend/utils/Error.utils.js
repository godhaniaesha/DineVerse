export const ThrowError = (res, statusCode, message) => {
    return res.status(statusCode).json({
        success: false,
        msg: message,
        data: null
    });
}