export const sendResponse = (res, statusCode, success, msg, result = null) => {
    return res.status(statusCode).json({
        success,
        msg,
        result
    });
};

export const sendSuccessResponse = (res, msg, result = []) => {
    return res.status(200).json({
        success: true,
        msg,
        result: result || []
    });
};

export const sendErrorResponse = (res, statusCode = 500, msg = "Server error", error = null) => {
    return res.status(statusCode).json({
        success: false,
        msg,
        error: error ? error.msg || error : undefined
    });
};

export const sendCreatedResponse = (res, msg, result = []) => {
    return res.status(201).json({
        success: true,
        msg,
        result: result || []
    });
};

export const sendNotFoundResponse = (res, msg) => {
    return res.status(404).json({
        success: false,
        msg,
        result: []
    });
};

export const sendBadRequestResponse = (res, msg) => {
    return res.status(400).json({
        success: false,
        msg,
        result: []
    });
};

export const sendUnauthorizedResponse = (res, msg) => {
    return res.status(401).json({
        success: false,
        msg,
        result: []
    });
};

export const sendForbiddenResponse = (res, msg) => {
    return res.status(403).json({
        success: false,
        msg,
        result: []
    });
};