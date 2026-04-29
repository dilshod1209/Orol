# Security Specification - Orol Eco

## Data Invariants
1. **Flora/Fauna/History**: Must have a valid name/title and description. Only admins can create/update/delete. Everyone can read.
2. **Feedback**: 
   - Anyone can create (submit) a feedback.
   - Only admins can list, update, or delete feedback.
   - Status must be one of: 'pending', 'reviewed', 'resolved'.
   - `email` must be a valid format.
3. **Admin Access**: Only users in the `admins` collection can perform administrative actions.

## The "Dirty Dozen" Payloads (Failed Attempts)

1. **Fauna Spoofing**: Regular user tries to create a new animal.
2. **Feedback Hijacking**: Regular user tries to read all feedback.
3. **Feedback Update**: Regular user tries to change their feedback status to 'resolved'.
4. **Invalid Feedback Status**: Admin tries to set status to 'spam' (not in enum).
5. **Flora Shadow Field**: Admin tries to add `isSecret: true` to a flora document (strict schema).
6. **No Name Flora**: Creating flora without a name.
7. **Identity Spoofing**: User tries to submit feedback with someone else's UID (if we tracked UIDs for feedback, but here it's public submission).
8. **Resource Poisoning**: Submitting 1MB string message in feedback.
9. **Admin Self-Promotion**: User tries to create a document in `admins` collection.
10. **History Deletion**: Regular user tries to delete a history entry.
11. **PII Leak**: Regular user tries to get a specific feedback document by ID (should be restricted to admins).
12. **Orphaned Flora**: Creating flora with an invalid ID format.

## Test Runner (Logic Check)
The tests will verify that:
- `get` on `feedback/{id}` returns `PERMISSION_DENIED` for non-signed-in users.
- `list` on `feedback` returns `PERMISSION_DENIED` for non-admin users.
- `create` on `flora` returns `PERMISSION_DENIED` for non-admin users.
- `create` on `feedback` works for everyone if the payload is valid.
