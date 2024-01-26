// lucia.ts
import { lucia } from "lucia";
import{elysia} from "lucia/middleware";
export const auth = lucia({
    adapter: sqlite,
	env: "DEV", 
    middleware: elysia(),
});



export type Auth = typeof auth;