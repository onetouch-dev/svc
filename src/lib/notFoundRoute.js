const notFoundRoute = (req, res, next) => {
    next({
        error : route.notFound,
        code: 404
    });
};

export default notFoundRoute;
