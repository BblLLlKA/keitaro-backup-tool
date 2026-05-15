export class AuthController {
    constructor(authService) {
        this.authService = authService;
    }

    login = async (req, res, next) => {
        try {
            const { email, password } = req.validated ?? req.body;
            const tokens = await this.authService.login(email, password);

            res.cookie('refreshToken', tokens.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
            });
            res.json({ accessToken: tokens.accessToken });
        } catch (error) {
            next(error);
        }
    };

    refresh = async (req, res, next) => {
        try {
            const token = req.cookies?.refreshToken;

            if (!token) {
                return res
                    .status(401)
                    .json({ message: 'Refresh token missing' });
            }

            const tokens = await this.authService.refresh(token);

            res.cookie('refreshToken', tokens.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 30 * 24 * 60 * 60 * 1000,
            });
            res.json({ accessToken: tokens.accessToken });
        } catch (error) {
            next(error);
        }
    };

    logout = async (req, res, next) => {
        try {
            await this.authService.logout(req.user.id);

            res.clearCookie('refreshToken', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
            });
            res.json({ success: true });
        } catch (error) {
            next(error);
        }
    };
}
