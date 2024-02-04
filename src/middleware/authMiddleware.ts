import { lucia } from "../index";
import { Elysia } from "elysia";
import { verifyRequestOrigin } from "lucia";

import type { User, Session } from "lucia";



export const apiMiddleware = async ({ set }) => {

    const bearer = true;
    if (!bearer) {
        set.status = 401
        set.headers[
            'WWW-Authenticate'
        ] = `Bearer realm='sign', error="invalid_request"`

        return {
            status: "error",
            message: 'Unauthorized'
        }
    }

    const profile = "profile"
    if (!profile) {
        set.status = 401
        set.headers[
            'WWW-Authenticate'
        ] = `Bearer realm='sign', error="invalid_request"`

        return {
            status: "error",
            message: 'Unauthorized'
        }
    }
}
