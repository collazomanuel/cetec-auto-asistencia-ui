import Google from '@auth/core/providers/google';
import { SvelteKitAuth } from '@auth/sveltekit';

export const { handle } = SvelteKitAuth({
    providers: [
        Google({
            clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
            clientSecret: import.meta.env.VITE_GOOGLE_CLIENT_SECRET,
            authorization: {
                params: { scope: 'openid email profile' },
            },

        })
    ],
    callbacks: {
        async jwt({ token, account }) {
            if (account) {
                token.accessToken = account.access_token;
            }
            return token;
        },
        async session({ session, token, user }) {
            //@ts-ignore
            session.access_token = token.accessToken;
            return session;
        }
    }
});
