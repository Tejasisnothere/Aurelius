const sendTokenResponse = (user, statusCode, res) => {
    const token = user.generateAuthToken
        ? user.generateAuthToken()
        : null;

    const jwtToken = token || null;

    const cookieOptions = {
        httpOnly: true,
        expires: new Date(
            Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict"
    };

    res
        .status(statusCode)
        .cookie("token", jwtToken, cookieOptions)
        .json({
            success: true,
            user
        });
};

export default sendTokenResponse;