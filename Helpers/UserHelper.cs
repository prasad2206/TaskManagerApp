using System.Security.Claims;

namespace TaskManagerApp.Helpers
{
    public static class UserHelper
    {
        public static int GetUserIdFromClaims(ClaimsPrincipal user)
        {
            var userIdClaim = user.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
                throw new Exception("User ID not found in token.");

            return int.Parse(userIdClaim.Value);
        }

        public static string? GetUserEmailFromClaims(ClaimsPrincipal user)
        {
            return user.FindFirst(ClaimTypes.Email)?.Value;
        }

        public static string? GetUserRoleFromClaims(ClaimsPrincipal user)
        {
            return user.FindFirst(ClaimTypes.Role)?.Value;
        }
    }
}
