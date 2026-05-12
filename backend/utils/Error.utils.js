export const ThrowError = (res, statusCode, message, data = null) => {
    return res.status(statusCode).json({
        success: false,
        msg: message,
        data: data
    });
}