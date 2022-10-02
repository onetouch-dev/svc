const errorHanlder = (err, req, res, next) => {
    res.status(err.status).send(
        {
            status: err.status,
            message: err.message || 'Error',
            timestamp: new Date()
        }
    );
};

export default errorHanlder;
