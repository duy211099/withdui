# Google OAuth Setup Guide

This guide will help you set up Google OAuth authentication for your application.

## Prerequisites

- A Google account
- Access to Google Cloud Console

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project dropdown at the top of the page
3. Click "New Project"
4. Enter a project name (e.g., "Withdui Auth")
5. Click "Create"

## Step 2: Enable Google+ API

1. In the Google Cloud Console, navigate to "APIs & Services" > "Library"
2. Search for "Google+ API"
3. Click on it and then click "Enable"

## Step 3: Configure OAuth Consent Screen

1. Go to "APIs & Services" > "OAuth consent screen"
2. Choose "External" as the user type (unless you have a Google Workspace account)
3. Click "Create"
4. Fill in the required information:
   - **App name**: Your application name (e.g., "Withdui")
   - **User support email**: Your email address
   - **Developer contact information**: Your email address
5. Click "Save and Continue"
6. On the "Scopes" page, click "Add or Remove Scopes"
7. Add the following scopes:
   - `.../auth/userinfo.email`
   - `.../auth/userinfo.profile`
8. Click "Update" and then "Save and Continue"
9. On the "Test users" page (if in testing mode), add your email address
10. Click "Save and Continue"

## Step 4: Create OAuth 2.0 Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. Choose "Web application" as the application type
4. Enter a name (e.g., "Withdui Web Client")
5. Under "Authorized JavaScript origins", add:
   - `http://localhost:3000` (for development)
   - Your production URL (e.g., `https://yourdomain.com`)
6. Under "Authorized redirect URIs", add:
   - `http://localhost:3000/users/auth/google_oauth2/callback` (for development)
   - `https://yourdomain.com/users/auth/google_oauth2/callback` (for production)
7. Click "Create"
8. You'll see a dialog with your **Client ID** and **Client Secret** - copy these values

## Step 5: Configure Your Application

1. Create a `.env` file in the root of your project:
   ```bash
   cp .env.example .env
   ```

2. Open the `.env` file and add your credentials:
   ```
   GOOGLE_CLIENT_ID=your_client_id_here
   GOOGLE_CLIENT_SECRET=your_client_secret_here
   ```

3. **IMPORTANT**: Never commit your `.env` file to version control. It's already in `.gitignore`.

## Step 6: Test Authentication

1. Start your Rails server:
   ```bash
   bin/dev
   ```

2. Open your browser and navigate to `http://localhost:3000`

3. Click "Sign In" button

4. You should be redirected to Google's OAuth consent screen

5. Select your Google account and grant permissions

6. You should be redirected back to your application and see your profile information

## Troubleshooting

### "Error 400: redirect_uri_mismatch"

This means the redirect URI in your Google Cloud Console doesn't match the one your application is using.

**Solution**: Make sure the redirect URI in Google Cloud Console exactly matches:
- `http://localhost:3000/users/auth/google_oauth2/callback` (development)
- Include the protocol (`http://` or `https://`)
- Include the correct port number
- Check for trailing slashes

### "Access blocked: This app's request is invalid"

This usually means you haven't properly configured the OAuth consent screen.

**Solution**:
1. Go back to "OAuth consent screen" in Google Cloud Console
2. Make sure you've added the required scopes
3. If in testing mode, make sure your email is added as a test user

### "The app is not verified"

If you see this warning during sign-in, it's normal for apps in development/testing mode.

**Solution**: Click "Advanced" and then "Go to [Your App Name] (unsafe)" to proceed. For production, you'll need to submit your app for verification.

## Production Deployment

When deploying to production:

1. Add your production domain to "Authorized JavaScript origins" in Google Cloud Console
2. Add your production callback URL to "Authorized redirect URIs"
3. Set your environment variables on your production server (not in a .env file)
4. Consider submitting your app for verification if you want to remove the "unverified" warning

## Security Notes

- **Never** share your Client Secret publicly
- **Never** commit your `.env` file to version control
- Use environment variables for all sensitive configuration
- In production, use your hosting provider's secret management system (e.g., Heroku Config Vars, AWS Secrets Manager)

## Additional Resources

- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Devise OmniAuth Documentation](https://github.com/heartcombo/devise/wiki/OmniAuth:-Overview)
- [OmniAuth Google OAuth2 Strategy](https://github.com/zquestz/omniauth-google-oauth2)
