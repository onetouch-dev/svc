const errorHanlder = (err, req, res, next) => {
    res.json(
        {
            status: err.status,
            message: err.message || 'Error',
            timestamp: new Date()
        }
    );
};

export default errorHanlder;
