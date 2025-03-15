import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  // Optional configuration
  publicRoutes: ["/", "/about", "/features", "/pricing"],
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}; 