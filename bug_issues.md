# Fixed Backend Bug Issues

These are the GitHub Issues created for the pre-existing bugs identified in the Backend codebase. All of these issues have been successfully implemented and resolved.

---

## 📑 BUG ISSUE #1: [Backend] Duplicate Negation in Customer Account Locking (`ToggleLockCustomerAsync`)

### Title
`fix(api): resolve duplicate IsLocked assignment in ToggleLockCustomer`

### Description
The customer locking/unlocking function (`ToggleLockCustomerAsync`) in `AdminCustomerService.cs` was assigning `customer.IsLocked = !customer.IsLocked` twice in succession. This double negation effectively neutralized the toggle, meaning the lock status of the customer in the database remained unchanged, despite the API responding with a "success" message.

### Current Code (Buggy)
```csharp
customer.IsLocked = !customer.IsLocked;

customer.IsLocked = !customer.IsLocked;
await _context.SaveChangesAsync();
```

### Expected Behavior
The field should only be toggled once and then saved:
```csharp
customer.IsLocked = !customer.IsLocked;
await _context.SaveChangesAsync();
```

### Tasks Checklist
- [x] Locate `ToggleLockCustomerAsync` in `AdminCustomerService.cs`.
- [x] Delete the redundant duplicate `customer.IsLocked = !customer.IsLocked;` assignment line.
- [x] Verify account state toggles properly in the database on request.

### Suggested Labels
`backend` | `bug` | `critical`

---

## 📑 BUG ISSUE #2: [Backend] Admin Role Claim Case-Sensitivity Mismatch (403 Forbidden)

### Title
`fix(auth): fix case mismatch for Admin role claim in JWT generation`

### Description
The JWT token generation in `AdminAuthService.cs` attached the role claim value as `"Admin"` (Title Case). However, the admin controllers (e.g., `AdminBookingController.cs`, `AdminReportController.cs`, etc.) are decorated with `[Authorize(Roles = "ADMIN")]` (Uppercase). Because ASP.NET Core's default policy matcher is case-sensitive, this mismatch resulted in `403 Forbidden` responses for all admin overview, report, and booking retrieval endpoints.

### Current Code (Buggy)
Inside `AdminAuthService.cs`:
```csharp
new Claim("role", "Admin"),
new Claim(ClaimTypes.Role, "Admin"),
```

### Expected Behavior
Set role values to uppercase `"ADMIN"` to match controller authorization restrictions:
```csharp
new Claim("role", "ADMIN"),
new Claim(ClaimTypes.Role, "ADMIN"),
```

### Tasks Checklist
- [x] Update role claims to `"ADMIN"` in `AdminAuthService.cs`.
- [x] Test request validation on `[Authorize(Roles = "ADMIN")]` decorated endpoints.

### Suggested Labels
`backend` | `bug` | `security`

---

## 📑 BUG ISSUE #3: [Backend] Missing ServiceName in Customer Detail Booking History

### Title
`fix(api): populate ServiceName in GET /api/admin/customers/{id} booking history`

### Description
When retrieving customer details via `GET /api/admin/customers/{id}`, the returned booking history list contains a `Service` property with empty values because the backend service (`AdminCustomerService.cs`) does not include the service details or map `ServiceName` to the `BookingResponseDto` projection list.

### Current Code (Buggy)
Inside `AdminCustomerService.cs`:
```csharp
BookingHistory = customer.Bookings
    .OrderByDescending(b => b.ScheduledTime)
    .Select(b => new BookingResponseDto
    {
        BookingId = b.BookingID,
        LicensePlate = b.LicensePlate,
        ScheduledTime = b.ScheduledTime,
        Status = b.Status.ToString(),
        FinalAmount = b.FinalAmount,
        PointsEarned = b.PointsEarned
    }).ToList()
```
*Note: The `Booking` model in the domain layer lacks a direct EF Core navigation property to the `Service` entity, having only `ServiceID`.*

### Expected Behavior
Perform a dictionary lookup of services in `AdminCustomerService.cs` and map them to `ServiceResponse` inside `BookingResponseDto`:
```csharp
var bookings = customer.Bookings.OrderByDescending(b => b.ScheduledTime).ToList();
var serviceIds = bookings.Select(b => b.ServiceID).Distinct().ToList();
var services = await _context.Services
    .Where(s => serviceIds.Contains(s.ServiceID))
    .ToDictionaryAsync(s => s.ServiceID, s => s.ServiceName);
```

### Tasks Checklist
- [x] Implement database fetch for corresponding services in `GetCustomerByIdAsync`.
- [x] Construct dictionary mapping `ServiceID` to `ServiceName`.
- [x] Map `ServiceResponse` inside the `BookingHistory` list projection.

### Suggested Labels
`backend` | `bug` | `reporting`
