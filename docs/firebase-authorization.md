# Firebase authorization

New accounts are learners. VITE_ADMIN_EMAILS no longer grants privileges. After signing up, bootstrap the first administrator using the Firebase Console or a trusted Admin SDK by setting that user's `users/{uid}.role` to `admin`. Never place Admin SDK credentials in the frontend. Review existing privileged accounts before deploying these rules: previous clients could write their own roles.

Owners can read their own profile and update only profile fields; they cannot change identity or role. Only admins can list users or change roles. Admins do not receive access to other users' progress. Signed-in learners can read CMS chapters; editors can create/update them; admins can also delete. All other paths and anonymous access are denied.

Run `npm run test:rules` with Java 21 and network access for the emulator's first download. This command uses a demo project and never deploys. Run `npm test` for frontend checks. Local demo auth does not provide live Firebase access.

The rules have not been deployed. After reviewing privileged accounts and configuring your intended Firebase project, deploy separately with `npx firebase deploy --only firestore:rules --project YOUR_PROJECT_ID`. Do not deploy to the demo test project. Existing accounts without a role should be migrated to learner using trusted administration.
