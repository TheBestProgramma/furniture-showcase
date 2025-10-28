# Troubleshooting Guide

## Common Issues and Solutions

### 1. API Client Error (Call Stack Error)

**Error:** `ApiClient.get` error in the call stack

**Symptoms:**

- Error in browser console related to API calls
- Tips page not loading
- Network errors in the application

**Solutions:**

#### Check Database Connection

```bash
# Test database connection
npm run test-db
```

#### Seed the Database

```bash
# Seed products
npm run seed

# Seed tips
npm run seed-tips
```

#### Test API Endpoints

```bash
# Test all APIs
npm run test-api

# Test tips specifically
npm run test-tips
```

#### Check Development Server

```bash
# Make sure server is running
npm run dev

# Check if server is accessible
curl http://localhost:3000/api/tips
```

### 2. URL Construction Error

**Error:** `TypeError: Failed to construct 'URL'`

**Cause:** The API client is trying to construct a URL with an empty baseUrl

**Solution:** The updated API client now handles this properly with fallback URLs.

### 3. Database Connection Issues

**Error:** `MongoServerError` or connection timeout

**Solutions:**

1. **Check MongoDB is running:**

   ```bash
   # For local MongoDB
   mongod

   # For MongoDB Atlas, check connection string
   ```

2. **Verify environment variables:**

   ```env
   MONGODB_URI=mongodb://localhost:27017/furniture-showcase
   # or for Atlas:
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/furniture-showcase
   ```

3. **Test connection:**
   ```bash
   npm run test-db
   ```

### 4. Tips Not Loading

**Symptoms:**

- Tips page shows loading state indefinitely
- Error message about tips not found
- Empty tips array

**Solutions:**

1. **Seed the tips data:**

   ```bash
   npm run seed-tips
   ```

2. **Check if tips exist in database:**

   ```bash
   # Run the test script
   npm run test-tips
   ```

3. **Verify API endpoint:**
   - Open browser dev tools
   - Check Network tab for `/api/tips` requests
   - Look for error responses

### 5. Cart Not Working

**Symptoms:**

- Items not adding to cart
- Cart state not persisting
- Cart icon not updating

**Solutions:**

1. **Check Zustand store:**

   - Open browser dev tools
   - Check Application > Local Storage
   - Look for `cart-storage` key

2. **Verify cart provider:**
   - Make sure `CartProvider` wraps the app
   - Check if `useCartStore` is imported correctly

### 6. Loading States Not Showing

**Symptoms:**

- No skeleton screens
- Abrupt loading transitions
- Poor user experience

**Solutions:**

1. **Check skeleton components:**

   - Verify `ProductCardSkeleton` exists
   - Check `TipCardSkeleton` is imported
   - Ensure loading states are properly implemented

2. **Debug loading states:**
   ```javascript
   // Add to component
   console.log("Loading state:", loading);
   console.log("Data:", data);
   ```

### 7. Error Boundaries Not Catching Errors

**Symptoms:**

- App crashes instead of showing error UI
- White screen of death
- Unhandled errors in console

**Solutions:**

1. **Wrap components with error boundaries:**

   ```jsx
   <ErrorBoundary>
     <YourComponent />
   </ErrorBoundary>
   ```

2. **Check error boundary implementation:**
   - Verify `ErrorBoundary` component exists
   - Check if it's properly imported
   - Ensure it's wrapping the right components

## Debugging Steps

### 1. Check Console Logs

Open browser dev tools and look for:

- Network errors
- JavaScript errors
- API response errors
- State management issues

### 2. Test API Endpoints

```bash
# Test individual endpoints
curl http://localhost:3000/api/products
curl http://localhost:3000/api/categories
curl http://localhost:3000/api/tips
```

### 3. Check Database

```bash
# Connect to MongoDB
mongosh

# Check collections
use furniture-showcase
show collections

# Check documents
db.products.find().limit(5)
db.tips.find().limit(5)
```

### 4. Verify Environment

```bash
# Check if all dependencies are installed
npm install

# Check if TypeScript compiles
npx tsc --noEmit

# Check if build works
npm run build
```

## Performance Issues

### 1. Slow API Responses

- Check database indexes
- Optimize queries
- Add caching if needed

### 2. Large Bundle Size

- Check for unused imports
- Use dynamic imports for large components
- Optimize images

### 3. Memory Leaks

- Check for proper cleanup in useEffect
- Remove event listeners
- Clear intervals and timeouts

## Production Issues

### 1. Environment Variables

- Ensure all required env vars are set
- Check production database connection
- Verify API endpoints are accessible

### 2. Build Issues

- Check for TypeScript errors
- Verify all imports are correct
- Test production build locally

### 3. Deployment Issues

- Check server logs
- Verify database connection
- Test API endpoints in production

## Getting Help

If you're still experiencing issues:

1. **Check the logs:**

   - Browser console
   - Server logs
   - Database logs

2. **Run the test suite:**

   ```bash
   npm run test-all
   ```

3. **Check the implementation guide:**

   - Review `IMPLEMENTATION_GUIDE.md`
   - Check code examples
   - Verify setup steps

4. **Common fixes:**
   - Restart development server
   - Clear browser cache
   - Reinstall dependencies
   - Check file permissions

## Quick Fixes

### Reset Everything

```bash
# Stop server
# Clear node_modules
rm -rf node_modules package-lock.json

# Reinstall
npm install

# Restart server
npm run dev
```

### Clear Browser Data

- Clear localStorage
- Clear sessionStorage
- Hard refresh (Ctrl+Shift+R)

### Database Reset

```bash
# Drop and recreate database
# Re-seed data
npm run seed
npm run seed-tips
```

---

**Remember:** Most issues are related to:

1. Database connection
2. Missing data (not seeded)
3. Environment variables
4. Development server not running

Always check these first before diving deeper into debugging.

