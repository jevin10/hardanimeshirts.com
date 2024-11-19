# hardanimeshirts.com

## About
hardanimeshirts is a realtime imageboard and webgame built on Sveltekit.

## Environment variables
**For basic functionality:** 
1. `DATABASE_URL`: Your postgresql database url (for supabase, use port 6543, pgbouncer true & connection limit 1)
2. `DIRECT_URL`: Your postgresql database url (for supabase, use port 5432)
**For store functionality:**
3. `STRIPE_SECRET_KEY`: Stripe credentials
4. `STRIPE_WEBHOOK_SECRET`: Stripe credentials
**For image uploading**
5. `AWS_ACCESS_KEY_ID`: AWS credentials
6. `AWS_SECRET_ACCESS_KEY`: AWS credentials
7. `AWS_BUCKET_NAME`: AWS bucket name
8. `AWS_REGION`: AWS server region
**For websockets**
9. `PUBLIC_HOST`: Public url you're hosting on
10. `WS_PORT`: Port you want to host websockets on

## Contributing
You can contribute to hardanimeshirts.com by:
- Developing patches/improvements/translations and using Github to submit pull requests
- Providing feedback and suggestions
- Writing/editing documentation
If you need developing a patch, dm me on X (@1owroller)

## Installation
1. Download and extract hardanimeshirts.com to your web directory or get the latest development version with:
```
git clone git://github.com/jevin10/hardanimeshirts.com.git
```
2. Run `npm i`
3. hardanimeshirts.com should be installed
### Developing on NixOS
There are compatibility issues with Prisma and NixOS. Prisma engines need to be built from their binaries.
1. Make sure git tree is clean
2. Run `nix develop`
3. Build should fail. Copy the hash output after `got:`
4. In `flake.nix`, replace the `specified` hash with the copied hash output.
5. Repeat until all hashes have been updated. It will then build properly.

## Support
If you find a bug, please report it. You can contact me on X.com (@1owroller)
