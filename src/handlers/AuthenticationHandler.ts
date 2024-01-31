import { usersService } from "../services/UsersService";
import { authenticationsService } from "../services/AuthenticationsService";
import { t } from "elysia";

export const authenticationHandler = {
    postAuthentications: async ({ jwt, body, set }) => {
       // const userId = await usersService.verifyUserByUsername(body.username);
        const access_token = await jwt.sign("BOB");
        console.log("in post auth",)
        set.status = 201;

        return {
            data: {
                access_token: access_token,
            },
        };
    },
    putAuthentications: async ({
        jwt,
        set,
    }) => {

        const access_token = await jwt.sign(tokenPayload);

        set.status = 200;
        return {
            status: 'success',
            message: "Access token successfully updated",
            data: {
                access_token: access_token,
            },
        };
    },
    deleteAuthentications: async ({
        set,
    }) => {


        set.status = 200;
        return {
            message: "No refresh tokens!",
        };
    }
};