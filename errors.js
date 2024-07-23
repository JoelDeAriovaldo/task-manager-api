class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        Error.captureStackTrace(this, this.constructor);
    }
}

class DatabaseError extends AppError {
    constructor(message) {
        super(message, 500);
    }
}

class AuthError extends AppError {
    constructor(message) {
        super(message, 401);
    }
}

module.exports = {
    AppError,
    DatabaseError,
    AuthError
};
