import { env } from "$env/dynamic/private";

export const stripe = require('stripe')(env.STRIPE_SECRET_KEY);

