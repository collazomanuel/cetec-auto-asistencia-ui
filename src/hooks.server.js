import { SvelteKitAuth } from '@auth/sveltekit';
import Google from '@auth/core/providers/google';

export const handle = SvelteKitAuth({ providers: [Google({ clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID, clientSecret: import.meta.env.VITE_GOOGLE_CLIENT_SECRET })] }).handle;
